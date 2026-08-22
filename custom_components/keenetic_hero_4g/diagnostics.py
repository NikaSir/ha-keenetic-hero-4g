from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import HomeAssistant

from .coordinator import KeeneticCoordinator

ENTRY_REDACT = {CONF_USERNAME, CONF_PASSWORD}
TELEMETRY_REDACT = {
    "imei",
    "imsi",
    "iccid",
    "phone-number",
    "mac",
    "serial",
    "bssid",
    "tac",
    "plmn",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return privacy-safe diagnostics for a Keenetic config entry."""
    coordinator: KeeneticCoordinator = entry.runtime_data

    return {
        "entry": async_redact_data(dict(entry.data), ENTRY_REDACT),
        "options": dict(entry.options),
        "telemetry": async_redact_data(coordinator.data, TELEMETRY_REDACT),
    }
