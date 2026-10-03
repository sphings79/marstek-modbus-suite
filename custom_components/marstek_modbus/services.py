"""Services of the integration.

set_wifi (Venus D, Venus A and Venus E v3)
------------------------------------------
Writes the Wi-Fi station credentials of the battery's communication module
through the Modbus registers 41500-41631. What the firmware does with them:

- 41500-41515 take the SSID, 41600-41631 the password. Both are ASCII, two
  characters per register, the first character in the high byte.
- Nothing is applied by the SSID alone. A write to a password register whose
  low byte is 0x00 (a terminator) hands both buffers to the module. The
  buffers are not cleared first, so a string only ends where a 0x00 byte says
  so.
- Every further register with a low byte of 0x00 triggers the takeover again.
  The password is therefore written exactly up to and including the register
  that holds the terminator, and no zero padding follows it.
- SSID 1 to 31 characters, so that the terminator still fits into the 32-byte
  buffer. Password empty (open network) or 8 to 31 characters (a 32nd character would use
  register 41616, which hits the EEPROM overlap below). The module
  receives both in one unquoted AT command, which is why a comma and a double
  quote are refused in both.
- The firmware persists the password area to EEPROM 0x420-0x45F, which
  overlaps 0x441 (the cloud server type). That is a firmware bug and the reason
  the service is behind the advanced option and carries a warning.

The password is never read back (the registers always read 0), never logged,
not even at debug level, and never put into an exception or a state.

Two ways in, one implementation (async_set_wifi): the service, for
automations, scripts and the developer tools, and the websocket command
marstek_modbus/set_wifi (websocket.py), which the panel uses. Only the latter
keeps the password out of the recorder: Home Assistant stores every service
call with its data as a call_service event.
"""

from __future__ import annotations

import logging

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from homeassistant.const import ATTR_DEVICE_ID
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN, LEGACY_DEVICE_VERSIONS
from .coordinator import MarstekCoordinator

_LOGGER = logging.getLogger(__name__)

SERVICE_SET_WIFI = "set_wifi"
ATTR_SSID = "ssid"
ATTR_PASSWORD = "password"

# The models whose register map reaches the Wi-Fi registers this way, as the
# lower-cased device version. The Venus E v3 control unit runs the same code
# and its communication module the same image, so the same sequence applies.
# The Venus E v1/v2 is a different firmware family and not part of it.
WIFI_VERSIONS = {"d", "a", "e v3"}

WIFI_SSID_REGISTER = 41500
WIFI_PASSWORD_REGISTER = 41600
WIFI_SSID_MAX_CHARS = 31
WIFI_PASSWORD_MIN_CHARS = 8
WIFI_PASSWORD_MAX_CHARS = 31

# Printable ASCII, and without the two characters that break the unquoted AT
# command the module receives.
_FORBIDDEN_CHARS = {",", '"'}

SET_WIFI_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_DEVICE_ID): vol.All(cv.ensure_list, [cv.string]),
        vol.Required(ATTR_SSID): cv.string,
        vol.Optional(ATTR_PASSWORD, default=""): cv.string,
    }
)


def _is_valid_text(text: str) -> bool:
    """Printable ASCII only, without the characters the AT command cannot carry."""
    return all(0x20 <= ord(char) <= 0x7E and char not in _FORBIDDEN_CHARS for char in text)


def pack_text(text: str) -> list[int]:
    """Return the registers for a string, terminator register included.

    Two characters per register, the first in the high byte. The 0x00
    terminator is written as the byte after the last character, which is the
    low byte of the last register for an odd length and a register of its own
    (0x0000) for an even length. Nothing follows it.
    """
    data = text.encode("ascii") + b"\x00"
    if len(data) % 2:
        data += b"\x00"
    return [(data[i] << 8) | data[i + 1] for i in range(0, len(data), 2)]


def encode_wifi_credentials(ssid: str, password: str) -> tuple[list[int], list[int]]:
    """Validate the credentials and return (SSID registers, password registers).

    Raises ServiceValidationError, with a translated message that names the
    rule and never quotes the password, before anything has been written.
    """
    if not 1 <= len(ssid) <= WIFI_SSID_MAX_CHARS:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="set_wifi_ssid_length",
            translation_placeholders={"max": str(WIFI_SSID_MAX_CHARS)},
        )
    if not _is_valid_text(ssid):
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="set_wifi_ssid_chars"
        )
    if password and not (
        WIFI_PASSWORD_MIN_CHARS <= len(password) <= WIFI_PASSWORD_MAX_CHARS
    ):
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="set_wifi_password_length",
            translation_placeholders={
                "min": str(WIFI_PASSWORD_MIN_CHARS),
                "max": str(WIFI_PASSWORD_MAX_CHARS),
            },
        )
    if not _is_valid_text(password):
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="set_wifi_password_chars"
        )
    return pack_text(ssid), pack_text(password)


def _coordinators(hass: HomeAssistant) -> list[MarstekCoordinator]:
    """Every loaded coordinator; hass.data[DOMAIN] also holds other objects."""
    return [
        value
        for value in hass.data.get(DOMAIN, {}).values()
        if isinstance(value, MarstekCoordinator)
    ]


