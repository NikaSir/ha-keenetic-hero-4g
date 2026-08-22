from __future__ import annotations

import ipaddress
from typing import Any

WAN_ETHERNET = "ethernet"
WAN_LTE = "lte"


def connected(interface: dict[str, Any]) -> bool | None:
    """Return factual interface link state when the router exposes it."""
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
) -> str | None:
    """Return a unique physical WAN interface seen on public /32 routes."""
    candidates: set[str] = set()
    for route in route_rows(routes):
        if route.get("rejecting"):
            continue
        interface = route.get("interface")
        if interface not in {ethernet_interface, lte_interface}:
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

    if ethernet_connected is True and lte_connected is False:
        return WAN_ETHERNET
    if lte_connected is True and ethernet_connected is False:
        return WAN_LTE

    for route in route_rows(routes):
        if route.get("rejecting") or route.get("destination") != "0.0.0.0/0":
            continue
        interface = route.get("interface")
        if interface == ethernet_interface:
            return WAN_ETHERNET
        if interface == lte_interface:
            return WAN_LTE

    physical = public_host_route_interface(
        routes,
        ethernet_interface=ethernet_interface,
        lte_interface=lte_interface,
    )
    if physical == ethernet_interface:
        return WAN_ETHERNET
    if physical == lte_interface:
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
