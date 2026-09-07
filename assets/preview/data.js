/**
 * Readings for the README screenshots.
 *
 * A Venus D at rest on a normal afternoon: seven packs within three points of
 * each other, pack 4 carrying the current, pack 3 drifting far enough inside
 * itself to be worth a look. Fixed values, so the same command produces the
 * same image every time.
 *
 * Entity names are not here. They are read from the integration's own English
 * catalogue at load time, so a picture cannot show a label the integration
 * does not actually use.
 */

export const VALUES = {
  battery_soc: ["61", "%"], battery_total_energy: ["17.92", "kWh"],
  stored_energy: ["10.93", "kWh"], usable_energy: ["8.78", "kWh"],
  energy_to_full: ["6.99", "kWh"], backup_reserve_energy: ["0.72", "kWh"],
  battery_power: ["-771", "W"],
  ac_power: ["715", "W"], battery_voltage: ["52.9", "V"], battery_current: ["-14.6", "A"],
  ac_voltage: ["239.1", "V"], ac_frequency: ["50", "Hz"], conversion_efficiency: ["92.7", "%"],
  runtime_to_empty: ["13.5", "h"], runtime_to_full: ["0.0", "h"],
  battery_cycle_count_calc: ["5.66", ""], battery_cycle_count: ["6", ""],
  remaining_cycles: ["5994", "cycles"], battery_health: ["99.91", "%"],
  total_daily_charging_energy: ["9.13", "kWh"], total_daily_discharging_energy: ["5.91", "kWh"],
  total_monthly_charging_energy: ["47.89", "kWh"], total_monthly_discharging_energy: ["36.11", "kWh"],
  total_charging_energy: ["121.88", "kWh"], total_discharging_energy: ["101.47", "kWh"],
  round_trip_efficiency_total: ["83.3", "%"], round_trip_efficiency_monthly: ["75.4", "%"],
  internal_temperature: ["28.2", "°C"], internal_mos1_temperature: ["28.7", "°C"],
  max_cell_temperature: ["32.6", "°C"], min_cell_temperature: ["30.8", "°C"],
  mppt1_power: ["0", "W"], mppt2_power: ["0", "W"], mppt3_power: ["0", "W"], mppt4_power: ["0", "W"],
  mppt1_voltage: ["10", "V"], mppt2_voltage: ["9.9", "V"], mppt3_voltage: ["9.9", "V"], mppt4_voltage: ["9.9", "V"],
  mppt1_current: ["0", "A"], mppt2_current: ["0", "A"], mppt3_current: ["0", "A"], mppt4_current: ["0", "A"],
  mppt_error: ["0", ""], mppt_warning: ["0", ""], mppt_version: ["104", ""],
  wifi_signal_strength: ["-52", "dBm"], bluetooth_status: ["1", ""],
  inverter_state: ["Discharge", ""], work_mode: ["0", ""],
  device_name: ["VNSD-0", ""], modbus_address: ["1", ""],
  ems_version: ["150", ""], bms_version: ["1177", ""], vms_version: ["116", ""],
  ems_boot_version: ["18", ""], vns_boot_version: ["106", ""],
  comm_module_firmware: ["202409090159", ""],
  alarm_status: ["0", ""], fault_status: ["0", ""], fault_status_2: ["0", ""],
  bms_pack_count: ["7", ""], bms_online_mask: ["127", ""], bms_active_pack_index: ["4", ""],
};

// soc, lowest cell, highest cell, cycles, MOSFET temperature, ambient, MOSFET status.
// Pack 3 sits 55 mV apart inside itself; pack 4 has its MOSFETs closed.
const PACKS = [
  [60.8, 3.294, 3.302, 24, 36.3, 39.2, 0],
  [61.0, 3.296, 3.304, 22, 34.5, 38.1, 0],
  [60.5, 3.290, 3.345, 20, 29.5, 33.4, 0],
  [62.4, 3.298, 3.307, 26, 26.2, 32.0, 3],
  [60.0, 3.295, 3.303, 25, 26.1, 32.2, 0],
  [59.6, 3.293, 3.301, 68, 25.2, 31.5, 0],
  [60.1, 3.294, 3.302, 63, 24.0, 30.2, 0],
];
PACKS.forEach(([soc, lo, hi, cyc, mos, env, mosState], i) => {
  const n = i + 1;
  VALUES[`battery_soc_${n}`] = [String(soc), "%"];
  VALUES[`battery_${n}_min_cell_voltage`] = [String(lo), "V"];
  VALUES[`battery_${n}_max_cell_voltage`] = [String(hi), "V"];
  VALUES[`battery_${n}_cycle_count`] = [String(cyc), ""];
  VALUES[`battery_${n}_mos_temperature`] = [String(mos), "°C"];
  VALUES[`battery_${n}_env_temperature`] = [String(env), "°C"];
  VALUES[`battery_${n}_protection_1`] = ["0", ""];
  VALUES[`battery_${n}_protection_2`] = ["0", ""];
  VALUES[`battery_${n}_mos_status`] = [String(mosState), ""];
  VALUES[`battery_${n}_bms_version`] = ["1177", ""];
  VALUES[`battery_${n}_voltage`] = [String((52.9 + i * 0.05).toFixed(2)), "V"];
  VALUES[`battery_${n}_current`] = [mosState === 3 ? "-14.6" : "0", "A"];
  [1, 2, 3, 4].forEach((k) => {
    VALUES[`battery_${n}_cell_temperature_${k}`] = [String((mos - 3 + k * 0.3).toFixed(1)), "°C"];
  });
});

// Writable entities: numbers carry min/max/step, selects carry options.
export const CONTROLS = {
  "number.set_charge_power": ["2500", { min: 0, max: 2500, step: 50, unit_of_measurement: "W" }],
  "number.set_discharge_power": ["800", { min: 0, max: 2500, step: 50, unit_of_measurement: "W" }],
  "number.max_charge_power": ["2500", { min: 0, max: 2500, step: 50, unit_of_measurement: "W" }],
  "number.max_discharge_power": ["2500", { min: 0, max: 2500, step: 50, unit_of_measurement: "W" }],
  "number.charge_to_soc": ["95", { min: 10, max: 100, step: 1, unit_of_measurement: "%" }],
  "select.user_work_mode": ["anti_feed", { options: ["manual", "anti_feed", "trade_mode"] }],
  "select.force_mode": ["standby", { options: ["standby", "charge", "discharge"] }],
  "switch.backup_function": ["on", {}],
  "switch.rs485_control_mode": ["on", {}],
  "button.reset_device": ["unknown", {}],
};

// Two schedules set up, the rest empty - what a working install looks like.
const SCHEDULES = [
  [1, 130, 530, -2000, "monday", "on"],
  [2, 1700, 2100, 1500, "monday", "on"],
];
for (let i = 1; i <= 6; i++) {
  const row = SCHEDULES.find(([n]) => n === i);
  const [, start, end, power, day, on] = row ?? [i, 0, 0, 0, "unknown", "off"];
  CONTROLS[`number.schedule_${i}_start`] = [String(start), { min: 0, max: 2358, step: 1 }];
  CONTROLS[`number.schedule_${i}_end`] = [String(end), { min: 1, max: 2359, step: 1 }];
  CONTROLS[`number.schedule_${i}_mode`] = [
    String(power),
    { min: -2500, max: 2500, step: 1, unit_of_measurement: "W" },
  ];
  CONTROLS[`select.schedule_${i}_days`] = [
    day,
    { options: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] },
  ];
  CONTROLS[`switch.schedule_${i}_enabled`] = [on, {}];
}
