import { html, css, nothing, type TemplateResult } from "lit";
import { customElement } from "../define";
import { MkView } from "./view-base";
import { MIN_CELL_TEMP_KEYS, MOS_BOTH, MOS_CHARGE_ONLY, MOS_DISCHARGE_ONLY, MOS_OFF, mosConducts } from "../entities";
import { baseStyles } from "../styles";
import type { PackRange } from "../components/mk-pack-matrix";
import "../components/mk-pack-matrix";
import "../components/mk-stat";

/*
 * The stack spread - highest cell anywhere minus lowest cell anywhere - is
 * reported without a verdict on purpose.
 *
 * The device works one pack at a time, so during a charge or discharge the
 * packs sit at different states of charge and their cells therefore sit at
 * different voltages. Judging that against the usual 100 mV, which is a limit
 * for cells inside one pack, marks normal operation as a fault. The number
 * that finds a weak cell is the delta within a single pack, and that is what
 * the tile beside it and the table below report.
 */

/** Panel text for each battery_N_mos_status value; anything else is unexpected. */
const MOS_TEXT: Record<number, string> = {
  [MOS_OFF]: "cells.mos_off",
  [MOS_CHARGE_ONLY]: "cells.mos_charge",
  [MOS_DISCHARGE_ONLY]: "cells.mos_discharge",
  [MOS_BOTH]: "cells.mos_both",
};

