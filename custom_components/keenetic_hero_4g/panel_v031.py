from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import panel as _panel
from .const import PANEL_VERSION

_PANEL_COMPONENT_V031 = "keenetic-hero-app-panel-v031"
_PANEL_BUNDLE = "keenetic-panel-bundle.js"
# Use a version-specific static URL, not only a query string. Home Assistant/iOS
# can keep an already-loaded module for the old bundle path across an integration
# update; a distinct path guarantees that the v0.3.1 component is evaluated.
_PANEL_STATIC_URL_V031 = f"/{_panel.DOMAIN}_static_v031"
_PANEL_MODULE_V031 = f"{_PANEL_STATIC_URL_V031}/{_PANEL_BUNDLE}?v={PANEL_VERSION}"
_DATA_STATIC_V031_REGISTERED = "native_panel_static_v031_registered"


async def async_register_native_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the v0.3.1 shell with cache-safe and self-healing delivery."""
    domain_data = hass.data.setdefault(_panel.DOMAIN, {})

    if not domain_data.get(_DATA_STATIC_V031_REGISTERED):
        frontend_dir = Path(__file__).parent / "frontend"
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    _PANEL_STATIC_URL_V031,
                    str(frontend_dir),
                    cache_headers=False,
                )
            ]
        )
        domain_data[_DATA_STATIC_V031_REGISTERED] = True

    # A stale in-memory registration flag must not permanently hide the panel.
    # This can happen during an integration/frontend reload when the panel route
    # has already disappeared but hass.data still says it is registered.
    if domain_data.get(_panel._DATA_PANEL_REGISTERED) and not frontend.async_panel_exists(
        hass, _panel.PANEL_URL_PATH
    ):
        domain_data[_panel._DATA_PANEL_REGISTERED] = False

    _panel.PANEL_COMPONENT = _PANEL_COMPONENT_V031
    _panel.PANEL_MODULE = _PANEL_MODULE_V031
    await _panel.async_register_native_panel(hass, entry)


def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Unregister the integration-owned Keenetic panel."""
    _panel.async_unregister_native_panel(hass, entry)
