"""Config flow for Marstek Modbus Suite integration."""
import asyncio
import logging
import socket

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.const import CONF_HOST, CONF_NAME, CONF_PORT
from homeassistant.helpers import selector
from homeassistant.helpers.device_registry import format_mac
from homeassistant.helpers.translation import async_get_translations
from homeassistant.util import slugify

from .const import (
    BEACON_MODEL_VERSIONS,
    CONF_DEV_REGISTERS_DUPLICATE,
    CONF_DEV_REGISTERS_LEGACY,
    CONF_DEV_REGISTERS_UNKNOWN,
    discovery_manual_label,
    CONF_DISCHARGE_FLOOR,
    DEFAULT_DISCHARGE_FLOOR,
    CONF_MESSAGE_WAIT_MS,
    DEFAULT_DEV_REGISTERS,
    DEFAULT_DEVICE_NAME,
    DEFAULT_MESSAGE_WAIT_MS,
    DEFAULT_PORT,
    DEFAULT_SCAN_INTERVALS,
    DEFAULT_UNIT_ID,
    DEVICE_NAME_DEFAULTS,
    DEVICE_VERSION_LABELS,
    DOMAIN,
    min_scan_intervals,
    polling_doc_url,
    MAX_PACK_COUNT,
    CONF_PACK_COUNT,
    PACK_COUNT_AUTO,
    PACK_COUNT_VERSIONS,
    SUPPORTED_VERSIONS,
)
from .helpers.discovery import async_listen
from .helpers.modbus_client import MarstekModbusClient

_LOGGER = logging.getLogger(__name__)

CONF_DEVICE_VERSION = "device_version"
CONF_UNIT_ID = "unit_id"

# Schema constants for reusable form definitions
SCHEMA_HOST_BASE = vol.Schema(
    {
        vol.Required(CONF_HOST): str,
        vol.Optional(CONF_PORT, default=DEFAULT_PORT): int,
        vol.Optional(CONF_UNIT_ID, default=DEFAULT_UNIT_ID): vol.Coerce(int),
    }
)

# Connection options: the host fields plus the request pacing. The pacing is
# deliberately absent from the initial setup form - the default is right for
# every device tested, and it only needs raising when a gateway chokes.
SCHEMA_CONNECTION = SCHEMA_HOST_BASE.extend(
    {
        vol.Optional(
            CONF_MESSAGE_WAIT_MS, default=DEFAULT_MESSAGE_WAIT_MS
        ): vol.All(vol.Coerce(int), vol.Clamp(min=0, max=1000)),
    }
)

# The version picker. A plain vol.In would put the stored identifiers on screen
# - "D", "E v1/v2" - so the options carry their product name as a label instead.
DEVICE_VERSION_SELECTOR = selector.SelectSelector(
    selector.SelectSelectorConfig(
        options=[
            selector.SelectOptionDict(
                value=version, label=DEVICE_VERSION_LABELS.get(version, version)
            )
            for version in SUPPORTED_VERSIONS
        ],
        mode=selector.SelectSelectorMode.DROPDOWN,
    )
)


def _polling_schema(version):
    """Seconds pickers for one device version, floored at what its map can keep up with.

    Number boxes rather than free fields: the minimum is then visible in the
    dialog and unreachable by typing, instead of a value that silently becomes
    something else on save. The floors come from the register count of that
    model - see MIN_SCAN_INTERVALS.
    """
    floors = min_scan_intervals(version)

    def box(key):
        return vol.All(
            selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=floors[key],
                    max=3600,
                    step=1,
                    unit_of_measurement="s",
                    mode=selector.NumberSelectorMode.BOX,
                )
            ),
            vol.Coerce(int),
            vol.Clamp(min=floors[key], max=3600),
        )

    return vol.Schema(
        {
            vol.Required("high"): box("high"),
            vol.Required("low"): box("low"),
            vol.Required("ultra"): box("ultra"),
        }
    )


