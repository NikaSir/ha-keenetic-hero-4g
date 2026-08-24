from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .const import (
    DOMAIN,
    PANEL_ICON,
    PANEL_OWNER,
    PANEL_PARENT_ROUTE,
    PANEL_PREFERRED_VIEW,
    PANEL_TITLE,
    PANEL_URL_PATH,
    PANEL_VERSION,
)
from .coordinator import KeeneticCoordinator

_LOGGER = logging.getLogger(__name__)

PANEL_STATIC_URL = f"/{DOMAIN}_static"
# Use a versioned physical module path and web-component name. iOS/Home Assistant
# may retain an older ES module even when only the query string changes, so each
# UI contract revision gets a hard cache-bust path.
PANEL_COMPONENT = "keenetic-hero-app-panel-v040"
PANEL_MODULE = f"{PANEL_STATIC_URL}/keenetic-app-v040.js?v={PANEL_VERSION}"

_DATA_PANEL_REGISTERED = "native_panel_registered"
_DATA_STATIC_REGISTERED = "native_panel_static_registered"
_DATA_WS_REGISTERED = "native_panel_ws_registered"
_DATA_PANEL_ENTRY_ID = "native_panel_entry_id"

# Entity keys owned by ha-keenetic-hero-4g. The panel resolves these by unique_id,
# so user-renamed entity_id values remain supported. Some keys are forward-looking:
# when legacy SNMP/template metrics move into this integration, the panel will pick
# the new integration-owned entity automatically without changing its UI contract.
INTEGRATION_ENTITY_KEYS: tuple[str, ...] = (
    "active_rx_mbps",
    "active_tx_mbps",
    "active_wan",
    "cpu_load",
    "ethernet_connected",
    "ethernet_interface_uptime",
    "ethernet_link_speed",
    "ethernet_packet_loss",
    "ethernet_ping",
    "ethernet_rx_mbps",
    "ethernet_rx_total",
    "ethernet_rx_total_gib",
    "ethernet_total_daily",
    "ethernet_total_monthly",
    "ethernet_tx_mbps",
    "ethernet_tx_total",
    "ethernet_tx_total_gib",
    "ethernet_wan_ipv4",
    "firmware_version",
    "internet_connectivity",
    "last_wan_switch",
    "last_wan_switch_reason",
    "lte_bandwidth",
    "lte_carriers",
    "lte_connected",
    "lte_earfcn",
    "lte_enb_id",
    "lte_interface_uptime",
    "lte_modem_firmware",
    "lte_modem_model",
    "lte_modem_temperature",
    "lte_network_type",
    "lte_operator",
    "lte_packet_loss",
    "lte_phy_cell_id",
    "lte_ping",
    "lte_primary_band",
    "lte_rsrp",
    "lte_rsrq",
    "lte_rssi",
    "lte_rx_mbps",
    "lte_rx_total",
    "lte_rx_total_gb",
    "lte_sector_id",
    "lte_sim_state",
    "lte_sinr",
    "lte_time_today",
    "lte_total_daily",
    "lte_total_monthly",
    "lte_tx_mbps",
    "lte_tx_total",
    "lte_tx_total_gb",
    "lte_wan_ipv4",
    "memory_usage",
    "router_connectivity",
    "router_uptime",
    "wan_switches_today",
)

