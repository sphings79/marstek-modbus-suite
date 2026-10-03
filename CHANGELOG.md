# Changelog

Entries before 3.0.0-beta.12 are in the
[GitHub releases](https://github.com/sphings79/marstek-modbus-suite/releases).

---

## 3.1.0-beta.3

[3.1.0-beta.2](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.1.0-beta.2)
plus the changes below. This is a pre-release. If you want to stay on stable,
[3.0.1](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.1) is the one to use.
The register maps of the **Venus D**, **Venus A** and **Venus E v3** are checked
against the firmware.

The Venus D register map was checked against the firmware of the control unit
(147 to 151), the inverter (115, 116) and the BMS (117.7, 118). Wherever map
and firmware disagreed, the firmware won.

### Venus D: renamed entities, migrated automatically

Five readings carried a name that described something else. Key and name
change; existing installations keep the entity, its entity id, its history and
any customisation, because the registry entry is moved to the new key on
startup. Only the displayed name changes.

| Old key | New key | Why |
|---|---|---|
| `device_name` | `device_model` | Fixed model string (`VNSD-0`), not a name. Now diagnostic, read at the ultra-low rate. |
| `vms_version` | `vns_version` | Inverter firmware; "VMS" was a typo for VNS. |
| `battery_total_energy` | `battery_rated_capacity` | Nominal capacity (packs × 2560 Wh), not stored energy. Now `energy_storage` / `measurement`. |
| `min_cell_temperature` | `battery_1_min_cell_temperature` | Pack 1's minimum only; there is no minimum across the stack. |
| `schedule_N_mode` | `schedule_N_power` | The slot power in W (+ discharge, − charge, −1 self-consumption), not a mode. |

The `user_work_mode` option `trade_mode` is now `ai`, the firmware's AI mode.
Automations that select `trade_mode` on a Venus D need the new option name.

### Venus D: removed

- `alarm_status`, `alarm_status_low` and `fault_status_2` (with
  `fault_status_2_description`): the firmware never writes these words on the
  Venus D, they always read 0.
- The old `factory_reset` button wrote to 41001, which the Venus D does not
  implement; it did nothing. See the new buttons below.

The entities of an existing installation stay behind as "no longer provided"
and can be deleted.

### Venus D: corrected

- **Pack temperatures are signed.** The 42 pack temperatures (environment,
  MOSFET, cell NTC 1–4 of every pack) were read as unsigned, so a reading
  below 0 °C showed about 6553 °C.
- `battery_N_protection_1` is read as a bit mask (unsigned) and decodes its set
  bits into the attributes `active_bits` / `active_faults`;
  `battery_N_cycle_count` is unsigned.
- `battery_N_mos_status` shows which MOSFETs conduct (charge, discharge, both,
  none); the value stays numeric.
- `bluetooth_status`, `selftest_status` and `work_mode` show their states as
  text. `work_mode` is disabled by default: it only changes in a maintenance
  mode and otherwise reads a stale 0 — the work mode in effect is
  `user_work_mode`.
- Bit texts of `fault_status_low_description` (grid over/under-voltage and
  frequency, voltage peak; the two unconfirmed bits removed) and
  `fault_status_2_low_description` (software over-current, over-voltage).
- Limits: `charge_to_soc` from 13 % (the firmware refuses 10–12),
  `max_charge_power` / `max_discharge_power` from 50 W, never 0. The inverter
  stores the value in its EEPROM and reloads it after every restart without a
  range check, so 0 blocks charging or discharging for good, even across a
  restart. The register itself reads 0 after every restart until it is written
  again, so an entity cannot tell "blocked" from "unknown", and a forgotten 0
  looks like a defective battery. Each write also wears the EEPROM of two
  controllers. To stop charging or discharging, use `force_mode` = standby
  (RS485 control mode) or set the charge/discharge power set-point or a
  schedule slot to 0: these are volatile and leave nothing behind.
- Schedule start and end are HHMM clock times: the wrong unit "min" is gone,
  and a time with minutes of 60 or more is refused before it is written,
  because the device would reject it and switch the slot off.
- `battery_soc` without a decimal (the register is whole percent),
  `bms_charge_voltage_limit` disabled by default (constant 57.6 V).

### Venus D: new

- `bms_discharge_current_limit` (32107), next to the charge current limit.
- Per pack `battery_N_bms_warnings` (34x09): the BMS level-1 warnings, decoded
  into attributes. Value 2 is the cell under-voltage warning.
- Binary sensors `bms_lock_active` (BMS error lock, MOSFETs held off) and
  `bms_factory_mode` (disabled by default).
- `ethernet_chip_version` and `wifi_ssid`, both disabled by default.
- Buttons, all disabled by default: `factory_reset` — now the real factory
  reset (41000 = 0xAA11: control unit, inverter and every pack, Wi-Fi and cloud
  settings deleted, reboot) — `led_test`, `read_inverter_input_pb1`,
  `inverter_eeprom_test` and `pack_coding` (the app's "Battery Pack Recovery";
  only succeeds with exactly two packs). `factory_reset` and `pack_coding` need
  a second press within 15 s; the first press only shows the warning.
- **Service `marstek_modbus.set_wifi(ssid, password)`**, optional and off unless
  the option "Show DEV registers" is on: writes the Wi-Fi credentials of the
  battery's communication module through 41500–41631. It replaces the removed
  password registers (see "Venus D: DEV registers"). Everything is validated
  before the first write (SSID 1–31 characters, password empty or 8–31
  characters, printable ASCII without `,` and `"`), the password is never read
  back and never logged by the integration. The panel sends the credentials
  through the integration's websocket command `marstek_modbus/set_wifi` (same
  checks, same write sequence, admin only), which Home Assistant does not
  record. A call of the service itself (Developer tools, scripts, automations,
  YAML) is recorded by Home Assistant as a `call_service` event with the
  password in the recorder database; exclude that event type first if this
  matters (see the doc). **Warning:** the firmware stores the credentials in an
  EEPROM area (0x420–0x45F) that overlaps address 0x441, a firmware bug, so a
  wrong or aborted write can leave the module with wrong credentials; use it
  only when the battery is reachable another way (the app, a cable) to correct
  it. Details in [docs/set-wifi.md](docs/set-wifi.md).

### Venus D: DEV registers

The DEV groups were cleaned up. Registers that turned out to work became
regular entities (see above), duplicates and registers proven to carry nothing
were removed (89 of them, including the Wi-Fi password buffer, now written by
the service `set_wifi`, and the 46501–46544 block). What remains (30 registers)
belongs to a unit without firmware to check, mainly the MPPT stage, or is only
valid after a command. All DEV entities are now created disabled; enable the
ones you want read. The option "Show DEV registers" also brings three DEV buttons,
protected by a second press: two BMS commands (master reboot, factory reset of
every pack) and 45002, the inverter sleep request. On the Venus D 45002 is
short-lived: the inverter output stops for about 0 to 5 s until the firmware
clears the flag again and the inverter writes its EEPROM; unlike on the
Venus A there is no latch that lasts until a reboot. The duplicates section of
the map is empty on the Venus D.

### Venus D: registers that are never read in a block

To save requests the integration reads neighbouring registers together and
bridges small gaps. Some Venus D registers do something when they are read: a
read anywhere in 38000–39014 makes the control unit broadcast four CAN frames
per second until the next reboot, and a read of 45603–45605 blocks its Modbus
task for up to 200 ticks. The Wi-Fi registers 41500–41631 are in the list too:
they are written by the service `set_wifi` and nothing else reads them in a
block. These ranges (and a few others, listed in `d.yaml`) are now never part
of a block read and never bridged into: a register there is only read on its
own, and only when its entity is enabled.

