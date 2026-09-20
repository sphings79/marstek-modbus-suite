# Integration domain name
DOMAIN = "marstek_modbus"

# Manufacturer and model information for the Marstek Venus battery
MANUFACTURER = "Marstek"
MODEL = "Venus"

# Default network configuration for Modbus connection
DEFAULT_PORT = 502
DEFAULT_MESSAGE_WAIT_MS = 80  # Default wait time for Modbus messages in milliseconds
CONF_MESSAGE_WAIT_MS = "message_wait_milliseconds"
DEFAULT_UNIT_ID = 1  # Default Modbus Unit ID (unit ID)
DEFAULT_TIMEOUT = 3  # Default Modbus request timeout in seconds

# How many unrequested registers a block read may span to avoid a second
# request. Measured on a Venus D: bridging gaps of one or two never drew a
# rejection across the full register map, the default entity set, or the map
# with the DEV registers added, and saved 18 to 27 percent of the requests in
# a cycle. Wider bridging saves a little more but starts hitting registers the
# device does not implement, and each of those costs a request of its own.
DEFAULT_MAX_READ_GAP = 2

# Gaps the device refused to bridge, remembered per firmware so a map that
# changes with an update is re-learned rather than carried forward.
CONF_BAD_GAPS = "bad_gaps"
CONF_BAD_GAPS_FIRMWARE = "bad_gaps_firmware"

# The register whose value keys that memory: ems_version, the Control app
# build. A different firmware may serve a different set of registers.
GAP_MEMORY_FIRMWARE_KEY = "ems_version"

# General scan intervals (in seconds)
DEFAULT_SCAN_INTERVALS = {
    "high": 10,      # fast-changing sensors and former medium-priority sensors
    "low": 60,       # slower-changing sensors and former very_low-priority sensors
}

# Supported device versions
SUPPORTED_VERSIONS = [
    "E v1/v2", 
    "E v3",
    "D",
    "A"]

# Device names offered as the default during setup, keyed by SUPPORTED_VERSIONS.
# The name becomes the config entry title, and the title is what the device and
# every entity id is named after, so it is worth getting right at setup time -
# renaming later leaves the entity ids on their original names.
DEVICE_NAME_DEFAULTS = {
    "E v1/v2": "Marstek Venus E",
    "E v3": "Marstek Venus E 3.0",
    "D": "Marstek Venus D",
    "A": "Marstek Venus A",
}
DEFAULT_DEVICE_NAME = "Marstek Venus"

# Note: register loading logic (get_registers) was moved to
# `coordinator.py` to keep `const.py` focused on constants only.

# Optionsschluessel fuer die DEV-Register. Getrennt schaltbar, weil die beiden
# Gruppen unterschiedlichen Zwecken dienen:
#   unknown   - Register ohne geklaerte Bedeutung (117)
#   duplicate - Register, die denselben Wert liefern wie ein bereits
#               integrierter Sensor: Aliase, Spiegel, Folgeregister (14)
# Lower end of the usable energy window, in percent of the pack.
# Venus A, D and E v3 do not expose discharging_cutoff_capacity, so the floor
# the user set in the Marstek app cannot be read back and is configured here
# instead - per config entry, so two batteries can differ.
CONF_DISCHARGE_FLOOR = "discharge_floor_percent"
DEFAULT_DISCHARGE_FLOOR = 12

# How many battery packs are actually stacked, on the models that take more than
# one. The register map always describes all seven blocks, so without this every
# Venus D and A shows seven packs whatever is installed.
#
# 0 means "read it off the device": a pack that is not there answers its whole
# block with zeros, so the panel can recognise it. That costs the reads - the
# integration cannot leave out a block and still see whether it answers - which
# is what a fixed number is for. Set 1 to 7 and the blocks above it are not
# polled at all: four absent packs are 64 registers a cycle out of 234.
CONF_PACK_COUNT = "pack_count"
PACK_COUNT_AUTO = 0
MAX_PACK_COUNT = 7

# Every pack block sits at 34000 + (N-1) * 100, packs numbered from 1.
PACK_REGISTER_BASE = 34000
PACK_REGISTER_STRIDE = 100

# The models with a per-pack register family. The two E generations report one
# battery and never show the setting.
PACK_COUNT_VERSIONS = {"d", "a"}

CONF_DEV_REGISTERS_UNKNOWN = "dev_registers_unknown"
CONF_DEV_REGISTERS_DUPLICATE = "dev_registers_duplicate"
DEFAULT_DEV_REGISTERS = False

# Alter Sammelschalter aus 1.1.5-beta.1. Wird nur noch gelesen, um bestehende
# Konfigurationen zu migrieren: war er an, gelten beide neuen Optionen als an.
CONF_DEV_REGISTERS_LEGACY = "dev_registers"

# Steuermodus (Register 42000). Der Firmware-Write-Handler zeigt, was dahinter
# steckt: 42000 und 43000 schreiben dieselbe Variable. `42000 = 0x55AA` setzt das
# Modus-Byte auf 0x0A, `0x55BB` holt den gespeicherten Modus aus EEPROM 0x301
# zurueck, und die drei Optionen von 43000 schreiben 0x01/0x00/0x05 — keine davon
# ist 0x0A. Zwei Bedienelemente, ein Zustand.
#
# Faellt das Byte auf einen normalen Betriebsmodus zurueck, ignoriert die
# Regelung `force_mode`. Schreibbefehle werden weiter bestaetigt und Messwerte
# weiter geliefert, das Geraet fuehrt nur nichts mehr aus — am Venus D gemessen:
# laufende Entladung 605 W -> 12 W (Eigenverbrauch des Wechselrichters). Der
# Ausfall ist also unsichtbar, bis jemand merkt, dass die Regelung nichts
# bewirkt. Deshalb ein Reparatur-Eintrag statt einer Logzeile.
RS485_CONTROL_MODE_KEY = "rs485_control_mode"
ISSUE_RS485_CONTROL_MODE_RESET = "rs485_control_mode_reset"


# Polling mode, set per config entry from the select entity of the same name.
# Not a register: it says what this integration does, not what the device is,
# which is why it exists on every model and survives the device being off.
#
# The two paused modes differ only in what the read-only entities do. Frozen
# keeps the last reading, which leaves statistics unbroken but carries a value
# from before the pause as though it were measured now. Unavailable tears a hole
# in the history and claims nothing. Both stop the polling and close the socket;
# neither survives a restart of Home Assistant, which keeps no readings to
# freeze.
CONF_POLLING_MODE = "polling_mode"
POLLING_MODE_KEY = "modbus_device_polling"
POLLING_MODE_ACTIVE = "active"
POLLING_MODE_PAUSED_UNAVAILABLE = "paused_unavailable"
POLLING_MODE_PAUSED_FROZEN = "paused_frozen"
POLLING_MODES = [
    POLLING_MODE_ACTIVE,
    POLLING_MODE_PAUSED_UNAVAILABLE,
    POLLING_MODE_PAUSED_FROZEN,
]
DEFAULT_POLLING_MODE = POLLING_MODE_ACTIVE
