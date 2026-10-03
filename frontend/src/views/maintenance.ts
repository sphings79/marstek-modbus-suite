import { html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { customElement } from "../define";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import { isConfirmExpired, isUnauthorized, type DeviceControls } from "../controls";
import type { PressResult } from "../types";
import { checkWifi } from "../wifi";
import "../components/mk-confirm";

/**
 * Buttons that only start a test or a read and change nothing on the device.
 * They are pressed straight away.
 */
const SIMPLE_KEYS = new Set(["led_test", "inverter_eeprom_test", "read_inverter_input_pb1"]);

/**
 * Buttons that change the device but write on the first press, because the
 * integration gives them no two-step confirmation: the PV commands of the
 * Venus A's DEV set, and the factory reset of the Venus E v1/v2 (its register
 * map predates the confirmation). The panel asks first itself.
 */
const ASK_FIRST_KEYS = new Set(["dev_45020_pv_restart", "dev_45021_pv_off", "dev_45021_pv_on"]);

/** Kept in the control tab, with its own dialog, as before. */
const EXCLUDED_KEYS = new Set(["reset_device"]);

/**
 * Seconds taken off the integration's confirmation window. The window starts
 * when the server hands out the token, which is after the panel sent the
 * first press; the margin keeps the confirmation from arriving just after the
 * token ran out.
 */
const WINDOW_MARGIN_S = 1;

/** Used when the server names no window. */
const DEFAULT_WINDOW_S = 15;

/** How long a result message stays. */
const TOAST_MS = 8000;

interface Armed {
  key: string;
  message: string;
  /** The one-time token the confirmation hands back. */
  token: string;
  /** performance.now() when the first press was sent. */
  since: number;
  window: number;
}

/**
 * The maintenance section of the system tab: every enabled button entity of
 * the battery except the restart, and the Wi-Fi credentials form.
 *
 * Collapsed by default and drawn as a danger zone, because most of what is in
 * here cannot be undone. Only one press is ever in flight, and nothing is
 * pressed without a click.
 *
 * Presses go through the integration's websocket command press_button. For
 * a button with a two-step confirmation the first call writes nothing and
 * returns the warning and a one-time token bound to this connection. The
 * warning comes up in a dialog with a countdown, and only the dialog's
 * confirm sends the token back, which writes once. Cancelling simply lets the
 * token run out: nothing on the server stays armed, and a press of the same
 * button in Home Assistant's own UI neither arms nor confirms the panel's.
 */
@customElement("mk-maintenance")
export class MkMaintenance extends MkView {
  @property({ attribute: false }) controls!: DeviceControls;

  /** Key of the press currently in flight. */
  @state() private busy: string | null = null;
  /** A two-step button waiting for its second press. */
  @state() private armed: Armed | null = null;
  /** A button the panel asks about before the first press. */
  @state() private asking: string | null = null;
  /** Clock for the countdowns, advanced while one is running. */
  @state() private now = performance.now();
  @state() private toast: { text: string; tone: string } | null = null;

  @state() private ssid = "";
  @state() private wifiBusy = false;
  @state() private wifiResult: { text: string; tone: string } | null = null;

  private ticker: number | undefined;
  private toastTimer: number | undefined;

  static styles = [
    baseStyles,
    css`
      details {
        margin-top: var(--mk-gap);
        border: 1px solid var(--mk-crit);
        background: var(--mk-surface);
      }
      summary {
        cursor: pointer;
        padding: 12px 17px;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--mk-crit);
        list-style-position: inside;
      }
      summary:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }
      .inner {
        padding: 0 17px 17px;
      }
      .warning {
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        color: var(--mk-fg-2);
        border-left: 2px solid var(--mk-crit);
        padding: 4px 0 4px 12px;
        margin: 0 0 14px;
      }
      .cards {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 1100px) {
        .cards {
          grid-template-columns: 1fr;
        }
      }
      .btn-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 0;
        border-bottom: 1px dashed var(--mk-line-soft);
      }
      .btn-row:last-of-type {
        border-bottom: 0;
      }
      .btn-row > span {
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg-2);
      }
      .sub {
        margin: 14px 0 4px;
      }
      button.action {
        flex: none;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 7px 13px;
        color: var(--mk-fg-2);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        cursor: pointer;
      }
      button.action:hover:not(:disabled) {
        border-color: var(--mk-crit);
        color: var(--mk-crit);
      }
      button.action:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      button.action:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
      .toast {
        margin-top: 12px;
        padding: 8px 12px;
        border: 1px solid var(--mk-line);
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        background: var(--mk-surface-2);
      }
      .toast.ok {
        border-color: var(--mk-ok);
      }
      .toast.crit {
        border-color: var(--mk-crit);
      }
      label {
        display: block;
        margin-top: 10px;
      }
      label .label {
        display: block;
        margin-bottom: 4px;
      }
      input {
        width: 100%;
        font-family: var(--mk-mono);
        font-size: 12px;
        color: var(--mk-fg);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        padding: 7px 9px;
      }
      input:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 1px;
      }
      form .buttons {
        margin-top: 14px;
      }
    `,
  ];

  disconnectedCallback(): void {
    window.clearInterval(this.ticker);
    window.clearTimeout(this.toastTimer);
    this.ticker = undefined;
    super.disconnectedCallback();
  }

  protected updated(): void {
    // Tick only while a countdown is on screen.
    const counting = this.armed !== null;
    if (counting && this.ticker === undefined) {
      this.ticker = window.setInterval(() => (this.now = performance.now()), 250);
    } else if (!counting && this.ticker !== undefined) {
      window.clearInterval(this.ticker);
      this.ticker = undefined;
    }
  }

  /** The battery's buttons that belong here, service commands before DEV ones. */
  private get buttons(): { service: string[]; dev: string[] } {
    const r = this.reader;
    const keys = r
      .buttonKeys()
      .filter((key) => !EXCLUDED_KEYS.has(key))
      .sort((a, b) => r.label(a).localeCompare(r.label(b)));
    return {
      service: keys.filter((key) => !key.startsWith("dev_")),
      dev: keys.filter((key) => key.startsWith("dev_")),
    };
  }

  private get wifiAvailable(): boolean {
    return this.controls.hasService("set_wifi") && !this.reader.isLegacyE();
  }

  /**
   * The text of a refused call. A refusal for missing administrator rights
   * gets the panel's own message in the user's language instead of Home
   * Assistant's bare "Unauthorized".
   */
  private errorText(err: unknown): Promise<string> {
    return isUnauthorized(err)
      ? Promise.resolve(this.t("maint.admin_required"))
      : this.controls.errorText(err);
  }

  private remaining(armed: Armed): number {
    return armed.window - WINDOW_MARGIN_S - (this.now - armed.since) / 1000;
  }

  private showToast(text: string, tone: string): void {
    this.toast = { text, tone };
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (this.toast = null), TOAST_MS);
  }

  private askFirst(key: string): boolean {
    return ASK_FIRST_KEYS.has(key) || (key === "factory_reset" && this.reader.isLegacyE());
  }

  /** A click on a button row. */
  private onButton(key: string): void {
    if (this.busy || this.armed || this.asking) return;
    if (this.askFirst(key)) {
      this.asking = key;
      return;
    }
    void this.press(key);
  }

  /** Open the confirmation dialog for a press that answered with a token. */
  private async arm(key: string, result: PressResult, since: number): Promise<void> {
    const message = await this.controls.warningText(result);
    const window = Number(result.expires_in);
    this.now = performance.now();
    this.armed = {
      key,
      message,
      token: result.token ?? "",
      since,
      window: Number.isFinite(window) && window > 0 ? window : DEFAULT_WINDOW_S,
    };
  }

  /**
   * The first press. A button without a confirmation writes here; one with a
   * confirmation answers with its warning and a token, which opens the dialog.
   */
  private async press(key: string): Promise<void> {
    if (this.busy) return;
    this.busy = key;
    const since = performance.now();
    try {
      const result = await this.controls.press(key);
      if (result?.needs_confirm) {
        await this.arm(key, result, since);
      } else {
        this.showToast(this.t("maint.sent", { name: this.reader.label(key) }), "ok");
      }
    } catch (err) {
      this.showToast(await this.errorText(err), "crit");
    } finally {
      this.busy = null;
    }
  }

  /** The dialog's confirm: hand the token back inside the window. */
  private async confirmArmed(): Promise<void> {
    const armed = this.armed;
    this.armed = null;
    if (!armed || this.remaining(armed) <= 0) return;
    this.busy = armed.key;
    try {
      await this.controls.press(armed.key, armed.token);
      this.showToast(this.t("maint.sent", { name: this.reader.label(armed.key) }), "ok");
    } catch (err) {
      if (isConfirmExpired(err)) {
        // The token had run out after all: ask again with a fresh one rather
        // than pretend it went through.
        const since = performance.now();
        try {
          const result = await this.controls.press(armed.key);
          if (result?.needs_confirm) await this.arm(armed.key, result, since);
          else this.showToast(this.t("maint.sent", { name: this.reader.label(armed.key) }), "ok");
        } catch (again) {
          this.showToast(await this.errorText(again), "crit");
        }
      } else {
        this.showToast(await this.errorText(err), "crit");
      }
    } finally {
      this.busy = null;
    }
  }

  /** Cancel or close: the token simply runs out, nothing stays armed. */
  private dropArmed(): void {
    const armed = this.armed;
    this.armed = null;
    if (!armed) return;
    this.showToast(this.t("maint.cancelled", { name: this.reader.label(armed.key) }), "");
  }

  render() {
    const t = this.t;
    const { service, dev } = this.buttons;
    const wifi = this.wifiAvailable;

    return html`
      <details>
        <summary>${t("maint.title")}</summary>
        <div class="inner">
          <p class="warning">${t("maint.warning")}</p>
          ${this.controls.isAdmin
            ? nothing
            : html`<p class="warning">${t("maint.admin_required")}</p>`}
          <div class="grid cards">
            <div class="panel">
              <div class="head"><div class="label">${t("maint.buttons")}</div></div>
              ${service.length || dev.length
                ? html`
                    ${service.map((key) => this.buttonRow(key))}
                    ${dev.length
                      ? html`<div class="label sub">${t("maint.dev")}</div>
                          ${dev.map((key) => this.buttonRow(key))}`
                      : nothing}
                  `
                : html`<div class="note">${t("maint.none")}</div>`}
              <div class="note">${t("maint.buttons_hint")}</div>
              ${this.toast
                ? html`<div class="toast ${this.toast.tone}" role="status">${this.toast.text}</div>`
                : nothing}
            </div>
            ${wifi ? this.wifiCard() : nothing}
          </div>
        </div>
      </details>
      ${this.dialogs()}
    `;
  }

  private buttonRow(key: string) {
    const blocked = this.busy !== null || this.armed !== null || this.asking !== null;
    return html`
      <div class="btn-row">
        <span>${this.reader.label(key)}</span>
        <button
          class="action"
          ?disabled=${blocked || !this.controls.isAdmin || !this.reader.writable(key)}
          @click=${() => this.onButton(key)}
        >
          ${this.busy === key
            ? this.t("maint.pressing")
            : this.t(SIMPLE_KEYS.has(key) ? "maint.run" : "maint.press")}
        </button>
      </div>
    `;
  }

  private dialogs() {
    const t = this.t;
    const armed = this.armed;
    const left = armed ? this.remaining(armed) : 0;
    const expired = armed !== null && left <= 0;

    return html`
      <mk-confirm
        ?open=${armed !== null}
        heading=${armed ? this.reader.label(armed.key) : ""}
        message=${armed?.message ?? ""}
        note=${armed
          ? expired
            ? t("maint.expired")
            : t("maint.countdown", { seconds: Math.ceil(left) })
          : ""}
        ?confirmDisabled=${expired}
        confirmLabel=${t("maint.confirm")}
        cancelLabel=${expired ? t("maint.close") : t("control.cancel")}
        .onConfirm=${() => void this.confirmArmed()}
        .onCancel=${() => this.dropArmed()}
      ></mk-confirm>
      <mk-confirm
        ?open=${this.asking !== null}
        heading=${this.asking ? this.reader.label(this.asking) : ""}
        message=${t("maint.ask_message")}
        confirmLabel=${t("maint.press")}
        cancelLabel=${t("control.cancel")}
        .onConfirm=${() => {
          const key = this.asking;
          this.asking = null;
          if (key) void this.press(key);
        }}
        .onCancel=${() => (this.asking = null)}
      ></mk-confirm>
    `;
  }

  private wifiCard() {
    const t = this.t;
    return html`
      <div class="panel">
        <div class="head"><div class="label">${t("wifi.title")}</div></div>
        <p class="warning">${t("wifi.warning")}</p>
        <form autocomplete="off" @submit=${this.submitWifi}>
          <label>
            <span class="label">${t("wifi.ssid")}</span>
            <input
              name="ssid"
              autocomplete="off"
              spellcheck="false"
              maxlength="31"
              .value=${this.ssid}
              @input=${(e: Event) => (this.ssid = (e.target as HTMLInputElement).value)}
            />
          </label>
          <label>
            <span class="label">${t("wifi.password")}</span>
            <!-- Not bound to any property: the value is read once on submit
                 and the field emptied again, so it never sits in the panel's
                 state. -->
            <input id="wifi-password" type="password" name="password" autocomplete="off" maxlength="31" />
          </label>
          <div class="note">${t("wifi.hint")}</div>
          <div class="buttons">
            <button class="action" type="submit" ?disabled=${this.wifiBusy || !this.controls.isAdmin}>
              ${this.wifiBusy ? t("maint.pressing") : t("wifi.send")}
            </button>
          </div>
        </form>
        ${this.wifiResult
          ? html`<div class="toast ${this.wifiResult.tone}" role="status">${this.wifiResult.text}</div>`
          : nothing}
      </div>
    `;
  }

  /**
   * Check the credentials as the server would, send them, and empty the
   * password field whatever the outcome. The password lives in this function
   * and in the websocket command only.
   */
  private async submitWifi(event: Event): Promise<void> {
    event.preventDefault();
    if (this.wifiBusy || !this.controls.isAdmin) return;
    const field = this.renderRoot.querySelector<HTMLInputElement>("#wifi-password");
    const password = field?.value ?? "";
    if (field) field.value = "";

    const problem = checkWifi(this.ssid, password);
    if (problem) {
      this.wifiResult = { text: this.t(problem.key, problem.values), tone: "crit" };
      return;
    }

    this.wifiBusy = true;
    this.wifiResult = null;
    try {
      await this.controls.setWifi(this.ssid, password);
      this.wifiResult = { text: this.t("wifi.sent"), tone: "ok" };
    } catch (err) {
      this.wifiResult = { text: await this.errorText(err), tone: "crit" };
    } finally {
      this.wifiBusy = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-maintenance": MkMaintenance;
  }
}