### Venus A: checked against the firmware

The Venus A register map was checked against the firmware of the control unit
(1509), the inverter / MPPT micro (1211) and the BMS (1105). Wherever map and
firmware disagreed, the firmware won. The renames, the temperature fixes, the
bit texts and the new buttons of the Venus D apply to the Venus A in the same
way; what is specific to the Venus A follows.

### Venus A: renamed entities, migrated automatically

The same five keys as on the Venus D change on the Venus A, and are moved to
the new key on startup, so the entity, its entity id, its history and any
customisation stay: `device_name` → `device_model` (fixed string `VNSA-0`),
`vms_version` → `vns_version` ("VNS Version"), `battery_total_energy` →
`battery_rated_capacity` (nominal capacity, packs × 2080 Wh, now
`energy_storage` / `measurement`), `min_cell_temperature` →
`battery_1_min_cell_temperature` (pack 1 only) and `schedule_N_mode` →
`schedule_N_power`. The `user_work_mode` option `trade_mode` is now `ai`;
automations that select `trade_mode` on a Venus A need the new option name.

`internal_temperature` and `internal_mos1_temperature` (35000 / 35001) keep
their keys, because the keys are the unique ids, but they are shown as
"Inverter Radiator 1 / 2 Temperature": on the Venus A they are the two
radiator sensors of the inverter, with one decimal.

### Venus A: removed

- `alarm_status`, `alarm_status_low` and `fault_status_2` (with
  `fault_status_2_description`): the inverter never writes these words, they
  always read 0.
- `mppt_version` (30205): always 0 on the Venus A. The MPPT stage is part of
  the inverter micro, there is no separate MPPT firmware, so the version is the
  micro's `vns_version`. The combined `firmware_version` string therefore has
  no MPPT part any more (`V<control>.<inverter>.<BMS>`).
- **Pack 7** (all `battery_7_*` entities, `battery_soc_7` and the pack 7 inputs
  of the derived sensors): the BMS 1105 only sends the packs 1 to 6, pack 7
  always read 0. The entities come back if a BMS version ever sends pack 7;
  every new BMS version is checked for that.
- The old `factory_reset` button wrote to 41001, which the Venus A does not
  implement; it did nothing. See the new buttons below.
- The DEV registers that carry nothing or only repeat another register (see
  "Venus A: DEV registers"), including the MPPT frame registers 30214 and
  38000–38014: the MPPT stage is inside the micro, so nothing on the Venus A
  sends those frames.

The entities of an existing installation stay behind as "no longer provided"
and can be deleted.

### Venus A: corrected

- **Pack temperatures are signed** (environment, MOSFET, cell NTC 1–4 of
  packs 1 to 6), `battery_N_protection_1` is read as a bit mask (unsigned) and
  decodes its set bits into `active_bits` / `active_faults`,
  `battery_N_cycle_count` is unsigned.
- `inverter_state` has no state "OTA Upgrade" on the Venus A, and 0 reads
  "Disabled / no data" instead of "Sleep".
- `bluetooth_status`, `selftest_status` and `work_mode` show their states as
  text. `work_mode` is the inverter micro's mode (with the Venus A states
  "Debug", "Aging", "ATE aging", "CAN test mode", "Voltage source") and only
  changes in a maintenance state; it is disabled by default, the work mode in
  effect is `user_work_mode`.
- Bit texts of `fault_status_2_low_description` for the Venus A inverter:
  over-current above 15 A, DC bus over-voltage above 530 V (570 V in LLC mode),
  state-machine shutdown, off-grid overload or off-grid voltage below 207 V,
  invalid state, state transition timeout and a failed relay check.
- Limits: `charge_to_soc` from 13 % (the firmware refuses 10–12);
  `max_charge_power` / `max_discharge_power` from 50 W, never 0, up to 1450 W;
  `set_charge_power` / `set_discharge_power` up to 1450 W (before: 0 to
  1500 W). Why:
  - **Minimum 50 W, never 0.** The inverter stores the value in its EEPROM and
    reloads it after every restart without a range check, so 0 blocks charging
    or discharging for good, even across a restart. The register reads 0 after
    every restart until it is written again, so an entity cannot tell
    "blocked" from "unknown", and a forgotten 0 looks like a defective
    battery. Each write also wears the EEPROM. To stop charging or discharging,
    use `force_mode` = standby (RS485 control mode) or set the charge/discharge
    power set-point or a schedule slot to 0: these are volatile and leave
    nothing behind.
  - **Maximum 1450 W.** The control unit accepts up to 1500 W, but the inverter
    micro silently drops a value of 1451 W or more: it acknowledges the write
    and keeps its old limit. A limit of 1500 W would show 1500 W in Home
    Assistant while the micro keeps working with the old value, so 1450 W is
    the highest value that takes effect. The same limit applies to the
    power of a schedule slot: `schedule_N_power` ranges from −1450 to 1450 W.
- Schedule start and end are HHMM clock times: the wrong unit "min" is gone,
  and a time with minutes of 60 or more is refused before it is written,
  because the device would reject it and switch the slot off.
- `battery_soc` without a decimal (the register is whole percent).

### Venus A: new

- `pv_lifetime_energy` (37021–37022): lifetime PV yield of the inverter micro
  as an energy sensor (one 32-bit value in units of 10 Wh), replacing the two
  DEV registers 37021 and 37022 that could not be interpreted separately.
- `bms_discharge_current_limit` (32107), next to the charge current limit.
- Per pack `battery_N_bms_warnings` (34x09, packs 1 to 6): the BMS level-1
  warnings, decoded into attributes.
- Binary sensors `bms_lock_active` (BMS error lock, MOSFETs held off) and
  `bms_factory_mode` (disabled by default), and `ethernet_chip_version`
  (disabled by default).
- Buttons, all disabled by default: `factory_reset` — now the real factory
  reset (41000 = 0xAA11: control unit, inverter micro and every pack, Wi-Fi and
  cloud settings deleted, reboot, second press within 15 s) — `led_test` and
  `inverter_eeprom_test` (the result is the DEV sensor 30213).
- DEV buttons (only with the option "Show DEV registers", disabled by
  default): 45002 inverter off until the next reboot, 45020 PV restart, 45021 PV
  off and PV on (write-only, no read-back), 45027 BMS master reboot, 45028 BMS
  factory reset of every pack and 45030 set / clear the BMS master role. 45002,
  45027, 45028 and 45030 need a second press within 15 s; the first press only
  shows the warning. 45020 restarts the PV stage with a reference of 50 W,
  which the control unit overwrites after a few seconds.
- **Service `marstek_modbus.set_wifi(ssid, password)`**, the same as on the
  Venus D: writes the Wi-Fi credentials of the communication module through
  41500–41631, optional and off unless the option "Show DEV registers" is
  on, validated before the first write, the password never read back and never
  logged. The firmware stores the credentials in an EEPROM area (0x420–0x45F)
  that overlaps address 0x441, a firmware bug: a wrong or aborted write can
  leave the module with wrong credentials, so use it only when the battery is
  reachable another way (the app, a cable) to correct it. Details in
  [docs/set-wifi.md](docs/set-wifi.md).

### Venus A: DEV registers

What remains of the DEV groups (10 registers, down from 129) only carries a
value after a command: the MPPT reply words 30030–30036 (after 45023 / 45024,
which are not offered as buttons), the EEPROM test result 30213 (after 45001)
and the aging results 45603 / 45604. All DEV entities are created disabled.
Registers that turned out to work became regular entities (see above); the
entries of the duplicates section (13, one of them promoted), the Wi-Fi password
buffer (41600–41631, now written by the service `set_wifi`), the 46501–46544 block, 47400, 37001, 30211, 32114 and the
MPPT frame registers 30214 and 38000–38014 were removed, because they are
duplicates of a regular entity, carry nothing on the Venus A or are only valid
after a command that is not offered. The duplicates section of the map is
empty on the Venus A.

