from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import panel as _panel

_PANEL_COMPONENT_V023 = "keenetic-hero-app-panel-v023"
_PANEL_MODULE_V023 = f"/{_panel.DOMAIN}_static/keenetic-app-v023.js"


async def async_register_native_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the v0.2.3 app shell with a versioned frontend module."""
    # Home Assistant frontend module URLs are cached aggressively in the mobile
    # app. Keep a versioned module/component name for panel release candidates so
    # a HACS update cannot silently keep an older shell in the running webview.
    _panel.PANEL_COMPONENT = _PANEL_COMPONENT_V023
    _panel.PANEL_MODULE = _PANEL_MODULE_V023
    await _panel.async_register_native_panel(hass, entry)


def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Unregister the integration-owned Keenetic panel."""
    _panel.async_unregister_native_panel(hass, entry)
