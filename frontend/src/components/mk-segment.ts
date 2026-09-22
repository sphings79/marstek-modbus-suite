import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles } from "../styles";

export interface SegmentOption {
  value: string;
  label: string;
}

/**
 * A choice laid out as a row of segments rather than a dropdown. With three
 * options there is no reason to hide two of them behind a click, and the
 * current one stays readable at a glance.
 */
@customElement("mk-segment")
export class MkSegment extends LitElement {
  @property({ type: String }) label = "";
  /** Sits between the caption and the bar, so it reads as this one's. */
  @property({ type: String }) hint = "";
  @property({ attribute: false }) options: SegmentOption[] = [];
  @property({ type: String }) value: string | null = null;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) onSelect?: (value: string) => void;

  @state() private pending: string | null = null;

  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }
      .label {
        display: block;
        margin-bottom: 7px;
      }
      .hint {
        display: block;
        font-family: var(--mk-mono);
        font-size: 9.5px;
        color: var(--mk-dim);
        line-height: 1.5;
        margin: -3px 0 7px;
      }
      /* Options that do not fit beside each other drop onto their own row
         instead of pushing the bar - and the whole page with it - out past
         the edge of a phone. The polling choice spells out what pausing does
         to the entities, which is three sentences wide; the mode choice is
         three words and stays on one line where it always was. */
      .bar {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid var(--mk-line);
        background: var(--mk-inset);
        /* Clips each button's separator where it would land on the frame. */
        overflow: hidden;
      }
      button {
        flex: 1 1 auto;
        /* Without this a flex item refuses to shrink below its text. */
        min-width: 0;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 9px 6px;
        color: var(--mk-dim);
        background: none;
        border: 0;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
        overflow-wrap: break-word;
        /* Drawn rather than bordered: a border only ever divides one way, and
           these sit beside each other on a wide panel and above each other on
           a narrow one. */
        box-shadow: 1px 0 0 var(--mk-line), 0 1px 0 var(--mk-line);
      }
      button:hover:not(:disabled) {
        color: var(--mk-fg-2);
        background: var(--mk-surface);
      }
      button[aria-pressed="true"] {
        color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      button.pending[aria-pressed="true"] {
        color: var(--mk-warn);
        background: transparent;
        box-shadow: inset 0 -2px 0 var(--mk-warn), 1px 0 0 var(--mk-line),
          0 1px 0 var(--mk-line);
      }
      button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }
    `,
  ];

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("value") && this.pending !== null && this.value === this.pending) {
      this.pending = null;
    }
  }

  render() {
    const shown = this.pending ?? this.value;
    return html`
      <span class="label">${this.label}</span>
      ${this.hint ? html`<span class="hint">${this.hint}</span>` : nothing}
      <div class="bar" role="group" aria-label=${this.label}>
        ${this.options.map(
          (o) => html`
            <button
              class=${this.pending === o.value ? "pending" : ""}
              aria-pressed=${shown === o.value}
              ?disabled=${this.disabled}
              @click=${() => this.pick(o.value)}
            >
              ${o.label}
            </button>
          `,
        )}
      </div>
    `;
  }

  private pick(value: string) {
    if (value === this.value) return;
    this.pending = value;
    this.onSelect?.(value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-segment": MkSegment;
  }
}
