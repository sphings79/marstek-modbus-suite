# Changelog

Entries before 3.0.0-beta.12 are in the
[GitHub releases](https://github.com/sphings79/marstek-modbus-suite/releases).

---

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
