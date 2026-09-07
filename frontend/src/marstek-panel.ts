import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { themeStyles, baseStyles } from "./styles";
import { findDevices, DeviceReader, type MarstekDevice } from "./entities";
import { loadCatalogue, translate, type Strings } from "./localize";
import { Formatter } from "./format";
import { en } from "./locales/en";
import "./views/core";
import "./views/cells";
import "./views/packs";
import "./views/solar";
import "./views/energy";
import "./views/system";

type TabId = "core" | "cells" | "packs" | "solar" | "energy" | "system";

const TABS: TabId[] = ["core", "cells", "packs", "solar", "energy", "system"];

/** Remembering the selected battery is worth a line of storage: the panel is
 *  opened repeatedly, and re-picking the same one every time is friction. */
const STORAGE_DEVICE = "marstek-panel.device";

@customElement("marstek-modbus-panel")
export class MarstekPanel extends LitElement {
  @property({ attribute: false }) hass!: import("./types").HomeAssistant;
  @property({ type: Boolean }) narrow = false;

  @state() private tab: TabId = "core";
  @state() private strings: Strings = en;
  @state() private deviceId: string | null = readStoredDevice();

  private catalogueFor = "";
  private formatter = new Formatter("en");

  static styles = [
    themeStyles,
    baseStyles,
    css`
      :host {
        min-height: 100vh;
        background: var(--mk-bg);
      }

      .shell {
        max-width: 1440px;
        margin: 0 auto;
        padding: 0 24px 40px;
      }

      header {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 15px 0 0;
        border-bottom: 1px solid var(--mk-line);
        position: sticky;
        top: 0;
        z-index: 5;
        background: var(--mk-bg);
        flex-wrap: wrap;
      }

      .brand {
        font-size: 16px;
        font-weight: 700;
        letter-spacing: -0.01em;
        padding-bottom: 14px;
      }
      .brand em {
        font-style: normal;
        color: var(--mk-accent);
      }

      nav {
        display: flex;
        gap: 1px;
      }
      button.tab {
        font-family: var(--mk-mono);
        font-size: 11.5px;
        letter-spacing: 0.15em;
        padding: 9px 15px 13px;
        color: var(--mk-dim);
        background: none;
        border: 0;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
      }
      button.tab:hover {
        color: var(--mk-fg-2);
        background: var(--mk-surface);
      }
      button.tab[aria-selected="true"] {
        color: var(--mk-accent);
        border-bottom-color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      button.tab:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: -2px;
      }

      .status {
        margin-left: auto;
        display: flex;
        gap: 18px;
        align-items: center;
        padding-bottom: 14px;
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-dim);
        white-space: nowrap;
      }
      .led {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        margin-right: 6px;
        vertical-align: 1px;
        background: var(--mk-dim);
      }
      .led.on {
        background: var(--mk-ok);
      }
      .led.off {
        background: var(--mk-crit);
      }

      select {
        font-family: var(--mk-mono);
        font-size: 11px;
        color: var(--mk-fg);
        background: var(--mk-surface);
        border: 1px solid var(--mk-line);
        padding: 4px 6px;
      }

      main {
        padding-top: 20px;
      }

      .empty {
        margin-top: 80px;
        text-align: center;
        color: var(--mk-fg-2);
      }
      .empty h2 {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px;
        color: var(--mk-fg);
      }
      .empty p {
        margin: 0 auto;
        max-width: 46ch;
        font-size: 14px;
      }

      .todo {
        margin-top: 40px;
        text-align: center;
        font-family: var(--mk-mono);
        font-size: 12px;
        color: var(--mk-dim);
        letter-spacing: 0.1em;
      }
    `,
  ];

  protected willUpdate(changed: Map<string, unknown>): void {
    if (!changed.has("hass") || !this.hass) return;

    // Follow the theme Home Assistant is in, without adopting its colours.
    this.toggleAttribute("light", !this.hass.themes?.darkMode);

    const language = this.hass.language || "en";
    if (language !== this.catalogueFor) {
      this.catalogueFor = language;
      this.formatter = new Formatter(language);
      void loadCatalogue(language).then((strings) => {
        // Ignore a catalogue that arrives after another language was selected.
        if (this.catalogueFor === language) this.strings = strings;
      });
    }
  }

  private t = (key: string, values?: Record<string, string | number>): string =>
    translate(this.strings, key, values);

  private selectDevice(deviceId: string) {
    this.deviceId = deviceId;
    try {
      localStorage.setItem(STORAGE_DEVICE, deviceId);
    } catch {
      // Private windows and blocked site data throw here; remembering the
      // choice is a convenience, not a requirement.
    }
  }

  private get devices(): MarstekDevice[] {
    return this.hass ? findDevices(this.hass) : [];
  }

