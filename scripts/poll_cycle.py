#!/usr/bin/env python3
"""What a poll cycle costs: predicted from the register maps, or measured.

The numbers behind `DEFAULT_MAX_READ_GAP` and `MIN_SCAN_INTERVALS` in
`const.py` came from here. They are the kind of number that quietly goes stale
- a register moved between polling groups, a map that grows, a firmware that
starts serving a gap it used to refuse - so the tool that produced them lives
next to them rather than in somebody's scratch directory.

Two modes.

Without `--host` nothing touches the network. The script rebuilds the block
layout exactly as `MarstekCoordinator._build_contiguous_read_groups` does and
counts the requests each tick would issue:

    python3 scripts/poll_cycle.py
    python3 scripts/poll_cycle.py --model d --gaps 2,3,4 --scope all

With `--host` it runs those requests against a real battery and times them:

    python3 scripts/poll_cycle.py --host 192.168.1.50

Read that mode's caveats before using it:

  * **A Venus accepts one Modbus connection.** Whatever normally polls it -
    Home Assistant, a proxy, a second integration - has to be stopped first,
    or this measures a socket it cannot get and the device looks dead.
  * **Point it at the device, not at a proxy.** A proxy answers faster than
    the battery and hides the firmware's malformed exception frames, which is
    exactly how the 150 ms per request this file once quoted came about. It is
    65 ms at the device.
  * Nothing is written. Every request is FC03.

The exception frames are read the way `helpers/exception_frame.py` reads them,
because a client that trusts the device's length field waits for a byte that
never arrives and turns a 6 ms refusal into a full timeout.
"""

from __future__ import annotations

import argparse
import select
import socket
import struct
import sys
import time
from collections import Counter
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
REGISTERS = ROOT / "custom_components" / "marstek_modbus" / "registers"

MODELS = ("a", "d", "e_v3", "e_v12")
GROUPS = ("high", "low", "ultra")

# coordinator._build_contiguous_read_groups stops a block here.
MAX_BLOCK_SPAN = 125
# The pacing the integration puts between requests (CONF_MESSAGE_WAIT_MS).
DEFAULT_WAIT_MS = 80


# --------------------------------------------------------------------------
# The register maps
# --------------------------------------------------------------------------


def register_span(entry: dict) -> int:
    """Registers one definition needs - coordinator._definition_register_count."""
    if entry.get("count") is not None:
        return int(entry["count"])
    data_type = entry.get("data_type", "uint16")
    if data_type in {"int32", "uint32", "ipv4"}:
        return 2
    if data_type == "schedule":
        return 5
    return 1


def load(model: str, scope: str) -> list[dict]:
    """Every register the coordinator would poll, as it sees them.

    `scope` is "default" for the entities that exist without the user turning
    anything on, or "all" for everything except the DEV groups. A disabled
    entity that another sensor depends on is polled anyway, so dependencies are
    pulled back in - leaving them out understates the default scope by a dozen
    registers.
    """
    data = yaml.safe_load((REGISTERS / f"{model}.yaml").read_text()) or {}
    definitions: list[dict] = []
    dependencies: set[str] = set()

    for section, body in data.items():
        if not isinstance(body, dict) or section == "MISSING" or section.startswith("DEV"):
            continue
        for key, entry in body.items():
            if not isinstance(entry, dict):
                continue
            dependencies.update((entry.get("dependency_keys") or {}).values())
            if "register" not in entry:
                continue
            definitions.append({
                "key": key,
                "register": int(entry["register"]),
                "span": register_span(entry),
                "group": entry.get("scan_interval", "high"),
                "enabled": entry.get("enabled_by_default") is not False,
            })

    for definition in definitions:
        if definition["key"] in dependencies:
            definition["enabled"] = True

    if scope == "default":
        return [d for d in definitions if d["enabled"]]
    return definitions


# --------------------------------------------------------------------------
# The block layout
# --------------------------------------------------------------------------


