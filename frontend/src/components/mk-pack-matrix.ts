import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "../define";
import { baseStyles } from "../styles";
import { axisTicks, axisWindow } from "../pack-axis";
import { cellDeltaFlag } from "../thresholds";

export interface PackRange {
  index: number;
  min: number;
  max: number;
  /** Free text shown on the right, e.g. cycles and MOSFET temperature. */
  note?: string;
}

/**
 * Every pack's cell range on one shared voltage axis.
 *
 * A device reports a delta per pack but never one for the whole stack, so a
 * pack sitting at a different level than its neighbours is invisible in the
 * numbers. Here it is the one bar that has drifted sideways. A narrow bar is a
 * healthy pack; a wide one is internal drift.
 *
 * The axis is fixed, not fitted to the data (see `pack-axis.ts`): 3.0 - 3.7 V
 * with a tick every 0.1 V, widened in whole 0.1 V steps only when a reading
 * falls outside. A fitted axis rescales on every refresh and hides exactly the
 * sideways drift this card exists to show.
 */
@customElement("mk-pack-matrix")
export class MkPackMatrix extends LitElement {
  @property({ attribute: false }) ranges: PackRange[] = [];
  @property({ type: String }) packLabel = "PACK";
  @property({ attribute: false }) formatVolts: (v: number) => string = (v) =>
    v.toFixed(3);
  /** Axis labels: round values, so one decimal is enough. */
  @property({ attribute: false }) formatTick: (v: number) => string = (v) =>
    v.toFixed(1);

  static styles = [
    baseStyles,
    css`
      .axis {
        display: grid;
        grid-template-columns: 104px 1fr 172px;
        margin-bottom: 2px;
      }
      .ticks {
        position: relative;
        height: 15px;
        border-bottom: 1px solid var(--mk-line);
      }
      .ticks > span {
        position: absolute;
        font-family: var(--mk-mono);
        font-size: 9.5px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--mk-dim);
      }
      .ticks > span.first {
        transform: none;
      }
      .ticks > span {
        transform: translateX(-50%);
        letter-spacing: 0.04em;
        white-space: nowrap;
      }
      .ticks > span.last {
        transform: translateX(-100%);
      }
      /* Faint lines at the labelled values, so a bar's position can be read
         against the same grid on every refresh. */
      .gl {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        display: block;
        background: var(--mk-line-soft);
      }
      /* Medium widths: label every second tick (the grid lines stay). */
      @media (max-width: 960px) {
        .ticks > span.alt {
          display: none;
        }
      }
      .row {
        display: grid;
        grid-template-columns: 104px 1fr 172px;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--mk-line-soft);
      }
      .row:last-of-type {
        border-bottom: 0;
      }
      .rail {
        position: relative;
        height: 17px;
        background: var(--mk-inset);
      }
      .bar {
        position: absolute;
        top: 2px;
        bottom: 2px;
        display: block;
        background: var(--mk-ok);
        min-width: 2px;
      }
      .bar.warn {
        background: var(--mk-warn);
      }
      .bar.crit {
        background: var(--mk-crit);
      }
      .mid {
        position: absolute;
        top: -2px;
        bottom: -2px;
        width: 1px;
        display: block;
        background: var(--mk-fg);
      }
      .name {
        font-family: var(--mk-mono);
        font-size: 12.5px;
        font-weight: 600;
      }
      .right {
        text-align: right;
      }
      .delta {
        font-family: var(--mk-mono);
        font-size: 12.5px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .note {
        margin: 0 0 0 10px;
        display: inline;
      }
      /* The shared axis is the point of this card, and on a phone it is two
         centimetres wide - every pack lands on the same pixel. Below that
         width the range is written out instead. */
      /* Only one of the two copies is ever visible; which one depends on
         whether the row still has a bar to sit beside. */
      .span {
        display: none;
        font-family: var(--mk-mono);
        font-size: 11.5px;
        font-variant-numeric: tabular-nums;
        color: var(--mk-fg-2);
      }
      @media (max-width: 640px) {
        .axis,
        .rail {
          display: none;
        }
        .row {
          grid-template-columns: 1fr auto;
          row-gap: 3px;
          padding: 9px 0;
        }
        .span {
          display: block;
          grid-column: 1 / -1;
        }
        .note {
          margin-left: 8px;
        }
        .note.wide {
          display: none;
        }
      }
    `,
  ];

  /** Fixed 3.0 - 3.7 V window, widened in whole 0.1 V steps if needed. */
  private get bounds(): { lo: number; hi: number } {
    return axisWindow(this.ranges.flatMap((r) => [r.min, r.max]));
  }

  /** Position on the axis in percent, clamped to the window. */
  private pct(value: number): number {
    const { lo, hi } = this.bounds;
    const span = hi - lo || 1;
    return Math.min(100, Math.max(0, ((value - lo) / span) * 100));
  }

  render() {
    if (!this.ranges.length) return nothing;

    const { lo, hi } = this.bounds;
    const values = axisTicks({ lo, hi });
    const ticks = values.map((value, i) => ({
      at: ((value - lo) / (hi - lo)) * 100,
      value,
      cls: [
        i === 0 && value === lo ? "first" : "",
        i === values.length - 1 && value === hi ? "last" : "",
        i % 2 ? "alt" : "",
      ]
        .filter(Boolean)
        .join(" "),
    }));

    return html`
      <div class="axis">
        <div></div>
        <div class="ticks">
          ${ticks.map(
            (t) =>
              html`<span class=${t.cls} style="left:${t.at}%"
                >${this.formatTick(t.value)}</span
              >`,
          )}
        </div>
        <div class="right"><span class="label">Δ</span></div>
      </div>

      ${this.ranges.map((range) => {
        const delta = range.max - range.min;
        const tone = cellDeltaFlag(delta);
        const width = Math.max(this.pct(range.max) - this.pct(range.min), 0.6);
        const left = Math.min(this.pct(range.min), 100 - width);
        const mid = this.pct((range.min + range.max) / 2);

        return html`
          <div class="row">
            <div><span class="name ${tone}">${this.packLabel} ${range.index}</span></div>
            <div class="rail">
              ${ticks.map((t) => html`<i class="gl" style="left:${t.at}%"></i>`)}
              <i class="bar ${tone}" style="left:${left}%;width:${width}%"></i>
              <i class="mid" style="left:${mid}%"></i>
            </div>
            <div class="right">
              <span class="delta ${tone}">${Math.round(delta * 1000)} mV</span>
              ${range.note
                ? html`<span class="label note wide">${range.note}</span>`
                : nothing}
            </div>
            <div class="span">
              ${this.formatVolts(range.min)} – ${this.formatVolts(range.max)} V
              ${range.note
                ? html`<span class="label note">${range.note}</span>`
                : nothing}
            </div>
          </div>
        `;
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-pack-matrix": MkPackMatrix;
  }
}
