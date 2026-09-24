/**
 * Writing back to the battery.
 *
 * Everything the control tab changes goes through here, so the views stay
 * free of Home Assistant service calls and there is one place that knows how
 * a register key becomes an entity id.
 */

import type { HomeAssistant } from "./types";
import type { DeviceReader } from "./entities";

export class DeviceControls {
  constructor(
    private readonly hass: HomeAssistant,
    private readonly reader: DeviceReader,
  ) {}

  private call(domain: string, service: string, key: string, data: Record<string, unknown>) {
    const entity_id = this.reader.entityId(key);
    if (!entity_id) return;
    // Failures surface as the value simply not changing: the control shows
    // pending until the state comes back, and stays there if it never does.
    // The promise is returned for the callers that report a refusal.
    return this.hass.callService(domain, service, { entity_id, ...data });
  }

  setNumber(key: string, value: number) {
    return this.call("number", "set_value", key, { value });
  }

  selectOption(key: string, option: string) {
    return this.call("select", "select_option", key, { option });
  }

  /**
   * Days and/or window of a schedule slot in one step. `key` is any entity
   * of the slot. The integration validates the slot as a whole and rejects
   * a dead window or an overlap with the error's translation key.
   */
  setSchedule(
    key: string,
    data: { days?: string[]; start?: number; end?: number },
  ) {
    const entity_id = this.reader.entityId(key);
    if (!entity_id) return Promise.resolve();
    return this.hass.callWS({ type: "marstek_modbus/schedule/set", entity_id, ...data });
  }

  setSwitch(key: string, on: boolean) {
    return this.call("switch", on ? "turn_on" : "turn_off", key, {});
  }

  press(key: string) {
    this.call("button", "press", key, {});
  }
}
