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
        self.assertEqual(self.standard["ui_version"], "1.0.0")
        self.assertEqual(self.standard["web_component"], "keenetic-hero-app-panel-v100")
        self.assertIn('FRONTEND_UI_VERSION = "1.0.0"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v100"', self.runtime)
        self.assertIn('const K100_VERSION = "1.0.0";', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v100"', self.source)

    def test_center_header_is_a_semantic_return_button(self) -> None:
        self.assertIn('id="k100-title" class="k100-title" type="button"', self.source)
        self.assertIn("<strong>Keenetic Hero 4G+</strong><small>UI v1.0.0</small>", self.source)
        self.assertIn("min-width:min(290px,100%)", self.source)
        self.assertIn("min-height:44px", self.source)
        self.assertIn("border-radius:16px", self.source)
        self.assertIn(".k100-title:focus-visible{outline:2px", self.source)
        self.assertIn(".k100-title:active{", self.source)
        self.assertIn("box-shadow:0 2px 7px rgba(23,45,76,.05)", self.source)

    def test_one_shot_handoff_is_consumed_before_explicit_precedence(self) -> None:
        resolver = self.source[
            self.source.index("function k100Return") : self.source.index("function k100Navigate")
        ]
        self.assertLess(
            resolver.index("const handedOff = k100ConsumeSourceRoute();"),
            resolver.index('for (const key of ["return_to","from"])'),
        )
        consume = self.source[
            self.source.index("function k100ConsumeSourceRoute")
            : self.source.index("function k100Return")
        ]
        self.assertIn('sessionStorage.removeItem("nikas.specialized.source_route.v1")', consume)
        self.assertIn('sessionStorage.removeItem("nikas.specialized.source_route_at.v1")', consume)
        self.assertIn("once!==null&&onceAt!==null", consume)
        self.assertIn("K100_HANDOFF_MAX_AGE_MS = 30_000", self.source)
        self.assertIn("handedOffAge>=0", consume)
        self.assertIn("handedOffAge<=K100_HANDOFF_MAX_AGE_MS", consume)

    def test_routes_are_same_origin_and_normalized_to_canonical_entries(self) -> None:
        for route in [
            "/dashboard-house-v11/home",
            "/dashboard-actions/home",
            "/dashboard-infrastructure/overview",
        ]:
            self.assertIn(route, self.source)
        self.assertIn("url.origin !== window.location.origin", self.source)
        self.assertIn("return canonical;", self.source)
        self.assertNotIn('"/dashboard-house"', self.source)
        self.assertNotIn("/dashboard-starline", self.source)

    def test_navigation_is_explicit_and_never_browser_back(self) -> None:
        self.assertIn('window.history.pushState(null, "", route);', self.source)
        self.assertIn('window.dispatchEvent(new Event("location-changed"));', self.source)
        self.assertNotIn("history.back(", self.bundle)
        self.assertNotIn("history.go(-1", self.bundle)


if __name__ == "__main__":
    unittest.main()
