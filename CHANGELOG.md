# Changelog

Entries before 3.0.0-beta.12 are in the
[GitHub releases](https://github.com/sphings79/marstek-modbus-suite/releases).

---

## 3.1.0-beta.2

[3.1.0-beta.1](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.1.0-beta.1)
plus the fix from [3.0.1](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.1). This is a
pre-release. If you want to stay on stable, 3.0.1 is the one to use.

### The integration recovers after the battery was unreachable during startup

A failed or cancelled setup, for example while the battery reboots for a firmware
update, is now cleaned up completely. Before, platforms that had already registered stayed
behind, every retry failed with `... has already been setup!`, and the entry stayed loaded
but never polled until it was reloaded by hand. Details are in the 3.0.1 notes below.

---

## 3.1.0-beta.1

[3.0.0](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0)
plus a new forecast for **time to full**. This is a pre-release. If you want to
stay on stable, 3.0.0 is the one to use.

### Time to full follows the order in which the BMS charges the packs

`runtime_to_full` used to divide the missing energy by the current power. On a
Venus A or D that swings between far too short and far too long for the whole
of a charge, because the battery does not charge its packs together:

- The BMS charges **one pack at a time**, the emptiest first, to the next whole
  ten percent, and then moves on to the next emptiest pack.
- **Above 90 % it steps the power down twice per pack.** On a seven-pack Venus D
  the battery took about 1250 W from 90 to 95 % and about 490 W from 95 to 100 %,
  one pack after the other.
- The top step takes far less energy than its five percent suggest. The BMS
  declares a pack full early.

The sensor now plays that sequence through. For each step it uses the lower of
two values: the power available, or the cap the BMS allows. With a forced
charge running, the setpoint counts as the power available. Otherwise it is the
measured power.

**The countdown now runs smoothly through the upper range instead of jumping
around.**

### Learns from your battery

The caps and the real energy of the top two steps are **learned per BMS
firmware version**. They are forgotten when the control firmware changes. Until
your battery has shown each step once, the forecast uses the values measured on
the Venus D. **Expect it to get more accurate after a few charges to 100 %.**

### New

- **`bms_charge_current_limit`** (A and D): the charge current the BMS accepts
  right now, register 32106. It reads 0 once the active pack is full.
- **`bms_charge_power_limit`** (A and D): the resulting charge power cap, BMS
  voltage times that current.
- **Attributes `hours_to_90` and `hours_to_95`** on `runtime_to_full`. The panel
  shows them as two marks under the countdown.

### By model

- **Venus D:** measured and tested, on a seven-pack unit.
- **Venus A:** same firmware base. It is expected to behave the same way, but
  this has **not been verified on an A**. Feedback is especially welcome here.
- **Venus E v3 and E v1/v2:** a single pack, so there is no pack order to
  follow. Little changes here. The forecast only takes the AC power into account
  as well.

### Feedback

If you try it, please report how `runtime_to_full` behaved over a charge,
ideally with the history of the sensor including `hours_to_90` and
`hours_to_95`. Please include the model, the number of packs and the BMS
version.

---

## 3.0.1

Bug-fix release on top of [3.0.0](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0).

### The integration no longer stays dead after the battery was unreachable during startup

When the Venus was unreachable while Home Assistant (re)loaded the integration,
for example during a control firmware update with its reboot, the setup could
be cancelled half-way by Home Assistant's own setup timeout. The platforms that
had already registered were not unloaded in that case. Every later retry then
failed with `... has already been setup!` on all platforms, and the entry
stayed **loaded but never polled**: the connection sensor stayed off with zero
read attempts and all entities were `unknown`, although the battery was
reachable again. Only a manual reload helped.

Failed setups are now cleaned up completely, including cancellations, so the
next retry starts from a clean state and the integration recovers on its own
once the device answers again.

---

## 3.0.0

The first stable release since [2.2.0](https://github.com/sphings79/marstek-modbus-suite/releases/tag/2.2.0).
The register maps were checked against the control firmware of the Venus D and
Venus A, and wherever map and firmware disagreed, the firmware won. Several
sensors turned out to measure something other than their name said. That is
where the breaking changes come from.

What follows sums up 2.3.0-beta.1, 3.0.0-beta.1 to beta.13 and rc.1 to rc.3.
Each pre-release has its own notes with the measurements behind it.

### Breaking changes — read before updating

#### Venus A and D: three entities removed

`battery_voltage`, `battery_current` and `bms_version` read the same firmware
words as `battery_1_voltage`, `battery_1_current` and `battery_1_bms_version`.
They were pack 1's values under a name for the whole battery. In one recorded
discharge, `battery_current` read 0.0 A while pack 2 delivered −45.9 A.

**What to do:** switch to the `battery_1_` names, which give identical values.
For a current across all packs, use `bms_power`. The Venus E v3 and E v1/v2
keep all three, because there they describe the whole battery.

#### Venus A and D: energy counters renamed, `battery_power` corrected

| Old key | New key |
|---|---|
| `battery_power` | `dc_sample_power` (register 30001, one DC measurement point) |
| *(calculated)* | `battery_power`, now the DC point plus the four strings, i.e. the packs |
| `total_charging_energy` | `total_ac_input_energy` |
| `total_discharging_energy` | `total_ac_output_energy` |
| `total_daily_charging_energy` | `total_daily_ac_input_energy` |
| `total_daily_discharging_energy` | `total_daily_ac_output_energy` |
| `total_monthly_charging_energy` | `total_monthly_ac_input_energy` |
| `total_monthly_discharging_energy` | `total_monthly_ac_output_energy` |

Register 30001 also carries the PV strings. A Venus A read −1557 W there while
its packs supplied 870 W. The energy counters are measured at the grid
connection, not at the packs.

- **`battery_power` keeps its key.** Automations keep working, and the value is
  now correct.
- **The six old energy keys stay** as pass-throughs with the same unique id. An
  existing installation keeps the entity, its id and its history. A new
  installation gets only the new names. New automations should use the new names.
- `battery_health` and `remaining_cycles` read the BMS cycle count. Before, they
  divided the energy counter by the capacity, which gave 1211 cycles against the
  BMS's 153. `battery_cycle_count_calc` is gone on these two models.

#### Venus A and D: `battery_cycle_count` is the mean over the packs

It read pack 1 only. On a seven-pack Venus D it showed 6, while the packs
counted between 6 and 73. It now reports the mean over the fitted packs, 37 on
that device. Expect a step in the history. Pack 1's own count stays available as
`battery_1_cycle_count`.

#### All models: values that read differently

- **`inverter_state`:** state 6 is **Backup Passthrough**, not Bypass. That is
  what the register means: the backup socket carries a load from the grid.
- **`software_version`, `bms_version`, `ems_version`** are version strings now,
  for example `117.7` instead of `1177`.
- **`schedule_N_days`:** a schedule with several days reads `custom`, and the
  days are in the attributes. Single days keep their names.
- **Cycle counts are signed**, as the firmware types them. A BMS sentinel shows
  as a negative number instead of one near 65535.
- **`wifi_signal_strength` is off by default** on new installations. The value
  can never be current while Modbus runs over the cable.
- **Register 30212** was `dev_30212` and read as a pack count. It is the
  power-on self-test result and is now called `selftest_status`, off by default.

#### New Modbus library, and what that means for proxies

The integration talks to the battery through **tmodbus** now instead of
pymodbus. Home Assistant installs it on the restart after the update. The
integration corrects the firmware's malformed exception replies itself, so no
proxy is needed any more.

**If you use a Modbus proxy anyway**, for example because a second client shares
the battery, use [the patched add-on](https://github.com/sphings79/ha-modbusproxy).
An unpatched proxy trips over the same malformed replies and drops the
connection.

#### After updating

- **Restart Home Assistant**, not just reload the integration.
- **Reload every open panel tab.** An open tab keeps running the old panel.
  From this version on it notices a newer one and offers the reload itself.

### New

- **Setup finds the battery.** A Venus announces itself on the network.
  *Add integration* listens for four seconds and fills in model, address and
  register map. The MAC serves as the unique id, so the same battery cannot be
  set up twice.
- **Modbus device polling**, per battery: *Active*, *Paused, entities
  unavailable* or *Paused, entities frozen*. This is meant for a battery
  switched off for the season. The setting survives restarts, a paused entry
  loads without connecting, and controls are locked while paused.
- **A battery that is off looks off.** The status light shows green, amber, red
  (with the time of the last answer) or grey (paused). The log reports one line
  going off and one coming back, instead of a burst every minute. After it is
  switched back on, the readings are back within a minute.
- **Pack count detection.** The panel counts the packs that answer. On the
  Venus A and D, *Options → Battery packs* can also pin the count, so the unused
  blocks are not polled at all.
- **Polling based on measurements at the device:** 65 ms per request and 5.5 s
  for a full round. A new ultra-low group (default five minutes) holds the 55
  values that only change when somebody changes them. The MPPT values are back
  at the fast rate. [Which value is in which group](https://github.com/sphings79/marstek-modbus-suite/blob/main/docs/polling-groups.md).
- **Schedules:**
  - Any combination of weekdays, edited as chips in the panel.
  - Editing an enabled schedule no longer switches it off. The firmware does
    that on every write, and the integration switches it back on.
  - Schedules the firmware would never run are refused: overlapping enabled
    slots, empty windows, windows across midnight.
- **RS485 control mode:** the repair entry "Restore the control mode" appears
  only when this integration switched the mode on itself. A second client such as
  evcc no longer triggers it ([#6](https://github.com/sphings79/marstek-modbus-suite/issues/6)).
  The dialog also warns that submitting ends the configured work mode.
- **Venus A:** pack 7 with 13 cells, and the DEV register groups.
- **Fault texts** for the Venus A and E v3, taken from their own firmware.
- **`alarm_status_low`**: the second half of the 32-bit alarm word. Until now it
  was read and discarded.
- **Panel:**
  - Runtimes in hours and minutes.
  - One threshold for pack spread across the tile, table and columns.
  - Temperatures with their unit.
  - A layout that works on a phone.
  - Restarting the device asks for confirmation in a dialog.

### Fixed

- Time to full and time to empty went blank when a single PV string was missing.
- The calculated cycle count could run into the tens of thousands on an unread
  capacity register. Because the sensor is `total_increasing`, such a spike stays
  in the statistics.
- `battery_cycle_count` and `battery_power_bms` stayed blank on any stack
  smaller than seven packs.
- *PV passthrough* in the panel requires producing strings now, so it no longer
  appears on a Venus E.
- Pausing during a running poll could leave the connection open.
- A register was fetched twice in every cycle.
- A device that refuses the connection gets a message naming the likely causes:
  wrong interface, or its single Modbus connection already taken.

### Worth knowing

- **Modbus TCP only runs over the LAN port.** Port 502 is refused on the WiFi
  address, even when the battery has no cable at all. Discovery finds a battery
  without a cable, but setup cannot connect to it.
- **Venus A power limits:** `max_charge_power` and `max_discharge_power` are
  capped at 1500 W. That has been tested on one system. How the device handles
  writes above 1500 W comes from the firmware and has not been measured.
- **Schedules set over Modbus** may be lost after the battery restarts. The
  firmware writes them to EEPROM only when they come from the app. This comes
  from the firmware and has not been tested.

## 3.0.0-rc.3

rc.2 plus three schedule and panel fixes that were finished before rc.2 but
missed it.

### A schedule can hold any set of weekdays

The day register is a bit mask, but the day select only knew single days. A
Monday-to-Friday schedule set in the Marstek app showed as unknown, and editing
it in the panel overwrote it with one day. The select now reports none, a
single day or custom, and exposes the mask and the list of days as attributes.
The panel edits the days as chips and writes the whole mask at once.

**Upgrading:** an automation that compares `schedule_N_days` against a day name
still works for a single day. A schedule with several days reads `custom`; the
days are in the attributes.

### Editing a schedule no longer switches it off

The control firmware sets a slot's enabled register to 0 whenever its days,
start or end are written. Editing an enabled schedule from the panel, the number
entities or the day select therefore switched it off without a word. Every
schedule write now goes through one path that writes the enabled flag last and
restores it when the slot was on.

### Schedules that cannot run are refused

The firmware runs only the first matching slot, while start <= now < end. An
enabled slot whose window is empty or crosses midnight never runs, and of two
enabled slots that overlap on a shared day, the later one never runs either.
Both are now refused before anything is written, with a translated error, from
the panel, a service call or an automation alike. Disabled slots can be prepared
freely. The panel shows the refusal and puts the field back to the device value.

The README describes how the device runs the schedules, including that the
firmware saves schedules to its EEPROM only when they come from the app - read
from the firmware, not yet tested.

### The panel survives an update while it is open

Home Assistant loads the panel bundle with the version in its URL. After an
update the page often stays open - the iOS app just reconnects - and the bundle
was loaded a second time and failed on the first element it registered. Elements
already registered are now skipped, and a panel still running the old code
offers a reload.

## 3.0.0-rc.2

rc.1 with one correction, from
[#6](https://github.com/sphings79/marstek-modbus-suite/issues/6).

### The control mode repair only fires when the mode was switched on from here

The repair entry "Restore the control mode" reported every drop of register
42000 from on to off that this integration had not written itself. Who had
switched the mode on was never asked. A second Modbus client that controls the
battery - evcc holds it during a charging session, then writes the work mode
back - produces exactly that transition, so the entry came back after every
session, claiming the device had reset itself. Submitting it would have taken
the battery out of its self-consumption mode outside any session.

The register cannot tell a reset from another client's write; both leave the
same byte. What can tell them apart is who switched the mode on. The
integration now remembers whether it did - through the switch or the repair
flow - and stores that on the config entry, so a restart does not forget it.
The entry is raised only while that is the case. Switching the mode off here,
or writing the work mode through the select, gives it up, as does any "off"
read from the device.

Writing the work mode through the select no longer raises the entry either.
It ends the control mode on purpose, since 42000 and 43000 are the same byte,
and was reported as a reset all the same.

An entry from an earlier version has nothing stored and is treated the old
way until the device first reports the mode off. At most one more false report
per installation, and a genuine reset right after the update is still caught.

The repair text now says, in bold, that submitting takes the battery out of
its configured work mode, and to ignore the entry when another system ended
the mode on purpose.

## 3.0.0-rc.1

[beta.13](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0-beta.13)
with one correction on top of it.

### PV passthrough now needs the strings to be producing

beta.13 renamed the derived state to PV passthrough and reserved the word
Bypass for what the register actually means. The condition behind the derived
one was still only "charging and delivering at once", which is a claim about
where the energy comes from that nothing checked.

On a Venus A or D it makes no difference: `battery_power` is the DC measurement
point plus the strings, and delivering to the house drives that point negative,
so the two forms agree - 72 firings either way across eleven minutes of real
readings, not one of them different.

It matters on the two Venus E generations. They have no PV input and no
`solar_power_total` at all, so the old condition would have labelled any
overlap of charging and delivering as PV passthrough on a device whose DC bus
carries nothing but its packs. The label now needs a reading only a model with
strings has, and an E falls through to whatever the register says.

## 3.0.0-beta.13

Mostly the panel, plus two sensors that were never going to work on a stack
smaller than the register map.

### Two aggregates were dead on anything but a full stack

`battery_cycle_count` and `battery_power_bms` both name all seven packs as
dependencies, and a calculated sensor stays blank unless every one of them has a
value. The register map assumes an absent pack answers its block with zeros,
which only holds while all seven blocks are polled — with the pack count pinned
they are never asked for, so the value arrives as nothing at all.

Measured on a three-pack Venus A: each of the two refused **99 times in eleven
minutes**, once per polling cycle, for as long as the device had been running.

A calculated sensor can now name the dependencies it can do without.
`battery_power_bms` adds up the packs that answered. On that same Venus A the
two read 395 W and 133 cycles, against pack currents totalling 8.7 A and counts
of 156, 123 and 120.

### Bypass was the wrong word

Register state 6 is **Backup Passthrough**, not Bypass. It appears when the
backup socket is switched on with a load on it and the grid is carrying that
load — not, as the panel assumed, when solar feeds the house while the packs
charge. The panel's own name for that second case is now **PV Passthrough**, and
it goes through the translation catalogues instead of being English in every
language.

### Panel

**The pack columns and the table disagreed** — the same split
[beta.12](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0-beta.12)
closed between the table and the spread tile, one layer further out. The columns
kept a rule of their own: five points from the median, with no regard for
whether the stack spread meant anything yet. A pack ten points low was outlined
in warning while the tile above it read green and its own row stayed plain. All
three ask the same question now.

**Temperatures say what they are.** The pack table printed three columns of bare
figures — 35,2 beside 38,9 beside four NTC readings, with nothing to say what
they were. The unit now sits in the heading, once, rather than beside every
number. It is read from the entity, so an installation on Fahrenheit gets °F
over Fahrenheit numbers; two tiles and a pack note had °C written into the
layout.

**A choice too wide for a phone wraps** instead of widening the page. The
polling choice spells out what pausing does to the entities, which is three
sentences laid side by side: on a phone that bar ran out past its own panel and
took the width of the whole page with it, leaving everything else off-screen to
the left. Options that fit still sit beside each other.

**Restarting the device asks in a dialog.** The confirmation used to replace the
button that opened it, at the same spot and — in English — at the same width, so
a double click went straight through to the restart. Escape, a click beside the
dialog and the cancel button all dismiss it, the cancel button holds the focus
when it opens, and the dialog has room to say what a restart actually costs.

### Repository

The tool that produced the polling numbers in beta.12 now sits in `scripts/`,
next to the constants that rest on them. Without `--host` it touches nothing and
only counts what each tick would ask for; with one it times those requests
against a real device — and refuses its own output when the session keeps being
taken away, which is what pointing it at a proxy during a Home Assistant poll
produced: 94 reconnects and a page of 3 ms timings that looked like results.

---

## 3.0.0-beta.12

The largest step since [beta.11](https://github.com/sphings79/marstek-modbus-suite/releases/tag/3.0.0-beta.11):
the integration now finds your battery by itself, and what it asks the battery
for has been measured rather than estimated.

### Setup finds the battery for you

A Venus announces itself on the local network about twice a second, unprompted —
a UDP broadcast carrying its model, its address and a MAC that stays the same
when the address does not. **Add integration** now listens for four seconds and
offers what answered:

```
Venus D · 192.168.1.50 · aa:bb:cc:dd:ee:ff
```

Picking one fills the form in and leaves every field editable, which is what
anyone reaching their battery through a Modbus proxy needs — the beacon names
the battery's own address, not the proxy's. The model code selects the register
map, so the right one is already chosen.

Nothing talks to the device while listening. A Venus accepts a single Modbus
connection at a time, so probing one that is already in use would report it as
unreachable, or take the connection away from whoever had it.

An entry created this way carries the MAC as its unique id, so the same battery
cannot be set up twice even after its address changes. Entries made before this
existed keep no unique id and are left alone.

**This does not put devices under Settings → Discovered.** A custom integration
is only loaded once it has a config entry, so for a first device there is
nothing running to listen. That needs a manifest-declared discovery type and is
a separate decision.

### Modbus TCP only works over the LAN socket

Measured across four network states on a Venus D: both interfaces up, the cable
pulled during operation, a **cold start with no cable at all**, and the cable
coming back.

Port 502 answers on the wired address and is refused on the wireless one, every
time, including after the cold start. The Modbus server lives on the device's
Ethernet chip and never appears on the radio side.

The discovery beacon does move. It follows whichever interface is up, prefers
the wired one, and hands over cleanly — 538 packets from the LAN address against
15 from the wireless one over five minutes, never both at once, with the switch
taking about 26 seconds. So a battery **without** a cable is still discovered,
gets its address prefilled, and then cannot be set up at all.

That case now says so instead of showing a bare "cannot connect". When a
connection fails, one more question is asked: did the device refuse, or was
there nothing there? A refusal means it is reachable but not serving Modbus at
that address, which is either the wrong interface or its single connection
already held by a proxy or a second integration. The message names both.

### Polling, measured at the device

The numbers this integration reasoned from were taken through a Modbus proxy and
were more than twice too pessimistic. Read directly at a Venus D on EMS v150:
**65 ms per request**, not 150, and a full round takes **5.5 s**, not the 10.3
the comments claimed.

Three things follow.

**Block reads span three unused registers instead of two.** Four was tried and
buys nothing: it merges one block the device refuses, and a refusal blacklists
every gap in that block — taking a bridge that works down with the one that does
not. Everything wider is dead ground on this firmware.

**A new ultra-low group, five minutes by default.** It holds the 55 readings
that do not move unless somebody moves them: firmware versions, the six
schedules, IP, gateway and BLE MAC, the per-pack cycle counters, capacity and
the power limits. A schedule changed in the Marstek app takes up to five minutes
to appear, which is the whole cost.

**The MPPT readings go back to the fast rate**, all eight of them.

```
fast tick     24 -> 23 requests     3.55 -> 3.47 s
fast + slow   40 -> 33 requests     6.02 -> 4.95 s
full round              37 requests         5.53 s   (every 5 minutes)
```

The floor for the slow rate comes down from twelve seconds to ten. It has to
stay above what a full round takes: a tick where several groups fall due reads
the whole round before the fast readings from that same tick arrive.

Each group has its own box in the options, and
[the page listing what is in which group](https://github.com/sphings79/marstek-modbus-suite/blob/main/docs/polling-groups.md)
is generated from the register maps, so it cannot drift.

### Panel

**The pack table and the spread tile disagreed.** The tile used the shared
threshold of 19 points; the table flagged any pack more than 5 points from the
median — a hardcoded number left behind when those thresholds were centralised.
The legend under the table already quoted 19. A green tile routinely sat over
red rows.

The table now marks packs only once the spread itself is at warning level, and
then the ones more than half that from the median. A stack at `[0, 18, 18, 18]`
reads 18 points of spread and marks nothing, where the old rule flagged the
outlier. Both thresholds are adjustable in the panel settings, since how far
packs drift depends on how many are stacked.

**Runtimes are hours and minutes.** "8,8 h" asked the reader to convert in their
head; it now says `8 h 50 min`. The "until full" row is gone from the reserve
list — the tile beside it already shows whichever countdown is running.

**"WIFI 0 dBm" is gone from the status bar.** Register 30303 reads 0 on a device
that reaches the network by cable, and a stale value from an earlier wireless
session otherwise: reading it at all needs the LAN link, and with the LAN link
up the radio is not the uplink, so the number can never be current when it is
visible. The green dot beside it was the Modbus link's, shown twice. The
register is off by default on all four models now.

Smaller: the stored energy tile names the capacity it is a part of rather than a
second figure that looked like arithmetic that did not add up; the cycles tile
says what it averaged over under the number instead of in its heading.

### Models

Fault bit texts for the **Venus A** and **Venus E v3**, read out of their own
inverter firmware rather than borrowed from the Venus D — the bits are not the
same and the old texts named the wrong faults. The Venus A also gets the DEV
register groups the D already had.

The setup dialog names the models properly: **Venus A**, **Venus D**,
**Venus E v3**, **Venus E v1 & v2**, instead of the internal codes.

Firmware versions display consistently across every model and every version
field: four digits get a dot before the last one, so `1177` reads as `117.7`.

### If you use a Modbus proxy

You do not need one — the integration talks to the battery directly and corrects
the firmware's malformed replies itself. You do need one if a second client
shares the battery.

A Venus answers a read of an unimplemented register with an exception frame
whose length field is one too high. A proxy is itself a parser, so it waits for
a byte that never comes and closes the connection after its own timeout. Since
this release probes register gaps on purpose, that is no longer a rare event.
Until the fix is upstream, use
[the patched add-on](https://github.com/sphings79/ha-modbusproxy); the README
links both reviews.

### Scope

The Modbus-over-LAN finding and the polling measurements were taken on a Venus D
on Control/EMS v150. The Venus A and E v3 share that firmware base and are
expected to behave the same, but this has not been verified on them.
