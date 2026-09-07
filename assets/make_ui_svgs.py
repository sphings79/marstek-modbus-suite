#!/usr/bin/env python3
"""Draw the panel's tabs as SVG for the README.

Screenshots would date the moment a value changes and carry whatever battery
happened to be connected. These are drawn from the same palette the panel
uses, with the readings in assets/preview/data.js, so the pictures and the
live preview show the same battery.

They are drawings, so they can drift from the panel. When a view changes,
open assets/preview/ beside the picture and compare before shipping.

Run from the repository root:

    python3 assets/make_ui_svgs.py
"""

from __future__ import annotations

import pathlib

W = 1000
BG = "#080d13"
SURFACE = "#0b131d"
INSET = "#0d1723"
LINE = "#1b2b3d"
LINE_SOFT = "#152435"
FG = "#dff2f6"
FG2 = "#9fb8c6"
DIM = "#5d7d92"
ACCENT = "#2ae6dc"
MAGENTA = "#ff3ea5"
OK = "#35d67a"
WARN = "#ffb020"
CRIT = "#ff4d5e"
TRACK = "#132434"

SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"

TABS = ["OVERVIEW", "CELLS", "PACKS", "SOLAR", "ENERGY", "CONTROL", "SYSTEM"]


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def txt(x, y, s, *, fill=FG, size=11, font=MONO, weight=None, anchor=None, spacing=None):
    bits = [f'x="{x}" y="{y}"', f'font-family="{font}"', f'font-size="{size}"', f'fill="{fill}"']
    if weight:
        bits.append(f'font-weight="{weight}"')
    if anchor:
        bits.append(f'text-anchor="{anchor}"')
    if spacing:
        bits.append(f'letter-spacing="{spacing}"')
    return f"<text {' '.join(bits)}>{esc(str(s))}</text>"


def rect(x, y, w, h, *, fill="none", stroke=None, rx=0):
    bits = [f'x="{x}" y="{y}" width="{w}" height="{h}"', f'fill="{fill}"']
    if stroke:
        bits.append(f'stroke="{stroke}"')
    if rx:
        bits.append(f'rx="{rx}"')
    return f"<rect {' '.join(bits)}/>"


def label(x, y, s, fill=DIM):
    """The panel's small uppercase caption."""
    return txt(x, y, s, fill=fill, size=8.5, spacing="1.6")


def kv(x, y, key, value, *, width=196, colour=FG):
    """One label/value row with a dashed rule beneath it."""
    return (
        txt(x, y, key, fill=DIM, size=10)
        + txt(x + width, y, value, fill=colour, size=11, weight="600", anchor="end")
        + f'<path d="M{x} {y + 7}H{x + width}" stroke="{LINE_SOFT}" stroke-dasharray="2 3"/>'
    )


def pair(x, y, value, tail, *, size=14, colour=FG, tail_size=8.5):
    """A number and its unit as one centred run, so the two cannot drift."""
    t = (f'<tspan font-size="{tail_size}" fill="{DIM}">{esc(tail)}</tspan>') if tail else ""
    return (f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" fill="{colour}" '
            f'font-weight="600" text-anchor="middle">{esc(value)}{t}</text>')


def panel(x, y, w, h, title=None, note=None):
    out = [rect(x, y, w, h, fill=SURFACE, stroke=LINE)]
    if title:
        out.append(label(x + 14, y + 22, title))
    if note:
        out.append(txt(x + w - 14, y + 22, note, fill=DIM, size=8.5, spacing="1.6", anchor="end"))
    return "".join(out)


def tile(x, y, w, value, unit, caption, *, colour=FG, bar=None, foot=None):
    out = [rect(x, y, w, 84, fill=SURFACE, stroke=LINE), label(x + 14, y + 22, caption)]
    out.append(txt(x + 14, y + 50, value, fill=colour, size=21, weight="600"))
    if unit:
        offset = 14 + len(str(value)) * 13.1 + 5
        out.append(txt(x + offset, y + 50, unit, fill=DIM, size=10))
    if bar is not None:
        out.append(rect(x + 14, y + 62, w - 28, 4, fill=TRACK))
        out.append(rect(x + 14, y + 62, (w - 28) * min(max(bar, 0), 1), 4, fill=colour))
    if foot:
        out.append(txt(x + 14, y + 76, foot, fill=DIM, size=8.5, spacing="1.4"))
    return "".join(out)


