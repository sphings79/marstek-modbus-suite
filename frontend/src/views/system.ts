import { html, css, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";

/** Fault registers that should read zero on a healthy device. */
const FAULT_KEYS = [
  "alarm_status",
  "fault_status",
  "fault_status_low",
  "fault_status_2",
  "fault_status_2_low",
  "mppt_error",
  "mppt_warning",
];

@customElement("mk-view-system")
export class MkViewSystem extends MkView {
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
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mk-ok);
        flex: none;
      }
      .banner.crit .dot {
        background: var(--mk-crit);
      }
    `,
  ];

  render() {
    const r = this.reader;
    const t = this.t;

    const raised = FAULT_KEYS.filter((key) => {
      const value = r.num(key);
      return value !== null && value !== 0;
    });

    return html`
      <div class="banner ${raised.length ? "crit" : "ok"}">
        <span class="dot"></span>
        ${raised.length
          ? t("system.faults_raised", {
              list: raised.map((key) => r.label(key)).join(", "),
            })
          : t("system.no_faults")}
      </div>

      <div class="grid quad">
        <div class="panel">
          <div class="head"><div class="label">${t("system.device")}</div></div>
          ${this.kv("device_name", 0, { raw: true })}
          ${this.row(t("system.packs"), String(this.packs.length))}
          ${this.kv("battery_total_energy", 2)} ${this.kv("modbus_address", 0, { raw: true })}
          ${this.kv("inverter_state", 0, { raw: true })} ${this.kv("work_mode", 0, { raw: true })}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.firmware")}</div></div>
          ${this.kv("ems_version", 0, { version: true })} ${this.kv("bms_version", 0, { version: true })}
          ${this.kv("vms_version", 0, { version: true })} ${this.kv("mppt_version", 0, { version: true })}
          ${this.kv("ems_boot_version", 0, { version: true })} ${this.kv("vns_boot_version", 0, { version: true })}
          ${this.kv("comm_module_firmware", 0, { raw: true })}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.connection")}</div></div>
          ${this.kv("wifi_signal_strength", 0)} ${this.kv("bluetooth_status", 0, { raw: true })}
          ${this.kv("device_ip_address", 0, { raw: true })} ${this.kv("gateway_ip_address", 0, { raw: true })}
          ${this.kv("ble_mac_address", 0, { raw: true })}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.faults")}</div></div>
          ${FAULT_KEYS.map((key) =>
            this.kv(key, 0, { tone: r.num(key) ? "crit" : "ok" }),
          )}
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head"><div class="label">${t("system.control")}</div></div>
          ${this.kv("set_charge_power", 0)} ${this.kv("set_discharge_power", 0)}
          ${this.kv("max_charge_power", 0)} ${this.kv("max_discharge_power", 0)}
          ${this.kv("charge_to_soc", 0)}
          ${this.ceilingNote()}
        </div>

        <div class="panel">
          <div class="head"><div class="label">${t("system.thermal")}</div></div>
          ${this.kv("internal_temperature", 1)} ${this.kv("internal_mos1_temperature", 1)}
          ${this.kv("max_cell_temperature", 1)} ${this.kv("min_cell_temperature", 1)}
          ${this.kv("battery_voltage", 2)} ${this.kv("battery_current", 2)}
          ${this.kv("ac_voltage", 1)} ${this.kv("ac_frequency", 2)}
        </div>
      </div>
    `;
  }

  /**
   * charge_to_soc doubles as the panel's charge ceiling, but only inside its
   * own 10-100 range. Saying so here keeps the reader from wondering why a
   * displayed 0 has no effect anywhere else.
   */
  private ceilingNote() {
    const value = this.reader.num("charge_to_soc");
    if (value === null) return nothing;
    const usable = value >= 10 && value <= 100;
    return html`
      <div class="note">
        ${usable
          ? this.t("system.ceiling_used", { value: this.fmt.num(value, 0) })
          : this.t("system.ceiling_ignored", { value: this.fmt.num(value, 0) })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-system": MkViewSystem;
  }
}
