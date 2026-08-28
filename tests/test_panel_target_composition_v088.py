from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v088.js"


class TargetCompositionV088Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.manifest = json.loads((INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8"))
        cls.contract = json.loads((INTEGRATION / "panel_contract.json").read_text(encoding="utf-8"))

    def test_approved_router_returns_to_target_scale(self) -> None:
        self.assertIn("width:40%!important", self.source)
        self.assertIn("top:64.5%!important", self.source)
        composition = self.contract["view_patterns"]["overview"]["composition"]
        self.assertEqual(composition["router_asset"], "keenetic-hero-router-v086.webp")
        self.assertEqual(composition["router_scale_mobile_percent"], 40)
        self.assertEqual(composition["router_vertical_percent"], 64.5)

    def test_all_paths_reach_and_pass_behind_the_housing(self) -> None:
        self.assertIn('"M500 210 L500 406"', self.source)
        self.assertIn('"M245 370 L430 370"', self.source)
        self.assertIn('"M570 370 L755 370"', self.source)
        self.assertIn("z-index:6!important", self.source)

    def test_lte_failover_is_not_mislabeled_as_primary_or_failed_reserve(self) -> None:
        self.assertIn("Работа через резерв · 4G LTE", self.source)
        self.assertIn("Основной канал Ethernet недоступен.", self.source)
        self.assertIn('activeRole !== "lte"', self.source)
        self.assertIn("v083-reserve-state warn", self.source)

    def test_current_delivery_is_v088_b050(self) -> None:
        self.assertEqual(self.manifest["panel_version"], "0.8.8")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v088")
        integration_manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(integration_manifest["version"], "1.0.0-b050")


if __name__ == "__main__":
    unittest.main()
