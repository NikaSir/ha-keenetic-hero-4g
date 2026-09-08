from __future__ import annotations

import importlib.util
import unittest
from datetime import datetime
from pathlib import Path


MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "keenetic_hero_4g"
    / "wan.py"
)
SPEC = importlib.util.spec_from_file_location("keenetic_wan_contract", MODULE_PATH)
assert SPEC is not None and SPEC.loader is not None
wan = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(wan)

ETH = "GigabitEthernet1"
LTE = "UsbLte0"


def active(routes, ethernet, lte):
    return wan.determine_active_wan(
        routes,
        ethernet,
        lte,
        ethernet_interface=ETH,
        lte_interface=LTE,
    )


class ConnectedStateTests(unittest.TestCase):
    def test_true_states(self) -> None:
        for value in ("yes", "true", "1", "on", "up", "running", "connected", "ready"):
            with self.subTest(value=value):
                self.assertIs(wan.connected({"state": value}), True)

    def test_false_states(self) -> None:
        for value in ("no", "false", "0", "off", "down", "disabled", "disconnected", "not-connected"):
            with self.subTest(value=value):
                self.assertIs(wan.connected({"connection-state": value}), False)

    def test_missing_or_unrecognized_state_is_unknown(self) -> None:
        self.assertIsNone(wan.connected({}))
        self.assertIsNone(wan.connected({"state": "initializing"}))


class ActiveWanTests(unittest.TestCase):
    def test_link_state_alone_does_not_select_ethernet_route(self) -> None:
        self.assertIsNone(active([], {"connected": True}, {"connected": False}))

    def test_link_state_alone_does_not_select_lte_route(self) -> None:
        self.assertIsNone(active([], {"connected": False}, {"connected": True}))

    def test_default_route_selects_ethernet_when_both_links_are_up(self) -> None:
        routes = [{"destination": "0.0.0.0/0", "interface": ETH}]
        self.assertEqual(active(routes, {"state": "up"}, {"state": "up"}), wan.WAN_ETHERNET)

    def test_default_route_selects_lte_when_both_links_are_up(self) -> None:
        routes = {"route": [{"destination": "0.0.0.0/0", "interface": LTE}]}
        self.assertEqual(active(routes, {"state": "up"}, {"state": "up"}), wan.WAN_LTE)

    def test_rejecting_default_route_is_ignored(self) -> None:
        routes = [{"destination": "0.0.0.0/0", "interface": LTE, "rejecting": True}]
        self.assertIsNone(active(routes, {"state": "up"}, {"state": "up"}))

    def test_stale_default_route_does_not_select_down_interface(self) -> None:
        routes = [{"destination": "0.0.0.0/0", "interface": LTE}]
        self.assertIsNone(active(routes, {"state": "down"}, {"state": "down"}))

    def test_unique_public_host_route_can_identify_physical_wan(self) -> None:
        routes = [{"destination": "1.1.1.1/32", "interface": LTE}]
        self.assertEqual(active(routes, {}, {}), wan.WAN_LTE)

    def test_private_host_route_is_not_used_as_wan_evidence(self) -> None:
        routes = [{"destination": "192.168.1.1/32", "interface": ETH}]
        self.assertIsNone(active(routes, {}, {}))

    def test_stale_public_host_route_does_not_select_down_interface(self) -> None:
        routes = [{"destination": "1.1.1.1/32", "interface": LTE}]
        self.assertIsNone(active(routes, {"state": "down"}, {"state": "down"}))

    def test_down_interface_is_excluded_before_host_route_disambiguation(self) -> None:
        routes = [
            {"destination": "1.1.1.1/32", "interface": ETH},
            {"destination": "8.8.8.8/32", "interface": LTE},
        ]
        self.assertEqual(
            active(routes, {"state": "down"}, {"state": "up"}),
            wan.WAN_LTE,
        )

    def test_ambiguous_public_host_routes_stay_unknown(self) -> None:
        routes = [
            {"destination": "1.1.1.1/32", "interface": ETH},
            {"destination": "8.8.8.8/32", "interface": LTE},
        ]
        self.assertIsNone(active(routes, {}, {}))

    def test_partial_or_unavailable_telemetry_stays_unknown(self) -> None:
        self.assertIsNone(active(None, {}, {}))
        self.assertIsNone(active({}, {"state": "initializing"}, {}))


