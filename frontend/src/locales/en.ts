/**
 * English catalogue. Bundled with the panel because it is the fallback for
 * every key another language has not translated yet.
 *
 * Only structural text lives here. Everything that names a measurement comes
 * from the entity itself, which Home Assistant has already translated through
 * the integration's own translation files.
 */
export const en: Record<string, string> = {
  "tab.core": "OVERVIEW",
  "tab.cells": "CELLS",
  "tab.packs": "PACKS",
  "tab.solar": "SOLAR",
  "tab.energy": "ENERGY",
  "tab.system": "SYSTEM",

  "status.modbus": "MODBUS",
  "status.wifi": "WIFI",

  "common.pack": "PACK",
  "common.device": "Device",

  // ---- overview ----
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

  // ---- cells ----
  "cells.highest": "Highest cell",
  "cells.lowest": "Lowest cell",
  "cells.in_pack": "pack {pack}",
  "cells.stack_spread": "Spread across stack",
  "cells.limit_hint": "100 mV is the usual limit",
  "cells.mean_delta": "Mean delta in pack",
  "cells.worst_pack": "widest: pack {pack}, {value} mV",
  "cells.temp_span": "Cell temperature span",
  "cells.packs_online": "Packs reporting",
  "cells.cells_total": "{count} cells",
  "cells.matrix_title": "Cell voltage range per pack · shared axis",
  "cells.matrix_axis": "bar = lowest to highest cell",
  "cells.matrix_legend":
    "The tick inside each bar is the pack's midpoint. A narrow bar is a balanced pack, a wide one is drift inside it, and a bar sitting apart from the others is a pack at a different level than the rest.",
  "cells.no_ranges": "This battery reports no per-pack cell voltages.",
  "cells.protection": "Protection and faults",
  "cells.protection_all": "Protection · all {count} packs",
  "cells.clear": "clear",
  "cells.raised": "raised",
  "cells.bms": "BMS",
  "cells.bms_version": "BMS version",
  "cells.uniform": "same on every pack",

  // ---- packs ----
  "packs.device_reading": "as the device reports it",
  "packs.mean_soc": "Mean of the packs",
  "packs.from_n_packs": "from {count} packs",
  "packs.spread": "Spread",
  "packs.stored_total": "Stored energy",
  "packs.summed": "packs add up to {value} kWh",
  "packs.per_pack": "Per pack",
  "packs.nominal": "nominal, capacity ÷ packs",
  "packs.cycles_sum": "Cycles, all packs",
  "packs.cycles_partial": "{have} of {total} packs report",
  "packs.fill_title": "State of charge per pack",
  "packs.fill_axis": "column height = SOC · figure inside = kWh",
  "packs.fill_legend":
    "The dashed line marks the discharge floor at {floor} %. Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.",
  "packs.fill_legend_nofloor":
    "Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.",
  "packs.none": "This battery reports no per-pack state of charge.",
  "packs.table_title": "Every pack in detail",
  "packs.table_legend":
    "Highlighted rows sit more than 5 points away from the median pack. A pack that reports a high SOC at a low cell voltage is worth a second look: the two readings disagree.",
  "packs.col_soc": "SOC",
  "packs.col_energy": "kWh",
  "packs.col_min": "Cell min",
  "packs.col_max": "Cell max",
  "packs.col_delta": "Delta",
  "packs.col_voltage": "Voltage",
  "packs.col_current": "Current",
  "packs.col_cycles": "Cycles",
  "packs.col_mos": "MOSFET",
  "packs.col_env": "Ambient",
  "packs.col_ntc": "NTC 1–4",

  // ---- solar ----
  "solar.active": "ACTIVE",
  "solar.floating": "FLOATING",
  "solar.summary": "All inputs",
  "solar.some_active": "carrying power",
  "solar.all_idle": "nothing connected",
  "solar.note_active":
    "Voltage follows the panels and power follows the sun through the day.",
  "solar.note_floating":
    "All inputs sit at a low voltage without current, which is what an unused MPPT input looks like. Connect panels and the voltage rises to module level.",
  "solar.diagnostics": "Diagnostics",
  "solar.channels_reporting": "Inputs reporting",
  "solar.none": "This battery has no MPPT inputs.",

  // ---- energy ----
  "energy.today": "Today",
  "energy.month": "This month",
  "energy.lifetime": "Since commissioning",
  "energy.charged": "charged kWh",
  "energy.discharged": "discharged kWh",
  "energy.loss": "Loss",
  "energy.returned": "Returned",
  "energy.rte": "RTE",
  "energy.efficiency": "Efficiency compared",
  "energy.throughput": "Throughput and wear",
  "energy.gap_hint":
    "The monthly figure sits {value} points below the lifetime one. That gap is not conversion loss but standby draw between cycles: the shallower the cycling, the heavier it weighs.",

  // ---- system ----
  "system.no_faults": "No fault register is raised.",
  "system.faults_raised": "Raised: {list}",
  "system.device": "Device",
  "system.packs": "Battery packs",
  "system.firmware": "Firmware",
  "system.connection": "Connection",
  "system.faults": "Fault registers",
  "system.control": "Control and limits",
  "system.thermal": "Thermal and electrical",
  "system.ceiling_used":
    "The panel treats {value} % as the charge ceiling, read from this register.",
  "system.ceiling_ignored":
    "This register reads {value} %, outside its own 10-100 range, so the device is not using it. The panel charges towards 100 % instead.",

  // ---- empty states ----
  "empty.no_device": "No Marstek battery found",
  "empty.no_device_hint":
    "This panel reads the Marstek Modbus Suite integration. Add a battery there first.",

  "common.unavailable": "—",
};
