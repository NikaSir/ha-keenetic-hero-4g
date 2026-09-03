from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
DELIVERY = INTEGRATION / "frontend" / "keenetic-app-v100.js"
SHELL = INTEGRATION / "frontend" / "keenetic-app-v080.js"
SOURCE_KIT = INTEGRATION / "frontend" / "nikas-specialized-shell.js"
BUNDLE = INTEGRATION / "frontend" / "keenetic-panel-bundle.js"
RUNTIME = INTEGRATION / "panel_runtime.py"
STANDARD = ROOT / ".nikas-ui-standard.json"


class PanelRulesV22RebuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.delivery = DELIVERY.read_text(encoding="utf-8")
        cls.shell = SHELL.read_text(encoding="utf-8")
        cls.source_kit = SOURCE_KIT.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.standard = json.loads(STANDARD.read_text(encoding="utf-8"))
        cls.contract = json.loads((INTEGRATION / "panel_contract.json").read_text(encoding="utf-8"))
        cls.panel_manifest = json.loads((INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8"))
        cls.integration_manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))

    def test_v22_rebuild_versions_are_synchronized(self) -> None:
        self.assertEqual(self.standard["version"], "2.2")
        self.assertEqual(self.standard["navigation_contract_version"], "1.2")
        self.assertEqual(self.contract["panel"]["version"], "1.0.7")
        self.assertEqual(self.contract["app_shell"]["version"], "2.2")
        self.assertEqual(self.contract["panel"]["navigation_contract_version"], "1.2")
        self.assertEqual(self.panel_manifest["panel_version"], "1.0.7")
        self.assertEqual(self.panel_manifest["zoom_policy"]["standard"], "2.2")
        self.assertEqual(self.integration_manifest["version"], "1.0.0-b060")
        self.assertIn('FRONTEND_UI_VERSION = "1.0.7"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v100"', self.runtime)

    def test_header_return_precedence_is_explicit_and_captured_once(self) -> None:
        self.assertIn('...params.getAll("return_to")', self.source_kit)
        self.assertIn('...params.getAll("from")', self.source_kit)
        self.assertIn("window.sessionStorage.getItem(NIKAS_SOURCE_ROUTE_KEY)", self.source_kit)
        self.assertIn("window.sessionStorage.getItem(NIKAS_SOURCE_ROUTE_AT_KEY)", self.source_kit)
        self.assertIn("document.referrer", self.source_kit)
        self.assertIn("v?.config?.parent_route", self.delivery)
        self.assertIn("this._returnRoute", self.delivery)
        self.assertIn("if (!route || !timestamp) return null", self.source_kit)
        self.assertIn("age < 0 || age > NIKAS_SOURCE_ROUTE_MAX_AGE_MS", self.source_kit)
        self.assertNotIn("history.back(", self.bundle)

    def test_only_canonical_base_destinations_are_accepted(self) -> None:
        header = self.contract["app_shell"]["header"]
        self.assertEqual(
            header["return_sources"],
            [
                "/dashboard-house-v13/home",
                "/dashboard-rooms-v11/rooms",
                "/dashboard-actions/home",
                "/dashboard-infrastructure/overview",
            ],
        )
        for route in header["return_sources"]:
            self.assertIn(route, self.source_kit)
        self.assertNotIn('"/dashboard-house"', self.source_kit)
        self.assertNotIn("/dashboard-starline", self.source_kit)
        self.assertIn("url.origin !== window.location.origin", self.source_kit)

    def test_production_bundle_contains_the_current_component_without_runtime_imports(self) -> None:
        self.assertIn(
            "// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js",
            self.bundle,
        )
        self.assertIn('customElements.define("keenetic-hero-app-panel-v100"', self.bundle)
        self.assertNotIn('await import("./keenetic-app-v084.js")', self.bundle)
        self.assertEqual(self.panel_manifest["web_component"], "keenetic-hero-app-panel-v100")
        self.assertEqual(
            self.contract["frontend_delivery"]["web_component"],
            "keenetic-hero-app-panel-v100",
        )

    def test_fixed_loading_shell_exists_before_live_telemetry(self) -> None:
        self.assertIn('id="app-shell-v080"', self.shell)
        self.assertIn('class="header-v080"', self.shell)
        self.assertIn('id="work-viewport-v080"', self.shell)
        self.assertIn('id="tabbar-v080"', self.shell)
        connected = self.shell[
            self.shell.index("connectedCallback()") : self.shell.index("disconnectedCallback()")
        ]
        self.assertLess(connected.index("this._mountShell();"), connected.index("this._mountChild();"))


if __name__ == "__main__":
    unittest.main()
