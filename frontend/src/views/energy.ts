import { html, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import "../components/mk-stat";

interface Period {
  titleKey: string;
  charge: string;
  discharge: string;
  /** Efficiency sensor for this period, when the device reports one. */
  efficiency?: string;
}

const PERIODS: Period[] = [
  {
    titleKey: "energy.today",
    charge: "total_daily_charging_energy",
    discharge: "total_daily_discharging_energy",
  },
  {
    titleKey: "energy.month",
    charge: "total_monthly_charging_energy",
    discharge: "total_monthly_discharging_energy",
    efficiency: "round_trip_efficiency_monthly",
  },
  {
    titleKey: "energy.lifetime",
    charge: "total_charging_energy",
    discharge: "total_discharging_energy",
    efficiency: "round_trip_efficiency_total",
  },
];

@customElement("mk-view-energy")
export class MkViewEnergy extends MkView {
  static styles = [
    baseStyles,
    css`
      .periods {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 1100px) {
        .periods {
          grid-template-columns: 1fr;
        }
      }
      .pair {
        display: flex;
        gap: 18px;
        align-items: baseline;
      }
      .big {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 30px;
      }
      .track {
        height: 7px;
        background: var(--mk-track);
        margin-top: 4px;
        position: relative;
        overflow: hidden;
      }
      .track > i {
        position: absolute;
        inset: 0 auto 0 0;
        display: block;
        background: var(--mk-accent);
      }
      .track.out > i {
        background: var(--mk-magenta);
      }
      .pill {
        font-family: var(--mk-mono);
        font-size: 9.5px;
        letter-spacing: 0.12em;
        padding: 2px 7px;
        border: 1px solid var(--mk-line);
        color: var(--mk-dim);
      }
      .pill.on {
        border-color: var(--mk-accent);
        color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      .pill.w {
        border-color: var(--mk-warn);
        color: var(--mk-warn);
      }
      .below {
        margin-top: var(--mk-gap);
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
      .meter + .meter {
        margin-top: 15px;
      }
      .meter-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
    `,
  ];

  render() {
    const t = this.t;
    return html`
      <div class="grid periods">${PERIODS.map((p) => this.period(p))}</div>
      <div class="grid below">
        ${this.efficiencyPanel()}
        <div class="panel">
          <div class="head"><div class="label">${t("energy.throughput")}</div></div>
          ${this.kv("battery_cycle_count_calc", 2)} ${this.kv("battery_cycle_count", 0)}
          ${this.kv("stored_energy", 2)} ${this.kv("battery_total_energy", 2)}
          ${this.kv("usable_energy", 2)} ${this.kv("energy_to_full", 2)}
          ${this.kv("remaining_cycles", 0)} ${this.kv("battery_health", 2)}
        </div>
      </div>
    `;
  }

  private period(p: Period) {
    const r = this.reader;
    const f = this.fmt;
    const t = this.t;

    const charge = r.num(p.charge);
    const discharge = r.num(p.discharge);
    if (charge === null && discharge === null) return nothing;

    // The ratio is only meaningful once something has actually gone in.
    const ratio = charge ? ((discharge ?? 0) / charge) * 100 : null;
    const loss = charge !== null && discharge !== null ? charge - discharge : null;
    const reported = p.efficiency ? r.num(p.efficiency) : null;

    return html`
      <div class="panel">
        <div class="head">
          <div class="label">${t(p.titleKey)}</div>
          ${reported === null
            ? nothing
            : html`<span class="pill ${reported < 70 ? "w" : "on"}">
                ${t("energy.rte")} ${f.num(reported, 1)} %
              </span>`}
        </div>
        <div class="pair">
          <div>
            <div class="big">${f.num(charge, 2)}</div>
            <div class="label" style="margin-top:2px">${t("energy.charged")}</div>
          </div>
          <div>
            <div class="big magenta">${f.num(discharge, 2)}</div>
            <div class="label" style="margin-top:2px">${t("energy.discharged")}</div>
          </div>
        </div>
        <div class="track"><i style="width:100%"></i></div>
        <div class="track out">
          <i style="width:${ratio === null ? 0 : Math.min(ratio, 100)}%"></i>
        </div>
        <div style="margin-top:14px">
          ${loss === null
            ? nothing
            : this.row(t("energy.loss"), `${f.num(loss, 2)} kWh`, loss / (charge || 1) > 0.25 ? "warn" : "")}
          ${ratio === null
            ? nothing
            : this.row(t("energy.returned"), `${f.num(ratio, 1)} %`)}
        </div>
      </div>
    `;
  }

  /**
   * The three efficiency figures side by side. Lifetime and month rarely agree,
   * and the gap is the interesting part: conversion loss is per cycle, standby
   * draw is per hour, so shallow cycling pulls the monthly figure down.
   */
  private efficiencyPanel() {
    const r = this.reader;
    const f = this.fmt;
    const t = this.t;

    const meters: Array<[string, number | null, string]> = [
      [r.label("round_trip_efficiency_total"), r.num("round_trip_efficiency_total"), ""],
      [
        r.label("round_trip_efficiency_monthly"),
        r.num("round_trip_efficiency_monthly"),
        "warn",
      ],
      [r.label("conversion_efficiency"), r.num("conversion_efficiency"), "ok"],
    ];

    const lifetime = r.num("round_trip_efficiency_total");
    const monthly = r.num("round_trip_efficiency_monthly");
    const gap = lifetime !== null && monthly !== null ? lifetime - monthly : null;

    return html`
      <div class="panel">
        <div class="head"><div class="label">${t("energy.efficiency")}</div></div>
        ${meters.map(([label, value, tone]) =>
          value === null
            ? nothing
            : html`
                <div class="meter">
                  <div class="meter-head">
                    <span class="label">${label}</span>
                    <span class="value ${tone}" style="font-size:13px">
                      ${f.num(value, 1)} %
                    </span>
                  </div>
                  <div class="track">
                    <i
                      style="width:${Math.min(Math.max(value, 0), 100)}%;background:var(--mk-${tone || "accent"})"
                    ></i>
                  </div>
                </div>
              `,
        )}
        ${gap === null || Math.abs(gap) < 5
          ? nothing
          : html`<div class="note">
              ${t("energy.gap_hint", { value: f.num(Math.abs(gap), 1) })}
            </div>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-energy": MkViewEnergy;
  }
}
