# Completing the Venus E3 register map

Working notes for the `e3-register-map` branch. **Done** — 60 of the 65 are in `registers/e_v3.yaml`
and the other five are accounted for below. Kept as the record of what was decided and why.

## Why this is safe to do from the firmware

The Modbus descriptor table was unpacked from all three control v150 images with
`marstek_descriptor_unpack.py`. All three serve **246 entries covering registers 30000–38014**, and
comparing them field by field:

| Comparison | Entries | Registers unique to one | Differences in type / scale / element size / count |
|---|---|---|---|
| D ↔ E3 | 246 / 246 | none | **0** |
| D ↔ A | 246 / 246 | none | **0** |

The only difference is the SRAM source pointer — identical to the D on the A, shifted by −8 on the
E3 for 212 registers. Register numbers, data types and scale codes therefore do not have to be
rediscovered per model: the Venus D register map applies, and what separates the models is only
whether hardware sits behind a register.

That is the opposite of the fault words, whose meaning comes from the inverter firmware and does
differ per model. See `registers/a.yaml` and `registers/e_v3.yaml` for how that plays out.

## Scope

```
served by the device        410 registers
already in e_v3.yaml         88
packs 2-7, dropped          204     (34100-34633)
PV and MPPT, dropped         21
not carried by d.yaml        32     see "What d.yaml does with each of them"
left to map                  65
```

`e_v3_register_gap.csv` lists those 65 with the name, type, scale and unit the Venus D map gives
them, plus what d.yaml does with each. Every one of them is already named there, so this is
mapping work, not analysis.

### PV is out