SCHEMA_LIMITS = vol.Schema(
    {
        vol.Required(CONF_DISCHARGE_FLOOR): vol.All(
            vol.Coerce(float), vol.Clamp(min=0, max=100)
        ),
    }
)

# 0 is "work it out from the readings", 1 to 7 pins it and stops the blocks
# above being polled.
SCHEMA_PACKS = vol.Schema(
    {
        vol.Required(CONF_PACK_COUNT): vol.All(
            vol.Coerce(int), vol.Clamp(min=PACK_COUNT_AUTO, max=MAX_PACK_COUNT)
        ),
    }
)


class MarstekConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the configuration flow for the Marstek Modbus Suite integration."""

    VERSION = 1

    MANUAL = "manual"

    def __init__(self):
        """Initialise the flow with no connection details gathered yet."""
        self._connection: dict | None = None
        # None means "not listened yet", {} means "listened, nothing answered".
        self._discovered: dict | None = None
        self._prefill: dict = {}
        self._beacon_mac: str | None = None

    async def async_step_user(self, user_input=None):
        """Offer what announced itself on the network, then ask for the details.

        A Venus broadcasts its model, MAC and address once a second, so the
        first thing this does is listen. Whatever answers is offered as a
        choice; picking one fills the form in and leaves every field editable,
        which is what somebody reaching their battery through a Modbus proxy
        needs - the beacon names the battery's own address, not the proxy's.

        Listening happens once per flow. Coming back to this step after a bad
        password or an unreachable host should not cost another four seconds.
        """
        if user_input is None and self._discovered is None:
            self._discovered = await async_listen(self.hass)
            if self._discovered:
                return await self.async_step_pick()

        return await self._async_connection_form(user_input)

    async def async_step_pick(self, user_input=None):
        """Let the user choose one of the devices that announced itself."""
        if user_input is not None:
            choice = user_input[CONF_DEVICE_VERSION]
            if choice != self.MANUAL:
                beacon = self._discovered.get(choice)
                if beacon:
                    self._prefill = {
                        CONF_HOST: beacon.host,
                        CONF_PORT: DEFAULT_PORT,
                        CONF_UNIT_ID: DEFAULT_UNIT_ID,
                    }
                    version = BEACON_MODEL_VERSIONS.get(beacon.model)
                    if version:
                        self._prefill[CONF_DEVICE_VERSION] = version
                    self._beacon_mac = beacon.formatted_mac
            return await self._async_connection_form(None)

        options = [
            selector.SelectOptionDict(
                value=key,
                label=f"{DEVICE_VERSION_LABELS.get(BEACON_MODEL_VERSIONS.get(b.model, ''), b.model)}"
                      f" · {b.host} · {b.formatted_mac}",
            )
            for key, b in sorted(self._discovered.items(), key=lambda kv: kv[1].host)
        ]
        # The device rows are labelled with the addresses found a moment ago,
        # which makes them option dicts - and an option dict carries its own
        # label rather than looking one up, so the way out needs one too.
        options.append(
            selector.SelectOptionDict(
                value=self.MANUAL,
                label=discovery_manual_label(self.hass.config.language),
            )
        )

        return self.async_show_form(
            step_id="pick",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_DEVICE_VERSION, default=options[0]["value"]):
                        selector.SelectSelector(
                            selector.SelectSelectorConfig(
                                options=options,
                                mode=selector.SelectSelectorMode.LIST,
                            )
                        )
                }
            ),
            description_placeholders={"count": str(len(self._discovered))},
        )

    async def _async_connection_form(self, user_input=None):
        """The connection details, whether they were discovered or typed."""
        errors = {}

        # Extend base schema with device_version for initial config
        user_schema = SCHEMA_HOST_BASE.extend(
            {vol.Required(CONF_DEVICE_VERSION): DEVICE_VERSION_SELECTOR}
        )

        if user_input is not None:
            host = user_input.get(CONF_HOST)
            port = user_input.get(CONF_PORT, DEFAULT_PORT)
            device_version = user_input.get(
                CONF_DEVICE_VERSION, SUPPORTED_VERSIONS[0]
            )
            unit_id = user_input.get(CONF_UNIT_ID, DEFAULT_UNIT_ID)

            # Validate port and unit_id ranges
            if not (1 <= port <= 65535):
                errors["base"] = "invalid_port"
            elif not (1 <= unit_id <= 255):
                errors["base"] = "invalid_unit_id"

            if errors:
                # Re-show form with preserved user input
                return self.async_show_form(
                    step_id="user",
                    data_schema=self.add_suggested_values_to_schema(
                        user_schema, user_input
                    ),
                    errors=errors,
                )

            # Validate the host by resolving it to an IP address
            try:
                socket.gethostbyname(host)
            except (socket.gaierror, TypeError):
                errors["base"] = "invalid_host"
            else:
                # Prevent duplicate entries for same host, port and unit_id
                for entry in self._async_current_entries():
                    if (
                        entry.data.get(CONF_HOST) == host
                        and entry.data.get(CONF_PORT) == port
                        and entry.data.get(CONF_UNIT_ID) == unit_id
                    ):
                        return self.async_abort(reason="already_configured")

                # Test Modbus connection including unit_id validation
                errors["base"] = await async_test_modbus_connection(
                    host, port, unit_id
                )

                # Connection is good - move on to naming the device
                if not errors["base"]:
                    self._connection = {
                        CONF_HOST: host,
                        CONF_PORT: port,
                        CONF_DEVICE_VERSION: device_version,
                        CONF_UNIT_ID: unit_id,
                    }
                    return await self.async_step_name()

        return self.async_show_form(
            step_id="user",
            data_schema=self.add_suggested_values_to_schema(
                user_schema, user_input or self._prefill
            ),
            errors=errors,
        )

    async def async_step_name(self, user_input=None):
        """Name the device.

        The name becomes the config entry title, and the title is what the
        device and every entity id is named after. Letting the user set it here
        is the only chance to get the entity ids right: Home Assistant derives
        them once, when an entity is first registered, and a later rename only
        changes the display name.

        This is also the migration path away from the upstream integration.
        Both ship the same domain and the same entity names, so entering the
        name the old entry carried reproduces the previous entity ids exactly.
        """
        errors = {}
        connection = self._connection or {}
        default_name = DEVICE_NAME_DEFAULTS.get(
            connection.get(CONF_DEVICE_VERSION), DEFAULT_DEVICE_NAME
        )

        if user_input is not None:
            name = str(user_input.get(CONF_NAME) or "").strip() or default_name

            # Names that slugify to the same thing collide in the entity ids,
            # so compare on the slug rather than on the display string.
            slug = slugify(name)
            if any(
                slugify(entry.title or "") == slug
                for entry in self._async_current_entries()
            ):
                errors["base"] = "name_exists"
            else:
                # An entry that came from a beacon carries the MAC, so the same
                # battery cannot be set up twice even after its address changes.
                # Entries made before this existed keep no unique id: giving
                # them one would be a migration, and there is nothing to gain.
                if self._beacon_mac:
                    await self.async_set_unique_id(format_mac(self._beacon_mac))
                    self._abort_if_unique_id_configured()
                return self.async_create_entry(title=name, data=connection)

        return self.async_show_form(
            step_id="name",
            data_schema=self.add_suggested_values_to_schema(
                vol.Schema({vol.Optional(CONF_NAME, default=default_name): str}),
                user_input or {CONF_NAME: default_name},
            ),
            errors=errors,
            last_step=True,
        )

    async def async_step_reauth(self, data=None):
        """Re-authentication step for missing device_version."""
        errors = {}
        language = self.context.get("language", self.hass.config.language)
        translations = await async_get_translations(
            self.hass, language, category="config", integrations=[DOMAIN]
        )

        if data is not None:
            entry = (
                self._async_current_entries()[0]
                if self._async_current_entries()
                else None
            )
            if entry:
                try:
                    new_data = dict(entry.data)
                    new_data[CONF_DEVICE_VERSION] = data.get(CONF_DEVICE_VERSION)
                    await self.hass.config_entries.async_update_entry(
                        entry, data=new_data
                    )
                    return self.async_create_entry(
                        title=entry.title or DOMAIN, data={}
                    )
                except Exception as exc:
                    _LOGGER.error(
                        "Failed to update config entry during reauth: %s", exc
                    )
                    errors["base"] = "unknown"

        description_placeholders = {
            "device_version_choices": ", ".join(
                f"{v}: {translations.get(f'config.step.user.data.device_version|{v}', v)}"
                for v in SUPPORTED_VERSIONS
            )
        }

        return self.async_show_form(
            step_id="reauth",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_DEVICE_VERSION, default="E v1/v2"
                    ): DEVICE_VERSION_SELECTOR
                }
            ),
            errors=errors,
            description_placeholders=description_placeholders,
        )

    @staticmethod
    def async_get_options_flow(config_entry):
        """Get the options flow for this handler."""
        return MarstekOptionsFlow(config_entry)


class MarstekOptionsFlow(config_entries.OptionsFlow):
    """Handle Marstek Modbus Suite options flow."""

    def __init__(self, config_entry):
        """Initialize options flow."""
        self._config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Manage the options flow by delegating to a menu step."""
        return await self.async_step_menu()

    async def async_step_menu(self, user_input=None):
        """Show the options menu.

        The pack entry only appears on the models that stack more than one, so
        an E owner is not asked a question that has one possible answer.
        """
        options = ["connection", "polling", "limits"]
        if self._has_pack_family():
            options.append("packs")
        options.append("dev")
        return self.async_show_menu(step_id="menu", menu_options=options)

    def _has_pack_family(self) -> bool:
        """Return True when this entry's model carries per-pack registers."""
        version = self._config_entry.data.get(CONF_DEVICE_VERSION) or ""
        return str(version).strip().lower() in PACK_COUNT_VERSIONS

    async def async_step_packs(self, user_input=None):
        """Configure how many battery packs are stacked."""
        config = self._config_entry

        if user_input is not None:
            self.hass.config_entries.async_update_entry(
                config, options={**config.options, **user_input}
            )
            # The coordinator reads the count once at startup and builds its
            # poll list from it, so the entry has to be reloaded.
            await self.hass.config_entries.async_reload(config.entry_id)
            return await self.async_step_menu()

        current = config.options.get(CONF_PACK_COUNT, PACK_COUNT_AUTO)
        return self.async_show_form(
            step_id="packs",
            data_schema=self.add_suggested_values_to_schema(
                SCHEMA_PACKS, {CONF_PACK_COUNT: current}
            ),
            last_step=True,
        )

    async def async_step_polling(self, user_input=None):
        """Configure polling scan intervals."""
        errors = {}
        config = self._config_entry

        legacy_options = config.options or {}
        normalized_options = dict(legacy_options)
        if "high" not in normalized_options and "medium" in normalized_options:
            normalized_options["high"] = normalized_options["medium"]
        if "low" not in normalized_options and "very_low" in normalized_options:
            normalized_options["low"] = normalized_options["very_low"]

        # Get defaults from options, then data, then constants
        defaults = {
            key: normalized_options.get(
                key, config.data.get(key, DEFAULT_SCAN_INTERVALS[key])
            )
            for key in ("high", "low", "ultra")
        }

        # An entry configured before the floors existed can carry a value the
        # number box would now refuse. Raise what the form offers, so the dialog
        # opens on something it will accept instead of on a rejected field.
        floors = min_scan_intervals(config.data.get(CONF_DEVICE_VERSION))
        defaults = {
            key: max(int(value), floors.get(key, 1))
            for key, value in defaults.items()
        }

        # Calculate lowest scan interval for description
        lowest = min((user_input or defaults).values())

        if user_input is not None:
            coordinator = self.hass.data.get(DOMAIN, {}).get(config.entry_id)
            if coordinator:
                coordinator._update_scan_intervals(user_input)

            # Save and return to menu
            self.hass.config_entries.async_update_entry(
                config,
                options={
                    **{
                        key: value
                        for key, value in config.options.items()
                        if key not in {"medium", "very_low"}
                    },
                    **user_input,
                },
            )
            return await self.async_step_menu()

        return self.async_show_form(
            step_id="polling",
            data_schema=self.add_suggested_values_to_schema(
                _polling_schema(config.data.get(CONF_DEVICE_VERSION)), defaults
            ),
            errors=errors,
            description_placeholders={
                "lowest": str(lowest),
                "min_high": str(floors["high"]),
                "min_low": str(floors["low"]),
                "min_ultra": str(floors["ultra"]),
                "docs_url": polling_doc_url(self.hass.config.language),
            },
            last_step=True,
        )

    async def async_step_limits(self, user_input=None):
        """Set the lower end of the usable energy window.

        The upper end is read from the device's charge_to_soc register when it
        holds a sensible value, so only the floor needs configuring here. On
        Venus A, D and E v3 the floor itself is not exposed over Modbus at all,
        which is why it cannot simply be read back from the battery.
        """
        config = self._config_entry

        if user_input is not None:
            self.hass.config_entries.async_update_entry(
                config, options={**config.options, **user_input}
            )
            # The coordinator caches the value, so it has to be reloaded for the
            # sensors to pick the new floor up.
            await self.hass.config_entries.async_reload(config.entry_id)
            return await self.async_step_menu()

        current = config.options.get(CONF_DISCHARGE_FLOOR, DEFAULT_DISCHARGE_FLOOR)
        return self.async_show_form(
            step_id="limits",
            data_schema=self.add_suggested_values_to_schema(
                SCHEMA_LIMITS, {CONF_DISCHARGE_FLOOR: current}
            ),
            last_step=True,
        )

    async def async_step_dev(self, user_input=None):
        """DEV-Register ein- oder ausschalten.

        Zwei getrennte Gruppen zusaetzlicher Diagnose-Sensoren:

        unbekannt   Register, deren Bedeutung nicht geklaert ist - teils mit
                    Konfidenz niedrig/mittel aus der Firmware-Analyse, teils
                    Register aus dem 40000er-Bereich, die nachweislich auf
                    einen Lesezugriff antworten.
        Doppelungen Register, die denselben Wert liefern wie ein bereits
                    integrierter Sensor: Aliase auf dieselbe SRAM-Quelle,
                    Spiegelregister, Folgeregister eines mehrteiligen Blocks.

        Beide heissen "DEV <register> (<verdacht>?)" und liegen in der Kategorie
        Diagnose. Nach dem Umschalten wird der Config-Entry neu geladen, weil die
        Registerdefinitionen beim Start eingelesen werden.
        """
        config = self._config_entry
        options = config.options or {}
        # Migration: der alte Sammelschalter schaltet beide Gruppen, solange die
        # neuen Schluessel fehlen.
        legacy = bool(options.get(CONF_DEV_REGISTERS_LEGACY, DEFAULT_DEV_REGISTERS))
        current = {
            CONF_DEV_REGISTERS_UNKNOWN: bool(
                options.get(CONF_DEV_REGISTERS_UNKNOWN, legacy)
            ),
            CONF_DEV_REGISTERS_DUPLICATE: bool(
                options.get(CONF_DEV_REGISTERS_DUPLICATE, legacy)
            ),
        }

        if user_input is not None:
            new = {
                key: bool(user_input.get(key, DEFAULT_DEV_REGISTERS))
                for key in current
            }
            merged = {
                key: value
                for key, value in options.items()
                if key != CONF_DEV_REGISTERS_LEGACY
            }
            merged.update(new)
            self.hass.config_entries.async_update_entry(config, options=merged)
            if new != current:
                # Definitionen werden nur beim Setup geladen -> Reload noetig.
                self.hass.async_create_task(
                    self.hass.config_entries.async_reload(config.entry_id)
                )
            return await self.async_step_menu()

        return self.async_show_form(
            step_id="dev",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_DEV_REGISTERS_UNKNOWN,
    discovery_manual_label,
                        default=current[CONF_DEV_REGISTERS_UNKNOWN],
                    ): bool,
                    vol.Optional(
                        CONF_DEV_REGISTERS_DUPLICATE,
                        default=current[CONF_DEV_REGISTERS_DUPLICATE],
                    ): bool,
                }
            ),
            last_step=True,
        )

    async def async_step_connection(self, user_input=None):
        """Configure host, port and unit id."""
        errors = {}
        config = self._config_entry

        # Get defaults from config data
        defaults = {
            CONF_HOST: config.data.get(CONF_HOST, ""),
            CONF_PORT: config.data.get(CONF_PORT, DEFAULT_PORT),
            CONF_UNIT_ID: config.options.get(
                CONF_UNIT_ID, config.data.get(CONF_UNIT_ID, DEFAULT_UNIT_ID)
            ),
            CONF_MESSAGE_WAIT_MS: config.data.get(
                CONF_MESSAGE_WAIT_MS, DEFAULT_MESSAGE_WAIT_MS
            ),
        }

        if user_input is not None:
            host = user_input.get(CONF_HOST)
            port = user_input.get(CONF_PORT)
            unit_id = user_input.get(CONF_UNIT_ID)
            message_wait_ms = int(
                user_input.get(CONF_MESSAGE_WAIT_MS, DEFAULT_MESSAGE_WAIT_MS)
            )

            # Validate ranges
            if not (1 <= int(port) <= 65535):
                errors["base"] = "invalid_port"
            elif not (1 <= int(unit_id) <= 255):
                errors["base"] = "invalid_unit_id"

            if not errors:
                coordinator = self.hass.data.get(DOMAIN, {}).get(config.entry_id)

                # Close existing client to free resources
                if coordinator:
                    try:
                        await coordinator.async_close()
                    except Exception:
                        _LOGGER.debug(
                            "Existing coordinator client close failed or was not connected"
                        )

                # Test connection with new parameters
                try:
                    test_client = MarstekModbusClient(
                        host,
                        int(port),
                        message_wait_ms=message_wait_ms,
                        timeout=getattr(coordinator, "timeout", 3),
                        unit_id=int(unit_id),
                    )
                    connected = await test_client.async_connect()
                except Exception as exc:
                    _LOGGER.debug(
                        "Error while testing new Modbus connection: %s", exc
                    )
                    connected = False

                if not connected:
                    try:
                        await test_client.async_close()
                    except Exception:
                        pass
                    errors["base"] = "cannot_connect"
                else:
                    # Connection successful, update config and coordinator
                    try:
                        new_data = dict(config.data)
                        new_data[CONF_HOST] = host
                        new_data[CONF_PORT] = int(port)
                        new_data[CONF_UNIT_ID] = int(unit_id)
                        new_data[CONF_MESSAGE_WAIT_MS] = message_wait_ms
                        self.hass.config_entries.async_update_entry(
                            config, data=new_data
                        )

                        if coordinator:
                            coordinator.client = test_client
                            coordinator.host = host
                            coordinator.port = int(port)
                            coordinator.unit_id = int(unit_id)
                            coordinator.message_wait_ms = message_wait_ms
                            _LOGGER.info(
                                "Reconnected Modbus client to %s:%d (unit %d, %d ms between messages)",
                                host,
                                int(port),
                                int(unit_id),
                                message_wait_ms,
                            )

                            try:
                                await coordinator.async_refresh()
                            except Exception:
                                _LOGGER.debug(
                                    "Coordinator refresh after reconnect failed"
                                )

                        # Return to menu after successful connection update
                        return await self.async_step_menu()
                    except Exception as exc:
                        _LOGGER.error(
                            "Failed to update config entry for host/port/unit: %s",
                            exc,
                        )
                        errors["base"] = "unknown"

        return self.async_show_form(
            step_id="connection",
            data_schema=self.add_suggested_values_to_schema(
                SCHEMA_CONNECTION, defaults
            ),
            errors=errors,
            last_step=True,
        )


