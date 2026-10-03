"""
Main integration setup for Marstek Modbus Suite component.

Handles setting up and unloading config entries, initializing
the data coordinator, and forwarding setup to sensor and select platforms.
"""

import logging

import homeassistant.helpers.config_validation as cv
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ConfigEntryError
from homeassistant.helpers import entity_registry as er

from .const import (
    DOMAIN,
    LEGACY_DEVICE_VERSIONS,
    RENAMED_KEYS,
    migrate_dev_registers_options,
)
from .coordinator import MarstekCoordinator
from .panel import async_register_panel, async_remove_panel_if_unused
from .services import async_register_services
from .websocket import async_register_websocket_commands
from .const import SUPPORTED_VERSIONS

_LOGGER = logging.getLogger(__name__)

# The integration is set up from config entries only. Declaring that here is
# what tells Home Assistant - and hassfest - that a `marstek_modbus:` block in
# configuration.yaml is a mistake rather than something we forgot to read.
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

PLATFORMS = [
    "sensor",
    "switch",
    "select",
    "button",
    "number",
    "binary_sensor",
] 


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """
    General setup of the integration.

    This is called once when Home Assistant starts.
    It registers the integration's services (see services.py) and the
    websocket commands the panel writes through (see websocket.py), and always
    returns True.

    Args:
        hass: Home Assistant instance.
        config: Configuration dict.

    Returns:
        True always.
    """
    async_register_services(hass)
    async_register_websocket_commands(hass)
    return True


