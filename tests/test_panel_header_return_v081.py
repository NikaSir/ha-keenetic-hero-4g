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


class PanelHeaderReturnV22Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.standard = json.loads(STANDARD.read_text(encoding="utf-8"))

    def test_current_ui_and_standard_are_explicit(self) -> None:
        self.assertEqual(self.standard["version"], "2.2")
        self.assertEqual(self.standard["navigation_contract_version"], "1.2")
        self.assertEqual(self.standard["ui_version"], "1.0.6")
        self.assertEqual(self.standard["web_component"], "keenetic-hero-app-panel-v100")
        self.assertIn('FRONTEND_UI_VERSION = "1.0.6"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v100"', self.runtime)
        self.assertIn('const K100_VERSION = "1.0.6";', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v100"', self.source)

    def test_center_header_is_a_semantic_return_button(self) -> None:
        markers = self.standard["header_return"]
        for name in ["button_marker", "version_marker", "focus_marker", "pressed_marker"]:
            self.assertIn(markers[name], self.bundle)
        reference = self.standard["title_plaque_reference"]
        self.assertEqual(reference["implementation"], "S8 OMNI")
        self.assertEqual(reference["height_px"], 52)
        self.assertEqual(reference["width"], "min(360px,100%)")
        self.assertEqual(reference["radius_px"], 16)

    def test_return_route_is_source_aware_and_safely_bounded(self) -> None:
        for route in [
            "/dashboard-house-v13/home",
            "/dashboard-rooms-v11/rooms",
            "/dashboard-actions/home",
            "/dashboard-infrastructure/overview",
        ]:
            self.assertIn(route, self.bundle)
        self.assertIn('...params.getAll("return_to")', self.bundle)
        self.assertIn('...params.getAll("from")', self.bundle)
        self.assertIn('window.sessionStorage.getItem(NIKAS_SOURCE_ROUTE_KEY)', self.bundle)
        self.assertIn('window.sessionStorage.getItem(NIKAS_SOURCE_ROUTE_AT_KEY)', self.bundle)
        self.assertIn("document.referrer", self.bundle)
        self.assertIn("parentRoute", self.bundle)
        self.assertIn("url.origin !== window.location.origin", self.bundle)

    def test_one_shot_handoff_requires_matching_fresh_timestamp(self) -> None:
        self.assertIn("window.sessionStorage.removeItem(NIKAS_SOURCE_ROUTE_KEY)", self.bundle)
        self.assertIn("window.sessionStorage.removeItem(NIKAS_SOURCE_ROUTE_AT_KEY)", self.bundle)
        self.assertIn("if (!route || !timestamp) return null", self.bundle)
        self.assertIn("age < 0 || age > NIKAS_SOURCE_ROUTE_MAX_AGE_MS", self.bundle)
        self.assertIn("NIKAS_SOURCE_ROUTE_MAX_AGE_MS = 30_000", self.bundle)
        self.assertIn("this._returnRoute", self.bundle)

    def test_navigation_is_explicit_and_never_browser_back(self) -> None:
        self.assertIn('window.history.pushState(null, "", destination)', self.bundle)
        self.assertIn('new Event("location-changed")', self.bundle)
        self.assertNotIn("history.back(", self.bundle)
        self.assertNotIn("history.go(-1", self.bundle)


if __name__ == "__main__":
    unittest.main()
