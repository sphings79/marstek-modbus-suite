import { html, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import type { PackFill } from "../components/mk-pack-bars";
import "../components/mk-pack-bars";
import "../components/mk-stat";
import {
  cellDeltaFlag,
  SPREAD_WARN_PP,
  SPREAD_CRIT_PP,
  spreadScale,
  spreadTone,
  packIsOutlier,
} from "../thresholds";

@customElement("mk-view-packs")
export class MkViewPacks extends MkView {
  /** Discharge floor in percent, so the columns can show where it sits. */
  static properties = {
    floor: { type: Number },
    spreadWarn: { type: Number },
    spreadCrit: { type: Number },
  };
  declare floor: number | null;
  /**
   * When the packs count as drifting apart, from the panel settings.
   *
   * Held here rather than read from thresholds.ts directly so the tile and the
   * table below it cannot end up judging by different numbers - which is
   * exactly what happened while the table carried a hardcoded rule of its own.
   */
  declare spreadWarn: number;
  declare spreadCrit: number;

  /**
   * Lower limit the backup socket reaches, read off the reserve sensor rather
   * than hard-coded: only some models have one, and the sensor is where the
   * figure is already defined.
   */
  private get backupFloor(): number | null {
    if (!this.reader.entityId("backup_reserve_energy")) return null;
    const value = this.reader.attr<number | null>(
      "backup_reserve_energy",
      "backup_floor_percent",
      null,
    );
    return typeof value === "number" && value >= 0 && value < 100 ? value : null;
  }

  constructor() {
    super();
    this.floor = null;
    this.spreadWarn = SPREAD_WARN_PP;
    this.spreadCrit = SPREAD_CRIT_PP;
  }

  static styles = [
    baseStyles,
    css`
      /* The working pack, marked rather than coloured: it is information, and
         the two alarm tones in this table are already spoken for. */
      tr.conducting > td:first-child {
        box-shadow: inset 2px 0 0 var(--mk-accent);
      }
      .live {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-left: 6px;
        vertical-align: 1px;
        background: var(--mk-accent);
      }

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
          unit="%"
          tone=${spreadTone(spread, this.spreadWarn, this.spreadCrit)}
          .bar=${spread}
          .max=${spreadScale(this.spreadCrit)}
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
          label=${t("packs.cycles_mean")}
          value=${f.num(
            cycles.length ? cycles.reduce((a, b) => a + b, 0) / cycles.length : null,
            0,
          )}
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
          .backupFloor=${this.backupFloor}
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
          ${this.backupFloor === null
            ? ""
            : ` ${t("packs.fill_legend_backup", {
                backup: f.num(this.backupFloor, 0),
              })}`}
        </div>
      </div>

      ${fills.length ? this.table(spread) : nothing}
    `;
  }

  private table(spread: number | null) {
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
                // The device closes one pack's MOSFETs at a time; that pack
                // is the one doing the work right now.
                const conducting = r.num(`battery_${i}_mos_status`) === 3;
                // Only ever flagged once the spread tile above is flagged
                // too - see packIsOutlier.
                const odd = packIsOutlier(soc, median, spread, this.spreadWarn);

                return html`
                  <tr class="${odd ? "flagged" : ""} ${conducting ? "conducting" : ""}">
                    <td class=${odd ? "warn" : ""}>
                      ${t("common.pack")} ${i}
                      ${conducting
                        ? html`<span class="live" title=${t("packs.conducting")}></span>`
                        : nothing}
                    </td>
                    <td class="n ${odd ? "warn" : ""}">${f.num(soc, 1)} %</td>
                    <td class="n">
                      ${f.num(soc === null || per === null ? null : (soc / 100) * per, 2)}
                    </td>
                    <td class="n">${f.num(min, 3)}</td>
                    <td class="n">${f.num(max, 3)}</td>
                    <td class="n ${cellDeltaFlag(delta)}">
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
        <div class="note">
          ${t("packs.table_legend", { points: this.spreadWarn })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-packs": MkViewPacks;
  }
}
