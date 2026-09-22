import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { baseStyles } from "../styles";

/**
 * A question asked before something that cannot be taken back.
 *
 * This replaced a pair of buttons that swapped places: the confirmation
 * appeared exactly where the button that opened it had been, so a double
 * click went straight through and the question was never really asked.
 *
 * A native dialog rather than a div of our own. It brings the top layer, the
 * backdrop, Escape and the focus trap with it, and none of those are worth
 * rebuilding by hand. Nothing here is a menu or a notification - it is a
 * question that has to be answered, which is what a modal dialog is for.
 */
@customElement("mk-confirm")
export class MkConfirm extends LitElement {
  @property({ type: Boolean }) open = false;
  @property({ type: String }) heading = "";
  /** What the action actually does, in a sentence or two. */
  @property({ type: String }) message = "";
  @property({ type: String }) confirmLabel = "";
  @property({ type: String }) cancelLabel = "";
  @property({ attribute: false }) onConfirm?: () => void;
  @property({ attribute: false }) onCancel?: () => void;

  @query("dialog") private dialog!: HTMLDialogElement;

  static styles = [
    baseStyles,
    css`
      /* No padding of its own: every pixel of the dialog itself is backdrop
         as far as the click handler is concerned, and the box inside carries
         the spacing. */
      dialog {
        padding: 0;
        border: 1px solid var(--mk-line);
        background: var(--mk-surface);
        color: var(--mk-fg);
        width: min(420px, calc(100vw - 32px));
      }
      dialog::backdrop {
        background: rgb(2 8 14 / 0.72);
      }
      .body {
        padding: 18px;
      }
      h2 {
        font-family: var(--mk-mono);
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--mk-crit);
        margin: 0 0 10px;
      }
      p {
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        color: var(--mk-fg-2);
        margin: 0 0 18px;
      }
      .buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      button {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 9px 15px;
        color: var(--mk-fg-2);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        cursor: pointer;
      }
      button:hover {
        border-color: var(--mk-fg-2);
        color: var(--mk-fg);
      }
      button.confirm {
        border-color: var(--mk-crit);
        color: var(--mk-crit);
      }
      button.confirm:hover {
        border-color: var(--mk-crit);
        color: var(--mk-crit);
        background: var(--mk-surface-2);
      }
      button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `,
  ];

  protected updated(changed: Map<string, unknown>): void {
    if (!changed.has("open")) return;
    if (this.open && !this.dialog.open) this.dialog.showModal();
    if (!this.open && this.dialog.open) this.dialog.close();
  }

  disconnectedCallback(): void {
    if (this.dialog?.open) this.dialog.close();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <dialog
        aria-labelledby="heading"
        @click=${this.backdrop}
        @keydown=${this.keys}
      >
        <div class="body">
          <h2 id="heading">${this.heading}</h2>
          <p>${this.message}</p>
          <div class="buttons">
            <!-- Cancel first, so the dialog opens with the harmless answer
                 focused and Enter does nothing anyone has to undo. -->
            <button @click=${this.cancel}>${this.cancelLabel}</button>
            <button class="confirm" @click=${this.confirm}>
              ${this.confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    `;
  }

  /**
   * Each way out says so itself, rather than the close event being read
   * afterwards to work out which one it was. The dialog fires that event as a
   * queued task, so a flag set beside it survives into the next answer - and
   * the first attempt here did exactly that, swallowing the cancellation that
   * followed a confirmation.
   */
  private confirm() {
    this.dialog.close();
    this.onConfirm?.();
  }

  private cancel() {
    this.dialog.close();
    this.onCancel?.();
  }

  /**
   * Escape, closed here rather than left to the dialog's own close request.
   *
   * Cancelling the key press takes that request out of play, so there is one
   * route out and it reports once. Written this way because the request does
   * not arrive in every browser a panel ends up in - it does nothing at all
   * in the pane this was tested in - and a dialog that will not take Escape
   * is a dialog someone is stuck in.
   */
  private keys(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    this.cancel();
  }

  /** A click that lands on the dialog itself landed on the backdrop. */
  private backdrop(event: MouseEvent) {
    if (event.target === this.dialog) this.cancel();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-confirm": MkConfirm;
  }
}
