"""
Time-to-full forecast that follows the order in which the BMS charges its packs.

The Venus A and D do not charge their packs together. The BMS (analysed in
BMS 118) keeps exactly one pack active, picks the emptiest one, charges it to
the next whole ten percent and then hands over to whichever pack is now the
emptiest - lower index on a tie. The charge current the pack accepts comes from
a table indexed by the pack's own state of charge and temperature, and the
control firmware turns that current into a power cap: charge power limit =
BMS voltage (32100) x BMS charge current limit (32106).

Above 90 % that table steps the current down twice. Measured on a seven-pack
Venus D: 25 A from 90 to 95 %, 10 A from 95 to 100 %, which the battery sees as
about 1250 W and 490 W, per pack, one pack after the other. A countdown that divides the missing energy by the
current power therefore swings between far too short and far too long.

The top band also takes far less energy than its five percent suggest: the BMS
declares the pack full early and its state of charge jumps from about 98 to
100. On the same Venus D the last band took 24-94 Wh per pack where five
percent of a pack is 128 Wh. So each taper band carries two learned figures -
the power cap in force, and the share of its nominal energy it really takes -
and both are kept per BMS firmware version, because the table behind them lives
in the BMS and is not readable from the image.

Everything here is plain Python so it can be exercised without Home Assistant.
"""

from __future__ import annotations

from dataclasses import dataclass

# Band edges in percent of a single pack's state of charge. The upper edge is
# where the measured power dropped the second time; the firmware table that
# defines it is not readable, so it is taken from the measurement.
BAND_EDGES = (90.0, 95.0)
BANDS = ("bulk", "stage1", "stage2")
TAPER_BANDS = ("stage1", "stage2")

# The charge power cap per band as the control firmware computes it: BMS
# voltage times the BMS charge current limit, read on a seven-pack Venus D
# (BMS 118, 24.09.2026) - 50 A, 25 A and 10 A at about 54-55 V. The control
# clamps its inverter setpoint to this, so the battery sees it times the
# conversion efficiency: ~1250 W and ~490 W in the two taper bands. Only used
# until a band has been observed on the device itself.
DEFAULT_BAND_CAPS_W = {"bulk": 2700.0, "stage1": 1375.0, "stage2": 550.0}

# Energy a band really takes, as a share of its nominal energy (band width x
# pack energy per percent). Same measurement: 82-135 Wh in the middle band and
# 24-94 Wh in the top band against 128 Wh nominal, seven packs each.
DEFAULT_BAND_ENERGY_RATIO = {"bulk": 1.0, "stage1": 0.86, "stage2": 0.37}

# Battery power over AC power while charging, until the device has shown its own.
DEFAULT_CHARGE_EFFICIENCY = 0.935

# A pack at this state of charge is full: the BMS drops its current limit to 0.
FULL_SOC = 100.0

# Guards the simulation against a loop that never finishes on odd input.
_MAX_STEPS = 500


def band_of(soc: float) -> str:
    """Return the band a pack is in at the given state of charge."""
    if soc < BAND_EDGES[0]:
        return "bulk"
    if soc < BAND_EDGES[1]:
        return "stage1"
    return "stage2"


def band_bounds(band: str) -> tuple[float, float]:
    """Lower and upper edge of a band, in percent."""
    if band == "bulk":
        return 0.0, BAND_EDGES[0]
    if band == "stage1":
        return BAND_EDGES[0], BAND_EDGES[1]
    return BAND_EDGES[1], FULL_SOC


