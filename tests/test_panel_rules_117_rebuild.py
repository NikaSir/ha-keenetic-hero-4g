from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
DELIVERY = INTEGRATION / "frontend" / "keenetic-app-v100.js"
BUNDLE = INTEGRATION / "frontend" / "keenetic-panel-bundle.js"
RUNTIME = INTEGRATION / "panel_runtime.py"
STANDARD = ROOT / ".nikas-ui-standard.json"


class PanelRulesV19RebuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.delivery = DELIVERY.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.standard = json.loads(STANDARD.read_text(encoding="utf-8"))
        cls.contract = json.loads((INTEGRATION / "panel_contract.json").read_text(encoding="utf-8"))
        cls.panel_manifest = json.loads((INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8"))
        cls.integration_manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))

    def test_v19_rebuild_versions_are_synchronized(self) -> None:
        self.assertEqual(self.standard["version"], "1.9")
        self.assertEqual(self.standard["navigation_contract_version"], "1.1")
        self.assertEqual(self.contract["panel"]["version"], "1.0.0")
        self.assertEqual(self.contract["app_shell"]["version"], "1.9")
        self.assertEqual(self.contract["panel"]["navigation_contract_version"], "1.1")
        self.assertEqual(self.panel_manifest["panel_version"], "1.0.0")
        self.assertEqual(self.panel_manifest["zoom_policy"]["standard"], "1.9")
        self.assertEqual(self.integration_manifest["version"], "1.0.0-b052")
        self.assertIn('FRONTEND_UI_VERSION = "1.0.0"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v100"', self.runtime)

    def test_header_return_precedence_is_explicit_and_captured_once(self) -> None:
        resolver = self.delivery[
            self.delivery.index("function k100Return") : self.delivery.index("function k100Navigate")
        ]
        self.assertLess(
            resolver.index("const handedOff = k100ConsumeSourceRoute();"),
            resolver.index('for (const key of ["return_to","from"])'),
        )
        self.assertIn('sessionStorage.getItem("nikas.specialized.source_route.v1")', self.delivery)
        self.assertIn('sessionStorage.getItem("nikas.specialized.source_route_at.v1")', self.delivery)
        self.assertIn("document.referrer", self.delivery)
        self.assertIn("panel?.config?.parent_route", self.delivery)
        self.assertIn("if (this._returnRoute) return", self.delivery)
        self.assertIn("K100_HANDOFF_MAX_AGE_MS = 30_000", self.delivery)
        self.assertNotIn("history.back(", self.bundle)

    def test_only_canonical_base_destinations_are_accepted(self) -> None:
        header = self.contract["app_shell"]["header"]
        self.assertEqual(
            header["return_sources"],
            [
                "/dashboard-house-v11/home",
                "/dashboard-actions/home",
                "/dashboard-infrastructure/overview",
            ],
        )
        for route in header["return_sources"]:
            self.assertIn(route, self.delivery)
        self.assertNotIn('"/dashboard-house"', self.delivery)
        self.assertNotIn("/dashboard-starline", self.delivery)
        self.assertIn("url.origin !== window.location.origin", self.delivery)
        self.assertIn("return canonical;", self.delivery)

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

    def test_fixed_shell_exists_before_live_telemetry(self) -> None:
        self.assertIn('id="k100-shell"', self.delivery)
        self.assertIn('class="k100-header"', self.delivery)
        self.assertIn('id="k100-work"', self.delivery)
        self.assertIn('id="k100-tabs"', self.delivery)
        connected = self.delivery[
            self.delivery.index("connectedCallback()") : self.delivery.index("disconnectedCallback()")
        ]
        self.assertLess(connected.index("this._mountShell();"), connected.index("this._mountChild();"))


if __name__ == "__main__":
    unittest.main()
