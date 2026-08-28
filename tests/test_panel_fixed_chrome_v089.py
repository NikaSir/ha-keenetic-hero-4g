from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v089.js"


class FixedChromeV089Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.manifest = json.loads((INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8"))
        cls.contract = json.loads((INTEGRATION / "panel_contract.json").read_text(encoding="utf-8"))

    def test_lte_card_clears_the_accepted_router_antennas(self) -> None:
        self.assertIn(".v083-overview .v061-lte{top:28.5%!important}", self.source)
        self.assertIn('const d = "M500 190 L500 406"', self.source)
        composition = self.contract["view_patterns"]["overview"]["composition"]
        self.assertEqual(composition["router_scale_mobile_percent"], 40)
        self.assertEqual(composition["lte_card_top_percent"], 28.5)

    def test_native_scroll_cannot_chain_into_home_assistant(self) -> None:
        self.assertIn("viewport.scrollTop <= 0", self.source)
        self.assertIn("viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 1", self.source)
        self.assertIn("event.preventDefault();", self.source)
        self.assertIn(".header-v080,.tabbar-v080{touch-action:none!important}", self.source)
        self.assertIn(":host{overscroll-behavior:none!important}", self.source)
        viewport = self.contract["app_shell"]["viewport_fit"]
        self.assertEqual(viewport["scroll_boundary_guard"], "prevent_default_at_top_and_bottom")
        self.assertEqual(viewport["fixed_chrome_touch_action"], "none")

    def test_current_delivery_is_v090_b052(self) -> None:
        self.assertEqual(self.manifest["panel_version"], "0.9.0")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v090")
        integration_manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(integration_manifest["version"], "1.0.0-b052")


if __name__ == "__main__":
    unittest.main()
