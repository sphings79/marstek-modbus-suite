# Register Research Notes

This document captures findings from register scanning and testing across Marstek device models.
Registers documented here were investigated but not included in the integration (no added value,
unclear semantics, or duplicate/inferior alternatives exist).

Add a section per model following the structure below.

---

## Definition fields that change how a register is read or written

Most fields of a definition (`register`, `data_type`, `scale`, `unit`, ...) are
self-explanatory. These few change the behaviour of the integration and are
easy to miss:

| Field | Where | Effect |
|-------|-------|--------|
| `isolated: true` | any polled definition | Read in a request of its own, never as part of a block, and no block is bridged across it. For registers that do something when they are read. |
| `NO_BLOCK_READ_RANGES` | top level of a map | List of `[first, last]` register ranges. A block read never starts in, ends in or spans one of them; a definition inside one is treated as `isolated`. Applies whether or not the definitions in the range are loaded (DEV groups off), so a gap between two wanted registers is never bridged into such a range. |
| `bit_descriptions` | sensor definitions | Bit number -> text. The state stays the raw number; the set bits are exposed as the attributes `active_bits` and `active_faults`. (The `BITFIELD_TEXT_SENSOR_DEFINITIONS` section does the same as a separate text sensor.) |
| `states` | sensor definitions | Register value -> text. The text is the state; the number it was mapped from is exposed as the attribute `raw_value` (left out while there is no number). |
| `confirm: true` | button definitions | Two-step press: the first press only raises the warning stored in the translations under `exceptions.confirm_<key>`, a second press within 15 s writes the command. `scripts/check_translations.py` checks that the warning exists in every language. |
| `DEV_BUTTON_DEFINITIONS` | top level of a map | Buttons that are only created with the option "Show DEV registers". Named "DEV ..." like the DEV sensors. |

---

## Venus E Gen 3.0 (e_v3.yaml)

Hardware tested: Marstek Venus E v3, firmware V148.

The table below is the scan log of that firmware, kept as it was. Since 3.1.0-beta.3 the map has
been checked against the firmware of the control unit (151), the inverter micro (119) and the BMS
(115); where a row contradicts the subsection "3.1.0-beta.3: firmware-checked register map" below,
the subsection is right.