  private get device(): MarstekDevice | null {
    const devices = this.devices;
    if (!devices.length) return null;
    return devices.find((d) => d.deviceId === this.deviceId) ?? devices[0];
  }

  render() {
    if (!this.hass) return nothing;

    const device = this.device;
    if (!device) {
      return html`
        <div class="shell">
          <div class="empty">
            <h2>${this.t("empty.no_device")}</h2>
            <p>${this.t("empty.no_device_hint")}</p>
          </div>
        </div>
      `;
    }

    const reader = new DeviceReader(this.hass, device);

    return html`
      <div class="shell">
        <header>
          <div class="brand">MARSTEK <em>${device.name}</em></div>
          <nav role="tablist" aria-label="Marstek Venus">
            ${TABS.map(
              (id) => html`
                <button
                  class="tab"
                  role="tab"
                  aria-selected=${this.tab === id}
                  @click=${() => (this.tab = id)}
                  @keydown=${(e: KeyboardEvent) => this.onTabKey(e, id)}
                >
                  ${this.t(`tab.${id}`)}
                </button>
              `,
            )}
          </nav>
          ${this.statusBar(reader)}
        </header>

        <main>${this.renderTab(reader)}</main>
      </div>
    `;
  }

  private onTabKey(event: KeyboardEvent, id: TabId) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = TABS[(TABS.indexOf(id) + step + TABS.length) % TABS.length];
    this.tab = next;
    const buttons = this.renderRoot.querySelectorAll<HTMLButtonElement>("button.tab");
    buttons[TABS.indexOf(next)]?.focus();
  }

  private statusBar(reader: DeviceReader) {
    const devices = this.devices;
    const selected = this.device?.deviceId;
    const wifi = reader.num("wifi_signal_strength");

    return html`
      <div class="status">
        ${devices.length > 1
          ? html`
              <select
                aria-label=${this.t("common.device")}
                @change=${(e: Event) =>
                  this.selectDevice((e.target as HTMLSelectElement).value)}
              >
                ${devices.map(
                  (d) => html`
                    <option value=${d.deviceId} ?selected=${d.deviceId === selected}>
                      ${d.name}
                    </option>
                  `,
                )}
              </select>
            `
          : nothing}
        <span>
          <i class="led ${reader.has("battery_soc") ? "on" : "off"}"></i>
          ${this.t("status.modbus")}
        </span>
        ${wifi === null
          ? nothing
          : html`<span>
              <i class="led on"></i>${this.t("status.wifi")}
              ${this.formatter.num(wifi, 0)} dBm
            </span>`}
        ${reader.str("inverter_state")
          ? html`<span>${reader.str("inverter_state")}</span>`
          : nothing}
      </div>
    `;
  }

  /**
   * The configured discharge floor, recovered from the two energy sensors
   * rather than read from the options: usable energy is what sits above the
   * floor, so the difference against stored energy is the floor itself. Saves
   * a websocket round trip for a number the device already implies.
   */
  private floorPercent(reader: DeviceReader): number | null {
    const stored = reader.num("stored_energy");
    const usable = reader.num("usable_energy");
    const capacity = reader.num("battery_total_energy");
    if (stored === null || usable === null || !capacity) return null;
    const floor = ((stored - usable) / capacity) * 100;
    return floor >= 0 && floor <= 100 ? floor : null;
  }

  private renderTab(reader: DeviceReader) {
    const shared = {
      reader,
      fmt: this.formatter,
      t: this.t,
    };

    switch (this.tab) {
      case "cells":
        return html`<mk-view-cells
          .reader=${shared.reader}
          .fmt=${shared.fmt}
          .t=${shared.t}
        ></mk-view-cells>`;
      case "packs":
        return html`<mk-view-packs
          .reader=${shared.reader}
          .fmt=${shared.fmt}
          .t=${shared.t}
          .floor=${this.floorPercent(reader)}
        ></mk-view-packs>`;
      case "solar":
        return html`<mk-view-solar
          .reader=${shared.reader}
          .fmt=${shared.fmt}
          .t=${shared.t}
        ></mk-view-solar>`;
      case "energy":
        return html`<mk-view-energy
          .reader=${shared.reader}
          .fmt=${shared.fmt}
          .t=${shared.t}
        ></mk-view-energy>`;
      case "system":
        return html`<mk-view-system
          .reader=${shared.reader}
          .fmt=${shared.fmt}
          .t=${shared.t}
        ></mk-view-system>`;
      default:
        return html`<mk-view-core
          .reader=${shared.reader}
          .fmt=${shared.fmt}
          .t=${shared.t}
        ></mk-view-core>`;
    }
  }
}

function readStoredDevice(): string | null {
  try {
    return localStorage.getItem(STORAGE_DEVICE);
  } catch {
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "marstek-modbus-panel": MarstekPanel;
  }
}