def _version(coordinator: MarstekCoordinator) -> str:
    """The device version in its current spelling ("d", "a", "e v3", ...)."""
    version = (coordinator.config_entry.data.get("device_version") or "").strip().lower()
    return LEGACY_DEVICE_VERSIONS.get(version, version)


def _resolve_targets(
    hass: HomeAssistant, device_ids: list[str] | None
) -> list[MarstekCoordinator]:
    """Return the coordinators the call is meant for."""
    coordinators = _coordinators(hass)

    if device_ids:
        registry = dr.async_get(hass)
        by_entry = {c.config_entry.entry_id: c for c in coordinators}
        targets: list[MarstekCoordinator] = []
        for device_id in device_ids:
            device = registry.async_get(device_id)
            coordinator = next(
                (by_entry[e] for e in (device.config_entries if device else ()) if e in by_entry),
                None,
            )
            if coordinator is None:
                raise ServiceValidationError(
                    translation_domain=DOMAIN, translation_key="set_wifi_unknown_device"
                )
            if coordinator not in targets:
                targets.append(coordinator)
        return targets

    # No target: only unambiguous with exactly one battery of a supported model.
    supported = [c for c in coordinators if _version(c) in WIFI_VERSIONS]
    if len(supported) == 1:
        return supported
    if not supported:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="set_wifi_unsupported"
        )
    raise ServiceValidationError(
        translation_domain=DOMAIN, translation_key="set_wifi_target_needed"
    )


def _check_target(coordinator: MarstekCoordinator) -> None:
    """Refuse a battery that cannot or must not take the credentials now."""
    if _version(coordinator) not in WIFI_VERSIONS:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="set_wifi_unsupported"
        )
    # The advanced option of the integration: Options -> DEV registers ->
    # "Show DEV registers", the one that also loads the DEV buttons.
    if not coordinator.dev_enabled:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="set_wifi_disabled"
        )
    if not coordinator.controls_available:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="set_wifi_paused"
        )


async def _async_write_registers(
    coordinator: MarstekCoordinator,
    first_register: int,
    values: list[int],
    failure_key: str,
    commit: bool = False,
) -> None:
    """Write the registers in order; stop and raise at the first that fails.

    With commit, the last register is the terminator that makes the module take
    the credentials over. It is written once: a retry after a lost reply would
    trigger a second takeover.
    """
    last = len(values) - 1
    for index, value in enumerate(values):
        register = first_register + index
        ok = await coordinator.async_write_secret_register(
            register, value, max_retries=1 if commit and index == last else 3
        )
        if not ok:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key=failure_key,
                translation_placeholders={"register": str(register)},
            )


async def async_set_wifi(
    hass: HomeAssistant,
    device_ids: list[str] | None,
    ssid: str,
    password: str,
) -> None:
    """Validate and write the Wi-Fi credentials to the targeted batteries.

    The one implementation behind both the service and the panel's websocket
    command (websocket.py), so their rules and errors cannot drift apart.
    Raises ServiceValidationError before anything is written, and
    HomeAssistantError when a write fails; neither ever carries the password.
    """
    targets = _resolve_targets(hass, device_ids)
    for coordinator in targets:
        _check_target(coordinator)
    # Everything is checked before the first register is written.
    ssid_registers, password_registers = encode_wifi_credentials(ssid, password)

    for coordinator in targets:
        # One credential write at a time per battery: two interleaved calls
        # would mix the buffers.
        async with coordinator.wifi_write_lock:
            # SSID first, then the password: the last password register is the
            # one that applies both.
            await _async_write_registers(
                coordinator,
                WIFI_SSID_REGISTER,
                ssid_registers,
                "set_wifi_write_failed_ssid",
            )
            await _async_write_registers(
                coordinator,
                WIFI_PASSWORD_REGISTER,
                password_registers,
                "set_wifi_write_failed_password",
                commit=True,
            )
        _LOGGER.info(
            "Wi-Fi credentials sent to %s:%s; the communication module applies them now",
            coordinator.host,
            coordinator.port,
        )


async def async_handle_set_wifi(call: ServiceCall) -> None:
    """The service: write the Wi-Fi credentials to the targeted batteries.

    Home Assistant records every service call with its data as a call_service
    event, so the password of a call made this way ends up in the recorder
    database. The panel uses the websocket command instead, which is not
    recorded.
    """
    await async_set_wifi(
        call.hass,
        call.data.get(ATTR_DEVICE_ID),
        call.data[ATTR_SSID],
        call.data[ATTR_PASSWORD],
    )


def async_register_services(hass: HomeAssistant) -> None:
    """Register the services once; they outlive single config entries."""
    if hass.services.has_service(DOMAIN, SERVICE_SET_WIFI):
        return
    hass.services.async_register(
        DOMAIN, SERVICE_SET_WIFI, async_handle_set_wifi, schema=SET_WIFI_SCHEMA
    )
