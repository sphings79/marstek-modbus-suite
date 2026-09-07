import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles } from "../styles";

/**
 * An on/off control that stays honest about what the device says.
 *
 * The knob moves when the state actually changes, not on click. Between the
 * two it shows as pending, so a switch the battery refuses does not sit there
 * looking flipped.
 */
@customElement("mk-toggle")
export class MkToggle extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) hint = "";
  /** Keep the caption for screen readers but out of the layout. */
  @property({ type: Boolean }) bare = false;
  /** Null when the entity is missing or unavailable. */
  @property({ type: Boolean }) checked: boolean | null = null;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) onToggle?: (on: boolean) => void;

  @state() private pending: boolean | null = null;

  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 9px 0;
        border-bottom: 1px dashed var(--mk-line-soft);
      }
      :host(:last-of-type),
      :host([bare]) {
        border-bottom: 0;
      }
      :host([bare]) {
        padding: 0;
        gap: 0;
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .name {
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg);
      }
      .hint {
        font-family: var(--mk-mono);
        font-size: 9.5px;
        color: var(--mk-dim);
        margin-top: 2px;
        line-height: 1.5;
      }
      button {
        flex: none;
        width: 42px;
        height: 22px;
        border-radius: 11px;
        border: 1px solid var(--mk-line);
        background: var(--mk-inset);
        position: relative;
        cursor: pointer;
        transition: background 0.18s, border-color 0.18s;
        padding: 0;
      }
      button > i {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--mk-dim);
        display: block;
        transition: transform 0.18s, background 0.18s;
      }
      button[aria-checked="true"] {
        background: var(--mk-accent-wash);
        border-color: var(--mk-accent);
      }
      button[aria-checked="true"] > i {
        transform: translateX(20px);
        background: var(--mk-accent);
      }
      button.pending {
        border-color: var(--mk-warn);
      }
      button.pending > i {
        background: var(--mk-warn);
      }
      button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `,
  ];

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("checked") && this.pending !== null && this.checked === this.pending) {
      this.pending = null;
    }
  }

  render() {
    const shown = this.pending ?? this.checked;
    return html`
      ${this.bare
        ? nothing
        : html`
            <div class="text">
              <div class="name">${this.label}</div>
              ${this.hint ? html`<div class="hint">${this.hint}</div>` : nothing}
            </div>
          `}
      <button
        class=${this.pending !== null ? "pending" : ""}
        role="switch"
        aria-checked=${shown === true}
        aria-label=${this.label}
        ?disabled=${this.disabled || this.checked === null}
        @click=${() => this.flip()}
      >
        <i></i>
      </button>
    `;
  }

  private flip() {
    const next = !(this.pending ?? this.checked);
    this.pending = next;
    this.onToggle?.(next);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-toggle": MkToggle;
  }
}
