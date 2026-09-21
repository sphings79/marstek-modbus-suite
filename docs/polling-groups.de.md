# Was wie oft abgefragt wird

Die Integration fragt in drei Takten ab. Diese Seite sagt, was im **schnellen** Takt
liegt und was im **Ultra-Low**-Takt — alles Übrige liegt im langsamen dazwischen.

Die Einteilung hängt am Messwert, nicht am Modell: alle vier Registerkarten sind sich
bei jedem einzelnen Schlüssel einig. Ob eine Entität standardmäßig angelegt wird, ist
eine andere Frage — eine ausgeschaltete Entität wird gar nicht gelesen.

| | schnell | langsam | Ultra-Low |
|---|---|---|---|
| Vorgabe | 10 s | 60 s | 300 s |
| Minimum | 3 s | 10 s | 60 s |

**76 Messwerte im schnellen Takt**, davon 67 standardmäßig eingeschaltet.
58 liegen im Ultra-Low-Takt, die übrigen 216 im langsamen.

Ein leeres Feld heißt: dieses Modell kennt den Wert nicht.

# Der schnelle Takt

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
| `mppt1_current` | 30024 | 30024 |  |  | an |
| `mppt1_power` | 30037 | 30037 |  |  | an |
| `mppt1_voltage` | 30020 | 30020 |  |  | an |
| `mppt2_current` | 30025 | 30025 |  |  | an |
| `mppt2_power` | 30038 | 30038 |  |  | an |
| `mppt2_voltage` | 30021 | 30021 |  |  | an |
| `mppt3_current` | 30026 | 30026 |  |  | an |
| `mppt3_power` | 30039 | 30039 |  |  | an |
| `mppt3_voltage` | 30022 | 30022 |  |  | an |
| `mppt4_current` | 30027 | 30027 |  |  | an |
| `mppt4_power` | 30040 | 30040 |  |  | an |
| `mppt4_voltage` | 30023 | 30023 |  |  | an |

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

## Alles Weitere in dieser Gruppe

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

# Der Ultra-Low-Takt

Diese Werte ändern sich nicht von selbst, sondern nur, wenn jemand sie ändert — im
Gerät, in der App oder per Firmware-Update. Sie werden alle fünf Minuten gelesen.

Ein Zeitplan, den du in der Marstek-App umstellst, steht also bis zu fünf Minuten
später hier. Das ist der ganze Preis dieser Gruppe.

## PV

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `mppt_version` | 30205 | 30205 |  |  | an |

## Pro Batteriepack

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `battery_1_bms_version` | 34010 | 34010 |  |  | an |
| `battery_1_cycle_count` | 34003 | 34003 |  |  | an |
| `battery_2_bms_version` | 34110 | 34110 |  |  | an |
| `battery_2_cycle_count` | 34103 | 34103 |  |  | an |
| `battery_3_bms_version` | 34210 | 34210 |  |  | an |
| `battery_3_cycle_count` | 34203 | 34203 |  |  | an |
| `battery_4_bms_version` | 34310 | 34310 |  |  | an |
| `battery_4_cycle_count` | 34303 | 34303 |  |  | an |
| `battery_5_bms_version` | 34410 | 34410 |  |  | an |
| `battery_5_cycle_count` | 34403 | 34403 |  |  | an |
| `battery_6_bms_version` | 34510 | 34510 |  |  | an |
| `battery_6_cycle_count` | 34503 | 34503 |  |  | an |
| `battery_7_bms_version` | 34610 | 34610 |  |  | an |
| `battery_7_cycle_count` | 34603 | 34603 |  |  | an |

## Alles Weitere in dieser Gruppe