def build_blocks(sensors: list[dict], max_gap: int, refused=()) -> list[list[dict]]:
    """Group definitions into blocks the way the coordinator does.

    Blocks are cut from every *enabled* register, not from the ones due this
    tick - which is why moving a reading to a slower group never changes the
    layout, only which blocks come due.

    `refused` are gaps the device has turned down, as (left, right) pairs. The
    coordinator learns these at runtime and stores them per firmware; passing
    them here reproduces its steady state rather than its first cycle.
    """
    ordered = sorted(sensors, key=lambda s: s["register"])
    blocks: list[list[dict]] = []
    current: list[dict] = []
    end: int | None = None

    for sensor in ordered:
        sensor_end = sensor["register"] + sensor["span"] - 1
        if not current:
            current, end = [sensor], sensor_end
            continue

        gap = sensor["register"] - end - 1
        blacklisted = any(
            left <= end and sensor["register"] <= right for left, right in refused
        )
        bridgeable = gap <= 0 or (gap <= max_gap and not blacklisted)
        if bridgeable and sensor_end - current[0]["register"] < MAX_BLOCK_SPAN:
            current.append(sensor)
            end = max(end, sensor_end)
            continue

        blocks.append(current)
        current, end = [sensor], sensor_end

    if current:
        blocks.append(current)
    return blocks


def requests_for(blocks: list[list[dict]], due: set[str]) -> list[tuple[int, int]]:
    """The (start, count) reads a tick issues.

    A block is read when at least one register in it is due, and the read spans
    from the first due register to the last - not the whole block.
    """
    plan = []
    for block in blocks:
        due_here = [s for s in block if s["group"] in due]
        if not due_here:
            continue
        low = min(s["register"] for s in due_here)
        high = max(s["register"] + s["span"] - 1 for s in due_here)
        plan.append((low, high - low + 1))
    return plan


# --------------------------------------------------------------------------
# Talking to a device
# --------------------------------------------------------------------------


class Device:
    """One Modbus TCP connection, rebuilt when the device drops it."""

    def __init__(self, host: str, port: int = 502, unit: int = 1, timeout: float = 6.0):
        self.host, self.port, self.unit, self.timeout = host, port, unit, timeout
        self.sock: socket.socket | None = None
        self.transaction = 0
        self.reconnects = 0

    def connect(self) -> None:
        if self.sock is not None:
            try:
                self.sock.close()
            except OSError:
                pass
        self.sock = socket.create_connection((self.host, self.port), timeout=self.timeout)
        self.sock.settimeout(self.timeout)

    def _drop(self) -> None:
        self.reconnects += 1
        self.connect()

    def read(self, register: int, count: int) -> tuple[bool, float, str]:
        """Read a block. Returns (ok, seconds, why not)."""
        if self.sock is None:
            self.connect()
        self.transaction = (self.transaction + 1) % 0xFFFF
        pdu = struct.pack(">BBHH", self.unit, 0x03, register, count)
        request = struct.pack(">HHH", self.transaction, 0, len(pdu)) + pdu

        started = time.perf_counter()
        try:
            self.sock.sendall(request)
            reply = b""
            deadline = time.time() + self.timeout
            while True:
                if time.time() > deadline:
                    self._drop()
                    return False, time.perf_counter() - started, "timeout"
                if not select.select([self.sock], [], [], 1.0)[0]:
                    continue
                chunk = self.sock.recv(1024)
                if not chunk:
                    self._drop()
                    return False, time.perf_counter() - started, "closed"
                reply += chunk
                # An exception PDU is two bytes, so the declared length is not
                # needed to read one - and this firmware declares it one too
                # high. Same correction helpers/exception_frame.py makes.
                if len(reply) >= 9 and reply[7] & 0x80:
                    self._drop()
                    return (
                        False,
                        time.perf_counter() - started,
                        f"exception 0x{reply[8]:02x}",
                    )
                if len(reply) >= 6 and len(reply) >= 6 + struct.unpack(">H", reply[4:6])[0]:
                    break
            return True, time.perf_counter() - started, ""
        except OSError as err:
            self._drop()
            return False, time.perf_counter() - started, type(err).__name__