@customElement("mk-view-cells")
export class MkViewCells extends MkView {
  static styles = [
    baseStyles,
    css`
      .tiles {
        grid-template-columns: repeat(6, 1fr);
        margin-bottom: var(--mk-gap);
      }
      @media (max-width: 1400px) {
        .tiles {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      @media (max-width: 700px) {
        .tiles {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .below {
        grid-template-columns: 1.5fr 1fr;
        margin-top: var(--mk-gap);
      }
      .cellgrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
        gap: 0 18px;
      }
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  private get ranges(): PackRange[] {
    const r = this.reader;
    const unit = this.unitOf(
      ...this.packs.map((i) => `battery_${i}_mos_temperature`),
    );
    const out: PackRange[] = [];
    for (const i of this.packs) {
      const min = r.packNum(i, "min_cell_voltage");
      const max = r.packNum(i, "max_cell_voltage");
      if (min === null || max === null) continue;

      const cycles = r.packNum(i, "cycle_count");
      const temp = r.num(`battery_${i}_mos_temperature`);
      const note = [
        cycles === null ? null : `${this.fmt.num(cycles, 0)} ⟳`,
        temp === null
          ? null
          : `${this.fmt.num(temp, 1)}${unit ? ` ${unit}` : ""}`,
      ]
        .filter(Boolean)
        .join(" · ");

      out.push({ index: i, min, max, note });
    }
    return out;
  }

  render() {
    const r = this.reader;
    const f = this.fmt;
    const t = this.t;
    const ranges = this.ranges;

    const highs = ranges.map((x) => x.max);
    const lows = ranges.map((x) => x.min);
    const spread = ranges.length ? Math.max(...highs) - Math.min(...lows) : null;
    const worstPack = ranges.reduce<PackRange | null>(
      (worst, x) => (!worst || x.max - x.min > worst.max - worst.min ? x : worst),
      null,
    );
    // Counted, not 16 times the packs: a Venus A has 13 cells to a pack and
    // was told it had 32 of them.
    const cellsTotal = ranges.length * r.cellsPerPack();
    const inPackDeltas = ranges.map((x) => x.max - x.min);
    const meanDelta = inPackDeltas.length
      ? inPackDeltas.reduce((a, b) => a + b, 0) / inPackDeltas.length
      : null;
    const tempUnit = this.unitOf(
      ...this.packs.map((i) => `battery_${i}_cell_temperature_1`),
      "max_cell_temperature",
      ...MIN_CELL_TEMP_KEYS,
    );

    return html`
      ${this.disabledPackNote([
        "max_cell_voltage",
        "min_cell_voltage",
        "cell_1_voltage",
        "cell_temperature_1",
        "protection_1",
        "bms_warnings",
        "mos_status",
      ])}
      <div class="grid tiles">
        <mk-stat
          label=${t("cells.highest")}
          value=${f.num(highs.length ? Math.max(...highs) : null, 3)}
          unit="V"
          foot=${highs.length
            ? t("cells.in_pack", {
                pack: ranges[highs.indexOf(Math.max(...highs))].index,
              })
            : ""}
        ></mk-stat>
        <mk-stat
          label=${t("cells.lowest")}
          value=${f.num(lows.length ? Math.min(...lows) : null, 3)}
          unit="V"
          foot=${lows.length
            ? t("cells.in_pack", {
                pack: ranges[lows.indexOf(Math.min(...lows))].index,
              })
            : ""}
        ></mk-stat>
        <mk-stat
          label=${t("cells.stack_spread")}
          value=${f.millivolts(spread)}
          unit="mV"
          foot=${t("cells.stack_hint")}
        ></mk-stat>
        <mk-stat
          label=${t("cells.mean_delta")}
          value=${f.millivolts(meanDelta)}
          unit="mV"
          foot=${worstPack
            ? t("cells.worst_pack", {
                pack: worstPack.index,
                value: f.millivolts(worstPack.max - worstPack.min),
              })
            : ""}
        ></mk-stat>
        ${this.tempSpanTile(tempUnit)}
        <mk-stat
          label=${t("cells.packs_online")}
          value=${`${ranges.length} / ${r.num("bms_pack_count") ?? ranges.length}`}
          foot=${cellsTotal ? t("cells.cells_total", { count: cellsTotal }) : ""}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${t("cells.matrix_title")}</div>
          <div class="label">${t("cells.matrix_axis")}</div>
        </div>
        ${ranges.length
          ? html`
              <mk-pack-matrix
                .ranges=${ranges}
                packLabel=${t("common.pack")}
                .formatVolts=${(v: number) => f.num(v, 3)}
                .formatTick=${(v: number) => f.num(v, 1)}
              ></mk-pack-matrix>
            `
          : html`<div class="note">${t("cells.no_ranges")}</div>`}
        <div class="note">${t("cells.matrix_legend")}</div>
      </div>

      ${this.cellVoltages()}

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${t("cells.protection")}</div></div>
          ${this.protectionRows()}
        </div>
        <div class="panel">
          <div class="head"><div class="label">${t("cells.bms")}</div></div>
          ${this.kv("bms_pack_count", 0)} ${this.kv("bms_online_mask", 0)}
          ${this.kv("bms_active_pack_index", 0)} ${this.kv("bms_battery_voltage", 2)}
          ${this.kv("bms_charge_voltage_limit", 2)}
          ${this.kv("bms_charge_current_limit", 1)} ${this.kv("bms_discharge_current_limit", 1)}
          ${this.kv("battery_1_profile", 0, { raw: true })}
        </div>
      </div>
    `;
  }

  /**
   * The widest spread of cell temperatures inside one pack, from each pack's
   * own NTCs, and which pack that is.
   *
   * Not max_cell_temperature minus battery_1_min_cell_temperature: on the
   * Venus D and A the first is the maximum across the stack and the second
   * pack 1's minimum, and the firmware serves no minimum across the stack, so
   * the difference mixes two different things. Where no pack NTC reports
   * (Venus E v1/v2, or the E v3 with its pack NTCs left disabled), the
   * single pack's own maximum and minimum stand in.
   */
  private tempSpanTile(unit: string) {
    const r = this.reader;
    const f = this.fmt;
    const t = this.t;
    const suffix = unit ? ` ${unit}` : "";

    let widest: { pack: number; lo: number; hi: number } | null = null;
    for (const i of this.packs) {
      const temps = this.packCellTemps(i);
      if (temps.length < 2) continue;
      const lo = Math.min(...temps);
      const hi = Math.max(...temps);
      if (!widest || hi - lo > widest.hi - widest.lo) widest = { pack: i, lo, hi };
    }

    if (widest) {
      return html`<mk-stat
        label=${t("cells.temp_span")}
        value=${f.num(widest.hi - widest.lo, 1)}
        unit=${unit}
        foot=${t("cells.temp_span_pack", {
          pack: widest.pack,
          range: `${f.num(widest.lo, 1)} – ${f.num(widest.hi, 1)}${suffix}`,
        })}
      ></mk-stat>`;
    }

    // Only meaningful for one pack: on a stack the two registers describe
    // different packs (see above).
    const hi = this.packs.length <= 1 ? r.num("max_cell_temperature") : null;
    const lo = this.packs.length <= 1 ? r.numFirst(MIN_CELL_TEMP_KEYS) : null;
    return html`<mk-stat
      label=${t("cells.temp_span")}
      value=${f.num(hi === null || lo === null ? null : hi - lo, 1)}
      unit=${unit}
      foot=${hi === null || lo === null ? "" : `${f.num(lo, 1)} – ${f.num(hi, 1)}${suffix}`}
    ></mk-stat>`;
  }

  /**
   * The single cell voltages of a one-pack battery (Venus E v3), when the
   * user has enabled them. A stack of seven packs would make this a wall of
   * 112 numbers, and the range bars above already say what matters there.
   */
  private cellVoltages() {
    const r = this.reader;
    if (this.packs.length !== 1) return nothing;
    const count = r.cellsPerPack();
    if (!count) return nothing;

    const cells = Array.from({ length: count }, (_, i) => i + 1).filter((cell) =>
      r.entityId(`battery_1_cell_${cell}_voltage`),
    );
    const values = cells
      .map((cell) => r.num(`battery_1_cell_${cell}_voltage`))
      .filter((v): v is number => v !== null);
    const hi = values.length ? Math.max(...values) : null;
    const lo = values.length ? Math.min(...values) : null;

    return html`
      <div class="panel" style="margin-top:var(--mk-gap)">
        <div class="head">
          <div class="label">${this.t("cells.cell_voltages")}</div>
          <div class="label">${this.t("cells.cells_total", { count: cells.length })}</div>
        </div>
        <div class="cellgrid">
          ${cells.map((cell) => {
            const v = r.num(`battery_1_cell_${cell}_voltage`);
            const tone = v === null || values.length < 2 ? "" : v === hi ? "accent" : v === lo ? "warn" : "";
            return this.row(`#${cell}`, `${this.fmt.num(v, 3)} V`, tone);
          })}
        </div>
      </div>
    `;
  }

  /**
   * Protection words, warnings, the BMS lock, and which pack is switched in.
   *
   * protection_1 and protection_2 are fault words and the BMS warnings their
   * early stage; each set bit arrives decoded in the entity's
   * `active_faults` attribute, so the row names the cause and keeps the raw
   * number as a tooltip.
   *
   * mos_status is a state, not an alarm: the device works one pack at a time
   * and switches that pack in while it does. 0 means both MOSFETs are off,
   * 1 only the charge MOSFET conducts, 2 only the discharge MOSFET, 3 both.
   * Any of 1 to 3 is a pack that is switched in; anything above 3 is worth
   * showing.
   */
  private protectionRows() {
    const r = this.reader;
    const t = this.t;
    const faults: TemplateResult[] = [];
    const warnings: TemplateResult[] = [];
    const conducting: string[] = [];
    const odd: string[] = [];
    const single = this.packs.length === 1;

    for (const i of this.packs) {
      for (const key of [`battery_${i}_protection_1`, `battery_${i}_protection_2`]) {
        const raw = r.num(key);
        if (raw) faults.push(this.bitRow(key, raw, "crit"));
      }
      const warn = r.num(`battery_${i}_bms_warnings`);
      if (warn) warnings.push(this.bitRow(`battery_${i}_bms_warnings`, warn, "warn"));

      const mos = r.packNum(i, "mos_status");
      if (mos === null) continue;
      const text = MOS_TEXT[mos];
      if (!text) odd.push(`${t("common.pack")} ${i}: ${mos}`);
      else if (mosConducts(mos)) {
        conducting.push(single ? t(text) : `${t("common.pack")} ${i} · ${t(text)}`);
      }
    }

    if (!this.packs.length) {
      return html`<div class="note">${t("cells.no_ranges")}</div>`;
    }

    const protectionKnown = this.packs.some((i) => r.has(`battery_${i}_protection_1`));
    const mosKnown = this.packs.some((i) => r.has(r.packKey(i, "mos_status")));

    return html`
      ${this.lockRows()}
      ${faults.length
        ? faults
        : protectionKnown
          ? this.row(
              t("cells.protection_all", { count: this.packs.length }),
              t("cells.clear"),
              "ok",
            )
          : nothing}
      ${warnings}
      ${mosKnown
        ? this.row(
            t("cells.conducting"),
            conducting.length ? conducting.join(", ") : t("cells.conducting_none"),
            conducting.length ? "ok" : "",
          )
        : nothing}
      ${odd.map((line) => this.row(line, t("cells.mos_unexpected"), "warn"))}
      ${this.kv("fault_status", 0, { raw: true })}
      ${this.bmsVersions()}
      ${mosKnown ? html`<div class="note">${t("cells.conducting_hint")}</div>` : nothing}
    `;
  }

  /**
   * A raised bit word, its set bits named. The number stays reachable as the
   * tooltip, and stands in when the entity carries no decoded bits.
   */
  private bitRow(key: string, raw: number, tone: string) {
    const texts = this.reader.activeFaults(key);
    return this.row(
      this.reader.label(key),
      texts && texts.length ? texts.join(", ") : String(raw),
      tone,
      { title: String(raw), wrap: true },
    );
  }

  /**
   * The BMS fault lock, and the BMS factory mode where the user enabled that
   * entity. A lock holds the MOSFETs open whatever the packs report, so it
   * leads the list.
   */
  private lockRows() {
    const r = this.reader;
    const t = this.t;
    return ["bms_lock_active", "bms_factory_mode"].map((key) =>
      r.has(key)
        ? this.row(
            r.label(key),
            r.isOn(key) ? t("cells.lock_on") : t("cells.lock_off"),
            r.isOn(key) ? "warn" : "ok",
          )
        : nothing,
    );
  }

  /** Firmware across packs: one line when they agree, a list when they do not. */
  private bmsVersions() {
    const r = this.reader;
    const versions = new Map<string, number[]>();
    for (const i of this.packs) {
      const v = r.str(r.packKey(i, "bms_version"));
      if (v === null) continue;
      versions.set(v, [...(versions.get(v) ?? []), i]);
    }
    if (!versions.size) return nothing;

    if (versions.size === 1) {
      const [version] = [...versions.keys()];
      return this.row(
        this.t("cells.bms_version"),
        `${this.fmt.version(version)} · ${this.t("cells.uniform")}`,
      );
    }
    return [...versions.entries()].map(([version, packs]) =>
      this.row(
        `${this.t("cells.bms_version")} ${this.fmt.version(version)}`,
        packs.map((p) => `#${p}`).join(" "),
        "warn",
      ),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-cells": MkViewCells;
  }
}