The E3 has no PV inputs. The firmware carries the full PV path on every model - the control image
knows `MPPT_Debug_Print`, the OTA path for the MPPT stage and the whole string set - but that says
nothing about what is soldered on. Dropped accordingly: `30020`-`30027` and `30037`-`30040` (the
four channels' voltage, current and power), `30205` (`mppt_ver`, which reads 0 without a stage),
`37017`-`37022` (the power aliases and the yearly PV energy counter) and `37023`/`37024`
(`mppt_error` / `mppt_warning`).

The last two are worth a note: they were what a Venus A user's report first pointed at, and on that
device they read non-zero while `mppt_version` sat at 0. That turned out to be a misread rather
than a signal - see the commit that reworked the fault texts. Either way there is nothing behind
them on a model without a PV stage.

### Packs are out

The E3 has one integrated battery, not a stack. Registers 34100–34633 (packs 2 through 7) are
served but will always read zero, and mapping them would create 204 dead registers behind roughly
120 dead entities. They are deliberately not in the CSV.

The 34000–34033 block stays: on this model it *is* the single battery. It gets unindexed names to
match the two entries already there:

| Register | Name |
|---|---|
| 34000 | `battery_voltage` |
| 34001 | `battery_current` |
| 34002 | `battery_soc` (already mapped) |
| 34003 | `battery_cycle_count` (already mapped) |
| 34004 | `battery_mos_status` |
| 34007 / 34008 | `battery_protection_1` / `battery_protection_2` |
| 34010 | `battery_bms_version` |
| 34018…34033 | `battery_cell_1_voltage` … `battery_cell_16_voltage` |

The 16 cell voltages are currently named `battery_1_cell_N_voltage` and have to be renamed for
consistency. **That breaks existing entity ids** — it needs a migration note and probably belongs
in its own commit.

## Groups in the gap

| Range | Count | What it is | Suggested default |
|---|---|---|---|
| 30010–30214 | 22 | work mode, inverter struct, versions, self-check, BMS mirrors | mixed, see the CSV |
| 32100–32114 | 8 | BMS aggregate | on |
| 34000–34016 | 15 | the single battery, see above | on |
| 35110 | 1 | charge voltage limit | on |
| 37001–37010 | 4 | alias block | off |
| 38000–38014 | 15 | raw CAN frames 0x40–0x43, undecoded | off (all `DEV_UNKNOWN`) |

## What d.yaml does with each of them

The CSV carries two more columns, `d_yaml_section` and `d_yaml_key`, so the classification does not
have to be redone by hand. Whatever the Venus D map decided about a register should carry over
unless there is a reason it should not — the register is the same register.

| Class | Count | What it means | Goes into e_v3.yaml as |
|---|---|---|---|
| `SENSOR` | 24 | ordinary entity in d.yaml | the same kind of entity |
| `DEV_UNKNOWN` | 28 | `dev_xxxxx` — served, meaning not established | `DEV_UNKNOWN_SENSOR_DEFINITIONS` |
| `DEV_DUPLICATE` | 13 | `dev_xxxxx` — a second view of a value that already has an entity | `DEV_DUPLICATE_SENSOR_DEFINITIONS` |

### Two classes are out

Thirty-two registers have no answer in d.yaml and are not in the CSV:

- **16 duplicate a register that is already mapped** under another number, and d.yaml leaves them
  out entirely rather than marking them: `30002` `30003` `30004` `30005` `30007` `30107` `30108`
  `32102` `32108` `32201` `32202` `34017` `37005` `37011` `37013` `37015`.
- **16 are absent from d.yaml for no visible reason**: `30000` `30028` `30029` `32101` `32103`
  `32106` `32107` `32203` `35111` `35112` `37000` `37002` `37003` `37012` `37014` `37016`.

Both groups stay out. Carrying them would give the E3 entities the D does not have, and the second
group is untested ground — a register nobody has looked at is not something to point an integration
at on a hunch.

Worth keeping in mind for later: `32106`/`32107` and `35111`/`35112` are the same two SRAM words
under two numbers each, the BMS charge and discharge current limits, and `35110` (charge *voltage*
limit) is mapped. That looks like a gap in the D map rather than a decision, and it should be
settled there first.

## Nothing here touches the WiFi credential buffer

Checked, because an untested register is exactly where that would hide.

The credential buffer is registers **41500–41515**, 32 bytes at SRAM `0x20014DC2` on the D. It is
readable *and* writable without authentication, and whether a configured device keeps real
credentials there is still open — see `security/WLAN_Credentials_ueber_Modbus_41500.md` in the
firmware analysis project. It is reached through the write handler's read branch, **not** through
the descriptor table, and it is not mapped in any of the four register files.

Two checks:

1. **No read register comes near it.** Across all 246 descriptor entries of all three v150 control
   images, the closest are the energy counters `33000`–`33010`, which end 22 bytes below the buffer
   on the E3 (`0x20014D94`–`0x20014DAB`). Nothing overlaps, on any model.
2. **What e_v3.yaml already maps of the network block** is identifiers, not secrets:

   | Entity | Register | Default |
   |---|---|---|
   | `device_name` | 31000, 10 registers | on |
   | `ble_mac_address` | 30304, 6 registers | on |
   | `device_ip` | 30400, 2 registers | **off** |
   | `gateway_ip` | 30402, 2 registers | **off** |

   The E3 is the more conservative of the four here: a.yaml and d.yaml have the two IP entities on
   by default. Worth aligning, in the other direction.

   `e_v12.yaml` is not comparable here and was left alone: the Venus E v1.2 runs a different
   firmware with a different register set, so a number matching the D map means nothing.

## What went in

60 entries, copied from `d.yaml` unchanged — including `enabled_by_default`, because the two
descriptor tables agree entry for entry and the D map is the one that has been exercised. Verified
afterwards: zero differences in section, data type, scale, unit, device class, state class,
precision, category, scan interval, count and icon.

| Section | Count |
|---|---|
| `SENSOR_DEFINITIONS` | 19 |
| `DEV_UNKNOWN_SENSOR_DEFINITIONS` | 28 |
| `DEV_DUPLICATE_SENSOR_DEFINITIONS` | 13 |

Renamed, because this model has one battery rather than a stack:

| Register | d.yaml | e_v3.yaml |
|---|---|---|
| 32104 | `battery_soc` | `bms_battery_soc` — the name was taken, see below |
| 34004 | `battery_1_mos_status` | `battery_mos_status` |
| 34007 / 34008 | `battery_1_protection_1` / `_2` | `battery_protection_1` / `_2` |
| 34011 / 34012 | `battery_1_env_temperature` / `_mos_temperature` | without the index |
| 34013–34016 | `battery_1_cell_temperature_1`…`_4` | without the index |

`32104` is the BMS aggregate SoC and `34002` is the battery's own. On the Venus D they are
`battery_soc` and `battery_soc_1`; this map already used `battery_soc` for `34002`, so the
aggregate took the `bms_` prefix its siblings already use (`bms_battery_voltage`, `bms_pack_count`).

### Five that did not go in

They read a value this map already serves under a different register number — the same SRAM word,
two descriptor entries. Adding them would have produced a second entity for the same reading:

| Register | d.yaml calls it | already here as |
|---|---|---|
| 34000 | `battery_1_voltage` | `battery_voltage` (30100) |
| 34001 | `battery_1_current` | `battery_current` (30101) |
| 34005 | `battery_1_max_cell_voltage` | `max_cell_voltage` (37007) |
| 34006 | `battery_1_min_cell_voltage` | `min_cell_voltage` (37008) |
| 34010 | `battery_1_bms_version` | `bms_version` (30204) |

Worth noting that the two maps picked different sides of each pair: d.yaml takes the `34xxx`
register, e_v3.yaml the mirror. Both read the same memory, so nothing is wrong either way, but if
the maps are ever aligned this is where they differ.

### The cell voltages followed

The 16 `battery_1_cell_N_voltage` entries are now `battery_cell_N_voltage`, so nothing in this map
carries a pack index any more. **This renames existing entities** — an E3 set up under an earlier
version keeps its old `sensor.*_battery_1_cell_1_voltage` as an orphan, and history, automations
and template sensors that name it have to be pointed at the new id.

The panel needed one change to go with it. Everything that draws a battery there is written for the
stack and looks a pack up by number, which is what lets the same code serve three packs and seven.
Rather than teach each of those places a second naming scheme, `findDevices` now points pack 1 at
the unindexed entities when a device has no indexed ones — including `max_cell_voltage` and
`min_cell_voltage`, which carry no `battery_` prefix and are what `packCount` reads to decide a pack
is there at all. A device that has both names keeps its own, so the D and A are untouched.

## Known traps

- **`32101` is unusable.** `Read_Serializer` sign-extends the i16 into an unsigned word before
  applying its divide-by-ten scale, so negative currents come back corrupted (−122 arrives as
  39309). The per-pack current registers carry no scale code and are fine.
- **`32100` is 10 mV, not 0.1 V.**
- **`30204` is already mapped as `bms_version`** on the E models; do not map `34010` under the same
  name.
- **The 32-register batch limit** applies as everywhere — a block read spanning more than 32
  registers fails, and the coordinator falls back to single reads.

## Verification

None of this can be confirmed without an E3. Before merging, a scan of the new registers against a
real device should show plausible values. The registers left out here are worth one scan of their
own: packs 2–7 and the PV block are expected to answer with zero rather than an exception, and if
they do not, the reasoning above needs revisiting. The file header still says the map is only
partially validated on hardware; that stays true until then.
