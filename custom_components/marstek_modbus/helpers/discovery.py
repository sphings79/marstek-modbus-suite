"""Finding Marstek batteries by the beacon they broadcast.

A Venus announces itself on the local network once a second, unprompted:

    192.168.1.50:22222 -> 192.168.1.255:12345   UDP, 50 bytes
    \\x01\\x02 50|VNSD-0|aabbccddeeff|HME-3|000000000000|0|0 \\x03 46

Fields after the framing: a number, the model code, the Bluetooth MAC without
separators, the communication module type, a second MAC (zero on every device
seen so far) and two flags. The model code is the same string register 31000
reports, and the MAC matches the `ble_mac_address` sensor, so a beacon carries
everything the setup dialog needs: where the device is, what it is, and an id
that stays the same when its address changes.

Nothing here talks to the device. Listening is passive, which matters: a Venus
accepts a single Modbus connection at a time, so probing one that is already in
use would report it as unreachable, or take the connection away from whoever
had it.
"""
import asyncio
import logging
import socket
from dataclasses import dataclass

BEACON_PORT = 12345
BEACON_MAX_LEN = 256

# The payload is framed 0x01 0x02 <body> 0x03 <two checksum characters>.
_SOH, _STX, _ETX = 0x01, 0x02, 0x03

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class Beacon:
    """One announcement, already checked."""

    host: str
    model: str
    mac: str
    module: str

    @property
    def formatted_mac(self) -> str:
        """The MAC in the colon-separated form Home Assistant stores."""
        return ":".join(self.mac[i:i + 2] for i in range(0, 12, 2))

    @property
    def key(self) -> str:
        """A stable id for this announcement: which device, and where from.

        Both parts, because the MAC in a beacon belongs to the radio module and
        stays the same whichever interface sends the packet - while only one of
        a device's addresses serves Modbus. Measured on a Venus D: with a cable
        in it announces itself from the wired address, without one from the
        wireless address, and the handover is clean - 538 packets from the one
        and 15 from the other across a five minute window, never both at once.
        So two rows for one battery do not happen today. Keying on the MAC
        alone would quietly keep whichever packet arrived first if a later
        firmware ever changes that, and half the time that is the address with
        no Modbus behind it.
        """
        return f"{self.mac}@{self.host}"


def parse_beacon(data: bytes, host: str) -> Beacon | None:
    """Read one datagram, or None if it is not a Marstek announcement.

    A broadcast port carries whatever else the network puts on it, so every
    step here is a reason to walk away rather than an error worth logging.
    """
    if len(data) < 6 or len(data) > BEACON_MAX_LEN:
        return None
    if data[0] != _SOH or data[1] != _STX:
        return None
    end = data.find(bytes([_ETX]), 2)
    if end < 0:
        return None
    try:
        body = data[2:end].decode("ascii")
    except UnicodeDecodeError:
        return None

    fields = body.split("|")
    # A number, the model, the MAC - anything shorter is not what we are after.
    if len(fields) < 3:
        return None
    model, mac = fields[1].strip(), fields[2].strip().lower()
    module = fields[3].strip() if len(fields) > 3 else ""
    if not model or len(mac) != 12:
        return None
    if any(c not in "0123456789abcdef" for c in mac):
        return None

    return Beacon(host=host, model=model, mac=mac, module=module)


class _BeaconProtocol(asyncio.DatagramProtocol):
    """Collects announcements, keyed so a device at one address counts once."""

    def __init__(self) -> None:
        self.found: dict[str, Beacon] = {}

    def datagram_received(self, data: bytes, addr: tuple) -> None:
        beacon = parse_beacon(data, addr[0])
        if beacon and beacon.key not in self.found:
            _LOGGER.debug(
                "Beacon from %s: model %s, mac %s, module %s",
                beacon.host, beacon.model, beacon.mac, beacon.module,
            )
            self.found[beacon.key] = beacon


async def async_listen(hass, seconds: float = 4.0) -> dict[str, Beacon]:
    """Listen for announcements and return what answered, keyed by Beacon.key.

    Four seconds against a one-second beat leaves room for a dropped packet or
    two. Returns empty rather than raising: the port may be held by something
    else, and a setup dialog that fails because nothing announced itself would
    be worse than one that simply asks for an address.
    """
    loop = asyncio.get_running_loop()
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        # Lets the Marstek app, or a second Home Assistant, keep listening too.
        if hasattr(socket, "SO_REUSEPORT"):
            try:
                sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
            except OSError:
                pass
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        sock.bind(("", BEACON_PORT))
        sock.setblocking(False)
    except OSError as err:
        sock.close()
        _LOGGER.debug("Cannot listen on UDP %d: %s", BEACON_PORT, err)
        return {}

    transport = None
    protocol = _BeaconProtocol()
    try:
        transport, _ = await loop.create_datagram_endpoint(lambda: protocol, sock=sock)
        await asyncio.sleep(seconds)
    except OSError as err:
        _LOGGER.debug("Listening for beacons failed: %s", err)
    finally:
        if transport is not None:
            transport.close()
        else:
            sock.close()

    _LOGGER.debug("Found %d device(s) in %.1fs", len(protocol.found), seconds)
    return protocol.found
