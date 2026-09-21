# What gets polled how often

The integration polls at three rates. This page lists what is on the **fast** one and
what is on the **ultra-low** one — everything else is on the slow rate in between.

The split follows the reading rather than the model: all four register maps agree on
every single key. Whether an entity exists by default is a separate question — a
disabled entity is not read at all.

| | fast | slow | ultra-low |
|---|---|---|---|
| Default | 10 s | 60 s | 300 s |
| Minimum | 3 s | 10 s | 60 s |

**76 readings on the fast rate**, 67 of them on by default. 58 are on
the ultra-low rate and the remaining 216 on the slow one.

An empty cell means that model does not have the reading.

# The fast rate

## Power and energy flow

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `ac_offgrid_current` |  |  | 32301 | 32301 | off |
| `ac_offgrid_power` | 32302 | 32302 | 32302 | 32302 | off |
| `ac_power` | 30006 | 30006 | 30006 | 32202 | on |
| `battery_power` |  |  | 30001 | 32102 | on |
| `dc_sample_power` | 30001 | 30001 |  |  | on |

## Voltage, current, frequency

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `ac_current` |  |  | 37004 | 32201 | on |
| `ac_frequency` | 32204 | 32204 | 32204 | 32204 | on |
| `ac_voltage` | 32200 | 32200 | 32200 | 32200 | on |
| `battery_current` |  |  | 30101 | 32101 | on |
| `battery_voltage` |  |  | 30100 | 32100 | on |
| `bms_battery_voltage` | 32100 | 32100 |  |  | on |

## State of charge

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `battery_soc` | 32104 | 32104 | 34002 | 32104 | on |
| `battery_soc_1` | 34002 | 34002 |  |  | on |
| `battery_soc_2` | 34102 | 34102 |  |  | on |
| `battery_soc_3` | 34202 | 34202 |  |  | on |
| `battery_soc_4` | 34302 | 34302 |  |  | on |
| `battery_soc_5` | 34402 | 34402 |  |  | on |
| `battery_soc_6` | 34502 | 34502 |  |  | on |
| `battery_soc_7` | 34602 | 34602 |  |  | on |

## Operating state

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `bms_active_pack_index` | 32111 | 32111 |  |  | on |
| `force_mode` | 42010 | 42010 | 42010 | 42010 | on |
| `inverter_state` | 35100 | 35100 | 35100 | 35100 | on |
| `user_work_mode` | 43000 | 43000 | 43000 | 43000 | on |
| `work_mode` | 30010 | 30010 |  |  | on |

## Faults and alarms

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `alarm_status` | 36000 | 36000 | 36000 | 36000 | on |
| `alarm_status_low` | 36001 | 36001 | 36001 |  | on |
| `battery_1_protection_1` | 34007 | 34007 |  |  | on |
| `battery_1_protection_2` | 34008 | 34008 |  |  | on |
| `battery_2_protection_1` | 34107 | 34107 |  |  | on |
| `battery_2_protection_2` | 34108 | 34108 |  |  | on |
| `battery_3_protection_1` | 34207 | 34207 |  |  | on |
| `battery_3_protection_2` | 34208 | 34208 |  |  | on |
| `battery_4_protection_1` | 34307 | 34307 |  |  | on |
| `battery_4_protection_2` | 34308 | 34308 |  |  | on |
| `battery_5_protection_1` | 34407 | 34407 |  |  | on |
| `battery_5_protection_2` | 34408 | 34408 |  |  | on |
| `battery_6_protection_1` | 34507 | 34507 |  |  | on |
| `battery_6_protection_2` | 34508 | 34508 |  |  | on |
| `battery_7_protection_1` | 34607 | 34607 |  |  | on |
| `battery_7_protection_2` | 34608 | 34608 |  |  | on |
| `fault_status` | 36100 | 36100 | 36100 | 36100 | on |
| `fault_status_2` | 36102 | 36102 | 36102 |  | on |
| `fault_status_2_low` | 36103 | 36103 | 36103 |  | on |
| `fault_status_low` | 36101 | 36101 | 36101 |  | on |
| `mppt_error` | 37023 | 37023 |  |  | on |
| `mppt_warning` | 37024 | 37024 |  |  | on |

