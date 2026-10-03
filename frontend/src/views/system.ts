import { html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "../define";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import type { DeviceControls } from "../controls";
import {
  CAPACITY_KEYS,
  INTERNAL_MOS1_TEMP_KEYS,
  INTERNAL_TEMP_KEYS,
  INVERTER_VERSION_KEYS,
  MIN_CELL_TEMP_KEYS,
  MODEL_KEYS,
} from "../entities";
import "./maintenance";

/**
 * selftest_status values: 5 is the Ethernet chip (CH395) version check, 2 and
 * 3 are the real faults (EEPROM, flash). The number comes from the sensor's
 * `raw_value` attribute.
 */
const SELFTEST_ETHERNET = 5;
const SELFTEST_FAULTS = [2, 3];
/**
 * Fallback for an entity without `raw_value` (an older integration build): the
 * sensor then exposes only the mapped text, so these have to match
 * registers/*.yaml. Start of the state text of 5 ("Ethernet chip reports
 * another version than expected") and fragments of the texts of 2 and 3.
 */
const SELFTEST_ETHERNET_TEXT = "Ethernet chip reports";
const SELFTEST_FAULT_TEXTS = ["EEPROM fault", "Flash fault"];

/** Fault registers that should read zero on a healthy device. */
const FAULT_KEYS = [
  "alarm_status",
  "fault_status",
  "fault_status_low",
  "fault_status_2_low",
  "mppt_error",
  "mppt_warning",
];

/** Codes in FAULT_KEYS that are a warning, not a fault: the banner rates them so. */
const WARNING_CODE_KEYS = ["mppt_warning"];

/**
 * Binary sensors that put the banner on warning: the BMS fault lock holds the
 * MOSFETs open, and the factory mode (disabled by default) disables the BMS's
 * normal operation. Neither is a fault register, and the owner rates both a
 * warning rather than an error.
 */
const WARN_KEYS = ["bms_lock_active", "bms_factory_mode"];

/** Bit 0 of the Venus E v3 alarm word: waiting for the grid release. */
const GRID_WAIT_BIT = 1;

type Level = "crit" | "warn" | "info";

interface Notice {
  level: Level;
  text: string;
  title?: string;
}

@customElement("mk-view-system")
export class MkViewSystem extends MkView {
  @property({ attribute: false }) controls!: DeviceControls;

  static styles = [
    baseStyles,
    css`
      .quad {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 1300px) {
        .quad {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 700px) {
        .quad {
          grid-template-columns: 1fr;
        }
      }
      .below {
        margin-top: var(--mk-gap);
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 1100px) {
        .below {
          grid-template-columns: 1fr;
        }
      }
      .banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 11px 14px;
        border: 1px solid var(--mk-line);
        background: var(--mk-surface-2);
        margin-bottom: var(--mk-gap);
        font-family: var(--mk-mono);
        font-size: 12px;
      }
      .banner.ok {
        border-color: var(--mk-ok);
      }
      .banner.crit {
        border-color: var(--mk-crit);
      }
      .banner.warn {
        border-color: var(--mk-warn);
      }
      .banner.info {
        border-color: var(--mk-accent);
      }
      .banner {
        align-items: flex-start;
      }
      .lines > div + div {
        margin-top: 4px;
      }
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mk-ok);
        flex: none;
        margin-top: 5px;
      }
      .banner.crit .dot {
        background: var(--mk-crit);
      }
      .banner.warn .dot {
        background: var(--mk-warn);
      }
      .banner.info .dot {
        background: var(--mk-accent);
      }
      .lines .warn-line {
        color: var(--mk-warn);
      }
      .lines .info-line {
        color: var(--mk-accent);
      }
      .lines .crit-line {
        color: var(--mk-crit);
      }
    `,
  ];

  /**
   * True when this battery's alarm_status is the Venus E v3 word, whose bit 0
   * means "waiting for the grid release" and is no fault. On the Venus E
   * v1/v2 the same key is a 16-bit word with a real alarm in bit 0, so it
   * keeps the plain fault behaviour there.
   */
  private get gridWaitWord(): boolean {
    return !this.reader.isLegacyE();
  }

  /** The part of a fault word that counts as a fault. */
  private faultPart(key: string, value: number): number {
    if (key === "alarm_status" && this.gridWaitWord && value % 2 === GRID_WAIT_BIT) {
      return value - GRID_WAIT_BIT;
    }
    return value;
  }

  /**
   * Everything the banner reports, most severe first: raised fault words
   * with their causes, the BMS lock and factory mode as warnings, and the
   * E v3 waiting for the grid as a hint.
   */
  private notices(): Notice[] {
    const r = this.reader;
    const t = this.t;
    const out: Notice[] = [];

    for (const key of FAULT_KEYS) {
      const value = r.code(key);
      if (value === null || value === 0) continue;
      if (this.faultPart(key, value)) {
        const texts = [...(key === "alarm_status" && this.gridWaitWord ? [] : r.faultTexts(key))];
        // A code sensor that decodes itself (the MPPT codes) is its own text.
        const own = this.codeLabel(key);
        if (own !== null) texts.push(own);
        out.push({
          level: WARNING_CODE_KEYS.includes(key) ? "warn" : "crit",
          text: texts.length ? `${r.label(key)}: ${texts.join(", ")}` : r.label(key),
          title: String(value),
        });
      }
      if (key === "alarm_status" && this.gridWaitWord && value % 2 === GRID_WAIT_BIT) {
        out.push({ level: "info", text: t("system.grid_wait"), title: String(value) });
      }
    }

    for (const key of WARN_KEYS) {
      if (r.isOn(key)) out.push({ level: "warn", text: t(`system.${key}`) });
    }

    const rank: Record<Level, number> = { crit: 0, warn: 1, info: 2 };
    return out.sort((a, b) => rank[a.level] - rank[b.level]);
  }

  private banner() {
    const t = this.t;
    const notices = this.notices();
    const crit = notices.filter((n) => n.level === "crit");
    const level = notices[0]?.level ?? "ok";

    return html`
      <div class="banner ${level}" role=${level === "crit" || level === "warn" ? "alert" : "status"}>
        <span class="dot"></span>
        <div class="lines">
          ${crit.length
            ? html`<div>
                ${t("system.faults_raised", { list: "" })}
                ${crit.map(
                  (n, i) => html`<span title=${n.title ?? nothing}>${i ? "; " : ""}${n.text}</span>`,
                )}
              </div>`
            : html`<div>${t("system.no_faults")}</div>`}
          ${notices
            .filter((n) => n.level !== "crit")
            .map(
              (n) => html`<div class="${n.level}-line" title=${n.title ?? nothing}>${n.text}</div>`,
            )}
        </div>
      </div>
    `;
  }

  /** Tone of a fault register's row: the E v3 grid-wait bit alone is a hint. */
  private faultTone(key: string): string {
    const value = this.reader.code(key);
    if (!value) return "ok";
    if (WARNING_CODE_KEYS.includes(key)) return "warn";
    return this.faultPart(key, value) ? "crit" : "accent";
  }

  render() {
    const t = this.t;

    return html`
      ${this.banner()}

      <div class="grid quad">
        <div class="panel">
          <div class="head"><div class="label">${t("system.device")}</div></div>
          ${this.kvFirst(MODEL_KEYS, 0, { raw: true })}
          ${this.row(t("system.packs"), String(this.packs.length))}
          ${this.kvFirst(CAPACITY_KEYS, 2)} ${this.kv("modbus_address", 0, { raw: true })}
          <!-- The raw register on purpose: the summary corrects 35100 where it
               calls solar passing through "Discharge", a diagnostics view should not. -->
          ${this.kv("inverter_state", 0, { raw: true })} ${this.kv("work_mode", 0, { raw: true })}
          ${this.selfTestRow()}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.firmware")}</div></div>
          ${this.kv("ems_version", 0, { version: true })} ${this.kvFirst(["battery_1_bms_version", "bms_version"], 0, {
            version: true,
            // On the multi-pack models this entity is named after pack 1.
            // The packs have to agree on a BMS version anyway, and a
            // mismatch raises its own row on the cells tab.
            label: t("cells.bms_version"),
          })}
          ${this.kvFirst(INVERTER_VERSION_KEYS, 0, { version: true })} ${this.kv("mppt_version", 0, { version: true })}
          ${this.kv("ems_boot_version", 0, { version: true })} ${this.kv("vns_boot_version", 0, { version: true })}
          ${this.kv("comm_module_firmware", 0, { raw: true })}
          ${this.kv("ethernet_chip_version", 0, { raw: true })}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.connection")}</div></div>
          ${this.kv("bluetooth_status", 0, { raw: true })}
          ${this.kv("device_ip_address", 0, { raw: true })} ${this.kv("gateway_ip_address", 0, { raw: true })}
          ${this.kv("ble_mac_address", 0, { raw: true })}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.faults")}</div></div>
          ${FAULT_KEYS.map((key) => this.codeRow(key, this.faultTone(key)))}
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${t("system.control")}</div></div>
          ${this.kv("set_charge_power", 0, {
            label: t("system.set_charge_power"),
            title: t("system.set_power_hint"),
          })}
          ${this.kv("set_discharge_power", 0, {
            label: t("system.set_discharge_power"),
            title: t("system.set_power_hint"),
          })}
          ${this.kv("max_charge_power", 0)} ${this.kv("max_discharge_power", 0)}
          ${this.kv("charge_to_soc", 0)}
          ${this.ceilingNote()}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.thermal")}</div></div>
          ${this.kvFirst(INTERNAL_TEMP_KEYS, 1)} ${this.kvFirst(INTERNAL_MOS1_TEMP_KEYS, 1)}
          ${this.cellTemperatureRows()}
          ${this.packElectrical()}
          ${this.kv("ac_voltage", 1)} ${this.kv("ac_frequency", 2)}
        </div>
      </div>

      <mk-maintenance
        .reader=${this.reader}
        .fmt=${this.fmt}
        .t=${this.t}
        .controls=${this.controls}
      ></mk-maintenance>
    `;
  }

  /**
   * The self-test result after power-on. Only 2 (EEPROM) and 3 (flash) are
   * faults and get the fault tone. 5 - the Ethernet chip (CH395) version check
   * (or the SRAM test) - was measured as 5 on two Venus D with a working LAN,
   * where the chip reports version 0x4A and the test expects 0x4B; it is shown
   * in a neutral tone with the explanation as a tooltip. The three are told
   * apart by the sensor's numeric `raw_value` attribute; an entity without it
   * (an older integration build) is told apart by its state text instead.
   */
  private selfTestRow() {
    const r = this.reader;
    const text = r.str("selftest_status");
    if (text === null) return nothing;
    const label = r.label("selftest_status");
    const raw = r.rawValue("selftest_status");
    const ethernet =
      raw !== null ? raw === SELFTEST_ETHERNET : text.startsWith(SELFTEST_ETHERNET_TEXT);
    if (ethernet) {
      return this.row(label, this.t("system.selftest_5"), "", {
        title: this.t("system.selftest_5_hint"),
        wrap: true,
      });
    }
    const fault =
      raw !== null
        ? SELFTEST_FAULTS.includes(raw)
        : SELFTEST_FAULT_TEXTS.some((fragment) => text.includes(fragment));
    return this.row(label, text, fault ? "crit" : "", { wrap: true });
  }

  /**
   * The cell temperature rows of the thermal card, all with one scope.
   *
   * On a stack the firmware's max_cell_temperature is the maximum across all
   * packs but the only minimum it serves is pack 1's, so showing the two side
   * by side compared different things. Where the packs report their own cell
   * NTCs (Venus D and A; the E v3 once enabled) the card shows the highest
   * and lowest of all of them, with the pack that holds each extreme as a
   * tooltip. Without pack NTCs (E v1/v2, E v3 with them disabled) the
   * firmware maximum stands alone and is labelled as the BMS's figure; the
   * minimum is only shown for a single pack, where it is that pack's. Pack 1's
   * minimum on a stack stays available in the Cells tab.
   */
  private cellTemperatureRows() {
    const t = this.t;
    const extremes = this.cellTempExtremes();

    if (extremes) {
      const multi = this.packs.length > 1;
      const unit = this.unitOf(
        ...this.packs.map((i) => `battery_${i}_cell_temperature_1`),
        "max_cell_temperature",
      );
      const text = (value: number) =>
        `${this.fmt.num(value, 1)}${unit ? ` ${unit}` : ""}`;
      const holder = (packs: number[]) =>
        multi ? t("system.cell_temp_holder", { packs: packs.join(", ") }) : "";
      return html`
        ${this.row(
          t(multi ? "system.cell_temp_max_all" : "system.cell_temp_max"),
          text(extremes.hi.value),
          "",
          { title: holder(extremes.hi.packs) },
        )}
        ${this.row(
          t(multi ? "system.cell_temp_min_all" : "system.cell_temp_min"),
          text(extremes.lo.value),
          "",
          { title: holder(extremes.lo.packs) },
        )}
      `;
    }

    return html`
      ${this.kv("max_cell_temperature", 1, { label: t("system.cell_temp_max_bms") })}
      ${this.packs.length <= 1
        ? this.kvFirst(MIN_CELL_TEMP_KEYS, 1, { label: t("system.cell_temp_min_bms") })
        : nothing}
    `;
  }

  /**
   * charge_to_soc doubles as the panel's charge ceiling, but only inside its
   * own range. Saying so here keeps the reader from wondering why a displayed
   * 0 has no effect anywhere else. The lower end comes from the entity: 13 on
   * the Venus D, A and E v3, whose firmware refuses 10 to 12, and 10 on the
   * Venus E v1/v2.
   */
  private ceilingNote() {
    const value = this.reader.num("charge_to_soc");
    if (value === null) return nothing;
    const min = Number(this.reader.attr("charge_to_soc", "min", 10)) || 10;
    const usable = value >= min && value <= 100;
    return html`
      <div class="note">
        ${usable
          ? this.t("system.ceiling_used", { value: this.fmt.num(value, 0) })
          : this.t("system.ceiling_ignored", {
              value: this.fmt.num(value, 0),
              min: this.fmt.num(min, 0),
            })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-system": MkViewSystem;
  }
}
