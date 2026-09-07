import { html, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import type { PackFill } from "../components/mk-pack-bars";
import "../components/mk-pack-bars";
import "../components/mk-stat";

/**
 * How far apart the packs' states of charge may sit before it means anything.
 *
 * The device works one pack at a time rather than all of them in parallel, so
 * during a charge or a discharge the packs are routinely around ten points
 * apart. That is the design working, not a fault, and flagging it would train
 * the reader to ignore the tile. These thresholds sit above the spread normal
 * operation produces.
 */
const SPREAD_WARN_PP = 12;
const SPREAD_CRIT_PP = 20;
/** Bar scale, so an ordinary working spread does not sit at the end of it. */
const SPREAD_SCALE_PP = 25;

@customElement("mk-view-packs")
export class MkViewPacks extends MkView {
  /** Discharge floor in percent, so the columns can show where it sits. */
  static properties = { floor: { type: Number } };
  declare floor: number | null;

  constructor() {
    super();
    this.floor = null;
  }

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
      .table-wrap {
        margin-top: var(--mk-gap);
      }
    `,
  ];

  /** Nominal capacity of a single pack, used to turn a percentage into kWh. */
  private get packCapacity(): number | null {
    const total = this.reader.num("battery_total_energy");
    const count = this.packs.length;
    return total !== null && count ? total / count : null;
  }

  private get fills(): PackFill[] {
    const r = this.reader;
    const f = this.fmt;
    const per = this.packCapacity;

    return this.packs.map((i) => {
      const soc = r.num(`battery_soc_${i}`);
      const min = r.num(`battery_${i}_min_cell_voltage`);
      const max = r.num(`battery_${i}_max_cell_voltage`);
      return {
        index: i,
        soc,
        energy: soc === null || per === null ? null : (soc / 100) * per,
        socLabel: soc === null ? undefined : `${f.num(soc, 1)} %`,
        note:
          min === null || max === null
            ? undefined
            : `${f.num(min, 3)} – ${f.num(max, 3)} V`,
      };
    });
  }

  render() {
    const r = this.reader;
    const f = this.fmt;
    const t = this.t;
    const fills = this.fills;

    const socs = fills.map((p) => p.soc).filter((v): v is number => v !== null);
    const mean = socs.length ? socs.reduce((a, b) => a + b, 0) / socs.length : null;
    const spread = socs.length ? Math.max(...socs) - Math.min(...socs) : null;
    const summed = fills.reduce(
      (sum, p) => (p.energy === null ? sum : sum + p.energy),
      0,
    );
    const cycles = this.packs
      .map((i) => r.num(`battery_${i}_cycle_count`))
      .filter((v): v is number => v !== null);

    return html`
      <div class="grid tiles">
        <mk-stat
          label=${r.label("battery_soc")}
          value=${f.num(r.num("battery_soc"), 0)}
          unit="%"
          foot=${t("packs.device_reading")}
        ></mk-stat>
        <mk-stat
          label=${t("packs.mean_soc")}
          value=${f.num(mean, 1)}
          unit="%"
          foot=${t("packs.from_n_packs", { count: fills.length })}
        ></mk-stat>
        <mk-stat
          label=${t("packs.spread")}
          value=${f.num(spread, 1)}
          unit="pp"
          tone=${spread === null
            ? ""
            : spread >= SPREAD_CRIT_PP
              ? "crit"
              : spread >= SPREAD_WARN_PP
                ? "warn"
                : "ok"}
          .bar=${spread}
          .max=${SPREAD_SCALE_PP}
        ></mk-stat>
        <mk-stat
          label=${t("packs.stored_total")}
          value=${f.num(r.num("stored_energy"), 2)}
          unit="kWh"
          foot=${summed
            ? t("packs.summed", { value: f.num(summed, 2) })
            : ""}
        ></mk-stat>
        <mk-stat
          label=${t("packs.per_pack")}
          value=${f.num(this.packCapacity, 2)}
          unit="kWh"
          foot=${t("packs.nominal")}
        ></mk-stat>
        <mk-stat
          label=${t("packs.cycles_sum")}
          value=${f.num(cycles.length ? cycles.reduce((a, b) => a + b, 0) : null, 0)}
          foot=${cycles.length < this.packs.length
            ? t("packs.cycles_partial", {
                have: cycles.length,
                total: this.packs.length,
              })
            : ""}
        ></mk-stat>
      </div>

      <div class="panel">
        <div class="head">
          <div class="label">${t("packs.fill_title")}</div>
          <div class="label">${t("packs.fill_axis")}</div>
        </div>
        ${fills.length
          ? html`
              <mk-pack-bars
                .packs=${fills}
                .floor=${this.floor}
                packLabel=${t("common.pack")}
                energyUnit=${r.unit("battery_total_energy") || "kWh"}
                .formatNumber=${(v: number | null, d = 0) => f.num(v, d)}
              ></mk-pack-bars>
            `
          : html`<div class="note">${t("packs.none")}</div>`}
        <div class="note">
          ${this.floor === null
            ? t("packs.fill_legend_nofloor")
            : t("packs.fill_legend", { floor: f.num(this.floor, 0) })}
        </div>
      </div>

      ${fills.length ? this.table() : nothing}
    `;
  }

  private table() {
    const r = this.reader;
    const f = this.fmt;
    const t = this.t;
    const per = this.packCapacity;

    const socs = this.packs
      .map((i) => r.num(`battery_soc_${i}`))
      .filter((v): v is number => v !== null)
      .sort((a, b) => a - b);
    const median = socs.length ? socs[Math.floor(socs.length / 2)] : null;

    return html`
      <div class="panel table-wrap">
        <div class="head"><div class="label">${t("packs.table_title")}</div></div>
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th>${t("common.pack")}</th>
                <th class="n">${t("packs.col_soc")}</th>
                <th class="n">${t("packs.col_energy")}</th>
                <th class="n">${t("packs.col_min")}</th>
                <th class="n">${t("packs.col_max")}</th>
                <th class="n">${t("packs.col_delta")}</th>
                <th class="n">${t("packs.col_voltage")}</th>
                <th class="n">${t("packs.col_current")}</th>
                <th class="n">${t("packs.col_cycles")}</th>
                <th class="n">${t("packs.col_mos")}</th>
                <th class="n">${t("packs.col_env")}</th>
                <th class="n">${t("packs.col_ntc")}</th>
              </tr>
            </thead>
            <tbody>
              ${this.packs.map((i) => {
                const soc = r.num(`battery_soc_${i}`);
                const min = r.num(`battery_${i}_min_cell_voltage`);
                const max = r.num(`battery_${i}_max_cell_voltage`);
                const delta = min !== null && max !== null ? max - min : null;
                const ntc = [1, 2, 3, 4]
                  .map((n) => r.num(`battery_${i}_cell_temperature_${n}`))
                  .filter((v): v is number => v !== null)
                  .map((v) => f.num(v, 1))
                  .join(" · ");
                const odd =
                  median !== null && soc !== null && Math.abs(soc - median) > 5;

                return html`
                  <tr class=${odd ? "flagged" : ""}>
                    <td class=${odd ? "warn" : ""}>${t("common.pack")} ${i}</td>
                    <td class="n ${odd ? "warn" : ""}">${f.num(soc, 1)} %</td>
                    <td class="n">
                      ${f.num(soc === null || per === null ? null : (soc / 100) * per, 2)}
                    </td>
                    <td class="n">${f.num(min, 3)}</td>
                    <td class="n">${f.num(max, 3)}</td>
                    <td class="n ${delta !== null && delta >= 0.01 ? "crit" : ""}">
                      ${f.millivolts(delta)} mV
                    </td>
                    <td class="n">${f.num(r.num(`battery_${i}_voltage`), 2)}</td>
                    <td class="n">${f.num(r.num(`battery_${i}_current`), 2)}</td>
                    <td class="n">${f.num(r.num(`battery_${i}_cycle_count`), 0)}</td>
                    <td class="n">${f.num(r.num(`battery_${i}_mos_temperature`), 1)}</td>
                    <td class="n">${f.num(r.num(`battery_${i}_env_temperature`), 1)}</td>
                    <td class="n">${ntc || "—"}</td>
                  </tr>
                `;
              })}
            </tbody>
          </table>
        </div>
        <div class="note">${t("packs.table_legend")}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-packs": MkViewPacks;
  }
}
