from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import panel as _panel

_PANEL_COMPONENT_V024 = "keenetic-hero-app-panel-v024"
_PANEL_MODULE_V024 = f"/{_panel.DOMAIN}_static/keenetic-app-v024.js"


async def async_register_native_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the v0.2.4 app shell with a versioned frontend module."""
    _panel.PANEL_COMPONENT = _PANEL_COMPONENT_V024
    _panel.PANEL_MODULE = _PANEL_MODULE_V024
    await _panel.async_register_native_panel(hass, entry)


def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Unregister the integration-owned Keenetic panel."""
    _panel.async_unregister_native_panel(hass, entry)