def gear(cx, cy, colour):
    """Eight teeth and a hole - the settings button in the header."""
    import math
    teeth = []
    for i in range(8):
        a = math.radians(i * 45)
        x, y = cx + 6.4 * math.cos(a), cy + 6.4 * math.sin(a)
        teeth.append(f'<rect x="{x - 1.7:.2f}" y="{y - 1.7:.2f}" width="3.4" height="3.4" '
                     f'fill="{colour}" transform="rotate({i * 45} {x:.2f} {y:.2f})"/>')
    return (f'<circle cx="{cx}" cy="{cy}" r="5.2" fill="none" stroke="{colour}" stroke-width="2.6"/>'
            + "".join(teeth))


def frame(height, active, body):
    """The window: border, brand, tab strip, then whatever the tab draws."""
    tabs = []
    cursor = 176
    for name in TABS:
        width = len(name) * 6.6 + 18
        if name == active:
            tabs.append(rect(cursor - 10, 20, width, 26, fill="#0e2b30"))
            tabs.append(txt(cursor, 38, name, fill=ACCENT, size=10.5, spacing="1.5"))
            tabs.append(f'<path d="M{cursor - 10} 47H{cursor - 10 + width}" stroke="{ACCENT}" stroke-width="2"/>')
        else:
            tabs.append(txt(cursor, 38, name, fill="#4a6478", size=10.5, spacing="1.5"))
        cursor += width + 4

    head = (
        rect(0, 0, W, height, fill=BG, stroke=LINE, rx=8)
        + txt(24, 38, "MARSTEK ", fill=FG, size=14, font=SANS, weight="700")
        + txt(96, 38, "Venus D", fill=ACCENT, size=14, font=SANS, weight="700")
        + "".join(tabs)
        + txt(W - 46, 38, "MODBUS · WLAN −52 dBm", fill=DIM, size=10, anchor="end")
        + gear(W - 32, 32, ACCENT if active == "SETTINGS" else DIM)
        + f'<path d="M0 47H{W}" stroke="{LINE}"/>'
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {height}" '
        f'width="{W}" height="{height}" role="img" aria-label="{esc(active)} tab of the '
        f'Marstek Modbus Suite panel">{head}{body}</svg>\n'
    )