## PV

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `mppt1_current` | 30024 | 30024 |  |  | on |
| `mppt1_power` | 30037 | 30037 |  |  | on |
| `mppt1_voltage` | 30020 | 30020 |  |  | on |
| `mppt2_current` | 30025 | 30025 |  |  | on |
| `mppt2_power` | 30038 | 30038 |  |  | on |
| `mppt2_voltage` | 30021 | 30021 |  |  | on |
| `mppt3_current` | 30026 | 30026 |  |  | on |
| `mppt3_power` | 30039 | 30039 |  |  | on |
| `mppt3_voltage` | 30022 | 30022 |  |  | on |
| `mppt4_current` | 30027 | 30027 |  |  | on |
| `mppt4_power` | 30040 | 30040 |  |  | on |
| `mppt4_voltage` | 30023 | 30023 |  |  | on |

## Setpoints written by automations

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `set_charge_power` | 42020 | 42020 | 42020 | 42020 | on |
| `set_discharge_power` | 42021 | 42021 | 42021 | 42021 | on |

## Per battery pack

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `battery_1_mos_status` | 34004 | 34004 |  |  | on |
| `battery_2_mos_status` | 34104 | 34104 |  |  | on |
| `battery_3_mos_status` | 34204 | 34204 |  |  | on |
| `battery_4_mos_status` | 34304 | 34304 |  |  | on |
| `battery_5_mos_status` | 34404 | 34404 |  |  | on |
| `battery_6_mos_status` | 34504 | 34504 |  |  | on |
| `battery_7_mos_status` | 34604 | 34604 |  |  | on |

## Everything else in this group

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `charging_cutoff_capacity` |  |  |  | 44000 | off |
| `discharge_limit_mode` |  |  |  | 41010 | off |
| `discharging_cutoff_capacity` |  |  |  | 44001 | off |
| `factory_reset` | 41001 | 41001 | 41001 | 41001 | off |
| `grid_standard` |  |  |  | 44100 | on |
| `internal_mos2_temperature` |  |  | 35002 | 35002 | off |
| `max_cell_voltage` |  |  | 37007 | 37007 | off |
| `min_cell_voltage` |  |  | 37008 | 37008 | off |
| `reset_device` | 41000 | 41000 | 41000 | 41000 | on |

# The ultra-low rate

These do not move on their own - only when somebody changes them, in the device, in
the app, or through a firmware update. They are read every five minutes.

A schedule changed in the Marstek app therefore takes up to five minutes to appear
here. That is the whole cost of this group.

## PV

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `mppt_version` | 30205 | 30205 |  |  | on |

## Per battery pack

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `battery_1_bms_version` | 34010 | 34010 |  |  | on |
| `battery_1_cycle_count` | 34003 | 34003 |  |  | on |
| `battery_2_bms_version` | 34110 | 34110 |  |  | on |
| `battery_2_cycle_count` | 34103 | 34103 |  |  | on |
| `battery_3_bms_version` | 34210 | 34210 |  |  | on |
| `battery_3_cycle_count` | 34203 | 34203 |  |  | on |
| `battery_4_bms_version` | 34310 | 34310 |  |  | on |
| `battery_4_cycle_count` | 34303 | 34303 |  |  | on |
| `battery_5_bms_version` | 34410 | 34410 |  |  | on |
| `battery_5_cycle_count` | 34403 | 34403 |  |  | on |
| `battery_6_bms_version` | 34510 | 34510 |  |  | on |
| `battery_6_cycle_count` | 34503 | 34503 |  |  | on |
| `battery_7_bms_version` | 34610 | 34610 |  |  | on |
| `battery_7_cycle_count` | 34603 | 34603 |  |  | on |

## Everything else in this group