| Register | Notes |
|----------|-------|
| 30000 | Alternative for `battery_voltage` (32100). scale 0.1 V, uint16. Less precise. |
| 30002 | Alternative for `internal_temperature` (35000). scale 0.1 °C, int16. Duplicate. |
| 30003 | Alternative for `internal_mos1_temperature` (35001). scale 0.1 °C, int16. Duplicate. |
| 30004 | Alternative for `inverter_voltage` (32200). scale 0.1 V, uint16. Duplicate. |
| 30005 | Alternative for `ac_offgrid_voltage` (32300). scale 0.1 V, uint16. Duplicate. |
| 30007 | Alternative for `ac_offgrid_power` (32302). scale 1 W, int16. Duplicate. |
| 30100 | Alternative for `battery_voltage` (32100). scale 0.01 V, uint16. Inferior. |
| 30102 | Alternative for `max_cell_voltage` (37007). scale 0.001 V. Inferior. |
| 30103 | Alternative for `min_cell_voltage` (37008). scale 0.001 V. Inferior. |
| 30104 | Alternative for `max_cell_temperature` (35010). scale 0.01 °C, uint16. Inferior. |
| 30105 | Alternative for `min_cell_temperature` (35011). scale 0.01 °C, uint16. Inferior. |
| 30107 | Alternative for `bms_temperature_1` (34011). scale 0.1 °C, int16. Duplicate. |
| 30108 | Alternative for `bms_temperature_2` (34012). scale 0.1 °C, int16. Duplicate. |
| 30210 | Alternative for `bms_code` (34004). uint16. Duplicate. |
| 30212 | Self-test result after power-on (`selftest_status`, since 3.1.0-beta.3; 0 not run, 1 OK, 2 EEPROM, 3 flash, 5 Ethernet chip reports another version than expected). The 5 seen in the scan is harmless with a working LAN: two real Venus D report it while the Ethernet chip version (45605) reads 0x4A instead of the expected 0x4B. Only 2 and 3 are real faults. |
| 32101 | Unknown. Internal EMS state indicator — does not map to `inverter_state` or `user_work_mode`. Small integers (4–42) = active app-controlled charge/discharge; 0x9999 (39321) = app idle/bypass; 0x9967 (39271) = RS485-controlled discharge. Sentinel values may encode control source. Observed values: UPS 300W=4, Manual 450W=7, Manual 2500W=42, Manual 2500W (SoC>=95%)=30, Manual 500W=8, Manual 300W=4, Bypass/Stop=39321, RS485 discharge 2500W=39271. |
| 32104 | Alternative for `battery_soc_int` (37005). scale 1 %, uint16. Duplicate. |
| 32106 | BMS charge current limit, 0.1 A. **Integrated** as `bms_charge_current_limit` (35111 serves the same value). |
| 32107 | BMS discharge current limit, 0.1 A. **Integrated** as `bms_discharge_current_limit` (35112 serves the same value). |
| 32108 | Alternative for `max_cell_temperature` (35010). scale 0.1 °C. Inferior. |
| 32109 | Alternative for `bms_online` (37000). uint16. Duplicate. |
| 32301 | Alias of 32300: the off-grid voltage, not a current (230.0 V would show as 23.00 A). The entry `ac_offgrid_current` was removed in 3.1.0-beta.3. |
| 34000 | Alternative for `battery_voltage` (32100). scale 0.01 V, uint16. Inferior. |
| 34001 | Alternative for `battery_current` (30101). scale 0.1 A, int16. Duplicate. |
| 34005 | Alternative for `max_cell_voltage` (37007). scale 0.001 V. Inferior. |
| 34006 | Alternative for `min_cell_voltage` (37008). scale 0.001 V. Inferior. |
| 34010 | Alternative for `bms_version` (30204). uint16. Inferior. |
| 34017 | Alternative for `bms_status` (30106). uint16. Duplicate. |
| 35110 | BMS charge voltage limit, constant 57.6 V (576 × 0.1 V). **Integrated** as `bms_charge_voltage_limit`, informational only on the Venus E v3. |
| 35111 | BMS charge current limit, 0.1 A: the same value as 32106 (`bms_charge_current_limit`). Changes with mode and SoC (observed: charge 330, discharge 2500 W at SoC ~46 % 1000). |
| 35112 | BMS discharge current limit, 0.1 A: the same value as 32107 (`bms_discharge_current_limit`). |
| 36000 | Alarm word, uint32, count 2 (36000 + 36001). **Integrated** as `alarm_status`; the only bit written is bit 0 (waiting for the grid release). |
| 36100 | Fault word 1, uint32 (36100 high, 36101 low). **Integrated** as `fault_status` / `fault_status_low` with bit texts; 36102 / 36103 is the second fault word (`fault_status_2_low`; 36102 is never written). |
| 37006 | Alternative for `cell_temperature_1` (34013). scale 0.1 °C, int16. Duplicate. |
| 37012 | Alternative for `bms_version` (30204). uint16. Inferior. |
| 37016 | Alternative for `ac_voltage` (36103). scale 0.1 V, uint16. Duplicate. |
| 45603 | Inverter calibration value A: a CAN round trip to the micro, BCD counter delta (unit probably Wh), 0 to 9999. Kept as DEV sensor `dev_45603`; the read blocks the Modbus task for up to 200 ticks. |
| 45604 | Inverter calibration value B, like 45603. DEV sensor `dev_45604`. |
| 45605 | Version of the Ethernet chip (direct SPI read, 74 in the V148 scan). **Integrated** as `ethernet_chip_version`, isolated. |
| 47400 | Unknown. Value 43707 (0xAABB) in V148 scan. Alternating-nibble sentinel — same class as 0x9999, likely "not configured" / undefined. |

