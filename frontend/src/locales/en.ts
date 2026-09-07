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

  // ---- control ----
  "tab.control": "CONTROL",
  "control.power": "Power now",
  "control.power_hint":
    "These two set the working point directly. Anything that regulates the battery from outside — a zero-feed-in automation, an energy manager — writes the same registers and will win within seconds.",
  "control.limits": "Limits",
  "control.mode": "Mode",
  "control.backup_hint": "Keeps a reserve for the off-grid output.",
  "control.rs485_hint":
    "Switching this off hands control back to the device, and this page stops having any effect.",
  "control.overwritten":
    "Something else changed {names} right after this panel did. An external controller is writing the same registers.",
  "control.schedules": "Schedules",
  "control.schedules_axis": "times are the device's own, in its local time",
  "control.schedules_hint":
    "A schedule needs a window, a power and a day before switching it on does anything. Power is signed: the sign decides the direction. The device takes one day per schedule, not a set of them.",
  "control.no_schedules": "This battery exposes no schedules.",
  "control.window": "Window",
  "control.sched_power": "Power",
  "control.days": "Day",
  "control.active": "On",
  "control.unset": "not set",
  "control.device": "Device",
  "control.reset": "Restart device",
  "control.reset_confirm": "Really restart",
  "control.cancel": "Cancel",
  "control.reset_hint":
    "Reconnects after a few seconds. A factory reset is deliberately not offered here — it is in the entity list.",

  "control.opt.manual": "Manual",
  "control.opt.anti_feed": "Anti-feed",
  "control.opt.trade_mode": "Trade",
  "control.opt.standby": "Standby",
  "control.opt.charge": "Charge",
  "control.opt.discharge": "Discharge",

  "control.day.monday": "Mon",
  "control.day.tuesday": "Tue",
  "control.day.wednesday": "Wed",
  "control.day.thursday": "Thu",
  "control.day.friday": "Fri",
  "control.day.saturday": "Sat",
  "control.day.sunday": "Sun",

  "status.modbus": "MODBUS",
  "status.wifi": "WIFI",

  "common.pack": "PACK",
  "common.device": "Device",

  // ---- overview ----
  "core.electrical": "Electrical · now",
  "core.reserve": "Reserve · lifetime",
  "core.stored": "Stored",
  "core.capacity": "Capacity",
  "core.stored_of_total": "Stored / total",
  "core.usable": "Usable",
  "core.to_full": "Room to full",
  "core.runtime": "Runtime",
  "core.to_empty": "Until empty",
  "core.until_full": "Until full",
  "core.packs": "Packs",
  "core.soc_bms": "SOC · BMS",
  "core.soc_usable": "usable {value} %",
  "core.discharging_to_house": "discharging",
  "core.charging_from_grid": "charging",
  "core.at_rest": "at rest",
  "core.today_charged": "Charged today",
  "core.today_discharged": "Discharged today",
  "core.cell_delta": "Largest cell delta",
  "core.internal_temp": "Internal temperature",
  "core.mppt_total": "MPPT total",
  "core.in_pack": "in pack {pack}",
  "core.no_delta": "no per-pack readings",

  // ---- cells ----
  "cells.highest": "Highest cell",
  "cells.lowest": "Lowest cell",
  "cells.in_pack": "pack {pack}",
  "cells.stack_spread": "Spread across stack",
  "cells.stack_hint": "packs charge in turn, so a spread is expected",
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
  "cells.conducting": "Pack conducting",
  "cells.conducting_none": "none — every pack disconnected",
  "cells.conducting_hint":
    "The device works one pack at a time and closes that pack's MOSFETs while it does. A pack listed here is doing the work, not reporting a fault.",
  "cells.mos_unexpected": "unexpected MOSFET status",
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
  "packs.fill_legend_backup": "The dotted line at {backup} % is as far as the backup socket discharges during an outage.",
  "packs.fill_legend_nofloor":
    "Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.",
  "packs.none": "This battery reports no per-pack state of charge.",
  "packs.table_title": "Every pack in detail",
  "packs.table_legend":
    "Highlighted rows sit {points} points or further from the median pack. A pack that reports a high SOC at a low cell voltage is worth a second look: the two readings disagree.",
  "packs.conducting": "conducting now",
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
  "energy.rte": "Round trip",
  "energy.rte_hint":
    "Round-trip efficiency is how much of the energy put into the battery comes back out of it. Conversion efficiency is the loss in the moment, at the current operating point.",
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

  // ---- settings ----
  "settings.title": "Settings",
  "settings.scheme": "Colour scheme",
  "settings.scheme_hint":
    "Each scheme brings its own light and dark version. The swatch is painted in the scheme it offers.",
  "settings.scheme_theme": "follows your theme",
  "settings.appearance": "Appearance",
  "settings.mode": "Light or dark",
  "settings.mode.auto": "Home Assistant",
  "settings.mode.dark": "Dark",
  "settings.mode.light": "Light",
  "settings.mode_ha":
    "This scheme takes its colours from your Home Assistant theme, which already decides light or dark.",
  "settings.digits": "Decimal places",
  "settings.digits.normal": "Normal",
  "settings.digits.more": "One more",
  "settings.start_tab": "Tab when opening",
  "settings.start_tab.last": "Last used",
  "settings.start_tab_hint":
    "A fixed tab that the battery cannot fill falls back to the overview.",
  "settings.tabs": "Tabs",
  "settings.tabs_hint":
    "Greyed out means this battery does not report what the tab shows, so hiding it is not a choice you have to make.",
  "settings.always": "always shown",
  "settings.unavail.cells": "no per-cell voltages",
  "settings.unavail.packs": "no state of charge per pack",
  "settings.unavail.solar": "no PV inputs",
  "settings.unavail.control": "no writable registers",
  "settings.storage": "Stored settings",
  "settings.reset": "Reset to defaults",
  "settings.transfer": "Import / export",
  "settings.transfer_hint": "Copy this out, paste it into another browser.",
  "settings.transfer_bad": "That is not a settings object.",
  "settings.import": "Apply pasted",
  "settings.export_again": "Show current",
  "settings.storage_hint":
    "These settings live in this browser only. Another browser, or another device, keeps its own.",

  // ---- empty states ----
  "empty.no_device": "No Marstek battery found",
  "empty.no_device_hint":
    "This panel reads the Marstek Modbus Suite integration. Add a battery there first.",

  "common.unavailable": "—",
};
