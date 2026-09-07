import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { themeStyles, baseStyles } from "./styles";
import { findDevices, DeviceReader, type MarstekDevice } from "./entities";
import { DeviceControls } from "./controls";
import { loadCatalogue, translate, type Strings } from "./localize";
import { Formatter } from "./format";
import { en } from "./locales/en";
import "./views/core";
import "./views/cells";
import "./views/packs";
import "./views/solar";
import "./views/energy";
import "./views/system";
import "./views/control";
import "./views/settings";
import type { TabChoice } from "./views/settings";
import { applyScheme } from "./palettes";
import {
  loadSettings,
  saveSettings,
  clearSettings,
  DEFAULT_SETTINGS,
  type PanelSettings,
} from "./settings";

type TabId =
  | "core"
  | "cells"
  | "packs"
  | "solar"
  | "energy"
  | "control"
  | "system";

const TABS: TabId[] = ["core", "cells", "packs", "solar", "energy", "control", "system"];

/**
 * A tab appears only when the battery has something to put in it. Venus E
 * reports no MPPT inputs, no per-cell voltages and no state of charge per
 * pack, so three of these would otherwise be empty rooms. The key named here
 * is looked up in the entity registry, so a tab also survives its sensors
 * being disabled - it then shows its own empty state rather than vanishing
 * as a side effect of a checkbox.
 */
const TAB_REQUIRES: Partial<Record<TabId, string>> = {
  cells: "battery_1_max_cell_voltage",
  packs: "battery_soc_1",
  solar: "mppt1_power",
  control: "set_charge_power",
};

/** Remembering the selected battery is worth a line of storage: the panel is
 *  opened repeatedly, and re-picking the same one every time is friction. */
const STORAGE_DEVICE = "marstek-panel.device";

/** The tab last looked at, for the "resume where I was" start option. */
const STORAGE_TAB = "marstek-panel.tab";

@customElement("marstek-modbus-panel")
export class MarstekPanel extends LitElement {
  @property({ attribute: false }) hass!: import("./types").HomeAssistant;
  @property({ type: Boolean }) narrow = false;

  @state() private settings: PanelSettings = loadSettings();
  @state() private tab: TabId = "core";
  @state() private showSettings = false;
  @state() private strings: Strings = en;
  @state() private deviceId: string | null = readStoredDevice();

  private catalogueFor = "";
  private appearanceFor = "";
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

