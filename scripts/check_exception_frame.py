#!/usr/bin/env python3
"""Check the exception-frame transport, and the assumptions it rests on.

The transport in `helpers/exception_frame.py` reaches into tmodbus internals:
`ModbusTcpProtocol` is not exported, and `AsyncTcpTransport.open()` had to be
restated because it names that class inside a lambda. Nothing warns us if a
tmodbus release moves the ground under that, so this script does.

It runs against a fake device on localhost. No hardware, no network, no
Home Assistant - safe to run at any time.

    python3 scripts/check_exception_frame.py

Exit code 0 when every check passes, 1 otherwise. The guard checks fail on
purpose when tmodbus changes, including when it stops needing this at all.
"""

from __future__ import annotations

import asyncio
import struct
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from custom_components.marstek_modbus.helpers.exception_frame import (  # noqa: E402
    EXCEPTION_FRAME_SIZE,
    ExceptionFrameProtocol,
    ExceptionFrameTcpTransport,
    create_exception_frame_tcp_client,
)
from tmodbus.transport.async_tcp import AsyncTcpTransport, ModbusTcpProtocol  # noqa: E402

IMPLEMENTED = set(range(30200, 30204))

results: list[tuple[str, bool, str]] = []


def check(label: str, ok: bool, detail: str = "") -> None:
    results.append((label, bool(ok), detail))
    print(f"  {'PASS' if ok else 'FAIL'}  {label}" + (f"  -- {detail}" if detail else ""), flush=True)


# ---------------------------------------------------------------------------
# A fake Venus D, in the three frame shapes a device could plausibly send
# ---------------------------------------------------------------------------

def exception_frame(tid: int, unit: int, function_code: int, code: int, variant: str) -> bytes:
    """Build an exception reply. `short` is what the Venus D actually sends."""
    declared = {"short": 4, "correct": 3, "padded": 4}[variant]
    frame = struct.pack(">HHHBBB", tid, 0, declared, unit, function_code | 0x80, code)
    return frame + b"\x00" if variant == "padded" else frame


def make_device(variant: str, *, coalesce: bool = False):
    """A device that rejects anything outside IMPLEMENTED.

    With `coalesce` it answers two pipelined requests in a single write, which
    puts the rejection and the reply after it into one TCP segment - the case
    where a naive fix-up would take the following frame apart.
    """

    class Device(asyncio.Protocol):
        def connection_made(self, transport: asyncio.BaseTransport) -> None:
            self.transport = transport
            self.buffer = b""
            self.queued: list[bytes] = []

        def data_received(self, data: bytes) -> None:
            self.buffer += data
            replies: list[bytes] = []
            while len(self.buffer) >= 12:
                tid, _pid, _len, unit, fc, start, qty = struct.unpack(">HHHBBHH", self.buffer[:12])
                self.buffer = self.buffer[12:]
                if set(range(start, start + qty)) <= IMPLEMENTED:
                    payload = b"".join(struct.pack(">H", 0x1000 + a) for a in range(start, start + qty))
                    replies.append(
                        struct.pack(">HHHBBB", tid, 0, 3 + len(payload), unit, fc, len(payload)) + payload
                    )
                else:
                    replies.append(exception_frame(tid, unit, fc, 2, variant))
            if not replies:
                return
            if coalesce:
                self.queued.extend(replies)
                if len(self.queued) >= 2:
                    self.transport.write(b"".join(self.queued))
                    self.queued.clear()
            else:
                for reply in replies:
                    self.transport.write(reply)

    return Device


async def serve(variant: str, *, coalesce: bool = False):
    loop = asyncio.get_running_loop()
    server = await loop.create_server(make_device(variant, coalesce=coalesce), "127.0.0.1", 0)
    return server, server.sockets[0].getsockname()[1]


# ---------------------------------------------------------------------------
# Guards on the tmodbus internals this depends on
# ---------------------------------------------------------------------------

async def guard_checks() -> None:
    print("Annahmen über tmodbus:")

    protocol = ModbusTcpProtocol(on_connection_lost=lambda _exc: None, timeout=1.0)
    protocol.connection_made(asyncio.Transport())
    buffer = getattr(protocol, "_buffer", None)
    check(
        "ModbusTcpProtocol hält seinen Puffer weiterhin in `_buffer` (bytearray)",
        isinstance(buffer, bytearray),
        type(buffer).__name__,
    )

    check(
        "ExceptionFrameProtocol leitet sich noch von ModbusTcpProtocol ab",
        issubclass(ExceptionFrameProtocol, ModbusTcpProtocol),
    )
    check(
        "ExceptionFrameTcpTransport leitet sich noch von AsyncTcpTransport ab",
        issubclass(ExceptionFrameTcpTransport, AsyncTcpTransport),
    )

    # If upstream ever frames an exception by its fixed size itself, this
    # workaround is dead weight and should be removed rather than carried.
    stock = ModbusTcpProtocol(on_connection_lost=lambda _exc: None, timeout=1.0)
    stock.connection_made(asyncio.Transport())
    future: asyncio.Future = asyncio.get_running_loop().create_future()
    stock._pending_requests[1] = future  # noqa: SLF001
    stock.data_received(exception_frame(1, 1, 3, 2, "short"))
    await asyncio.sleep(0.01)
    check(
        "unverändertes tmodbus bleibt am kurzen Frame hängen (sonst ist dieser Umweg überflüssig)",
        not future.done(),
        "upstream liefert ihn inzwischen selbst" if future.done() else "",
    )


# ---------------------------------------------------------------------------
# Behaviour, through a real client against the fake device
# ---------------------------------------------------------------------------

async def behaviour_checks(variant: str, *, coalesce: bool = False) -> None:
    label = f"{variant}{', ein Segment' if coalesce else ''}"
    print(f"\nVerhalten gegen eine Firmware vom Typ »{label}«:")

    server, port = await serve(variant, coalesce=coalesce)
    client = create_exception_frame_tcp_client(
        "127.0.0.1",
        port,
        unit_id=1,
        timeout=2.0,
        connect_timeout=2.0,
        auto_reconnect=False,
        retry_on_device_busy=False,
    )
    try:
        await client.connect()

        registers = await client.read_holding_registers(start_address=30200, quantity=4)
        check("belegtes Register gelesen", registers == [0x1000 + a for a in range(30200, 30204)], str(registers))

        rejected: object = None
        try:
            await client.read_holding_registers(start_address=39000, quantity=1)
        except Exception as err:  # noqa: BLE001
            rejected = err
        check(
            "unbelegtes Register wird abgelehnt statt still zu verhungern",
            rejected is not None and "timeout" not in type(rejected).__name__.lower(),
            f"{type(rejected).__name__}: {rejected}",
        )

        again = await client.read_holding_registers(start_address=30200, quantity=4)
        check("Folgeread auf derselben Verbindung intakt", again == registers, str(again))
    finally:
        await client.disconnect()
        server.close()
        await server.wait_closed()


async def main() -> int:
    check("EXCEPTION_FRAME_SIZE ist 9", EXCEPTION_FRAME_SIZE == 9, str(EXCEPTION_FRAME_SIZE))
    await guard_checks()
    for variant in ("short", "correct", "padded"):
        await behaviour_checks(variant)
    await behaviour_checks("short", coalesce=True)

    failed = [label for label, ok, _ in results if not ok]
    print(f"\n{len(results) - len(failed)}/{len(results)} bestanden")
    if failed:
        print("Fehlgeschlagen:")
        for label in failed:
            print(f"  - {label}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
