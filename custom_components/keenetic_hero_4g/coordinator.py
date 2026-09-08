from __future__ import annotations

import asyncio
import logging
import time
from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import KeeneticError, KeeneticRCIClient
from .const import DIAGNOSTIC_INTERVAL, DOMAIN, ETHERNET_INTERFACE, LTE_INTERFACE, PING_HOST
from .traffic import rci_error_message
from .traffic_accounting import update_accounting
from .wan import (
    WAN_ETHERNET,
    WAN_LTE,
    connected,
    determine_active_wan,
    update_failover_tracking,
)

_LOGGER = logging.getLogger(__name__)


class KeeneticCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Poll verified read-only RCI endpoints and keep factual failover state."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        client: KeeneticRCIClient,
        update_interval: timedelta,
    ) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name="Keenetic Hero 4G+",
            update_interval=update_interval,
            config_entry=entry,
        )
        self.entry = entry
        self.client = client
        self._diagnostics: dict[str, dict[str, float | None]] = {
            WAN_ETHERNET: {"ping_ms": None, "packet_loss": None},
            WAN_LTE: {"ping_ms": None, "packet_loss": None},
        }
        # Run the first diagnostic cycle immediately after startup.
        self._last_diagnostics = 0.0
        self._store: Store[dict[str, Any]] = Store(
            hass, 1, f"{DOMAIN}.{entry.entry_id}.failover"
        )
        self._state_loaded = False
        self._tracking: dict[str, Any] = {
            "date": None,
            "last_known_wan": None,
            "interval_wan": None,
            "last_switch": None,
            "last_switch_reason": None,
            "switches_today": 0,
            "lte_seconds_today": 0.0,
            "unknown_seconds_today": 0.0,
            "traffic": None,
        }
        self._last_poll_monotonic: float | None = None
        self._first_runtime_update = True

    async def _async_load_tracking(self) -> None:
        if self._state_loaded:
            return
        saved = await self._store.async_load()
        if isinstance(saved, dict):
            self._tracking.update(saved)
        self._state_loaded = True

    def _update_tracking(
        self,
        active_wan: str | None,
        ethernet: dict[str, Any],
        ethernet_stats: dict[str, Any],
        lte_stats: dict[str, Any],
    ) -> None:
        now = dt_util.now()
        monotonic_now = time.monotonic()
        elapsed: float | None = None
        if self._last_poll_monotonic is not None:
            elapsed = monotonic_now - self._last_poll_monotonic
            base_interval = (
                self.update_interval.total_seconds() if self.update_interval else 30.0
            )
            max_reasonable = max(90.0, base_interval * 2.5)
            if elapsed < 0 or elapsed > max_reasonable:
                elapsed = None

        self._tracking = update_failover_tracking(
            self._tracking,
            active_wan,
            ethernet,
            now,
            elapsed,
            first_runtime_update=self._first_runtime_update,
        )

        # Keep long-period traffic independent from raw interface-counter
        # baselines. The accounting engine persists deltas and survives a raw
        # counter reset without fabricating pre-reset traffic.
        self._tracking["traffic"] = update_accounting(
            self._tracking.get("traffic"),
            now,
            ethernet_stats,
            lte_stats,
        )

        self._last_poll_monotonic = monotonic_now
        self._first_runtime_update = False
        self._store.async_delay_save(lambda: dict(self._tracking), 60)

    async def _async_optional_interface_stats(
        self, channel: str, interface: str
    ) -> dict[str, Any]:
        """Read interface traffic stats without making base telemetry fail."""
        try:
            data = await self.client.async_get_json(
                f"/rci/show/interface/stat?name={interface}"
            )
        except KeeneticError as err:
            _LOGGER.debug("Keenetic %s interface stats unavailable: %s", channel, err)
            return {}

        error = rci_error_message(data)
        if error is not None:
            _LOGGER.debug("Keenetic %s interface stats rejected: %s", channel, error)
            return {}
        return data if isinstance(data, dict) else {}

    async def _async_update_diagnostics(
        self,
        ethernet: dict[str, Any],
        lte: dict[str, Any],
    ) -> None:
        now = time.monotonic()
        if now - self._last_diagnostics < DIAGNOSTIC_INTERVAL.total_seconds():
            return

        self._last_diagnostics = now
        interfaces = (
            (WAN_ETHERNET, ETHERNET_INTERFACE, ethernet),
            (WAN_LTE, LTE_INTERFACE, lte),
        )
        for name, interface, interface_data in interfaces:
            # An explicitly down interface is not a failed ping test; it has no
            # current path to measure. Do not let it block the other channel.
            if connected(interface_data) is False:
                self._diagnostics[name] = {
                    "ping_ms": None,
                    "packet_loss": None,
                }
                continue

            try:
                self._diagnostics[name] = await self.client.async_ping(
                    PING_HOST, interface, count=3
                )
            except KeeneticError as err:
                _LOGGER.warning(
                    "Keenetic %s diagnostic ping unavailable: %s",
                    name,
                    err,
                )
                self._diagnostics[name] = {
                    "ping_ms": None,
                    "packet_loss": None,
                }

    async def _async_update_data(self) -> dict[str, Any]:
        await self._async_load_tracking()

        try:
            (
                system,
                version,
                ethernet,
                lte,
                routes,
                ethernet_stats,
                lte_stats,
            ) = await asyncio.gather(
                self.client.async_get_system(),
                self.client.async_get_version(),
                self.client.async_get_interface(ETHERNET_INTERFACE),
                self.client.async_get_interface(LTE_INTERFACE),
                self.client.async_get_routes(),
                self._async_optional_interface_stats(WAN_ETHERNET, ETHERNET_INTERFACE),
                self._async_optional_interface_stats(WAN_LTE, LTE_INTERFACE),
            )
        except KeeneticError as err:
            raise UpdateFailed(str(err)) from err

        active_wan = determine_active_wan(
            routes,
            ethernet,
            lte,
            ethernet_interface=ETHERNET_INTERFACE,
            lte_interface=LTE_INTERFACE,
        )
        self._update_tracking(
            active_wan,
            ethernet,
            ethernet_stats,
            lte_stats,
        )
        await self._async_update_diagnostics(ethernet, lte)

        return {
            "system": system,
            "version": version,
            "ethernet": ethernet,
            "lte": lte,
            "ethernet_stats": ethernet_stats,
            "lte_stats": lte_stats,
            "routes": routes,
            "active_wan": active_wan,
            "diagnostics": self._diagnostics,
            "traffic_accounting": self._tracking.get("traffic") or {},
            "failover": {
                "last_known_wan": self._tracking.get("last_known_wan"),
                "last_switch": self._tracking.get("last_switch"),
                "last_switch_reason": self._tracking.get("last_switch_reason"),
                "switches_today": int(self._tracking.get("switches_today", 0)),
                "lte_seconds_today": float(
                    self._tracking.get("lte_seconds_today", 0.0)
                ),
                "unknown_seconds_today": float(
                    self._tracking.get("unknown_seconds_today", 0.0)
                ),
            },
        }