### 3.1.0-beta.3: firmware-checked register map

The map was checked against the Venus E v3 firmware: control 151, inverter micro 119, BMS 115.
What changed in `e_v3.yaml`:

- **Renamed** (migrated in `__init__.py`, see `RENAMED_KEYS["e v3"]` in `const.py`): `device_name`
  → `device_model` (fixed string `VNSE3-0`), `vms_version` → `vns_version`,
  `battery_total_energy` → `battery_rated_capacity` (nominal capacity of the one fixed pack,
  5.12 kWh constant in the BMS 115, `energy_storage`), `schedule_N_mode` → `schedule_N_power`;
  select option `trade_mode` → `ai`. `min_cell_temperature` keeps its key: 35010 / 35011 are the
  consistent maximum / minimum of the one pack. `internal_temperature` / `internal_mos1_temperature`
  (35000 / 35001) keep their keys and get the display names "Inverter Temperature NTC CH12 / CH5"
  through `translation_key`: the two NTC channels are swapped against the Venus D and the code
  does not tie either to a MOSFET.
- **Removed:** `alarm_status` (16-bit, 36000 alone) and `alarm_status_low` (36001 alone) — replaced
  by one uint32 `alarm_status` over 36000 + 36001, because a lone read of 36001 returns 36101;
  `fault_status_2` (36102, never written) and its description; the old `factory_reset` on 41001;
  and three aliases (one entry per source): `ac_offgrid_current` (32301 = 32300, the off-grid
  voltage), `ac_current` (37004 = 30006, the grid power, not a current) and
  `internal_mos2_temperature` (35002 = 35001, not a second MOSFET sensor). 36101 and 36103 are
  never read on their own either (a lone read of 36101 returns 36103, of 36103 the grid voltage):
  36100, 36101 and 36103 sit together so that they are read in one block.