def measure(device: Device, plan: list[tuple[int, int]], wait_ms: int) -> dict:
    """Run one tick's worth of requests and time it."""
    started = time.perf_counter()
    on_the_wire = 0.0
    failures: dict[str, list[int]] = {}

    for register, count in plan:
        ok, seconds, why = device.read(register, count)
        on_the_wire += seconds
        if not ok:
            failures.setdefault(why, []).append(register)
        time.sleep(wait_ms / 1000)

    return {
        "requests": len(plan),
        "wall": time.perf_counter() - started,
        "net": on_the_wire,
        "failures": failures,
    }


# --------------------------------------------------------------------------


TICKS = (
    ("fast", {"high"}),
    ("fast + slow", {"high", "low"}),
    ("full round", {"high", "low", "ultra"}),
)


def parse_refused(text: str) -> list[tuple[int, int]]:
    """"30006-30010,35001-35010" -> [(30006, 30010), (35001, 35010)]"""
    pairs = []
    for part in filter(None, (p.strip() for p in text.split(","))):
        left, _, right = part.partition("-")
        pairs.append((int(left), int(right)))
    return pairs


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Predict or measure what one poll cycle costs.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Without --host nothing touches the network.",
    )
    parser.add_argument("--model", choices=MODELS, default="d")
    parser.add_argument("--scope", choices=("default", "all"), default="default",
                        help="'default' = entities that exist without being switched on")
    parser.add_argument("--gaps", default="2,3,4",
                        help="block read gaps to compare, comma separated")
    parser.add_argument("--refused", default="",
                        help="gaps the device is known to turn down, e.g. 30006-30010")
    parser.add_argument("--host", help="measure against this device (see the caveats)")
    parser.add_argument("--port", type=int, default=502)
    parser.add_argument("--unit", type=int, default=1)
    parser.add_argument("--wait-ms", type=int, default=DEFAULT_WAIT_MS,
                        help="pacing between requests, as the integration uses it")
    args = parser.parse_args()

    sensors = load(args.model, args.scope)
    gaps = [int(g) for g in args.gaps.split(",")]
    refused = parse_refused(args.refused)

    counts = Counter(s["group"] for s in sensors)
    print(f"Venus {args.model.upper()}, scope '{args.scope}': {len(sensors)} registers "
          + ", ".join(f"{g}={counts[g]}" for g in GROUPS))
    if refused:
        print("known refused gaps: "
              + ", ".join(f"{left}-{right}" for left, right in refused))
    print()

    device = None
    if args.host:
        device = Device(args.host, args.port, args.unit)
        try:
            device.connect()
        except OSError as err:
            print(f"cannot reach {args.host}:{args.port} - {err}", file=sys.stderr)
            return 1
        # One throwaway read so the connection setup is not charged to the
        # first measurement.
        device.read(sensors[0]["register"], 1)
        time.sleep(0.3)

    for gap in gaps:
        blocks = build_blocks(sensors, gap, refused)
        print(f"gap={gap}")
        for label, due in TICKS:
            plan = requests_for(blocks, due)
            if not plan:
                continue
            if device is None:
                registers = sum(count for _, count in plan)
                print(f"  {label:14s} {len(plan):3d} requests  {registers:4d} registers")
                continue
            result = measure(device, plan, args.wait_ms)
            note = ""
            if result["failures"]:
                note = "  [" + ", ".join(
                    f"{why} @{where[0]}" for why, where in result["failures"].items()
                ) + "]"
            print(f"  {label:14s} {result['requests']:3d} requests  "
                  f"{result['wall']:5.2f}s wall  {result['net']:5.2f}s on the wire  "
                  f"{result['net'] / result['requests'] * 1000:5.1f} ms each{note}")
            time.sleep(0.4)
        print()

    if device is not None:
        issued = sum(
            len(requests_for(build_blocks(sensors, gap, refused), due))
            for gap in gaps
            for _, due in TICKS
        )
        if device.reconnects:
            print(f"connection rebuilt {device.reconnects}x")
        # A healthy run rebuilds the connection once per refused gap and no
        # more. Anything near one per request means the session keeps being
        # taken away - almost always something else polling the same battery,
        # which is the one condition that makes these timings meaningless.
        if issued and device.reconnects > issued / 4:
            print(
                "\nThat is too many to measure through. Something else is very "
                "likely holding\nthe battery's single Modbus session - stop it, "
                "and point this at the device\nrather than at a proxy.",
                file=sys.stderr,
            )
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
