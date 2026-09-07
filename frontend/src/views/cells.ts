import { html, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { MkView } from "./view-base";
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

/**
 * mos_status values seen in the field. 3 means the pack's MOSFETs are closed
 * and it is the one working; 2 is the brief handover state; 0 is disconnected.
 */
const MOS_CONDUCTING = 3;
const MOS_KNOWN = [0, 2, 3];

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
   * Protection registers, and which pack is currently carrying the current.
   *
   * Only protection_1 and protection_2 are fault registers. mos_status is a
   * state, not an alarm: the device works one pack at a time and closes that
   * pack's MOSFETs while it does, so treating any non-zero value as a fault
   * reported normal operation in red.
   *
   * Observed over ten days on a Venus D: 0 while a pack is disconnected, 3
   * while it conducts, and 2 for a few seconds either side of the handover -
   * one contactor closed and the other not yet. A 1 never appeared, so which
   * bit is charge and which is discharge is not established, and this does not
   * claim to know. Anything outside those three is worth showing.
   */
  private protectionRows() {
    const r = this.reader;
    const t = this.t;
    const flagged: string[] = [];
    const conducting: number[] = [];
    const odd: string[] = [];

    for (const i of this.packs) {
      const p1 = r.num(`battery_${i}_protection_1`);
      const p2 = r.num(`battery_${i}_protection_2`);
      const parts: string[] = [];
      if (p1) parts.push(`P1 ${p1}`);
      if (p2) parts.push(`P2 ${p2}`);
      if (parts.length) flagged.push(`${t("common.pack")} ${i}: ${parts.join(", ")}`);

      const mos = r.num(`battery_${i}_mos_status`);
      if (mos === MOS_CONDUCTING) conducting.push(i);
      else if (mos !== null && !MOS_KNOWN.includes(mos)) {
        odd.push(`${t("common.pack")} ${i}: ${mos}`);
      }
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
      ${this.row(
        t("cells.conducting"),
        conducting.length
          ? conducting.map((i) => `${t("common.pack")} ${i}`).join(", ")
          : t("cells.conducting_none"),
        conducting.length ? "ok" : "",
      )}
      ${odd.map((line) => this.row(line, t("cells.mos_unexpected"), "warn"))}
      ${this.kv("fault_status", 0)} ${this.kv("fault_status_2", 0)}
      ${this.bmsVersions()}
      <div class="note">${t("cells.conducting_hint")}</div>
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
