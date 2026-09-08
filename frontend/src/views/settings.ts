import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles } from "../styles";
import type { Translate } from "./view-base";
import type { LocalSettings, PanelSettings, ThemeMode } from "../settings";
import {
  exportSettings,
  importSettings,
  FONT_SCALE_MIN,
  FONT_SCALE_MAX,
  FONT_SCALE_STEP,
  WIDTH_MIN,
  WIDTH_STEP,
} from "../settings";
import { SCHEMES, followsHaTheme, type Palette } from "../palettes";

/** One tab as the settings list sees it: name, and why it may not be offered. */
export interface TabChoice {
  id: string;
  label: string;
  /** False when the battery does not report what the tab shows. */
  available: boolean;
}

/**
 * The panel's own settings.
 *
 * Reached from the gear in the header rather than the tab strip: every other
 * tab shows the battery, and this one does not.
 */
@customElement("mk-view-settings")
export class MkViewSettings extends LitElement {
  @property({ attribute: false }) settings!: PanelSettings;
  @property({ attribute: false }) local!: LocalSettings;
  @property({ attribute: false }) tabs: TabChoice[] = [];
  @property({ attribute: false }) t!: Translate;
  @property({ attribute: false }) onChange!: (patch: Partial<PanelSettings>) => void;
  @property({ attribute: false }) onChangeLocal!: (patch: Partial<LocalSettings>) => void;
  @property({ attribute: false }) onReset!: () => void;
  /** True when the shared store never answered, so nothing here will persist. */
  @property({ type: Boolean }) offline = false;
  /** Which ground the panel is on, so a swatch shows the version that applies. */
  @property({ type: Boolean }) light = false;

  /** Import box: open, its text, and whether the last paste was readable. */
  @state() private transferOpen = false;
  @state() private transferText = "";
  @state() private transferBad = false;

