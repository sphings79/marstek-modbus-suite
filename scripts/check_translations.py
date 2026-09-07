#!/usr/bin/env python3
"""Confirm every entity a register map defines has a name in every catalogue.

A definition whose translation key is missing from translations/<lang>.json
produces no error and no log line. Home Assistant simply finds no name, falls
back to the device name alone, and the entity registers as sensor.<device> -
which is how three pack 1 sensors shipped nameless in 2.0.0-beta.7.

Run from anywhere:

    python3 scripts/check_translations.py

Exits non-zero and lists every gap, so it can stand in a workflow.
"""

from __future__ import annotations

import json
import sys
from collections import defaultdict
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
COMPONENT = ROOT / "custom_components" / "marstek_modbus"

# Sections whose entities are named by _attr_name rather than a translation
# key. MarstekDevSensor clears translation_key on purpose; see sensor.py.
UNTRANSLATED_SECTIONS = {
    "DEV_UNKNOWN_SENSOR_DEFINITIONS",
    "DEV_DUPLICATE_SENSOR_DEFINITIONS",
}

# Longest suffix wins, so BINARY_SENSOR is not read as a kind of SENSOR.
PLATFORM_SUFFIXES = (
    ("BINARY_SENSOR_DEFINITIONS", "binary_sensor"),
    ("SENSOR_DEFINITIONS", "sensor"),
    ("NUMBER_DEFINITIONS", "number"),
    ("SELECT_DEFINITIONS", "select"),
    ("SWITCH_DEFINITIONS", "switch"),
    ("BUTTON_DEFINITIONS", "button"),
    ("TEXT_DEFINITIONS", "text"),
)


def platform_of(section: str) -> str | None:
    if section in UNTRANSLATED_SECTIONS:
        return None
    for suffix, platform in PLATFORM_SUFFIXES:
        if section == suffix or section.endswith("_" + suffix):
            return platform
    return None


def definitions(path: Path):
    """Yield (platform, key) for every entity a register map defines.

    Sections come in two shapes: a mapping whose own keys name the entities,
    and a list of dicts each carrying its own `key`. Both are in use.
    """
    data = yaml.safe_load(path.read_text()) or {}
    for section, body in data.items():
        platform = platform_of(section)
        if platform is None:
            continue
        if isinstance(body, dict):
            pairs = body.items()
        elif isinstance(body, list):
            pairs = ((None, item) for item in body)
        else:
            continue
        for name, item in pairs:
            if not isinstance(item, dict):
                continue
            key = item.get("key") or name
            if key:
                yield platform, key


def main() -> int:
    catalogues = {}
    for path in sorted((COMPONENT / "translations").glob("*.json")):
        catalogues[path.stem] = json.loads(path.read_text())
    if not catalogues:
        print("no translation catalogues found", file=sys.stderr)
        return 1

    maps = sorted((COMPONENT / "registers").glob("*.yaml"))
    if not maps:
        print("no register maps found", file=sys.stderr)
        return 1

    missing: dict[tuple[str, str], set[str]] = defaultdict(set)
    checked = 0
    for path in maps:
        for platform, key in definitions(path):
            checked += 1
            for lang, catalogue in catalogues.items():
                entry = catalogue.get("entity", {}).get(platform, {}).get(key, {})
                if "name" not in entry:
                    missing[(platform, key)].add(lang)

    languages = ", ".join(sorted(catalogues))
    if missing:
        print(f"{len(missing)} entities have no name in every catalogue:\n")
        for (platform, key), langs in sorted(missing.items()):
            print(f"  {platform:14s} {key:36s} missing in {', '.join(sorted(langs))}")
        print(
            f"\nAdd them under entity.<platform>.<key>.name in "
            f"custom_components/marstek_modbus/translations/."
        )
        return 1

    print(f"{checked} definitions, all named in {languages}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
