#!/usr/bin/env python3
"""Write docs/polling-groups.md and its German twin from the register maps.

The polling dialog offers two intervals and says nothing about which reading
lands in which, so the page the dialog links to has to answer that - and it has
to keep answering it after someone moves a register between the groups. Hence
generated rather than written: run this after editing any registers/*.yaml.

    python3 scripts/generate_polling_doc.py

The group is a property of the key rather than of the model - all four maps
agree on every one of them - so one table serves every device. The script
checks that and refuses if it ever stops being true.
"""
import sys
from collections import OrderedDict
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
REGISTERS = ROOT / "custom_components" / "marstek_modbus" / "registers"
MAPS = OrderedDict([("a", "Venus A"), ("d", "Venus D"),
                    ("e_v3", "Venus E v3"), ("e_v12", "Venus E v1 & v2")])

# Themes in the order they are presented. A key falls into the first theme whose
# test matches, so the order also resolves overlaps.
THEMES = [
    ("power", "Power and energy flow", "Leistung und Energiefluss",
     lambda k: k in {"dc_sample_power", "ac_power", "battery_power", "grid_power",
                     "ac_offgrid_power", "ac_offgrid_current", "battery_power_bms"}),
    ("electrical", "Voltage, current, frequency", "Spannung, Strom, Frequenz",
     lambda k: k in {"ac_voltage", "ac_current", "ac_frequency", "battery_voltage",
                     "battery_current", "bms_battery_voltage", "bms_battery_current"}),
    ("charge", "State of charge", "Ladezustand",
     lambda k: "soc" in k or k in {"stored_energy", "usable_energy", "energy_to_full",
                                   "backup_reserve_energy"}),
    ("state", "Operating state", "Betriebszustand",
     lambda k: k in {"inverter_state", "work_mode", "user_work_mode", "force_mode",
                     "bms_active_pack_index", "bms_pack_count", "bms_online_mask"}),
    ("fault", "Faults and alarms", "Fehler und Alarme",
     lambda k: k.startswith(("fault_status", "alarm_status", "mppt_error", "mppt_warning"))
     or "protection" in k),
    ("pv", "PV", "PV",
     lambda k: k.startswith("mppt") or k.startswith("solar") or k.startswith("pv_")),
    ("control", "Setpoints written by automations", "Von Automationen geschriebene Sollwerte",
     lambda k: k in {"set_charge_power", "set_discharge_power", "charge_to_soc"}),
    ("pack", "Per battery pack", "Pro Batteriepack",
     lambda k: k.startswith("battery_") and any(c.isdigit() for c in k)),
]
# The catch-all theme. Deliberately not naming a rate: the same table is
# rendered under the fast heading and under the ultra-low one.
OTHER = ("other", "Everything else in this group", "Alles Weitere in dieser Gruppe")


def load():
    """key -> {"interval": str, "default_on": bool, "registers": {map: reg}}"""
    keys = {}
    for short in MAPS:
        data = yaml.safe_load((REGISTERS / f"{short}.yaml").read_text())
        for section, body in (data or {}).items():
            if not isinstance(body, dict) or section == "MISSING" or section.startswith("DEV"):
                continue
            for key, entry in body.items():
                if not isinstance(entry, dict) or "register" not in entry:
                    continue
                rec = keys.setdefault(key, {"interval": {}, "default_on": False, "registers": {}})
                rec["interval"][short] = entry.get("scan_interval", "high")
                rec["registers"][short] = entry["register"]
                if entry.get("enabled_by_default") is not False:
                    rec["default_on"] = True
    mixed = {k: v["interval"] for k, v in keys.items() if len(set(v["interval"].values())) > 1}
    if mixed:
        print("Polling group differs between models - this page assumes it does not:", file=sys.stderr)
        for k, v in sorted(mixed.items()):
            print(f"  {k}: {v}", file=sys.stderr)
        raise SystemExit(1)
    for rec in keys.values():
        rec["interval"] = next(iter(rec["interval"].values()))
    return keys


def theme_of(key):
    for slug, _, _, test in THEMES:
        if test(key):
            return slug
    return OTHER[0]