### Venus A: registers that are never read in a block

The same rule as on the Venus D, with the ranges of the Venus A: 30030–30035
(MPPT reply words), 38000–39014 (nothing is mapped there, but a read anywhere
in it still makes the control unit broadcast four CAN frames per second until
the next reboot, so no block may bridge into it), 41500–41631 (the Wi-Fi
buffers written by `set_wifi`), 45000–45031 (command registers, write-only),
45603–45605 (a read blocks the Modbus task for up to
200 ticks) and 46000 (switches RS485 to the shell). They are never part of a
block read and never bridged into; a register there is only read on its own,
and only when its entity is enabled.

### Venus E v3: checked against the firmware

The Venus E v3 register map was checked against the firmware of the control
unit (151), the inverter micro (119) and the BMS (115). Wherever map and
firmware disagreed, the firmware won. The renames, the type fixes, the bit
texts and the new buttons of the Venus D apply to the Venus E v3 in the same
way; what is specific to the Venus E v3 follows. The Venus E v3 has one fixed
battery pack and no MPPT / PV stage.

### Venus E v3: renamed entities, migrated automatically

Four keys change and are moved to the new key on startup, so the entity, its
entity id, its history and any customisation stay: `device_name` →
`device_model` (fixed string `VNSE3-0`, now diagnostic and read at the
ultra-low rate), `vms_version` → `vns_version` ("VNS Version"),
`battery_total_energy` → `battery_rated_capacity` (the nominal capacity of the
one pack, a constant 5.12 kWh in the BMS; not stored energy, now
`energy_storage` / `measurement`) and `schedule_N_mode` → `schedule_N_power`
(the slot power in W: + discharge, − charge, −1 self-consumption). The
`user_work_mode` option `trade_mode` is now `ai`, the firmware's AI mode;
automations that select `trade_mode` on a Venus E v3 need the new option name.
`min_cell_temperature` and `max_cell_temperature` keep their names: with one
pack they are a consistent pair. Entries that still carry the old device token
`v3` are migrated as well; the migration, the coordinator and the `set_wifi`
service all treat it as the Venus E v3.

`internal_temperature` and `internal_mos1_temperature` (35000 / 35001) keep
their keys, because the keys are the unique ids, but they are shown as
"Inverter Temperature NTC CH12 / CH5", with one decimal: the two NTC channels
of the inverter are swapped against the Venus D, and the code does not tie
either of them to a MOSFET.

### Venus E v3: removed

