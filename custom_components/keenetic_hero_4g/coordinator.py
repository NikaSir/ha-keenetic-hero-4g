from __future__ import annotations

import asyncio
import logging
from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import KeeneticError, KeeneticRCIClient
from .const import ETHERNET_INTERFACE, LTE_INTERFACE

_LOGGER = logging.getLogger(__name__)


class KeeneticCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Poll verified read-only RCI endpoints."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, client: KeeneticRCIClient, update_interval: timedelta) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name="Keenetic Hero 4G+",
            update_interval=update_interval,
            config_entry=entry,
        )
        self.entry = entry
        self.client = client

    async def _async_update_data(self) -> dict[str, Any]:
        try:
            system, version, ethernet, lte, routes = await asyncio.gather(
                self.client.async_get_system(),
                self.client.async_get_version(),
                self.client.async_get_interface(ETHERNET_INTERFACE),
                self.client.async_get_interface(LTE_INTERFACE),
                self.client.async_get_routes(),
            )
        except KeeneticError as err:
            raise UpdateFailed(str(err)) from err

        return {
            "system": system,
            "version": version,
            "ethernet": ethernet,
            "lte": lte,
            "routes": routes,
        }