async def async_is_connection_refused(host: str, port: int, timeout: float = 3.0) -> bool:
    """Whether the host answers a TCP connect with an outright refusal.

    Worth telling apart from a timeout, because on a Venus the two mean
    different things. A timeout is the usual "wrong address, or nothing there".
    A refusal is a device that is reachable and answering, but not serving
    Modbus at that address - and there are only two ways for that to happen:

    - It is the wrong interface. Measured on a Venus D: the Modbus server lives
      on the wired side and never appears on the wireless one, not even after a
      cold start with no cable in. The device still announces itself over
      wireless, so discovery can hand out an address that refuses.
    - The one connection the device accepts is already taken, by a Modbus
      proxy or by a second integration polling the same battery.

    The probe is cheap in exactly the case it is needed: a refusal comes back
    at once and never occupies the socket. It runs only after a connection has
    already failed, so a working setup never pays for it.
    """
    writer = None
    try:
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port), timeout=timeout
        )
    except ConnectionRefusedError:
        return True
    except (asyncio.TimeoutError, OSError):
        return False
    finally:
        if writer is not None:
            writer.close()
    return False


async def async_test_modbus_connection(host: str, port: int, unit_id: int = 1):
    """Test the Modbus connection, saying why it failed when it can.

    Returns an error key string, or None when the device answered.
    """
    error = await _async_test_modbus_connection(host, port, unit_id)

    # A connection that did not come up is worth one more question: did the
    # device refuse, or was there simply nothing to talk to? Asked only now,
    # once the test client above has been closed, so a refusal is the device's
    # answer rather than an echo of our own attempt at its one socket.
    if error == "cannot_connect" and await async_is_connection_refused(host, port):
        return "connection_refused"
    return error


