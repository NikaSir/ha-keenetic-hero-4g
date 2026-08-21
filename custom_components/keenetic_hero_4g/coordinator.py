from __future__ import annotations

import asyncio
import ipaddress
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

_LOGGER = logging.getLogger(__name__)

WAN_ETHERNET = "ethernet"
WAN_LTE = "lte"


def _connected(interface: dict[str, Any]) -> bool | None:
    if not isinstance(interface, dict) or not interface:
        return None
    for key in ("connected", "state", "link"):
        value = interface.get(key)
        if value is None:
            continue
        text = str(value).lower()
        if text in {"yes", "true", "1", "on", "up", "running"}:
            return True
        if text in {"no", "false", "0", "off", "down", "disabled"}:
            return False
    return None


def _route_rows(routes: Any) -> list[dict[str, Any]]:
    if isinstance(routes, dict):
        value = routes.get("route")
        if isinstance(value, list):
            return [row for row in value if isinstance(row, dict)]
    if isinstance(routes, list):
        return [row for row in routes if isinstance(row, dict)]
    return []


def _public_host_route_interface(routes: Any) -> str | None:
    candidates: set[str] = set()
    for route in _route_rows(routes):
        if route.get("rejecting"):
            continue
        interface = route.get("interface")
        if interface not in {ETHERNET_INTERFACE, LTE_INTERFACE}:
            continue
        destination = route.get("destination")
        if not isinstance(destination, str) or not destination.endswith("/32"):
            continue
        try:
            ip = ipaddress.ip_interface(destination).ip
        except ValueError:
            continue
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_multicast
            or ip.is_unspecified
        ):
            continue
        candidates.add(interface)

    if len(candidates) == 1:
        return next(iter(candidates))
    return None


def determine_active_wan(
    routes: Any,
    ethernet: dict[str, Any],
    lte: dict[str, Any],
) -> str | None:
    """Determine the physical active WAN from factual router state."""
    eth_connected = _connected(ethernet)
    lte_connected = _connected(lte)

    if eth_connected is True and lte_connected is False:
        return WAN_ETHERNET
    if lte_connected is True and eth_connected is False:
        return WAN_LTE

    for route in _route_rows(routes):
        if route.get("rejecting") or route.get("destination") != "0.0.0.0/0":
            continue
        interface = route.get("interface")
        if interface == ETHERNET_INTERFACE:
            return WAN_ETHERNET
        if interface == LTE_INTERFACE:
            return WAN_LTE

    physical = _public_host_route_interface(routes)
    if physical == ETHERNET_INTERFACE:
        return WAN_ETHERNET
    if physical == LTE_INTERFACE:
        return WAN_LTE

    return None


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
            "active_wan": None,
            "last_switch": None,
            "last_switch_reason": None,
            "switches_today": 0,
            "lte_seconds_today": 0.0,
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

    def _switch_reason(
        self,
        old_wan: str,
        new_wan: str,
        ethernet: dict[str, Any],
    ) -> str:
        if old_wan == WAN_ETHERNET and new_wan == WAN_LTE:
            if _connected(ethernet) is False:
                return "ethernet_link_down"
            return "route_changed"
        if old_wan == WAN_LTE and new_wan == WAN_ETHERNET:
            if _connected(ethernet) is True:
                return "ethernet_restored"
            return "route_changed"
        return "route_changed"

    def _update_tracking(
        self, active_wan: str | None, ethernet: dict[str, Any]
    ) -> None:
        now = dt_util.now()
        today = now.date().isoformat()
        monotonic_now = time.monotonic()

        if self._tracking.get("date") != today:
            self._tracking["date"] = today
            self._tracking["switches_today"] = 0
            self._tracking["lte_seconds_today"] = 0.0

        previous_wan = self._tracking.get("active_wan")

        if self._last_poll_monotonic is not None and previous_wan == WAN_LTE:
            elapsed = monotonic_now - self._last_poll_monotonic
            base_interval = (
                self.update_interval.total_seconds() if self.update_interval else 30.0
            )
            max_reasonable = max(90.0, base_interval * 2.5)
            if 0 <= elapsed <= max_reasonable:
                self._tracking["lte_seconds_today"] = float(
                    self._tracking.get("lte_seconds_today", 0.0)
                ) + elapsed

        if (
            not self._first_runtime_update
            and active_wan in {WAN_ETHERNET, WAN_LTE}
            and previous_wan in {WAN_ETHERNET, WAN_LTE}
            and active_wan != previous_wan
        ):
            self._tracking["switches_today"] = int(
                self._tracking.get("switches_today", 0)
            ) + 1
            self._tracking["last_switch"] = now.isoformat()
            self._tracking["last_switch_reason"] = self._switch_reason(
                previous_wan, active_wan, ethernet
            )

        if active_wan in {WAN_ETHERNET, WAN_LTE}:
            self._tracking["active_wan"] = active_wan

        self._last_poll_monotonic = monotonic_now
        self._first_runtime_update = False
        self._store.async_delay_save(lambda: dict(self._tracking), 60)

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
            if _connected(interface_data) is False:
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
            system, version, ethernet, lte, routes = await asyncio.gather(
                self.client.async_get_system(),
                self.client.async_get_version(),
                self.client.async_get_interface(ETHERNET_INTERFACE),
                self.client.async_get_interface(LTE_INTERFACE),
                self.client.async_get_routes(),
            )
        except KeeneticError as err:
            raise UpdateFailed(str(err)) from err

        active_wan = determine_active_wan(routes, ethernet, lte)
        self._update_tracking(active_wan, ethernet)
        await self._async_update_diagnostics(ethernet, lte)

        return {
            "system": system,
            "version": version,
            "ethernet": ethernet,
            "lte": lte,
            "routes": routes,
            "active_wan": active_wan,
            "diagnostics": self._diagnostics,
            "failover": {
                "last_switch": self._tracking.get("last_switch"),
                "last_switch_reason": self._tracking.get("last_switch_reason"),
                "switches_today": int(self._tracking.get("switches_today", 0)),
                "lte_seconds_today": float(
                    self._tracking.get("lte_seconds_today", 0.0)
                ),
            },
        }
