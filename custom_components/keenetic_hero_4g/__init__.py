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

    # Keep a safe empty/fail-closed coordinator state until the first RCI poll
    # succeeds. Platforms can register entities against this snapshot without
    # manufacturing healthy telemetry.
    coordinator.data = {}
    coordinator.last_update_success = False
    entry.runtime_data = coordinator

    # Register sensor/binary_sensor entities before building panel bootstrap.
    # This lets the initial role resolver see newly introduced integration-owned
    # entities and prevents a stale Template/SNMP fallback map from being baked
    # into the panel configuration during Home Assistant startup.
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Publish the stable application surface before touching the physical router.
    # Device availability controls panel content, never panel existence.
    await async_register_native_panel(hass, entry)

    # Do not use async_config_entry_first_refresh(): a transient RCI failure would
    # raise ConfigEntryNotReady and remove the whole integration (including the
    # panel) from the current startup cycle. async_refresh() records failure and
    # leaves the coordinator scheduled for normal retries.
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
