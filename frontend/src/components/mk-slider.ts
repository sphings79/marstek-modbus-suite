import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles } from "../styles";

/**
 * A number you can set, with its range taken from the entity rather than
 * assumed. A Venus A tops out at 1500 W and a Venus D at 2500 W; reading the
 * bounds means the control is right on both without knowing which is attached.
 *
 * While dragging, the slider shows where the thumb is. On release it sends the
 * value and marks itself pending until the device confirms it — a battery that
 * refuses a write should not leave a control claiming it succeeded.
 */
@customElement("mk-slider")
export class MkSlider extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: String }) unit = "";
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) formatNumber: (v: number | null) => string = (v) =>
    v === null ? "—" : String(v);
  /** Called with the new value once the user lets go. */
  @property({ attribute: false }) onCommit?: (value: number) => void;

  /** Position while dragging, before anything is sent. */
  @state() private dragging: number | null = null;
  /** Value sent and not yet seen coming back. */
  @state() private pending: number | null = null;

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }
      .row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 7px;
      }
      .val {
        font-family: var(--mk-mono);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        font-size: 17px;
      }
      .val .unit {
        font-size: 10px;
        color: var(--mk-dim);
        margin-left: 3px;
        font-weight: 400;
      }
      .val.pending {
        color: var(--mk-warn);
      }
      input[type="range"] {
        appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: var(--mk-track);
        outline: none;
        margin: 0;
      }
      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--mk-accent);
        border: 2px solid var(--mk-surface);
        cursor: pointer;
      }
      input[type="range"]::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--mk-accent);
        border: 2px solid var(--mk-surface);
        cursor: pointer;
        border-width: 2px;
      }
      input[type="range"]:disabled {
        opacity: 0.4;
      }
      input[type="range"]:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 3px;
      }
      .ends {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    `,
  ];

  protected willUpdate(changed: Map<string, unknown>): void {
    // The device answered: stop showing the value as pending.
    if (changed.has("value") && this.pending !== null && this.value === this.pending) {
      this.pending = null;
    }
  }

  private get shown(): number | null {
    return this.dragging ?? this.pending ?? this.value;
  }

  render() {
    const shown = this.shown;
    return html`
      <div class="row">
        <span class="label">${this.label}</span>
        <span class="val ${this.pending !== null ? "pending" : ""}">
          ${this.formatNumber(shown)}${this.unit
            ? html`<span class="unit">${this.unit}</span>`
            : nothing}
        </span>
      </div>
      <input
        type="range"
        .min=${String(this.min)}
        .max=${String(this.max)}
        .step=${String(this.step)}
        .value=${String(shown ?? this.min)}
        ?disabled=${this.disabled || this.value === null}
        aria-label=${this.label}
        @input=${(e: Event) => (this.dragging = Number((e.target as HTMLInputElement).value))}
        @change=${(e: Event) => this.commit(Number((e.target as HTMLInputElement).value))}
      />
      <div class="ends">
        <span class="label">${this.formatNumber(this.min)}</span>
        <span class="label">${this.formatNumber(this.max)}</span>
      </div>
    `;
  }

  private commit(value: number) {
    this.dragging = null;
    if (value === this.value) return;
    this.pending = value;
    this.onCommit?.(value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-slider": MkSlider;
  }
}
