import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../styles";

/**
 * One measurement: a label, a number with its unit, and optionally either a
 * bar showing where the value sits in its range, or a line of context beneath.
 *
 * The bar is only drawn when `max` is set, because a bar without a scale
 * invites the reader to compare things that share no axis.
 */
@customElement("mk-stat")
export class MkStat extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) value = "—";
  @property({ type: String }) unit = "";
  @property({ type: String }) foot = "";

  /** Severity, applied to the number and the bar alike. */
  @property({ type: String }) tone: "" | "ok" | "warn" | "crit" | "magenta" = "";

  @property({ type: Number }) bar: number | null = null;
  @property({ type: Number }) max: number | null = null;

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        background: var(--mk-surface);
        border: 1px solid var(--mk-line);
        padding: 15px 17px;
      }
      .num {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 24px;
        margin-top: 5px;
        letter-spacing: -0.01em;
      }
      .unit {
        font-size: 11px;
        color: var(--mk-dim);
        margin-left: 4px;
        font-weight: 400;
      }
      .track {
        height: 5px;
        background: var(--mk-track);
        margin-top: 9px;
        position: relative;
        overflow: hidden;
      }
      .track > i {
        position: absolute;
        inset: 0 auto 0 0;
        display: block;
        background: var(--mk-accent);
      }
      .foot {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        color: var(--mk-dim);
        margin-top: 7px;
        line-height: 1.6;
      }
      .ok > i,
      :host([tone="ok"]) .track > i {
        background: var(--mk-ok);
      }
      :host([tone="warn"]) .track > i {
        background: var(--mk-warn);
      }
      :host([tone="crit"]) .track > i {
        background: var(--mk-crit);
      }
      :host([tone="magenta"]) .track > i {
        background: var(--mk-magenta);
      }
    `,
  ];

  private get fill(): number | null {
    if (this.bar === null || this.max === null || this.max === 0) return null;
    return Math.min(Math.max((this.bar / this.max) * 100, 0), 100);
  }

  render() {
    const fill = this.fill;
    return html`
      <div class="label">${this.label}</div>
      <div class="num ${this.tone}">
        ${this.value}${this.unit ? html`<span class="unit">${this.unit}</span>` : nothing}
      </div>
      ${fill === null
        ? nothing
        : html`<div class="track"><i style="width:${fill}%"></i></div>`}
      ${this.foot ? html`<div class="foot">${this.foot}</div>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-stat": MkStat;
  }
}