def render(keys, lang):
    de = lang == "de"
    hi = {k: v for k, v in keys.items() if v["interval"] == "high"}
    lo = {k: v for k, v in keys.items() if v["interval"] == "low"}
    ul = {k: v for k, v in keys.items() if v["interval"] == "ultra"}
    on = sum(1 for v in hi.values() if v["default_on"])

    out = []
    add = out.append
    add("# " + ("Was wie oft abgefragt wird" if de else "What gets polled how often"))
    add("")
    if de:
        add("Die Integration fragt in drei Takten ab. Diese Seite sagt, was im **schnellen** Takt")
        add("liegt und was im **Ultra-Low**-Takt — alles Übrige liegt im langsamen dazwischen.")
        add("")
        add("Die Einteilung hängt am Messwert, nicht am Modell: alle vier Registerkarten sind sich")
        add("bei jedem einzelnen Schlüssel einig. Ob eine Entität standardmäßig angelegt wird, ist")
        add("eine andere Frage — eine ausgeschaltete Entität wird gar nicht gelesen.")
    else:
        add("The integration polls at three rates. This page lists what is on the **fast** one and")
        add("what is on the **ultra-low** one — everything else is on the slow rate in between.")
        add("")
        add("The split follows the reading rather than the model: all four register maps agree on")
        add("every single key. Whether an entity exists by default is a separate question — a")
        add("disabled entity is not read at all.")
    add("")
    add("| | " + ("schnell" if de else "fast") + " | " + ("langsam" if de else "slow")
        + " | " + ("Ultra-Low" if de else "ultra-low") + " |")
    add("|---|---|---|---|")
    add("| " + ("Vorgabe" if de else "Default") + " | 10 s | 60 s | 300 s |")
    add("| Minimum | 3 s | 10 s | 60 s |")
    add("")
    if de:
        add(f"**{len(hi)} Messwerte im schnellen Takt**, davon {on} standardmäßig eingeschaltet.")
        add(f"{len(ul)} liegen im Ultra-Low-Takt, die übrigen {len(lo)} im langsamen.")
        add("")
        add("Ein leeres Feld heißt: dieses Modell kennt den Wert nicht.")
    else:
        add(f"**{len(hi)} readings on the fast rate**, {on} of them on by default. {len(ul)} are on")
        add(f"the ultra-low rate and the remaining {len(lo)} on the slow one.")
        add("")
        add("An empty cell means that model does not have the reading.")
    add("")
    add("# " + ("Der schnelle Takt" if de else "The fast rate"))
    add("")

    head = "| " + ("Messwert" if de else "Reading") + " | " + \
        " | ".join(MAPS.values()) + " | " + ("Vorgabe" if de else "Default") + " |"

    def tables(bucket, level=2):
        for slug, en_title, de_title, _ in THEMES + [(OTHER[0], OTHER[1], OTHER[2], None)]:
            rows = sorted(k for k in bucket if theme_of(k) == slug)
            if not rows:
                continue
            add("#" * level + " " + (de_title if de else en_title))
            add("")
            add(head)
            add("|---|" + "---|" * (len(MAPS) + 1))
            for key in rows:
                regs = [str(bucket[key]["registers"].get(m, "")) for m in MAPS]
                mark = ("an" if de else "on") if bucket[key]["default_on"] else ("aus" if de else "off")
                add(f"| `{key}` | " + " | ".join(regs) + f" | {mark} |")
            add("")

    tables(hi)

    add("# " + ("Der Ultra-Low-Takt" if de else "The ultra-low rate"))
    add("")
    if de:
        add("Diese Werte ändern sich nicht von selbst, sondern nur, wenn jemand sie ändert — im")
        add("Gerät, in der App oder per Firmware-Update. Sie werden alle fünf Minuten gelesen.")
        add("")
        add("Ein Zeitplan, den du in der Marstek-App umstellst, steht also bis zu fünf Minuten")
        add("später hier. Das ist der ganze Preis dieser Gruppe.")
    else:
        add("These do not move on their own - only when somebody changes them, in the device, in")
        add("the app, or through a firmware update. They are read every five minutes.")
        add("")
        add("A schedule changed in the Marstek app therefore takes up to five minutes to appear")
        add("here. That is the whole cost of this group.")
    add("")
    tables(ul)

    if de:
        add("# Der langsame Takt")
        add("")
        add("Jeder Messwert, der oben nicht steht: Energiezähler, Zellspannungen, Temperaturen,")
        add("Pack-Ströme und -Spannungen, Konfigurationsschalter. Werte also, die sich von selbst")
        add("bewegen, nur eben langsam — anders als die Gruppe darüber, die stillsteht, bis")
        add("jemand etwas umstellt.")
        add("")
        add("Zwei Dinge, die dabei leicht überraschen:")
        add("")
        add("- Der Koordinator taktet mit dem **kleineren** von schnell und langsam. Fallen in")
        add("  einem Takt mehrere Gruppen zusammen, wird erst die ganze Runde gelesen — die")
        add("  schnellen Werte aus diesem Takt kommen also entsprechend später an. Deshalb liegt")
        add("  das Minimum für den langsamen Takt über der Dauer einer vollen Runde.")
        add("- Berechnete Werte haben kein eigenes Intervall. Sie rechnen bei jedem Takt neu, mit")
        add("  dem, was gerade da ist — wie frisch sie sind, entscheiden ihre Zulieferer.")
        add("")
        add("Diese Seite wird erzeugt: `python3 scripts/generate_polling_doc.py`.")
    else:
        add("# The slow rate")
        add("")
        add("Every reading not named above: energy counters, cell voltages, temperatures, pack")
        add("currents and voltages, configuration switches. Values that do move on their own, just")
        add("slowly - unlike the group above them, which sits still until somebody changes")
        add("something.")
        add("")
        add("Two things that tend to surprise:")
        add("")
        add("- The coordinator ticks at the **smaller** of fast and slow. When several groups fall")
        add("  due in the same tick the whole round is read first, so the fast readings from that")
        add("  tick arrive correspondingly later. That is why the floor for the slow rate sits")
        add("  above what a full round takes.")
        add("- Calculated values have no interval of their own. They recompute on every tick from")
        add("  whatever is present, so their freshness is their inputs' freshness.")
        add("")
        add("This page is generated: `python3 scripts/generate_polling_doc.py`.")
    add("")
    return "\n".join(out)


def main():
    keys = load()
    for lang, name in (("en", "polling-groups.md"), ("de", "polling-groups.de.md")):
        path = ROOT / "docs" / name
        path.write_text(render(keys, lang))
        print(f"{path.relative_to(ROOT)}: {len(path.read_text().splitlines())} lines")


if __name__ == "__main__":
    main()