      /* The strip scrolls inside itself. Left to overflow, it drags the whole
         document sideways on a phone - every card moves when you meant to
         reach the next tab. */
      nav {
        display: flex;
        gap: 1px;
        max-width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      nav::-webkit-scrollbar {
        display: none;
      }
      button.tab {
        flex: none;
        white-space: nowrap;
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

      button.gear {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        color: var(--mk-dim);
        background: none;
        border: 1px solid transparent;
        cursor: pointer;
      }
      button.gear:hover {
        color: var(--mk-fg-2);
        border-color: var(--mk-line);
      }
      button.gear[aria-pressed="true"] {
        color: var(--mk-accent);
        border-color: var(--mk-accent);
        background: var(--mk-accent-wash);
      }
      button.gear:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
      button.gear svg {
        width: 17px;
        height: 17px;
        fill: currentColor;
      }

      main {
        padding-top: 20px;
      }

      @media (max-width: 700px) {
        .shell {
          padding: 0 12px 32px;
        }
        header {
          gap: 10px;
        }
        .status {
          margin-left: 0;
          flex-wrap: wrap;
          gap: 12px;
          white-space: normal;
        }
        button.tab {
          padding: 9px 11px 12px;
          letter-spacing: 0.1em;
        }
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

  connectedCallback(): void {
    super.connectedCallback();
    this.tab = this.startingTab();
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (!this.hass) return;
    if (!changed.has("hass") && !changed.has("settings")) return;

    this.applyAppearance();

    const language = this.hass.language || "en";
    const digits = this.settings.extraDigits ? 1 : 0;
    if (language !== this.catalogueFor || this.formatter.extraDigits !== digits) {
      this.formatter = new Formatter(language, digits);
    }
    if (language !== this.catalogueFor) {
      this.catalogueFor = language;
      void loadCatalogue(language).then((strings) => {
        // Ignore a catalogue that arrives after another language was selected.
        if (this.catalogueFor === language) this.strings = strings;
      });
    }
  }

  /**
   * Put the chosen light/dark and colour scheme on the host.
   *
   * Both end up as inherited custom properties, so this is the only element in
   * the panel that has to know about either. Repeating the work on every hass
   * update would rewrite nineteen properties several times a second, hence the
   * signature check.
   */
  private applyAppearance(): void {
    const mode = this.settings.mode;
    const light =
      mode === "auto" ? !this.hass.themes?.darkMode : mode === "light";

    const signature = `${this.settings.scheme}/${light}`;
    if (signature === this.appearanceFor) return;
    this.appearanceFor = signature;

    this.toggleAttribute("light", light);
    applyScheme(this, this.settings.scheme, light);
  }

  /** Where the panel opens: a fixed tab, or the one it was left on. */
  private startingTab(): TabId {
    const wanted =
      this.settings.startTab === "last" ? readStoredTab() : this.settings.startTab;
    return TABS.includes(wanted as TabId) ? (wanted as TabId) : "core";
  }

  private update_(patch: Partial<PanelSettings>): void {
    this.settings = { ...this.settings, ...patch };
    saveSettings(this.settings);
  }

  private resetSettings(): void {
    clearSettings();
    this.settings = { ...DEFAULT_SETTINGS };
  }

  private openTab(id: TabId): void {
    this.tab = id;
    this.showSettings = false;
    try {
      localStorage.setItem(STORAGE_TAB, id);
    } catch {
      // See selectDevice: remembering is a convenience, not a requirement.
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

  /** Tabs this battery can fill, minus the ones the user chose to hide. */
  private tabsFor(reader: DeviceReader): TabId[] {
    return TABS.filter(
      (id) =>
        this.supports(reader, id) &&
        (id === "core" || !this.settings.hiddenTabs.includes(id)),
    );
  }

  private supports(reader: DeviceReader, id: TabId): boolean {
    const key = TAB_REQUIRES[id];
    return !key || reader.entityId(key) !== undefined;
  }

  /** Every tab, with whether the battery can fill it, for the settings list. */
  private tabChoices(reader: DeviceReader): TabChoice[] {
    return TABS.map((id) => ({
      id,
      label: this.t(`tab.${id}`),
      available: this.supports(reader, id),
    }));
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
    const tabs = this.tabsFor(reader);
    // Switching to a battery without, say, MPPT inputs must not leave the
    // panel pointing at a tab that is no longer there.
    const active = tabs.includes(this.tab) ? this.tab : tabs[0];

    return html`
      <div class="shell">
        <header>
          <div class="brand">
            ${/^marstek/i.test(device.name)
              ? html`<em>${device.name}</em>`
              : html`MARSTEK <em>${device.name}</em>`}
          </div>
          <nav role="tablist" aria-label="Marstek Venus">
            ${tabs.map(
              (id) => html`
                <button
                  class="tab"
                  role="tab"
                  aria-selected=${!this.showSettings && active === id}
                  @click=${() => this.openTab(id)}
                  @keydown=${(e: KeyboardEvent) => this.onTabKey(e, id, tabs)}
                >
                  ${this.t(`tab.${id}`)}
                </button>
              `,
            )}
          </nav>
          ${this.statusBar(reader)}
        </header>

        <main>
          ${this.showSettings
            ? html`<mk-view-settings
                .settings=${this.settings}
                .tabs=${this.tabChoices(reader)}
                .t=${this.t}
                .onChange=${(patch: Partial<PanelSettings>) => this.update_(patch)}
                .onReset=${() => this.resetSettings()}
                ?light=${this.hasAttribute("light")}
              ></mk-view-settings>`
            : this.renderTab(reader, active)}
        </main>
      </div>
    `;
  }

  private onTabKey(event: KeyboardEvent, id: TabId, tabs: TabId[]) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = tabs[(tabs.indexOf(id) + step + tabs.length) % tabs.length];
    this.tab = next;
    const buttons = this.renderRoot.querySelectorAll<HTMLButtonElement>("button.tab");
    buttons[tabs.indexOf(next)]?.focus();
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
        <button
          class="gear"
          aria-pressed=${this.showSettings}
          title=${this.t("settings.title")}
          aria-label=${this.t("settings.title")}
          @click=${() => (this.showSettings = !this.showSettings)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-.98l2.11-1.63a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.3 7.3 0 0 0-1.69-.98l-.38-2.65a.49.49 0 0 0-.49-.42h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.63c-.04.32-.07.65-.07.98s.03.65.07.97L2.46 14.6a.5.5 0 0 0-.12.64l2 3.46c.13.23.4.31.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.63Z"
            />
          </svg>
        </button>
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

  private renderTab(reader: DeviceReader, active: TabId) {
    const shared = {
      reader,
      fmt: this.formatter,
      t: this.t,
    };

    switch (active) {
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
      case "control":
        return html`<mk-view-control
          .reader=${shared.reader}
          .fmt=${shared.fmt}
          .t=${shared.t}
          .controls=${new DeviceControls(this.hass, reader)}
        ></mk-view-control>`;
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

function readStoredTab(): string | null {
  try {
    return localStorage.getItem(STORAGE_TAB);
  } catch {
    return null;
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
