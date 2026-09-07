#!/usr/bin/env python3
"""Render the brand icons from the same geometry the sidebar icon uses.

There is no SVG renderer to rely on here and the mark is nothing but five
rectangles on a rounded square, so it is drawn directly. Four-times
supersampling gives the corners and edges their antialiasing.

Run from the repository root:

    python3 assets/make_brand_icons.py

Writes icon.png (256) and icon@2x.png (512) next to the integration, plus the
SVG source that the sidebar icon and these PNGs share.
"""

from __future__ import annotations

import pathlib
import struct
import zlib

# Geometry in the same 24x24 space as the sidebar icon, so the two can never
# drift apart: x, top, width. All bars end on the baseline.
BARS = [
    (1.2, 3.0, 3.2),
    (5.8, 10.5, 3.2),
    (10.4, 15.0, 3.2),
    (15.0, 10.5, 3.2),
    (19.6, 3.0, 3.2),
]
BASELINE = 21.5
BOX = 24.0

# The mark sits in a padded rounded square so it reads on both a light and a
# dark backdrop, which is what Home Assistant and HACS put behind it.
BACKGROUND = (10, 16, 23)
FOREGROUND = (42, 230, 220)
CORNER_RADIUS = 0.22  # share of the edge, matching platform icon conventions
PADDING = 0.16  # share of the edge kept clear around the mark

SUPERSAMPLE = 4


def _rounded_square(x: float, y: float, size: float, radius: float) -> bool:
    """True when (x, y) lies inside a square with rounded corners."""
    cx = min(max(x, radius), size - radius)
    cy = min(max(y, radius), size - radius)
    return (x - cx) ** 2 + (y - cy) ** 2 <= radius**2


def _coverage(px: float, py: float, size: float) -> tuple[bool, bool]:
    """Return whether a point is inside the plate and inside a bar."""
    radius = size * CORNER_RADIUS
    if not _rounded_square(px, py, size, radius):
        return False, False

    pad = size * PADDING
    scale = (size - 2 * pad) / BOX
    ux = (px - pad) / scale
    uy = (py - pad) / scale

    for bx, top, width in BARS:
        if bx <= ux <= bx + width and top <= uy <= BASELINE:
            return True, True
    return True, False


def render(size: int) -> bytes:
    """Render one RGBA PNG at the given edge length."""
    rows: list[bytes] = []
    step = 1.0 / SUPERSAMPLE
    offset = step / 2

    for y in range(size):
        row = bytearray()
        row.append(0)  # PNG filter type: none
        for x in range(size):
            plate = 0
            bar = 0
            for sy in range(SUPERSAMPLE):
                for sx in range(SUPERSAMPLE):
                    inside, on_bar = _coverage(
                        x + offset + sx * step, y + offset + sy * step, float(size)
                    )
                    plate += inside
                    bar += on_bar
            total = SUPERSAMPLE * SUPERSAMPLE
            alpha = plate / total
            if alpha == 0:
                row.extend((0, 0, 0, 0))
                continue
            # Mix the bar colour over the plate by how much of the pixel it covers.
            mix = (bar / total) / alpha if alpha else 0.0
            colour = tuple(
                round(BACKGROUND[i] + (FOREGROUND[i] - BACKGROUND[i]) * mix)
                for i in range(3)
            )
            row.extend((*colour, round(alpha * 255)))
        rows.append(bytes(row))

    raw = b"".join(rows)

    def chunk(tag: bytes, data: bytes) -> bytes:
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body))

    return b"".join(
        [
            b"\x89PNG\r\n\x1a\n",
            chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)),
            chunk(b"IDAT", zlib.compress(raw, 9)),
            chunk(b"IEND", b""),
        ]
    )


def svg() -> str:
    """The same mark as SVG, so the source of truth stays readable."""
    paths = "\n    ".join(
        f'<rect x="{bx}" y="{top}" width="{w}" height="{round(BASELINE - top, 2)}"/>'
        for bx, top, w in BARS
    )
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" '
        'width="24" height="24">\n'
        "  <!-- Five bars, high-low-lowest-low-high: cell voltages read as a\n"
        "       chart, an M read as a silhouette. -->\n"
        '  <g fill="currentColor">\n    '
        f"{paths}\n  </g>\n</svg>\n"
    )


def main() -> None:
    root = pathlib.Path(__file__).resolve().parent.parent
    brand = root / "custom_components" / "marstek_modbus" / "brand"
    brand.mkdir(parents=True, exist_ok=True)

    (root / "assets" / "icon.svg").write_text(svg())
    for name, size in (("icon.png", 256), ("icon@2x.png", 512)):
        (brand / name).write_bytes(render(size))
        print(f"  {brand / name}  {size}x{size}")
    print(f"  {root / 'assets' / 'icon.svg'}")


if __name__ == "__main__":
    main()
