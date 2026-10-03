import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "../define";
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
  /** Days set in the slot, Monday first; null while the mask is unknown. */
  days: string[] | null;
}

export interface ScheduleLabels {
  window: string;
  power: string;
  days: string;
  active: string;
}

/** Monday first, the order the day mask attribute uses. */
const WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * The six schedule slots, editable.
 *
 * Times live in the registers as HHMM rather than minutes past midnight - 830
 * is half past eight, not fourteen hours - so they are converted here and only
 * here. The power range is read from the entity, which is what makes the same
 * editor correct on a 1450 W Venus A and a 2500 W Venus D.
 *
 * The days are a bit mask on the device, so each day is its own chip and any
 * combination - including none, which leaves the slot unused - can be set.
 */
@customElement("mk-schedule")
export class MkSchedule extends LitElement {
  @property({ attribute: false }) rows: ScheduleRow[] = [];
  @property({ attribute: false }) labels!: ScheduleLabels;
  @property({ attribute: false }) dayLabel: (day: string) => string = (d) => d;
  @property({ attribute: false }) formatNumber: (v: number | null) => string = (v) =>
    v === null ? "—" : String(v);

  /** Resolves to false when the device side refused the change. */
  @property({ attribute: false }) onEnable?: (index: number, on: boolean) => unknown;
  /** Start and end together, so the slot is never checked half-edited. */
  @property({ attribute: false }) onWindow?: (
    index: number,
    start: number,
    end: number,
  ) => void;
  @property({ attribute: false }) onPower?: (index: number, watts: number) => void;
  @property({ attribute: false }) onDays?: (index: number, days: string[]) => void;

  static styles = [
    baseStyles,
    css`
      /* The editor needs its width - a time field cannot usefully shrink -
         so it scrolls inside the card rather than pushing the page. */
      .scroll {
        overflow-x: auto;
      }
      .inner {
        min-width: 660px;
      }
      .head-row,
      .row {
        display: grid;
        grid-template-columns: 60px 52px 200px 1fr 232px;
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
      input[type="number"] {
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
      .days {
        display: flex;
        gap: 3px;
      }
      .day {
        flex: 1;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        color: var(--mk-dim);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        padding: 5px 0;
        cursor: pointer;
      }
      .day.on {
        color: var(--mk-bg);
        background: var(--mk-accent);
        border-color: var(--mk-accent);
      }
      .day:disabled {
        opacity: 0.45;
        cursor: default;
      }
      input:focus-visible,
      .day:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 1px;
      }
      input:disabled {
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
                @change=${(e: Event) => this.time(row, "start", e)}
              />
              <span class="dash">–</span>
              <input
                type="time"
                .value=${this.toClock(row.end)}
                aria-label=${`${l.window} ${row.index}`}
                @change=${(e: Event) => this.time(row, "end", e)}
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

            <div class="days" role="group" aria-label=${`${l.days} ${row.index}`}>
              ${WEEK.map((d) => {
                const on = row.days?.includes(d) ?? false;
                return html`
                  <button
                    class="day ${on ? "on" : ""}"
                    aria-pressed=${on ? "true" : "false"}
                    ?disabled=${row.days === null}
                    @click=${() => this.toggleDay(row, d)}
                  >
                    ${this.dayLabel(d)}
                  </button>
                `;
              })}
            </div>
          </div>
        `;
      })}
      </div>
      </div>
    `;
  }

  private toggleDay(row: ScheduleRow, day: string) {
    if (row.days === null) return;
    const next = row.days.includes(day)
      ? row.days.filter((d) => d !== day)
      : [...row.days, day];
    this.onDays?.(
      row.index,
      WEEK.filter((d) => next.includes(d)),
    );
  }

  private time(row: ScheduleRow, which: "start" | "end", event: Event) {
    const input = event.target as HTMLInputElement;
    const hhmm = this.fromClock(input.value);
    const other = which === "start" ? row.end : row.start;
    if (hhmm === null || other === null) return;
    // Show the device's value until it confirms the new one: a refused
    // window must not stay in the field as if it had been taken.
    input.value = this.toClock(row[which]);
    if (which === "start") this.onWindow?.(row.index, hhmm, other);
    else this.onWindow?.(row.index, other, hhmm);
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