class FailoverReasonTests(unittest.TestCase):
    def test_ethernet_link_down_reason(self) -> None:
        self.assertEqual(
            wan.switch_reason(wan.WAN_ETHERNET, wan.WAN_LTE, {"state": "down"}),
            "ethernet_link_down",
        )

    def test_ethernet_restored_reason(self) -> None:
        self.assertEqual(
            wan.switch_reason(wan.WAN_LTE, wan.WAN_ETHERNET, {"state": "ready"}),
            "ethernet_restored",
        )

    def test_unknown_cause_is_conservatively_route_changed(self) -> None:
        self.assertEqual(
            wan.switch_reason(wan.WAN_ETHERNET, wan.WAN_LTE, {}),
            "route_changed",
        )


class FailoverTrackingTests(unittest.TestCase):
    def update(
        self,
        state,
        active_wan,
        second,
        elapsed,
        *,
        first=False,
        ethernet=None,
        day=8,
    ):
        return wan.update_failover_tracking(
            state,
            active_wan,
            ethernet or {},
            datetime(2026, 9, day, 12, 0, second),
            elapsed,
            first_runtime_update=first,
        )

    def test_unknown_intervals_are_not_counted_as_lte(self) -> None:
        state = {}
        state = self.update(state, wan.WAN_LTE, 0, None, first=True)
        state = self.update(state, None, 30, 30)
        state = self.update(state, None, 40, 10)
        state = self.update(
            state,
            wan.WAN_ETHERNET,
            50,
            10,
            ethernet={"state": "up"},
        )

        self.assertEqual(state["lte_seconds_today"], 30)
        self.assertEqual(state["unknown_seconds_today"], 20)
        self.assertEqual(state["last_known_wan"], wan.WAN_ETHERNET)
        self.assertEqual(state["interval_wan"], wan.WAN_ETHERNET)
        self.assertEqual(state["switches_today"], 1)
        self.assertEqual(state["last_switch_reason"], "ethernet_restored")

    def test_restart_does_not_invent_duration_or_switch(self) -> None:
        state = {
            "date": "2026-09-08",
            "last_known_wan": wan.WAN_LTE,
            "interval_wan": wan.WAN_LTE,
            "lte_seconds_today": 15.0,
            "unknown_seconds_today": 5.0,
            "switches_today": 0,
        }

        state = self.update(
            state,
            wan.WAN_ETHERNET,
            30,
            None,
            first=True,
            ethernet={"state": "up"},
        )

        self.assertEqual(state["lte_seconds_today"], 15)
        self.assertEqual(state["unknown_seconds_today"], 5)
        self.assertEqual(state["switches_today"], 0)
        self.assertIsNone(state.get("last_switch"))

    def test_day_rollover_attributes_only_new_day_seconds(self) -> None:
        state = {
            "date": "2026-09-07",
            "last_known_wan": wan.WAN_LTE,
            "interval_wan": wan.WAN_LTE,
            "lte_seconds_today": 500.0,
            "unknown_seconds_today": 50.0,
            "switches_today": 3,
        }

        state = wan.update_failover_tracking(
            state,
            wan.WAN_ETHERNET,
            {"state": "up"},
            datetime(2026, 9, 8, 0, 0, 10),
            30,
            first_runtime_update=False,
        )

        self.assertEqual(state["lte_seconds_today"], 10)
        self.assertEqual(state["unknown_seconds_today"], 0)
        self.assertEqual(state["switches_today"], 1)

    def test_legacy_active_wan_is_kept_only_as_last_known_history(self) -> None:
        state = {"date": "2026-09-08", "active_wan": wan.WAN_LTE}

        state = self.update(state, None, 30, None, first=True)

        self.assertEqual(state["last_known_wan"], wan.WAN_LTE)
        self.assertIsNone(state["interval_wan"])
        self.assertNotIn("active_wan", state)


if __name__ == "__main__":
    unittest.main()
