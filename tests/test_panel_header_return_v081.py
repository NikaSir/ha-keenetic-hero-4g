from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v081.js"
BASE_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v080.js"
CONST = INTEGRATION / "const.py"


class PanelHeaderReturnV081Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.base = BASE_SOURCE.read_text(encoding="utf-8")
        cls.const = CONST.read_text(encoding="utf-8")

    def test_current_ui_version_and_component_are_explicit(self) -> None:
        self.assertIn('PANEL_VERSION = "0.8.1"', self.const)
        self.assertIn('const UI_VERSION_V081 = "0.8.1"', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v081"', self.source)
        self.assertIn('<strong>Keenetic Hero 4G+</strong><span>UI v${UI_VERSION_V081}</span>', self.source)

    def test_center_header_is_a_real_return_button(self) -> None:
        self.assertIn('button.id = "return-v081"', self.source)
        self.assertIn('button.type = "button"', self.source)
        self.assertIn("min-height:44px", self.source)
        self.assertIn("border:1px solid var(--divider-color)", self.source)
        self.assertIn("border-radius:16px", self.source)
        self.assertIn("return-v081:active", self.source)
        self.assertIn("grid-column:2;grid-row:1;justify-self:center", self.source)

    def test_return_route_is_source_aware_and_safely_bounded(self) -> None:
        for route in [
            "/dashboard-house",
            "/dashboard-actions",
            "/dashboard-infrastructure",
        ]:
            self.assertIn(route, self.source)
        self.assertIn('const DEFAULT_RETURN_ROUTE_V081 = "/dashboard-infrastructure/overview"', self.source)
        self.assertIn('["return_to", "from"]', self.source)
        self.assertIn('params.get("source")', self.source)
        self.assertIn("document.referrer", self.source)
        self.assertIn("panel?.config?.parent_route", self.source)
        self.assertIn("url.origin !== window.location.origin", self.source)

    def test_navigation_is_explicit_and_never_history_back(self) -> None:
        self.assertIn('history.pushState(null, "", target)', self.source)
        self.assertIn('new Event("location-changed")', self.source)
        self.assertNotIn("history.back", self.source)
        self.assertNotIn("history.go(-1", self.source)

    def test_fixed_side_actions_remain_home_assistant_menu_and_refresh(self) -> None:
        self.assertIn('icon="mdi:menu"', self.base)
        self.assertIn('icon="mdi:refresh"', self.base)
        self.assertIn('new CustomEvent("hass-toggle-menu"', self.base)
        self.assertIn("bubbles: true", self.base)
        self.assertIn("composed: true", self.base)

    def test_return_route_is_not_recomputed_by_telemetry_updates(self) -> None:
        self.assertIn("this._returnRouteV081 = null", self.source)
        self.assertIn("if (!this._returnRouteV081)", self.source)
        self.assertNotIn("set hass", self.source)


if __name__ == "__main__":
    unittest.main()
