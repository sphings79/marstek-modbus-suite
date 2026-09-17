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

  /**
   * The state without the unavailable/unknown filter.
   *
   * Controls need this: a schedule whose day has never been set reads
   * "unknown", and a picker still has to render for it.
   */
  rawState(key: string): HassEntity | null {
    const id = this.device.byKey[key];
    return (id && this.hass.states[id]) || null;
  }

  /**
   * An attribute of the entity, whatever its state. This is how the controls
   * learn their own bounds - a Venus A caps at 1500 W and a Venus D at 2500,
   * and reading min/max/step means neither is hard-coded anywhere.
   */
  attr<T>(key: string, name: string, fallback: T): T {
    const value = this.rawState(key)?.attributes[name];
    return (value as T) ?? fallback;
  }

  /** True when the entity exists and is not currently unavailable. */
  writable(key: string): boolean {
    const entity = this.rawState(key);
    return !!entity && entity.state !== "unavailable";
  }

  /**
   * The entity's own name, already translated by Home Assistant, with the
   * device name taken off the front.
   *
   * Home Assistant composes friendly_name as "<device> <entity>". The device
   * is named once in the header, so carrying it on every row would push the
   * part that differs off the edge.
   */
  label(key: string): string {
    const full = this.hass.states[this.device.byKey[key] ?? ""]?.attributes.friendly_name;
    if (!full) return key;
    const prefix = this.device.name;
    if (prefix && full.startsWith(prefix) && full.length > prefix.length + 1) {
      return full.slice(prefix.length).trim();
    }
    return full;
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

  /**
   * The first of these keys the device actually has.
   *
   * Some readings changed key on the models where the old name turned out to
   * describe the wrong thing - the AC-side energy counters on the Venus A and
   * D, which the E models keep under their original names because there they
   * really are battery flows. Views name both and take whichever exists.
   */
  firstKey(keys: string[]): string | null {
    return keys.find((key) => this.entityId(key)) ?? null;
  }

  /**
   * How many battery packs are actually stacked.
   *
   * The register map describes every block the firmware serves — seven on the
   * Venus D and A — so counting it would show seven packs to somebody who has
   * three. A pack that is not there answers its whole block with zeros, and a
   * block the integration was told not to poll has no state at all, so the
   * readings are what settles it: the highest pack index reporting a cell
   * voltage. Highest rather than "up to the first gap", so a pack that drops
   * out for one cycle does not take the ones behind it off the screen.
   *
   * With no reading at all — the battery is unreachable — the mapped count
   * stands in, so the view keeps its shape instead of collapsing to nothing.
   */
  packCount(): number {
    let mapped = 0;
    while (this.device.byKey[`battery_${mapped + 1}_max_cell_voltage`]) mapped++;

    let reporting = 0;
    for (let pack = 1; pack <= mapped; pack++) {
      const cellVoltage = this.num(`battery_${pack}_max_cell_voltage`);
      if (cellVoltage !== null && cellVoltage > 0) reporting = pack;
    }
    return reporting || mapped;
  }
}
