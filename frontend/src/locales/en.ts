/**
 * English catalogue. Bundled with the panel because it is the fallback for
 * every key another language has not translated yet.
 *
 * Only structural text lives here. Everything that names a measurement comes
 * from the entity itself, which Home Assistant has already translated through
 * the integration's own translation files.
 */
export const en: Record<string, string> = {
  "tab.core": "CORE",
  "tab.cells": "CELLS",
  "tab.packs": "PACKS",
  "tab.solar": "SOLAR",
  "tab.energy": "ENERGY",
  "tab.system": "SYSTEM",

  "status.modbus": "MODBUS",
  "status.wifi": "WIFI",
  "status.cloud": "CLOUD",
  "status.cloud_off": "CLOUD OFF",
  "status.discharging": "DISCHARGING",
  "status.charging": "CHARGING",
  "status.idle": "IDLE",

  "core.electrical": "Electrical · now",
  "core.reserve": "Reserve · lifetime",
  "core.stored": "Stored",
  "core.capacity": "Capacity",
  "core.soc_bms": "SOC · BMS",
  "core.soc_usable": "usable {value} %",
  "core.discharging_to_house": "discharging",
  "core.charging_from_grid": "charging",
  "core.at_rest": "at rest",
  "core.today_charged": "Charged today",
  "core.today_discharged": "Discharged today",
  "core.cell_delta": "Cell delta",
  "core.internal_temp": "Internal temperature",
  "core.mppt_total": "MPPT total",
  "core.pack_spread": "across {count} packs",
  "core.no_delta": "no per-pack readings",

  "empty.no_device": "No Marstek battery found",
  "empty.no_device_hint":
    "This panel reads the Marstek Venus Modbus integration. Add a battery there first.",
  "empty.not_ready": "Waiting for the first reading…",

  "common.unavailable": "—",
  "common.device": "Device",
};
