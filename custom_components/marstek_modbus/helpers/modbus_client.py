"""
Helper module for Modbus TCP communication using tmodbus.
Provides an abstraction for reading and writing registers from
a Marstek Venus battery system asynchronously.
"""

from tmodbus.client import AsyncModbusClient
from tmodbus.exceptions import (
    ModbusConnectionError,
    ModbusResponseError,
    TModbusError,
)
import asyncio
import socket
from typing import Optional

import logging

from ..const import DEFAULT_MESSAGE_WAIT_MS, DEFAULT_TIMEOUT, DEFAULT_UNIT_ID
from .exception_frame import create_exception_frame_tcp_client

_LOGGER = logging.getLogger(__name__)

# tmodbus brings two ladders of its own, and both are switched off at the client:
# `auto_reconnect` rebuilds the socket from inside a request, and the response
# retry strategy re-sends against a tenacity policy that stops after 60 seconds.
# Neither can see what this module knows. A reconnect from down there walks
# straight past `hold_closed`, which exists to keep the socket shut while the
# battery is paused, and past the connect backoff that stops a dead device
# turning into a connect storm. With both off, one call into tmodbus is one
# attempt costing at most one timeout — what `request_budget` promises its
# callers, and what `PYMODBUS_RETRIES = 0` used to buy on the old backend.
TMODBUS_AUTO_RECONNECT = False
TMODBUS_RETRY_ON_DEVICE_BUSY = False
TMODBUS_RETRY_ON_DEVICE_FAILURE = False

# The device does not accept a new session the instant the old one goes away.
# Measured on a Venus E v3 (EMS 150), five reconnects in one log, every one the
# same shape: a connect started right after the close was refused after ~110 ms,
# and the retry ~100 ms later then succeeded in ~310 ms. Waiting here turns two
# attempts and two warnings into one attempt that works.
RECONNECT_SETTLE_SEC = 0.3

# When the device stops accepting connections, every read attempt asking for a
# fresh socket turns into a connect storm: measured at 61 attempts in one minute
# against a device answering ECONNREFUSED, which keeps a bridge chip with a small
# socket table saturated and stops it recovering at all. After a failed connect
# the next attempt is held off, doubling from one second up to half a minute,
# and any success clears it.
CONNECT_BACKOFF_BASE_SEC = 1.0
CONNECT_BACKOFF_MAX_SEC = 30.0


