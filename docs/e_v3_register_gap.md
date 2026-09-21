# Completing the Venus E3 register map

Working notes for the `e3-register-map` branch. Nothing here is implemented yet — this is the
scope, the source, and the decisions that have to hold while filling `registers/e_v3.yaml`.

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
left to map                 118
```

`e_v3_register_gap.csv` lists those 118 with the name, type, scale and unit the Venus D map gives
them. Every one of them is already named there, so this is mapping work, not analysis.

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
| 30000–30214 | 45 | inverter telemetry, versions, self-check, mirrors of BMS values | on, except the mirrors |
| 32100–32203 | 17 | BMS aggregate (voltage, current, SoC, current limits, pack count) | on |
| 34000–34017 | 16 | the single battery, see above | on |
| 35110–35112 | 3 | charge voltage limit, charge/discharge current limit | on |
| 37000–37024 | 22 | alias block; most duplicate registers that already exist | off |
| 38000–38014 | 15 | raw CAN frames 0x40–0x43, undecoded | off |

Two things to settle while mapping:

1. **MPPT (30020–30040, 37017–37024).** The firmware carries the full PV path on every model, and
   the E3 control image is no exception, but that says nothing about the hardware. Unless an E3 is
   known to have PV inputs, these belong in with `enabled_by_default: false`.
2. **Aliases (37xxx).** 37013/37015 are the error words again, 37017–37020 the MPPT powers. Mapping
   them creates a second entity for the same value. Worth carrying only where the primary register
   is not served, which on this model is nowhere.

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
real device should show plausible values, and the ones expected to read zero — packs, MPPT — should
actually read zero rather than an exception. The file header still says the map is only partially
validated on hardware; that stays true until then.
