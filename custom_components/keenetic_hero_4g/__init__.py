from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import KeeneticRCIClient
from .const import CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL, DEFAULT_TIMEOUT, PLATFORMS
from .coordinator import KeeneticCoordinator
from .panel_v030 import async_register_native_panel, async_unregister_native_panel

_LOGGER = logging.getLogger(__name__)


type KeeneticConfigEntry = ConfigEntry[KeeneticCoordinator]


async def async_setup_entry(hass: HomeAssistant, entry: KeeneticConfigEntry) -> bool:
    """Set up Keenetic Hero 4G+ from a config entry.

    The integration-owned panel is infrastructure and must not disappear just
    because the router is temporarily unavailable during Home Assistant startup.
    Register the panel before the first RCI poll and make that poll non-fatal.
    """
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

    # Make runtime_data and the stable panel route available independently of
    # router reachability. The panel can then render an honest unavailable state
    # while the coordinator keeps retrying on its normal update cadence.
    entry.runtime_data = coordinator
    await async_register_native_panel(hass, entry)

    # Do not use async_config_entry_first_refresh() here: it raises
    # ConfigEntryNotReady on a transient startup failure and prevents the panel
    # from being available. async_refresh() records last_update_success=False
    # without making the entire Config Entry disappear.
    await coordinator.async_refresh()
    if not coordinator.last_update_success:
        _LOGGER.warning(
            "Initial Keenetic RCI refresh failed; keeping integration and panel loaded with unavailable telemetry"
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: KeeneticConfigEntry) -> bool:
    """Unload Keenetic Hero 4G+."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        async_unregister_native_panel(hass, entry)
    return unloaded