class MarstekModbusClient:
    """
    Wrapper for a tmodbus AsyncModbusClient with helper methods
    for async reading/writing and interpreting common data types.
    """

    def __init__(self, host: str, port: int, message_wait_ms: int = DEFAULT_MESSAGE_WAIT_MS, timeout: int = DEFAULT_TIMEOUT, unit_id: int = DEFAULT_UNIT_ID):
        """
        Initialize Modbus client with host, port, message wait time, timeout, and unit ID.

        Args:
            host (str): IP address or hostname of Modbus server.
            port (int): TCP port number.
            message_wait_ms (int): Delay in ms between Modbus messages.
            timeout (int): Connection timeout in seconds (default 3 for faster failure).
            unit_id (int): Modbus Unit ID (slave ID), default is 1.
        """
        self.host = host
        self.port = port

        # Set while the integration has deliberately closed the connection and
        # does not want it back. Every way a connection can come into being runs
        # through the suppression check below, so one gate here holds the socket
        # shut against a read that finds it gone, a failover after a block read,
        # and a half-open recovery alike.
        self.hold_closed = False

        # Set for the duration of one call by a caller that already knows the
        # device is not answering. The failures below then go to debug: a probe
        # that fails while the battery is switched off is the expected outcome,
        # and repeating it in the log once a minute tells nobody anything.
        self.quiet = False

        # Normalize and guard the timeout. The config flow has no timeout field,
        # so entry.data.get("timeout") is None for every entry created through
        # the UI — and tmodbus compares the value against zero when building
        # the transport, so None reaches it as a TypeError at connect time
        # rather than as anything a caller could act on.
        try:
            self.timeout = float(timeout) if timeout is not None else float(DEFAULT_TIMEOUT)
            if self.timeout <= 0:
                raise ValueError
        except (TypeError, ValueError):
            self.timeout = float(DEFAULT_TIMEOUT)

        # Normalize and guard message_wait_ms so it is never None
        self.message_wait_ms = int(message_wait_ms) if message_wait_ms is not None else DEFAULT_MESSAGE_WAIT_MS

        # Precompute seconds sleep to avoid repeated float(None) errors
        try:
            self.message_wait_sec = max(0.0, float(self.message_wait_ms) / 1000.0)
        except (TypeError, ValueError):
            self.message_wait_sec = float(DEFAULT_MESSAGE_WAIT_MS) / 1000.0

        # Normalize and guard unit_id so it is never None. Done before the
        # client is built: tmodbus takes the unit id once, at construction,
        # rather than per request the way the old backend did.
        try:
            self.unit_id = int(unit_id)
        except (TypeError, ValueError):
            self.unit_id = DEFAULT_UNIT_ID

        self.client: AsyncModbusClient | None = self._make_client()

        # Lock to serialize outgoing Modbus requests to avoid transaction id collisions
        self._request_lock = asyncio.Lock()

        # Smart transport state for request pacing and diagnostics
        self.wait_between_requests = self.message_wait_sec
        self._last_request_finished_at: float | None = None
        self._last_request_duration: float | None = None
        # True once a connection has succeeded, so the settle delay before a
        # reconnect is not paid on the very first connect.
        self._connected_once = False

        # Connection state is shared: the poll loop and a write from an
        # automation both reach for it. Without a lock of its own they tear
        # down each other's fresh socket, and a caller can end up holding a
        # client that another coroutine already replaced.
        self._connect_lock = asyncio.Lock()
        # Bumped on every successful connect, so a caller that waited for the
        # lock can tell whether somebody already did the work it queued up for.
        self._connect_generation = 0
        self._connect_failures = 0
        self._connect_blocked_until = 0.0

    def _make_client(self) -> AsyncModbusClient:
        """Build a tmodbus client with this module's retry policy, which is none.

        The pacing gap is kept here rather than handed to
        `wait_between_requests`: `request_budget` has to account for it, and a
        wait the transport applies on its own is one this module cannot see.

        Built through `exception_frame` rather than tmodbus' own factory, so a
        rejected register comes back as the exception the device actually sent
        instead of stalling until the timeout. See that module for why the
        firmware makes this necessary.
        """
        return create_exception_frame_tcp_client(
            self.host,
            self.port,
            unit_id=self.unit_id,
            timeout=self.timeout,
            connect_timeout=self.timeout,
            wait_between_requests=0.0,
            auto_reconnect=TMODBUS_AUTO_RECONNECT,
            retry_on_device_busy=TMODBUS_RETRY_ON_DEVICE_BUSY,
            retry_on_device_failure=TMODBUS_RETRY_ON_DEVICE_FAILURE,
        )

    def _socket(self):
        """Return the socket under the client, or None if there is none yet.

        Reached through the smart transport that the client factory
        wraps around the TCP one; every step is optional so a change in that
        layering costs a debug line rather than a failed connect.
        """
        smart = getattr(self.client, "transport", None)
        base = getattr(smart, "base_transport", None)
        asyncio_transport = getattr(base, "_transport", None)
        if asyncio_transport is None:
            return None
        return asyncio_transport.get_extra_info("socket")

    def _call_cost(self) -> float:
        """Return the worst-case duration of one call into tmodbus.

        One attempt against the client timeout: the retry strategy assembled in
        `_make_client` has no predicate that can fire, so a request is sent
        once and either answers within the timeout or raises.
        """
        return self.timeout

    def request_budget(self, max_retries: int = 3, retry_delay: float = 0.0) -> float:
        """Return how long one read or write call may legitimately take.

        Counts every attempt against the client timeout and, between two
        attempts, the retry delay, the pacing gap and one reconnect — a
        reconnect is a connect and runs against the same timeout.

        Callers guard these calls with their own `asyncio.wait_for`. That guard
        has to sit *above* this value: a guard that fires first cancels a
        transaction the client is still working on, and the request whose
        response never gets read is exactly what leaves the socket half-open.
        """
        attempts = max(1, int(max_retries or 1))
        try:
            delay = max(0.0, float(retry_delay))
        except (TypeError, ValueError):
            delay = 0.0

        per_call = self._call_cost()

        # Between two attempts: the retry delay, the pacing gap, and a reconnect —
        # which is the settle wait plus a connect against the same timeout.
        between_attempts = delay + self.message_wait_sec + RECONNECT_SETTLE_SEC + self.timeout
        return attempts * per_call + (attempts - 1) * between_attempts

    async def _async_wait_for_request_slot(self) -> None:
        """Keep at least `message_wait_ms` between two Modbus transactions.

        The gap is measured from the end of the previous request, so a single
        wait per transaction is enough — an extra sleep after the response
        would only double the pause without giving the device more time.
        """
        if self.wait_between_requests <= 0 or self._last_request_finished_at is None:
            return
        wait_time = self.wait_between_requests - (
            asyncio.get_running_loop().time() - self._last_request_finished_at
        )
        if wait_time > 0:
            await asyncio.sleep(wait_time)

    def _mark_request_finished(self, request_start: float | None = None) -> None:
        """Record when the current transaction finished, for request pacing."""
        self._last_request_finished_at = asyncio.get_running_loop().time()
        if request_start is not None:
            self._last_request_duration = self._last_request_finished_at - request_start

    def _connect_suppressed(self) -> bool:
        """Return True while something is keeping the connection from being made."""
        if self.hold_closed:
            _LOGGER.debug(
                "Not connecting to %s:%s - the connection is being held closed",
                self.host,
                self.port,
            )
            return True

        if not self._connect_blocked_until:
            return False
        remaining = self._connect_blocked_until - asyncio.get_running_loop().time()
        if remaining <= 0:
            return False
        _LOGGER.debug(
            "Connect to %s:%s held off for another %.1fs after %d failed attempt(s)",
            self.host,
            self.port,
            remaining,
            self._connect_failures,
        )
        return True

    def _note_connect_failure(self) -> None:
        """Hold off the next connect, doubling the wait with every failure."""
        self._connect_failures += 1
        delay = min(
            CONNECT_BACKOFF_BASE_SEC * (2 ** (self._connect_failures - 1)),
            CONNECT_BACKOFF_MAX_SEC,
        )
        self._connect_blocked_until = asyncio.get_running_loop().time() + delay
        _LOGGER.debug(
            "Connect to %s:%s failed %d time(s), next attempt in %.1fs",
            self.host,
            self.port,
            self._connect_failures,
            delay,
        )

    def _note_connect_success(self) -> None:
        """Clear the backoff and mark this connection as a new generation."""
        self._connect_generation += 1
        self._connect_failures = 0
        self._connect_blocked_until = 0.0
        self._connected_once = True

    def _log_failure(self, level: int, message: str, *args) -> None:
        """Report a communication failure, at debug while a caller is probing."""
        _LOGGER.log(logging.DEBUG if self.quiet else level, message, *args)

    async def async_connect(self) -> bool:
        """
        Connect asynchronously to the Modbus TCP server.

        Serialised against other connect attempts, and skipped entirely when
        another caller already built a working connection while this one was
        queued — tearing that fresh session down again is how a handful of
        callers turn one dropout into a connect storm.

        Returns:
            bool: True if connection succeeded, False otherwise.
        """
        generation = self._connect_generation
        async with self._connect_lock:
            if self._connect_generation != generation and self.is_connected:
                _LOGGER.debug(
                    "Connect to %s:%s skipped - another caller already rebuilt it",
                    self.host,
                    self.port,
                )
                return True

            if self._connect_suppressed():
                return False

            return await self._async_connect_locked()

    async def _async_connect_locked(self) -> bool:
        """Build a fresh connection. Only ever called with the connect lock held."""
        # Always create a fresh client instance to avoid reusing internal
        # buffers/state that may be left in an inconsistent state after
        # network interruptions. This reduces "extra data" / parse errors
        # and stale transaction id problems.
        try:
            # Close and discard any existing client first
            replacing_a_session = self._connected_once
            if self.client:
                try:
                    await self.client.disconnect()
                except Exception:
                    pass

            if replacing_a_session:
                # Give the device a moment to let go of the old session before
                # asking for a new one; see RECONNECT_SETTLE_SEC. Skipped on the
                # very first connect, where there is nothing to let go of.
                await asyncio.sleep(RECONNECT_SETTLE_SEC)

            # Create a new client instance
            self.client = self._make_client()

            # tmodbus reports a failed connect by raising, not by returning
            # False: a refused or unreachable host comes back as
            # ModbusConnectionError, a silent one as TimeoutError. Both are
            # the same answer here, so they are turned back into the boolean
            # every caller of this module already expects.
            try:
                await self.client.connect()
                connected = True
            except (TimeoutError, ModbusConnectionError, OSError) as err:
                _LOGGER.debug(
                    "Connect to %s:%s failed: %s: %s",
                    self.host,
                    self.port,
                    type(err).__name__,
                    err,
                )
                connected = False

            if connected:
                self._note_connect_success()
                # Small settle time so the device has time to flush and be ready
                await asyncio.sleep(max(0.2, self.message_wait_sec))
                # Enable TCP keepalive so the OS probes dead connections quickly
                # rather than waiting hours for the default kernel timeout.
                try:
                    sock = self._socket()
                    if sock is not None:
                        sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
                        if hasattr(socket, "TCP_KEEPIDLE"):
                            sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_KEEPIDLE, 60)
                        if hasattr(socket, "TCP_KEEPINTVL"):
                            sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_KEEPINTVL, 10)
                        if hasattr(socket, "TCP_KEEPCNT"):
                            sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_KEEPCNT, 3)
                        _LOGGER.debug("TCP keepalive enabled on Modbus socket")
                except Exception as ke:
                    _LOGGER.debug("Could not set TCP keepalive: %s", ke)
                _LOGGER.info(
                    "Connected to Modbus server at %s:%s with unit %s",
                    self.host,
                    self.port,
                    self.unit_id,
                )
            else:
                self._note_connect_failure()
                self._log_failure(
                    logging.WARNING,
                    "Failed to connect to Modbus server at %s:%s with unit %s",
                    self.host,
                    self.port,
                    self.unit_id,
                )

            return bool(connected)
        except Exception as e:
            self._note_connect_failure()
            _LOGGER.exception("Exception while connecting to Modbus server: %s", e)
            return False

    async def async_close_idle(self) -> None:
        """Close once the request in flight, if any, has finished.

        Pulling the socket out from under a running request leaves the caller to
        discover the loss and rebuild it, which is the opposite of what someone
        closing it deliberately wants. Waiting costs one request.
        """
        async with self._request_lock:
            await self.async_close()

    async def async_close(self) -> None:
        """
        Close the Modbus TCP connection safely (sync or async)
        and reset client reference.
        """
        if not self.client:
            return

        try:
            await self.client.disconnect()
            _LOGGER.debug("Modbus client closed successfully")
        except Exception as e:
            _LOGGER.debug("Error closing Modbus client: %s", e)
        finally:
            # Ensure client reference is cleared so future connect creates fresh instance
            self.client = None

    async def _reset_client(self) -> None:
        """Close the current client and clear the reference."""
        if self.client:
            try:
                await self.client.disconnect()
            except Exception as err:
                _LOGGER.debug("Error closing stale Modbus client: %s", err)
        self.client = None

    async def _ensure_connected(self) -> bool:
        """Ensure there is an active Modbus connection, reconnecting if needed."""
        if self.is_connected:
            return True
        return await self.async_reconnect()

    @property
    def is_connected(self) -> bool:
        """Return True when the wrapped tmodbus client is currently connected."""
        try:
            return bool(self.client and self.client.connected)
        except Exception:
            return False

    async def async_reconnect(self) -> bool:
        """Reconnect to the Modbus TCP server by closing and re-opening the connection.

        Callers that queue up behind each other are coalesced: once one of them
        has rebuilt the connection, the rest take it instead of tearing it down
        again. Three teardowns inside 600 ms were observed in the field, ending
        with a caller reading from a client another coroutine had replaced.
        """
        generation = self._connect_generation
        async with self._request_lock:
            if self._connect_generation != generation and self.is_connected:
                _LOGGER.debug(
                    "Reconnect to %s:%s skipped - another caller already rebuilt it",
                    self.host,
                    self.port,
                )
                return True

            if self._connect_suppressed():
                return False

            _LOGGER.info("Reconnecting to Modbus server at %s:%s", self.host, self.port)

            try:
                try:
                    await self.async_close()
                except Exception as e:
                    _LOGGER.debug("Error closing Modbus client during reconnect: %s", e)

                try:
                    connected = await self.async_connect()
                except Exception as e:
                    _LOGGER.warning(
                        "Exception while reconnecting to Modbus server at %s:%s: %s",
                        self.host,
                        self.port,
                        e,
                    )
                    return False

                if connected:
                    _LOGGER.info("Reconnected to Modbus server at %s:%s", self.host, self.port)
                else:
                    self._log_failure(
                        logging.WARNING,
                        "Reconnect failed to Modbus server at %s:%s",
                        self.host,
                        self.port,
                    )

                return connected
            except Exception as e:
                _LOGGER.warning("Unhandled exception during reconnect: %s", e)
                return False

    @staticmethod
    def _default_count_for_data_type(data_type: str) -> int:
        """Return the default register count for a given data type."""
        if data_type in {"int32", "uint32", "ipv4"}:
            return 2
        if data_type == "schedule":
            return 5
        return 1

    def _decode_registers(
        self,
        register: int,
        regs: list[int],
        data_type: str = "uint16",
        bit_index: Optional[int] = None,
    ):
        """Decode raw holding registers into the requested data type."""
        if data_type == "int16":
            val = regs[0]
            return val - 0x10000 if val >= 0x8000 else val

        if data_type == "uint16":
            return regs[0]

        if data_type == "int32":
            if len(regs) < 2:
                _LOGGER.warning(
                    "Expected 2 registers for int32 at register %d (0x%04X), got %s",
                    register,
                    register,
                    len(regs),
                )
                return None
            val = (regs[0] << 16) | regs[1]
            return val - 0x100000000 if val >= 0x80000000 else val

        if data_type == "uint32":
            if len(regs) < 2:
                _LOGGER.warning(
                    "Expected 2 registers for uint32 at register %d (0x%04X), got %s",
                    register,
                    register,
                    len(regs),
                )
                return None
            return (regs[0] << 16) | regs[1]

        if data_type == "char":
            byte_array = bytearray()
            for reg in regs:
                byte_array.append((reg >> 8) & 0xFF)
                byte_array.append(reg & 0xFF)
            null_pos = byte_array.find(0)
            if null_pos >= 0:
                byte_array = byte_array[:null_pos]
            return byte_array.decode("ascii", errors="ignore")

        if data_type == "mac":
            byte_array = bytearray()
            for reg in regs:
                byte_array.append((reg >> 8) & 0xFF)
                byte_array.append(reg & 0xFF)

            null_pos = byte_array.find(0)
            if null_pos >= 0:
                byte_array = byte_array[:null_pos]

            try:
                ascii_value = byte_array.decode("ascii", errors="strict").strip()
            except UnicodeDecodeError:
                ascii_value = ""

            if len(ascii_value) == 12 and all(ch in "0123456789abcdefABCDEF" for ch in ascii_value):
                return ":".join(
                    ascii_value[index:index + 2].upper()
                    for index in range(0, 12, 2)
                )

            return ":".join(f"{byte:02X}" for byte in byte_array)

        if data_type == "ipv4":
            if len(regs) < 2:
                _LOGGER.warning(
                    "Expected 2 registers for ipv4 at register %d (0x%04X), got %s",
                    register,
                    register,
                    len(regs),
                )
                return None
            # Each register carries two octets, high byte first:
            # 30400 = 192.168 -> 0xC0A8, 30401 = 181.154 -> 0xB59A
            octets = (
                (regs[0] >> 8) & 0xFF,
                regs[0] & 0xFF,
                (regs[1] >> 8) & 0xFF,
                regs[1] & 0xFF,
            )
            return ".".join(str(octet) for octet in octets)

        if data_type == "schedule":
            if len(regs) < 5:
                _LOGGER.warning(
                    "Expected 5 registers for schedule at %d (0x%04X), got %s",
                    register,
                    register,
                    len(regs),
                )
                return None
            mode_raw = int(regs[3])
            mode_signed = mode_raw - 0x10000 if mode_raw >= 0x8000 else mode_raw
            return {
                "days": int(regs[0]),
                "start": int(regs[1]),
                "end": int(regs[2]),
                "mode": mode_signed,
                "enabled": int(regs[4]),
            }

        if data_type == "bit":
            if bit_index is None or not (0 <= bit_index < 16):
                raise ValueError("bit_index must be between 0 and 15 for bit data_type")
            reg_val = regs[0]
            return bool((reg_val >> bit_index) & 1)

        raise ValueError(f"Unsupported data_type: {data_type}")

    async def async_read_holding_registers(
        self,
        register: int,
        count: int,
        sensor_key: Optional[str] = None,
        max_retries: int = 3,
        retry_delay: float = 0.1,
    ) -> list[int] | None:
        """Read raw holding registers asynchronously with retries."""
        if not (0 <= register <= 0xFFFF):
            _LOGGER.error(
                "Invalid register address: %d (0x%04X). Must be 0-65535.",
                register,
                register,
            )
            return None

        if not (1 <= count <= 125):
            _LOGGER.error(
                "Invalid register count: %d. Must be between 1 and 125.",
                count,
            )
            return None

        attempt = 0
        while attempt < max_retries:
            client_connected = False
            try:
                client_connected = bool(self.client and getattr(self.client, "connected", False))
            except Exception:
                client_connected = False

            if not await self._ensure_connected():
                self._log_failure(
                    logging.ERROR,
                    "Modbus client not connected, skipping register %d (0x%04X)",
                    register,
                    register,
                )
                return None

            request_start = asyncio.get_running_loop().time()
            try:
                regs: list[int] = []
                async with self._request_lock:
                    # Pace requests to avoid overwhelming the device.
                    await self._async_wait_for_request_slot()

                    # Log the request before it goes out, not after it came back.
                    # A request that is never answered is the one worth naming,
                    # and logging it from the success branch hides exactly that.
                    if count == 1:
                        _LOGGER.debug(
                            "Requesting single register %d (0x%04X) from '%s' for key '%s' (attempt %d)",
                            register,
                            register,
                            self.host,
                            sensor_key or "unknown",
                            attempt + 1,
                        )
                    else:
                        _LOGGER.debug(
                            "Requesting register block %d-%d (0x%04X-0x%04X) from '%s' for keys '%s' (count: %s, attempt %d)",
                            register,
                            register + count - 1,
                            register,
                            register + count - 1,
                            self.host,
                            sensor_key or "unknown",
                            count,
                            attempt + 1,
                        )

                    try:
                        # The unit id rides on the client, so there is no
                        # per-request keyword to guess at any more. A reply
                        # that does not match the request — wrong function
                        # code, wrong byte count, an exception response —
                        # raises instead of coming back as an object to
                        # interrogate, so the branches below are only about
                        # what a well-formed answer contains.
                        regs = list(
                            await self.client.read_holding_registers(
                                start_address=register,
                                quantity=count,
                            )
                        )
                    finally:
                        self._mark_request_finished(request_start)

                if len(regs) < count:
                    # tmodbus already refuses a frame whose byte count does not
                    # match the quantity asked for, so reaching this is not
                    # expected. Kept because acting on a short block would be
                    # worse than one more reconnect.
                    _LOGGER.warning(
                        "Incomplete data received at register %d (0x%04X) on attempt %d: expected %d registers, got %s",
                        register,
                        register,
                        attempt + 1,
                        count,
                        len(regs),
                    )
                    if attempt + 1 < max_retries:
                        _LOGGER.debug(
                            "Attempting reconnect after incomplete response for register %d (0x%04X)",
                            register,
                            register,
                        )
                        await self.async_reconnect()
                else:
                    if count == 1:
                        _LOGGER.debug(
                            "Received single register data from '%s' for register %d (0x%04X): %s",
                            self.host,
                            register,
                            register,
                            regs,
                        )
                    else:
                        _LOGGER.debug(
                            "Received block data from '%s' for registers %d-%d (0x%04X-0x%04X): %s",
                            self.host,
                            register,
                            register + count - 1,
                            register,
                            register + count - 1,
                            regs,
                        )
                    return regs
            except asyncio.CancelledError:
                # tmodbus lets a cancellation travel as itself rather than
                # wrapping it in a protocol error, so this catch is all that is
                # needed for a caller's guard to stop the retry loop.
                raise
            except TimeoutError as e:
                # An unanswered request is the expected shape of a failure here,
                # not something exceptional. It gets a readable line instead of a
                # traceback — during an outage this fires once per register.
                # This is also the stall the migration notes describe: the reply
                # that arrives after the timeout is dropped by the transport as
                # an unmatched transaction id, not fed to the next request.
                _LOGGER.warning(
                    "No response for register %d (0x%04X) on attempt %d: %s",
                    register,
                    register,
                    attempt + 1,
                    e,
                )
                if attempt + 1 < max_retries:
                    await self.async_reconnect()
            except ModbusResponseError as e:
                # The device answered, and the answer was a refusal — an illegal
                # address inside a probed block being the usual one. Same
                # treatment the old backend gave an error response.
                _LOGGER.error(
                    "Modbus read error at register %d (0x%04X) on attempt %d: %s",
                    register,
                    register,
                    attempt + 1,
                    e,
                )
                if attempt + 1 < max_retries:
                    _LOGGER.debug(
                        "Attempting reconnect after Modbus error response for register %d (0x%04X)",
                        register,
                        register,
                    )
                    await self.async_reconnect()
            except (ModbusConnectionError, TModbusError) as e:
                # A lost socket or a frame that could not be matched to the
                # request. Both are plain failures, so neither gets a traceback.
                _LOGGER.warning(
                    "Modbus read failed at register %d (0x%04X) on attempt %d: %s: %s",
                    register,
                    register,
                    attempt + 1,
                    type(e).__name__,
                    e,
                )
                if attempt + 1 < max_retries:
                    await self.async_reconnect()
            except Exception as e:
                _LOGGER.exception(
                    "Exception during Modbus read at register %d (0x%04X) on attempt %d: %s",
                    register,
                    register,
                    attempt + 1,
                    e,
                )
                if attempt + 1 < max_retries:
                    _LOGGER.debug(
                        "Attempting reconnect after exception for register %d (0x%04X)",
                        register,
                        register,
                    )
                    await self.async_reconnect()
            finally:
                # Covers paths that never reached the request itself (e.g. an
                # exception before the lock); the normal case already stamped.
                self._mark_request_finished(request_start)

            attempt += 1
            if attempt < max_retries:
                await asyncio.sleep(retry_delay)

        # A single-attempt read is the caller probing a block; it has an
        # individual-read fallback ready, so this is not an error on its own.
        log = _LOGGER.warning if max_retries <= 1 else _LOGGER.error
        log(
            "Failed to read register %d (0x%04X) after %d attempt(s)",
            register,
            register,
            max_retries,
        )
        return None

    async def async_read_register(
        self,
        register: int,
        data_type: str = "uint16",
        count: Optional[int] = None,
        bit_index: Optional[int] = None,
        sensor_key: Optional[str] = None,
        max_retries: int = 3,
        retry_delay: float = 0.1,
    ):
        """
        Robustly read registers and interpret the data asynchronously with retries.

        Args:
            register (int): Register address to read from.
            data_type (str): Data type for interpretation, e.g. 'int16', 'int32', 'char', 'bit'.
            count (Optional[int]): Number of registers to read (default depends on data_type).
            bit_index (Optional[int]): Bit position for 'bit' data type (0-15).
            sensor_key (Optional[str]): Sensor key for logging.
            max_retries (int): Maximum number of read attempts.
            retry_delay (float): Delay in seconds between retries.

        Returns:
            int, str, bool, or None: Interpreted value or None on error.
        """
        if count is None:
            count = self._default_count_for_data_type(data_type)

        regs = await self.async_read_holding_registers(
            register=register,
            count=count,
            sensor_key=sensor_key,
            max_retries=max_retries,
            retry_delay=retry_delay,
        )
        if regs is None:
            return None

        return self._decode_registers(
            register=register,
            regs=regs,
            data_type=data_type,
            bit_index=bit_index,
        )

    async def async_write_register(
        self,
        register: int,
        value: int,
        max_retries: int = 3,
        retry_delay: float = 0.2,
    ) -> bool:
        """
        Write a single value to a Modbus holding register asynchronously with retries.

        Args:
            register (int): Register address to write to.
            value (int): Value to write.
            max_retries (int): Maximum number of write attempts.
            retry_delay (float): Delay in seconds between retries.

        Returns:
            bool: True if write was successful, False otherwise.
        """
        # Input validation
        if not (0 <= register <= 0xFFFF):
            _LOGGER.error(
                "Invalid register address for write: %d (0x%04X). Must be 0-65535.",
                register,
                register,
            )
            return False

        # Expect caller to supply an already validated/converted 16-bit unsigned value.
        if not isinstance(value, int):
            _LOGGER.error("Invalid value type for write: %s. Must be int.", type(value))
            return False

        if not (0 <= value <= 0xFFFF):
            _LOGGER.error(
                "Invalid value for write: %d. Must be 0-65535.",
                value,
            )
            return False
        value_to_send = value

        attempt = 0
        while attempt < max_retries:
            # Check client connection
            if not self.is_connected:
                _LOGGER.warning(
                    "Modbus client not connected, attempting reconnect before write to register %d (0x%04X)",
                    register,
                    register,
                )
                # Through the same path reads use, so a write from an automation
                # cannot build a second connection next to the poll loop's one.
                connected = await self._ensure_connected()
                if not connected:
                    _LOGGER.error(
                        "Reconnect failed, skipping write to register %d (0x%04X)",
                        register,
                        register,
                    )
                    return False

            # Additional safety check
            if self.client is None:
                _LOGGER.error("Modbus Client became None unexpectedly")
                return False

            try:
                request_start = asyncio.get_running_loop().time()
                async with self._request_lock:
                    # Same pacing as for reads, so a write does not jump the queue.
                    await self._async_wait_for_request_slot()

                    # Logged from inside the lock, so the timestamp is the moment
                    # the frame goes out rather than the moment the write was
                    # queued behind whatever request is still running.
                    _LOGGER.debug(
                        "Writing to register %d (0x%04X), value=%d (0x%04X), attempt=%d",
                        register,
                        register,
                        value,
                        value,
                        attempt + 1,
                    )

                    try:
                        # Function code 6. tmodbus checks the echo itself and
                        # raises unless the device sent the address and value
                        # back unchanged, so a return here is a confirmed write.
                        await self.client.write_single_register(register, value)
                    finally:
                        self._mark_request_finished(request_start)

                _LOGGER.debug(
                    "Write confirmed for register %d (0x%04X), value=%d",
                    register,
                    register,
                    value,
                )
                return True

            except asyncio.CancelledError:
                # Allow cancellation to propagate during shutdown
                raise

            except TimeoutError as e:
                # Same reasoning as on the read side: no response is a plain
                # failure, not a traceback.
                _LOGGER.warning(
                    "No response for the write to register %d (0x%04X) on attempt %d: %s",
                    register,
                    register,
                    attempt + 1,
                    e,
                )
            except ModbusResponseError as e:
                _LOGGER.warning(
                    "Modbus write error at register %d (0x%04X) on attempt %d: %s",
                    register,
                    register,
                    attempt + 1,
                    e,
                )
            except (ModbusConnectionError, TModbusError) as e:
                _LOGGER.warning(
                    "Modbus write failed at register %d (0x%04X) on attempt %d: %s: %s",
                    register,
                    register,
                    attempt + 1,
                    type(e).__name__,
                    e,
                )
            except Exception as e:
                _LOGGER.exception(
                    "Exception during Modbus write at register %d (0x%04X) on attempt %d: %s",
                    register,
                    register,
                    attempt + 1,
                    e,
                )

            attempt += 1
            if attempt < max_retries:
                # A write that timed out or errored leaves the same doubt about
                # the socket as a failed read does, so it gets the same answer:
                # retry on a fresh connection instead of on the suspect one.
                _LOGGER.debug(
                    "Attempting reconnect before write retry for register %d (0x%04X)",
                    register,
                    register,
                )
                await self.async_reconnect()
                await asyncio.sleep(retry_delay)

        _LOGGER.error(
            "Failed to write to register %d (0x%04X) after %d attempts",
            register,
            register,
            max_retries,
        )
        return False