import { html, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import "../components/mk-stat";

const CHANNELS = [1, 2, 3, 4];

/** Above this the input is carrying something rather than floating. */
const ACTIVE_W = 1;

@customElement("mk-view-solar")
export class MkViewSolar extends MkView {
  static styles = [
    baseStyles,
    css`
      .channels {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 900px) {
        .channels {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      .below {
        grid-template-columns: 1.6fr 1fr;
        margin-top: var(--mk-gap);
      }
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
      .chan-value {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 32px;
      }
      .chan-unit {
        font-size: 13px;
        color: var(--mk-dim);
        margin-left: 5px;
        font-weight: 400;
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
      .track {
        height: 5px;
        background: var(--mk-track);
        margin-top: 11px;
        position: relative;
        overflow: hidden;
      }
      .track > i {
        position: absolute;
        inset: 0 auto 0 0;
        display: block;
        background: var(--mk-accent);
      }
    `,
  ];

  render() {
    const r = this.reader;
    const f = this.fmt;
    const t = this.t;

    const powers = CHANNELS.map((c) => r.num(`mppt${c}_power`));
    const total = r.sum(CHANNELS.map((c) => `mppt${c}_power`));
    const peak = Math.max(...powers.map((p) => p ?? 0), 1);
    const anyActive = powers.some((p) => p !== null && p > ACTIVE_W);

    if (!CHANNELS.some((c) => r.entityId(`mppt${c}_power`))) {
      return html`<div class="panel"><div class="note">${t("solar.none")}</div></div>`;
    }

    return html`
      <div class="grid channels">
        ${CHANNELS.map((c) => {
          const power = r.num(`mppt${c}_power`);
          const active = power !== null && power > ACTIVE_W;
          return html`
            <div class="panel">
              <div class="head">
                <div class="label">MPPT ${c}</div>
                <span class="pill ${active ? "on" : ""}">
                  ${active ? t("solar.active") : t("solar.floating")}
                </span>
              </div>
              <div class="chan-value">
                ${f.num(power, 0)}<span class="chan-unit">W</span>
              </div>
              <div class="track">
                <i style="width:${power === null ? 0 : (power / peak) * 100}%"></i>
              </div>
              <div style="margin-top:13px">
                ${this.kv(`mppt${c}_voltage`, 1)} ${this.kv(`mppt${c}_current`, 2)}
              </div>
            </div>
          `;
        })}
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head">
            <div class="label">${t("solar.summary")}</div>
            <div class="label">${anyActive ? t("solar.some_active") : t("solar.all_idle")}</div>
          </div>
          <div class="chan-value">
            ${f.num(total, 0)}<span class="chan-unit">W</span>
          </div>
          <div class="note">
            ${anyActive ? t("solar.note_active") : t("solar.note_floating")}
          </div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("solar.diagnostics")}</div></div>
          ${this.kv("mppt_error", 0, {
            tone: r.num("mppt_error") ? "crit" : "ok",
          })}
          ${this.kv("mppt_warning", 0, {
            tone: r.num("mppt_warning") ? "warn" : "ok",
          })}
          ${this.kv("mppt_version", 0)}
          ${total === null
            ? nothing
            : this.row(t("solar.channels_reporting"), `${powers.filter((p) => p !== null).length} / ${CHANNELS.length}`)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-solar": MkViewSolar;
  }
}