- **Corrected:** types (`ac_frequency`, the discharge energy counters, `battery_cycle_count`, the
  cell voltages and `min`/`max_cell_voltage` are unsigned), `battery_power` and `battery_soc`
  precision (whole watts; one decimal for the SOC, which is the float SOC integrated from the
  inverter's battery power, not a BMS coulomb counter), `bluetooth_status` states,
  `inverter_state` texts (0 standby / disabled / no data, 1 idle, 4 and 6 idle in backup / parallel
  mode), bit texts of `fault_status_low_description` (grid over/under-voltage and frequency, peak;
  the two bits without a setter removed) and `fault_status_2_low_description` (software
  over-current above 30 A on three samples, DC bus over-voltage above 530 V), the new bit text of
  `alarm_status_low_description` (bit 0: grid release missing, waiting for the grid; the key keeps
  its name, its source is `alarm_status`).
- **Limits:** `max_charge_power` / `max_discharge_power` 50–2500 W (never 0; the micro persists the
  value and reloads it without a range check; on the Venus E v3 a stored 0 would at least show in
  the read-back), the read-back up to 3000 W (the micro's factory state after a reset) is shown
  unclamped; `charge_to_soc` from 13 %; the schedule start / end are HHMM clock times and
  `schedule_N_power` runs ±2500 W. 4.000 V on the cell voltages right after the start is a clamp
  of the BMS report, not a measurement.
- **New, disabled by default:** 32106 / 32107 `bms_charge_current_limit` /
  `bms_discharge_current_limit` (35111 / 35112 are duplicates), 34004 `battery_1_mos_status`,
  34007 / 34008 / 34009 `battery_1_protection_1` / `_2` / `battery_1_bms_warnings` with the bit
  texts of the E3 BMS (37009–37011 are duplicates), 34011–34016 `battery_1_env_temperature`,
  `battery_1_mos_temperature`, `battery_1_cell_temperature_1..4` (signed; 30107 / 30108 are
  mirrors), 34017 `battery_1_profile` (data type `uint8_low`: only the low byte, the profile 0–5;
  the high byte, the inverse of 34004, is not decoded), 30212 `selftest_status`, 30201 / 30203
  `ems_boot_version` / `vns_boot_version`, 30000 `inverter_dc_voltage`, 35110
  `bms_charge_voltage_limit`, 45605 `ethernet_chip_version` (isolated).
- **Buttons:** `factory_reset` is 41000 = 0xAA11 (confirm, own warning text through `confirm_key`):
  control unit and FC41D certificates to factory settings, micro to its factory defaults (limits
  3000 / 3000 W, grid standard 0, which only the micro's own RS485 or shell restores), BMS only its
  protection block. New `led_test` (45012), `inverter_eeprom_test` (45001, result DEV 30213) and
  `read_inverter_input_pb1` (45006, result DEV 30211). DEV buttons: 45002 inverter sleep request
  (confirm; a brief stop of about 0 to 5 s, no latch) and 45028 BMS factory reset (confirm, own
  warning: protection block and restart; SOC calibration data and profile stay). Deliberately not
  offered: 40000, 45000, 45003–45005, 45007–45010, 45011 (the BMS 115 has a receiver and switches
  the profile persistently), 45020–45024, 45027, 45029, 45030 (no effect), 45031 (unreliable
  reply), 46000 ([docs/not-offered-registers.md](../../../docs/not-offered-registers.md)). The
  service `set_wifi` for 41500–41631 works on the Venus E v3 as well, with the same limits
  ([docs/set-wifi.md](../../../docs/set-wifi.md)).
- **One fixed pack:** the BMS 115 only sends pack 1 (16 cells). There are no entities for packs 2
  to 7, no pack counter and no online mask (32109–32111 are the constants 1 / 1 / 1). There is no
  MPPT or PV stage and no class-2 unit either.
- **Not offered, other:** 30010 (valid after 45000 only), 32100 / 32101 / 32104 / 32202 / 32203,
  34000 / 34001 / 34005 / 34006 / 34010 and 37005 (mirrors of offered entities), 37001–37003
  (only meaningful after a 40000 run) and the SSID buffer 41500–41515 (no `wifi_ssid` entity).
- **DEV:** 30211 (after 45006), 30213 (after 45001), 45603 / 45604 (calibration values, read on
  request only).
- **Isolated reads:** see `NO_BLOCK_READ_RANGES` at the end of `e_v3.yaml`.

---

## Firmware families — do not mix

Venus **A**, **D** and **E v3** share one firmware base. Venus **E v1/v2** is built on a
different one. Register meanings, bit tables and scale factors established on A/D/E3 must
not be copied into `e_v12.yaml`, and vice versa: identical register numbers across the two
families mean nothing until verified against that family's own firmware.

## Venus D (d.yaml)

Hardware tested: Marstek Venus D, multi-pack setup (verified with up to 6 packs installed;
address pattern extends to a 7th pack). BMS firmware observed going 116 → 1177 (v117.7) after a BMS update.
All registers below were read back and cross-checked on real hardware, but are **not** added to the
integration — following the same policy applied to Venus A/E, which integrates only per-pack SoC and
per-pack cell voltages, not the remaining per-pack scalars.

Integrated (for reference): `battery_soc_1..6` (34002/34102/34202/34302/34402/34502),
`battery_2..6_cell_1..16_voltage` (34118–34133 / 34218–34233 / 34318–34333 / 34418–34433 / 34518–34533,
16 cells per pack — Venus D packs carry 16 cells vs. 13 on Venus A), `fault_status` (36100).
Pack 1 cell voltages (34018–34033) were already present. `alarm_status` (36000/36001) and
`fault_status_2` (36102) were removed in 3.1.0-beta.3: the firmware never writes them on the
Venus D, so they always read 0.
Packs 2–4 cell voltages are FW-confirmed; packs 5–6 follow the identical +0x100 register pattern
(pattern-derived, same treatment as Venus A `a.yaml`).

### Mirrors / inferior duplicates of already-integrated sensors

| Register | Notes |
|----------|-------|
| 30002 | Mirror of `internal_temperature` (35000). int16, scale 0.1 °C. |
| 30003 | Mirror of `internal_mos1_temperature` (35001). int16, scale 0.1 °C. |
| 30004 | Mirror of `ac_voltage` (32200). uint16, scale 0.1 V. |
| 37005 | Integer SoC without scale. Inferior to `battery_soc` (32104). |

### Per-pack scalars

Pattern: each pack is offset by +0x100 (pack 1 = 340xx, pack 2 = 341xx, …). Values below confirmed
across packs 1–5 (pack 6 follows the same pattern; populated only when a 6th pack is present).
Layout updated per the 2026-08-16 firmware descriptor-table correction (BMS CAN frames 0x23 / 0x41).

The per-pack health registers are now integrated for packs 1–6 (all disabled by default):
temperatures (34011/34012 → `battery_N_env_temperature` / `battery_N_mos_temperature`), the cell-NTC
block (34013–34016 → `battery_N_cell_temperature_1..4`), the cell-voltage extremes (34005/34006 →
`battery_N_max_cell_voltage` / `battery_N_min_cell_voltage`), and the protection bitmasks (34007/34008 →
`battery_N_protection_1` / `battery_N_protection_2`). The remaining rows stay reference-only.

#### Individual cells: what the device does not report

`max_cell_voltage` / `min_cell_voltage` (37007/37008) and the per-pack 34005/34006 carry
the value only — no register anywhere gives the cell index it came from. The four cell
NTCs (34013–34016) cover sixteen cells with no documented mapping, which is why the
entities are named "Cell NTC 1..4" rather than "Cell Temperature 1..4".

| Register (pack 1 / +0x100 per pack) | Key | Notes |
|----------|-----|-------|
| 34000 | pack battery voltage | uint16, scale 0.01 V. Pack 1 = `battery_voltage`; packs 2–6 **integrated** as `battery_N_voltage`. |
| 34001 | pack battery current | int16, scale 0.1 A. Negative = discharge. Pack 1 = `battery_current`; packs 2–6 **integrated** as `battery_N_current`. |
| 34003 | pack cycle count | uint16 (a counter, never negative). **Integrated** as `battery_N_cycle_count`; `battery_cycle_count` is the mean over the fitted packs. |
| 34004 | pack MOS status | u8 bit field: bit 0 = charge MOSFET on, bit 1 = discharge MOSFET on. **Integrated** as `battery_N_mos_status`; the value stays numeric, the translations label the four states. |
| 34005 | pack max cell voltage | uint16, scale 0.001 V. **Integrated** as `battery_N_max_cell_voltage`. Value only — no cell index. |
| 34006 | pack min cell voltage | uint16, scale 0.001 V. **Integrated** as `battery_N_min_cell_voltage`. Value only — no cell index. |
| 34007 | pack protection bitmask 1 | uint16 bitmask (BMS CAN frame 0x23, protect1; level-2 protections). **Integrated** as `battery_N_protection_1`, bits decoded into attributes. |
| 34008 | pack protection bitmask 2 | uint16 bitmask (frame 0x23, protect2). A low-SoC/undervoltage bit (0x0002) was observed here during discharge testing (triggers below ~10.7%). **Integrated** as `battery_N_protection_2`. |
| 34009 | pack BMS warning flags | uint16 bitmask of the level-1 warnings (value 2 = cell under-voltage warning). **Integrated** in 3.1.0-beta.3 as `battery_N_bms_warnings`, bits decoded into attributes. |
| 34010 | pack BMS version | uint16. 116 → 1177 (v117.7) after BMS firmware update. **Integrated** as `battery_N_bms_version`. |
| 34011 | pack ENV NTC (ambient) | int16, scale 0.1 °C (BMS frame 0x41). Was previously labelled "cell NTC 0". **Integrated** as `battery_N_env_temperature`. |
| 34012 | pack MOS NTC (MOSFET) | int16, scale 0.1 °C (BMS frame 0x41). Was previously labelled "cell NTC 1". **Integrated** as `battery_N_mos_temperature`. |
| 34013–34016 | pack cell NTC block | int16 ×4, scale 0.1 °C (pack struct +0x40). **Integrated** as `battery_N_cell_temperature_1..4`, displayed as "Cell NTC 1..4" — four thermistors for sixteen cells, no cell mapping. |
| 34017 | pack NTC (unused) | uint16, scale 0.1 °C. BMS frame 0x41 bytes 6–7 are not populated. |

All pack temperatures are signed. Until 3.1.0-beta.3 they were read as uint16, which turned a
reading below 0 °C into about 6553 °C.

### Alternative / redundant sources (firmware-confirmed, intentionally not integrated)

These are valid firmware registers, but each duplicates a value already exposed through a better
source, so they are documented rather than added as extra entities.

| Register | Firmware name | Why not integrated |
|----------|---------------|--------------------|
| 30028 | `mppt_battery_side_voltage` | Battery-side voltage of the MPPT-type unit (0.1 V), not the PV strings. That unit has no firmware to check, so it is a DEV sensor (`dev_30028`) since 3.1.0-beta.3. |
| 30029 | `mppt_battery_side_current` | Battery-side converter current of the MPPT-type unit (0.1 A, signed). DEV sensor `dev_30029`. |
| 32100 | `bms_battery_voltage` | BMS/CAN aggregate battery voltage (0.01 V). Alternative to `battery_voltage`. |
| 32101 | `bms_battery_current` | BMS/CAN aggregate battery current (1 A). Coarser alternative to `battery_current`. |
| 32102 | `bat_sample_power` | Battery power as float32. Alternative to `battery_power` (30001, int16 W). |
| 37017–37020 | `mppt1..4_power` | Same source as `mppt1..4_power` (30037–30040), which are already integrated. |
| 37002 / 37003 | `max_charge_power` / `max_discharge_power` | Read-back of the power limits already exposed as the `max_charge_power` / `max_discharge_power` number entities. |

### Device-wide cell extremes are pack 1's (37007 / 37008) — removed for Venus D

The firmware's descriptor table resolves 37007 and 37008 to the same SRAM source as the
per-pack registers 34005 and 34006:

| Register | Source pointer | Firmware field |
|----------|----------------|----------------|
| 37007 · 34005 | `0x20014FC4` | pack 1 max cell voltage |
| 37008 · 34006 | `0x20014FC6` | pack 1 min cell voltage |

There is no device-wide maximum or minimum. `max_cell_voltage` / `min_cell_voltage`
promised an aggregate across all packs and delivered pack 1 only, which is misleading on
a six-pack Venus D. Both were removed from `d.yaml`; use `battery_1_max_cell_voltage` /
`battery_1_min_cell_voltage`, which say what they are. `a.yaml` maps only the per-pack ones
as well. `e_v3.yaml` keeps them (one fixed pack, so pack 1 is the whole battery) and
`e_v12.yaml` keeps them because that model was not verified.

`bms_version` (30204) shares its source with `battery_1_bms_version` (34010) in the same
way; `d.yaml` maps only the latter, and `firmware_version` uses it as a dependency key.

### Backup / UPS output (30005 / 30007) — duplicates, deliberately not integrated

Both resolve to the same firmware source as `ac_offgrid_voltage` (32300) and
`ac_offgrid_power` (32302). Do not add sensors for them.

### Network configuration — integrated

| Register | Key | Notes |
|----------|-----|-------|
| 30400–30401 | `device_ip_address` | Two octets per register, high byte first. 0xC0A8 / 0x0132 → 192.168.1.50. |
| 30402–30403 | `gateway_ip_address` | Same encoding. 0xC0A8 / 0x0101 → 192.168.1.1. |

Decoded by the `ipv4` data type in `helpers/modbus_client.py`. Diagnostic, disabled by default.

### Firmware descriptor-table analysis (v150)

A later pass decoded the device's on-firmware descriptor tables (FC03 read descriptors, plus the
FC06/FC10 write-handler table with their SRAM targets). This is authoritative for register names,
types and layout. Findings folded into the integration and this document:

**Newly integrated diagnostic sensors** (all `category: diagnostic`, disabled by default):

| Register | Sensor | Notes |
|----------|--------|-------|
| 30205 | `mppt_version` | MPPT firmware version (u16, observed 104). |
| 32109 | `bms_pack_count` | Number of packs the BMS reports present (CAN `bat_total_nb`). |
| 32110 | `bms_online_mask` | u16 bitmask: which packs are online (`bat_online_mask`). |
| 32111 | `bms_active_pack_index` | Index of the currently active pack (`work_bat_idx`). |
| 35110 | `bms_charge_voltage_limit` | BMS charge voltage limit, 0.1 V (CAN `chrg_volt`, observed 57.6 V). |
| 37023 | `mppt_error` | MPPT error word (Inverter struct +0x02). |
| 37024 | `mppt_warning` | MPPT warning word (Inverter struct +0x06). |

**Write/control registers — confirmed already integrated.** The firmware write-handler table matches
the existing `number`/`select`/`switch`/`button` definitions (e.g. 42020/42021 charge/discharge power,
44002/44003 max power, 42011 target SoC, 42010 force mode, 43000 work mode, 41200 backup, schedules).
No change needed — the decode simply validates them.

**Write registers intentionally NOT integrated** (decoded from firmware but never write-tested;
some are hazardous to expose as live entities):

| Register | Firmware name | Why excluded |
|----------|---------------|--------------|
| 40000 | `burnin_cycle_test_start` | Starts the inverter's own battery charge/discharge cycle test (up to 2.5 kW on the Venus D, up to 1.35 kW on the Venus A; the derate flag stays set). It is not an RS485 unlock, as an earlier version of this table said. See [docs/not-offered-registers.md](../../../docs/not-offered-registers.md). |
| 41100 | `rs485_slave_address` | Read as the sensor `modbus_address`. Not writable from the integration: changing it silently breaks Modbus communication. |
| 41500–41631 | Wi-Fi SSID / password buffers | Not schedule arrays. 41500–41515 is the SSID and is read back as `wifi_ssid` (disabled by default) since 3.1.0-beta.3; 41600–41631 is the password, which always reads 0 and is not mapped. Both are written by the service `set_wifi` on the Venus D and A (see [docs/set-wifi.md](../../../docs/set-wifi.md)); the whole range is in `NO_BLOCK_READ_RANGES`. |

### 3.1.0-beta.3: firmware-checked register map

The whole map was checked against the control (147–151), inverter (115/116) and BMS
(117.7/118) firmware. What changed in `d.yaml`:

- **Renamed** (migrated in `__init__.py`, see `RENAMED_KEYS` in `const.py`): `device_name` →
  `device_model`, `vms_version` → `vns_version`, `battery_total_energy` →
  `battery_rated_capacity` (nominal capacity, `energy_storage`), `min_cell_temperature` →
  `battery_1_min_cell_temperature` (35011 is pack 1's minimum; there is no stack minimum),
  `schedule_N_mode` → `schedule_N_power`; select option `trade_mode` → `ai`.
- **Promoted from DEV:** 32112 `bms_lock_active`, 32113 `bms_factory_mode` (binary sensors),
  34x09 `battery_N_bms_warnings`, 45605 `ethernet_chip_version` (isolated). **New:** 32107
  `bms_discharge_current_limit`, 41500–41515 `wifi_ssid`.
- **Buttons:** `factory_reset` is now 41000 = 0xAA11 (41001 does not exist on the Venus D), new
  `led_test` (45012), `read_inverter_input_pb1` (45006, result DEV 30211), `inverter_eeprom_test`
  (45001), `pack_coding` (45029, status DEV 32114) and the DEV buttons 45002 (sleep request, a
  brief stop of about 0 to 5 s, no latch on the Venus D), 45027 and 45028. Deliberately not
  offered: 40000, 45000, 45003–45005, 45007–45010, 45020–45024, 45030, 45031, 46000 (all of them:
  [docs/not-offered-registers.md](../../../docs/not-offered-registers.md)). New service `set_wifi`
  for 41500–41631 ([docs/set-wifi.md](../../../docs/set-wifi.md)).
- **DEV:** what remains has a counterpart without firmware (the MPPT-type unit, A/E2-type
  hardware) or is only valid after a command. Removed as duplicates: 30102–30105, 30109, 30110,
  30210, 37006, 37009, 37010. Removed as proven to carry nothing: 30106, 30213, 41600–41631,
  46501–46544, 47400. Removed because it is only valid in a maintenance mode that is not offered
  (40000): 37001. 37021/37022 became one u32 `dev_37021`, because 37022 read alone returns 30028.
- **Isolated reads:** see `NO_BLOCK_READ_RANGES` at the end of `d.yaml`.

## Venus A (a.yaml)

### 3.1.0-beta.3: firmware-checked register map

The map was checked against the Venus A firmware: control 1509, inverter / MPPT micro 1211,
BMS 1105. What changed in `a.yaml`:

- **Renamed** (migrated in `__init__.py`, see `RENAMED_KEYS["a"]` in `const.py`): the same five
  keys as on the Venus D (`device_name`, `vms_version`, `battery_total_energy`,
  `min_cell_temperature`, `schedule_N_mode`) and the `user_work_mode` option `trade_mode` →
  `ai`. `internal_temperature` / `internal_mos1_temperature` (35000 / 35001) keep their keys and
  get the display names "Inverter Radiator 1 / 2 Temperature" through `translation_key`.
- **Removed:** `alarm_status`, `alarm_status_low`, `fault_status_2` (never written),
  `mppt_version` (30205, always 0: the MPPT stage is inside the micro), pack 7 (all
  `battery_7_*`, `battery_soc_7`; BMS 1105 sends packs 1–6 only — re-add if a BMS version sends
  pack 7), the old `factory_reset` on 41001. The firmware version string no longer contains the
  MPPT part (`ems_vms_bms`).
- **Promoted from DEV / new:** 32112 `bms_lock_active`, 32113 `bms_factory_mode`, 34x09
  `battery_N_bms_warnings` (N = 1–6), 45605 `ethernet_chip_version` (isolated), 32107
  `bms_discharge_current_limit`, 37021–37022 `pv_lifetime_energy` (one u32, 0.01 kWh).
- **Limits:** `max_charge_power` / `max_discharge_power` 50–1450 W (never 0), `set_charge_power` /
  `set_discharge_power` up to 1450 W, `charge_to_soc` from 13 %. The inverter micro drops values of
  1451 W or more without an error, so a higher limit would only be displayed.
- **Buttons:** `factory_reset` is 41000 = 0xAA11 (confirm), new `led_test` (45012) and
  `inverter_eeprom_test` (45001, result DEV 30213). DEV buttons: 45002 inverter off until reboot
  (confirm), 45020 PV restart, 45021 PV off / on, 45027 / 45028 BMS reset (confirm), 45030 BMS
  master role set / clear (confirm). Deliberately not offered: 40000, 45000, 45003–45010 except 45001/45002,
  45023/45024, 45029 (no effect on the A), 45031, 46000
  ([docs/not-offered-registers.md](../../../docs/not-offered-registers.md)). New service
  `set_wifi` for 41500–41631 ([docs/set-wifi.md](../../../docs/set-wifi.md)).
- **DEV:** what remains are the MPPT reply words 30030–30036 (valid after 45023 / 45024), the
  EEPROM test result 30213 and the aging results 45603 / 45604. Everything else was removed as a
  duplicate, as proven to carry nothing (MPPT frames 30214 / 38000–38014 have no sender on the A,
  30211, 30106, 30110, 32114, 41600–41631, 46501–46544, 47400) or because it is only valid after a
  command that is not offered (37001).
- **Isolated reads:** see `NO_BLOCK_READ_RANGES` at the end of `a.yaml`.
