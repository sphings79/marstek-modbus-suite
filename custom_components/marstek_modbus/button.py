"""
This module defines a ButtonEntity for triggering actions on a Marstek Venus battery
via Modbus register writes.

A definition with `confirm: true` needs two presses: the first one only raises
the warning from the `exceptions` translations (`confirm_<key>`), a second
press within BUTTON_CONFIRM_WINDOW seconds writes the command. A definition can
name another warning with `confirm_key`, for a model whose effect of the same
button differs from the others' (the factory reset of the Venus E v3). Home Assistant
has no confirmation step of its own for button entities, and a factory reset
should not be one stray tap away.

The panel does not go through that two-press state. It uses the websocket
command marstek_modbus/press_button (websocket.py): its first call arms a
one-time token on the entity (async_arm) and writes nothing, its second call
hands the token back (async_consume_token) and writes through
async_press_confirmed. The tokens are bound to the caller and kept apart from
the entity's own armed state, so a press in the Home Assistant UI neither arms
nor disarms the panel and the panel neither arms nor disarms the entity.
"""

import asyncio
import contextvars
import logging
import secrets
import time

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .coordinator import MarstekCoordinator
from .const import BUTTON_CONFIRM_WINDOW, DOMAIN, MANUFACTURER, MODEL

_LOGGER = logging.getLogger(__name__)

# Set for the duration of async_press_confirmed. A context variable rather than
# an attribute: async_press runs inside Home Assistant's _async_press_action in
# the same task, and a service press of the same entity running concurrently
# in another task must not see the panel's bypass or its result.
_CONFIRMED_PRESS: contextvars.ContextVar[dict | None] = contextvars.ContextVar(
    "marstek_modbus_confirmed_press", default=None
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
):
    """
    Set up the MarstekButton entities using the provided config entry.

    Retrieves the coordinator and creates button entities
    from the button definitions, then adds them to Home Assistant.
    Also registers the entity type in the coordinator to skip polling for buttons.
    """
    # Retrieve the coordinator instance from hass data and add entities
    coordinator = hass.data[DOMAIN][entry.entry_id]
    # DEV buttons are only loaded with the "Show DEV registers" option;
    # getattr keeps an older coordinator without the attribute working.
    definitions = list(coordinator.BUTTON_DEFINITIONS) + list(
        getattr(coordinator, "DEV_BUTTON_DEFINITIONS", []) or []
    )
    entities = [MarstekButton(coordinator, definition) for definition in definitions]
    async_add_entities(entities)


