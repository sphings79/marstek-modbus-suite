"""Weekdays of a schedule slot, which the device keeps as a bit mask.

Each schedule has one register for its days: bit 0 is Monday, bit 6 Sunday,
and any combination is valid - the Marstek app sets Monday to Friday as 31.
A select entity can only hold one value, so the entity reports single days
by name, everything else as "custom", and an empty mask as "none". The full
mask is written through the websocket command below, which is what the panel
uses to edit several days at once.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN

if TYPE_CHECKING:
    from .select import MarstekSelect

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
ALL_DAYS_MASK = 127

OPTION_NONE = "none"
OPTION_CUSTOM = "custom"

WS_SET_DAYS = f"{DOMAIN}/schedule/set_days"

DATA_DAY_SELECTS = "schedule_day_selects"
DATA_COMMAND_REGISTERED = "schedule_days_registered"


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


@callback
def track_day_select(hass: HomeAssistant, entity_id: str, entity: MarstekSelect) -> None:
    """Make a day select reachable for the websocket command."""
    hass.data.setdefault(DOMAIN, {}).setdefault(DATA_DAY_SELECTS, {})[entity_id] = entity


@callback
def untrack_day_select(hass: HomeAssistant, entity_id: str) -> None:
    """Forget a day select that is being removed."""
    hass.data.get(DOMAIN, {}).get(DATA_DAY_SELECTS, {}).pop(entity_id, None)


@callback
def async_register_schedule_days_api(hass: HomeAssistant) -> None:
    """Register the command once per Home Assistant run."""
    data = hass.data.setdefault(DOMAIN, {})
    if data.get(DATA_COMMAND_REGISTERED):
        return
    websocket_api.async_register_command(hass, websocket_set_days)
    data[DATA_COMMAND_REGISTERED] = True


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SET_DAYS,
        vol.Required("entity_id"): str,
        vol.Required("days"): [vol.In(list(DAY_BITS))],
    }
)
@websocket_api.async_response
async def websocket_set_days(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Write the given days, replacing whatever the slot had."""
    entity = hass.data.get(DOMAIN, {}).get(DATA_DAY_SELECTS, {}).get(msg["entity_id"])
    if entity is None:
        connection.send_error(
            msg["id"], websocket_api.ERR_NOT_FOUND, "not a schedule day select"
        )
        return
    if not entity.available:
        connection.send_error(
            msg["id"], websocket_api.ERR_HOME_ASSISTANT_ERROR, "entity unavailable"
        )
        return

    written = await entity.async_write_mask(mask_from_days(msg["days"]))
    if not written:
        connection.send_error(
            msg["id"], websocket_api.ERR_HOME_ASSISTANT_ERROR, "write failed"
        )
        return
    connection.send_result(msg["id"])
