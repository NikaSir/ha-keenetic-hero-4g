from __future__ import annotations

import ipaddress
from datetime import datetime
from typing import Any

WAN_ETHERNET = "ethernet"
WAN_LTE = "lte"

_TRUE_STATES = {"yes", "true", "1", "on", "up", "running", "connected", "ready"}
_FALSE_STATES = {
    "no",
    "false",
    "0",
    "off",
    "down",
    "disabled",
    "disconnected",
    "not-connected",
}


def connected(interface: dict[str, Any]) -> bool | None:
    """Return factual interface link state when the router exposes it."""
    if not isinstance(interface, dict) or not interface:
        return None

    for key in ("connected", "state", "connection-state", "link"):
        value = interface.get(key)
        if value is None:
            continue
        text = str(value).strip().lower()
        if text in _TRUE_STATES:
            return True
        if text in _FALSE_STATES:
            return False
    return None


def route_rows(routes: Any) -> list[dict[str, Any]]:
    """Normalize Keenetic route payloads to route dictionaries."""
    if isinstance(routes, dict):
        value = routes.get("route")
        if isinstance(value, list):
            return [row for row in value if isinstance(row, dict)]
    if isinstance(routes, list):
        return [row for row in routes if isinstance(row, dict)]
    return []


def public_host_route_interface(
    routes: Any,
    *,
    ethernet_interface: str,
    lte_interface: str,
    excluded_interfaces: set[str] | None = None,
) -> str | None:
    """Return a unique physical WAN interface seen on public /32 routes."""
    candidates: set[str] = set()
    excluded_interfaces = excluded_interfaces or set()
    for route in route_rows(routes):
        if route.get("rejecting"):
            continue
        interface = route.get("interface")
        if (
            interface not in {ethernet_interface, lte_interface}
            or interface in excluded_interfaces
        ):
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
    *,
    ethernet_interface: str,
    lte_interface: str,
) -> str | None:
    """Determine the physical active WAN from factual router state.

    Unknown or incomplete telemetry stays unknown. The helper never treats an
    unavailable interface or ambiguous route table as a healthy WAN path.
    """
    ethernet_connected = connected(ethernet)
    lte_connected = connected(lte)

    for route in route_rows(routes):
        if route.get("rejecting") or route.get("destination") != "0.0.0.0/0":
            continue
        interface = route.get("interface")
        if interface == ethernet_interface and ethernet_connected is not False:
            return WAN_ETHERNET
        if interface == lte_interface and lte_connected is not False:
            return WAN_LTE

    excluded_interfaces = set()
    if ethernet_connected is False:
        excluded_interfaces.add(ethernet_interface)
    if lte_connected is False:
        excluded_interfaces.add(lte_interface)

    physical = public_host_route_interface(
        routes,
        ethernet_interface=ethernet_interface,
        lte_interface=lte_interface,
        excluded_interfaces=excluded_interfaces,
    )
    if physical == ethernet_interface and ethernet_connected is not False:
        return WAN_ETHERNET
    if physical == lte_interface and lte_connected is not False:
        return WAN_LTE

    return None


def switch_reason(
    old_wan: str,
    new_wan: str,
    ethernet: dict[str, Any],
) -> str:
    """Return the conservative factual reason for a detected WAN transition."""
    if old_wan == WAN_ETHERNET and new_wan == WAN_LTE:
        if connected(ethernet) is False:
            return "ethernet_link_down"
        return "route_changed"
    if old_wan == WAN_LTE and new_wan == WAN_ETHERNET:
        if connected(ethernet) is True:
            return "ethernet_restored"
        return "route_changed"
    return "route_changed"


def update_failover_tracking(
    tracking: dict[str, Any],
    active_wan: str | None,
    ethernet: dict[str, Any],
    now: datetime,
    elapsed_seconds: float | None,
    *,
    first_runtime_update: bool,
) -> dict[str, Any]:
    """Update factual WAN history without attributing unknown intervals."""
    valid_wans = {WAN_ETHERNET, WAN_LTE}
    today = now.date().isoformat()
    day_changed = tracking.get("date") != today

    last_known_wan = tracking.get("last_known_wan")
    if last_known_wan not in valid_wans:
        legacy_active_wan = tracking.get("active_wan")
        last_known_wan = legacy_active_wan if legacy_active_wan in valid_wans else None
    tracking.pop("active_wan", None)

    previous_interval_wan = tracking.get("interval_wan")
    if previous_interval_wan not in valid_wans:
        previous_interval_wan = None

    if day_changed:
        tracking["date"] = today
        tracking["switches_today"] = 0
        tracking["lte_seconds_today"] = 0.0
        tracking["unknown_seconds_today"] = 0.0

    if elapsed_seconds is not None and elapsed_seconds >= 0:
        attributable_seconds = elapsed_seconds
        if day_changed:
            start_of_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
            attributable_seconds = min(
                attributable_seconds,
                max(0.0, (now - start_of_today).total_seconds()),
            )

        if previous_interval_wan == WAN_LTE:
            tracking["lte_seconds_today"] = float(
                tracking.get("lte_seconds_today", 0.0)
            ) + attributable_seconds
        elif previous_interval_wan is None:
            tracking["unknown_seconds_today"] = float(
                tracking.get("unknown_seconds_today", 0.0)
            ) + attributable_seconds

    if (
        not first_runtime_update
        and active_wan in valid_wans
        and last_known_wan in valid_wans
        and active_wan != last_known_wan
    ):
        tracking["switches_today"] = int(tracking.get("switches_today", 0)) + 1
        tracking["last_switch"] = now.isoformat()
        tracking["last_switch_reason"] = switch_reason(
            last_known_wan, active_wan, ethernet
        )

    if active_wan in valid_wans:
        tracking["last_known_wan"] = active_wan
    else:
        tracking["last_known_wan"] = last_known_wan
    tracking["interval_wan"] = active_wan if active_wan in valid_wans else None

    return tracking
