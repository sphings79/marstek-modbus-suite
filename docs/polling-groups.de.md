# Was wie oft abgefragt wird

Die Integration fragt in zwei Takten ab. Diese Seite sagt, was im **schnellen** Takt
liegt — alles, was hier nicht steht, liegt im langsamen.

Die Einteilung hängt am Messwert, nicht am Modell: alle vier Registerkarten sind sich
bei jedem einzelnen Schlüssel einig. Ob eine Entität standardmäßig angelegt wird, ist
eine andere Frage — eine ausgeschaltete Entität wird gar nicht gelesen.

| | schnell | langsam |
|---|---|---|
| Vorgabe | 10 s | 60 s |
| Minimum Venus A / D | 3 s | 12 s |
| Minimum Venus E | 3 s | 10 s |

**68 Messwerte im schnellen Takt**, davon 59 standardmäßig eingeschaltet.
Die übrigen 282 liegen im langsamen.

Ein leeres Feld heißt: dieses Modell kennt den Wert nicht.

## Leistung und Energiefluss

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `ac_offgrid_current` |  |  | 32301 | 32301 | aus |
| `ac_offgrid_power` | 32302 | 32302 | 32302 | 32302 | aus |
| `ac_power` | 30006 | 30006 | 30006 | 32202 | an |
| `battery_power` |  |  | 30001 | 32102 | an |
| `dc_sample_power` | 30001 | 30001 |  |  | an |

## Spannung, Strom, Frequenz

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `ac_current` |  |  | 37004 | 32201 | an |
| `ac_frequency` | 32204 | 32204 | 32204 | 32204 | an |
| `ac_voltage` | 32200 | 32200 | 32200 | 32200 | an |
| `battery_current` |  |  | 30101 | 32101 | an |
| `battery_voltage` |  |  | 30100 | 32100 | an |
| `bms_battery_voltage` | 32100 | 32100 |  |  | an |

## Ladezustand

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `battery_soc` | 32104 | 32104 | 34002 | 32104 | an |
| `battery_soc_1` | 34002 | 34002 |  |  | an |
| `battery_soc_2` | 34102 | 34102 |  |  | an |
| `battery_soc_3` | 34202 | 34202 |  |  | an |
| `battery_soc_4` | 34302 | 34302 |  |  | an |
| `battery_soc_5` | 34402 | 34402 |  |  | an |
| `battery_soc_6` | 34502 | 34502 |  |  | an |
| `battery_soc_7` | 34602 | 34602 |  |  | an |

## Betriebszustand

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `bms_active_pack_index` | 32111 | 32111 |  |  | an |
| `force_mode` | 42010 | 42010 | 42010 | 42010 | an |
| `inverter_state` | 35100 | 35100 | 35100 | 35100 | an |
| `user_work_mode` | 43000 | 43000 | 43000 | 43000 | an |
| `work_mode` | 30010 | 30010 |  |  | an |

## Fehler und Alarme

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `alarm_status` | 36000 | 36000 | 36000 | 36000 | an |
| `alarm_status_low` | 36001 | 36001 | 36001 |  | an |
| `battery_1_protection_1` | 34007 | 34007 |  |  | an |
| `battery_1_protection_2` | 34008 | 34008 |  |  | an |
| `battery_2_protection_1` | 34107 | 34107 |  |  | an |
| `battery_2_protection_2` | 34108 | 34108 |  |  | an |
| `battery_3_protection_1` | 34207 | 34207 |  |  | an |
| `battery_3_protection_2` | 34208 | 34208 |  |  | an |
| `battery_4_protection_1` | 34307 | 34307 |  |  | an |
| `battery_4_protection_2` | 34308 | 34308 |  |  | an |
| `battery_5_protection_1` | 34407 | 34407 |  |  | an |
| `battery_5_protection_2` | 34408 | 34408 |  |  | an |
| `battery_6_protection_1` | 34507 | 34507 |  |  | an |
| `battery_6_protection_2` | 34508 | 34508 |  |  | an |
| `battery_7_protection_1` | 34607 | 34607 |  |  | an |
| `battery_7_protection_2` | 34608 | 34608 |  |  | an |
| `fault_status` | 36100 | 36100 | 36100 | 36100 | an |
| `fault_status_2` | 36102 | 36102 | 36102 |  | an |
| `fault_status_2_low` | 36103 | 36103 | 36103 |  | an |
| `fault_status_low` | 36101 | 36101 | 36101 |  | an |
| `mppt_error` | 37023 | 37023 |  |  | an |
| `mppt_warning` | 37024 | 37024 |  |  | an |

## PV

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `mppt1_power` | 30037 | 30037 |  |  | an |
| `mppt2_power` | 30038 | 30038 |  |  | an |
| `mppt3_power` | 30039 | 30039 |  |  | an |
| `mppt4_power` | 30040 | 30040 |  |  | an |

## Von Automationen geschriebene Sollwerte

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `set_charge_power` | 42020 | 42020 | 42020 | 42020 | an |
| `set_discharge_power` | 42021 | 42021 | 42021 | 42021 | an |

## Pro Batteriepack

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `battery_1_mos_status` | 34004 | 34004 |  |  | an |
| `battery_2_mos_status` | 34104 | 34104 |  |  | an |
| `battery_3_mos_status` | 34204 | 34204 |  |  | an |
| `battery_4_mos_status` | 34304 | 34304 |  |  | an |
| `battery_5_mos_status` | 34404 | 34404 |  |  | an |
| `battery_6_mos_status` | 34504 | 34504 |  |  | an |
| `battery_7_mos_status` | 34604 | 34604 |  |  | an |

## Alles Weitere im schnellen Takt

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `charging_cutoff_capacity` |  |  |  | 44000 | aus |
| `discharge_limit_mode` |  |  |  | 41010 | aus |
| `discharging_cutoff_capacity` |  |  |  | 44001 | aus |
| `factory_reset` | 41001 | 41001 | 41001 | 41001 | aus |
| `grid_standard` |  |  |  | 44100 | an |
| `internal_mos2_temperature` |  |  | 35002 | 35002 | aus |
| `max_cell_voltage` |  |  | 37007 | 37007 | aus |
| `min_cell_voltage` |  |  | 37008 | 37008 | aus |
| `reset_device` | 41000 | 41000 | 41000 | 41000 | an |

## Alles andere

Jeder Messwert, der oben nicht steht, wird im langsamen Takt gelesen — Energiezähler,
Versionen, Zellspannungen, Zeitpläne, Temperaturen, Konfigurationsschalter. Das sind
Werte, die sich entweder von selbst kaum bewegen oder nur dann, wenn jemand sie ändert.

Zwei Dinge, die dabei leicht überraschen:

- Der Koordinator taktet mit dem **kleineren** der beiden Werte. Ein niedriges
  Low-Intervall lässt also auch den schnellen Takt öfter anlaufen.
- Berechnete Werte haben kein eigenes Intervall. Sie rechnen bei jedem Takt neu, mit
  dem, was gerade da ist — wie frisch sie sind, entscheiden ihre Zulieferer.

Diese Seite wird erzeugt: `python3 scripts/generate_polling_doc.py`.
