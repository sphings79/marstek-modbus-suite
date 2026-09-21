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
# How long one Modbus request may take before it is given up on.
#
# Three seconds was the obvious number until the battery was watched for a
# whole night. A Venus D on EMS v150 stops answering for about four seconds
# every five minutes: 138 of those in eleven hours, mean 4.05 s, longest
# 4.46 s, measured at a Modbus proxy between Home Assistant and the battery,
# so it is the device and not the link. Every single one of them expired a
# three second request, and the integration rebuilt the connection each time
# for a battery that was about to answer.
#
# Six covers the longest stall seen with room over it, including the little
# extra a second request waits when it is queued behind the stalled one
# (4.53 s worst case). The price is paid only when a battery is really gone,
# and it is three seconds of patience.
DEFAULT_TIMEOUT = 6  # Default Modbus request timeout in seconds

# How many unrequested registers a block read may span to avoid a second
# request. A request costs about the same whatever it carries, so reading a
# couple of registers nobody asked for beats a second round trip.
#
# Three, measured on a Venus D on EMS v150 with the standard register set:
#
#   gap  requests (fast tick / fast+slow)   seconds
#    2        25 / 40                        3.74 / 6.03
#    3        22 / 37                        3.30 / 5.49
#    4        22 / 37                        3.24 / 5.54
#
# Four buys nothing. It merges 30001-30010 into one block, the device refuses
# it, and _note_gaps_refused then blacklists every gap in that block - taking
# 30001 -> 30006, which the device serves perfectly well on its own, down with
# 30006 -> 30010, which it does not. Both values therefore settle in the same
# place, and three provokes the smaller wrong request to get there.
#
# The one refusal costs 6 to 9 ms and is learned once per firmware. It reads
# that cheaply only because the exception frame is corrected on the way in -
# see helpers/exception_frame.py; without that the malformed length field
# turns it into a full client timeout.
DEFAULT_MAX_READ_GAP = 3

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
    "ultra": 300,    # readings that only change when somebody changes them
}

# Supported device versions.
#
# These strings are stored in the config entry and choose the register map, so
# they are identifiers rather than labels - respelling one would orphan every
# device set up under the old spelling. What the setup dialog shows comes from
# DEVICE_VERSION_LABELS below. The order here is the order of the dropdown.
SUPPORTED_VERSIONS = [
    "A",
    "D",
    "E v3",
    "E v1/v2"]

# The label each version carries in the setup dialog. Product names instead of
# the internal codes, because "D" on its own tells nobody holding the box which
# entry is theirs. Deliberately not translated: Marstek calls the models the
# same in every language.
DEVICE_VERSION_LABELS = {
    "A": "Venus A",
    "D": "Venus D",
    "E v3": "Venus E v3",
    "E v1/v2": "Venus E v1 & v2",
}

# Lower bounds for the polling intervals, in seconds, per model.
#
# A cycle costs what the device takes to answer, and that is measurable. On a
# Venus D on EMS v150, read directly at 192.168.181.154:502 with the standard
# register set and the integration's 80 ms pacing between requests:
#
#   fast tick            22 requests   3.30 s
#   fast + slow together 37 requests   5.49 s
#   per request          65 ms
#
# The 150 ms per request this file used to quote came from a measurement taken
# through a Modbus proxy and was more than twice too pessimistic; the full
# round was put at 10.3 s where it actually takes 5.5 s.
#
# Asking for less does not poll faster, it queues. The slow floor is the one
# that matters: the coordinator ticks at min(high, low), and a tick where both
# groups fall due pays for the whole round before the fast readings from that
# same tick are in - so the slow interval must not be shorter than a full round
# takes. Ten leaves most of a round's length as headroom over the measured 5.5,
# which is where the retries and the occasional four second stall of the device
# have to fit.
#
# The ultra floor is deliberately far above its own cost. Nothing in that group
# changes on its own, so a minute is already generous; the bound exists to stop
# somebody turning a group of firmware versions and schedules into a second
# fast tick.
MIN_SCAN_INTERVALS = {
    "A": {"high": 3, "low": 10, "ultra": 60},
    "D": {"high": 3, "low": 10, "ultra": 60},
    "E v3": {"high": 3, "low": 10, "ultra": 60},
    "E v1/v2": {"high": 3, "low": 10, "ultra": 60},
}

# Where the polling page lives, per language. hassfest refuses a URL inside a
# translation string and asks for a placeholder instead, which is the better
# arrangement anyway: the link then follows the language Home Assistant runs in
# rather than being baked into one catalogue.
DOCS_BASE_URL = "https://github.com/sphings79/marstek-modbus-suite/blob/main/docs"
POLLING_DOC_BY_LANGUAGE = {"de": "polling-groups.de.md"}
POLLING_DOC_DEFAULT = "polling-groups.md"


def polling_doc_url(language):
    """The polling page in the given language, falling back to English."""
    code = str(language or "en").split("-")[0].lower()
    return f"{DOCS_BASE_URL}/{POLLING_DOC_BY_LANGUAGE.get(code, POLLING_DOC_DEFAULT)}"


# Used when the version is missing or unknown: the safe end of the range.
DEFAULT_MIN_SCAN_INTERVALS = {"high": 5, "low": 12, "ultra": 60}


def min_scan_intervals(version):
    """The floors for one device version, falling back to the cautious pair."""
    return MIN_SCAN_INTERVALS.get(str(version or "").strip(), DEFAULT_MIN_SCAN_INTERVALS)

# The way out of the discovery list, in the languages the integration ships.
#
# It sits here rather than in the translation catalogues because the list it
# belongs to is built at runtime: the device rows are labelled with addresses
# found a moment ago, which makes them SelectOptionDicts, and an option dict
# carries its own label instead of looking one up. Home Assistant will not
# translate one entry of such a list on its own.
DISCOVERY_MANUAL_LABELS = {
    "de": "Keines davon, Daten selbst eingeben",
    "nl": "Geen van deze, gegevens zelf invoeren",
}
DISCOVERY_MANUAL_LABEL = "None of these, enter the details myself"


def discovery_manual_label(language):
    """The escape-hatch label for one language, falling back to English."""
    code = str(language or "en").split("-")[0].lower()
    return DISCOVERY_MANUAL_LABELS.get(code, DISCOVERY_MANUAL_LABEL)


# What the model code in a discovery beacon means, mapped to SUPPORTED_VERSIONS.
#
# The code is the same string register 31000 reports - VNSD-0 on a Venus D. Only
# the three models whose firmware is in hand are listed; a device announcing
# anything else is still offered, it just arrives with no version preselected
# rather than with a guess.
BEACON_MODEL_VERSIONS = {
    "VNSD-0": "D",
    "VNSA-0": "A",
    "VNSE3-0": "E v3",
}


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