def step_target(soc: float) -> float:
    """The next whole ten percent, as the BMS computes it.

    BMS 118 @0x08006cfc: ((soc% + 10) / 10) * 10 on the integer percentage,
    capped at 100. A pack at 69.6 is headed for 70, one at 70.0 for 80.
    """
    return min(FULL_SOC, float((int(soc) // 10 + 1) * 10))


def _next_pack(socs: list[float]) -> int | None:
    """Emptiest pack that is not full; the lower index wins a tie."""
    best = None
    for index, soc in enumerate(socs):
        if soc >= FULL_SOC:
            continue
        if best is None or soc < socs[best]:
            best = index
    return best


@dataclass
class PackModel:
    """What the simulation needs to know about one pack's bands."""

    caps_w: dict[str, float]
    energy_ratio: dict[str, float]


@dataclass
class ForecastResult:
    """Hours until the mean state of charge reaches each threshold."""

    hours_to_target: float | None
    hours_to_90: float | None
    hours_to_95: float | None
    target_soc: float
    steps: int = 0


def simulate(
    socs: list[float],
    active: int | None,
    target_soc: float,
    pack_wh_per_percent: float,
    models: list[PackModel],
    available_w: float,
    ac_limit_w: float | None,
    live_cap_w: float | None = None,
    active_band_delivered_wh: float = 0.0,
    cap_efficiency: float = 1.0,
) -> ForecastResult | None:
    """Replay the charge sequence and time it.

    socs:                     state of charge per pack, in percent
    active:                   index of the pack the BMS is charging now, if known
    target_soc:               mean state of charge at which charging stops
    pack_wh_per_percent:      nominal energy of one percent of one pack
    models:                   per pack, band caps and band energy shares
    available_w:              battery-side power the source can deliver
    ac_limit_w:               battery-side equivalent of the device charge limit
    live_cap_w:               cap in force right now, for the active pack's band
    active_band_delivered_wh: energy the active pack has already taken in the
                              band it is in; the top band's state of charge is
                              too unreliable to say how much is left
    cap_efficiency:           battery power over inverter power. The caps are
                              the control's clamp on its inverter setpoint, so
                              the battery sees them times this

    Returns None when nothing can be forecast - no power, no packs.
    """
    packs = [float(s) for s in socs]
    count = len(packs)
    if count == 0 or len(models) != count or pack_wh_per_percent <= 0 or available_w <= 0:
        return None

    thresholds = {"90": 90.0, "95": 95.0, "target": target_soc}
    reached: dict[str, float] = {}
    mean = sum(packs) / count
    for name, value in thresholds.items():
        if mean >= value:
            reached[name] = 0.0

    elapsed_h = 0.0
    steps = 0

    current = active if active is not None and 0 <= active < count else None
    if current is not None and packs[current] >= FULL_SOC:
        current = None
    first_pack = current
    first_band = band_of(packs[current]) if current is not None else None

    while "target" not in reached and steps < _MAX_STEPS:
        if current is None:
            current = _next_pack(packs)
            if current is None:
                break
        target = step_target(packs[current])
        model = models[current]

        # One step may cross a band edge; each part runs at its own power.
        while packs[current] < target and "target" not in reached:
            start = packs[current]
            band = band_of(start)
            low, high = band_bounds(band)
            end = min(target, high)
            span = end - start

            ratio = model.energy_ratio.get(band, DEFAULT_BAND_ENERGY_RATIO[band])
            energy_wh = span * pack_wh_per_percent * ratio
            cap = model.caps_w.get(band, DEFAULT_BAND_CAPS_W[band])

            if current == first_pack and band == first_band:
                if live_cap_w:
                    cap = live_cap_w
                if band in TAPER_BANDS and end >= high:
                    # What is left of this band is its full energy less what has
                    # gone in already - never less than a sliver, since the pack
                    # is evidently not done yet.
                    band_wh = (high - low) * pack_wh_per_percent * ratio
                    energy_wh = max(band_wh - active_band_delivered_wh, 0.05 * band_wh)

            cap *= cap_efficiency
            power = min(available_w, cap, ac_limit_w or cap)
            if power <= 0:
                return None
            hours = energy_wh / power

            # The mean rises linearly while this part runs, so a threshold it
            # crosses can be timed exactly inside the part.
            mean_after = mean + span / count
            for name, value in thresholds.items():
                if name not in reached and mean < value <= mean_after and span > 0:
                    reached[name] = elapsed_h + hours * (value - mean) * count / span

            elapsed_h += hours
            mean = mean_after
            packs[current] = end
            steps += 1

        current = None

    # The sum of the steps lands on the target only up to rounding; once every
    # pack is full there is nothing left to wait for.
    if all(soc >= FULL_SOC for soc in packs):
        for name in thresholds:
            reached.setdefault(name, elapsed_h)

    return ForecastResult(
        hours_to_target=reached.get("target"),
        hours_to_90=reached.get("90") if target_soc >= 90.0 else None,
        hours_to_95=reached.get("95") if target_soc >= 95.0 else None,
        target_soc=target_soc,
        steps=steps,
    )


class BandLearner:
    """Band caps and band energies learned from the device, per BMS version.

    Both come from the BMS table, so a BMS update can move them; the control
    firmware turns the current into watts, so an update there can too. Values
    are therefore filed under the BMS version and dropped entirely when the
    control firmware changes. Until a band has been seen, the defaults stand in.
    """

    # Weight of a new observation. The caps sit on a plateau for minutes, so a
    # slow average rides out a single odd read without lagging a real change
    # (temperature, ageing) by more than a charge or two.
    CAP_ALPHA = 0.1

    # One band energy per pack and charge, and they scatter (24-94 Wh in the
    # top band on one afternoon), so each counts for more than a cap reading.
    ENERGY_ALPHA = 0.25

    # Cap readings this close to a band edge are skipped: where exactly the
    # table steps is not known to the decimal, and a reading from the wrong
    # side of the edge would pull the band towards its neighbour.
    EDGE_MARGIN = 1.0

    # Below this the reading is not a charge cap (a full pack reads 0).
    MIN_CAP_W = 50.0

    def __init__(self, stored: dict | None = None) -> None:
        stored = stored if isinstance(stored, dict) else {}
        self.control_firmware: str | None = stored.get("control_firmware")
        versions = stored.get("versions")
        self.versions: dict[str, dict[str, dict]] = versions if isinstance(versions, dict) else {}

    def to_dict(self) -> dict:
        return {"control_firmware": self.control_firmware, "versions": self.versions}

    def sync_control_firmware(self, firmware: str | None) -> bool:
        """Forget everything learned under a different control firmware."""
        if firmware is None or firmware == self.control_firmware:
            return False
        self.control_firmware = firmware
        self.versions = {}
        return True

    def model_for(self, bms_version: str | None) -> PackModel:
        """Band caps and energy shares for one BMS version."""
        caps = dict(DEFAULT_BAND_CAPS_W)
        ratios = dict(DEFAULT_BAND_ENERGY_RATIO)
        learned = self.versions.get(str(bms_version)) if bms_version is not None else None
        if isinstance(learned, dict):
            for band, entry in learned.items():
                if band not in caps or not isinstance(entry, dict):
                    continue
                if entry.get("w"):
                    caps[band] = float(entry["w"])
                if entry.get("r"):
                    ratios[band] = float(entry["r"])
        return PackModel(caps_w=caps, energy_ratio=ratios)

    def summary(self) -> dict:
        """What has been learned, for the sensor's attributes."""
        return {
            version: {
                band: {k: v for k, v in entry.items() if k in ("w", "r")}
                for band, entry in bands.items()
                if isinstance(entry, dict)
            }
            for version, bands in self.versions.items()
            if isinstance(bands, dict)
        }

    def _entry(self, bms_version: str, band: str) -> dict:
        per_version = self.versions.setdefault(str(bms_version), {})
        entry = per_version.get(band)
        if not isinstance(entry, dict):
            entry = {}
            per_version[band] = entry
        return entry

    def observe_cap(self, bms_version: str | None, soc: float, cap_w: float) -> bool:
        """Fold one reading of the cap in force for a pack at `soc` into its band."""
        if bms_version is None or cap_w < self.MIN_CAP_W or soc >= FULL_SOC - 0.5:
            return False
        if any(abs(soc - edge) < self.EDGE_MARGIN for edge in BAND_EDGES):
            return False

        entry = self._entry(bms_version, band_of(soc))
        previous = entry.get("w")
        if not previous:
            entry["w"] = round(cap_w, 1)
            return True
        value = round(float(previous) + self.CAP_ALPHA * (cap_w - float(previous)), 1)
        entry["w"] = value
        return value != previous

    def observe_band_energy(
        self, bms_version: str | None, band: str, energy_wh: float, pack_wh_per_percent: float
    ) -> bool:
        """Fold the energy one pack took across one whole taper band into its share."""
        if bms_version is None or band not in TAPER_BANDS or pack_wh_per_percent <= 0:
            return False
        low, high = band_bounds(band)
        nominal = (high - low) * pack_wh_per_percent
        ratio = energy_wh / nominal
        # A band that took next to nothing or far more than its size was not a
        # clean pass (interrupted, discharged in between, a misread).
        if not 0.05 <= ratio <= 1.5:
            return False

        # Unlike a cap, one pass is not representative: the top band took 24 Wh
        # on one pack and 118 Wh on another. The first reading therefore moves
        # the default rather than replacing it.
        entry = self._entry(bms_version, band)
        previous = float(entry.get("r") or DEFAULT_BAND_ENERGY_RATIO[band])
        entry["r"] = round(previous + self.ENERGY_ALPHA * (ratio - previous), 3)
        return True


class BandEnergyTracker:
    """Measures the energy the active pack takes while it crosses a taper band.

    A band counts only when it was entered at its lower edge and left at its
    upper edge (or the pack came out full) without a break in charging -
    anything else is a partial pass that would bias the share downwards.
    """

    def __init__(self) -> None:
        self.pack: int | None = None
        self.band: str | None = None
        self.energy_wh = 0.0
        self.clean = False
        self._last_ts: float | None = None

    def delivered_wh(self, pack: int | None, band: str | None) -> float:
        if pack is not None and pack == self.pack and band == self.band:
            return self.energy_wh
        return 0.0

    def update(
        self, ts: float, pack: int | None, socs: list[float], power_w: float
    ) -> tuple[int, str, float] | None:
        """Advance by one reading. Returns (pack, band, energy) when a clean band ends.

        Takes every pack's state of charge, not just the active one's: the top
        band usually ends in the same reading as the handover, so the pack that
        just finished is only visible as the one that is no longer active.
        """
        soc = socs[pack] if pack is not None and 0 <= pack < len(socs) else None
        if soc is None:
            self._reset(None, None, ts, clean=False)
            return None

        band = band_of(soc)
        charging = power_w > 0

        if pack == self.pack and band == self.band:
            if self._last_ts is not None and charging:
                self.energy_wh += power_w * (ts - self._last_ts) / 3600.0
            self._last_ts = ts

            # The top band ends at 100 %, before the handover pause; a stop
            # anywhere below that breaks the pass.
            if band == "stage2" and soc >= FULL_SOC - 0.05:
                finished = (pack, "stage2", self.energy_wh) if self.clean else None
                self.clean = False
                return finished
            if not charging:
                self.clean = False
            return None

        finished = None
        moved_up = (
            pack == self.pack
            and self.band is not None
            and BANDS.index(band) == BANDS.index(self.band) + 1
        )
        if self.clean and moved_up and self.band == "stage1":
            finished = (pack, "stage1", self.energy_wh)
        elif (
            self.clean
            and self.band == "stage2"
            and self.pack is not None
            and pack != self.pack
            and 0 <= self.pack < len(socs)
            and socs[self.pack] >= FULL_SOC - 0.05
        ):
            # Handed over in the same reading that saw the pack reach full.
            finished = (self.pack, "stage2", self.energy_wh)

        # Clean from here on only if the pack starts this band at its lower
        # edge: either it just crossed into it, or it was just picked there.
        fresh_at_edge = pack != self.pack and soc < band_bounds(band)[0] + 0.5
        self._reset(pack, band, ts, clean=band in TAPER_BANDS and (moved_up or fresh_at_edge))
        return finished

    def _reset(self, pack: int | None, band: str | None, ts: float, clean: bool) -> None:
        self.pack = pack
        self.band = band
        self.energy_wh = 0.0
        self.clean = clean
        self._last_ts = ts


def available_power(
    power_w: float,
    limit_w: float | None,
    forced_setpoint_w: float | None,
    last_free_w: float | None,
) -> tuple[float, str, float | None]:
    """How much power the source could deliver, battery side.

    Returns (available, source, new last_free_w).

    - Under forced charge the setpoint is what the controller asks for, and the
      most the device would take from it.
    - Otherwise the measured power is the answer as long as the device is not
      holding it down itself. At a cap (BMS or AC limit) the measurement shows
      only the cap - and on firmware that curtails the MPPTs to the charge
      limit, not even the PV side knows more. What is known there is that the
      source delivers at least the cap, so the highest power seen since the
      source last fell short stands in.
    - Idle and discharge say nothing about the source and leave it alone.
    """
    if forced_setpoint_w is not None and forced_setpoint_w > 0:
        return forced_setpoint_w, "setpoint", last_free_w

    if power_w <= 0:
        return power_w, "measured", last_free_w

    capped = limit_w is not None and limit_w > 0 and power_w >= 0.95 * limit_w
    if not capped:
        return power_w, "measured", power_w

    floor = max(last_free_w or 0.0, power_w)
    source = "last_unconstrained" if floor > power_w else "measured"
    return floor, source, floor