class MarstekButton(ButtonEntity):
    """ButtonEntity to trigger actions on the Marstek Venus battery."""

    def __init__(self, coordinator: MarstekCoordinator, definition: dict):
        """
        Initialize the button entity.

        Args:
            coordinator: Data update coordinator instance.
            definition: Dictionary with button configuration.
        """
        # Store the coordinator
        self.coordinator = coordinator
        self._key = definition["key"]
        self.definition = definition
        self._command = definition.get("command", 1)  # default command value
        self._register = definition["register"]
        # Two-step press for dangerous commands, see the module docstring.
        self._confirm = definition.get("confirm") is True
        self._confirm_key = definition.get("confirm_key") or self._key
        self._armed_at: float | None = None
        # The panel's one-time tokens: token -> (owner, monotonic expiry).
        self._panel_tokens: dict[str, tuple[object, float]] = {}

        # Register entity type in coordinator
        self.coordinator._entity_types[self._key] = "button"

        # Set entity attributes from definition
        self._attr_unique_id = f"{coordinator.config_entry.entry_id}_{self._key}"
        self._attr_has_entity_name = True
        self._attr_translation_key = definition["key"]

        # Optional: set entity category
        if "category" in self.definition:
            self._attr_entity_category = EntityCategory(self.definition.get("category"))

        # Optional: set icon
        if "icon" in self.definition:
            self._attr_icon = self.definition.get("icon")

        # Optional: disable entity by default
        if definition.get("enabled_by_default") is False:
            self._attr_entity_registry_enabled_default = False

    @property
    def entity_type(self) -> str:
        """
        Return the type of this entity for logging purposes.
        This allows the coordinator to show more descriptive messages.
        """
        return "button"

    @property
    def available(self) -> bool:
        """
        Return True if the coordinator has successfully fetched data.

        A paused entry offers no controls: writing would reopen the connection
        and wake the battery the pause was meant to leave alone.
        """
        return self.coordinator.controls_available and self.coordinator.last_update_success

    def _confirmed(self) -> bool:
        """Return True on the second press within the window, arm on the first.

        Home Assistant records the press time as the button state before this
        runs, so the first press still shows up as pressed; it writes nothing.
        """
        now = time.monotonic()
        if self._armed_at is not None and now - self._armed_at <= BUTTON_CONFIRM_WINDOW:
            self._armed_at = None
            return True
        self._armed_at = now
        return False

    @property
    def needs_confirm(self) -> bool:
        """True for a button whose press needs a second, confirming step."""
        return self._confirm

    @property
    def confirm_translation_key(self) -> str:
        """The exceptions entry that holds this button's warning."""
        return f"confirm_{self._confirm_key}"

    def _purge_tokens(self, now: float) -> None:
        self._panel_tokens = {
            token: (owner, expires)
            for token, (owner, expires) in self._panel_tokens.items()
            if expires >= now
        }

    def async_arm(self, owner: object) -> str:
        """Arm the panel's confirmation for `owner` and return its one-time token.

        Writes nothing and leaves the entity's own two-press state alone. A
        previous token of the same owner is replaced.
        """
        now = time.monotonic()
        self._purge_tokens(now)
        self._panel_tokens = {
            token: entry for token, entry in self._panel_tokens.items() if entry[0] != owner
        }
        token = secrets.token_urlsafe(24)
        self._panel_tokens[token] = (owner, now + BUTTON_CONFIRM_WINDOW)
        _LOGGER.info(
            "Button '%s' armed from the panel - confirm within %d s to write register %s",
            self._key,
            BUTTON_CONFIRM_WINDOW,
            self._register,
        )
        return token

    def async_consume_token(self, token: str, owner: object) -> bool:
        """Return True once for a valid token of `owner` inside the window.

        A valid token is invalidated by the check. An unknown, expired or
        reused token, or one armed by another caller, returns False and leaves
        everything else as it was.
        """
        self._purge_tokens(time.monotonic())
        entry = self._panel_tokens.get(token)
        if entry is None or entry[0] != owner:
            return False
        del self._panel_tokens[token]
        return True

    async def async_press_confirmed(self) -> bool:
        """Write the command now, without the entity's two-press step.

        For the panel's websocket command after its own confirmation (or for a
        button that needs none). Goes through Home Assistant's press action so
        the button's state records the press like any other. Returns whether
        the write succeeded.
        """
        result = {"ok": False}
        reset = _CONFIRMED_PRESS.set(result)
        try:
            await self._async_press_action()
        finally:
            _CONFIRMED_PRESS.reset(reset)
        return result["ok"]

    async def async_press(self) -> None:
        """
        Handle button press by writing the specified value to the Modbus register.
        """
        confirmed = _CONFIRMED_PRESS.get()
        if confirmed is None and self._confirm and not self._confirmed():
            _LOGGER.info(
                "Button '%s' armed - press again within %d s to write register %s",
                self._key,
                BUTTON_CONFIRM_WINDOW,
                self._register,
            )
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key=self.confirm_translation_key,
                translation_placeholders={"seconds": str(BUTTON_CONFIRM_WINDOW)},
            )

        success = await self._async_write_command()
        if confirmed is not None:
            confirmed["ok"] = success

    async def _async_write_command(self) -> bool:
        """Write the command value to the register; True on success."""
        # Write the command value to the Modbus register asynchronously
        success = await self.coordinator.async_write_value(
            register=self._register,
            value=self._command,
            key=self._key,
            scale=self.definition.get("scale", 1),
            unit=self.definition.get("unit"),
            entity_type=self.entity_type,
        )

        if success:
            _LOGGER.debug(
                "Successfully wrote value %s to register %s on button press",
                self._command,
                self._register,
            )

            # Wait briefly to allow the device to process the change
            await asyncio.sleep(0.5)
            # Request coordinator to refresh data
            await self.coordinator.async_request_refresh()
        else:
            _LOGGER.warning(
                "Failed to write value %s to register %s on button press",
                self._command,
                self._register,
            )
        return bool(success)

    @property
    def device_info(self) -> dict:
        """
        Return device information for Home Assistant's device registry.
        Includes identifiers, name, manufacturer, model, and entry type.
        """
        return {
            "identifiers": {(DOMAIN, self.coordinator.config_entry.entry_id)},
            "name": self.coordinator.config_entry.title,
            "manufacturer": MANUFACTURER,
            "model": MODEL,
            "entry_type": "service",
        }