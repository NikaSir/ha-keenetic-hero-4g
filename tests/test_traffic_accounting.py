from __future__ import annotations

import importlib.util
import unittest
from datetime import datetime
from pathlib import Path

MODULE_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "keenetic_hero_4g"
    / "traffic_accounting.py"
)
SPEC = importlib.util.spec_from_file_location("keenetic_traffic_accounting", MODULE_PATH)
assert SPEC is not None and SPEC.loader is not None
accounting = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(accounting)


class TrafficAccountingTests(unittest.TestCase):
    def test_first_sample_establishes_baseline_without_invented_traffic(self) -> None:
        now = datetime(2026, 8, 23, 11, 0, 0)
        state = accounting.update_accounting(
            None,
            now,
            {"rxbytes": 1_000, "txbytes": 200},
            {"rxbytes": 500, "txbytes": 100},
        )
        self.assertEqual(state["daily_bytes"]["ethernet"], 0)
        self.assertEqual(state["monthly_bytes"]["lte"], 0)
        self.assertFalse(state["daily_complete"])
        self.assertFalse(state["monthly_complete"])
        self.assertIsNone(accounting.period_bytes(state, "ethernet", "daily"))

    def test_same_period_accumulates_rx_and_tx_deltas(self) -> None:
        first = datetime(2026, 8, 23, 11, 0, 0)
        state = accounting.update_accounting(
            None,
            first,
            {"rxbytes": 1_000, "txbytes": 200},
            {"rxbytes": 500, "txbytes": 100},
        )
        state = accounting.update_accounting(
            state,
            datetime(2026, 8, 23, 11, 0, 30),
            {"rxbytes": 1_300, "txbytes": 260},
            {"rxbytes": 900, "txbytes": 130},
        )
        self.assertEqual(state["daily_bytes"]["ethernet"], 360)
        self.assertEqual(state["daily_bytes"]["lte"], 430)
        self.assertEqual(state["monthly_bytes"]["ethernet"], 360)

    def test_raw_counter_reset_adds_only_post_reset_value(self) -> None:
        state = accounting.update_accounting(
            None,
            datetime(2026, 8, 23, 11, 0, 0),
            {"rxbytes": 10_000, "txbytes": 2_000},
            {},
        )
        state = accounting.update_accounting(
            state,
            datetime(2026, 8, 23, 11, 0, 30),
            {"rxbytes": 100, "txbytes": 50},
            {},
        )
        self.assertEqual(state["daily_bytes"]["ethernet"], 150)
        self.assertEqual(state["resets"]["ethernet"], 2)

    def test_new_day_becomes_complete_and_resets_daily_bucket(self) -> None:
        state = accounting.update_accounting(
            None,
            datetime(2026, 8, 23, 23, 59, 30),
            {"rxbytes": 1_000, "txbytes": 100},
            {},
        )
        state = accounting.update_accounting(
            state,
            datetime(2026, 8, 24, 0, 0, 10),
            {"rxbytes": 1_100, "txbytes": 110},
            {},
        )
        self.assertTrue(state["daily_complete"])
        self.assertFalse(state["monthly_complete"])
        self.assertEqual(accounting.period_bytes(state, "ethernet", "daily"), 110)
        self.assertEqual(state["monthly_bytes"]["ethernet"], 110)

    def test_new_month_becomes_complete_and_resets_monthly_bucket(self) -> None:
        state = accounting.update_accounting(
            None,
            datetime(2026, 8, 31, 23, 59, 30),
            {"rxbytes": 5_000, "txbytes": 1_000},
            {},
        )
        state = accounting.update_accounting(
            state,
            datetime(2026, 9, 1, 0, 0, 10),
            {"rxbytes": 5_400, "txbytes": 1_100},
            {},
        )
        self.assertTrue(state["daily_complete"])
        self.assertTrue(state["monthly_complete"])
        self.assertEqual(accounting.period_bytes(state, "ethernet", "monthly"), 500)

    def test_missing_stats_do_not_erase_last_baseline(self) -> None:
        state = accounting.update_accounting(
            None,
            datetime(2026, 8, 23, 11, 0, 0),
            {"rxbytes": 1_000, "txbytes": 200},
            {},
        )
        state = accounting.update_accounting(
            state,
            datetime(2026, 8, 23, 11, 0, 30),
            {},
            {},
        )
        state = accounting.update_accounting(
            state,
            datetime(2026, 8, 23, 11, 1, 0),
            {"rxbytes": 1_500, "txbytes": 250},
            {},
        )
        self.assertEqual(state["daily_bytes"]["ethernet"], 550)


if __name__ == "__main__":
    unittest.main()