- `alarm_status` (36000 alone), `alarm_status_low` (36001 alone) and
  `fault_status_2` (36102, with `fault_status_2_description`). The firmware
  can never set the bits of `fault_status_2` (its only setter, the self-test
  bit, cannot fire) and the high word of the alarm word, they always read 0.
  The one alarm bit the Venus E v3 does set, bit 0 ("grid release missing,
  waiting for the grid"), sits in the low word, and a read of 36001 on its own
  returns the value of 36101. `alarm_status` is therefore now
  one 32-bit value over 36000 + 36001 and `alarm_status_low_description`
  decodes it.
- The old `factory_reset` button wrote to 41001, which the Venus E v3 does not
  implement; it did nothing. See the new buttons below.
- Three entries that read the same source as another entry (one entry per
  source): `ac_offgrid_current` (32301 returns the off-grid voltage, 230.0 V
  showed up as 23.00 A), `ac_current` (37004 is the grid power in W; the factor
  0.004 only faked a current) and `internal_mos2_temperature` (35002 repeats
  35001; the Venus E v3 has two NTCs and no second MOSFET sensor).

The entities of an existing installation stay behind as "no longer provided"
and can be deleted.

### Venus E v3: corrected

- Types: `ac_frequency`, the three discharge energy counters,
  `battery_cycle_count`, the 16 cell voltages and `max_cell_voltage` /
  `min_cell_voltage` are unsigned; `battery_power` shows whole watts.
- `battery_soc` shows one decimal and is described for what it is: on the
  Venus E v3 it is the float SOC integrated from the battery power of the
  inverter micro, not a coulomb counter of the BMS and not the display SOC of
  the Venus D. It is reset to 100 % / 0 % when the BMS's own SOC reaches
  100 % / 0 and can differ from it in between.
- `inverter_state` has refined texts: 0 "Standby / disabled (or no data)",
  1 "Idle", 4 and 6 "Idle in backup / parallel mode", 5 "Firmware update";
  state 2 (charge) is also reported when the BMS reports a charge current above
  0.4 A. Automations that compare the old texts ("Sleep", "Standby",
  "Backup Mode", "Backup Passthrough") need the new ones.
- `bluetooth_status` shows its states as text.
- Bit texts of `fault_status_low_description` (grid over/under-voltage and
  frequency, voltage peak; the two bits without a setter removed) and
  `fault_status_2_low_description` (software over-current above 30 A on three
  consecutive samples, DC bus over-voltage above 530 V).
- Limits: `charge_to_soc` from 13 % (the firmware refuses 10–12);
  `max_charge_power` / `max_discharge_power` from 50 W, never 0, up to 2500 W;
  the schedule slot power stays ±2500 W. Why:
  - **Minimum 50 W, never 0.** The inverter micro stores the value in its
    EEPROM and reloads it after every restart without a range check, so 0
    blocks charging or discharging for good, even across a restart. On the
    Venus E v3 the register can be read back (the control unit asks the micro),
    so a 0 would at least be visible - but it is still persisted, a forgotten
    0 still looks like a defective battery, and each write wears the EEPROM of
    two controllers. To stop charging or discharging, use `force_mode` =
    standby (RS485 control mode) or set the charge/discharge power set-point or
    a schedule slot to 0: these are volatile and leave nothing behind.
  - **Maximum 2500 W.** That is what the firmware accepts as input. After a
    factory reset the inverter micro stands at 3000 / 3000 W; such a reading is
    shown as it is and not clamped to 2500 W, although 3000 W can no longer be
    written back.
- Schedule start and end are HHMM clock times: the wrong unit "min" is gone,
  and a time with minutes of 60 or more is refused before it is written,
  because the device would reject it and switch the slot off.
- The voltage readings of the cells (and `max_cell_voltage`) show exactly
  4.000 V right after the start: that is a clamp of the BMS report, not a
  measurement.

### Venus E v3: new

All disabled by default.

- `bms_charge_current_limit` (32106) and `bms_discharge_current_limit` (32107):
  the current limits of the BMS (up to 100 A, depending on the battery profile
  and the temperature); 35111 / 35112 serve the same values.
- Pack 1: `battery_1_mos_status` (which MOSFETs conduct; the value stays
  numeric), `battery_1_protection_1` / `battery_1_protection_2` and
  `battery_1_bms_warnings` (BMS protection and warning words, a bit mask with
  the set bits decoded into the attributes `active_bits` / `active_faults`; the
  bit texts are those of the Venus E v3 BMS, not the Venus D's),
  `battery_1_env_temperature`, `battery_1_mos_temperature` and
  `battery_1_cell_temperature_1..4` (signed), and `battery_1_profile`, the
  active battery profile (0 to 5, read-only).
- `selftest_status` (the self-test after power-on), `ems_boot_version` and
  `vns_boot_version`, `inverter_dc_voltage`, `bms_charge_voltage_limit` (a
  constant 57.6 V) and `ethernet_chip_version`.
- Buttons: `factory_reset` — now the real factory reset (41000 = 0xAA11, second
  press within 15 s) — `led_test`, `inverter_eeprom_test` (the result is the
  DEV sensor 30213) and `read_inverter_input_pb1` (the result is the DEV sensor
  30211). On the Venus E v3 the factory reset resets the control unit to its
  factory settings (all user settings including limits and schedules, the
  energy statistics and the cloud identity) and deletes the TLS certificates of
  the Wi-Fi module; the inverter micro goes back to its factory defaults, that
  is limits of 3000 / 3000 W and grid standard 0, and the grid standard can
  only be restored through the micro's own RS485 interface or its shell; the
  BMS only resets its protection parameters, the battery profile stays. The
  warning of the first press says exactly that.
- DEV buttons (only with the option "Show DEV registers", disabled by
  default, second press within 15 s): 45002, the inverter sleep request (brief:
  the output stops for about 0 to 5 s, no latch until a reboot, as on the
  Venus D), and 45028, the BMS factory reset (resets the protection parameters
  and restarts the BMS: the battery is disconnected for about 1.5 s plus the
  boot time; SOC calibration data and battery profile stay).
- **Service `marstek_modbus.set_wifi(ssid, password)`** now works on the
  Venus E v3 as well, with the same limits, the same option "Show DEV registers"
  and the same warning as on the Venus D and A: the Venus E v3 runs
  the same control code and the same communication module image. Details in
  [docs/set-wifi.md](docs/set-wifi.md).

### Venus E v3: one fixed pack, no PV stage

The BMS 115 only ever sends pack 1 (16 cells). There are no entities for packs
2 to 7, no pack counter and no online mask (32109–32111 are the constants
1 / 1 / 1), and the pack registers 34100–34699 always read 0. There is no MPPT
stage and no class-2 unit either, so no PV, MPPT or pack-coding registers are
offered.

### Venus E v3: DEV registers

The Venus E v3 map had no DEV section. Now it has four entries, all disabled:
30211 (after the button 45006), 30213 (after 45001; always reads 1) and the
calibration values 45603 / 45604 (BCD, read on request only because a read
blocks the Modbus task). Everything else is either a regular entity or not
offered. The duplicates section of the map is empty.

### Venus E v3: registers that are never read in a block

The same rule as on the Venus D and A, with the ranges of the Venus E v3:
38000–39014 (nothing is mapped there, but the read path of the control unit is
the Venus D's, where a read anywhere in it starts a CAN broadcast), 41500–41631
(the Wi-Fi buffers written by `set_wifi`), 45000–45031 (command registers,
write-only), 45603–45605 (a read blocks the Modbus task for up to 200 ticks)
and 46000 (switches RS485 to the shell). Besides, 36001, 36101 and 36103 are
never read on their own: a lone read of 36001 returns 36101, of 36101 returns
36103 and of 36103 the grid voltage, so the alarm word is one 32-bit value and
the fault words are read together in one block.

### Start-up

- **Setup no longer waits for the first poll cycle.** Home Assistant used to
  wait at start until the integration had read every enabled value once:
  tens of seconds at a slow battery or behind a proxy (about 90 s were seen in
  the field), which held back Home Assistant's whole start and every
  automation waiting for it. The entry is now loaded in well under a second;
  connecting and the first cycle run in the background.
- **The fast values come first.** The first cycle reads the high poll group
  (state of charge, power, grid) first and shows it at once, then the low and
  ultra groups. Calculated sensors wait for the complete cycle.
- Entities are unavailable (calculated ones unknown) until their first
  reading and update normally from then on. A battery that cannot be reached
  at start no longer puts the entry into a setup retry: the entry loads, its
  entities stay unavailable, and the connection is tried again at the next
  poll and then every minute until it answers.
- **A refused address no longer costs retries.** A single register refused
  with Modbus exception 2 (illegal data address) is not asked again; before,
  it cost three requests and two reconnects. After a block the device refused
  cleanly the connection is no longer rebuilt either. Timeouts and connection
  errors keep their retries and reconnects.

### Reading: what is learned and what is logged

- **Gaps are learned only from "illegal data address".** The block reader
  probes small gaps between registers. It now records a gap as unreadable only
  when the device refuses the block with Modbus exception 2 (illegal data
  address). Another refusal - busy (6), device failure (4) - says something
  about the moment, not about the registers, and is no longer remembered as a
  bad gap.
- **Quieter log while learning.** The refusal of a bridged block read with
  exception 2 is logged at debug level; the INFO line "Device refused a block
  spanning …" still shows what was learned. Single-register reads refused with
  exception 2, timeouts, other exception codes and reads with several attempts
  keep their error and warning lines.
- **Accurate reconnect line.** The line "Rebuilding the connection after a
  timeout on block read" now names the real cause ("after a failed read on
  block 32100-32112"). After a block the device refused cleanly the connection
  is no longer rebuilt at all (see "Start-up").
- After the update an installation may learn a few gaps once more, because
  new entities now read in 32100 to 32113. That costs one short burst of
  debug/info lines on the first start and nothing afterwards.

### Registers that are deliberately not offered

New page [docs/not-offered-registers.md](docs/not-offered-registers.md) lists every
register of the Venus D, A and E v3 that is deliberately not an entity or a button, with
what it does and why it stays out (factory and test modes, the OTA / shell
switch, aliases, registers without function on the Venus A and E v3, the BMS
profile select 45011 and the unreliable BMS restart 45031 of the Venus E v3, the
value 0 for the maximum charge and discharge power, the 1450 W limit of the
Venus A).

### Sensors with a text state

- Sensors that show a text for a register value now also carry the number as the attribute `raw_value`, so automations and the panel do not have to match on the text.
- **Venus A: `mppt_warning` (37024) and `mppt_error` (37023) now show what the code means**, read from the firmware of the inverter micro, where the A's MPPT stage lives. A reading of 1367 is "MPPT chip above 85 °C" (a warning that holds only while the chip is that hot, and the firmware does not derate for it); 1363 means the power derating between 73 °C and 90 °C is active; 1126 is a PV1 over-current trip. The number stays in the attribute `raw_value` and in the tooltip of the panel row. The fault code is transient by design: the micro reports each latched event once, so a value of 0 a moment later is normal. The Venus D keeps the plain number, because its MPPT stage is a separate processor whose firmware is not available, so what its codes mean is not proven.

### Panel

- **Fault and warning codes are no longer shown with thousands separators.** The panel formatted every number like a quantity, so the code 1367 read "1.367" and a fault word of 1024 read "1.024". The rows in the System, Solar and Cells tabs now show the plain value, on every model.
- **The MPPT codes of the Venus A are shown as text in the language of the panel** (English, German, Dutch), also in the status banner. An MPPT warning is rated a warning in the banner on every model, no longer a fault.
- **The panel speaks Dutch.** Besides English and German it now has a Dutch
  catalogue and follows Home Assistant set to Nederlands, like the rest of the
  integration already did.
- **Maintenance section** at the bottom of the System tab, collapsed by default
  and drawn as a danger zone. It lists every command button of the battery
  you have enabled - factory reset, pack coding (Venus D), LED test, the
  inverter EEPROM test and PB1 read, and with the DEV option the DEV commands.
  A command with the two-step confirmation shows the integration's warning in a
  dialog with a countdown and is only sent when you confirm within the 15 s
  window; after the window it has to be pressed again. Only one command is
  sent at a time. The restart stays in the Control tab.
- **The panel presses through its own websocket command**
  `marstek_modbus/press_button` (admin only, buttons of this integration only,
  enabled entities only), not through `button.press`. The first press of a
  command with a confirmation writes nothing and returns the warning and a
  one-time token bound to the panel's connection; only the confirmation with
  that token inside the 15 s window writes, once. This keeps the panel's
  confirmation apart from the entity's own two-press step: a press of the same
  button in Home Assistant's UI shortly before no longer turns the panel's
  first click into a write, and the expected first press no longer leaves an
  error line in the Home Assistant log. Pressing the button entity in Home
  Assistant's UI, from a script or an automation works as before (two presses
  within 15 s). Both websocket commands need an administrator account: a
  non-admin user still sees the panel but can no longer press the maintenance
  buttons or send the Wi-Fi form from it (before, `button.press` was open to
  every user). The panel says so up front: for a user without administrator
  rights the command buttons and the Wi-Fi send button are disabled, with the
  note "This needs an administrator account. Ask a Home Assistant
  administrator to do it." (also in German and Dutch). If Home Assistant
  refuses a command anyway, the same text is shown instead of a bare
  "Unauthorized".
- **Wi-Fi form** in the same section (Venus D, A and E v3, when the service
  `marstek_modbus.set_wifi` is there): checks SSID and password by the same
  rules as the service before sending, shows the service's own error texts,
  targets the battery selected in the panel and empties the password field
  after every attempt. It sends through the websocket command
  `marstek_modbus/set_wifi`, which runs the service's checks and write
  sequence but is not recorded, so the password does not end up in the
  recorder database or in backups (a call of the service does). The warning
  from [docs/set-wifi.md](docs/set-wifi.md) is shown above it.
- **Venus E v3 gets the Cells and Packs tabs** for its one pack: SOC, voltage,
  current, lowest and highest cell, the 16 cell voltages, temperatures,
  battery profile, protection and warning words and the MOSFET status. These
  entities are disabled by default on the E v3; the tabs say so instead of
  showing empty boxes, and fill in once you enable them.
- **Banner on the System tab**: a raised fault word now names its cause in
  plain text (the number stays as a tooltip). The BMS fault lock, and the BMS
  factory mode if enabled, show as a warning (orange). The Venus E v3 waiting
  for the grid release (alarm word bit 0) shows as a hint, no longer as a red
  fault.
- **Cells tab**: the MOSFET status reads as text - off, charge only,
  discharge only, charge and discharge - and a pack counts as switched in at
  any of the last three, so voltage and current follow a pack that only
  charges or only discharges. Protection words and the new BMS warnings show
  their decoded causes instead of "P1 <number>"; the BMS lock is a row of its
  own; the BMS charge and discharge current limits are listed. The cell
  temperature span is taken within each pack from its own sensors, no longer
  as the stack maximum minus pack 1's minimum.
- **New rows**: PV lifetime energy (Venus A) in the Solar summary and in the
  Energy tab under "Since commissioning"; self-test status and Ethernet chip
  version in the System tab once you enable those entities.
- **Hints**: the charge ceiling note takes its lower end from the entity (13
  on the D, A and E v3); the limits hint says that the maximum powers cannot
  be set to 0 and that their upper end comes from the device (2500 W on the
  D and E v3, 1450 W on the A).
- **Fixed**: the device temperature tile and the two inverter temperature
  rows of the Venus A and E v3 stayed empty (their entities carry a different
  translation key now); the System tab showed "Battery packs: 0" on the Venus
  E v3; a refused write (a value out of range, a refused restart) now shows its
  reason instead of failing silently; pack blocks left behind by an older
  register map no longer count as packs.
- **Thermal card (System tab)**: shows one consistent pair, the highest and
  lowest cell temperature over all packs and all their cell NTCs, with the
  pack that holds each extreme as a tooltip. Before, it put the stack maximum
  next to pack 1's minimum. Where no pack NTC reports (Venus E v1/v2, E v3 with
  its pack NTCs disabled), the firmware maximum is labelled "highest (BMS)" and
  the minimum is only shown for a single pack.
- **Voltage and current rows** say "active pack N" (with a tooltip: the pack the
  battery has switched in right now, the others are idle) instead of "Pack N",
  in the System and Overview tabs.
- **Power set-points (System tab)**: the read-only rows for the charge and
  discharge power requested from the inverter are labelled "Charge power
  set-point" / "Discharge power set-point" (tooltip: requested by the
  controller, not the measured power) instead of using the name of the
  settable entity. The Control tab sliders are unchanged.
