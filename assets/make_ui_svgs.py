#!/usr/bin/env python3
"""Draw the panel's tabs as SVG for the README.

Screenshots would date the moment a value changes and carry whatever battery
happened to be connected. These are drawn from the same palette the panel
uses, with readings from a Venus D, so they show the layout rather than one
particular afternoon.

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

TABS = ["OVERVIEW", "CELLS", "PACKS", "SOLAR", "ENERGY", "SYSTEM"]


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


def frame(height, active, body):
    """The window: border, brand, tab strip, then whatever the tab draws."""
    tabs = []
    cursor = 186
    for name in TABS:
        width = len(name) * 7.2 + 22
        if name == active:
            tabs.append(rect(cursor - 10, 20, width, 26, fill="#0e2b30"))
            tabs.append(txt(cursor, 38, name, fill=ACCENT, size=10.5, spacing="1.5"))
            tabs.append(f'<path d="M{cursor - 10} 47H{cursor - 10 + width}" stroke="{ACCENT}" stroke-width="2"/>')
        else:
            tabs.append(txt(cursor, 38, name, fill="#4a6478", size=10.5, spacing="1.5"))
        cursor += width + 8

    head = (
        rect(0, 0, W, height, fill=BG, stroke=LINE, rx=8)
        + txt(24, 38, "MARSTEK ", fill=FG, size=14, font=SANS, weight="700")
        + txt(96, 38, "Venus D", fill=ACCENT, size=14, font=SANS, weight="700")
        + "".join(tabs)
        + txt(W - 24, 38, "MODBUS · WLAN −52 dBm", fill=DIM, size=10, anchor="end")
        + f'<path d="M0 47H{W}" stroke="{LINE}"/>'
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {height}" '
        f'width="{W}" height="{height}" role="img" aria-label="{esc(active)} tab of the '
        f'Marstek Modbus Suite panel">{head}{body}</svg>\n'
    )


# ---------------------------------------------------------------- overview --
def overview() -> str:
    h = 470
    out = []

    out.append(panel(24, 70, 210, 236, "ELECTRICAL · NOW"))
    rows = [
        ("AC power", "715 W", FG), ("Battery", "−771 W", MAGENTA),
        ("Voltage", "52,9 V", FG), ("Current", "0,0 A", FG),
        ("AC voltage", "239,1 V", FG), ("Frequency", "50,0 Hz", FG),
        ("Conversion", "92,7 %", OK),
    ]
    for i, (k, v, c) in enumerate(rows):
        out.append(kv(40, 122 + i * 25, k, v, width=178, colour=c))

    # the double ring
    cx, cy = 500, 168
    out.append(f'<circle cx="{cx}" cy="{cy}" r="76" fill="none" stroke="{TRACK}" stroke-width="12"/>')
    out.append(
        f'<circle cx="{cx}" cy="{cy}" r="76" fill="none" stroke="{ACCENT}" stroke-width="12" '
        f'stroke-dasharray="339.1 477.5" transform="rotate(-90 {cx} {cy})"/>'
    )
    out.append(f'<circle cx="{cx}" cy="{cy}" r="61" fill="none" stroke="{TRACK}" stroke-width="4"/>')
    out.append(
        f'<circle cx="{cx}" cy="{cy}" r="61" fill="none" stroke="{MAGENTA}" stroke-width="4" '
        f'stroke-dasharray="256.8 383.3" transform="rotate(-90 {cx} {cy})"/>'
    )
    out.append(txt(cx - 6, cy + 14, "71", fill=FG, size=48, weight="600", anchor="middle"))
    out.append(txt(cx + 30, cy + 14, "%", fill=DIM, size=16))
    out.append(txt(cx, cy + 38, "SOC · BMS", fill=DIM, size=9, spacing="2.4", anchor="middle"))

    # split readout under the ring
    out.append(rect(390, 276, 220, 48, fill=SURFACE, stroke=LINE))
    out.append(f'<path d="M463 276V324M537 276V324" stroke="{LINE}"/>')
    for x, cap, val, colour in [
        (426, "STORED", "12,72", FG), (500, "CAPACITY", "17,92", FG2), (574, "TO EMPTY", "13,5 h", FG),
    ]:
        out.append(txt(x, 294, cap, fill=DIM, size=7.5, spacing="1.4", anchor="middle"))
        out.append(txt(x, 314, val, fill=colour, size=14, weight="600", anchor="middle"))
    out.append(txt(500, 352, "▼ 771 W", fill=MAGENTA, size=20, weight="600", anchor="middle"))
    out.append(txt(500, 370, "DISCHARGING · anti_feed", fill=DIM, size=8.5, spacing="1.6", anchor="middle"))

    out.append(panel(766, 70, 210, 236, "RESERVE · LIFETIME"))
    rows = [
        ("Usable", "10,57 kWh", FG), ("To full", "5,20 kWh", FG),
        ("Runtime", "13,5 h", FG), ("Full cycles", "5,32", FG),
        ("Remaining", "5 995", FG), ("Health", "99,91 %", OK),
        ("Cell delta", "54 mV", WARN),
    ]
    for i, (k, v, c) in enumerate(rows):
        out.append(kv(782, 122 + i * 25, k, v, width=178, colour=c))

    for i, (val, unit, cap, colour, bar, foot) in enumerate([
        ("9,13", "kWh", "CHARGED TODAY", FG, 0.64, None),
        ("5,91", "kWh", "DISCHARGED TODAY", MAGENTA, 0.41, None),
        ("54", "mV", "CELL DELTA", WARN, 0.54, "across 7 packs"),
        ("28,2", "°C", "INTERNAL TEMP", OK, 0.35, None),
        ("0", "W", "MPPT TOTAL", FG, 0.0, "4 inputs"),
        ("81,7", "%", "ROUND TRIP", FG, 0.817, None),
    ]):
        out.append(tile(24 + i * 159, 386, 143, val, unit, cap, colour=colour, bar=bar, foot=foot))

    return frame(h, "OVERVIEW", "".join(out))


# ------------------------------------------------------------------- cells --
def cells() -> str:
    h = 478
    out = []

    for i, (val, unit, cap, colour, bar, foot) in enumerate([
        ("3,331", "V", "HIGHEST CELL", FG, None, "pack 2"),
        ("3,277", "V", "LOWEST CELL", FG, None, "pack 3"),
        ("54", "mV", "SPREAD ACROSS STACK", WARN, 0.54, "limit 100 mV"),
        ("3,1", "mV", "MEAN DELTA IN PACK", OK, None, "widest: pack 1, 6 mV"),
        ("1,8", "K", "CELL TEMP SPAN", OK, None, "30,8 – 32,6 °C"),
        ("7 / 7", "", "PACKS REPORTING", OK, None, "112 cells"),
    ]):
        out.append(tile(24 + i * 159, 70, 143, val, unit, cap, colour=colour, bar=bar, foot=foot))

    out.append(panel(24, 172, W - 48, 282, "CELL VOLTAGE RANGE PER PACK · SHARED AXIS",
                     "bar = lowest to highest cell"))

    # one shared voltage axis
    lo, hi = 3.270, 3.340
    left, width = 148, 660
    for frac in (0, 0.25, 0.5, 0.75, 1.0):
        x = left + width * frac
        out.append(txt(x, 208, f"{lo + (hi - lo) * frac:.3f}".replace(".", ","),
                       fill=DIM, size=8.5, spacing="1.4", anchor="middle"))
    out.append(f'<path d="M{left} 214H{left + width}" stroke="{LINE}"/>')

    packs = [
        (1, 3.303, 3.309, "6 mV", WARN, "28,5 °C"),
        (2, 3.329, 3.331, "2 mV", OK, "22 ⟳ · 26,4 °C"),
        (3, 3.277, 3.282, "5 mV", CRIT, "20 ⟳ · 26,1 °C"),
        (4, 3.328, 3.330, "2 mV", OK, "26 ⟳ · 25,1 °C"),
        (5, 3.326, 3.328, "2 mV", OK, "25 ⟳ · 25,3 °C"),
        (6, 3.325, 3.327, "2 mV", OK, "68 ⟳ · 24,3 °C"),
        (7, 3.325, 3.328, "3 mV", OK, "63 ⟳ · 23,3 °C"),
    ]
    for i, (n, mn, mx, delta, colour, note) in enumerate(packs):
        y = 232 + i * 28
        out.append(txt(44, y + 12, f"PACK {n}", fill=CRIT if colour is CRIT else FG,
                       size=11, weight="600"))
        out.append(rect(left, y, width, 16, fill=INSET))
        bx = left + width * (mn - lo) / (hi - lo)
        bw = max(width * (mx - mn) / (hi - lo), 3)
        out.append(rect(bx, y + 2, bw, 12, fill=colour))
        mid = left + width * ((mn + mx) / 2 - lo) / (hi - lo)
        out.append(rect(mid, y - 2, 1, 20, fill=FG))
        out.append(txt(852, y + 12, delta, fill=colour, size=11, weight="600", anchor="end"))
        out.append(txt(W - 40, y + 12, note, fill=DIM, size=8.5, spacing="1.2", anchor="end"))

    out.append(txt(44, 432, "The tick inside each bar is the pack's midpoint. A narrow bar is a "
                            "balanced pack, a wide one is drift inside it,", fill=DIM, size=9.5))
    out.append(txt(44, 448, "and a bar sitting apart from the others is a pack at a different level "
                            "than the rest.", fill=DIM, size=9.5))
    return frame(h, "CELLS", "".join(out))


# ------------------------------------------------------------------- packs --
def packs() -> str:
    h = 480
    out = []

    for i, (val, unit, cap, colour, bar, foot) in enumerate([
        ("61", "%", "STATE OF CHARGE", FG, None, "as the device reports it"),
        ("61,3", "%", "MEAN OF THE PACKS", FG, None, "from 7 packs"),
        ("26,5", "pp", "SPREAD", WARN, 0.8, None),
        ("10,93", "kWh", "STORED ENERGY", FG, None, "packs add up to 10,98"),
        ("2,56", "kWh", "PER PACK", FG, None, "nominal, per pack"),
        ("224", "", "CYCLES, ALL PACKS", FG, None, "6 of 7 packs report"),
    ]):
        out.append(tile(24 + i * 159, 70, 143, val, unit, cap, colour=colour, bar=bar, foot=foot))

    out.append(panel(24, 172, W - 48, 286, "STATE OF CHARGE PER PACK",
                     "column height = SOC · figure inside = kWh"))

    # red at empty through amber to green at full, same ramp as the panel
    def fill_colour(soc: float) -> str:
        t = min(max(soc, 0), 100) / 100
        hue = 4 + 41 * (t / 0.5) if t < 0.5 else 45 + 95 * ((t - 0.5) / 0.5)
        return f"hsl({hue:.0f} 70% 50%)"

    data = [
        (1, 60.8, "1,56", "3,294 – 3,296 V", False),
        (2, 77.2, "1,98", "3,408 – 3,414 V", True),
        (3, 50.7, "1,30", "3,292 – 3,295 V", True),
        (4, 60.0, "1,54", "3,306 – 3,308 V", False),
        (5, 60.0, "1,54", "3,304 – 3,306 V", False),
        (6, 60.0, "1,54", "3,334 – 3,337 V", False),
        (7, 60.1, "1,54", "3,335 – 3,337 V", False),
    ]
    col_w, gap, top, col_h = 118, 14, 236, 132
    for i, (n, soc, kwh, note, flagged) in enumerate(data):
        x = 44 + i * (col_w + gap)
        out.append(txt(x + col_w / 2, top - 10, f"{soc:.1f}".replace(".", ",") + " %",
                       fill=WARN if flagged else FG, size=15, weight="600", anchor="middle"))
        out.append(rect(x, top, col_w, col_h, fill=INSET, stroke=WARN if flagged else LINE))
        fh = col_h * soc / 100
        out.append(rect(x, top + col_h - fh, col_w, fh, fill=fill_colour(soc)))
        out.append(txt(x + col_w / 2, top + col_h - fh + 17, f"{kwh} kWh",
                       fill="#0a1410", size=11, weight="600", anchor="middle"))
        out.append(txt(x + col_w / 2, top + col_h - fh + 31, f"{soc:.1f}".replace(".", ",") + " %",
                       fill="#0a1410", size=9.5, anchor="middle"))
        # discharge floor
        fy = top + col_h - col_h * 0.12
        out.append(f'<path d="M{x} {fy}H{x + col_w}" stroke="{MAGENTA}" stroke-width="2" stroke-dasharray="4 3"/>')
        out.append(txt(x + col_w / 2, top + col_h + 18, f"PACK {n}",
                       fill=WARN if flagged else FG, size=11, weight="600", anchor="middle"))
        out.append(txt(x + col_w / 2, top + col_h + 32, note, fill=DIM, size=8.5, anchor="middle"))

    out.append(txt(44, 430, "The dashed line marks the discharge floor at 12 %. Fill runs red when "
                            "empty to green when full;", fill=DIM, size=9.5))
    out.append(txt(44, 446, "the outline flags a pack that has drifted away from the group.",
                   fill=DIM, size=9.5))
    return frame(h, "PACKS", "".join(out))


def main() -> None:
    here = pathlib.Path(__file__).resolve().parent
    for name, svg in [("ui-overview.svg", overview()),
                      ("ui-cells.svg", cells()),
                      ("ui-packs.svg", packs())]:
        (here / name).write_text(svg)
        print(f"  {here / name}  {len(svg) // 1024} KB")


if __name__ == "__main__":
    main()