  static styles = [
    baseStyles,
    css`
      .grid.top {
        grid-template-columns: 2fr 1fr;
      }
      @media (max-width: 1100px) {
        .grid.top {
          grid-template-columns: 1fr;
        }
      }
      .below {
        margin-top: var(--mk-gap);
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 900px) {
        .below {
          grid-template-columns: 1fr;
        }
      }

      /* ---- scheme picker ---- */
      .schemes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
        gap: 10px;
      }
      button.scheme {
        display: block;
        width: 100%;
        padding: 0;
        text-align: left;
        border: 1px solid var(--mk-line);
        background: none;
        cursor: pointer;
        font: inherit;
      }
      button.scheme:hover {
        border-color: var(--mk-fg-2);
      }
      button.scheme[aria-pressed="true"] {
        border-color: var(--mk-accent);
        box-shadow: 0 0 0 1px var(--mk-accent);
      }
      button.scheme:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
      /* The preview paints itself in the scheme it offers, so the swatch is
         the scheme rather than a description of it. */
      .preview {
        padding: 11px 12px 12px;
      }
      .preview .bar {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 9px;
      }
      .preview .pill {
        height: 5px;
        flex: 1;
      }
      .preview .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex: none;
      }
      .preview .card {
        border: 1px solid;
        padding: 7px 8px;
      }
      .preview .rule {
        height: 4px;
        margin-bottom: 5px;
      }
      .preview .rule.short {
        width: 55%;
        margin-bottom: 0;
      }
      .scheme-name {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;
        font-family: var(--mk-mono);
        font-size: 11px;
        padding: 7px 10px;
        border-top: 1px solid var(--mk-line);
        color: var(--mk-fg-2);
        background: var(--mk-surface);
      }
      button.scheme[aria-pressed="true"] .scheme-name {
        color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      .scheme-name small {
        font-size: 9.5px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--mk-dim);
      }

      /* ---- option rows ---- */
      .field + .field {
        margin-top: 16px;
      }
      .field > .label {
        display: block;
        margin-bottom: 7px;
      }
      .choices {
        display: flex;
        flex-wrap: wrap;
        gap: 1px;
        background: var(--mk-line);
        border: 1px solid var(--mk-line);
      }
      /* Two or three options share the row; a long list packs instead of
         stretching one stray button across the full width. */
      .choices button {
        flex: 1 1 auto;
        font-family: var(--mk-mono);
        font-size: 10.5px;
        letter-spacing: 0.08em;
        padding: 8px 11px;
        color: var(--mk-fg-2);
        background: var(--mk-inset);
        border: 0;
        cursor: pointer;
        white-space: nowrap;
      }
      .choices button:hover {
        color: var(--mk-fg);
      }
      .choices button[aria-pressed="true"] {
        color: var(--mk-on-accent);
        background: var(--mk-accent);
      }
      .choices button:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }
      /* A long list becomes separate chips. Kept as one strip, the row's own
         background would show through the space the last button does not fill
         and read as an extra, empty option. */
      .choices.packed {
        background: none;
        border: 0;
        gap: 6px;
      }
      .choices.packed button {
        flex: 0 0 auto;
        border: 1px solid var(--mk-line);
      }

      /* ---- sliders ---- */
      .slider {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .slider input {
        flex: 1 1 auto;
        min-width: 0;
        height: 4px;
        margin: 0;
        appearance: none;
        background: var(--mk-track);
        border: 0;
        cursor: pointer;
      }
      .slider input::-webkit-slider-thumb {
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: var(--mk-accent);
        border: 0;
        cursor: pointer;
      }
      .slider input::-moz-range-thumb {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: var(--mk-accent);
        border: 0;
        cursor: pointer;
      }
      .slider input:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 4px;
      }
      /* The readout sits in a fixed box so the slider does not shift under
         the pointer as the number gains or loses a digit. */
      .slider .readout {
        flex: 0 0 auto;
        min-width: 9ch;
        text-align: right;
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg);
      }
      .choices button:disabled {
        opacity: 0.4;
        cursor: default;
      }

      /* ---- tab list ---- */
      .tab-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 0;
        border-bottom: 1px dashed var(--mk-line-soft);
      }
      .tab-row:last-of-type {
        border-bottom: 0;
      }
      .tab-row.gone {
        opacity: 0.45;
      }
      .tab-row label {
        font-family: var(--mk-mono);
        font-size: 11.5px;
        cursor: pointer;
      }
      .tab-row.gone label {
        cursor: default;
      }
      .tab-row .why {
        margin-left: auto;
        font-family: var(--mk-mono);
        font-size: 10px;
        color: var(--mk-dim);
        text-align: right;
      }
      input[type="checkbox"] {
        accent-color: var(--mk-accent);
        width: 15px;
        height: 15px;
        flex: none;
      }
      input[type="checkbox"]:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }

      .transfer {
        margin-top: 14px;
      }
      textarea {
        width: 100%;
        min-height: 150px;
        resize: vertical;
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        color: var(--mk-fg);
        background: var(--mk-inset);
        border: 1px solid var(--mk-line);
        padding: 9px 10px;
      }
      textarea:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 1px;
      }
      textarea.bad {
        border-color: var(--mk-crit);
      }
      .transfer .row {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 9px;
      }
      .bad-note {
        font-family: var(--mk-mono);
        font-size: 10.5px;
        color: var(--mk-crit);
      }
      button.action {
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
      button.action:hover {
        border-color: var(--mk-warn);
        color: var(--mk-warn);
      }
      button.action:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `,
  ];

