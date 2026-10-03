"""The six schedule slots: day masks, validation and the order of writes.

Each slot is five registers from 43100 + 5 * (n - 1): days, start, end,
power and enabled. What the control firmware (150 on the A, D and E3) does
with them decides everything in here:

- The days are a bit mask, bit 0 Monday to bit 6 Sunday, and any combination
  is valid - the Marstek app sets Monday to Friday as 31.
- Writing the days, the start or the end sets enabled back to 0. A slot
  edited one register at a time switches itself off, so every write that
  touches those three restores enabled afterwards.
- A slot matches while start <= now < end on one of its days. A window
  across midnight or with start == end never matches.
- The first matching slot wins and the others are ignored, so two enabled
  slots that overlap never run side by side. That is refused here rather
  than left to the order of the slots.
- Start and end are clock times written as HHMM (1830 = 18:30). A value
  whose minutes are 60 or more is rejected by the firmware, which switches
  the slot off while doing so, so such a value is refused here before it is
  written.

The power register is `schedule_N_power` on the maps that have been checked
against the firmware and `schedule_N_mode` on the others; both are the same
register and both are accepted.

A select entity can only hold one value, so the day select reports single
days by name, everything else as "custom", and an empty mask as "none". The
panel writes whole slots through the websocket command below.
"""

from __future__ import annotations

import logging
import re
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN

if TYPE_CHECKING:
    from .coordinator import MarstekCoordinator

_LOGGER = logging.getLogger(__name__)

# Monday first, the order the panel shows them in.
DAY_BITS: dict[str, int] = {
    "monday": 1,
    "tuesday": 2,
    "wednesday": 4,
    "thursday": 8,
    "friday": 16,
    "saturday": 32,
    "sunday": 64,
}

OPTION_NONE = "none"
OPTION_CUSTOM = "custom"

SLOTS = range(1, 7)
# The order a slot is written in. Enabled goes last: every other write but
# the power switches the slot off on the device.
FIELDS = ("days", "start", "end", "power", "enabled")
DISABLING_FIELDS = ("days", "start", "end")
TIME_FIELDS = ("start", "end")

# The power field under the key names in use: "power" where the map was
# corrected, "mode" where it still carries the old name.
POWER_KEY_NAMES = ("power", "mode")

_KEY = re.compile(r"^schedule_([1-6])_(days|start|end|mode|power|enabled)$")

WS_SET = f"{DOMAIN}/schedule/set"
DATA_COMMAND_REGISTERED = "schedule_api_registered"


def days_from_mask(mask: int) -> list[str]:
    """Return the day names set in a mask, Monday first."""
    return [day for day, bit in DAY_BITS.items() if mask & bit]


def mask_from_days(days: list[str]) -> int:
    """Return the mask for a list of day names; unknown names raise KeyError."""
    mask = 0
    for day in days:
        mask |= DAY_BITS[day]
    return mask


def option_from_mask(mask: int) -> str:
    """Return the select option that describes a mask."""
    if mask == 0:
        return OPTION_NONE
    days = days_from_mask(mask)
    if len(days) == 1 and mask == DAY_BITS[days[0]]:
        return days[0]
    return OPTION_CUSTOM


def parse_key(key: str) -> tuple[int, str] | None:
    """Return (slot, field) for a schedule register key, None for any other.

    Both names of the power register come back as the field "power".
    """
    match = _KEY.match(key)
    if not match:
        return None
    field = match.group(2)
    return int(match.group(1)), "power" if field in POWER_KEY_NAMES else field


def _key(slot: int, field: str) -> str:
    return f"schedule_{slot}_{field}"


def is_hhmm(value: Any) -> bool:
    """True for a clock time written as HHMM: hours 0-23, minutes 0-59."""
    try:
        value = int(value)
    except (TypeError, ValueError):
        return False
    return value >= 0 and value // 100 < 24 and value % 100 < 60


def _int(value: Any) -> int | None:
    try:
        return int(value) if value is not None else None
    except (TypeError, ValueError):
        return None


class ScheduleConflict(ServiceValidationError):
    """A write that would leave an enabled slot unable to run as set."""

    def __init__(self, translation_key: str, **placeholders: int) -> None:
        super().__init__(
            translation_domain=DOMAIN,
            translation_key=translation_key,
            translation_placeholders={k: str(v) for k, v in placeholders.items()},
        )


def validate(data: dict[str, Any], slot: int, changes: dict[str, int]) -> None:
    """Refuse changes that leave an enabled slot with a dead or shared window.

    Only enabled slots are checked, so a slot can be prepared while it is off,
    and switching one off is always allowed. A change to the power alone is
    not checked either: it moves neither the window nor the days.

    A start or end that is not a valid HHMM time is refused in any slot,
    enabled or not: the firmware would reject it and switch the slot off.
    """
    for field in TIME_FIELDS:
        if field in changes and not is_hhmm(changes[field]):
            raise ScheduleConflict("schedule_time", slot=slot)

    if not set(changes) & {"days", "start", "end", "enabled"}:
        return

    slot_now = {
        f: changes.get(f, _int(data.get(_key(slot, f))))
        for f in ("days", "start", "end", "enabled")
    }
    if slot_now["enabled"] != 1:
        return

    start, end = slot_now["start"], slot_now["end"]
    if start is None or end is None:
        return
    if start >= end:
        raise ScheduleConflict("schedule_window", slot=slot)

    mask = (slot_now["days"] or 0) & 0x7F
    if not mask:
        return

    for other in SLOTS:
        if other == slot or _int(data.get(_key(other, "enabled"))) != 1:
            continue
        other_mask = (_int(data.get(_key(other, "days"))) or 0) & 0x7F
        other_start = _int(data.get(_key(other, "start")))
        other_end = _int(data.get(_key(other, "end")))
        if not other_mask & mask or other_start is None or other_end is None:
            continue
        if start < other_end and other_start < end:
            raise ScheduleConflict("schedule_overlap", slot=slot, other=other)


