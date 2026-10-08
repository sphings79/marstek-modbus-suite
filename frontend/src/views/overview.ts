import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "../define";
import { baseStyles } from "../styles";
import type { DeviceReader } from "../entities";
import { INTERNAL_MOS1_TEMP_KEYS, INTERNAL_TEMP_KEYS, MODEL_KEYS } from "../entities";
import type { Formatter } from "../format";
import type { Translate } from "./view-base";

/** Below this many watts a flow is noise rather than a direction. */
const IDLE_W = 30;

/** Words that should read zero on a healthy battery. */
const FAULT_KEYS = ["alarm_status", "fault_status", "fault_status_low", "fault_status_2_low", "mppt_error"];

const TEMP_KEYS = ["max_cell_temperature", ...INTERNAL_TEMP_KEYS, ...INTERNAL_MOS1_TEMP_KEYS];

type Status = "ok" | "warn" | "crit" | "offline";

/** What one tile says about its battery, worked out once per render. */
interface Tile {
  reader: DeviceReader;
  status: Status;
}

/**
 * Several batteries side by side, read only.
 *
 * One tile per battery the user chose, in a grid that follows how many there
 * are: two sit next to each other, three and four make two by two (the fourth
 * cell stays empty with three, so every tile has the same width). On a narrow screen they stack. A tile carries
 * what a glance needs and opens the full view of its battery when pressed;
 * nothing here writes to a register, because a slider on a tile that small is
 * as easy to knock as to use.
 */
@customElement("mk-view-overview")
export class MkViewOverview extends LitElement {
  @property({ attribute: false }) readers: DeviceReader[] = [];
  @property({ attribute: false }) fmt!: Formatter;
  @property({ attribute: false }) t!: Translate;
  @property({ attribute: false }) onOpen!: (deviceId: string) => void;

  static styles = [
    baseStyles,
    css`
      .cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--mk-gap);
      }
      .cards.n1 {
        grid-template-columns: minmax(0, 1fr);
      }
      @media (max-width: 700px) {
        .cards {
          grid-template-columns: minmax(0, 1fr);
        }
      }

      button.card {
        display: block;
        width: 100%;
        text-align: left;
        font: inherit;
        color: inherit;
        cursor: pointer;
      }
      button.card:hover {
        border-color: var(--mk-fg-2);
      }
      button.card:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }

      .top {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 12px;
      }
      .name {
        flex: 1 1 auto;
        min-width: 0;
        font-family: var(--mk-mono);
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.04em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .model {
        font-family: var(--mk-mono);
        font-size: 10px;
        color: var(--mk-dim);
        letter-spacing: 0.08em;
      }
      .dot {
        flex: none;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--mk-dim);
        align-self: center;
      }
      .dot.ok {
        background: var(--mk-ok);
      }
      .dot.warn {
        background: var(--mk-warn);
      }
      .dot.crit {
        background: var(--mk-crit);
      }

      .soc {
        display: flex;
        align-items: baseline;
        gap: 6px;
        font-family: var(--mk-mono);
        font-size: 34px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .soc .pct {
        font-size: 14px;
        color: var(--mk-dim);
        font-weight: 400;
      }
      .soc .flow {
        margin-left: auto;
        font-size: 20px;
      }
      .soc .flow.rest {
        color: var(--mk-dim);
      }
      .track {
        height: 5px;
        margin: 8px 0 12px;
        background: var(--mk-track);
      }
      .track i {
        display: block;
        height: 100%;
        background: var(--mk-accent);
      }
      .state {
        margin-bottom: 8px;
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg-2);
      }
    `,
  ];

  render() {
    const readers = this.readers;
    if (!readers.length) {
      return html`<div class="panel"><div class="note">${this.t("overview.empty")}</div></div>`;
    }
    return html`
      <div class="cards n${readers.length}">
        ${readers.map((reader) => this.card({ reader, status: this.statusOf(reader) }))}
      </div>
    `;
  }

  /**
   * Fault, warning, or neither - and whether the link is down at all, which
   * outranks both: with the link gone the readings are the last ones seen.
   */
  private statusOf(r: DeviceReader): Status {
    const health = r.rawState("modbus_connection")?.attributes.health;
    if (health === "offline") return "offline";

    for (const key of FAULT_KEYS) {
      const code = r.code(key);
      if (!code) continue;
      // Bit 0 of the Venus E v3 alarm word is "waiting for the grid release":
      // a hint, not a fault, and the rest of the word still counts.
      const fault = key === "alarm_status" && !r.isLegacyE() ? code - (code % 2) : code;
      if (fault) return "crit";
    }
    if (r.code("mppt_warning") || r.isOn("bms_lock_active") || health === "degraded") {
      return "warn";
    }
    return "ok";
  }

  private card(tile: Tile) {
    const { reader: r, status } = tile;
    const f = this.fmt;
    const t = this.t;

    const soc = r.num("battery_soc");
    const power = r.num("battery_power");
    const flowing = power !== null && Math.abs(power) > IDLE_W;
    const discharging = flowing && (power as number) < 0;
    const model = r.firstKey(MODEL_KEYS);
    const state = status === "offline" ? t("overview.status.offline") : r.inverterState(t);
    const pv = r.sum(["mppt1_power", "mppt2_power", "mppt3_power", "mppt4_power"]);
    const temps = TEMP_KEYS.map((key) => r.num(key)).filter((v): v is number => v !== null);
    const tempUnit = r.unit(r.firstKey(TEMP_KEYS) ?? "") || "°C";

    return html`
      <button
        class="panel card"
        title=${t("overview.open")}
        @click=${() => this.onOpen(r.deviceId)}
      >
        <div class="top">
          <span class="name">${r.name}</span>
          ${model && r.str(model) ? html`<span class="model">${r.str(model)}</span>` : nothing}
          <i class="dot ${status}" title=${t(`overview.status.${status}`)}></i>
        </div>

        <div class="soc">
          ${f.num(soc, 0)}<span class="pct">%</span>
          <span
            class="flow ${flowing ? "" : "rest"}"
            style=${flowing ? `color: var(${discharging ? "--mk-magenta" : "--mk-accent"})` : ""}
          >
            ${flowing ? (discharging ? "▼" : "▲") : "•"}
            ${f.num(power === null ? null : Math.abs(power), 0)} W
          </span>
        </div>
        <div class="track"><i style="width:${soc === null ? 0 : Math.min(100, Math.max(0, soc))}%"></i></div>

        ${state ? html`<div class="state">${state}</div>` : nothing}
        ${this.row(r.label("ac_power"), r.num("ac_power"), 0, "W")}
        ${pv === null ? nothing : this.row(t("core.mppt_total"), pv, 0, "W")}
        ${temps.length
          ? this.row(t("overview.temp_max"), Math.max(...temps), 1, tempUnit)
          : nothing}
      </button>
    `;
  }

  private row(label: string, value: number | null, digits: number, unit: string) {
    if (value === null) return nothing;
    return html`
      <div class="kv">
        <span>${label}</span>
        <b>${this.fmt.num(value, digits)} ${unit}</b>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-overview": MkViewOverview;
  }
}
