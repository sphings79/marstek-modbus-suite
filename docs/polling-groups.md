# What gets polled how often

The integration polls at two rates. This page lists what is on the **fast** one —
anything not named here is on the slow one.

The split follows the reading rather than the model: all four register maps agree on
every single key. Whether an entity exists by default is a separate question — a
disabled entity is not read at all.

| | fast | slow |
|---|---|---|
| Default | 10 s | 60 s |
| Minimum Venus A / D | 3 s | 12 s |
| Minimum Venus E | 3 s | 10 s |

**68 readings on the fast rate**, 59 of them on by default. The other
282 are on the slow one.

An empty cell means that model does not have the reading.

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
| `mppt1_power` | 30037 | 30037 |  |  | on |
| `mppt2_power` | 30038 | 30038 |  |  | on |
| `mppt3_power` | 30039 | 30039 |  |  | on |
| `mppt4_power` | 30040 | 30040 |  |  | on |

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

## Everything else that is polled fast

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

## Everything else

Every reading not named above is polled at the slow rate — energy counters, versions,
cell voltages, schedules, temperatures, configuration switches. Things that either
barely move on their own or only move when somebody changes them.

Two things that tend to surprise:

- The coordinator ticks at the **smaller** of the two intervals, so a short slow
  interval also makes the fast group come round more often.
- Calculated values have no interval of their own. They recompute on every tick from
  whatever is present, so their freshness is their inputs' freshness.

This page is generated: `python3 scripts/generate_polling_doc.py`.