- **Self-test status 5 is shown neutrally** (System tab, once `selftest_status`
  is enabled): the state now reads "Ethernet chip reports another version than
  expected (harmless)" instead of a "test failed" message (also in German and
  Dutch). Measured on two Venus D with a working LAN: the Ethernet chip reports
  version 0x4A where the self-test expects 0x4B, and the self-test compares
  exactly that. A real SRAM fault would stop the controller, so it is not what
  the 5 means in practice; the real faults are 2 (EEPROM) and 3 (flash), which
  keep the fault tone. The row stays neutral and carries this explanation as a
  tooltip; the state text in the Venus D, A and E v3 register maps is the short
  version only.
- **Fixed**: the sidebar panel was never removed when the last battery was
  deleted, because the schedule command's registration flag was counted as a
  battery. The sidebar panel is removed again when the last battery is deleted.
- **Cells tab: fixed voltage axis for the pack matrix.** The card "cell voltage
  range per pack, shared axis" used to fit its axis to the current readings, so
  with all packs within a few millivolts of each other the scale shrank to a
  few millivolts and the bars jumped around on every refresh. The axis is now
  fixed at 3.0 – 3.7 V (all packs are LFP) with a tick every 0.1 V (every
  second label on narrow windows), and only widens in whole 0.1 V steps on the
  side that needs it when a pack reads outside the window (deep discharge, an
  over-voltage, the 4.000 V clamp of the Venus E v3). The legend and axis text
  say so in English, German and Dutch.
- **Cells tab texts.** The tile "Packs reporting" is now "Detected packs" (the
  number of packs the integration found, not packs that report a value), and
  the hint under "Spread across stack" says the packs charge *and discharge* in
  turn (English, German, Dutch).
- The option "Show unknown registers" is now called "Show DEV registers"
  (Options → DEV registers); it also switches on the DEV buttons and the
  `set_wifi` service. The panel's Wi-Fi form names it that way too.
- The two DEV switches (unknown registers, duplicates) are now one switch
  "Show DEV registers"; an installation that had either on keeps its DEV
  entities. The options text is shorter.

---

## 3.1.0-beta.2

[3.1.0-beta.1](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.1.0-beta.1)
plus the fix from [3.0.1](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.1). This is a
pre-release. If you want to stay on stable, 3.0.1 is the one to use.

### The integration recovers after the battery was unreachable during startup

A failed or cancelled setup, for example while the battery reboots for a firmware
update, is now cleaned up completely. Before, platforms that had already registered stayed
behind, every retry failed with `... has already been setup!`, and the entry stayed loaded
but never polled until it was reloaded by hand. Details are in the 3.0.1 notes below.

---

## 3.1.0-beta.1

[3.0.0](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0)
plus a new forecast for **time to full**. This is a pre-release. If you want to
stay on stable, 3.0.0 is the one to use.

### Time to full follows the order in which the BMS charges the packs

`runtime_to_full` used to divide the missing energy by the current power. On a
Venus A or D that swings between far too short and far too long for the whole
of a charge, because the battery does not charge its packs together:

- The BMS charges **one pack at a time**, the emptiest first, to the next whole
  ten percent, and then moves on to the next emptiest pack.
- **Above 90 % it steps the power down twice per pack.** On a seven-pack Venus D
  the battery took about 1250 W from 90 to 95 % and about 490 W from 95 to 100 %,
  one pack after the other.
