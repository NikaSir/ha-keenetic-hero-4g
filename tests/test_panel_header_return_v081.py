from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v100.js"
BUNDLE = INTEGRATION / "frontend" / "keenetic-panel-bundle.js"
RUNTIME = INTEGRATION / "panel_runtime.py"
STANDARD = ROOT / ".nikas-ui-standard.json"


class PanelHeaderReturnV19Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.standard = json.loads(STANDARD.read_text(encoding="utf-8"))

    def test_current_ui_and_standard_are_explicit(self) -> None:
        self.assertEqual(self.standard["version"], "1.9")
        self.assertEqual(self.standard["navigation_contract_version"], "1.1")
        self.assertEqual(self.standard["ui_version"], "1.0.4")
        self.assertEqual(self.standard["web_component"], "keenetic-hero-app-panel-v100")
        self.assertIn('FRONTEND_UI_VERSION = "1.0.4"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v100"', self.runtime)
        self.assertIn('const K100_VERSION = "1.0.4";', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v100"', self.source)

    def test_center_header_is_a_semantic_return_button(self) -> None:
        markers = self.standard["header_return"]
        for name in ["button_marker", "version_marker", "focus_marker", "pressed_marker"]:
            self.assertIn(markers[name], self.bundle)
        reference = self.standard["title_plaque_reference"]
        self.assertEqual(reference["implementation"], "S8 OMNI")
        self.assertEqual(reference["min_height_px"], 44)
        self.assertEqual(reference["radius_px"], 16)

    def test_return_route_is_source_aware_and_safely_bounded(self) -> None:
        for route in [
            "/dashboard-house-v11/home",
            "/dashboard-actions/home",
            "/dashboard-infrastructure/overview",
        ]:
            self.assertIn(route, self.source)
        self.assertIn('["return_to","from"]', self.source)
        self.assertIn('sessionStorage.getItem("nikas.specialized.source_route.v1")', self.source)
        self.assertIn('sessionStorage.getItem("nikas.specialized.source_route_at.v1")', self.source)
        self.assertIn("document.referrer", self.source)
        self.assertIn("panel?.config?.parent_route", self.source)
        self.assertIn("url.origin!==window.location.origin", self.source)

    def test_one_shot_handoff_requires_matching_fresh_timestamp(self) -> None:
        self.assertIn('sessionStorage.removeItem("nikas.specialized.source_route.v1")', self.source)
        self.assertIn('sessionStorage.removeItem("nikas.specialized.source_route_at.v1")', self.source)
        self.assertIn("once!==null&&onceAt!==null", self.source)
        self.assertIn("handedOffAge>=0", self.source)
        self.assertIn("handedOffAge<10*60*1000", self.source)
        self.assertIn("this._returnRoute", self.bundle)

    def test_navigation_is_explicit_and_never_browser_back(self) -> None:
        self.assertIn('history.pushState(null,"",route)', self.source)
        self.assertIn('new Event("location-changed")', self.source)
        self.assertNotIn("history.back(", self.bundle)
        self.assertNotIn("history.go(-1", self.bundle)


if __name__ == "__main__":
    unittest.main()
