from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import panel as _panel

FRONTEND_UI_VERSION = "1.0.6"
FRONTEND_CACHE_KEY = "1.0.6"
FRONTEND_COMPONENT_SLUG = "v100"


def _frontend_slug() -> str:
    return FRONTEND_COMPONENT_SLUG


def _select_frontend() -> None:
    """Select the current autonomous UI 1.0.6 production component."""
    slug = _frontend_slug()
    _panel.PANEL_COMPONENT = f"keenetic-hero-app-panel-{slug}"
    _panel.PANEL_MODULE = (
        f"{_panel.PANEL_STATIC_URL}/keenetic-panel-bundle.js?v={FRONTEND_CACHE_KEY}"
    )


async def async_register_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    _select_frontend()
    await _panel.async_register_native_panel(hass, entry)


def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    _panel.async_unregister_native_panel(hass, entry)