- The top step takes far less energy than its five percent suggest. The BMS
  declares a pack full early.

The sensor now plays that sequence through. For each step it uses the lower of
two values: the power available, or the cap the BMS allows. With a forced
charge running, the setpoint counts as the power available. Otherwise it is the
measured power.

**The countdown now runs smoothly through the upper range instead of jumping
around.**

### Learns from your battery

The caps and the real energy of the top two steps are **learned per BMS
firmware version**. They are forgotten when the control firmware changes. Until
your battery has shown each step once, the forecast uses the values measured on
the Venus D. **Expect it to get more accurate after a few charges to 100 %.**

### New

- **`bms_charge_current_limit`** (A and D): the charge current the BMS accepts
  right now, register 32106. It reads 0 once the active pack is full.
- **`bms_charge_power_limit`** (A and D): the resulting charge power cap, BMS
  voltage times that current.
- **Attributes `hours_to_90` and `hours_to_95`** on `runtime_to_full`. The panel
  shows them as two marks under the countdown.

### By model

- **Venus D:** measured and tested, on a seven-pack unit.
- **Venus A:** same firmware base. It is expected to behave the same way, but
  this has **not been verified on an A**. Feedback is especially welcome here.
- **Venus E v3 and E v1/v2:** a single pack, so there is no pack order to
  follow. Little changes here. The forecast only takes the AC power into account
  as well.

### Feedback

If you try it, please report how `runtime_to_full` behaved over a charge,
ideally with the history of the sensor including `hours_to_90` and
`hours_to_95`. Please include the model, the number of packs and the BMS
version.

---

## 3.0.1

Bug-fix release on top of [3.0.0](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0).

### The integration no longer stays dead after the battery was unreachable during startup

When the Venus was unreachable while Home Assistant (re)loaded the integration,
for example during a control firmware update with its reboot, the setup could
be cancelled half-way by Home Assistant's own setup timeout. The platforms that
had already registered were not unloaded in that case. Every later retry then
failed with `... has already been setup!` on all platforms, and the entry
stayed **loaded but never polled**: the connection sensor stayed off with zero
read attempts and all entities were `unknown`, although the battery was
reachable again. Only a manual reload helped.

Failed setups are now cleaned up completely, including cancellations, so the
next retry starts from a clean state and the integration recovers on its own
once the device answers again.

---

## 3.0.0

