import { LitElement, html, svg, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../styles";

const OUTER_R = 118;
const INNER_R = 97;
const OUTER_C = 2 * Math.PI * OUTER_R;
const INNER_C = 2 * Math.PI * INNER_R;

/**
 * The state of charge as two rings.
 *
 * The outer ring is what the BMS reports. The inner one is the usable figure,
 * which stops short of the discharge floor — so the gap between the two rings
 * *is* the reserve, shown rather than described.
 */
@customElement("mk-gauge")
export class MkGauge extends LitElement {
  /** Raw state of charge, 0-100. Null renders an empty ring. */
  @property({ type: Number }) soc: number | null = null;

  /** Usable state of charge, 0-100. Omit to draw only the outer ring. */
  @property({ type: Number }) usable: number | null = null;

  @property({ type: String }) caption = "";
  @property({ type: String }) sub = "";

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }
      svg {
        width: 100%;
        max-width: 320px;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      .track {
        fill: none;
        stroke: var(--mk-track);
      }
      .arc-outer {
        fill: none;
        stroke: url(#mk-ring);
        stroke-linecap: butt;
      }
      .arc-inner {
        fill: none;
        stroke: var(--mk-magenta);
      }
      text {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
      }
      .num {
        fill: var(--mk-fg);
        font-size: 66px;
        font-weight: 600;
      }
      .pct {
        fill: var(--mk-dim);
        font-size: 21px;
      }
      .cap {
        fill: var(--mk-dim);
        font-size: 11px;
        letter-spacing: 3.5px;
      }
      .sub {
        fill: var(--mk-magenta);
        font-size: 14px;
      }
    `,
  ];

  private arc(value: number | null, circumference: number): string {
    const pct = value === null ? 0 : Math.min(Math.max(value, 0), 100);
    return `${(circumference * pct) / 100} ${circumference}`;
  }

  render() {
    const shown = this.soc === null ? "—" : Math.round(this.soc).toString();

    return html`
      <svg
        viewBox="0 0 300 268"
        role="img"
        aria-label=${this.soc === null
          ? this.caption
          : `${this.caption} ${Math.round(this.soc)} %`}
      >
        <defs>
          <linearGradient id="mk-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--mk-accent)" />
            <stop offset="100%" stop-color="var(--mk-accent-deep)" />
          </linearGradient>
        </defs>

        <circle class="track" cx="150" cy="134" r=${OUTER_R} stroke-width="15" />
        <circle
          class="arc-outer"
          cx="150"
          cy="134"
          r=${OUTER_R}
          stroke-width="15"
          stroke-dasharray=${this.arc(this.soc, OUTER_C)}
          transform="rotate(-90 150 134)"
        />

        ${this.usable === null
          ? nothing
          : svg`
              <circle class="track" cx="150" cy="134" r=${INNER_R} stroke-width="5" />
              <circle
                class="arc-inner"
                cx="150" cy="134" r=${INNER_R} stroke-width="5"
                stroke-dasharray=${this.arc(this.usable, INNER_C)}
                transform="rotate(-90 150 134)"
              />
            `}

        <text class="num" x="146" y="132" text-anchor="middle">${shown}</text>
        <text class="pct" x="196" y="132" text-anchor="start">%</text>
        <text class="cap" x="150" y="158" text-anchor="middle">${this.caption}</text>
        ${this.sub
          ? svg`<text class="sub" x="150" y="186" text-anchor="middle">${this.sub}</text>`
          : nothing}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-gauge": MkGauge;
  }
}
