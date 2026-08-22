from __future__ import annotations

import importlib.util
import unittest
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
    def test_ethernet_only_connected(self) -> None:
        self.assertEqual(active([], {"connected": True}, {"connected": False}), wan.WAN_ETHERNET)

    def test_lte_only_connected(self) -> None:
        self.assertEqual(active([], {"connected": False}, {"connected": True}), wan.WAN_LTE)

    def test_default_route_selects_ethernet_when_both_links_are_up(self) -> None:
        routes = [{"destination": "0.0.0.0/0", "interface": ETH}]
        self.assertEqual(active(routes, {"state": "up"}, {"state": "up"}), wan.WAN_ETHERNET)

    def test_default_route_selects_lte_when_both_links_are_up(self) -> None:
        routes = {"route": [{"destination": "0.0.0.0/0", "interface": LTE}]}
        self.assertEqual(active(routes, {"state": "up"}, {"state": "up"}), wan.WAN_LTE)

    def test_rejecting_default_route_is_ignored(self) -> None:
        routes = [{"destination": "0.0.0.0/0", "interface": LTE, "rejecting": True}]
        self.assertIsNone(active(routes, {"state": "up"}, {"state": "up"}))

    def test_unique_public_host_route_can_identify_physical_wan(self) -> None:
        routes = [{"destination": "1.1.1.1/32", "interface": LTE}]
        self.assertEqual(active(routes, {}, {}), wan.WAN_LTE)

    def test_private_host_route_is_not_used_as_wan_evidence(self) -> None:
        routes = [{"destination": "192.168.1.1/32", "interface": ETH}]
        self.assertIsNone(active(routes, {}, {}))

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


if __name__ == "__main__":
    unittest.main()