async def _async_test_modbus_connection(host: str, port: int, unit_id: int = 1):
    """Try to connect and read one register.

    Returns error key string or None if successful.
    """
    _LOGGER.debug(
        "Testing Modbus connection to %s:%d with unit %d", host, port, unit_id
    )

    client = MarstekModbusClient(host, int(port), timeout=3, unit_id=int(unit_id))
    try:
        connected = await client.async_connect()
        if not connected:
            _LOGGER.debug("Failed to connect to %s:%d", host, port)
            return "cannot_connect"

        await asyncio.sleep(0.1)

        # Validate unit_id by reading a known register
        try:
            result = await client.async_read_register(
                register=32104,
                data_type="uint16",
                count=1,
                sensor_key="_test_unit_id",
            )
            if result is None:
                _LOGGER.debug("No response when reading register for unit_id test")
                return "unit_id_no_response"
            if isinstance(result, (int, float, bool)):
                _LOGGER.debug("Unit ID %d test succeeded (value=%s)", unit_id, result)
                return None
            _LOGGER.debug(
                "Unit ID %d returned non-numeric response: %r", unit_id, result
            )
            return None

        except asyncio.TimeoutError:
            _LOGGER.debug("Timeout testing unit_id %d", unit_id)
            return "unit_id_no_response"
        except Exception as exc:
            _LOGGER.debug("Error during unit_id test: %s", exc)
            return None

    except Exception as exc:
        _LOGGER.debug("Exception during Modbus client connect test: %s", exc)
        return "cannot_connect"
    finally:
        try:
            await client.async_close()
        except Exception:
            pass
    return None