| Messwert | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Vorgabe |
|---|---|---|---|---|---|
| `battery_cycle_count` |  |  | 34003 |  | an |
| `battery_total_energy` | 32105 | 32105 | 32105 | 32105 | an |
| `ble_mac_address` | 30304 | 30304 | 30304 | 30402 | an |
| `bms_version` |  |  | 30204 | 31102 | an |
| `device_ip_address` | 30400 | 30400 |  |  | an |
| `ems_boot_version` | 30201 | 30201 |  |  | an |
| `ems_version` | 30200 | 30200 | 30200 | 31101 | an |
| `gateway_ip_address` | 30402 | 30402 |  |  | an |
| `max_charge_power` | 44002 | 44002 | 44002 | 44002 | an |
| `max_discharge_power` | 44003 | 44003 | 44003 | 44003 | an |
| `schedule_1_days` | 43100 | 43100 | 43100 | 43100 | an |
| `schedule_1_enabled` | 43104 | 43104 | 43104 | 43104 | an |
| `schedule_1_end` | 43102 | 43102 | 43102 | 43102 | an |
| `schedule_1_mode` | 43103 | 43103 | 43103 | 43103 | an |
| `schedule_1_start` | 43101 | 43101 | 43101 | 43101 | an |
| `schedule_2_days` | 43105 | 43105 | 43105 | 43105 | an |
| `schedule_2_enabled` | 43109 | 43109 | 43109 | 43109 | an |
| `schedule_2_end` | 43107 | 43107 | 43107 | 43107 | an |
| `schedule_2_mode` | 43108 | 43108 | 43108 | 43108 | an |
| `schedule_2_start` | 43106 | 43106 | 43106 | 43106 | an |
| `schedule_3_days` | 43110 | 43110 | 43110 | 43110 | an |
| `schedule_3_enabled` | 43114 | 43114 | 43114 | 43114 | an |
| `schedule_3_end` | 43112 | 43112 | 43112 | 43112 | an |
| `schedule_3_mode` | 43113 | 43113 | 43113 | 43113 | an |
| `schedule_3_start` | 43111 | 43111 | 43111 | 43111 | an |
| `schedule_4_days` | 43115 | 43115 | 43115 | 43115 | an |
| `schedule_4_enabled` | 43119 | 43119 | 43119 | 43119 | an |
| `schedule_4_end` | 43117 | 43117 | 43117 | 43117 | an |
| `schedule_4_mode` | 43118 | 43118 | 43118 | 43118 | an |
| `schedule_4_start` | 43116 | 43116 | 43116 | 43116 | an |
| `schedule_5_days` | 43120 | 43120 | 43120 | 43120 | an |
| `schedule_5_enabled` | 43124 | 43124 | 43124 | 43124 | an |
| `schedule_5_end` | 43122 | 43122 | 43122 | 43122 | an |
| `schedule_5_mode` | 43123 | 43123 | 43123 | 43123 | an |
| `schedule_5_start` | 43121 | 43121 | 43121 | 43121 | an |
| `schedule_6_days` | 43125 | 43125 | 43125 | 43125 | an |
| `schedule_6_enabled` | 43129 | 43129 | 43129 | 43129 | an |
| `schedule_6_end` | 43127 | 43127 | 43127 | 43127 | an |
| `schedule_6_mode` | 43128 | 43128 | 43128 | 43128 | an |
| `schedule_6_start` | 43126 | 43126 | 43126 | 43126 | an |
| `software_version` |  |  |  | 31100 | an |
| `vms_version` | 30202 | 30202 | 30202 |  | an |
| `vns_boot_version` | 30203 | 30203 |  |  | an |

# Der langsame Takt

Jeder Messwert, der oben nicht steht: Energiezähler, Zellspannungen, Temperaturen,
Pack-Ströme und -Spannungen, Konfigurationsschalter. Werte also, die sich von selbst
bewegen, nur eben langsam — anders als die Gruppe darüber, die stillsteht, bis
jemand etwas umstellt.

Zwei Dinge, die dabei leicht überraschen:

- Der Koordinator taktet mit dem **kleineren** von schnell und langsam. Fallen in
  einem Takt mehrere Gruppen zusammen, wird erst die ganze Runde gelesen — die
  schnellen Werte aus diesem Takt kommen also entsprechend später an. Deshalb liegt
  das Minimum für den langsamen Takt über der Dauer einer vollen Runde.
- Berechnete Werte haben kein eigenes Intervall. Sie rechnen bei jedem Takt neu, mit
  dem, was gerade da ist — wie frisch sie sind, entscheiden ihre Zulieferer.

Diese Seite wird erzeugt: `python3 scripts/generate_polling_doc.py`.
