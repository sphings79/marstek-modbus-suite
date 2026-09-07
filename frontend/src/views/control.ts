import { html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { MkView } from "./view-base";
import { baseStyles } from "../styles";
import type { DeviceControls } from "../controls";
import type { ScheduleRow } from "../components/mk-schedule";
import "../components/mk-slider";
import "../components/mk-segment";
import "../components/mk-toggle";
import "../components/mk-schedule";

const POWER_KEYS = ["set_charge_power", "set_discharge_power"];
const LIMIT_KEYS = ["max_charge_power", "max_discharge_power"];
const SCHEDULES = [1, 2, 3, 4, 5, 6];

/** Seconds within which an outside change counts as having overwritten us. */
const OVERWRITE_WINDOW_S = 30;

@customElement("mk-view-control")
export class MkViewControl extends MkView {
  @property({ attribute: false }) controls!: DeviceControls;

  /** Keys this panel wrote to, and when, to notice when something else wins. */
  @state() private wrote: Record<string, number> = {};
  @state() private confirmReset = false;

  static styles = [
    baseStyles,
    css`
      .top {
        grid-template-columns: 1fr 1fr 1fr;
      }
      @media (max-width: 1200px) {
        .top {
          grid-template-columns: 1fr;
        }
      }
      .stack > * + * {
        margin-top: 18px;
      }
      .below {
        margin-top: var(--mk-gap);
        grid-template-columns: 1fr;
      }
      .warn-note {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 10px 13px;
        border: 1px solid var(--mk-warn);
        background: var(--mk-surface-2);
        margin-bottom: var(--mk-gap);
        font-family: var(--mk-mono);
        font-size: 11px;
        line-height: 1.6;
        color: var(--mk-fg-2);
      }
      .warn-note b {
        color: var(--mk-warn);
        flex: none;
      }
      .danger {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
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
      button.action.confirm {
        border-color: var(--mk-crit);
        color: var(--mk-crit);
      }
      button.action:focus-visible {
        outline: 2px solid var(--mk-accent);
        outline-offset: 2px;
      }
    `,
  ];

  private note(key: string) {
    this.wrote = { ...this.wrote, [key]: Date.now() };
  }

  /**
   * True when the value changed after we wrote it, within the window.
   *
   * An external controller writing the same registers - a zero-feed-in
   * regulation, say - will overwrite anything set here within seconds. Better
   * to say so than to let the reader think the control is broken.
   */
  private overwritten(key: string): boolean {
    const at = this.wrote[key];
    if (!at) return false;
    const changed = this.reader.rawState(key)?.last_updated;
    if (!changed) return false;
    const delta = (new Date(changed).getTime() - at) / 1000;
    return delta > 0.5 && delta < OVERWRITE_WINDOW_S;
  }

  private slider(key: string) {
    const r = this.reader;
    if (!r.entityId(key)) return nothing;
    return html`
      <mk-slider
        label=${r.label(key)}
        .value=${r.num(key)}
        .min=${r.attr(key, "min", 0)}
        .max=${r.attr(key, "max", 100)}
        .step=${r.attr(key, "step", 1)}
        unit=${r.unit(key)}
        ?disabled=${!r.writable(key)}
        .formatNumber=${(v: number | null) => this.fmt.num(v, 0)}
        .onCommit=${(value: number) => {
          this.note(key);
          this.controls.setNumber(key, value);
        }}
      ></mk-slider>
    `;
  }

  private segment(key: string) {
    const r = this.reader;
    if (!r.entityId(key)) return nothing;
    const options = r.attr<string[]>(key, "options", []);
    return html`
      <mk-segment
        label=${r.label(key)}
        .value=${r.rawState(key)?.state ?? null}
        .options=${options.map((value) => ({
          value,
          label: this.t(`control.opt.${value}`),
        }))}
        ?disabled=${!r.writable(key)}
        .onSelect=${(option: string) => {
          this.note(key);
          this.controls.selectOption(key, option);
        }}
      ></mk-segment>
    `;
  }

  private toggle(key: string, hintKey: string) {
    const r = this.reader;
    if (!r.entityId(key)) return nothing;
    const raw = r.rawState(key);
    return html`
      <mk-toggle
        label=${r.label(key)}
        hint=${this.t(hintKey)}
        .checked=${raw && raw.state !== "unavailable" ? raw.state === "on" : null}
        .onToggle=${(on: boolean) => {
          this.note(key);
          this.controls.setSwitch(key, on);
        }}
      ></mk-toggle>
    `;
  }

  private get scheduleRows(): ScheduleRow[] {
    const r = this.reader;
    return SCHEDULES.filter((i) => r.entityId(`schedule_${i}_start`)).map((i) => {
      const modeKey = `schedule_${i}_mode`;
      const enabled = r.rawState(`schedule_${i}_enabled`);
      return {
        index: i,
        enabled:
          enabled && enabled.state !== "unavailable" ? enabled.state === "on" : null,
        start: r.num(`schedule_${i}_start`),
        end: r.num(`schedule_${i}_end`),
        power: r.num(modeKey),
        powerMin: r.attr(modeKey, "min", -2500),
        powerMax: r.attr(modeKey, "max", 2500),
        powerStep: r.attr(modeKey, "step", 1),
        days: r.rawState(`schedule_${i}_days`)?.state ?? null,
        dayOptions: r.attr<string[]>(`schedule_${i}_days`, "options", []),
      };
    });
  }

  render() {
    const t = this.t;
    const clashes = [...POWER_KEYS, ...LIMIT_KEYS].filter((k) => this.overwritten(k));
    const rows = this.scheduleRows;

    return html`
      ${clashes.length
        ? html`<div class="warn-note">
            <b>!</b>
            <span>
              ${t("control.overwritten", {
                names: clashes.map((k) => this.reader.label(k)).join(", "),
              })}
            </span>
          </div>`
        : nothing}

      <div class="grid top">
        <div class="panel stack">
          <div class="head"><div class="label">${t("control.power")}</div></div>
          ${POWER_KEYS.map((k) => this.slider(k))}
          <div class="note">${t("control.power_hint")}</div>
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${t("control.limits")}</div></div>
          ${LIMIT_KEYS.map((k) => this.slider(k))} ${this.slider("charge_to_soc")}
        </div>

        <div class="panel stack">
          <div class="head"><div class="label">${t("control.mode")}</div></div>
          ${this.segment("user_work_mode")} ${this.segment("force_mode")}
          <div>
            ${this.toggle("backup_function", "control.backup_hint")}
            ${this.toggle("rs485_control_mode", "control.rs485_hint")}
          </div>
        </div>
      </div>

      <div class="grid below">
        <div class="panel">
          <div class="head">
            <div class="label">${t("control.schedules")}</div>
            <div class="label">${t("control.schedules_axis")}</div>
          </div>
          ${rows.length
            ? html`
                <mk-schedule
                  .rows=${rows}
                  .labels=${{
                    window: t("control.window"),
                    power: t("control.sched_power"),
                    days: t("control.days"),
                    active: t("control.active"),
                    unset: t("control.unset"),
                  }}
                  .dayLabel=${(d: string) => t(`control.day.${d}`)}
                  .formatNumber=${(v: number | null) => this.fmt.num(v, 0)}
                  .onEnable=${(i: number, on: boolean) =>
                    this.controls.setSwitch(`schedule_${i}_enabled`, on)}
                  .onTime=${(i: number, which: "start" | "end", hhmm: number) =>
                    this.controls.setNumber(`schedule_${i}_${which}`, hhmm)}
                  .onPower=${(i: number, watts: number) =>
                    this.controls.setNumber(`schedule_${i}_mode`, watts)}
                  .onDays=${(i: number, day: string) =>
                    this.controls.selectOption(`schedule_${i}_days`, day)}
                ></mk-schedule>
              `
            : html`<div class="note">${t("control.no_schedules")}</div>`}
          <div class="note">${t("control.schedules_hint")}</div>
        </div>
      </div>

      ${this.reader.entityId("reset_device")
        ? html`
            <div class="grid below">
              <div class="panel">
                <div class="head"><div class="label">${t("control.device")}</div></div>
                <div class="danger">
                  ${this.confirmReset
                    ? html`
                        <button
                          class="action confirm"
                          @click=${() => {
                            this.controls.press("reset_device");
                            this.confirmReset = false;
                          }}
                        >
                          ${t("control.reset_confirm")}
                        </button>
                        <button class="action" @click=${() => (this.confirmReset = false)}>
                          ${t("control.cancel")}
                        </button>
                      `
                    : html`
                        <button class="action" @click=${() => (this.confirmReset = true)}>
                          ${t("control.reset")}
                        </button>
                      `}
                  <span class="note" style="margin:0">${t("control.reset_hint")}</span>
                </div>
              </div>
            </div>
          `
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mk-view-control": MkViewControl;
  }
}
