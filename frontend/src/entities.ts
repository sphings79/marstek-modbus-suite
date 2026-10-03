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
 * battery_N_mos_status: which of the pack's two MOSFETs conduct. 0 both off,
 * 1 only the charge MOSFET, 2 only the discharge MOSFET, 3 both. Any value
 * from 1 up means the pack is switched in and its voltage and current
 * registers carry a reading.
 */
export const MOS_OFF = 0;
export const MOS_CHARGE_ONLY = 1;
export const MOS_DISCHARGE_ONLY = 2;
export const MOS_BOTH = 3;

/** True for a status at which the pack is switched in. */
export const mosConducts = (status: number | null): boolean =>
  status !== null && status >= MOS_CHARGE_ONLY && status <= MOS_BOTH;

/**
 * Keys that were renamed on the models whose register map was corrected
 * against the firmware, the corrected name first. The other models still use
 * the old name, so a view asks for both and takes whichever exists.
 */
export const CAPACITY_KEYS = ["battery_rated_capacity", "battery_total_energy"];
export const MIN_CELL_TEMP_KEYS = ["battery_1_min_cell_temperature", "min_cell_temperature"];
export const MODEL_KEYS = ["device_model", "device_name"];
export const INVERTER_VERSION_KEYS = ["vns_version", "vms_version"];
/**
 * The two inverter temperatures. The Venus A and E v3 keep the register key
 * but give the entity a translation key that names the sensor it really is,
 * and the panel looks entities up by translation key.
 */
export const INTERNAL_TEMP_KEYS = [
  "internal_temperature",
  "inverter_radiator_1_temperature",
  "inverter_temperature_ntc_ch12",
];
export const INTERNAL_MOS1_TEMP_KEYS = [
  "internal_mos1_temperature",
  "inverter_radiator_2_temperature",
  "inverter_temperature_ntc_ch5",
];
/** Power register of schedule slot `i`. */
export const schedulePowerKeys = (i: number) => [`schedule_${i}_power`, `schedule_${i}_mode`];

/**
 * Keys only the Venus E v1/v2 register map has, and keys only the corrected
 * maps (Venus D, A, E v3) have. All of them are enabled by default.
 */
const LEGACY_E_KEYS = ["device_name", "software_version", "battery_total_energy", "schedule_1_mode"];
const CURRENT_MAP_KEYS = ["device_model", "vns_version", "battery_rated_capacity", "schedule_1_power"];

/**
 * Per-pack readings that the single-pack Venus E v3 serves without a pack
 * index. Asking for pack 1 on such a model resolves to these.
 */