# ---------------------------------------------------------------- overview --
def overview() -> str:
    h = 484
    out = []

    out.append(panel(24, 70, 210, 250, "ELECTRICAL · NOW"))
    rows = [
        ("AC power", "715 W", FG), ("Battery", "−771 W", MAGENTA),
        ("Voltage", "52,9 V", FG), ("Current", "−14,6 A", FG),
        ("AC voltage", "239,1 V", FG), ("Frequency", "50,0 Hz", FG),
        ("Conversion", "92,7 %", OK),
    ]
    for i, (k, v, c) in enumerate(rows):
        out.append(kv(40, 122 + i * 25, k, v, width=178, colour=c))

    # the double ring
    cx, cy = 500, 166
    out.append(f'<circle cx="{cx}" cy="{cy}" r="76" fill="none" stroke="{TRACK}" stroke-width="12"/>')
    out.append(
        f'<circle cx="{cx}" cy="{cy}" r="76" fill="none" stroke="{ACCENT}" stroke-width="12" '
        f'stroke-dasharray="291.3 477.5" transform="rotate(-90 {cx} {cy})"/>'
    )
    out.append(f'<circle cx="{cx}" cy="{cy}" r="61" fill="none" stroke="{TRACK}" stroke-width="4"/>')
    out.append(
        f'<circle cx="{cx}" cy="{cy}" r="61" fill="none" stroke="{MAGENTA}" stroke-width="4" '
        f'stroke-dasharray="187.8 383.3" transform="rotate(-90 {cx} {cy})"/>'
    )
    out.append(txt(cx - 6, cy + 14, "61", fill=FG, size=48, weight="600", anchor="middle"))
    out.append(txt(cx + 30, cy + 14, "%", fill=DIM, size=16))
    out.append(txt(cx, cy + 38, "SOC · BMS", fill=DIM, size=9, spacing="2.4", anchor="middle"))

    # four cells under the ring; two of them follow the direction of flow
    out.append(rect(326, 272, 348, 52, fill=SURFACE, stroke=LINE))
    for x in (426, 516, 606):
        out.append(f'<path d="M{x} 272V324" stroke="{LINE}"/>')
    cells_ = [
        (376, "STORED / TOTAL", "10,93", " / 17,92", FG),
        (471, "USABLE", "8,78", " kWh", FG),
        (561, "UNTIL EMPTY", "13,5", " h", FG),
        (640, "PACKS", "7", "", FG2),
    ]
    for x, cap, val, tail, colour in cells_:
        out.append(txt(x, 291, cap, fill=DIM, size=7, spacing="1.1", anchor="middle"))
        out.append(pair(x, 314, val, tail, colour=colour))
    out.append(txt(500, 350, "▼ 771 W", fill=MAGENTA, size=20, weight="600", anchor="middle"))
    out.append(txt(500, 368, "DISCHARGING · anti_feed", fill=DIM, size=8.5, spacing="1.6",
                   anchor="middle"))

    out.append(panel(766, 70, 210, 250, "RESERVE · LIFETIME"))
    rows = [
        ("Usable energy", "8,78 kWh", FG), ("Energy to full", "6,99 kWh", FG),
        ("Backup reserve", "0,72 kWh", ACCENT), ("Full cycles", "5,66", FG),
        ("Remaining cycles", "5 994", FG), ("Health", "99,91 %", OK),
        ("Runtime to full", "0,0 h", FG),
    ]
    for i, (k, v, c) in enumerate(rows):
        out.append(kv(782, 122 + i * 25, k, v, width=178, colour=c))

    for i, (val, unit, cap, colour, bar, foot) in enumerate([
        ("9,13", "kWh", "CHARGED TODAY", FG, 0.64, None),
        ("5,91", "kWh", "DISCHARGED TODAY", MAGENTA, 0.41, None),
        ("55", "mV", "LARGEST CELL DELTA", WARN, 0.55, "in pack 3"),
        ("28,2", "°C", "INTERNAL TEMP", OK, 0.35, None),
        ("0", "W", "MPPT TOTAL", FG, 0.0, "4 inputs"),
        ("83,3", "%", "ROUND TRIP", FG, 0.833, None),
    ]):
        out.append(tile(24 + i * 159, 386, 143, val, unit, cap, colour=colour, bar=bar, foot=foot))

    return frame(h, "OVERVIEW", "".join(out))


