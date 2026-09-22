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
/** MOSFET status of a pack whose contactors are closed and conducting. */
export const MOS_CONDUCTING = 3;

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
   * The inverter state, corrected where the device's own word misleads.
   *
   * Register 35100 knows Charge and Discharge and nothing in between, and it
   * calls delivering to the house Discharge whether the energy comes from the
   * packs or straight off the strings. A battery charging from surplus while
   * the rest of the array feeds the house therefore reports Discharge, which is
   * the reading people notice and report as a fault.
   *
   * Taking in and giving out at once is reported here as PV passthrough, a name
   * this panel gives it rather than one the device offers. The register's own
   * state 6 is a different situation entirely - it appears when the backup
   * socket is switched on with a load on it and that load is being carried by
   * the grid, which is why it now reads Backup Passthrough. Nothing in the
   * register distinguishes the PV case, so it can only be derived.
   *
   * Everything else passes through untouched: this corrects one specific
   * confusion rather than second-guessing the device. The system tab
   * deliberately shows the raw state instead, because a diagnostics view should
   * report the register, not an interpretation of it.
   */
  inverterState(t?: (key: string) => string): string | null {
    // Below this many watts a flow is noise rather than a direction; a Venus D
    // draws around 18 W doing nothing.
    const idle = 30;
    const battery = this.num("battery_power");
    const ac = this.num("ac_power");

    const charging = battery !== null && battery > idle;
    const delivering = ac !== null && ac > idle;
    // Typed as a plain function rather than the views' Translate, so this file
    // stays free of a dependency on the view layer. Callers all have one.
    if (charging && delivering) return t ? t("core.pv_passthrough") : "PV Passthrough";

    return this.str("inverter_state");
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
  /**
   * How many cells one pack has, counted rather than assumed.
   *
   * The Venus D and E v3 carry 16 per pack and the Venus A 13. Both firmwares
   * declare 16 slots; the A's hardware simply does not fill them, so the only
   * thing that is right on every model is what the register map names.
   *
   * The highest index rather than a stop at the first gap, for the same reason
   * packCount below works that way: one entity the user disabled must not take
   * the cells behind it off the count.
   */
  cellsPerPack(): number {
    let highest = 0;
    for (let cell = 1; cell <= 32; cell++) {
      if (this.device.byKey[`battery_1_cell_${cell}_voltage`]) highest = cell;
    }
    return highest;
  }

  /**
   * The pack that is carrying the current, or null when none of them is.
   *
   * The multi-pack models close one pack's MOSFETs at a time and leave the
   * rest open, so only that pack's voltage and current registers mean
   * anything - d.yaml records pack 2 at -45.9 A while pack 1's register sat
   * at 0. The first conducting pack wins: during the handover two of them
   * report 2 rather than 3, and 3 on two packs at once has not been seen.
   */
  conductingPack(): number | null {
    for (let pack = 1; pack <= this.packCount(); pack++) {
      if (this.num(`battery_${pack}_mos_status`) === MOS_CONDUCTING) return pack;
    }
    return null;
  }

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