The first stable release since [2.2.0](https://github.com/sphings79/marstek-modbus-suite/releases/tag/2.2.0).
The register maps were checked against the control firmware of the Venus D and
Venus A, and wherever map and firmware disagreed, the firmware won. Several
sensors turned out to measure something other than their name said. That is
where the breaking changes come from.

What follows sums up 2.3.0-beta.1, 3.0.0-beta.1 to beta.13 and rc.1 to rc.3.
Each pre-release has its own notes with the measurements behind it.

### Breaking changes — read before updating

#### Venus A and D: three entities removed

`battery_voltage`, `battery_current` and `bms_version` read the same firmware
words as `battery_1_voltage`, `battery_1_current` and `battery_1_bms_version`.
They were pack 1's values under a name for the whole battery. In one recorded
discharge, `battery_current` read 0.0 A while pack 2 delivered −45.9 A.

**What to do:** switch to the `battery_1_` names, which give identical values.
For a current across all packs, use `bms_power`. The Venus E v3 and E v1/v2
keep all three, because there they describe the whole battery.

#### Venus A and D: energy counters renamed, `battery_power` corrected

| Old key | New key |
|---|---|
| `battery_power` | `dc_sample_power` (register 30001, one DC measurement point) |
| *(calculated)* | `battery_power`, now the DC point plus the four strings, i.e. the packs |
| `total_charging_energy` | `total_ac_input_energy` |
| `total_discharging_energy` | `total_ac_output_energy` |
| `total_daily_charging_energy` | `total_daily_ac_input_energy` |
| `total_daily_discharging_energy` | `total_daily_ac_output_energy` |
| `total_monthly_charging_energy` | `total_monthly_ac_input_energy` |
| `total_monthly_discharging_energy` | `total_monthly_ac_output_energy` |

Register 30001 also carries the PV strings. A Venus A read −1557 W there while
its packs supplied 870 W. The energy counters are measured at the grid
connection, not at the packs.

- **`battery_power` keeps its key.** Automations keep working, and the value is
  now correct.
- **The six old energy keys stay** as pass-throughs with the same unique id. An
  existing installation keeps the entity, its id and its history. A new
  installation gets only the new names. New automations should use the new names.
- `battery_health` and `remaining_cycles` read the BMS cycle count. Before, they
  divided the energy counter by the capacity, which gave 1211 cycles against the
  BMS's 153. `battery_cycle_count_calc` is gone on these two models.

#### Venus A and D: `battery_cycle_count` is the mean over the packs

It read pack 1 only. On a seven-pack Venus D it showed 6, while the packs
counted between 6 and 73. It now reports the mean over the fitted packs, 37 on
that device. Expect a step in the history. Pack 1's own count stays available as
`battery_1_cycle_count`.

#### All models: values that read differently

- **`inverter_state`:** state 6 is **Backup Passthrough**, not Bypass. That is
  what the register means: the backup socket carries a load from the grid.
- **`software_version`, `bms_version`, `ems_version`** are version strings now,
  for example `117.7` instead of `1177`.
- **`schedule_N_days`:** a schedule with several days reads `custom`, and the
  days are in the attributes. Single days keep their names.
- **Cycle counts are signed**, as the firmware types them. A BMS sentinel shows
  as a negative number instead of one near 65535.
- **`wifi_signal_strength` is off by default** on new installations. The value
  can never be current while Modbus runs over the cable.
- **Register 30212** was `dev_30212` and read as a pack count. It is the
  power-on self-test result and is now called `selftest_status`, off by default.

#### New Modbus library, and what that means for proxies

The integration talks to the battery through **tmodbus** now instead of
pymodbus. Home Assistant installs it on the restart after the update. The
integration corrects the firmware's malformed exception replies itself, so no
proxy is needed any more.

**If you use a Modbus proxy anyway**, for example because a second client shares
the battery, use [the patched add-on](https://github.com/sphings79/ha-modbusproxy).
An unpatched proxy trips over the same malformed replies and drops the
connection.

#### After updating

- **Restart Home Assistant**, not just reload the integration.
- **Reload every open panel tab.** An open tab keeps running the old panel.
  From this version on it notices a newer one and offers the reload itself.

### New

- **Setup finds the battery.** A Venus announces itself on the network.
  *Add integration* listens for four seconds and fills in model, address and
  register map. The MAC serves as the unique id, so the same battery cannot be
  set up twice.
- **Modbus device polling**, per battery: *Active*, *Paused, entities
  unavailable* or *Paused, entities frozen*. This is meant for a battery
  switched off for the season. The setting survives restarts, a paused entry
  loads without connecting, and controls are locked while paused.
- **A battery that is off looks off.** The status light shows green, amber, red
  (with the time of the last answer) or grey (paused). The log reports one line
  going off and one coming back, instead of a burst every minute. After it is
  switched back on, the readings are back within a minute.
- **Pack count detection.** The panel counts the packs that answer. On the
  Venus A and D, *Options → Battery packs* can also pin the count, so the unused
  blocks are not polled at all.
- **Polling based on measurements at the device:** 65 ms per request and 5.5 s
  for a full round. A new ultra-low group (default five minutes) holds the 55
  values that only change when somebody changes them. The MPPT values are back
  at the fast rate. [Which value is in which group](https://github.com/sphings79/marstek-modbus-suite/blob/main/docs/polling-groups.md).
- **Schedules:**
  - Any combination of weekdays, edited as chips in the panel.
  - Editing an enabled schedule no longer switches it off. The firmware does
    that on every write, and the integration switches it back on.
  - Schedules the firmware would never run are refused: overlapping enabled
    slots, empty windows, windows across midnight.
- **RS485 control mode:** the repair entry "Restore the control mode" appears
  only when this integration switched the mode on itself. A second client such as
  evcc no longer triggers it ([#6](https://github.com/sphings79/marstek-modbus-suite/issues/6)).
  The dialog also warns that submitting ends the configured work mode.
- **Venus A:** pack 7 with 13 cells, and the DEV register groups.
- **Fault texts** for the Venus A and E v3, taken from their own firmware.
- **`alarm_status_low`**: the second half of the 32-bit alarm word. Until now it
  was read and discarded.
- **Panel:**
  - Runtimes in hours and minutes.
  - One threshold for pack spread across the tile, table and columns.
  - Temperatures with their unit.
  - A layout that works on a phone.
  - Restarting the device asks for confirmation in a dialog.

### Fixed

- Time to full and time to empty went blank when a single PV string was missing.
- The calculated cycle count could run into the tens of thousands on an unread
  capacity register. Because the sensor is `total_increasing`, such a spike stays
  in the statistics.
- `battery_cycle_count` and `battery_power_bms` stayed blank on any stack
  smaller than seven packs.
- *PV passthrough* in the panel requires producing strings now, so it no longer
  appears on a Venus E.
- Pausing during a running poll could leave the connection open.
- A register was fetched twice in every cycle.
- A device that refuses the connection gets a message naming the likely causes:
  wrong interface, or its single Modbus connection already taken.

### Worth knowing

- **Modbus TCP only runs over the LAN port.** Port 502 is refused on the WiFi
  address, even when the battery has no cable at all. Discovery finds a battery
  without a cable, but setup cannot connect to it.
- **Venus A power limits:** `max_charge_power` and `max_discharge_power` are
  capped at 1500 W. That has been tested on one system. How the device handles
  writes above 1500 W comes from the firmware and has not been measured.
- **Schedules set over Modbus** may be lost after the battery restarts. The
  firmware writes them to EEPROM only when they come from the app. This comes
  from the firmware and has not been tested.

## 3.0.0-rc.3

rc.2 plus three schedule and panel fixes that were finished before rc.2 but
missed it.

### A schedule can hold any set of weekdays

The day register is a bit mask, but the day select only knew single days. A
Monday-to-Friday schedule set in the Marstek app showed as unknown, and editing
it in the panel overwrote it with one day. The select now reports none, a
single day or custom, and exposes the mask and the list of days as attributes.
The panel edits the days as chips and writes the whole mask at once.

**Upgrading:** an automation that compares `schedule_N_days` against a day name
still works for a single day. A schedule with several days reads `custom`; the
days are in the attributes.

### Editing a schedule no longer switches it off

The control firmware sets a slot's enabled register to 0 whenever its days,
start or end are written. Editing an enabled schedule from the panel, the number
entities or the day select therefore switched it off without a word. Every
schedule write now goes through one path that writes the enabled flag last and
restores it when the slot was on.

### Schedules that cannot run are refused

The firmware runs only the first matching slot, while start <= now < end. An
enabled slot whose window is empty or crosses midnight never runs, and of two
enabled slots that overlap on a shared day, the later one never runs either.
Both are now refused before anything is written, with a translated error, from
the panel, a service call or an automation alike. Disabled slots can be prepared
freely. The panel shows the refusal and puts the field back to the device value.

The README describes how the device runs the schedules, including that the
firmware saves schedules to its EEPROM only when they come from the app - read
from the firmware, not yet tested.

### The panel survives an update while it is open

Home Assistant loads the panel bundle with the version in its URL. After an
update the page often stays open - the iOS app just reconnects - and the bundle
was loaded a second time and failed on the first element it registered. Elements
already registered are now skipped, and a panel still running the old code
offers a reload.

## 3.0.0-rc.2

rc.1 with one correction, from
[#6](https://github.com/sphings79/marstek-modbus-suite/issues/6).

### The control mode repair only fires when the mode was switched on from here

The repair entry "Restore the control mode" reported every drop of register
42000 from on to off that this integration had not written itself. Who had
switched the mode on was never asked. A second Modbus client that controls the
battery - evcc holds it during a charging session, then writes the work mode
back - produces exactly that transition, so the entry came back after every
session, claiming the device had reset itself. Submitting it would have taken
the battery out of its self-consumption mode outside any session.

The register cannot tell a reset from another client's write; both leave the
same byte. What can tell them apart is who switched the mode on. The
integration now remembers whether it did - through the switch or the repair
flow - and stores that on the config entry, so a restart does not forget it.
The entry is raised only while that is the case. Switching the mode off here,
or writing the work mode through the select, gives it up, as does any "off"
read from the device.

Writing the work mode through the select no longer raises the entry either.
It ends the control mode on purpose, since 42000 and 43000 are the same byte,
and was reported as a reset all the same.

An entry from an earlier version has nothing stored and is treated the old
way until the device first reports the mode off. At most one more false report
per installation, and a genuine reset right after the update is still caught.

The repair text now says, in bold, that submitting takes the battery out of
its configured work mode, and to ignore the entry when another system ended
the mode on purpose.

## 3.0.0-rc.1

[beta.13](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0-beta.13)
with one correction on top of it.

### PV passthrough now needs the strings to be producing

beta.13 renamed the derived state to PV passthrough and reserved the word
Bypass for what the register actually means. The condition behind the derived
one was still only "charging and delivering at once", which is a claim about
where the energy comes from that nothing checked.

On a Venus A or D it makes no difference: `battery_power` is the DC measurement
point plus the strings, and delivering to the house drives that point negative,
so the two forms agree - 72 firings either way across eleven minutes of real
readings, not one of them different.

It matters on the two Venus E generations. They have no PV input and no
`solar_power_total` at all, so the old condition would have labelled any
overlap of charging and delivering as PV passthrough on a device whose DC bus
carries nothing but its packs. The label now needs a reading only a model with
strings has, and an E falls through to whatever the register says.

## 3.0.0-beta.13

Mostly the panel, plus two sensors that were never going to work on a stack
smaller than the register map.

### Two aggregates were dead on anything but a full stack

`battery_cycle_count` and `battery_power_bms` both name all seven packs as
dependencies, and a calculated sensor stays blank unless every one of them has a
value. The register map assumes an absent pack answers its block with zeros,
which only holds while all seven blocks are polled — with the pack count pinned
they are never asked for, so the value arrives as nothing at all.

Measured on a three-pack Venus A: each of the two refused **99 times in eleven
minutes**, once per polling cycle, for as long as the device had been running.

A calculated sensor can now name the dependencies it can do without.
`battery_power_bms` adds up the packs that answered. On that same Venus A the
two read 395 W and 133 cycles, against pack currents totalling 8.7 A and counts
of 156, 123 and 120.

### Bypass was the wrong word

Register state 6 is **Backup Passthrough**, not Bypass. It appears when the
backup socket is switched on with a load on it and the grid is carrying that
load — not, as the panel assumed, when solar feeds the house while the packs
charge. The panel's own name for that second case is now **PV Passthrough**, and
it goes through the translation catalogues instead of being English in every
language.

### Panel

**The pack columns and the table disagreed** — the same split
[beta.12](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0-beta.12)
closed between the table and the spread tile, one layer further out. The columns
kept a rule of their own: five points from the median, with no regard for
whether the stack spread meant anything yet. A pack ten points low was outlined
in warning while the tile above it read green and its own row stayed plain. All
three ask the same question now.

**Temperatures say what they are.** The pack table printed three columns of bare
figures — 35,2 beside 38,9 beside four NTC readings, with nothing to say what
they were. The unit now sits in the heading, once, rather than beside every
number. It is read from the entity, so an installation on Fahrenheit gets °F
over Fahrenheit numbers; two tiles and a pack note had °C written into the
layout.

**A choice too wide for a phone wraps** instead of widening the page. The
polling choice spells out what pausing does to the entities, which is three
sentences laid side by side: on a phone that bar ran out past its own panel and
took the width of the whole page with it, leaving everything else off-screen to
the left. Options that fit still sit beside each other.

**Restarting the device asks in a dialog.** The confirmation used to replace the
button that opened it, at the same spot and — in English — at the same width, so
a double click went straight through to the restart. Escape, a click beside the
dialog and the cancel button all dismiss it, the cancel button holds the focus
when it opens, and the dialog has room to say what a restart actually costs.

### Repository

The tool that produced the polling numbers in beta.12 now sits in `scripts/`,
next to the constants that rest on them. Without `--host` it touches nothing and
only counts what each tick would ask for; with one it times those requests
against a real device — and refuses its own output when the session keeps being
taken away, which is what pointing it at a proxy during a Home Assistant poll
produced: 94 reconnects and a page of 3 ms timings that looked like results.

---

## 3.0.0-beta.12

The largest step since [beta.11](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0-beta.11):
the integration now finds your battery by itself, and what it asks the battery
for has been measured rather than estimated.

### Setup finds the battery for you

A Venus announces itself on the local network about twice a second, unprompted —
a UDP broadcast carrying its model, its address and a MAC that stays the same
when the address does not. **Add integration** now listens for four seconds and
offers what answered:

```
Venus D · 192.168.1.50 · aa:bb:cc:dd:ee:ff
```

Picking one fills the form in and leaves every field editable, which is what
anyone reaching their battery through a Modbus proxy needs — the beacon names
the battery's own address, not the proxy's. The model code selects the register
map, so the right one is already chosen.

Nothing talks to the device while listening. A Venus accepts a single Modbus
connection at a time, so probing one that is already in use would report it as
unreachable, or take the connection away from whoever had it.

An entry created this way carries the MAC as its unique id, so the same battery
cannot be set up twice even after its address changes. Entries made before this
existed keep no unique id and are left alone.

**This does not put devices under Settings → Discovered.** A custom integration
is only loaded once it has a config entry, so for a first device there is
nothing running to listen. That needs a manifest-declared discovery type and is
a separate decision.

### Modbus TCP only works over the LAN socket

Measured across four network states on a Venus D: both interfaces up, the cable
pulled during operation, a **cold start with no cable at all**, and the cable
coming back.

Port 502 answers on the wired address and is refused on the wireless one, every
time, including after the cold start. The Modbus server lives on the device's
Ethernet chip and never appears on the radio side.

The discovery beacon does move. It follows whichever interface is up, prefers
the wired one, and hands over cleanly — 538 packets from the LAN address against
15 from the wireless one over five minutes, never both at once, with the switch
taking about 26 seconds. So a battery **without** a cable is still discovered,
gets its address prefilled, and then cannot be set up at all.

That case now says so instead of showing a bare "cannot connect". When a
connection fails, one more question is asked: did the device refuse, or was
there nothing there? A refusal means it is reachable but not serving Modbus at
that address, which is either the wrong interface or its single connection
already held by a proxy or a second integration. The message names both.

### Polling, measured at the device

The numbers this integration reasoned from were taken through a Modbus proxy and
were more than twice too pessimistic. Read directly at a Venus D on EMS v150:
**65 ms per request**, not 150, and a full round takes **5.5 s**, not the 10.3
the comments claimed.

Three things follow.

**Block reads span three unused registers instead of two.** Four was tried and
buys nothing: it merges one block the device refuses, and a refusal blacklists
every gap in that block — taking a bridge that works down with the one that does
not. Everything wider is dead ground on this firmware.

**A new ultra-low group, five minutes by default.** It holds the 55 readings
that do not move unless somebody moves them: firmware versions, the six
schedules, IP, gateway and BLE MAC, the per-pack cycle counters, capacity and
the power limits. A schedule changed in the Marstek app takes up to five minutes
to appear, which is the whole cost.

**The MPPT readings go back to the fast rate**, all eight of them.

```
fast tick     24 -> 23 requests     3.55 -> 3.47 s
fast + slow   40 -> 33 requests     6.02 -> 4.95 s
full round              37 requests         5.53 s   (every 5 minutes)
```

The floor for the slow rate comes down from twelve seconds to ten. It has to
stay above what a full round takes: a tick where several groups fall due reads
the whole round before the fast readings from that same tick arrive.

Each group has its own box in the options, and
[the page listing what is in which group](https://github.com/sphings79/marstek-modbus-suite/blob/main/docs/polling-groups.md)
is generated from the register maps, so it cannot drift.

### Panel

**The pack table and the spread tile disagreed.** The tile used the shared
threshold of 19 points; the table flagged any pack more than 5 points from the
median — a hardcoded number left behind when those thresholds were centralised.
The legend under the table already quoted 19. A green tile routinely sat over
red rows.

The table now marks packs only once the spread itself is at warning level, and
then the ones more than half that from the median. A stack at `[0, 18, 18, 18]`
reads 18 points of spread and marks nothing, where the old rule flagged the
outlier. Both thresholds are adjustable in the panel settings, since how far
packs drift depends on how many are stacked.

**Runtimes are hours and minutes.** "8,8 h" asked the reader to convert in their
head; it now says `8 h 50 min`. The "until full" row is gone from the reserve
list — the tile beside it already shows whichever countdown is running.

**"WIFI 0 dBm" is gone from the status bar.** Register 30303 reads 0 on a device
that reaches the network by cable, and a stale value from an earlier wireless
session otherwise: reading it at all needs the LAN link, and with the LAN link
up the radio is not the uplink, so the number can never be current when it is
visible. The green dot beside it was the Modbus link's, shown twice. The
register is off by default on all four models now.

Smaller: the stored energy tile names the capacity it is a part of rather than a
second figure that looked like arithmetic that did not add up; the cycles tile
says what it averaged over under the number instead of in its heading.

### Models

Fault bit texts for the **Venus A** and **Venus E v3**, read out of their own
inverter firmware rather than borrowed from the Venus D — the bits are not the
same and the old texts named the wrong faults. The Venus A also gets the DEV
register groups the D already had.

The setup dialog names the models properly: **Venus A**, **Venus D**,
**Venus E v3**, **Venus E v1 & v2**, instead of the internal codes.

Firmware versions display consistently across every model and every version
field: four digits get a dot before the last one, so `1177` reads as `117.7`.

### If you use a Modbus proxy

You do not need one — the integration talks to the battery directly and corrects
the firmware's malformed replies itself. You do need one if a second client
shares the battery.

A Venus answers a read of an unimplemented register with an exception frame
whose length field is one too high. A proxy is itself a parser, so it waits for
a byte that never comes and closes the connection after its own timeout. Since
this release probes register gaps on purpose, that is no longer a rare event.
Until the fix is upstream, use
[the patched add-on](https://github.com/sphings79/ha-modbusproxy); the README
links both reviews.

### Scope

The Modbus-over-LAN finding and the polling measurements were taken on a Venus D
on Control/EMS v150. The Venus A and E v3 share that firmware base and are
expected to behave the same, but this has not been verified on them.