# ------------------------------------------------------------------- cells --
def cells() -> str:
    h = 486
    out = []

    for i, (val, unit, cap, colour, bar, foot) in enumerate([
        ("3,345", "V", "HIGHEST CELL", FG, None, "pack 3"),
        ("3,290", "V", "LOWEST CELL", FG, None, "pack 3"),
        ("55", "mV", "SPREAD ACROSS STACK", FG, None, "expected, see below"),
        ("15", "mV", "MEAN DELTA IN PACK", FG, None, "widest: pack 3"),
        ("1,8", "K", "CELL TEMP SPAN", OK, None, "30,8 – 32,6 °C"),
        ("7 / 7", "", "PACKS REPORTING", OK, None, "112 cells"),
    ]):
        out.append(tile(24 + i * 159, 70, 143, val, unit, cap, colour=colour, bar=bar, foot=foot))

    out.append(panel(24, 172, W - 48, 290, "CELL VOLTAGE RANGE PER PACK · SHARED AXIS",
                     "bar = lowest to highest cell"))

    # one shared voltage axis
    lo, hi = 3.282, 3.353
    left, width = 148, 640
    for frac in (0, 0.25, 0.5, 0.75, 1.0):
        x = left + width * frac
        out.append(txt(x, 208, f"{lo + (hi - lo) * frac:.3f}".replace(".", ","),
                       fill=DIM, size=8.5, spacing="1.4", anchor="middle"))
    out.append(f'<path d="M{left} 214H{left + width}" stroke="{LINE}"/>')

    packs = [
        (1, 3.294, 3.302, "8 mV", OK, "24 ⟳ · 36,3 °C"),
        (2, 3.296, 3.304, "8 mV", OK, "22 ⟳ · 34,5 °C"),
        (3, 3.290, 3.345, "55 mV", WARN, "20 ⟳ · 29,5 °C"),
        (4, 3.298, 3.307, "9 mV", OK, "26 ⟳ · 26,2 °C"),
        (5, 3.295, 3.303, "8 mV", OK, "25 ⟳ · 26,1 °C"),
        (6, 3.293, 3.301, "8 mV", OK, "68 ⟳ · 25,2 °C"),
        (7, 3.294, 3.302, "8 mV", OK, "63 ⟳ · 24,0 °C"),
    ]
    for i, (n, mn, mx, delta, colour, note) in enumerate(packs):
        y = 232 + i * 28
        flagged = colour is not OK
        out.append(txt(44, y + 12, f"PACK {n}", fill=colour if flagged else FG,
                       size=11, weight="600"))
        out.append(rect(left, y, width, 16, fill=INSET))
        bx = left + width * (mn - lo) / (hi - lo)
        bw = max(width * (mx - mn) / (hi - lo), 3)
        out.append(rect(bx, y + 2, bw, 12, fill=colour))
        mid = left + width * ((mn + mx) / 2 - lo) / (hi - lo)
        out.append(rect(mid, y - 2, 1, 20, fill=FG))
        out.append(txt(834, y + 12, delta, fill=colour if flagged else FG, size=11,
                       weight="600", anchor="end"))
        out.append(txt(W - 40, y + 12, note, fill=DIM, size=8.5, spacing="1.2", anchor="end"))

    out.append(txt(44, 440, "The tick inside each bar is the pack's midpoint. A narrow bar is a "
                            "balanced pack, a wide one is drift inside it,", fill=DIM, size=9.5))
    out.append(txt(44, 456, "and a bar sitting apart from the others is a pack at a different level "
                            "than the rest.", fill=DIM, size=9.5))
    return frame(h, "CELLS", "".join(out))


