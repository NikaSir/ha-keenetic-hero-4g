from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import panel as _panel

_PANEL_COMPONENT_V025 = "keenetic-hero-app-panel-v025"
_PANEL_MODULE_V025 = f"/{_panel.DOMAIN}_static/keenetic-app-v025.js"


async def async_register_native_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the v0.2.5 app shell with a versioned frontend module."""
    _panel.PANEL_COMPONENT = _PANEL_COMPONENT_V025
    _panel.PANEL_MODULE = _PANEL_MODULE_V025
    await _panel.async_register_native_panel(hass, entry)


def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Unregister the integration-owned Keenetic panel."""
    _panel.async_unregister_native_panel(hass, entry)
