from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from . import panel as _panel
from .const import PANEL_VERSION


def _frontend_slug() -> str:
    return "v" + PANEL_VERSION.replace(".", "")


def _select_frontend() -> None:
    """Select the current component from one self-contained production bundle."""
    slug = _frontend_slug()
    _panel.PANEL_COMPONENT = f"keenetic-hero-app-panel-{slug}"
    _panel.PANEL_MODULE = (
        f"{_panel.PANEL_STATIC_URL}/keenetic-panel-bundle.js?v={PANEL_VERSION}"
    )


async def async_register_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Register the current Keenetic app shell from the autonomous bundle."""
    _select_frontend()
    await _panel.async_register_native_panel(hass, entry)


def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Delegate panel removal to the canonical registration module."""
    _panel.async_unregister_native_panel(hass, entry)