const SINGLE_PACK_ALIASES: Record<string, string> = {
  soc: "battery_soc",
  max_cell_voltage: "max_cell_voltage",
  min_cell_voltage: "min_cell_voltage",
  voltage: "battery_voltage",
  current: "battery_current",
  cycle_count: "battery_cycle_count",
  bms_version: "bms_version",
};

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

  /** The device registry id, which is what a service call targets. */
  get deviceId(): string {
    return this.device.deviceId;
  }

  /**
   * True for a Venus E v1/v2. Told apart by keys, because the device
   * registry names every model the same: the old map keeps names the
   * corrected maps of the Venus D, A and E v3 renamed.
   */
  isLegacyE(): boolean {
    if (CURRENT_MAP_KEYS.some((key) => this.entityId(key))) return false;
    return LEGACY_E_KEYS.some((key) => this.entityId(key));
  }

  /**
   * True for a model with one fixed pack and no per-pack blocks: the Venus E
   * v1/v2 and E v3. The Venus D and A serve a block per pack, and their
   * pack 1 SOC is enabled by default.
   */
  isSinglePack(): boolean {
    return (
      !this.entityId("battery_soc_1") &&
      !this.entityId("battery_1_max_cell_voltage") &&
      !!this.entityId("battery_soc")
    );
  }

  /**
   * The key of one per-pack reading, `field` named without the pack part
   * ("soc", "max_cell_voltage", "mos_status" ...).
   *
   * The multi-pack maps index most readings as battery_N_<field>, the SOC as
   * battery_soc_N. The single-pack Venus E v3 indexes some readings as pack 1
   * and serves the rest without an index; for pack 1 of such a model this
   * falls back to the unindexed key. A key that exists nowhere is returned in
   * its indexed form, so callers read null from it as before.
   */
  packKey(pack: number, field: string): string {
    const indexed = field === "soc" ? `battery_soc_${pack}` : `battery_${pack}_${field}`;
    if (this.entityId(indexed) || pack !== 1) return indexed;
    const alias = SINGLE_PACK_ALIASES[field];
    if (alias && this.entityId(alias) && this.isSinglePack()) return alias;
    return indexed;
  }

  /** Shorthand for the number behind `packKey`. */
  packNum(pack: number, field: string): number | null {
    return this.num(this.packKey(pack, field));
  }

  /**
   * The decoded bits of a bit-word sensor, from the `active_faults` attribute
   * the integration sets on every sensor with bit descriptions (and on their
   * text companions). Null when the entity carries no such attribute.
   */
  activeFaults(key: string): string[] | null {
    const value = this.state(key)?.attributes.active_faults;
    return Array.isArray(value) ? value.map((item) => String(item)) : null;
  }

  /**
   * The number behind a sensor whose state is a mapped text, from the
   * `raw_value` attribute the integration sets on every such sensor (and on the
   * bit-word text companions). Null when the entity is missing or unavailable,
   * or carries no such attribute - an entity of an older integration build, for
   * which a caller falls back to matching the state text.
   */
  rawValue(key: string): number | null {
    const value = this.state(key)?.attributes.raw_value;
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  }

  /**
   * A fault or warning code as a number.
   *
   * A sensor that maps its codes to a text (the MPPT codes of the Venus A)
   * has the text as its state and the code in `raw_value`; a plain sensor has
   * the code as its state. Both read as the same number here.
   */
  code(key: string): number | null {
    return this.rawValue(key) ?? this.num(key);
  }

  /** The text a code-mapping sensor shows; null when its state is a plain number. */
  codeText(key: string): string | null {
    const text = this.str(key);
    return text !== null && !Number.isFinite(Number(text)) ? text : null;
  }

  /**
   * Plain-text causes of a raised fault word.
   *
   * The word's own decoded bits where it has them, otherwise those of its
   * `<key>_description` text companion, which the Venus D, A and E v3 keep
   * beside fault_status, fault_status_low and fault_status_2_low. Empty when
   * neither is there - the companion of fault_status_2_low is disabled by
   * default - and the caller falls back to the label.
   */
  faultTexts(key: string): string[] {
    return this.activeFaults(key) ?? this.activeFaults(`${key}_description`) ?? [];
  }

  /** A binary sensor that exists and reads "on". */
  isOn(key: string): boolean {
    return this.state(key)?.state === "on";
  }

  /**
   * Button entities of this device, as register keys. Every button the
   * integration created for the device and the user has enabled; disabled
   * entities are not in the registry list Home Assistant gives the frontend,
   * so they never appear here. Buttons the integration no longer provides -
   * the DEV set after the DEV option was turned off - stay in the registry
   * as orphans and are left out too.
   */
  buttonKeys(): string[] {
    return Object.entries(this.device.byKey)
      .filter(([key, entityId]) => entityId.startsWith("button.") && !this.isOrphan(key))
      .map(([key]) => key);
  }

  /**
   * True for an entity left behind in the registry by an older register map:
   * Home Assistant restores it as unavailable with `restored: true`, because
   * nothing provides it any more (the seventh pack block of an upgraded Venus
   * A, for one).
   */
  isOrphan(key: string): boolean {
    return this.rawState(key)?.attributes.restored === true;
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
   * learn their own bounds - a Venus A caps at 1450 W and a Venus D at 2500,
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

  /** The numeric value of the first of these keys the device has. */
  numFirst(keys: string[]): number | null {
    const key = this.firstKey(keys);
    return key ? this.num(key) : null;
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
    const solar = this.num("solar_power_total");

    const charging = battery !== null && battery > idle;
    const delivering = ac !== null && ac > idle;
    // The strings have to be producing, or the name makes a claim about where
    // the energy comes from that nothing checked. It also keeps the label off
    // the two Venus E generations, which have no PV input and no
    // solar_power_total: charging and delivering at once means something else
    // on a device with nothing on the DC bus but its packs.
    const fromSolar = solar !== null && solar > idle;

    // Typed as a plain function rather than the views' Translate, so this file
    // stays free of a dependency on the view layer. Callers all have one.
    if (fromSolar && charging && delivering) {
      return t ? t("core.pv_passthrough") : "PV Passthrough";
    }

    return this.str("inverter_state");
  }

  /**
   * How many cells one pack has, counted rather than assumed.
   *
   * The Venus D and E v3 carry 16 per pack and the Venus A 13. Both firmwares
   * declare 16 slots; the A's hardware simply does not fill them, so the only
   * thing that is right on every model is what the register map names.
   *
   * The cell entities are disabled by default, and Home Assistant leaves
   * disabled entities out of what it hands the frontend, so this reads 0
   * until the user enables them - the views then leave the cell count out.
   * The highest index rather than a stop at the first gap: one cell entity the
   * user left disabled must not take the cells behind it off the count.
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
   * The multi-pack models switch one pack in at a time and leave the rest
   * off, so only that pack's voltage and current registers mean anything -
   * d.yaml records pack 2 at -45.9 A while pack 1's register sat at 0. A pack
   * is switched in at any MOSFET status from 1 up (charge only, discharge
   * only, both). A pack with both MOSFETs closed is preferred; during the
   * handover two packs can report a single MOSFET for a few seconds, and then
   * the first of them is shown.
   */
  conductingPack(): number | null {
    let partial: number | null = null;
    for (let pack = 1; pack <= this.packCount(); pack++) {
      const status = this.packNum(pack, "mos_status");
      if (status === MOS_BOTH) return pack;
      if (partial === null && mosConducts(status)) partial = pack;
    }
    return partial;
  }

  /**
   * How many battery packs are actually stacked.
   *
   * The register map describes every block the firmware serves - seven on the
   * Venus D, six on the Venus A - so counting it would show seven packs to
   * somebody who has three. A pack that is not there answers its whole block
   * with zeros, and a block the integration was told not to poll has no state
   * at all, so the readings are what settles it: the highest pack index
   * reporting a cell voltage. Highest rather than "up to the first gap", so a
   * pack that drops out for one cycle does not take the ones behind it off the
   * screen.
   *
   * Pack blocks an older register map left behind in the registry (restored
   * as orphans) are not counted. With no reading at all - the battery is
   * unreachable - the mapped count stands in, so the view keeps its shape
   * instead of collapsing to nothing. A model with one fixed pack and no pack
   * blocks (Venus E) has exactly one.
   */
  packCount(): number {
    let mapped = 0;
    while (this.device.byKey[`battery_${mapped + 1}_max_cell_voltage`]) mapped++;
    if (mapped === 0) return this.isSinglePack() ? 1 : 0;

    let provided = mapped;
    while (provided > 0 && this.isOrphan(`battery_${provided}_max_cell_voltage`)) provided--;
    // Every block restored: the integration is not running at all, and the
    // registry is the only description of the battery left.
    if (provided === 0) provided = mapped;

    let reporting = 0;
    for (let pack = 1; pack <= provided; pack++) {
      const cellVoltage = this.num(`battery_${pack}_max_cell_voltage`);
      if (cellVoltage !== null && cellVoltage > 0) reporting = pack;
    }
    return reporting || provided;
  }
}