# ------------------------------------------------------------------- packs --
def packs() -> str:
    h = 488
    out = []

    for i, (val, unit, cap, colour, bar, foot) in enumerate([
        ("61", "%", "STATE OF CHARGE", FG, None, "the device reports it"),
        ("60,6", "%", "MEAN OF THE PACKS", FG, None, "from 7 packs"),
        ("2,8", "pp", "SPREAD", OK, 0.112, None),
        ("10,93", "kWh", "STORED ENERGY", FG, None, "packs add up to 10,89"),
        ("2,56", "kWh", "PER PACK", FG, None, "nominal, per pack"),
        ("248", "", "CYCLES, ALL PACKS", FG, None, "7 of 7 packs report"),
    ]):
        out.append(tile(24 + i * 159, 70, 143, val, unit, cap, colour=colour, bar=bar, foot=foot))

    out.append(panel(24, 172, W - 48, 294, "STATE OF CHARGE PER PACK",
                     "column height = SOC · figure inside = kWh"))

    # red at empty through amber to green at full, same ramp as the panel
    def fill_colour(soc: float) -> str:
        t = min(max(soc, 0), 100) / 100
        hue = 4 + 41 * (t / 0.5) if t < 0.5 else 45 + 95 * ((t - 0.5) / 0.5)
        return f"hsl({hue:.0f} 70% 50%)"

    data = [
        (1, 60.8, "1,56", "3,294 – 3,302 V", False),
        (2, 61.0, "1,56", "3,296 – 3,304 V", False),
        (3, 60.5, "1,55", "3,290 – 3,345 V", False),
        (4, 62.4, "1,60", "3,298 – 3,307 V", True),
        (5, 60.0, "1,54", "3,295 – 3,303 V", False),
        (6, 59.6, "1,53", "3,293 – 3,301 V", False),
        (7, 60.1, "1,54", "3,294 – 3,302 V", False),
    ]
    col_w, gap, top, col_h = 118, 14, 238, 132
    for i, (n, soc, kwh, note, working) in enumerate(data):
        x = 44 + i * (col_w + gap)
        out.append(txt(x + col_w / 2, top - 10, f"{soc:.1f}".replace(".", ",") + " %",
                       fill=FG, size=15, weight="600", anchor="middle"))
        out.append(rect(x, top, col_w, col_h, fill=INSET, stroke=LINE))
        fh = col_h * soc / 100
        out.append(rect(x, top + col_h - fh, col_w, fh, fill=fill_colour(soc)))
        out.append(txt(x + col_w / 2, top + col_h - fh + 17, f"{kwh} kWh",
                       fill="#0a1410", size=11, weight="600", anchor="middle"))
        out.append(txt(x + col_w / 2, top + col_h - fh + 31, f"{soc:.1f}".replace(".", ",") + " %",
                       fill="#0a1410", size=9.5, anchor="middle"))
        # discharge floor, and below it the limit only the backup socket reaches
        fy = top + col_h - col_h * 0.12
        out.append(f'<path d="M{x} {fy}H{x + col_w}" stroke="{MAGENTA}" stroke-width="2" '
                   f'stroke-dasharray="4 3"/>')
        by = top + col_h - col_h * 0.08
        out.append(f'<path d="M{x} {by}H{x + col_w}" stroke="{DIM}" stroke-dasharray="1 3"/>')
        name = f"PACK {n}"
        out.append(txt(x + col_w / 2, top + col_h + 18, name,
                       fill=ACCENT if working else FG, size=11, weight="600", anchor="middle"))
        if working:
            out.append(f'<circle cx="{x + col_w / 2 + len(name) * 3.6 + 8}" '
                       f'cy="{top + col_h + 14}" r="3" fill="{ACCENT}"/>')
        out.append(txt(x + col_w / 2, top + col_h + 32, note, fill=DIM, size=8.5, anchor="middle"))

    out.append(txt(44, 438, "The dashed line is the discharge floor at 12 %, the dotted one the 8 % "
                            "the backup socket reaches during an outage.", fill=DIM, size=9.5))
    out.append(txt(44, 454, "Fill runs red when empty to green when full; the marked pack is the one "
                            "carrying the current right now.", fill=DIM, size=9.5))
    return frame(h, "PACKS", "".join(out))


# ----------------------------------------------------------------- control --
def slider(x, y, w, name, value, unit, frac, lo, hi, *, colour=ACCENT):
    """A labelled range with its handle, as the control tab draws it."""
    out = [txt(x, y, name, fill=DIM, size=9.5, spacing="1.2")]
    vw = len(value) * 11.4
    out.append(txt(x + w - 14, y + 2, value, fill=FG, size=17, weight="600", anchor="end"))
    out.append(txt(x + w - 12, y + 2, unit, fill=DIM, size=9))
    out.append(rect(x, y + 16, w, 3, fill=TRACK))
    out.append(rect(x, y + 16, w * frac, 3, fill=colour))
    out.append(f'<circle cx="{x + w * frac}" cy="{y + 17.5}" r="6" fill="{colour}"/>')
    out.append(txt(x, y + 34, lo, fill=DIM, size=8.5))
    out.append(txt(x + w, y + 34, hi, fill=DIM, size=8.5, anchor="end"))
    return "".join(out)