| Reading | Venus A | Venus D | Venus E v3 | Venus E v1 & v2 | Default |
|---|---|---|---|---|---|
| `battery_cycle_count` |  |  | 34003 |  | on |
| `battery_total_energy` | 32105 | 32105 | 32105 | 32105 | on |
| `ble_mac_address` | 30304 | 30304 | 30304 | 30402 | on |
| `bms_version` |  |  | 30204 | 31102 | on |
| `device_ip_address` | 30400 | 30400 |  |  | on |
| `ems_boot_version` | 30201 | 30201 |  |  | on |
| `ems_version` | 30200 | 30200 | 30200 | 31101 | on |
| `gateway_ip_address` | 30402 | 30402 |  |  | on |
| `max_charge_power` | 44002 | 44002 | 44002 | 44002 | on |
| `max_discharge_power` | 44003 | 44003 | 44003 | 44003 | on |
| `schedule_1_days` | 43100 | 43100 | 43100 | 43100 | on |
| `schedule_1_enabled` | 43104 | 43104 | 43104 | 43104 | on |
| `schedule_1_end` | 43102 | 43102 | 43102 | 43102 | on |
| `schedule_1_mode` | 43103 | 43103 | 43103 | 43103 | on |
| `schedule_1_start` | 43101 | 43101 | 43101 | 43101 | on |
| `schedule_2_days` | 43105 | 43105 | 43105 | 43105 | on |
| `schedule_2_enabled` | 43109 | 43109 | 43109 | 43109 | on |
| `schedule_2_end` | 43107 | 43107 | 43107 | 43107 | on |
| `schedule_2_mode` | 43108 | 43108 | 43108 | 43108 | on |
| `schedule_2_start` | 43106 | 43106 | 43106 | 43106 | on |
| `schedule_3_days` | 43110 | 43110 | 43110 | 43110 | on |
| `schedule_3_enabled` | 43114 | 43114 | 43114 | 43114 | on |
| `schedule_3_end` | 43112 | 43112 | 43112 | 43112 | on |
| `schedule_3_mode` | 43113 | 43113 | 43113 | 43113 | on |
| `schedule_3_start` | 43111 | 43111 | 43111 | 43111 | on |
| `schedule_4_days` | 43115 | 43115 | 43115 | 43115 | on |
| `schedule_4_enabled` | 43119 | 43119 | 43119 | 43119 | on |
| `schedule_4_end` | 43117 | 43117 | 43117 | 43117 | on |
| `schedule_4_mode` | 43118 | 43118 | 43118 | 43118 | on |
| `schedule_4_start` | 43116 | 43116 | 43116 | 43116 | on |
| `schedule_5_days` | 43120 | 43120 | 43120 | 43120 | on |
| `schedule_5_enabled` | 43124 | 43124 | 43124 | 43124 | on |
| `schedule_5_end` | 43122 | 43122 | 43122 | 43122 | on |
| `schedule_5_mode` | 43123 | 43123 | 43123 | 43123 | on |
| `schedule_5_start` | 43121 | 43121 | 43121 | 43121 | on |
| `schedule_6_days` | 43125 | 43125 | 43125 | 43125 | on |
| `schedule_6_enabled` | 43129 | 43129 | 43129 | 43129 | on |
| `schedule_6_end` | 43127 | 43127 | 43127 | 43127 | on |
| `schedule_6_mode` | 43128 | 43128 | 43128 | 43128 | on |
| `schedule_6_start` | 43126 | 43126 | 43126 | 43126 | on |
| `software_version` |  |  |  | 31100 | on |
| `vms_version` | 30202 | 30202 | 30202 |  | on |
| `vns_boot_version` | 30203 | 30203 |  |  | on |

# The slow rate

Every reading not named above: energy counters, cell voltages, temperatures, pack
currents and voltages, configuration switches. Values that do move on their own, just
slowly - unlike the group above them, which sits still until somebody changes
something.

Two things that tend to surprise:

- The coordinator ticks at the **smaller** of fast and slow. When several groups fall
  due in the same tick the whole round is read first, so the fast readings from that
  tick arrive correspondingly later. That is why the floor for the slow rate sits
  above what a full round takes.
- Calculated values have no interval of their own. They recompute on every tick from
  whatever is present, so their freshness is their inputs' freshness.

This page is generated: `python3 scripts/generate_polling_doc.py`.
