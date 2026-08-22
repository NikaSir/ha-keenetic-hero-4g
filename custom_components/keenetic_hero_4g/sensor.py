from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    PERCENTAGE,
    UnitOfDataRate,
    UnitOfFrequency,
    UnitOfTemperature,
    UnitOfTime,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .coordinator import KeeneticCoordinator, WAN_ETHERNET, WAN_LTE
from .entity import KeeneticEntity, as_float, first_value

ValueFn = Callable[[dict[str, Any]], Any]


@dataclass(frozen=True, kw_only=True)
class KeeneticSensorDescription(SensorEntityDescription):
    value_fn: ValueFn


def block(name: str, *paths: tuple[str, ...]) -> ValueFn:
    return lambda data: first_value(data.get(name, {}), paths)


def memory_usage(data: dict[str, Any]) -> float | None:
    system = data.get("system", {})
    memory = first_value(system, (("memory",),))
    if isinstance(memory, str) and "/" in memory:
        used, total = memory.split("/", 1)
        try:
            return round(float(used) / float(total) * 100, 1)
        except (ValueError, ZeroDivisionError):
            return None
    total = as_float(first_value(system, (("memtotal",), ("memory-total",))))
    free = as_float(first_value(system, (("memfree",), ("memory-free",))))
    if total and free is not None:
        return round((total - free) / total * 100, 1)
    return None


def interface_uptime(name: str) -> ValueFn:
    def value_fn(data: dict[str, Any]) -> int | None:
        value = as_float(first_value(data.get(name, {}), (("uptime",), ("link", "uptime"))))
        return int(value / 60) if value is not None else None
    return value_fn


def ethernet_speed(data: dict[str, Any]) -> float | None:
    value = first_value(
        data.get("ethernet", {}),
        (("speed",), ("link", "speed"), ("port", "speed"), ("physical", "speed")),
    )
    return as_float(value)


def lte_band(data: dict[str, Any]) -> str | None:
    value = first_value(data.get("lte", {}), (("band",), ("radio", "band")))
    return f"B{value}" if value not in (None, "") else None


def lte_carriers(data: dict[str, Any]) -> str | None:
    carrier = first_value(data.get("lte", {}), (("carrier",), ("carriers",)))
    items = carrier.values() if isinstance(carrier, dict) else carrier if isinstance(carrier, list) else []
    values: list[str] = []
    for item in items:
        if not isinstance(item, dict):
            continue
        active = item.get("active")
        if active is False or str(active).lower() in {"false", "no", "0"}:
            continue
        band = item.get("band")
        bandwidth = item.get("bandwidth")
        if band is None:
            continue
        label = f"B{band}"
        if bandwidth is not None:
            label += f" ({bandwidth} MHz)"
        values.append(label)
    return " + ".join(values) if values else None


def lte_modem_model(data: dict[str, Any]) -> str | None:
    """Return the factual modem product/model, not Keenetic's numeric modem type code."""
    return first_value(
        data.get("lte", {}),
        (("product",), ("ati", "model"), ("modem", "model"), ("model",)),
    )


def diagnostic(channel: str, key: str) -> ValueFn:
    return lambda data: first_value(data.get("diagnostics", {}).get(channel, {}), ((key,),))


def active_wan(data: dict[str, Any]) -> str:
    value = data.get("active_wan")
    return value if value in {WAN_ETHERNET, WAN_LTE} else "unknown"


def last_switch(data: dict[str, Any]) -> Any:
    value = first_value(data.get("failover", {}), (("last_switch",),))
    if not isinstance(value, str):
        return None
    return dt_util.parse_datetime(value)


def last_switch_reason(data: dict[str, Any]) -> str:
    value = first_value(data.get("failover", {}), (("last_switch_reason",),))
    allowed = {"ethernet_link_down", "ethernet_restored", "route_changed"}
    return value if value in allowed else "unknown"