def segment(x, y, w, name, options, chosen):
    """A row of mutually exclusive choices, the selected one filled."""
    out = [txt(x, y, name, fill=DIM, size=9.5, spacing="1.2")]
    cw = (w - (len(options) - 1)) / len(options)
    for i, option in enumerate(options):
        ox = x + i * (cw + 1)
        on = option == chosen
        out.append(rect(ox, y + 8, cw, 24, fill=ACCENT if on else INSET))
        out.append(txt(ox + cw / 2, y + 24, option, fill="#04141a" if on else FG2,
                       size=9, spacing="1.2", anchor="middle"))
    return "".join(out)


def toggle(x, y, w, name, hint, on):
    out = [txt(x, y, name, fill=FG, size=10.5),
           txt(x, y + 14, hint, fill=DIM, size=8.5)]
    tx = x + w - 34
    out.append(f'<rect x="{tx}" y="{y - 9}" width="34" height="18" rx="9" '
               f'fill="{ACCENT if on else TRACK}"/>')
    out.append(f'<circle cx="{tx + (25 if on else 9)}" cy="{y}" r="6.4" '
               f'fill="{"#04141a" if on else DIM}"/>')
    return "".join(out)


def control() -> str:
    h = 556
    out = []

    out.append(panel(24, 70, 300, 208, "POWER NOW"))
    out.append(slider(40, 108, 268, "SET CHARGE POWER", "2.500", "W", 1.0, "0", "2.500"))
    out.append(slider(40, 172, 268, "SET DISCHARGE POWER", "800", "W", 0.32, "0", "2.500"))
    for i, line in enumerate([
        "These two set the working point directly. Anything",
        "regulating the battery from outside writes the same",
        "registers and will win within seconds.",
    ]):
        out.append(txt(40, 232 + i * 14, line, fill=DIM, size=9))

    out.append(panel(340, 70, 300, 208, "LIMITS"))
    out.append(slider(356, 108, 268, "MAXIMUM CHARGE POWER", "2.500", "W", 1.0, "0", "2.500"))
    out.append(slider(356, 172, 268, "MAXIMUM DISCHARGE POWER", "2.500", "W", 1.0, "0", "2.500"))
    out.append(slider(356, 236, 268, "MAXIMUM SOC", "95", "%", 0.94, "10", "100"))

    out.append(panel(656, 70, 320, 208, "MODE"))
    out.append(segment(672, 108, 288, "USER WORK MODE",
                       ["MANUAL", "ANTI-FEED", "TRADE"], "ANTI-FEED"))
    out.append(segment(672, 158, 288, "FORCED MODE",
                       ["STANDBY", "CHARGE", "DISCHARGE"], "STANDBY"))
    out.append(toggle(672, 218, 288, "Backup function",
                      "Keeps a reserve for the off-grid output.", True))
    out.append(toggle(672, 254, 288, "RS485 control mode",
                      "Off hands control back to the device.", True))

    out.append(panel(24, 290, W - 48, 168, "SCHEDULES",
                     "times are the device's own, in its local time"))
    for x, name in [(60, "ON"), (120, "WINDOW"), (330, "POWER"), (860, "DAY")]:
        out.append(txt(x, 334, name, fill=DIM, size=8, spacing="1.4"))
    out.append(f'<path d="M44 342H{W - 44}" stroke="{LINE}"/>')

    rows = [
        (1, True, "01:30", "05:30", "−2000", "Mon"),
        (2, True, "17:00", "21:00", "1500", "Mon"),
        (3, False, "00:00", "00:00", "0", "—"),
        (4, False, "00:00", "00:00", "0", "—"),
    ]
    for i, (n, on, start, end, power, day) in enumerate(rows):
        y = 362 + i * 24
        alpha = "" if on else ' opacity="0.5"'
        out.append(f"<g{alpha}>")
        out.append(txt(44, y + 4, str(n), fill=FG, size=10, weight="600"))
        out.append(f'<rect x="60" y="{y - 6}" width="26" height="14" rx="7" '
                   f'fill="{ACCENT if on else TRACK}"/>')
        out.append(f'<circle cx="{60 + (19 if on else 7)}" cy="{y + 1}" r="5" '
                   f'fill="{"#04141a" if on else DIM}"/>')
        for bx, value in ((120, start), (200, end)):
            out.append(rect(bx, y - 9, 66, 20, fill=INSET, stroke=LINE))
            out.append(txt(bx + 8, y + 5, value, fill=FG, size=10))
        out.append(txt(190, y + 5, "–", fill=DIM, size=10))
        out.append(rect(330, y - 9, 76, 20, fill=INSET, stroke=LINE))
        out.append(txt(398, y + 5, power, fill=FG, size=10, anchor="end"))
        out.append(txt(412, y + 5, "W", fill=DIM, size=8.5))
        out.append(rect(860, y - 9, 96, 20, fill=INSET, stroke=LINE))
        out.append(txt(868, y + 5, day, fill=FG, size=10))
        out.append(f'<path d="M944 {y - 2}l4 5 4-5" stroke="{DIM}" fill="none"/>')
        out.append(f'<path d="M44 {y + 11}H{W - 44}" stroke="{LINE_SOFT}" '
                   f'stroke-dasharray="2 3"/>')
        out.append("</g>")

    # The title sits above the button rather than behind it.
    out.append(panel(24, 470, W - 48, 66, "DEVICE"))
    out.append(rect(44, 500, 132, 24, fill=INSET, stroke=LINE))
    out.append(txt(110, 516, "RESTART DEVICE", fill=FG2, size=9, spacing="1.2", anchor="middle"))
    out.append(txt(192, 516, "A factory reset is deliberately not offered here — it is in the "
                             "entity list.", fill=DIM, size=9))
    return frame(h, "CONTROL", "".join(out))


