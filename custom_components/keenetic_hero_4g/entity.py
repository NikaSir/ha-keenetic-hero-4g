from __future__ import annotations

from collections.abc import Iterable
from typing import Any

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import KeeneticCoordinator


class KeeneticEntity(CoordinatorEntity[KeeneticCoordinator]):
    """Base Keenetic entity."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: KeeneticCoordinator, key: str) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.unique_id}_{key}"

    @property
    def device_info(self) -> DeviceInfo:
        version = self.coordinator.data.get("version", {})
        model = first_value(version, (("model",), ("device",), ("title",)))
        sw_version = first_value(version, (("release",), ("version",), ("title",)))
        return DeviceInfo(
            identifiers={(DOMAIN, self.coordinator.entry.unique_id or self.coordinator.entry.entry_id)},
            manufacturer="Keenetic",
            model=str(model or "Hero 4G+ (KN-2311)"),
            name=self.coordinator.entry.title,
            sw_version=str(sw_version) if sw_version is not None else None,
            configuration_url=self.coordinator.client.configuration_url,
        )


def get_path(data: Any, path: tuple[str, ...]) -> Any:
    current = data
    for key in path:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def first_value(data: Any, paths: Iterable[tuple[str, ...]]) -> Any:
    for path in paths:
        value = get_path(data, path)
        if value not in (None, ""):
            return value
    return None


def as_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None