  render() {
    const t = this.t;
    const s = this.settings;
    const haTheme = followsHaTheme(s.scheme);

    return html`
      <div class="grid top">
        <div class="panel">
          <div class="head"><div class="label">${t("settings.scheme")}</div></div>
          <div class="schemes">
            ${SCHEMES.map((scheme) =>
              this.schemeCard(
                scheme.id,
                scheme.name,
                (this.light && scheme.light) || scheme.dark,
              ),
            )}
          </div>
          <div class="note">${t("settings.scheme_hint")}</div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("settings.appearance")}</div></div>

          <div class="field">
            <span class="label">${t("settings.mode")}</span>
            ${this.choices<ThemeMode>(
              [
                ["auto", t("settings.mode.auto")],
                ["dark", t("settings.mode.dark")],
                ["light", t("settings.mode.light")],
              ],
              s.mode,
              (mode) => this.onChange({ mode }),
              haTheme,
            )}
            ${haTheme
              ? html`<div class="note">${t("settings.mode_ha")}</div>`
              : nothing}
          </div>

          <div class="field">
            <span class="label">${t("settings.digits")}</span>
            ${this.choices<boolean>(
              [
                [false, t("settings.digits.normal")],
                [true, t("settings.digits.more")],
              ],
              s.extraDigits,
              (extraDigits) => this.onChange({ extraDigits }),
            )}
          </div>

          <div class="field">
            <span class="label">${t("settings.scale")}</span>
            <div class="slider">
              <input
                type="range"
                min=${FONT_SCALE_MIN}
                max=${FONT_SCALE_MAX}
                step=${FONT_SCALE_STEP}
                .value=${String(this.local.fontScale)}
                aria-label=${t("settings.scale")}
                @input=${(e: Event) =>
                  this.onChangeLocal({
                    fontScale: Number((e.target as HTMLInputElement).value),
                  })}
              />
              <span class="readout">${this.local.fontScale} %</span>
            </div>
          </div>

          <div class="field">
            <span class="label">${t("settings.width")}</span>
            <div class="slider">
              <input
                type="range"
                min=${WIDTH_MIN}
                max=${this.widthMax()}
                step=${WIDTH_STEP}
                .value=${String(this.widthValue())}
                aria-label=${t("settings.width")}
                @input=${(e: Event) => this.pickWidth(e)}
              />
              <span class="readout">
                ${this.local.maxWidth === "full"
                  ? t("settings.width.full")
                  : `${this.local.maxWidth} px`}
              </span>
            </div>
            <div class="note">${t("settings.screen_hint")}</div>
          </div>
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${t("settings.start_tab")}</div></div>
          ${this.choices<string>(
            [
              ["last", t("settings.start_tab.last")],
              ...this.tabs
                .filter((tab) => tab.available && !s.hiddenTabs.includes(tab.id))
                .map((tab) => [tab.id, tab.label] as [string, string]),
            ],
            s.startTab,
            (startTab) => this.onChange({ startTab }),
            false,
            true,
          )}
          <div class="note">${t("settings.start_tab_hint")}</div>
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("settings.tabs")}</div></div>
          ${this.tabs.map((tab) => this.tabRow(tab))}
          <div class="note">${t("settings.tabs_hint")}</div>
        </div>
      </div>

      <div class="grid below" style="grid-template-columns: 1fr">
        <div class="panel">
          <div class="head"><div class="label">${t("settings.storage")}</div></div>
          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            <button class="action" @click=${() => this.onReset()}>
              ${t("settings.reset")}
            </button>
            <button
              class="action"
              aria-expanded=${this.transferOpen}
              @click=${() => this.toggleTransfer()}
            >
              ${t("settings.transfer")}
            </button>
            <span class="note" style="margin:0">${t("settings.storage_hint")}</span>
          </div>
          ${this.offline
            ? html`<div class="note crit">${t("settings.offline")}</div>`
            : nothing}
          ${this.transferOpen ? this.transfer() : nothing}
        </div>
      </div>
    `;
  }

  /**
   * The box that carries settings between browsers.
   *
   * One editable field rather than a download and an upload: copying text out
   * and pasting text in works the same in every browser, needs no file
   * permission, and lets someone see what they are moving.
   */
  private transfer() {
    const t = this.t;
    return html`
      <div class="transfer">
        <textarea
          class=${this.transferBad ? "bad" : ""}
          aria-label=${t("settings.transfer")}
          .value=${this.transferText}
          @input=${(e: Event) => {
            this.transferText = (e.target as HTMLTextAreaElement).value;
            this.transferBad = false;
          }}
        ></textarea>
        <div class="row">
          <button class="action" @click=${() => this.applyTransfer()}>
            ${t("settings.import")}
          </button>
          <button class="action" @click=${() => this.resetTransfer()}>
            ${t("settings.export_again")}
          </button>
          ${this.transferBad
            ? html`<span class="bad-note">${t("settings.transfer_bad")}</span>`
            : html`<span class="note" style="margin:0">${t("settings.transfer_hint")}</span>`}
        </div>
      </div>
    `;
  }

  private toggleTransfer() {
    this.transferOpen = !this.transferOpen;
    if (this.transferOpen) this.resetTransfer();
  }