def lte_time_today(data: dict[str, Any]) -> float | None:
    seconds = as_float(first_value(data.get("failover", {}), (("lte_seconds_today",),)))
    return round(seconds / 60, 1) if seconds is not None else None


SENSORS: tuple[KeeneticSensorDescription, ...] = (
    KeeneticSensorDescription(key="cpu_load", translation_key="cpu_load", icon="mdi:cpu-64-bit", native_unit_of_measurement=PERCENTAGE, value_fn=lambda d: as_float(first_value(d.get("system", {}), (("cpuload",), ("cpu-load",))))),
    KeeneticSensorDescription(key="memory_usage", translation_key="memory_usage", icon="mdi:memory", native_unit_of_measurement=PERCENTAGE, value_fn=memory_usage),
    KeeneticSensorDescription(key="firmware_version", translation_key="firmware_version", icon="mdi:router-wireless-settings", value_fn=block("version", ("release",), ("version",), ("title",))),
    KeeneticSensorDescription(key="ethernet_wan_ipv4", translation_key="ethernet_wan_ipv4", icon="mdi:ip-network", value_fn=block("ethernet", ("address",), ("ip", "address"))),
    KeeneticSensorDescription(key="ethernet_link_speed", translation_key="ethernet_link_speed", icon="mdi:ethernet", native_unit_of_measurement=UnitOfDataRate.MEGABITS_PER_SECOND, value_fn=ethernet_speed),
    KeeneticSensorDescription(key="ethernet_interface_uptime", translation_key="ethernet_interface_uptime", icon="mdi:timer-outline", native_unit_of_measurement=UnitOfTime.MINUTES, value_fn=interface_uptime("ethernet")),
    KeeneticSensorDescription(key="lte_wan_ipv4", translation_key="lte_wan_ipv4", icon="mdi:ip-network-outline", value_fn=block("lte", ("address",), ("ip", "address"))),
    KeeneticSensorDescription(key="lte_interface_uptime", translation_key="lte_interface_uptime", icon="mdi:timer-outline", native_unit_of_measurement=UnitOfTime.MINUTES, value_fn=interface_uptime("lte")),
    KeeneticSensorDescription(key="lte_operator", translation_key="lte_operator", icon="mdi:access-point-network", value_fn=block("lte", ("operator",), ("mobile", "operator"))),
    KeeneticSensorDescription(key="lte_network_type", translation_key="lte_network_type", icon="mdi:signal-4g", value_fn=block("lte", ("mobile",), ("network",), ("network-type",))),
    KeeneticSensorDescription(key="lte_primary_band", translation_key="lte_primary_band", icon="mdi:radio-tower", value_fn=lte_band),
    KeeneticSensorDescription(key="lte_carriers", translation_key="lte_carriers", icon="mdi:signal-cellular-3", value_fn=lte_carriers),
    KeeneticSensorDescription(key="lte_bandwidth", translation_key="lte_bandwidth", icon="mdi:sine-wave", native_unit_of_measurement=UnitOfFrequency.MEGAHERTZ, value_fn=lambda d: as_float(first_value(d.get("lte", {}), (("bandwidth",), ("radio", "bandwidth"))))),
    KeeneticSensorDescription(key="lte_enb_id", translation_key="lte_enb_id", icon="mdi:transmission-tower", value_fn=block("lte", ("enb-id",), ("enb_id",))),
    KeeneticSensorDescription(key="lte_sector_id", translation_key="lte_sector_id", icon="mdi:transmission-tower", value_fn=block("lte", ("sector-id",), ("sector_id",))),
    KeeneticSensorDescription(key="lte_phy_cell_id", translation_key="lte_phy_cell_id", icon="mdi:transmission-tower", value_fn=block("lte", ("phy-cell-id",), ("pci",))),
    KeeneticSensorDescription(key="lte_earfcn", translation_key="lte_earfcn", icon="mdi:sine-wave", value_fn=block("lte", ("earfcn",))),
    KeeneticSensorDescription(key="lte_modem_temperature", translation_key="lte_modem_temperature", icon="mdi:thermometer", device_class=SensorDeviceClass.TEMPERATURE, native_unit_of_measurement=UnitOfTemperature.CELSIUS, value_fn=lambda d: as_float(first_value(d.get("lte", {}), (("temperature",), ("modem", "temperature"))))),
    KeeneticSensorDescription(key="lte_modem_model", translation_key="lte_modem_model", icon="mdi:expansion-card", value_fn=lte_modem_model),
    KeeneticSensorDescription(key="lte_modem_firmware", translation_key="lte_modem_firmware", icon="mdi:chip", value_fn=block("lte", ("fw",), ("firmware",), ("modem", "firmware"))),
    KeeneticSensorDescription(key="lte_sim_state", translation_key="lte_sim_state", icon="mdi:sim", value_fn=block("lte", ("sim",), ("sim-state",), ("sim", "state"))),
    KeeneticSensorDescription(key="active_wan", translation_key="active_wan", icon="mdi:wan", device_class=SensorDeviceClass.ENUM, options=[WAN_ETHERNET, WAN_LTE, "unknown"], value_fn=active_wan),
    KeeneticSensorDescription(key="ethernet_ping", translation_key="ethernet_ping", icon="mdi:lan-connect", device_class=SensorDeviceClass.DURATION, native_unit_of_measurement=UnitOfTime.MILLISECONDS, value_fn=lambda d: as_float(diagnostic(WAN_ETHERNET, "ping_ms")(d))),
    KeeneticSensorDescription(key="ethernet_packet_loss", translation_key="ethernet_packet_loss", icon="mdi:percent-outline", native_unit_of_measurement=PERCENTAGE, value_fn=lambda d: as_float(diagnostic(WAN_ETHERNET, "packet_loss")(d))),
    KeeneticSensorDescription(key="lte_ping", translation_key="lte_ping", icon="mdi:signal-4g", device_class=SensorDeviceClass.DURATION, native_unit_of_measurement=UnitOfTime.MILLISECONDS, value_fn=lambda d: as_float(diagnostic(WAN_LTE, "ping_ms")(d))),
    KeeneticSensorDescription(key="lte_packet_loss", translation_key="lte_packet_loss", icon="mdi:percent-outline", native_unit_of_measurement=PERCENTAGE, value_fn=lambda d: as_float(diagnostic(WAN_LTE, "packet_loss")(d))),
    KeeneticSensorDescription(key="last_wan_switch", translation_key="last_wan_switch", icon="mdi:swap-horizontal-bold", device_class=SensorDeviceClass.TIMESTAMP, value_fn=last_switch),
    KeeneticSensorDescription(key="last_wan_switch_reason", translation_key="last_wan_switch_reason", icon="mdi:swap-horizontal", device_class=SensorDeviceClass.ENUM, options=["ethernet_link_down", "ethernet_restored", "route_changed", "unknown"], value_fn=last_switch_reason),
    KeeneticSensorDescription(key="wan_switches_today", translation_key="wan_switches_today", icon="mdi:counter", value_fn=lambda d: int(first_value(d.get("failover", {}), (("switches_today",),)) or 0)),
    KeeneticSensorDescription(key="lte_time_today", translation_key="lte_time_today", icon="mdi:timer-outline", device_class=SensorDeviceClass.DURATION, native_unit_of_measurement=UnitOfTime.MINUTES, value_fn=lte_time_today),
)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback) -> None:
    """Set up Keenetic sensors."""
    coordinator: KeeneticCoordinator = entry.runtime_data
    async_add_entities(KeeneticSensor(coordinator, description) for description in SENSORS)


class KeeneticSensor(KeeneticEntity, SensorEntity):
    """Keenetic sensor."""

    entity_description: KeeneticSensorDescription

    def __init__(self, coordinator: KeeneticCoordinator, description: KeeneticSensorDescription) -> None:
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> Any:
        return self.entity_description.value_fn(self.coordinator.data)