# ---------------------------------------------------------------- settings --
SCHEMES = [
    ("Reactor", "#05090f", "#0b131d", "#1b2b3d", "#2ae6dc", "#ff3ea5", "#dff2f6", "#5d7d92"),
    ("Cockpit", "#0a0704", "#14100a", "#35291a", "#ffb020", "#ff5f3a", "#f5e8d2", "#8a7355"),
    ("Verdant", "#040b07", "#0a150f", "#1c3226", "#7ee787", "#3ddbd9", "#ddf5e5", "#5d8570"),
    ("Plasma", "#07050f", "#110d1e", "#2c2350", "#a06bff", "#ff5bc8", "#eae4ff", "#7568a8"),
    ("Ember", "#0a0605", "#150e0b", "#38231b", "#ff6b3d", "#ffc247", "#f7e6dd", "#8d6a5c"),
    ("Glacier", "#060a10", "#0d141d", "#223549", "#63b3ff", "#9fd8e8", "#e4eef8", "#67839c"),
    ("Home Assistant", "#0d1117", "#161b22", "#30363d", "#03a9f4", "#ff9800", "#e6edf3", "#7d8590"),
]


def settings() -> str:
    h = 592
    out = []

    # Four across, so all seven schemes fit and the caption below them is clear.
    out.append(panel(24, 70, 618, 306, "COLOUR SCHEME"))
    cw, ch = 139, 86
    for i, (name, bg, surface, line, accent, second, fg, dim) in enumerate(SCHEMES):
        col, row = i % 4, i // 4
        x = 40 + col * (cw + 10)
        y = 102 + row * (ch + 40)
        chosen = i == 0
        out.append(rect(x, y, cw, ch, fill=bg, stroke=accent if chosen else LINE))
        out.append(rect(x + 10, y + 12, 46, 5, fill=accent))
        out.append(rect(x + 62, y + 12, 28, 5, fill=second))
        for j, c in enumerate(("#35d67a", "#ffb020", "#ff4d5e")):
            out.append(f'<circle cx="{x + 100 + j * 11}" cy="{y + 14.5}" r="3.2" fill="{c}"/>')
        out.append(rect(x + 10, y + 28, cw - 20, 44, fill=surface, stroke=line))
        out.append(rect(x + 20, y + 40, 76, 4, fill=fg))
        out.append(rect(x + 20, y + 52, 46, 4, fill=dim))
        out.append(rect(x, y + ch, cw, 22, fill="#0e2b30" if chosen else SURFACE,
                        stroke=accent if chosen else LINE))
        out.append(txt(x + 9, y + ch + 15, name, fill=ACCENT if chosen else FG2, size=9))
    out.append(txt(40, 358, "Each scheme brings its own light and dark version. The swatch is "
                            "painted in the scheme it offers.", fill=DIM, size=9))

    out.append(panel(658, 70, 318, 306, "APPEARANCE"))
    out.append(segment(674, 112, 286, "LIGHT OR DARK",
                       ["HOME ASSISTANT", "DARK", "LIGHT"], "HOME ASSISTANT"))
    out.append(segment(674, 174, 286, "DECIMAL PLACES", ["NORMAL", "ONE MORE"], "NORMAL"))
    out.append(txt(674, 248, "Settings live in this browser only. Another", fill=DIM, size=9))
    out.append(txt(674, 262, "browser, or another device, keeps its own.", fill=DIM, size=9))
    out.append(rect(674, 284, 138, 26, fill=INSET, stroke=LINE))
    out.append(txt(743, 301, "RESET TO DEFAULTS", fill=FG2, size=8, spacing="1", anchor="middle"))
    out.append(rect(822, 284, 122, 26, fill=INSET, stroke=LINE))
    out.append(txt(883, 301, "IMPORT / EXPORT", fill=FG2, size=8, spacing="1", anchor="middle"))

    out.append(panel(24, 392, 480, 176, "TAB WHEN OPENING"))
    chips = ["LAST USED", "OVERVIEW", "CELLS", "PACKS", "SOLAR", "ENERGY", "CONTROL", "SYSTEM"]
    cursor, cy_ = 40, 432
    for name in chips:
        w = len(name) * 6.2 + 20
        if cursor + w > 488:
            cursor, cy_ = 40, cy_ + 32
        chosen = name == "LAST USED"
        out.append(rect(cursor, cy_, w, 24, fill=ACCENT if chosen else INSET, stroke=LINE))
        out.append(txt(cursor + w / 2, cy_ + 16, name, fill="#04141a" if chosen else FG2,
                       size=8.5, spacing="1", anchor="middle"))
        cursor += w + 8
    out.append(txt(40, 548, "A fixed tab the battery cannot fill falls back to the overview.",
                   fill=DIM, size=9))

    out.append(panel(520, 392, 456, 176, "TABS"))
    entries = [("OVERVIEW", True, "always shown"), ("CELLS", True, None), ("PACKS", True, None),
               ("SOLAR", False, "no PV inputs"), ("ENERGY", True, None), ("CONTROL", True, None)]
    for i, (name, available, note) in enumerate(entries):
        y = 438 + i * 19
        opacity = ' opacity="0.45"' if not available else ""
        out.append(f"<g{opacity}>")
        out.append(rect(536, y - 9, 12, 12, fill=ACCENT if available else TRACK, stroke=LINE))
        if available:
            out.append(f'<path d="M539 {y - 3}l2.4 2.6 4-5" stroke="#04141a" stroke-width="1.6" '
                       f'fill="none"/>')
        out.append(txt(558, y + 1, name, fill=FG, size=10))
        if note:
            out.append(txt(960, y + 1, note, fill=DIM, size=8.5, anchor="end"))
        out.append(f'<path d="M536 {y + 8}H960" stroke="{LINE_SOFT}" stroke-dasharray="2 3"/>')
        out.append("</g>")
    out.append(txt(536, 556, "Greyed out means this battery does not report what the tab shows.",
                   fill=DIM, size=9))

    return frame(h, "SETTINGS", "".join(out))


def main() -> None:
    here = pathlib.Path(__file__).resolve().parent
    for name, svg in [("ui-overview.svg", overview()),
                      ("ui-cells.svg", cells()),
                      ("ui-packs.svg", packs()),
                      ("ui-control.svg", control()),
                      ("ui-settings.svg", settings())]:
        (here / name).write_text(svg)
        print(f"  {here / name}  {len(svg) // 1024} KB")


if __name__ == "__main__":
    main()
