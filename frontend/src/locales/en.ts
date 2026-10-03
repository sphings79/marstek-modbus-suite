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
  "update.available": "A new version of the integration is installed. This page still runs the old one.",
  "update.reload": "Reload",
  "control.power": "Power now",
  "control.power_hint":
    "These two set the working point directly. Anything that regulates the battery from outside — a zero-feed-in automation, an energy manager — writes the same registers and will win within seconds.",
  "control.limits": "Limits",
  "control.limits_hint":
    "After the device restarts these three often read 0. The limit set earlier still applies and does not have to be written again.",
  "control.limits_floor":
    "The two maximum powers start at {min} W and cannot be set to 0; the upper end, {max} W, comes from the device's entity (2500 W on the Venus D and E v3, 1450 W on the Venus A). To stop charging or discharging, set the force mode to standby or the power to 0.",
  "control.mode": "Mode",
  "control.mode_hint":
    "Has no effect while the device is being controlled over Modbus.",
  "control.polling": "Polling",
  "control.polling_hint":
    "Stops this battery being read at all and closes the connection, for a device switched off over the winter. Paused entities either keep their last reading or go unavailable, whichever you pick here. Readings are not restored after a Home Assistant restart.",
  "control.backup_hint": "Switches the backup socket on and off.",
  "control.rs485_hint":
    "Has to be on before the device takes Modbus control at all — from this page, from an automation, or from the integration. Switched off, the device regulates itself again.",
  "control.overwritten":
    "Something else changed {names} right after this panel did. An external controller is writing the same registers.",
  "control.schedules": "Schedules",
  "control.schedules_axis": "times are the device's own, in its local time",
  "control.schedules_hint":
    "A schedule needs a window, a power and at least one day before switching it on does anything. Positive power discharges, negative charges; −1 W runs self-consumption for the window. The end is not part of the window, and a window across midnight never runs - use two schedules. Enabled schedules may not overlap.",
  "control.err.schedule_window":
    "Schedule {slot}: the start has to be before the end. Split a window across midnight into two schedules.",
  "control.err.schedule_overlap":
    "Schedule {slot} would overlap schedule {other} on a shared day. The device runs only the first match.",
  "control.err.schedule_time":
    "Schedule {slot}: start and end are HHMM times with minutes below 60.",
  "control.no_schedules": "This battery exposes no schedules.",
  "control.window": "Window",
  "control.sched_power": "Power",
  "control.days": "Days",
  "control.active": "On",
  "control.device": "Device",
  "control.reset": "Restart device",
  "control.reset_confirm": "Really restart",
  "control.reset_title": "Restart device?",
  "control.reset_message":
    "The battery drops the connection and restarts. Until it is back there are no readings, and it cannot be controlled either. The limits you set still apply afterwards.",
  "control.cancel": "Cancel",

  "control.opt.manual": "Manual",
  "control.opt.anti_feed": "Anti-feed",
  "control.opt.trade_mode": "Trade",
  "control.opt.ai": "AI",
  "control.opt.standby": "Standby",
  "control.opt.charge": "Charge",
  "control.opt.discharge": "Discharge",
  "control.opt.active": "On",
  "control.opt.paused_unavailable": "Paused · entities unavailable",
  "control.opt.paused_frozen": "Paused · entities frozen",

  "control.day.monday": "Mon",
  "control.day.tuesday": "Tue",
  "control.day.wednesday": "Wed",
  "control.day.thursday": "Thu",
  "control.day.friday": "Fri",
  "control.day.saturday": "Sat",
  "control.day.sunday": "Sun",

  "status.modbus": "MODBUS",
  "status.modbus_offline": "MODBUS OFFLINE",
  "status.modbus_offline_since": "MODBUS OFFLINE · last answer {time}",
  "status.modbus_paused": "MODBUS PAUSED",
  "status.modbus_paused_hint":
    "Polling is switched off for this battery. Nothing is being read, and the values below are whatever was last seen.",
  "status.modbus_offline_hint":
    "The battery is not answering. Every value below is the last one read before the link dropped.",
  "status.modbus_degraded": "The link answers, but registers timed out in the last poll.",

  "common.pack": "PACK",
  "common.pack_n": "pack {pack}",
  "common.standby": "standby",
  "common.active_pack": "active pack {pack}",
  "common.active_pack_hint":
    "The pack the battery has switched in right now; the others are idle.",
  "common.voltage": "Voltage",
  "common.current": "Current",
  "common.device": "Device",
  "common.pack_entities_disabled":
    "Some readings of this pack are missing because their entities are disabled by default on this model: cell voltages, pack temperatures, protection and warning words, MOSFET status, battery profile. Enable the ones you want on the device page (Settings → Devices & services → Marstek Modbus Suite → this battery → entities), and they appear here once they report.",

  // ---- overview ----
  "core.electrical": "Electrical · now",
  "core.reserve": "Reserve · lifetime",
  "core.stored": "Stored",
  "core.capacity": "Capacity",
  "core.stored_of_total": "Stored / total",
  "core.usable": "Usable energy",
  "core.to_full": "Energy to full",
  "core.pv_passthrough": "PV Passthrough",
  "core.runtime": "Runtime",
  "core.to_empty": "Until empty",
  "core.until_full": "Until full",
  "core.until_pct": "Until {value} %",
  "core.packs": "Packs",
  "core.soc_bms": "SOC · BMS",
  "core.soc_usable": "usable {value} %",
  "core.discharging_to_house": "discharging",
  "core.charging_from_grid": "charging",
  "core.at_rest": "at rest",
  "core.today_charged": "Charged today",
  "core.today_discharged": "Discharged today",
  "core.cell_delta": "Largest cell delta",
  "core.internal_temp": "Device temperature",
  "core.mppt_total": "MPPT total",
  "core.in_pack": "in pack {pack}",
  "core.no_delta": "no per-pack readings",

  // ---- cells ----
  "cells.highest": "Highest cell",
  "cells.lowest": "Lowest cell",
  "cells.in_pack": "pack {pack}",
  "cells.stack_spread": "Spread across stack",
  "cells.stack_hint": "packs charge and discharge in turn, so a spread is expected",
  "cells.mean_delta": "Mean delta in pack",
  "cells.worst_pack": "widest: pack {pack}, {value} mV",
  "cells.temp_span": "Cell temp. span in pack",
  "cells.temp_span_pack": "widest: pack {pack}, {range}",
  "cells.packs_online": "Detected packs",
  "cells.cells_total": "{count} cells",
  "cells.matrix_title": "Cell voltage range per pack · shared axis",
  "cells.matrix_axis": "bar = lowest to highest cell · fixed axis 3.0 – 3.7 V",
  "cells.matrix_legend":
    "The tick inside each bar is the pack's midpoint. A narrow bar is a balanced pack, a wide one is drift inside it, and a bar sitting apart from the others is a pack at a different level than the rest. The axis is fixed at 3.0 – 3.7 V and only widens, in steps of 0.1 V, when a pack reads outside it.",
  "cells.no_ranges": "This battery reports no per-pack cell voltages.",
  "cells.protection": "Protection and faults",
  "cells.protection_all": "Protection · all {count} packs",
  "cells.clear": "clear",
  "cells.conducting": "Pack conducting",
  "cells.conducting_none": "none — every pack disconnected",
  "cells.conducting_hint":
    "The device works one pack at a time and switches that pack in while it does: charge MOSFET only, discharge MOSFET only, or both. A pack listed here is doing the work, not reporting a fault.",
  "cells.mos_unexpected": "unexpected MOSFET status",
  "cells.mos_off": "both MOSFETs off",
  "cells.mos_charge": "charge only",
  "cells.mos_discharge": "discharge only",
  "cells.mos_both": "charge and discharge",
  "cells.lock_on": "active",
  "cells.lock_off": "inactive",
  "cells.cell_voltages": "Cell voltages",
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
  "packs.of_max": "of {value} kWh possible",
  "packs.per_pack": "Per pack",
  "packs.nominal": "nominal, capacity ÷ packs",
  "packs.cycles_mean": "Cycles",
  "packs.cycles_basis": "mean across packs",
  "packs.cycles_partial": "{have} of {total} packs report",
  "packs.fill_title": "State of charge per pack",
  "packs.fill_axis": "column height = SOC",
  "packs.fill_legend":
    "The dashed line marks the discharge floor at {floor} %. Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.",
  "packs.fill_legend_backup": "The dotted line at {backup} % is as far as the backup socket discharges during an outage.",
  "packs.fill_legend_nofloor":
    "Energy per pack is worked out from its SOC and the nominal pack size; the battery reports no energy figure of its own per pack.",
  "packs.none": "This battery reports no per-pack state of charge.",
  "packs.table_title": "Every pack in detail",
  "packs.table_legend":
    "Nothing is highlighted until the spread above reaches {spread} %; then the packs further than {points} % from the median pack are. While the stack stays together, columns and rows stay quiet. A pack that reports a high SOC at a low cell voltage is worth a second look: the two readings disagree.",
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
  "system.grid_wait":
    "The inverter is waiting for the grid release (alarm word bit 0). This is not a fault; it clears once the grid is accepted.",
  "system.bms_lock_active":
    "BMS lock active: the BMS holds the pack MOSFETs open after a fault, so the battery neither charges nor discharges.",
  "system.bms_factory_mode":
    "BMS factory mode is on: the BMS is not in its normal operating mode.",
  "system.device": "Device",
  "system.packs": "Battery packs",
  "system.firmware": "Firmware",
  "system.connection": "Connection",
  "system.faults": "Fault registers",
  "system.control": "Control and limits",
  "system.thermal": "Thermal and electrical",
  "system.cell_temp_max_all": "Cell temperature, highest (all packs)",
  "system.cell_temp_min_all": "Cell temperature, lowest (all packs)",
  "system.cell_temp_max": "Cell temperature, highest",
  "system.cell_temp_min": "Cell temperature, lowest",
  "system.cell_temp_max_bms": "Cell temperature, highest (BMS)",
  "system.cell_temp_min_bms": "Cell temperature, lowest (BMS)",
  "system.cell_temp_holder": "Pack {packs}",
  "system.set_charge_power": "Charge power set-point",
  "system.set_discharge_power": "Discharge power set-point",
  "system.set_power_hint":
    "Currently requested by the controller (force mode, schedule or an external controller); not the measured power.",
  "system.selftest_5": "Ethernet chip reports another version than expected (harmless)",
  "system.selftest_5_hint":
    "The self-test compares the version of the Ethernet chip (CH395) with the one the firmware expects: the chip reports 0x4A instead of 0x4B. Measured on two Venus D with a working LAN, harmless. A real SRAM fault would stop the controller; the real faults are 2 (EEPROM) and 3 (flash).",
  "system.ceiling_used":
    "The panel treats {value} % as the charge ceiling, read from this register.",
  "system.ceiling_ignored":
    "This register reads {value} %, outside its own {min}-100 range, so the device is not using it. The panel charges towards 100 % instead.",

  // ---- maintenance ----
  "maint.title": "Maintenance · danger zone",
  "maint.warning":
    "These commands act on the device directly. Several of them cannot be undone - a factory reset deletes the Wi-Fi and cloud settings. Use them only when you know what they do.",
  "maint.buttons": "Commands",
  "maint.dev": "DEV commands",
  "maint.none":
    "No command is enabled for this battery. The command entities are disabled by default; enable the ones you need on the device page and they appear here.",
  "maint.buttons_hint":
    "A command with a two-step confirmation shows the integration's warning first and is only sent when you confirm within its time window.",
  "maint.press": "Press",
  "maint.run": "Run",
  "maint.pressing": "Sending…",
  "maint.confirm": "Send now",
  "maint.close": "Close",
  "maint.countdown": "Confirm within {seconds} s. Nothing has been sent yet.",
  "maint.expired":
    "The confirmation window has run out. Nothing was sent. Close this and press the command again to start over.",
  "maint.admin_required":
    "This needs an administrator account. Ask a Home Assistant administrator to do it.",
  "maint.sent": "{name}: sent.",
  "maint.cancelled":
    "{name}: cancelled, nothing was sent.",
  "maint.ask_message":
    "This command is sent on the first press, without a confirmation step of the integration. Send it now?",

  // ---- Wi-Fi ----
  "wifi.title": "Wi-Fi",
  "wifi.warning":
    "Writes new Wi-Fi credentials to the battery's communication module. The firmware stores the password in an EEPROM area that overlaps another setting (a known firmware bug), and a wrong or aborted write can leave the module with wrong credentials. Use this only while the battery stays reachable another way - the Marstek app or a cable - to correct it. It needs the integration option Options → DEV registers → Show DEV registers.",
  "wifi.ssid": "SSID",
  "wifi.password": "Password",
  "wifi.hint":
    "SSID 1 to 31 characters; password empty for an open network or 8 to 31 characters. Printable ASCII only, without comma and double quote. The password is not stored and the field is emptied after every attempt.",
  "wifi.send": "Send credentials",
  "wifi.sent": "Credentials sent. The communication module applies them now and reconnects.",
  "wifi.err.ssid_length": "The SSID has to be 1 to {max} characters long. Nothing has been sent.",
  "wifi.err.ssid_chars":
    "The SSID may only contain printable ASCII characters, without a comma and without a double quote. Nothing has been sent.",
  "wifi.err.password_length":
    "The password has to be empty (open network) or {min} to {max} characters long. Nothing has been sent.",
  "wifi.err.password_chars":
    "The password may only contain printable ASCII characters, without a comma and without a double quote. Nothing has been sent.",

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
  "settings.spread":
    "Pack spread",
  "settings.spread_hint":
    "When the packs count as having drifted apart. The device works one pack at a time, so during normal operation they routinely sit a good ten points apart — that is the design working. The table only marks individual packs once the spread itself reaches the warning level.",
  "settings.spread_warn":
    "Warn above",
  "settings.spread_crit":
    "Critical above",
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
  "settings.scale": "Scale",
  "settings.width": "Content width",
  "settings.width.full": "Full width",
  "settings.screen_hint":
    "Scale and width belong to this browser: a phone and a 4K monitor want different answers, so they are not carried across devices or included in the export.",
  "settings.storage": "Stored settings",
  "settings.reset": "Reset to defaults",
  "settings.transfer": "Import / export",
  "settings.transfer_hint":
    "Copy this out, paste it in somewhere else. Scale and width are not part of it.",
  "settings.transfer_bad": "That is not a settings object.",
  "settings.import": "Apply pasted",
  "settings.export_again": "Show current",
  "settings.storage_hint":
    "Everything except scale and width is stored in Home Assistant under your user, so the same panel follows you to every device. Other people keep their own.",
  "settings.offline":
    "Home Assistant did not answer, so nothing changed here will be kept. Reload the panel to try again.",

  // ---- empty states ----
  "empty.no_device": "No Marstek battery found",
  "empty.no_device_hint":
    "This panel reads the Marstek Modbus Suite integration. Add a battery there first.",

  "common.unavailable": "—",

  // ---- decoded fault and warning codes (Venus A MPPT stage) ----
  "code.mppt_error.0": "No error",
  "code.mppt_error.1088": "Battery over-voltage",
  "code.mppt_error.1089": "Battery over-current",
  "code.mppt_error.1093": "MPPT chip over-temperature",
  "code.mppt_error.1094": "PV4 over-current",
  "code.mppt_error.1095": "PV3 over-current",
  "code.mppt_error.1096": "PV2 over-current",
  "code.mppt_error.1097": "PV1 over-current",
  "code.mppt_error.1098": "PV4 reverse current",
  "code.mppt_error.1099": "PV3 reverse current",
  "code.mppt_error.1100": "PV2 reverse current",
  "code.mppt_error.1101": "PV1 reverse current",
  "code.mppt_error.1105": "PE (earth) voltage warning",
  "code.mppt_error.1106": "PE (earth) over-voltage",
  "code.mppt_error.1107": "Battery over-voltage (hardware trip)",
  "code.mppt_error.1109": "PV4 over-voltage",
  "code.mppt_error.1110": "PV3 over-voltage",
  "code.mppt_error.1111": "PV2 over-voltage",
  "code.mppt_error.1112": "PV1 over-voltage",
  "code.mppt_error.1123": "PV4 over-current (hardware trip)",
  "code.mppt_error.1124": "PV3 over-current (hardware trip)",
  "code.mppt_error.1125": "PV2 over-current (hardware trip)",
  "code.mppt_error.1126": "PV1 over-current (hardware trip)",
  "code.mppt_error.1127": "Radiator 1 above 90 °C",
  "code.mppt_error.1128": "Radiator 2 above 90 °C",
  "code.mppt_error.1129": "Ambient above 90 °C",
  "code.mppt_error.1130": "Battery over-current (hardware trip)",
  "code.mppt_warning.0": "No warning",
  "code.mppt_warning.1345": "MPPT power or voltage reference out of range",
  "code.mppt_warning.1363": "Power derating, radiator or ambient above 73 °C",
  "code.mppt_warning.1364": "Radiator 1 sensor open or shorted",
  "code.mppt_warning.1365": "Radiator 2 sensor open or shorted",
  "code.mppt_warning.1366": "Ambient sensor open or shorted",
  "code.mppt_warning.1367": "MPPT chip above 85 °C",
  "code.mppt_warning.1368": "Radiator 1 above 73 °C",
  "code.mppt_warning.1369": "Radiator 2 above 73 °C",
  "code.mppt_warning.1370": "Ambient above 73 °C",
};
