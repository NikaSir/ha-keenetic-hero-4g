from __future__ import annotations

from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import KeeneticRCIClient
from .const import CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL, DEFAULT_TIMEOUT, PLATFORMS
from .coordinator import KeeneticCoordinator
from .panel_v028 import async_register_native_panel, async_unregister_native_panel


type KeeneticConfigEntry = ConfigEntry[KeeneticCoordinator]


async def async_setup_entry(hass: HomeAssistant, entry: KeeneticConfigEntry) -> bool:
    """Set up Keenetic Hero 4G+ from a config entry."""
    session = async_get_clientsession(hass)
    client = KeeneticRCIClient(
        session,
        entry.data[CONF_HOST],
        entry.data[CONF_USERNAME],
        entry.data[CONF_PASSWORD],
        timeout=DEFAULT_TIMEOUT,
    )
    scan_interval = max(
        10, int(entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL))
    )
    coordinator = KeeneticCoordinator(
        hass,
        entry,
        client,
        timedelta(seconds=scan_interval),
    )
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await async_register_native_panel(hass, entry)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: KeeneticConfigEntry) -> bool:
    """Unload Keenetic Hero 4G+."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        async_unregister_native_panel(hass, entry)
    return unloaded
