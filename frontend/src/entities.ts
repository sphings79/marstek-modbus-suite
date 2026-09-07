/**
 * Resolving register keys to entities.
 *
 * The integration names every entity after the key from its register map and
 * exposes that key as the entity's `translation_key`. Looking entities up by
 * that key instead of by entity id makes the panel independent of what the
 * user called their device, which area it sits in, and which language Home
 * Assistant runs in.
 */

import type { HomeAssistant, HassEntity } from "./types";

export const PLATFORM = "marstek_modbus";

export interface MarstekDevice {
  deviceId: string;
  name: string;
  /** register key -> entity id */
  byKey: Record<string, string>;
}

/** Every configured Marstek battery, in a stable order. */
export function findDevices(hass: HomeAssistant): MarstekDevice[] {
  const devices = new Map<string, MarstekDevice>();

  for (const entry of Object.values(hass.entities)) {
    if (entry.platform !== PLATFORM) continue;
    // Without a device id there is nothing to group by, and without a
    // translation key there is nothing to look the entity up with.
    if (!entry.device_id || !entry.translation_key) continue;

    let device = devices.get(entry.device_id);
    if (!device) {
      const registry = hass.devices[entry.device_id];
      device = {
        deviceId: entry.device_id,
        name: registry?.name_by_user || registry?.name || "Marstek Venus",
        byKey: {},
      };
      devices.set(entry.device_id, device);
    }
    device.byKey[entry.translation_key] = entry.entity_id;
  }

  return [...devices.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Reads values for one device by register key.
 *
 * Every getter returns null when the entity is missing, disabled, or currently
 * unavailable, so a view can decide what to show instead of rendering the
 * string "unavailable" as if it were a measurement.
 */
export class DeviceReader {
  constructor(
    private readonly hass: HomeAssistant,
    private readonly device: MarstekDevice,
  ) {}

  get name(): string {
    return this.device.name;
  }

  entityId(key: string): string | undefined {
    return this.device.byKey[key];
  }

  has(key: string): boolean {
    return this.state(key) !== null;
  }

  /** The raw state object, or null if there is nothing usable to read. */
  state(key: string): HassEntity | null {
    const id = this.device.byKey[key];
    if (!id) return null;
    const entity = this.hass.states[id];
    if (!entity) return null;
    if (entity.state === "unavailable" || entity.state === "unknown") return null;
    return entity;
  }

  num(key: string): number | null {
    const entity = this.state(key);
    if (!entity) return null;
    const value = Number(entity.state);
    return Number.isFinite(value) ? value : null;
  }

  str(key: string): string | null {
    return this.state(key)?.state ?? null;
  }

  unit(key: string): string {
    return this.state(key)?.attributes.unit_of_measurement ?? "";
  }

  /** The entity's own name, already translated by Home Assistant. */
  label(key: string): string {
    return this.hass.states[this.device.byKey[key] ?? ""]?.attributes.friendly_name ?? key;
  }

  /**
   * Sum of several keys, ignoring the ones that are missing. Returns null only
   * when not a single key had a value — four MPPT inputs of which two report
   * should still add up.
   */
  sum(keys: string[]): number | null {
    let total = 0;
    let seen = false;
    for (const key of keys) {
      const value = this.num(key);
      if (value === null) continue;
      total += value;
      seen = true;
    }
    return seen ? total : null;
  }

  /** How many battery packs this device reports, counted from the register map. */
  packCount(): number {
    let count = 0;
    while (this.device.byKey[`battery_${count + 1}_max_cell_voltage`]) count++;
    return count;
  }
}
