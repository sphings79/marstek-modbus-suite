export const de: Record<string, string> = {
  "tab.core": "ÜBERSICHT",
  "tab.cells": "ZELLEN",
  "tab.packs": "PACKS",
  "tab.solar": "SOLAR",
  "tab.energy": "ENERGIE",
  "tab.system": "SYSTEM",

  "status.modbus": "MODBUS",
  "status.wifi": "WLAN",

  "common.pack": "PACK",
  "common.device": "Gerät",

  // ---- Übersicht ----
  "core.electrical": "Elektrisch · jetzt",
  "core.reserve": "Reserve · Lebensdauer",
  "core.stored": "Gespeichert",
  "core.capacity": "Kapazität",
  "core.soc_bms": "SOC · BMS",
  "core.soc_usable": "nutzbar {value} %",
  "core.discharging_to_house": "entlädt",
  "core.charging_from_grid": "lädt",
  "core.at_rest": "in Ruhe",
  "core.today_charged": "Heute geladen",
  "core.today_discharged": "Heute entladen",
  "core.cell_delta": "Zelldelta",
  "core.internal_temp": "Innentemperatur",
  "core.mppt_total": "MPPT gesamt",
  "core.pack_spread": "über {count} Packs",
  "core.no_delta": "keine Werte je Pack",

  // ---- Zellen ----
  "cells.highest": "Höchste Zelle",
  "cells.lowest": "Niedrigste Zelle",
  "cells.in_pack": "Pack {pack}",
  "cells.stack_spread": "Spreizung gesamt",
  "cells.limit_hint": "üblicher Grenzwert 100 mV",
  "cells.mean_delta": "Delta ⌀ im Pack",
  "cells.worst_pack": "größtes: Pack {pack}, {value} mV",
  "cells.temp_span": "Spreizung Zelltemperatur",
  "cells.packs_online": "Packs melden",
  "cells.cells_total": "{count} Zellen",
  "cells.matrix_title": "Zellspannungsbereich je Pack · gemeinsame Achse",
  "cells.matrix_axis": "Balken = niedrigste bis höchste Zelle",
  "cells.matrix_legend":
    "Der Strich im Balken ist die Mitte des Packs. Ein schmaler Balken heißt ausgeglichen, ein breiter heißt Drift innerhalb des Packs, und ein Balken abseits der anderen heißt: dieses Pack steht auf einem anderen Niveau als der Rest.",
  "cells.no_ranges": "Dieser Speicher meldet keine Zellspannungen je Pack.",
  "cells.protection": "Schutz und Störungen",
  "cells.protection_all": "Schutz · alle {count} Packs",
  "cells.clear": "frei",
  "cells.raised": "ausgelöst",
  "cells.bms": "BMS",
  "cells.bms_version": "BMS-Version",
  "cells.uniform": "auf allen Packs gleich",

  // ---- Packs ----
  "packs.device_reading": "Meldung des Geräts",
  "packs.mean_soc": "Mittel der Packs",
  "packs.from_n_packs": "aus {count} Packs",
  "packs.spread": "Spreizung",
  "packs.stored_total": "Gespeicherte Energie",
  "packs.summed": "Packs ergeben {value} kWh",
  "packs.per_pack": "Je Pack",
  "packs.nominal": "nominal, Kapazität ÷ Packs",
  "packs.cycles_sum": "Zyklen, alle Packs",
  "packs.cycles_partial": "{have} von {total} Packs melden",
  "packs.fill_title": "Ladezustand je Pack",
  "packs.fill_axis": "Säulenhöhe = SoC · Zahl darin = kWh",
  "packs.fill_legend":
    "Die gestrichelte Linie markiert die Entladegrenze bei {floor} %. Die kWh je Pack sind aus SoC und nominaler Packgröße gerechnet — das Gerät meldet keinen eigenen Energiewert pro Pack.",
  "packs.fill_legend_nofloor":
    "Die kWh je Pack sind aus SoC und nominaler Packgröße gerechnet — das Gerät meldet keinen eigenen Energiewert pro Pack.",
  "packs.none": "Dieser Speicher meldet keinen Ladezustand je Pack.",
  "packs.table_title": "Alle Packs im Detail",
  "packs.table_legend":
    "Hervorgehobene Zeilen liegen mehr als 5 Punkte vom mittleren Pack entfernt. Ein Pack, das hohen SoC bei niedriger Zellspannung meldet, ist einen zweiten Blick wert — die beiden Angaben widersprechen sich.",
  "packs.col_soc": "SoC",
  "packs.col_energy": "kWh",
  "packs.col_min": "Zelle min",
  "packs.col_max": "Zelle max",
  "packs.col_delta": "Delta",
  "packs.col_voltage": "Spannung",
  "packs.col_current": "Strom",
  "packs.col_cycles": "Zyklen",
  "packs.col_mos": "MOSFET",
  "packs.col_env": "Umgebung",
  "packs.col_ntc": "NTC 1–4",

  // ---- Solar ----
  "solar.active": "AKTIV",
  "solar.floating": "LEERLAUF",
  "solar.summary": "Alle Eingänge",
  "solar.some_active": "führt Leistung",
  "solar.all_idle": "nichts angeschlossen",
  "solar.note_active":
    "Die Spannung folgt den Modulen, die Leistung folgt der Einstrahlung über den Tag.",
  "solar.note_floating":
    "Alle Eingänge liegen auf niedriger Spannung ohne Strom — das Leerlaufmuster unbelegter MPPT-Eingänge. Sind Module angeschlossen, steigt die Spannung auf Modulniveau.",
  "solar.diagnostics": "Diagnose",
  "solar.channels_reporting": "Eingänge melden",
  "solar.none": "Dieser Speicher hat keine MPPT-Eingänge.",

  // ---- Energie ----
  "energy.today": "Heute",
  "energy.month": "Dieser Monat",
  "energy.lifetime": "Seit Inbetriebnahme",
  "energy.charged": "geladen kWh",
  "energy.discharged": "entladen kWh",
  "energy.loss": "Verlust",
  "energy.returned": "Zurückgegeben",
  "energy.rte": "RTE",
  "energy.efficiency": "Wirkungsgrad im Vergleich",
  "energy.throughput": "Durchsatz und Verschleiß",
  "energy.gap_hint":
    "Der Monatswert liegt {value} Punkte unter dem Lebensdauerwert. Diese Differenz sind keine Wandlungsverluste, sondern Standby-Zehrung zwischen den Zyklen — je flacher die Zyklen, desto stärker fällt sie ins Gewicht.",

  // ---- System ----
  "system.no_faults": "Kein Störungsregister ist gesetzt.",
  "system.faults_raised": "Gesetzt: {list}",
  "system.device": "Gerät",
  "system.packs": "Batteriepacks",
  "system.firmware": "Firmware",
  "system.connection": "Verbindung",
  "system.faults": "Störungsregister",
  "system.control": "Regelung und Grenzwerte",
  "system.thermal": "Thermik und Elektrik",
  "system.ceiling_used":
    "Das Panel rechnet mit {value} % als Ladeobergrenze, gelesen aus diesem Register.",
  "system.ceiling_ignored":
    "Dieses Register meldet {value} % und liegt damit außerhalb seines eigenen Bereichs 10–100, wird vom Gerät also nicht genutzt. Das Panel rechnet stattdessen bis 100 %.",

  // ---- Leerzustände ----
  "empty.no_device": "Kein Marstek-Speicher gefunden",
  "empty.no_device_hint":
    "Dieses Panel liest die Integration Marstek Modbus Suite. Lege dort zuerst einen Speicher an.",

  "common.unavailable": "—",
};
