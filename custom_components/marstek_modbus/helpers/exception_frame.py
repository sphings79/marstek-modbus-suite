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

  * Two methods are reproduced from tmodbus 0.6.2, each with one line changed:
    `data_received`, where the frame is measured, and `open()`, which names
    the protocol class inside a lambda and so offers nothing to override.
  * `ModbusTcpProtocol` is not in `tmodbus.transport.async_tcp.__all__`, and
    `_ModbusMessage`, `log_raw_traffic` and `MODBUS_TCP_MAX_LENGTH` are module
    internals. None of them promise stability, so `manifest.json` pins the
    tmodbus minor version and `scripts/check_exception_frame.py` guards the
    assumptions - including whether the library still needs this at all.
  * Correcting only what the parser left stuck in the buffer would have been
    a third of the code and was tried first. It is wrong: when the rejection
    and the reply after it arrive in one segment, the parser satisfies the
    oversized length out of the next frame's bytes and destroys both before
    anything downstream can intervene. The measurement has to be corrected
    where it happens.
  * Patching the library at module level would have been shorter and is not
    done on purpose: Home Assistant runs every integration in one process, and
    that would change framing for anything else using tmodbus.

The correction is transparent to a device that declares the length correctly,
so it stays valid if Marstek ever fixes the firmware.
"""

from __future__ import annotations

import asyncio
import logging
import struct
from collections.abc import Awaitable, Callable
from typing import Any

from tmodbus.client import AsyncModbusClient
from tmodbus.const import EXCEPTION_RESPONSE_BIT
from tmodbus.exceptions import ModbusConnectionError
from tmodbus.transport import AsyncSmartTransport, AsyncTcpTransport
from tmodbus.transport.async_tcp import (
    MODBUS_TCP_MAX_LENGTH,
    ModbusTcpProtocol,
    _ModbusMessage,
    log_raw_traffic,
)

_LOGGER = logging.getLogger(__name__)

# Bytes an exception frame carries after the MBAP length field: unit id,
# function code, exception code.
EXCEPTION_FRAME_LENGTH = 3

# Smallest complete exception frame: 6 byte MBAP + the three above.
EXCEPTION_FRAME_SIZE = 9

MBAP_PROTOCOL_ID = b"\x00\x00"


class ExceptionFrameProtocol(ModbusTcpProtocol):
    """Protocol that frames an exception reply by its size, not by the header.

    `data_received` is reproduced from tmodbus 0.6.2 with one change, marked
    below. A first attempt only corrected what the upstream parser had left
    stuck in the buffer, which was shorter but wrong: when the rejection and
    the reply after it arrive in the same segment, the parser can satisfy the
    oversized length out of the next frame's bytes and take both apart before
    anything downstream gets a say. The correction has to happen while the
    frame is being measured, which means owning the loop.
    """

    def data_received(self, data: bytes) -> None:
        """Handle data received event."""
        self._buffer.extend(data)
        log_raw_traffic("recv", data)

        first_message_incomplete = False
        # Check if we have enough data for MBAP header
        while (
            len(self._buffer) >= 7  # MBAP header is 7 bytes
            and not first_message_incomplete  # stop when the first message in the buffer is not complete yet
        ):
            # Unpack MBAP header
            transaction_id, protocol_id, length, unit_id = struct.unpack_from(">HHHB", self._buffer)

            # Do some sanity checks on the header: can it be the start of a valid message?
            # A valid MBAP header has protocol id 0x0000 and a length within the Modbus TCP
            # bounds. An out-of-range length is just as much a sign of a misaligned buffer as
            # a bad protocol id, and trusting it would stall the parser forever waiting for
            # bytes that never come, so resync in that case too.
            if protocol_id != 0x0000 or not (1 <= length <= MODBUS_TCP_MAX_LENGTH):
                discard_count = self._resync_discard_count()
                _LOGGER.debug("Discarding garbage bytes: %s", self._buffer[:discard_count].hex(" ").upper())
                del self._buffer[:discard_count]
                continue  # Re-evaluate the buffer from the start

            # we have a valid protocol ID, now check if we have the full message

            total_length = 7 + (length - 1)  # Total length = MBAP header + PDU length

            # --- the one change against tmodbus 0.6.2 -------------------------
            # An exception PDU is two bytes, the function code with bit 7 set
            # and the exception code, so its frame is nine bytes whatever the
            # header claims. The Marstek firmware claims ten. Measuring it by
            # the header leaves the parser waiting for a byte that is never
            # sent, or - when the next reply is already here - taking that
            # byte out of the following frame and destroying both.
            if len(self._buffer) > 7 and self._buffer[7] & EXCEPTION_RESPONSE_BIT:
                total_length = EXCEPTION_FRAME_SIZE
            # ------------------------------------------------------------------

            if len(self._buffer) >= total_length:
                # Extract complete response
                response = bytes(self._buffer[:total_length])
                del self._buffer[:total_length]

                # Match response to pending request
                future = self._pending_requests.get(transaction_id)
                if future and not future.done():
                    future.set_result(
                        _ModbusMessage(
                            transaction_id=transaction_id,
                            protocol_id=protocol_id,
                            length=length,
                            unit_id=unit_id,
                            pdu_bytes=response[7:],  # PDU starts after MBAP header
                        )
                    )
                else:
                    _LOGGER.warning(
                        "Received unexpected response with Transaction ID: %d. Discarding bytes: %s",
                        transaction_id,
                        response.hex(" ").upper(),
                    )
            else:
                first_message_incomplete = True


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
