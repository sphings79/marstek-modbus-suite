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
    void this.hass.callService(domain, service, { entity_id, ...data });
  }

  setNumber(key: string, value: number) {
    this.call("number", "set_value", key, { value });
  }

  selectOption(key: string, option: string) {
    this.call("select", "select_option", key, { option });
  }

  setSwitch(key: string, on: boolean) {
    this.call("switch", on ? "turn_on" : "turn_off", key, {});
  }

  press(key: string) {
    this.call("button", "press", key, {});
  }
}
