import { html, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import "../components/mk-gauge";
import "../components/mk-stat";

/** Below this many watts the battery is treated as resting, matching the
 *  integration's own idle threshold for the runtime sensors. */
const IDLE_W = 30;

@customElement("mk-view-core")
export class MkViewCore extends MkView {
  static styles = [
    baseStyles,
    css`
      .top {
        display: grid;
        grid-template-columns: 262px 1fr 262px;
        gap: var(--mk-gap);
        align-items: start;
      }
      @media (max-width: 1100px) {
        .top {
          grid-template-columns: 1fr;
        }
      }


      .centre {
        text-align: center;
        padding: 4px 0;
      }
      .split {
        display: flex;
        border: 1px solid var(--mk-line);
        background: var(--mk-surface);
        margin-top: 2px;
      }
      .split > div {
        flex: 1;
        padding: 11px 8px;
        border-right: 1px solid var(--mk-line);
      }
      .split > div:last-child {
        border-right: 0;
      }
      .split .value {
        font-size: 21px;
        margin-top: 3px;
      }
      .split .of {
        font-size: 13px;
        color: var(--mk-dim);
        font-weight: 400;
        margin-left: 5px;
      }
      .split .unit {
        font-size: 11px;
        color: var(--mk-dim);
        margin-left: 4px;
        font-weight: 400;
      }

      .flow {
        margin-top: 11px;
        font-family: var(--mk-mono);
        font-size: 26px;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .flow.rest {
        color: var(--mk-dim);
      }

      .tiles {
        grid-template-columns: repeat(6, 1fr);
        margin-top: var(--mk-gap);
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
    `,
  ];

  render() {
    const r = this.reader;
    const f = this.fmt;
    const t = this.t;

    const soc = r.num("battery_soc");
    const capacity = r.num("battery_total_energy");
    const stored = r.num("stored_energy");
    const power = r.num("battery_power");

    // The usable figure is what the integration's own sensor says when it is
    // enabled; otherwise the inner ring is simply left off rather than guessed.
    const usable = r.num("usable_energy");
    const usablePct =
      usable !== null && capacity ? (usable / capacity) * 100 : null;

    const flowing = power !== null && Math.abs(power) > IDLE_W;
    const discharging = flowing && (power as number) < 0;
    const packs = r.packCount();

    return html`
      <div class="top">
        <div class="panel">
          <div class="label" style="margin-bottom:12px">${t("core.electrical")}</div>
          ${this.kv("ac_power", 0)} ${this.kv("battery_power", 0)}
          ${this.kv("battery_voltage", 1)} ${this.kv("battery_current", 1)}
          ${this.kv("ac_voltage", 1)} ${this.kv("ac_frequency", 1)}
          ${this.kv("conversion_efficiency", 1)}
        </div>

        <div class="centre">
          <mk-gauge
            .soc=${soc}
            .usable=${usablePct}
            caption=${t("core.soc_bms")}
            sub=${usablePct === null
              ? ""
              : t("core.soc_usable", { value: f.num(usablePct, 1) })}
          ></mk-gauge>

          <div class="split">
            <div>
              <div class="label">${t("core.stored_of_total")}</div>
              <div class="value">
                ${f.num(stored, 2)}<span class="of">/ ${f.num(capacity, 2)}</span
                ><span class="unit">kWh</span>
              </div>
            </div>
            ${this.energyCell(flowing && !discharging)}
            ${this.runtimeCell(flowing, discharging)}
            ${packs
              ? html`<div>
                  <div class="label">${t("core.packs")}</div>
                  <div class="value" style="color:var(--mk-fg-2)">
                    ${f.num(packs, 0)}
                  </div>
                </div>`
              : nothing}
          </div>

          <div
            class="flow ${flowing ? "" : "rest"}"
            style=${flowing
              ? `color: var(${discharging ? "--mk-magenta" : "--mk-accent"})`
              : ""}
          >
            ${flowing ? (discharging ? "▼" : "▲") : "•"}
            ${f.num(power === null ? null : Math.abs(power), 0)} W
          </div>
          <div class="label" style="margin-top:2px">
            ${flowing
              ? discharging
                ? t("core.discharging_to_house")
                : t("core.charging_from_grid")
              : t("core.at_rest")}
            ${r.str("inverter_state") ? ` · ${r.str("inverter_state")}` : ""}
          </div>
        </div>

        <div class="panel">
          <div class="label" style="margin-bottom:12px">${t("core.reserve")}</div>
          ${this.kv("usable_energy", 2)} ${this.kv("energy_to_full", 2)}
          ${this.kv("runtime_to_full", 1)} ${this.kv("battery_cycle_count_calc", 2)}
          ${this.kv("battery_cycle_count", 0)} ${this.kv("remaining_cycles", 0)}
          ${this.kv("battery_health", 2)}
        </div>
      </div>

      <div class="grid tiles">
        <mk-stat
          label=${t("core.today_charged")}
          value=${f.num(r.num("total_daily_charging_energy"), 2)}
          unit="kWh"
        ></mk-stat>
        <mk-stat
          label=${t("core.today_discharged")}
          value=${f.num(r.num("total_daily_discharging_energy"), 2)}
          unit="kWh"
          tone="magenta"
        ></mk-stat>
        ${this.deltaTile()}
        <mk-stat
          label=${t("core.internal_temp")}
          value=${f.num(r.num("internal_temperature"), 1)}
          unit="°C"
          tone="ok"
        ></mk-stat>
        <mk-stat
          label=${t("core.mppt_total")}
          value=${f.num(
            r.sum(["mppt1_power", "mppt2_power", "mppt3_power", "mppt4_power"]),
            0,
          )}
          unit="W"
        ></mk-stat>
        <mk-stat
          label=${r.label("round_trip_efficiency_total")}
          value=${f.num(r.num("round_trip_efficiency_total"), 1)}
          unit="%"
          .bar=${r.num("round_trip_efficiency_total")}
          .max=${100}
        ></mk-stat>
      </div>
    `;
  }


  /**
   * Energy left in the direction the battery is actually moving: while charging
   * the interesting figure is what still fits, otherwise what can still come
   * out. At rest the usable figure stands, since that is the one worth reading
   * when nothing is happening.
   */
  private energyCell(charging: boolean) {
    const key = charging ? "energy_to_full" : "usable_energy";
    const value = this.reader.num(key);
    if (value === null && !this.reader.entityId(key)) return nothing;

    return html`
      <div>
        <div class="label">${this.t(charging ? "core.to_full" : "core.usable")}</div>
        <div class="value" style="color:var(${charging ? "--mk-accent" : "--mk-fg"})">
          ${this.fmt.num(value, 2)}<span class="unit">kWh</span>
        </div>
      </div>
    `;
  }

  /**
   * The countdown that is actually counting.
   *
   * Only one of the two runtime sensors ever runs: each returns 0 when the
   * power flows the other way. A fixed slot would therefore show a stopped
   * countdown half the time, so the cell follows the flow and says which of
   * the two it is showing. At rest neither counts, and a dash is more honest
   * than a zero.
   */
  private runtimeCell(flowing: boolean, discharging: boolean) {
    const key = discharging ? "runtime_to_empty" : "runtime_to_full";
    if (!this.reader.entityId(key)) return nothing;

    const label = !flowing
      ? this.t("core.runtime")
      : this.t(discharging ? "core.to_empty" : "core.until_full");

    return html`
      <div>
        <div class="label">${label}</div>
        <div class="value" style=${flowing ? "" : "color:var(--mk-dim)"}>
          ${flowing
            ? html`${this.fmt.num(this.reader.num(key), 1)}<span class="unit">h</span>`
            : "—"}
        </div>
      </div>
    `;
  }

  /**
   * The widest spread of cells inside a single pack, and which pack that is.
   *
   * Deliberately not the spread across the whole stack: the device charges one
   * pack at a time, so packs routinely sit at different states of charge and
   * their cells at different voltages. That difference says nothing about cell
   * health, while a pack whose own cells drift apart says a great deal.
   */
  private deltaTile() {
    const r = this.reader;
    let worst: { pack: number; delta: number } | null = null;

    for (let i = 1; i <= r.packCount(); i++) {
      const hi = r.num(`battery_${i}_max_cell_voltage`);
      const lo = r.num(`battery_${i}_min_cell_voltage`);
      if (hi === null || lo === null) continue;
      const delta = hi - lo;
      if (!worst || delta > worst.delta) worst = { pack: i, delta };
    }

    // 100 mV is where a pack is usually considered out of balance; the bar is
    // drawn against that, not against the largest value seen so far.
    const tone = !worst ? "" : worst.delta > 0.1 ? "crit" : worst.delta > 0.05 ? "warn" : "ok";

    return html`
      <mk-stat
        label=${this.t("core.cell_delta")}
        value=${this.fmt.millivolts(worst?.delta ?? null)}
        unit="mV"
        tone=${tone}
        .bar=${worst?.delta ?? null}
        .max=${0.1}
        foot=${worst
          ? this.t("core.in_pack", { pack: worst.pack })
          : this.t("core.no_delta")}
      ></mk-stat>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-core": MkViewCore;
  }
}
