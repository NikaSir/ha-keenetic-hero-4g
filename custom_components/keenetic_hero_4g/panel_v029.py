from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import panel as _panel
from .const import PANEL_VERSION

_PANEL_COMPONENT_V029 = "keenetic-hero-app-panel-v029"
_PANEL_MODULE_V029 = (
    f"/{_panel.DOMAIN}_static/keenetic-panel.bundle.js?v={PANEL_VERSION}"
)


async def async_register_native_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the self-contained v0.2.9 production frontend bundle."""
    _panel.PANEL_COMPONENT = _PANEL_COMPONENT_V029
    _panel.PANEL_MODULE = _PANEL_MODULE_V029
    await _panel.async_register_native_panel(hass, entry)


def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Unregister the integration-owned Keenetic panel."""
    _panel.async_unregister_native_panel(hass, entry)
