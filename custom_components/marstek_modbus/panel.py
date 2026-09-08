"""Registers the Marstek Modbus sidebar panel and serves its frontend bundle."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN
from .panel_settings import (
    DATA_COMMANDS_REGISTERED,
    DATA_STORE,
    async_register_settings_api,
)

_LOGGER = logging.getLogger(__name__)

PANEL_URL_PATH = "marstek-modbus"
STATIC_URL = f"/{DOMAIN}-frontend"

# Names are prefixed with the domain on purpose. A custom element name is
# global to the page, and another integration serving its own file called
# marstek-panel.js would collide with this one - the second definition throws
# and that panel stays blank.
COMPONENT_NAME = "marstek-modbus-panel"
BUNDLE_NAME = "marstek-modbus-panel.js"

# The icon set has to be on the page before anyone opens the panel, because the
# sidebar draws its entry first. So it is its own small bundle, added to every
# page, while the panel bundle stays lazy.
ICONS_BUNDLE_NAME = "marstek-modbus-icons.js"
ICONSET_PREFIX = "marstek"

PANEL_TITLE = "Marstek Modbus"
PANEL_ICON = f"{ICONSET_PREFIX}:logo"
# Used when the icon bundle is missing, so the entry still has a picture.
PANEL_ICON_FALLBACK = "mdi:home-battery"

DATA_PANEL_REGISTERED = "panel_registered"
DATA_STATIC_REGISTERED = "static_registered"
DATA_ICONS_REGISTERED = "icons_registered"

# Keys this module owns inside hass.data[DOMAIN]; everything else there is a
# coordinator stored under its config entry id.
_OWN_DATA_KEYS = frozenset(
    {
        DATA_PANEL_REGISTERED,
        DATA_STATIC_REGISTERED,
        DATA_ICONS_REGISTERED,
        DATA_STORE,
        DATA_COMMANDS_REGISTERED,
    }
)


async def _version(hass: HomeAssistant) -> str:
    """Return the integration version, used to bust the browser cache.

    Read through the loader rather than the manifest file directly: the file
    is already cached and reading it here would block the event loop.
    """
    integration = await async_get_integration(hass, DOMAIN)
    return str(integration.version or "dev")


async def async_register_panel(hass: HomeAssistant) -> None:
    """Serve the bundle and add Marstek Modbus to the sidebar.

    Safe to call once per config entry: a second battery must not add a second
    sidebar item, so both registrations are guarded by flags that survive a
    reload.
    """
    data = hass.data.setdefault(DOMAIN, {})

    # The panel's settings API, before the bundle check: the commands are what
    # the panel reads its colours and tabs from, and registering them costs
    # nothing when there is no bundle to serve.
    async_register_settings_api(hass)

    frontend_dir = Path(__file__).parent / "frontend"

    if not frontend_dir.is_dir():
        # A source checkout without a build. The integration itself still works,
        # only the panel is missing, so this must not fail the setup.
        _LOGGER.warning(
            "Frontend bundle not found at %s, the panel will not be available",
            frontend_dir,
        )
        return

    if not data.get(DATA_STATIC_REGISTERED):
        # Static paths cannot be registered twice, so this survives a reload.
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(frontend_dir), cache_headers=False)]
        )
        data[DATA_STATIC_REGISTERED] = True

    version = await _version(hass)

    # The icon set goes on every page; without it the sidebar would ask for an
    # icon nobody registered and draw nothing at all.
    icon = PANEL_ICON_FALLBACK
    if (frontend_dir / ICONS_BUNDLE_NAME).is_file():
        if not data.get(DATA_ICONS_REGISTERED):
            frontend.add_extra_js_url(
                hass, f"{STATIC_URL}/{ICONS_BUNDLE_NAME}?v={version}"
            )
            data[DATA_ICONS_REGISTERED] = True
        icon = PANEL_ICON

    if data.get(DATA_PANEL_REGISTERED):
        return

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=COMPONENT_NAME,
        module_url=f"{STATIC_URL}/{BUNDLE_NAME}?v={version}",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=icon,
        require_admin=False,
    )
    data[DATA_PANEL_REGISTERED] = True
    _LOGGER.info("Panel registered at /%s", PANEL_URL_PATH)


def async_remove_panel_if_unused(hass: HomeAssistant) -> None:
    """Take the panel out of the sidebar once the last battery is removed.

    Deliberately *not* called when a config entry is merely unloaded: Home
    Assistant unloads and reloads an entry for every options change and every
    reload, and tearing the sidebar item down each time makes it depend on the
    setup that follows succeeding. It only goes away when the entry is actually
    deleted.
    """
    data = hass.data.get(DOMAIN, {})
    if not data.get(DATA_PANEL_REGISTERED):
        return
    # Everything here that is not one of our own flags is a coordinator stored
    # under its entry id, so a leftover key means a battery is still set up.
    if any(key not in _OWN_DATA_KEYS for key in data):
        return

    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    data[DATA_PANEL_REGISTERED] = False
    _LOGGER.info("Panel removed, no battery left")