# Transitional sources already present in the Home Assistant NikaS installation.
# They are optional and are never manufactured. Integration-owned entities always
# take precedence. This lets the native panel replace the old central detail page
# without waiting for every historical SNMP/template metric to migrate to RCI.
LEGACY_ENTITY_CANDIDATES: dict[str, tuple[tuple[str, str], ...]] = {
    "internet_connectivity": (("binary_sensor.1_1_1_1", "external_probe"),),
    "router_connectivity": (
        ("binary_sensor.keenetic_hero_4g_kn_2311_connectivity", "ndms2"),
    ),
    "router_uptime": (("sensor.keenetic_hero_4g_uptime", "snmp"),),
    "active_wan": (("sensor.keenetic_active_internet", "template"),),
    "active_rx_mbps": (("sensor.keenetic_active_rx_mbps", "template"),),
    "active_tx_mbps": (("sensor.keenetic_active_tx_mbps", "template"),),
    "ethernet_connected": (("sensor.keenetic_ethernet_status", "snmp"),),
    "ethernet_rx_mbps": (("sensor.keenetic_ethernet_rx_mbps", "template"),),
    "ethernet_tx_mbps": (("sensor.keenetic_ethernet_tx_mbps", "template"),),
    "ethernet_rx_total": (("sensor.keenetic_ethernet_rx_total", "snmp"),),
    "ethernet_tx_total": (("sensor.keenetic_ethernet_tx_total", "snmp"),),
    "ethernet_rx_total_gib": (
        ("sensor.keenetic_ethernet_rx_total_gib", "template"),
    ),
    "ethernet_tx_total_gib": (
        ("sensor.keenetic_ethernet_tx_total_gib", "template"),
    ),
    "ethernet_total_daily": (
        ("sensor.keenetic_ethernet_total_daily", "utility_meter"),
    ),
    "ethernet_total_monthly": (
        ("sensor.keenetic_ethernet_total_monthly", "utility_meter"),
    ),
    "lte_connected": (("sensor.keenetic_lte_status", "snmp"),),
    "lte_rx_mbps": (("sensor.keenetic_lte_rx_mbps", "template"),),
    "lte_tx_mbps": (("sensor.keenetic_lte_tx_mbps", "template"),),
    "lte_rx_total": (("sensor.keenetic_lte_rx_total", "snmp"),),
    "lte_tx_total": (("sensor.keenetic_lte_tx_total", "snmp"),),
    "lte_rx_total_gb": (("sensor.keenetic_lte_rx_total_gb", "template"),),
    "lte_tx_total_gb": (("sensor.keenetic_lte_tx_total_gb", "template"),),
    "lte_total_daily": (("sensor.keenetic_lte_total_daily", "utility_meter"),),
    "lte_total_monthly": (("sensor.keenetic_lte_total_monthly", "utility_meter"),),
    "lte_rssi": (("sensor.keenetic_lte_rssi", "snmp"),),
    "lte_rsrp": (("sensor.keenetic_lte_rsrp", "snmp"),),
    "lte_rsrq": (("sensor.keenetic_lte_rsrq", "snmp"),),
    "lte_sinr": (("sensor.keenetic_lte_sinr", "snmp"),),
}


def _resolve_integration_entities(
    hass: HomeAssistant, entry: ConfigEntry
) -> tuple[dict[str, str], dict[str, str]]:
    """Resolve integration entities by config entry + stable unique_id suffix."""
    registry = er.async_get(hass)
    entity_map: dict[str, str] = {}
    source_map: dict[str, str] = {}

    for registry_entry in registry.entities.values():
        if (
            registry_entry.config_entry_id != entry.entry_id
            or registry_entry.platform != DOMAIN
        ):
            continue
        unique_id = registry_entry.unique_id
        for key in INTEGRATION_ENTITY_KEYS:
            if unique_id.endswith(f"_{key}"):
                entity_map[key] = registry_entry.entity_id
                source_map[key] = "rci"
                break

    return entity_map, source_map


def _add_transitional_entities(
    hass: HomeAssistant,
    entity_map: dict[str, str],
    source_map: dict[str, str],
) -> None:
    """Add factual existing HA sources only when the integration lacks a role."""
    for role, candidates in LEGACY_ENTITY_CANDIDATES.items():
        if role in entity_map:
            continue
        for entity_id, source in candidates:
            if hass.states.get(entity_id) is not None:
                entity_map[role] = entity_id
                source_map[role] = source
                break


def _latest_rci_state_update(
    hass: HomeAssistant, entity_map: dict[str, str], source_map: dict[str, str]
) -> str | None:
    latest = None
    for role, entity_id in entity_map.items():
        if source_map.get(role) != "rci":
            continue
        state = hass.states.get(entity_id)
        if state is None:
            continue
        if latest is None or state.last_updated > latest:
            latest = state.last_updated
    return latest.isoformat() if latest is not None else None


