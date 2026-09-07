import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../styles";

export interface PackFill {
  index: number;
  /** State of charge in percent. */
  soc: number | null;
  /** Energy in the pack, already worked out by the caller. */
  energy: number | null;
  /** Second line under the column, e.g. the cell voltage range. */
  note?: string;
}

/**
 * State of charge per pack as columns on a shared 0-100 scale.
 *
 * Columns rather than numbers because the question this answers is whether the
 * packs agree with each other, and a row of equal heights answers it at a
 * glance. The floor line marks where discharging stops.
 */
@customElement("mk-pack-bars")
export class MkPackBars extends LitElement {
  @property({ attribute: false }) packs: PackFill[] = [];
  @property({ type: Number }) floor: number | null = null;
  @property({ type: String }) packLabel = "PACK";
  @property({ attribute: false }) formatNumber: (v: number | null, d?: number) => string =
    (v) => (v === null ? "—" : String(v));

  /** Percentage points away from the group before a pack is called out. */
  @property({ type: Number }) tolerance = 5;

  static styles = [
    baseStyles,
    css`
      .rack {
        display: grid;
        gap: 14px;
        align-items: end;
        padding-top: 6px;
      }
      .soc {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 19px;
        text-align: center;
        margin-bottom: 7px;
      }
      .soc .pct {
        font-size: 10px;
        color: var(--mk-dim);
        margin-left: 2px;
      }
      .column {
        position: relative;
        height: 186px;
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
      }
      .column.flagged {
        border-color: var(--mk-warn);
      }
      .fill {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 7px;
        background: linear-gradient(180deg, var(--mk-accent), var(--mk-accent-deep));
      }
      .fill.flagged {
        background: linear-gradient(180deg, var(--mk-warn), #a86a06);
      }
      .fill span {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 12px;
        color: var(--mk-on-accent);
      }
      .floor {
        position: absolute;
        left: -1px;
        right: -1px;
        /* Above the fill, or it disappears the moment a pack is charged past
           the floor - which is most of the time. */
        z-index: 1;
        border-top: 2px dashed var(--mk-magenta);
      }
      .floor::after {
        content: "";
        position: absolute;
        right: 0;
        top: -3px;
        border: 3px solid transparent;
        border-right-color: var(--mk-magenta);
      }
      .name {
        font-family: var(--mk-mono);
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        margin-top: 8px;
      }
      .note {
        text-align: center;
        margin-top: 3px;
      }
    `,
  ];

  render() {
    if (!this.packs.length) return nothing;

    // A pack is flagged against the median rather than the mean, so one
    // outlier does not drag the reference towards itself and hide the fact.
    const values = this.packs
      .map((p) => p.soc)
      .filter((v): v is number => v !== null)
      .sort((a, b) => a - b);
    const median = values.length
      ? values[Math.floor(values.length / 2)]
      : null;

    return html`
      <div
        class="rack"
        style="grid-template-columns: repeat(${this.packs.length}, 1fr)"
      >
        ${this.packs.map((pack) => {
          const flagged =
            median !== null &&
            pack.soc !== null &&
            Math.abs(pack.soc - median) > this.tolerance;
          const height = pack.soc === null ? 0 : Math.min(Math.max(pack.soc, 0), 100);

          return html`
            <div>
              <div class="soc ${flagged ? "warn" : ""}">
                ${this.formatNumber(pack.soc, 1)}<span class="pct">%</span>
              </div>
              <div class="column ${flagged ? "flagged" : ""}">
                <div class="fill ${flagged ? "flagged" : ""}" style="height:${height}%">
                  ${pack.energy === null
                    ? nothing
                    : html`<span>${this.formatNumber(pack.energy, 2)}</span>`}
                </div>
                ${this.floor === null
                  ? nothing
                  : html`<div class="floor" style="bottom:${this.floor}%"></div>`}
              </div>
              <div class="name ${flagged ? "warn" : ""}">
                ${this.packLabel} ${pack.index}
              </div>
              ${pack.note
                ? html`<div class="label note">${pack.note}</div>`
                : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-pack-bars": MkPackBars;
  }
}
