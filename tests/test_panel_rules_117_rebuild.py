from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
CURRENT = INTEGRATION / "frontend" / "keenetic-app-v085.js"
DELIVERY = INTEGRATION / "frontend" / "keenetic-app-v088.js"
SHELL = INTEGRATION / "frontend" / "keenetic-app-v080.js"
BUNDLE = INTEGRATION / "frontend" / "keenetic-panel-bundle.js"
RUNTIME = INTEGRATION / "panel_runtime.py"


class PanelRules117RebuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.current = CURRENT.read_text(encoding="utf-8")
        cls.delivery = DELIVERY.read_text(encoding="utf-8")
        cls.shell = SHELL.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.contract = json.loads((INTEGRATION / "panel_contract.json").read_text(encoding="utf-8"))
        cls.panel_manifest = json.loads((INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8"))
        cls.integration_manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))

    def test_rule_117_rebuild_versions_are_synchronized(self) -> None:
        self.assertEqual(self.contract["panel"]["version"], "0.8.8")
        self.assertEqual(self.contract["app_shell"]["version"], "1.9")
        self.assertEqual(self.panel_manifest["panel_version"], "0.8.8")
        self.assertEqual(self.panel_manifest["zoom_policy"]["standard"], "1.9")
        self.assertEqual(self.integration_manifest["version"], "1.0.0-b050")
        self.assertIn('FRONTEND_UI_VERSION = "0.8.8"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v088"', self.runtime)

    def test_header_return_precedence_is_exact_and_captured_once(self) -> None:
        markers = [
            "const handedOff = consumeSourceRouteV085()",
            'for (const key of ["return_to", "from"])',
            "if (handedOff)",
            "const saved = savedReturnRouteV085()",
            "normalizeReturnRouteV085(document.referrer)",
            "normalizeReturnRouteV085(panel?.config?.parent_route)",
            "persistReturnRouteV085(DEFAULT_RETURN_ROUTE_V085)",
        ]
        positions = [self.current.index(marker) for marker in markers]
        self.assertEqual(positions, sorted(positions))
        self.assertIn("if (!this._returnRouteV085)", self.current)
        self.assertNotIn("set hass", self.current)

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
        self.assertNotIn('"/dashboard-house"', self.current)
        self.assertNotIn("/dashboard-starline", self.current)
        self.assertNotIn('params.get("source")', self.current)
        self.assertNotIn("window.history.state", self.current)
        self.assertIn('candidate.startsWith("//")', self.current)
        self.assertIn('!candidate.startsWith("/") && !hasScheme', self.current)

    def test_production_bundle_contains_the_current_component_without_imports(self) -> None:
        self.assertIn(
            "// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v088.js",
            self.bundle,
        )
        self.assertIn('customElements.define("keenetic-hero-app-panel-v088"', self.bundle)
        self.assertNotIn('await import("./keenetic-app-v084.js")', self.bundle)
        self.assertEqual(self.panel_manifest["web_component"], "keenetic-hero-app-panel-v088")
        self.assertEqual(
            self.contract["frontend_delivery"]["web_component"],
            "keenetic-hero-app-panel-v088",
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
