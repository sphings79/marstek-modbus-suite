"""A tmodbus TCP transport that survives exception replies with a wrong length.

A Modbus exception PDU is always two bytes: the function code with bit 7 set,
followed by the exception code. The MBAP length field is therefore not needed
to read one, and the Marstek firmware gets it wrong.

A Venus D on Control/EMS v150 answers a read of an unimplemented register with
nine bytes whose length field reads 4 where the protocol requires 3, captured
straight off the device:

    18 58 00 00 00 04 01 83 03    register 39000 -> exception 3
    1F C8 00 00 00 04 01 83 02    register 45000 -> exception 2

tmodbus frames a reply as `7 + (length - 1)`, so it waits for a tenth byte the
device never sends. The read times out against a device that answered in about
100 ms, and the nine bytes stay in the receive buffer: the next reply donates
its first byte to them, both frames are discarded as an unmatched transaction
id, and the parser resynchronises. One unimplemented register therefore costs
two failed reads, measured at 6.1 s with a 3 s timeout.

The library declines to carry this - the reasoning being that a client should
not accumulate workarounds for devices with a broken implementation, and that
swapping the transport is the supported way to handle one. That is what this
module does.

Scope of the coupling, so the next person knows what they are looking at:

  * `ModbusTcpProtocol` is not in `tmodbus.transport.async_tcp.__all__`. It is
    importable but carries no stability promise, so `manifest.json` pins the
    tmodbus minor version and `tests/` has a guard that fails loudly if the
    upstream framing changes underneath this.
  * `AsyncTcpTransport.open()` names the protocol class inside a lambda, so
    there is no seam to hook and the method has to be restated here. It is
    reproduced from tmodbus 0.6.2 with one line changed.
  * Patching the library at module level would have been shorter and is not
    done on purpose: Home Assistant runs every integration in one process, and
    that would change framing for anything else using tmodbus.

The correction is transparent to a device that declares the length correctly,
so it stays valid if Marstek ever fixes the firmware.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Awaitable, Callable
from typing import Any

from tmodbus.client import AsyncModbusClient
from tmodbus.exceptions import ModbusConnectionError
from tmodbus.transport import AsyncSmartTransport, AsyncTcpTransport
from tmodbus.transport.async_tcp import ModbusTcpProtocol

_LOGGER = logging.getLogger(__name__)

# Bytes an exception frame carries after the MBAP length field: unit id,
# function code, exception code.
EXCEPTION_FRAME_LENGTH = 3

# Smallest complete exception frame: 6 byte MBAP + the three above.
EXCEPTION_FRAME_SIZE = 9

MBAP_PROTOCOL_ID = b"\x00\x00"


class ExceptionFrameProtocol(ModbusTcpProtocol):
    """Protocol that reframes an exception reply whose declared length is wrong.

    Rather than restating the upstream parser, this lets it run first and then
    looks at what it left behind. An exception frame that the parser could not
    complete stays at the head of the buffer, because it is waiting for bytes
    the device already decided not to send. That is recognisable without
    guessing: a Modbus TCP header, the exception bit set on the function code,
    and a declared length larger than the three bytes an exception can hold.

    Its length field is then corrected and the parser is run again over the
    unchanged buffer, so the frame is delivered by the library's own code path
    with its own transaction matching. Nothing else is touched.
    """

    def data_received(self, data: bytes) -> None:
        """Feed the upstream parser, then release anything it got stuck on."""
        super().data_received(data)
        self._release_stuck_exception_frames()

    def _release_stuck_exception_frames(self) -> None:
        buffer = getattr(self, "_buffer", None)
        if buffer is None:
            return

        while self._head_is_undersized_exception(buffer):
            declared = int.from_bytes(buffer[4:6], "big")
            buffer[4:6] = EXCEPTION_FRAME_LENGTH.to_bytes(2, "big")
            _LOGGER.debug(
                "Exception frame declared %d bytes after the length field, reading 3",
                declared,
            )

            before = len(buffer)
            # Re-run the parser over the corrected buffer. Nothing is appended;
            # the frame is delivered through the library's normal path.
            super().data_received(b"")
            if len(buffer) >= before:
                # The parser did not take it after all. Stop rather than spin,
                # and leave the bytes for the resync to deal with.
                _LOGGER.debug("Corrected exception frame was not consumed, leaving it")
                return

    @staticmethod
    def _head_is_undersized_exception(buffer: bytearray) -> bool:
        """Is a complete exception frame stuck at the head of the buffer?"""
        if len(buffer) < EXCEPTION_FRAME_SIZE:
            return False
        if bytes(buffer[2:4]) != MBAP_PROTOCOL_ID:
            # Not a Modbus TCP header - the buffer is misaligned and the
            # upstream resync owns this case.
            return False
        if not buffer[7] & 0x80:
            return False
        return int.from_bytes(buffer[4:6], "big") > EXCEPTION_FRAME_LENGTH


class ExceptionFrameTcpTransport(AsyncTcpTransport):
    """TCP transport that connects with `ExceptionFrameProtocol`.

    `open()` is reproduced from tmodbus 0.6.2 because the upstream method names
    the protocol class inside the lambda it passes to `create_connection`,
    leaving nothing to override. Only that name differs here.
    """

    async def open(self) -> None:
        """Async establish TCP connection."""
        loop = asyncio.get_running_loop()
        if self.is_open():
            _LOGGER.debug("Async TCP connection already open: %s:%d", self.host, self.port)
            return

        try:
            self._transport, self._protocol = await asyncio.wait_for(
                loop.create_connection(
                    lambda: ExceptionFrameProtocol(
                        on_connection_lost=self._on_connection_lost,
                        timeout=self.timeout,
                    ),
                    host=self.host,
                    port=self.port,
                    **self.connection_kwargs,
                ),
                timeout=self.connect_timeout,
            )
            _LOGGER.info("Async TCP connection established: %s:%d", self.host, self.port)
        except TimeoutError:
            _LOGGER.debug("Async TCP connection timeout: %s:%d", self.host, self.port, exc_info=True)
            raise
        except Exception as err:
            _LOGGER.debug("Async TCP connection error: %s:%d", self.host, self.port, exc_info=True)
            raise ModbusConnectionError from err


def create_exception_frame_tcp_client(  # noqa: PLR0913
    host: str,
    port: int = 502,
    *,
    unit_id: int,
    timeout: float = 10.0,
    connect_timeout: float = 10.0,
    wait_between_requests: float = 0.0,
    wait_after_connect: float = 0.0,
    auto_reconnect: bool = True,
    on_reconnected: Callable[[], Awaitable[None] | None] | None = None,
    on_connection_lost: Callable[[Exception | None], None] | None = None,
    retry_on_device_busy: bool = True,
    retry_on_device_failure: bool = False,
    **connection_kwargs: Any,
) -> AsyncModbusClient:
    """Build a tmodbus client that tolerates the Marstek exception frame.

    Mirrors `tmodbus.create_async_tcp_client`, with the TCP transport swapped
    for one that connects using `ExceptionFrameProtocol`. The surrounding
    `AsyncSmartTransport` and `AsyncModbusClient` are the library's own, so
    pacing, reconnect policy and retry strategy behave exactly as before.
    """
    smart_transport = AsyncSmartTransport(
        ExceptionFrameTcpTransport(
            host,
            port,
            timeout=timeout,
            connect_timeout=connect_timeout,
            **connection_kwargs,
        ),
        wait_between_requests=wait_between_requests,
        wait_after_connect=wait_after_connect,
        auto_reconnect=auto_reconnect,
        on_reconnected=on_reconnected,
        on_connection_lost=on_connection_lost,
        retry_on_device_busy=retry_on_device_busy,
        retry_on_device_failure=retry_on_device_failure,
    )
    return AsyncModbusClient(smart_transport, unit_id=unit_id)