def _definition(coordinator: MarstekCoordinator, key: str) -> dict[str, Any] | None:
    for group in (
        coordinator.SELECT_DEFINITIONS,
        coordinator.NUMBER_DEFINITIONS,
        coordinator.SWITCH_DEFINITIONS,
    ):
        for definition in group or []:
            if definition.get("key") == key:
                return definition
    return None


def _slot_key(coordinator: MarstekCoordinator, slot: int, field: str) -> str:
    """The register key of a field in this coordinator's map.

    Only the power field has two names; the first one the map defines wins.
    """
    if field != "power":
        return _key(slot, field)
    for name in POWER_KEY_NAMES:
        key = _key(slot, name)
        if _definition(coordinator, key) is not None:
            return key
    return _key(slot, POWER_KEY_NAMES[0])


async def async_write_slot(
    coordinator: MarstekCoordinator, slot: int, changes: dict[str, int]
) -> bool:
    """Validate and write part of a slot, keeping it enabled if it was.

    Raises ScheduleConflict before anything is written. Returns False when a
    register could not be written; the ones before it stay written.
    """
    data = coordinator.data if isinstance(coordinator.data, dict) else {}
    coordinator.data = data
    validate(data, slot, changes)

    writes = [(f, changes[f]) for f in FIELDS if f in changes]
    if (
        "enabled" not in changes
        and any(f in changes for f in DISABLING_FIELDS)
        and _int(data.get(_key(slot, "enabled"))) == 1
    ):
        writes.append(("enabled", 1))

    ok = True
    for field, value in writes:
        key = _slot_key(coordinator, slot, field)
        definition = _definition(coordinator, key)
        if definition is None:
            _LOGGER.warning("No register definition for %s", key)
            ok = False
            continue
        previous = data.get(key)
        data[key] = value
        written = await coordinator.async_write_value(
            register=definition["register"],
            value=value,
            key=key,
            scale=definition.get("scale", 1),
            unit=definition.get("unit"),
            entity_type="schedule",
        )
        if not written:
            data[key] = previous
            ok = False
        # A failed field still lets the rest through - above all the final
        # enabled, which would otherwise leave the slot switched off.

    coordinator.async_update_listeners()
    return ok


@callback
def async_register_schedule_api(hass: HomeAssistant) -> None:
    """Register the command once per Home Assistant run."""
    data = hass.data.setdefault(DOMAIN, {})
    if data.get(DATA_COMMAND_REGISTERED):
        return
    websocket_api.async_register_command(hass, websocket_set_slot)
    data[DATA_COMMAND_REGISTERED] = True


def _hhmm(value: Any) -> int:
    if not is_hhmm(value):
        raise vol.Invalid("not a HHMM time")
    return int(value)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SET,
        # Any entity of the slot; it names both the device and the slot.
        vol.Required("entity_id"): str,
        vol.Optional("days"): [vol.In(list(DAY_BITS))],
        vol.Optional("start"): _hhmm,
        vol.Optional("end"): _hhmm,
    }
)
@websocket_api.async_response
async def websocket_set_slot(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Write the days and/or the window of one slot in a single step."""
    entry = er.async_get(hass).async_get(msg["entity_id"])
    coordinator = (
        hass.data.get(DOMAIN, {}).get(entry.config_entry_id) if entry else None
    )
    parsed = (
        parse_key(entry.unique_id.removeprefix(f"{entry.config_entry_id}_"))
        if entry and coordinator is not None
        else None
    )
    if parsed is None:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "not a schedule entity"
        )
        return
    if not (coordinator.controls_available and coordinator.last_update_success):
        connection.send_error(
            msg["id"], websocket_api.ERR_HOME_ASSISTANT_ERROR, "device unavailable"
        )
        return

    changes: dict[str, int] = {}
    if "days" in msg:
        changes["days"] = mask_from_days(msg["days"])
    for field in ("start", "end"):
        if field in msg:
            changes[field] = msg[field]
    if not changes:
        connection.send_result(msg["id"])
        return

    try:
        written = await async_write_slot(coordinator, parsed[0], changes)
    except ScheduleConflict as err:
        connection.send_error(
            msg["id"],
            websocket_api.ERR_SERVICE_VALIDATION_ERROR,
            str(err),
            translation_domain=err.translation_domain,
            translation_key=err.translation_key,
            translation_placeholders=err.translation_placeholders,
        )
        return
    if not written:
        connection.send_error(
            msg["id"], websocket_api.ERR_HOME_ASSISTANT_ERROR, "write failed"
        )
        return
    connection.send_result(msg["id"])
