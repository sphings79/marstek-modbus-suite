"""Websocket commands the panel writes through.

marstek_modbus/set_wifi
    The Wi-Fi credentials, through the same validation and write sequence as
    the service set_wifi (services.async_set_wifi). The point of a command of
    its own: Home Assistant stores every service call with its data as a
    call_service event in the recorder database, and with it the password. A
    websocket command is not recorded.

marstek_modbus/press_button
    A button press with the two-step confirmation done here rather than by the
    entity. A call without a token for a button that needs a confirmation
    writes nothing and answers with the warning and a one-time token; a call
    with that token inside the window writes once. The token is bound to the
    entity and to the connection and user that armed it, and it lives apart
    from the entity's own two-press state, so a press in Home Assistant's UI
    shortly before cannot turn the panel's first click into a write. Nothing
    here raises for the expected first step, so Home Assistant logs no error
    for it either (its call_service path logs every ServiceValidationError).

Both are admin-only. Errors are sent with the translation key and placeholders
of the integration's exceptions, so the panel can show them in the user's
language.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import async_get_platforms
from homeassistant.helpers.translation import async_get_translations

from .button import MarstekButton
from .const import BUTTON_CONFIRM_WINDOW, DOMAIN
from .services import async_set_wifi

_LOGGER = logging.getLogger(__name__)

WS_SET_WIFI = f"{DOMAIN}/set_wifi"
WS_PRESS_BUTTON = f"{DOMAIN}/press_button"

ERR_CONFIRM_EXPIRED = "confirm_expired"


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register the commands; called once per run from async_setup."""
    websocket_api.async_register_command(hass, websocket_set_wifi)
    websocket_api.async_register_command(hass, websocket_press_button)


def _send_translated_error(
    connection: websocket_api.ActiveConnection,
    msg_id: int,
    code: str,
    err: HomeAssistantError,
) -> None:
    connection.send_error(
        msg_id,
        code,
        str(err),
        translation_domain=err.translation_domain,
        translation_key=err.translation_key,
        translation_placeholders=err.translation_placeholders,
    )


def _send_key_error(
    connection: websocket_api.ActiveConnection,
    msg_id: int,
    code: str,
    translation_key: str,
    message: str,
) -> None:
    connection.send_error(
        msg_id,
        code,
        message,
        translation_domain=DOMAIN,
        translation_key=translation_key,
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SET_WIFI,
        vol.Required("device_id"): str,
        vol.Required("ssid"): str,
        vol.Optional("password", default=""): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_set_wifi(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Write the Wi-Fi credentials of one battery.

    The password is passed on and nowhere else: not logged, not echoed, not
    part of any error.
    """
    try:
        await async_set_wifi(hass, [msg["device_id"]], msg["ssid"], msg["password"])
    except ServiceValidationError as err:
        _send_translated_error(
            connection, msg["id"], websocket_api.ERR_SERVICE_VALIDATION_ERROR, err
        )
        return
    except HomeAssistantError as err:
        _send_translated_error(
            connection, msg["id"], websocket_api.ERR_HOME_ASSISTANT_ERROR, err
        )
        return
    connection.send_result(msg["id"])


def _find_button(hass: HomeAssistant, entity_id: str) -> MarstekButton | None:
    """The loaded button entity of this integration behind entity_id, if any."""
    for platform in async_get_platforms(hass, DOMAIN):
        if platform.domain != "button":
            continue
        entity = platform.entities.get(entity_id)
        if isinstance(entity, MarstekButton):
            return entity
    return None


async def _warning_text(hass: HomeAssistant, key: str, seconds: int) -> str:
    """The warning in the server's language, for a client without translations."""
    texts = await async_get_translations(hass, hass.config.language, "exceptions", {DOMAIN})
    text = texts.get(f"component.{DOMAIN}.exceptions.{key}.message", "")
    return text.replace("{seconds}", str(seconds))


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_PRESS_BUTTON,
        vol.Required("entity_id"): str,
        vol.Optional("confirm_token"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_press_button(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Press a button of this integration, with the panel's two-step confirmation."""
    msg_id = msg["id"]
    entity_id = msg["entity_id"]

    entry = er.async_get(hass).async_get(entity_id)
    if entry is None or entry.platform != DOMAIN or entry.domain != "button":
        connection.send_error(
            msg_id, websocket_api.ERR_NOT_FOUND, "not a Marstek Modbus button"
        )
        return
    if entry.disabled_by is not None:
        _send_key_error(
            connection,
            msg_id,
            websocket_api.ERR_NOT_ALLOWED,
            "press_disabled",
            "the button entity is disabled",
        )
        return
    button = _find_button(hass, entity_id)
    if button is None:
        connection.send_error(
            msg_id, websocket_api.ERR_NOT_FOUND, "button entity not loaded"
        )
        return
    if not button.available:
        _send_key_error(
            connection,
            msg_id,
            websocket_api.ERR_HOME_ASSISTANT_ERROR,
            "press_unavailable",
            "the battery is unavailable or paused",
        )
        return

    # The token belongs to this connection and this user; the entity is bound
    # by the token living on it.
    owner = (connection.user.id if connection.user else None, id(connection))
    token = msg.get("confirm_token")

    if button.needs_confirm:
        if token is None:
            key = button.confirm_translation_key
            placeholders = {"seconds": str(BUTTON_CONFIRM_WINDOW)}
            connection.send_result(
                msg_id,
                {
                    "needs_confirm": True,
                    "token": button.async_arm(owner),
                    "expires_in": BUTTON_CONFIRM_WINDOW,
                    "warning": await _warning_text(hass, key, BUTTON_CONFIRM_WINDOW),
                    "translation_domain": DOMAIN,
                    "translation_key": key,
                    "translation_placeholders": placeholders,
                },
            )
            return
        if not button.async_consume_token(token, owner):
            _send_key_error(
                connection,
                msg_id,
                ERR_CONFIRM_EXPIRED,
                "press_confirm_expired",
                "the confirmation is unknown, expired or already used; nothing was written",
            )
            return

    if not await button.async_press_confirmed():
        _send_key_error(
            connection,
            msg_id,
            websocket_api.ERR_HOME_ASSISTANT_ERROR,
            "press_write_failed",
            "writing the command failed",
        )
        return
    connection.send_result(msg_id, {"needs_confirm": False, "written": True})
