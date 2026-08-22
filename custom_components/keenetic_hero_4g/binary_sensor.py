from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity, BinarySensorEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .coordinator import KeeneticCoordinator
from .wan import connected as interface_connected

BoolFn = Callable[[dict[str, Any]], bool | None]


@dataclass(frozen=True, kw_only=True)
class KeeneticBinaryDescription(BinarySensorEntityDescription):
    value_fn: BoolFn


def connected(block_name: str) -> BoolFn:
    """Return one binary-sensor value using the shared WAN state contract."""

    def value_fn(data: dict[str, Any]) -> bool | None:
        block = data.get(block_name, {})
        return interface_connected(block) if isinstance(block, dict) else None

    return value_fn


BINARY_SENSORS: tuple[KeeneticBinaryDescription, ...] = (
    KeeneticBinaryDescription(key="ethernet_connected", translation_key="ethernet_connected", icon="mdi:ethernet", device_class=BinarySensorDeviceClass.CONNECTIVITY, value_fn=connected("ethernet")),
    KeeneticBinaryDescription(key="lte_connected", translation_key="lte_connected", icon="mdi:signal-4g", device_class=BinarySensorDeviceClass.CONNECTIVITY, value_fn=connected("lte")),
)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback) -> None:
    coordinator: KeeneticCoordinator = entry.runtime_data
    async_add_entities(KeeneticBinarySensor(coordinator, description) for description in BINARY_SENSORS)


class KeeneticBinarySensor(KeeneticEntity, BinarySensorEntity):
    entity_description: KeeneticBinaryDescription

    def __init__(self, coordinator: KeeneticCoordinator, description: KeeneticBinaryDescription) -> None:
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def is_on(self) -> bool | None:
        return self.entity_description.value_fn(self.coordinator.data)
