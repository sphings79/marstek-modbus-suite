import { html, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import type { PackRange } from "../components/mk-pack-matrix";
import "../components/mk-pack-matrix";
import "../components/mk-stat";

/** Spread across the whole stack, in volts, at which it is worth a warning. */
const STACK_WARN_V = 0.05;
const STACK_CRIT_V = 0.1;

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
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  private get ranges(): PackRange[] {
    const r = this.reader;
    const out: PackRange[] = [];
    for (const i of this.packs) {
      const min = r.num(`battery_${i}_min_cell_voltage`);
      const max = r.num(`battery_${i}_max_cell_voltage`);
      if (min === null || max === null) continue;

      const cycles = r.num(`battery_${i}_cycle_count`);
      const temp = r.num(`battery_${i}_mos_temperature`);
      const note = [
        cycles === null ? null : `${this.fmt.num(cycles, 0)} ⟳`,
        temp === null ? null : `${this.fmt.num(temp, 1)} °C`,
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
    const inPackDeltas = ranges.map((x) => x.max - x.min);
    const meanDelta = inPackDeltas.length
      ? inPackDeltas.reduce((a, b) => a + b, 0) / inPackDeltas.length
      : null;

    const tone =
      spread === null ? "" : spread >= STACK_CRIT_V ? "crit" : spread >= STACK_WARN_V ? "warn" : "ok";

    return html`
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
          tone=${tone}
          .bar=${spread}
          .max=${STACK_CRIT_V}
          foot=${t("cells.limit_hint")}
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
        <mk-stat
          label=${t("cells.temp_span")}
          value=${f.num(this.tempSpan(), 1)}
          unit="K"
          foot=${`${f.num(r.num("min_cell_temperature"), 1)} – ${f.num(
            r.num("max_cell_temperature"),
            1,
          )} °C`}
        ></mk-stat>
        <mk-stat
          label=${t("cells.packs_online")}
          value=${`${ranges.length} / ${r.num("bms_pack_count") ?? ranges.length}`}
          foot=${t("cells.cells_total", { count: ranges.length * 16 })}
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
              ></mk-pack-matrix>
            `
          : html`<div class="note">${t("cells.no_ranges")}</div>`}
        <div class="note">${t("cells.matrix_legend")}</div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${t("cells.protection")}</div></div>
          ${this.protectionRows()}
        </div>
        <div class="panel">
          <div class="head"><div class="label">${t("cells.bms")}</div></div>
          ${this.kv("bms_pack_count", 0)} ${this.kv("bms_online_mask", 0)}
          ${this.kv("bms_active_pack_index", 0)} ${this.kv("bms_battery_voltage", 2)}
          ${this.kv("bms_charge_voltage_limit", 2)} ${this.kv("alarm_status", 0)}
        </div>
      </div>
    `;
  }

  private tempSpan(): number | null {
    const hi = this.reader.num("max_cell_temperature");
    const lo = this.reader.num("min_cell_temperature");
    return hi === null || lo === null ? null : hi - lo;
  }

  /**
   * One row per pack, but only the packs that actually report something. A
   * clean stack collapses to a single line rather than seven identical zeros.
   */
  private protectionRows() {
    const r = this.reader;
    const t = this.t;
    const flagged: string[] = [];

    for (const i of this.packs) {
      const p1 = r.num(`battery_${i}_protection_1`);
      const p2 = r.num(`battery_${i}_protection_2`);
      const mos = r.num(`battery_${i}_mos_status`);
      const parts: string[] = [];
      if (p1) parts.push(`P1 ${p1}`);
      if (p2) parts.push(`P2 ${p2}`);
      if (mos) parts.push(`MOS ${mos}`);
      if (parts.length) flagged.push(`${t("common.pack")} ${i}: ${parts.join(", ")}`);
    }

    if (!this.packs.length) {
      return html`<div class="note">${t("cells.no_ranges")}</div>`;
    }

    return html`
      ${flagged.length
        ? flagged.map((line) => this.row(line, t("cells.raised"), "crit"))
        : this.row(
            t("cells.protection_all", { count: this.packs.length }),
            t("cells.clear"),
            "ok",
          )}
      ${this.kv("fault_status", 0)} ${this.kv("fault_status_2", 0)}
      ${this.bmsVersions()}
    `;
  }

  /** Firmware across packs: one line when they agree, a list when they do not. */
  private bmsVersions() {
    const r = this.reader;
    const versions = new Map<string, number[]>();
    for (const i of this.packs) {
      const v = r.str(`battery_${i}_bms_version`);
      if (v === null) continue;
      versions.set(v, [...(versions.get(v) ?? []), i]);
    }
    if (!versions.size) return nothing;

    if (versions.size === 1) {
      const [version] = [...versions.keys()];
      return this.row(this.t("cells.bms_version"), `${version} · ${this.t("cells.uniform")}`);
    }
    return [...versions.entries()].map(([version, packs]) =>
      this.row(
        `${this.t("cells.bms_version")} ${version}`,
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
