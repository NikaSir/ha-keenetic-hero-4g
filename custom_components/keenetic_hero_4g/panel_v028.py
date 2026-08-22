from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import panel as _panel

_PANEL_COMPONENT_V028 = "keenetic-hero-app-panel-v028"
_PANEL_MODULE_V028 = f"/{_panel.DOMAIN}_static/keenetic-app-v028.js"


async def async_register_native_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the v0.2.8 app shell with resilient bootstrap."""
    _panel.PANEL_COMPONENT = _PANEL_COMPONENT_V028
    _panel.PANEL_MODULE = _PANEL_MODULE_V028
    await _panel.async_register_native_panel(hass, entry)


def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Unregister the integration-owned Keenetic panel."""
    _panel.async_unregister_native_panel(hass, entry)