  /** Fill the box with what is set right now - the export half. */
  private resetTransfer() {
    this.transferText = exportSettings(this.settings);
    this.transferBad = false;
  }

  private applyTransfer() {
    const parsed = importSettings(this.transferText);
    if (!parsed) {
      this.transferBad = true;
      return;
    }
    this.transferBad = false;
    this.onChange(parsed);
  }

  /** A swatch that paints itself in the scheme it is offering. */
  private schemeCard(id: string, name: string, palette: Palette) {
    const selected = this.settings.scheme === id;
    return html`
      <button
        class="scheme"
        aria-pressed=${selected}
        @click=${() => this.onChange({ scheme: id })}
      >
        <div class="preview" style="background:${palette.bg}">
          <div class="bar">
            <span class="pill" style="background:${palette.accent}"></span>
            <span class="pill" style="background:${palette.magenta}"></span>
            <span class="dot" style="background:${palette.ok}"></span>
            <span class="dot" style="background:${palette.warn}"></span>
            <span class="dot" style="background:${palette.crit}"></span>
          </div>
          <div
            class="card"
            style="background:${palette.surface};border-color:${palette.line}"
          >
            <div class="rule" style="background:${palette.fg}"></div>
            <div class="rule short" style="background:${palette.dim}"></div>
          </div>
        </div>
        <span class="scheme-name">
          ${name}
          ${followsHaTheme(id)
            ? html`<small>${this.t("settings.scheme_theme")}</small>`
            : nothing}
        </span>
      </button>
    `;
  }

  /**
   * The right-hand end of the width slider: this window, rounded up a step.
   *
   * Anchoring it to the window rather than to a fixed number means the last
   * position really is edge to edge on whatever screen this is, and that no
   * position on the slider is indistinguishable from the one before it.
   */
  private widthMax(): number {
    const window_ = Math.max(WIDTH_MIN + WIDTH_STEP, window.innerWidth);
    return Math.ceil(window_ / WIDTH_STEP) * WIDTH_STEP;
  }

  /** Full width sits at the far right; anything else is its own pixel value. */
  private widthValue(): number {
    const max = this.widthMax();
    if (this.local.maxWidth === "full") return max;
    return Math.min(max, Math.max(WIDTH_MIN, this.local.maxWidth));
  }

  private pickWidth(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.onChangeLocal({ maxWidth: value >= this.widthMax() ? "full" : value });
  }

  private choices<T extends string | boolean>(
    options: [T, string][],
    current: T,
    pick: (value: T) => void,
    disabled = false,
    packed = false,
  ) {
    return html`
      <div class="choices ${packed ? "packed" : ""}">
        ${options.map(
          ([value, label]) => html`
            <button
              aria-pressed=${value === current}
              ?disabled=${disabled}
              @click=${() => pick(value)}
            >
              ${label}
            </button>
          `,
        )}
      </div>
    `;
  }

  /**
   * A tab the user may hide - or one the battery cannot fill, shown greyed out
   * with the reason. Without that, a tab hidden by choice and a tab missing
   * because the hardware lacks the sensors look identical six months later.
   */
  private tabRow(tab: TabChoice) {
    const hidden = this.settings.hiddenTabs.includes(tab.id);
    const locked = tab.id === "core";
    const id = `tab-${tab.id}`;

    return html`
      <div class="tab-row ${tab.available ? "" : "gone"}">
        <input
          type="checkbox"
          id=${id}
          .checked=${tab.available && !hidden}
          ?disabled=${!tab.available || locked}
          @change=${(e: Event) => this.setHidden(tab.id, !(e.target as HTMLInputElement).checked)}
        />
        <label for=${id}>${tab.label}</label>
        ${tab.available
          ? locked
            ? html`<span class="why">${this.t("settings.always")}</span>`
            : nothing
          : html`<span class="why">${this.t(`settings.unavail.${tab.id}`)}</span>`}
      </div>
    `;
  }

  private setHidden(id: string, hidden: boolean) {
    const current = this.settings.hiddenTabs.filter((other) => other !== id);
    this.onChange({ hiddenTabs: hidden ? [...current, id] : current });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-settings": MkViewSettings;
  }
}
