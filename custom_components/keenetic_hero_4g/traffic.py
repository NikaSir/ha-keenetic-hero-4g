from __future__ import annotations

from typing import Any

BITS_PER_MEGABIT = 1_000_000.0
BYTES_PER_GIB = float(1024**3)


def as_number(value: Any) -> float | None:
    """Return a finite numeric value or None without manufacturing zero."""
    if value is None or value == "":
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if number != number or number in {float("inf"), float("-inf")}:
        return None
    return number


def rate_mbps(stats: dict[str, Any], key: str) -> float | None:
    """Convert factual Keenetic interface bit/s statistics to Mbit/s."""
    value = as_number(stats.get(key)) if isinstance(stats, dict) else None
    return round(value / BITS_PER_MEGABIT, 3) if value is not None else None


def total_gib(stats: dict[str, Any], key: str) -> float | None:
    """Convert factual Keenetic cumulative byte counters to GiB."""
    value = as_number(stats.get(key)) if isinstance(stats, dict) else None
    return round(value / BYTES_PER_GIB, 6) if value is not None else None


def channel_stats(data: dict[str, Any], channel: str) -> dict[str, Any]:
    """Return one factual interface-statistics block."""
    value = data.get(f"{channel}_stats", {})
    return value if isinstance(value, dict) else {}


def active_rate_mbps(data: dict[str, Any], key: str) -> float | None:
    """Return the rate for the factual active WAN only."""
    active = data.get("active_wan")
    if active not in {"ethernet", "lte"}:
        return None
    return rate_mbps(channel_stats(data, active), key)
