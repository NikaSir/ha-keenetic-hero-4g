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
from .panel_runtime import async_register_native_panel, async_unregister_native_panel

_LOGGER = logging.getLogger(__name__)


type KeeneticConfigEntry = ConfigEntry[KeeneticCoordinator]


async def async_setup_entry(hass: HomeAssistant, entry: KeeneticConfigEntry) -> bool:
    """Set up Keenetic Hero 4G+ from a config entry.

    The panel lifecycle is independent of router reachability. Entity platforms
    are registered before the panel bootstrap so integration-owned RCI roles are
    available immediately, but no physical-router request is required for the
    panel route itself to exist.
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

    coordinator.data = {}
    coordinator.last_update_success = False
    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Publish the integration-owned route before the first physical-router poll.
    # Frontend delivery is selected from PANEL_VERSION by panel_runtime; canonical
    # registration/bootstrap logic remains in panel.py.
    await async_register_native_panel(hass, entry)

    await coordinator.async_refresh()
    if not coordinator.last_update_success:
        _LOGGER.warning(
            "Initial Keenetic RCI refresh failed; keeping integration and panel loaded with unavailable telemetry"
        )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: KeeneticConfigEntry) -> bool:
    """Unload Keenetic Hero 4G+."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        async_unregister_native_panel(hass, entry)
    return unloaded
