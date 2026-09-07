import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../styles";

export interface PackFill {
  index: number;
  /** State of charge in percent. */
  soc: number | null;
  /** Energy in the pack, already worked out by the caller. */
  energy: number | null;
  /** Preformatted state of charge, shown under the energy figure. */
  socLabel?: string;
  /** Second line under the column, e.g. the cell voltage range. */
  note?: string;
}

/**
 * State of charge per pack as columns on a shared 0-100 scale.
 *
 * Columns rather than numbers because the question this answers is whether the
 * packs agree with each other, and a row of equal heights answers it at a
 * glance. The floor line marks where discharging stops.
 *
 * The fill runs from red when empty to green when full. That is redundant with
 * the column height on purpose - nobody has to rely on the colour - and it
 * leaves the outline free to carry something else: a pack that has drifted
 * away from the group.
 */
@customElement("mk-pack-bars")
export class MkPackBars extends LitElement {
  @property({ attribute: false }) packs: PackFill[] = [];
  @property({ type: Number }) floor: number | null = null;
  /** Lower limit the backup socket reaches, below the discharge floor. */
  @property({ type: Number }) backupFloor: number | null = null;
  @property({ type: String }) packLabel = "PACK";
  @property({ type: String }) energyUnit = "kWh";
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
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 7px;
        gap: 1px;
      }
      /* Readings sit inside the fill when it is tall enough to hold them, and
         above it when it is not - a nearly empty pack must not push its own
         figures out of the column. */
      .readings {
        position: absolute;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1px;
        pointer-events: none;
      }
      .readings .kwh {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 12px;
      }
      .readings .kwh .unit {
        font-size: 9px;
        font-weight: 400;
        margin-left: 2px;
        opacity: 0.75;
      }
      .readings .pct-line {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-size: 10px;
        opacity: 0.82;
      }
      .readings.inside {
        color: #0a1410;
      }
      .readings.outside {
        color: var(--mk-fg-2);
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
      /* Drawn quieter than the floor: it is the exception, reachable only
         while the off-grid output is running, not where discharging stops. */
      .backup-floor {
        position: absolute;
        left: -1px;
        right: -1px;
        z-index: 1;
        border-top: 1px dotted var(--mk-dim);
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

  /**
   * Fill colour for a state of charge: red when empty, amber halfway, green
   * when full. Interpolated in hue so the steps between packs read as a scale
   * rather than as categories.
   */
  private fill(soc: number | null): string {
    if (soc === null) return "var(--mk-track)";
    const t = Math.min(Math.max(soc, 0), 100) / 100;
    const hue = t < 0.5 ? 4 + 41 * (t / 0.5) : 45 + 95 * ((t - 0.5) / 0.5);
    return `linear-gradient(180deg, hsl(${hue.toFixed(0)} 74% 56%), hsl(${hue.toFixed(0)} 68% 43%))`;
  }

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
                <div class="fill" style="height:${height}%;background:${this.fill(pack.soc)}"></div>
                ${this.floor === null
                  ? nothing
                  : html`<div class="floor" style="bottom:${this.floor}%"></div>`}
                ${this.backupFloor === null
                  ? nothing
                  : html`<div
                      class="backup-floor"
                      style="bottom:${this.backupFloor}%"
                    ></div>`}
                ${pack.energy === null
                  ? nothing
                  : html`
                      <div
                        class="readings ${height >= 26 ? "inside" : "outside"}"
                        style=${height >= 26
                          ? `bottom:${height}%;transform:translateY(100%);padding-top:7px`
                          : `bottom:${height}%;transform:translateY(-4px)`}
                      >
                        <span class="kwh">
                          ${this.formatNumber(pack.energy, 2)}<span class="unit">${this.energyUnit}</span>
                        </span>
                        ${pack.socLabel
                          ? html`<span class="pct-line">${pack.socLabel}</span>`
                          : nothing}
                      </div>
                    `}
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
