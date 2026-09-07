import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../styles";
import "./mk-toggle";

export interface ScheduleRow {
  index: number;
  enabled: boolean | null;
  /** Start and end as the register holds them: HHMM, so 830 is 08:30. */
  start: number | null;
  end: number | null;
  /** Power for the window, signed. Range comes from the entity. */
  power: number | null;
  powerMin: number;
  powerMax: number;
  powerStep: number;
  days: string | null;
  dayOptions: string[];
}

export interface ScheduleLabels {
  window: string;
  power: string;
  days: string;
  active: string;
  unset: string;
}

/**
 * The six schedule slots, editable.
 *
 * Times live in the registers as HHMM rather than minutes past midnight - 830
 * is half past eight, not fourteen hours - so they are converted here and only
 * here. The power range is read from the entity, which is what makes the same
 * editor correct on a 1500 W Venus A and a 2500 W Venus D.
 *
 * The day picker offers one day at a time. The register is a bit mask that
 * could hold several, but the integration exposes it as a single choice; this
 * card does not pretend otherwise.
 */
@customElement("mk-schedule")
export class MkSchedule extends LitElement {
  @property({ attribute: false }) rows: ScheduleRow[] = [];
  @property({ attribute: false }) labels!: ScheduleLabels;
  @property({ attribute: false }) dayLabel: (day: string) => string = (d) => d;
  @property({ attribute: false }) formatNumber: (v: number | null) => string = (v) =>
    v === null ? "—" : String(v);

  @property({ attribute: false }) onEnable?: (index: number, on: boolean) => void;
  @property({ attribute: false }) onTime?: (
    index: number,
    which: "start" | "end",
    hhmm: number,
  ) => void;
  @property({ attribute: false }) onPower?: (index: number, watts: number) => void;
  @property({ attribute: false }) onDays?: (index: number, day: string) => void;

  static styles = [
    baseStyles,
    css`
      /* The editor needs its width - a time field cannot usefully shrink -
         so it scrolls inside the card rather than pushing the page. */
      .scroll {
        overflow-x: auto;
      }
      .inner {
        min-width: 560px;
      }
      .head-row,
      .row {
        display: grid;
        grid-template-columns: 60px 52px 200px 1fr 128px;
        align-items: center;
        gap: 12px;
      }
      .head-row {
        padding-bottom: 8px;
        border-bottom: 1px solid var(--mk-line);
        margin-bottom: 4px;
      }
      .row {
        padding: 10px 0;
        border-bottom: 1px solid var(--mk-line-soft);
      }
      .row:last-of-type {
        border-bottom: 0;
      }
      .row.off {
        opacity: 0.55;
      }
      .name {
        font-family: var(--mk-mono);
        font-size: 11.5px;
        font-weight: 600;
      }
      .times {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .dash {
        color: var(--mk-dim);
      }
      input[type="time"],
      input[type="number"],
      select {
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        padding: 5px 6px;
        min-width: 0;
      }
      input[type="time"] {
        /* Wide enough for "05:45" plus the picker indicator Chromium adds
           inside the field; anything tighter clips the last digit. */
        width: 92px;
      }
      input[type="number"] {
        width: 78px;
        text-align: right;
      }
      select {
        width: 100%;
      }
      input:focus-visible,
      select:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 1px;
      }
      input:disabled,
      select:disabled {
        opacity: 0.45;
      }
      .power {
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .unit {
        font-family: var(--mk-mono);
        font-size: 10px;
        color: var(--mk-dim);
      }
      mk-toggle {
        border-bottom: 0;
        padding: 0;
      }
    `,
  ];

  /** 830 -> "08:30"; null and out-of-range values render empty. */
  private toClock(hhmm: number | null): string {
    if (hhmm === null || hhmm < 0 || hhmm > 2359) return "";
    const h = Math.floor(hhmm / 100);
    const m = hhmm % 100;
    if (h > 23 || m > 59) return "";
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  /** "08:30" -> 830. */
  private fromClock(text: string): number | null {
    const m = /^(\d{1,2}):(\d{2})$/.exec(text);
    if (!m) return null;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  render() {
    if (!this.rows.length) return nothing;
    const l = this.labels;

    return html`
      <div class="scroll">
      <div class="inner">
      <div class="head-row">
        <span class="label"></span>
        <span class="label">${l.active}</span>
        <span class="label">${l.window}</span>
        <span class="label">${l.power}</span>
        <span class="label">${l.days}</span>
      </div>

      ${this.rows.map((row) => {
        const off = row.enabled !== true;
        return html`
          <div class="row ${off ? "off" : ""}">
            <span class="name">${row.index}</span>

            <mk-toggle
              bare
              .checked=${row.enabled}
              label=${`${l.active} ${row.index}`}
              .onToggle=${(on: boolean) => this.onEnable?.(row.index, on)}
            ></mk-toggle>

            <div class="times">
              <input
                type="time"
                .value=${this.toClock(row.start)}
                aria-label=${`${l.window} ${row.index}`}
                @change=${(e: Event) => this.time(row.index, "start", e)}
              />
              <span class="dash">–</span>
              <input
                type="time"
                .value=${this.toClock(row.end)}
                aria-label=${`${l.window} ${row.index}`}
                @change=${(e: Event) => this.time(row.index, "end", e)}
              />
            </div>

            <div class="power">
              <input
                type="number"
                .value=${row.power === null ? "" : String(row.power)}
                min=${row.powerMin}
                max=${row.powerMax}
                step=${row.powerStep}
                aria-label=${`${l.power} ${row.index}`}
                @change=${(e: Event) => this.power(row.index, e)}
              />
              <span class="unit">W</span>
            </div>

            <select
              aria-label=${`${l.days} ${row.index}`}
              @change=${(e: Event) =>
                this.onDays?.(row.index, (e.target as HTMLSelectElement).value)}
            >
              ${row.days === null
                ? html`<option value="" selected>${l.unset}</option>`
                : nothing}
              ${row.dayOptions.map(
                (d) => html`
                  <option value=${d} ?selected=${row.days === d}>
                    ${this.dayLabel(d)}
                  </option>
                `,
              )}
            </select>
          </div>
        `;
      })}
      </div>
      </div>
    `;
  }

  private time(index: number, which: "start" | "end", event: Event) {
    const hhmm = this.fromClock((event.target as HTMLInputElement).value);
    if (hhmm !== null) this.onTime?.(index, which, hhmm);
  }

  private power(index: number, event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(value)) this.onPower?.(index, value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-schedule": MkSchedule;
  }
}
