from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v089.js"
SHELL = INTEGRATION / "frontend" / "nikas-specialized-shell.js"


class FixedChromeV089Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.shell = SHELL.read_text(encoding="utf-8")
        cls.manifest = json.loads((INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8"))
        cls.contract = json.loads((INTEGRATION / "panel_contract.json").read_text(encoding="utf-8"))

    def test_lte_card_clears_the_accepted_router_antennas(self) -> None:
        self.assertIn(".v083-overview .v061-lte{top:28.5%!important}", self.source)
        self.assertIn('const d = "M500 190 L500 406"', self.source)
        composition = self.contract["view_patterns"]["overview"]["composition"]
        self.assertEqual(composition["router_scale_mobile_percent"], 40)
        self.assertEqual(composition["lte_card_top_percent"], 28.5)

    def test_native_scroll_cannot_chain_into_home_assistant(self) -> None:
        self.assertIn("shouldBlockNikasShellBoundaryMove", self.shell)
        self.assertIn("currentScroll <= 1", self.shell)
        self.assertIn("currentScroll >= maximumScroll - 1", self.shell)
        self.assertIn('host.addEventListener("touchmove", moveTouch, { passive: false, capture: true })', self.shell)
        self.assertIn("if (touch.blocked && event.cancelable)", self.shell)
        viewport = self.contract["app_shell"]["viewport_fit"]
        self.assertEqual(viewport["scroll_boundary_guard"], "capture_non_passive_host_boundary_guard")
        self.assertEqual(viewport["fixed_chrome_touch_action"], "host_boundary_guard")

    def test_current_delivery_is_v100_b052(self) -> None:
        self.assertEqual(self.manifest["panel_version"], "1.0.7")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v100")
        integration_manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(integration_manifest["version"], "1.0.0-b060")


if __name__ == "__main__":
    unittest.main()
