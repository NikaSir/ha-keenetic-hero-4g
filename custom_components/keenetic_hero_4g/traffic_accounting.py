from __future__ import annotations

from copy import deepcopy
from datetime import datetime
from typing import Any

CHANNELS = ("ethernet", "lte")
COUNTERS = ("rxbytes", "txbytes")


def _empty_channel_totals() -> dict[str, int]:
    return {channel: 0 for channel in CHANNELS}


def _empty_last_raw() -> dict[str, dict[str, int | None]]:
    return {
        channel: {counter: None for counter in COUNTERS}
        for channel in CHANNELS
    }


def initial_state(now: datetime) -> dict[str, Any]:
    """Create fail-closed accounting state for a partial first period."""
    return {
        "day": now.date().isoformat(),
        "month": now.strftime("%Y-%m"),
        "daily_bytes": _empty_channel_totals(),
        "monthly_bytes": _empty_channel_totals(),
        "daily_complete": False,
        "monthly_complete": False,
        "last_raw": _empty_last_raw(),
        "coverage_started": now.isoformat(),
        "resets": _empty_channel_totals(),
    }


def normalize_state(value: Any, now: datetime) -> dict[str, Any]:
    """Return a safe state while accepting future-compatible persisted fields."""
    base = initial_state(now)
    if not isinstance(value, dict):
        return base

    state = deepcopy(base)
    for key in (
        "day",
        "month",
        "daily_complete",
        "monthly_complete",
        "coverage_started",
    ):
        if key in value:
            state[key] = value[key]

    for totals_key in ("daily_bytes", "monthly_bytes", "resets"):
        incoming = value.get(totals_key)
        if isinstance(incoming, dict):
            for channel in CHANNELS:
                raw = incoming.get(channel)
                try:
                    number = int(raw)
                except (TypeError, ValueError):
                    continue
                if number >= 0:
                    state[totals_key][channel] = number

    incoming_last = value.get("last_raw")
    if isinstance(incoming_last, dict):
        for channel in CHANNELS:
            channel_value = incoming_last.get(channel)
            if not isinstance(channel_value, dict):
                continue
            for counter in COUNTERS:
                raw = channel_value.get(counter)
                if raw is None:
                    state["last_raw"][channel][counter] = None
                    continue
                try:
                    number = int(raw)
                except (TypeError, ValueError):
                    continue
                if number >= 0:
                    state["last_raw"][channel][counter] = number

    return state


def _counter_value(stats: Any, key: str) -> int | None:
    if not isinstance(stats, dict):
        return None
    raw = stats.get(key)
    try:
        number = int(raw)
    except (TypeError, ValueError):
        return None
    return number if number >= 0 else None


def _roll_periods(state: dict[str, Any], now: datetime) -> None:
    today = now.date().isoformat()
    month = now.strftime("%Y-%m")

    if state.get("month") != month:
        state["month"] = month
        state["monthly_bytes"] = _empty_channel_totals()
        # A month that starts while the accounting engine is already running is
        # a complete RCI-accounted month from its first observed sample onward.
        state["monthly_complete"] = True

    if state.get("day") != today:
        state["day"] = today
        state["daily_bytes"] = _empty_channel_totals()
        # Same rule for a new local calendar day.
        state["daily_complete"] = True


def update_accounting(
    state_value: Any,
    now: datetime,
    ethernet_stats: Any,
    lte_stats: Any,
) -> dict[str, Any]:
    """Accumulate RCI byte-counter deltas across resets and period rollovers.

    The first observation establishes a baseline and contributes no invented
    traffic. If a raw counter decreases later, treat it as a counter reset and
    add only the post-reset raw value, which is the minimum factual delta since
    the reset. Missing/malformed counters do not change totals or baselines.
    """
    state = normalize_state(state_value, now)
    _roll_periods(state, now)

    stats_by_channel = {
        "ethernet": ethernet_stats,
        "lte": lte_stats,
    }

    for channel in CHANNELS:
        stats = stats_by_channel[channel]
        for key in COUNTERS:
            current = _counter_value(stats, key)
            if current is None:
                continue

            previous = state["last_raw"][channel].get(key)
            state["last_raw"][channel][key] = current
            if previous is None:
                continue

            if current >= previous:
                delta = current - previous
            else:
                delta = current
                state["resets"][channel] = int(state["resets"].get(channel, 0)) + 1

            state["daily_bytes"][channel] = int(
                state["daily_bytes"].get(channel, 0)
            ) + delta
            state["monthly_bytes"][channel] = int(
                state["monthly_bytes"].get(channel, 0)
            ) + delta

    return state


def period_bytes(
    state: dict[str, Any] | None,
    channel: str,
    period: str,
) -> int | None:
    """Return a period total only when the period has full RCI coverage."""
    if not isinstance(state, dict) or channel not in CHANNELS:
        return None
    if period == "daily":
        if state.get("daily_complete") is not True:
            return None
        totals = state.get("daily_bytes")
    elif period == "monthly":
        if state.get("monthly_complete") is not True:
            return None
        totals = state.get("monthly_bytes")
    else:
        return None
    if not isinstance(totals, dict):
        return None
    try:
        value = int(totals.get(channel))
    except (TypeError, ValueError):
        return None
    return value if value >= 0 else None
