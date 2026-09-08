"""Storage for the panel's own settings, kept per Home Assistant user.

The panel used to keep everything in `localStorage`, which meant a phone and a
laptop showed the same person two different panels. Colours, the starting tab
and the hidden tabs live here instead, so they follow the user around.

Keyed by user id rather than shared: a household where one person prefers the
light scheme and another the dark should not have to argue about it, and a
non-admin has to be able to set their own without being able to change anyone
else's. The id comes from the websocket connection, never from the message, so
a caller cannot ask for somebody else's settings by naming them.

Scale and content width are deliberately *not* here. They describe the screen
in front of the viewer, and syncing them would mean the last device used wins
on all of them.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY = f"{DOMAIN}.panel_settings"
STORAGE_VERSION = 1

WS_GET = f"{DOMAIN}/settings/get"
WS_SET = f"{DOMAIN}/settings/set"

DATA_STORE = "panel_settings_store"
DATA_COMMANDS_REGISTERED = "panel_settings_registered"

# The panel validates and normalises every field it reads, and a field it does
# not know is ignored there rather than here. Capping the size is the one thing
# this end has to do: the store is written to disk, and nothing else stops a
# caller from parking a megabyte in it.
MAX_SETTINGS_BYTES = 4096


def _store(hass: HomeAssistant) -> Store:
    """Return the single store, creating it on first use."""
    data = hass.data.setdefault(DOMAIN, {})
    store = data.get(DATA_STORE)
    if store is None:
        store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        data[DATA_STORE] = store
    return store


async def _read_all(hass: HomeAssistant) -> dict[str, Any]:
    """Return the stored mapping of user id to settings."""
    stored = await _store(hass).async_load()
    if not isinstance(stored, dict):
        return {}
    users = stored.get("users")
    return users if isinstance(users, dict) else {}


@callback
def async_register_settings_api(hass: HomeAssistant) -> None:
    """Register the two websocket commands, once per Home Assistant run.

    Guarded by a flag like the panel itself: a second battery must not register
    the same command twice, which raises.
    """
    data = hass.data.setdefault(DOMAIN, {})
    if data.get(DATA_COMMANDS_REGISTERED):
        return

    websocket_api.async_register_command(hass, websocket_get_settings)
    websocket_api.async_register_command(hass, websocket_set_settings)
    data[DATA_COMMANDS_REGISTERED] = True


@websocket_api.websocket_command({vol.Required("type"): WS_GET})
@websocket_api.async_response
async def websocket_get_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return this user's panel settings, or an empty object when there are none.

    Empty is not an error: it is what a user who has never saved anything looks
    like, and the panel treats it as its cue to adopt whatever the browser was
    holding before the settings moved here.
    """
    users = await _read_all(hass)
    settings = users.get(connection.user.id)
    connection.send_result(msg["id"], settings if isinstance(settings, dict) else {})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SET,
        vol.Required("settings"): dict,
    }
)
@websocket_api.async_response
async def websocket_set_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace this user's panel settings."""
    settings = msg["settings"]

    if len(str(settings)) > MAX_SETTINGS_BYTES:
        connection.send_error(
            msg["id"], websocket_api.ERR_INVALID_FORMAT, "settings object too large"
        )
        return

    users = dict(await _read_all(hass))
    users[connection.user.id] = settings
    await _store(hass).async_save({"users": users})
    connection.send_result(msg["id"])