def _bootstrap_payload(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    coordinator: KeeneticCoordinator = entry.runtime_data
    entity_map, source_map = _resolve_integration_entities(hass, entry)
    _add_transitional_entities(hass, entity_map, source_map)

    version = coordinator.data.get("version", {}) if coordinator.data else {}
    system = coordinator.data.get("system", {}) if coordinator.data else {}

    scan_interval = (
        int(coordinator.update_interval.total_seconds())
        if coordinator.update_interval is not None
        else None
    )

    return {
        "panel": {
            "id": "keenetic",
            "title": PANEL_TITLE,
            "path": f"/{PANEL_URL_PATH}",
            "icon": PANEL_ICON,
            "owner": PANEL_OWNER,
            "parent_route": PANEL_PARENT_ROUTE,
            "preferred_view": PANEL_PREFERRED_VIEW,
            "version": PANEL_VERSION,
            "expose_in_generated_ui": True,
        },
        "entry": {
            "entry_id": entry.entry_id,
            "title": entry.title,
            "host": entry.data.get(CONF_HOST),
            "unique_id": entry.unique_id,
            "hostname": system.get("hostname"),
            "model": version.get("device")
            or version.get("model")
            or "Hero 4G+ (KN-2311)",
            "firmware": version.get("release")
            or version.get("version")
            or version.get("title"),
        },
        "entities": entity_map,
        "sources": source_map,
        "telemetry": {
            "last_update_success": bool(coordinator.last_update_success),
            "latest_rci_state_update": _latest_rci_state_update(
                hass, entity_map, source_map
            ),
            "scan_interval_seconds": scan_interval,
        },
    }


def _frontend_bootstrap_fallback(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return a privacy-minimized initial snapshot embedded in panel config."""
    payload = _bootstrap_payload(hass, entry)
    entry_payload = dict(payload.get("entry", {}))
    entry_payload.pop("host", None)
    entry_payload.pop("unique_id", None)
    payload["entry"] = entry_payload
    return payload


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/panel/bootstrap",
        vol.Optional("entry_id"): str,
    }
)
@callback
def websocket_panel_bootstrap(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return panel metadata and current factual entity mapping."""
    entry_id = msg.get("entry_id")
    entry = hass.config_entries.async_get_entry(entry_id) if entry_id else None
    if entry is None:
        entries = hass.config_entries.async_entries(DOMAIN)
        entry = entries[0] if entries else None

    if entry is None or not isinstance(entry.runtime_data, KeeneticCoordinator):
        connection.send_error(
            msg["id"], "not_loaded", "Keenetic Hero 4G+ integration is not loaded"
        )
        return

    connection.send_result(msg["id"], _bootstrap_payload(hass, entry))


async def async_register_native_panel(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Register the integration-owned native Keenetic panel."""
    domain_data = hass.data.setdefault(DOMAIN, {})

    if not domain_data.get(_DATA_WS_REGISTERED):
        websocket_api.async_register_command(hass, websocket_panel_bootstrap)
        domain_data[_DATA_WS_REGISTERED] = True

    if not domain_data.get(_DATA_STATIC_REGISTERED):
        frontend_dir = Path(__file__).parent / "frontend"
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    PANEL_STATIC_URL,
                    str(frontend_dir),
                    cache_headers=False,
                )
            ]
        )
        domain_data[_DATA_STATIC_REGISTERED] = True

    if domain_data.get(_DATA_PANEL_REGISTERED):
        return

    if frontend.async_panel_exists(hass, PANEL_URL_PATH):
        _LOGGER.error(
            "Cannot register Keenetic native panel: /%s is already used by another panel",
            PANEL_URL_PATH,
        )
        return

    try:
        await panel_custom.async_register_panel(
            hass=hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name=PANEL_COMPONENT,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            module_url=PANEL_MODULE,
            embed_iframe=False,
            require_admin=False,
            handle_safe_area=True,
            config={
                "entry_id": entry.entry_id,
                "owner": PANEL_OWNER,
                "parent_route": PANEL_PARENT_ROUTE,
                "panel_version": PANEL_VERSION,
                "preferred_view": PANEL_PREFERRED_VIEW,
                "bootstrap_fallback": _frontend_bootstrap_fallback(hass, entry),
            },
        )
    except ValueError as err:
        _LOGGER.error("Unable to register Keenetic native panel: %s", err)
        return

    domain_data[_DATA_PANEL_ENTRY_ID] = entry.entry_id
    domain_data[_DATA_PANEL_REGISTERED] = True


@callback
def async_unregister_native_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Remove the panel when its owning config entry is unloaded."""
    domain_data = hass.data.get(DOMAIN, {})
    if domain_data.get(_DATA_PANEL_ENTRY_ID) != entry.entry_id:
        return
    if domain_data.get(_DATA_PANEL_REGISTERED) and frontend.async_panel_exists(
        hass, PANEL_URL_PATH
    ):
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
    domain_data[_DATA_PANEL_REGISTERED] = False
