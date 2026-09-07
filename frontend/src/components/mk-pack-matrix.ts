import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../styles";
import { cellDeltaFlag } from "../thresholds";

export interface PackRange {
  index: number;
  min: number;
  max: number;
  /** Free text shown on the right, e.g. cycles and MOSFET temperature. */
  note?: string;
}

/** Delta in volts above which a pack is called out. */

/**
 * Every pack's cell range on one shared voltage axis.
 *
 * A device reports a delta per pack but never one for the whole stack, so a
 * pack sitting at a different level than its neighbours is invisible in the
 * numbers. Here it is the one bar that has drifted sideways. A narrow bar is a
 * healthy pack; a wide one is internal drift.
 */
@customElement("mk-pack-matrix")
export class MkPackMatrix extends LitElement {
  @property({ attribute: false }) ranges: PackRange[] = [];
  @property({ type: String }) packLabel = "PACK";
  @property({ attribute: false }) formatVolts: (v: number) => string = (v) =>
    v.toFixed(3);

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

  /** Axis bounds, padded so no bar touches an edge. */
  private get bounds(): { lo: number; hi: number } {
    const values = this.ranges.flatMap((r) => [r.min, r.max]);
    if (!values.length) return { lo: 3.2, hi: 3.4 };
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const pad = Math.max((hi - lo) * 0.15, 0.005);
    return { lo: lo - pad, hi: hi + pad };
  }

  private pct(value: number): number {
    const { lo, hi } = this.bounds;
    const span = hi - lo || 1;
    return ((value - lo) / span) * 100;
  }

  render() {
    if (!this.ranges.length) return nothing;

    const { lo, hi } = this.bounds;
    const ticks = [0, 0.25, 0.5, 0.75].map((f) => ({
      at: f * 100,
      value: lo + (hi - lo) * f,
    }));

    return html`
      <div class="axis">
        <div></div>
        <div class="ticks">
          ${ticks.map(
            (t) =>
              html`<span style="left:${t.at}%">${this.formatVolts(t.value)}</span>`,
          )}
        </div>
        <div class="right"><span class="label">Δ</span></div>
      </div>

      ${this.ranges.map((range) => {
        const delta = range.max - range.min;
        const tone = cellDeltaFlag(delta);
        const left = this.pct(range.min);
        const width = Math.max(this.pct(range.max) - left, 0.6);
        const mid = this.pct((range.min + range.max) / 2);

        return html`
          <div class="row">
            <div><span class="name ${tone}">${this.packLabel} ${range.index}</span></div>
            <div class="rail">
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