@callback
def async_migrate_renamed_entities(hass: HomeAssistant, entry: ConfigEntry) -> int:
    """Move registry entries of renamed keys to their new unique ids.

    The unique id is "<entry id>_<key>". Without this, renaming a key in a
    register map leaves the old entity orphaned and creates a new one with a
    new entity id and no history. Moving the unique id keeps the entity id,
    the history and whatever the user customised; the entity only picks up
    its new translated name. Runs before the platforms are set up, so the
    entities are created against the moved entries.

    Only the register map of this entry decides: the other models still use
    the old keys. An entry whose new unique id is already taken is left
    alone rather than overwritten. Returns the number of moved entries.
    """
    version = (entry.data.get("device_version") or "").strip().lower()
    version = LEGACY_DEVICE_VERSIONS.get(version, version)
    renames = RENAMED_KEYS.get(version)
    if not renames:
        return 0

    registry = er.async_get(hass)
    prefix = f"{entry.entry_id}_"
    moved = 0
    for entity_entry in er.async_entries_for_config_entry(registry, entry.entry_id):
        unique_id = entity_entry.unique_id or ""
        if not unique_id.startswith(prefix):
            continue
        new_key = renames.get(unique_id[len(prefix):])
        if new_key is None:
            continue
        new_unique_id = f"{prefix}{new_key}"
        taken = registry.async_get_entity_id(
            entity_entry.domain, entity_entry.platform, new_unique_id
        )
        if taken:
            _LOGGER.warning(
                "Not migrating %s to %s: that unique id already belongs to %s",
                entity_entry.entity_id,
                new_unique_id,
                taken,
            )
            continue
        registry.async_update_entity(entity_entry.entity_id, new_unique_id=new_unique_id)
        moved += 1
        _LOGGER.info(
            "Migrated %s from key '%s' to '%s'",
            entity_entry.entity_id,
            unique_id[len(prefix):],
            new_key,
        )
    return moved


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """
    Set up a config entry.

    Initializes the coordinator for this entry and stores it in hass.data.
    Forwards setup to platforms (e.g., sensor, select) used by this integration.

    Args:
        hass: Home Assistant instance.
        entry: ConfigEntry to setup.

    Returns:
        True if setup successful.

    Does no network I/O: connecting and the first poll cycle run in the
    background, so an unreachable device leaves the entry loaded with its
    entities unavailable until it answers.

    Raises:
        ConfigEntryError: if the entry itself is unusable and needs the user.
    """
    # Migrate legacy device_version tokens in existing config entries to
    # the canonical SUPPORTED_VERSIONS strings. This handles older
    # installations that used tokens like 'v1/v2' or 'v3'.
    raw_version = (entry.data.get("device_version") or "").strip()
    if raw_version:
        normalized = raw_version.lower()
        # Consider anything not listed in SUPPORTED_VERSIONS as legacy/unsupported.
        allowed = {s.lower() for s in SUPPORTED_VERSIONS}
        if normalized not in allowed:
            _LOGGER.warning(
                "Config entry %s uses unsupported device_version '%s'. Please remove and re-add the device with the correct device version. Supported versions: %s",
                entry.entry_id,
                raw_version,
                ", ".join(SUPPORTED_VERSIONS),
            )

    # The two DEV switches were merged into one. Fold the obsolete keys into the
    # single flag before the coordinator reads the options; idempotent, and it
    # changes no unique_id because the flag keeps the same entities loaded.
    migrated = migrate_dev_registers_options(entry.options)
    if migrated is not None:
        hass.config_entries.async_update_entry(entry, options=migrated)

    # Create the coordinator for data management and attempt an initial
    # connection before forwarding platform setup so the client is ready.
    try:
        coordinator = MarstekCoordinator(hass, entry)
    except ValueError as err:
        # Missing host/port: retrying will not help, the user has to reconfigure.
        raise ConfigEntryError(str(err)) from err

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator

    # Renamed keys keep their entities: move the registry entries before any
    # platform creates an entity under the new key.
    try:
        async_migrate_renamed_entities(hass, entry)
    except Exception as err:  # noqa: BLE001 - a failed rename must not stop setup
        _LOGGER.warning("Could not migrate renamed entities of %s: %s", entry.entry_id, err)

    platforms_forwarded = False
    try:
        # Load register definitions off the event loop to avoid blocking
        try:
            await coordinator.async_load_registers(entry.data.get("device_version"))
        except Exception as err:
            _LOGGER.warning("Failed loading register definitions for entry %s: %s", entry.entry_id, err)

        # No connection here: the first poll cycle makes it, in the background
        # (see the end of this function), so neither a slow nor an unreachable
        # device holds up the setup.
        #
        # A paused entry does not connect at all: connecting would wake the
        # device a pause exists to leave alone. It loads with no traffic at
        # all, which is what makes the mode usable over a winter.
        if coordinator.polling_paused:
            _LOGGER.info(
                "Polling is paused for %s:%d, setting up without connecting",
                coordinator.host,
                coordinator.port,
            )

        # Forward setup to all platforms defined in PLATFORMS.
        #
        # The flag is set BEFORE the await on purpose: if the forward is
        # cancelled or one platform raises half-way, the platforms that did
        # register must still be unloaded below. Otherwise the retry that Home
        # Assistant schedules dies with "... has already been setup!" on every
        # platform and the entry ends up loaded but never polling.
        platforms_forwarded = True
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

        # The sidebar panel belongs to the integration, not to one device: this
        # is a no-op once a second entry arrives.
        try:
            await async_register_panel(hass)
        except Exception as err:  # noqa: BLE001 - the panel is optional
            _LOGGER.warning("Could not register the sidebar panel: %s", err)
    except BaseException:
        # Do not leave a half-set-up entry (platforms, an open socket) behind
        # when Home Assistant retries the setup later. BaseException on
        # purpose: Home Assistant cancels a setup that runs into its timeout,
        # and a cancellation is not an Exception. Every cleanup step is guarded so
        # that one failing step cannot skip the next, and the original error
        # is always the one that propagates.
        if platforms_forwarded:
            try:
                await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
            except Exception as err:  # noqa: BLE001 - cleanup must go on
                _LOGGER.warning(
                    "Could not unload platforms of %s after a failed setup: %s",
                    entry.entry_id,
                    err,
                )
        try:
            await coordinator.async_close()
        except Exception as err:  # noqa: BLE001 - cleanup must go on
            _LOGGER.warning(
                "Could not close the coordinator of %s after a failed setup: %s",
                entry.entry_id,
                err,
            )
        # Only drop our own coordinator: a newer attempt may already have
        # replaced it.
        if hass.data.get(DOMAIN, {}).get(entry.entry_id) is coordinator:
            hass.data[DOMAIN].pop(entry.entry_id, None)
        raise

    # The first poll cycle is not awaited. It used to be, and it held up Home
    # Assistant's whole start for as long as reading every enabled value took
    # (up to 55 s against a slow simulated device, about 90 s in the field).
    # It runs as a background task of the entry instead: the entities stay
    # unavailable until their first value arrives, the fast values first.
    # Started last, so a failed setup never leaves it behind.
    if not coordinator.polling_paused:
        coordinator.async_start_first_refresh()

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """
    Unload a config entry and its associated platforms.

    Args:
        hass: Home Assistant instance.
        entry: ConfigEntry to unload.

    Returns:
        True if unload successful, False otherwise.
    """
    try:
        # Unload all platforms for the entry
        unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

        if unload_ok:
            # Retrieve the coordinator and close it before removing
            coordinator = hass.data[DOMAIN][entry.entry_id]
            # Home Assistant cancels the entry's background tasks only after
            # this returns; a first cycle still running would reconnect the
            # socket closed below and leave it open.
            await coordinator.async_cancel_first_refresh()
            await coordinator.async_close()
            # An open repair issue belongs to a loaded entry; without this it
            # would outlive the integration with no way left to act on it.
            coordinator._async_clear_rs485_control_mode_issue()
            # Remove coordinator reference from hass data
            hass.data[DOMAIN].pop(entry.entry_id, None)

        return unload_ok
    except Exception as err:
        _LOGGER.error("Error unloading entry %s: %s", entry.entry_id, err)
        return False


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Drop the sidebar panel when the last battery is deleted.

    Unloading is not the same as removing: Home Assistant unloads an entry on
    every reload and every options change, and the panel has to survive those.
    """
    hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    async_remove_panel_if_unused(hass)
