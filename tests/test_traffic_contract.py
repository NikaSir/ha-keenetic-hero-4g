from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "keenetic_hero_4g"
    / "traffic.py"
)
SPEC = importlib.util.spec_from_file_location("keenetic_traffic_contract", MODULE_PATH)
assert SPEC is not None and SPEC.loader is not None
traffic = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(traffic)


class TrafficConversionTests(unittest.TestCase):
    def test_rate_converts_bits_per_second_to_mbit(self) -> None:
        self.assertEqual(traffic.rate_mbps({"rxspeed": 7_158_920}, "rxspeed"), 7.159)

    def test_total_converts_bytes_to_gib(self) -> None:
        value = 15_526_006_093
        self.assertEqual(
            traffic.total_gib({"rxbytes": value}, "rxbytes"),
            round(value / (1024**3), 6),
        )

    def test_factual_zero_is_preserved(self) -> None:
        self.assertEqual(traffic.rate_mbps({"rxspeed": 0}, "rxspeed"), 0.0)
        self.assertEqual(traffic.total_gib({"rxbytes": 0}, "rxbytes"), 0.0)

    def test_missing_or_invalid_values_stay_unknown(self) -> None:
        self.assertIsNone(traffic.rate_mbps({}, "rxspeed"))
        self.assertIsNone(traffic.total_gib({"rxbytes": "bad"}, "rxbytes"))

    def test_active_rate_follows_factual_active_wan(self) -> None:
        data = {
            "active_wan": "lte",
            "ethernet_stats": {"rxspeed": 1_000_000},
            "lte_stats": {"rxspeed": 12_500_000},
        }
        self.assertEqual(traffic.active_rate_mbps(data, "rxspeed"), 12.5)
        data["active_wan"] = "unknown"
        self.assertIsNone(traffic.active_rate_mbps(data, "rxspeed"))

    def test_optional_rci_error_is_detected(self) -> None:
        payload = {
            "status": [
                {
                    "status": "error",
                    "code": "6553609",
                    "message": "unable to find interface",
                }
            ]
        }
        self.assertEqual(
            traffic.rci_error_message(payload), "unable to find interface"
        )
        self.assertIsNone(traffic.rci_error_message({"rxspeed": 1}))


if __name__ == "__main__":
    unittest.main()
