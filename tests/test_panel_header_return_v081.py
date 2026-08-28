from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v081.js"
CURRENT_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v085.js"
DELIVERY_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v090.js"
BASE_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v080.js"
RUNTIME = INTEGRATION / "panel_runtime.py"

# Keep this contract test outside the frontend bundle inputs so repository
# validation can run against the final generated bundle commit without a rebuild loop.


class PanelHeaderReturnV081Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.current = CURRENT_SOURCE.read_text(encoding="utf-8")
        cls.delivery = DELIVERY_SOURCE.read_text(encoding="utf-8")
        cls.base = BASE_SOURCE.read_text(encoding="utf-8")
        cls.runtime = RUNTIME.read_text(encoding="utf-8")

    def test_current_ui_version_and_component_are_explicit(self) -> None:
        self.assertIn('FRONTEND_UI_VERSION = "0.9.0"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v090"', self.runtime)
        self.assertIn('const UI_VERSION_V081 = "0.8.3"', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v081"', self.source)
        self.assertIn('const UI_VERSION_V085 = "0.8.5"', self.current)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v085"', self.current)
        self.assertIn('getElementById("return-v081")', self.current)
        self.assertIn('version.textContent !== `UI v${UI_VERSION_V085}`', self.current)
        self.assertIn('const UI_VERSION_V090 = "0.9.0"', self.delivery)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v090"', self.delivery)

    def test_center_header_is_a_real_return_button(self) -> None:
        self.assertIn('button.id = "return-v081"', self.source)
        self.assertIn('button.type = "button"', self.source)
        self.assertIn("min-width:min(290px,100%);max-width:100%;min-height:44px", self.source)
        self.assertIn(
            "border:1px solid color-mix(in srgb,var(--primary-color,#03a9d9) 24%,var(--divider-color,#dfe3e8))",
            self.source,
        )
        self.assertIn(
            "background:color-mix(in srgb,var(--primary-color,#03a9d9) 5%,var(--card-background-color,#fff))",
            self.source,
        )
        self.assertIn("box-shadow:0 5px 16px rgba(23,45,76,.06)", self.source)
        self.assertIn("border-radius:16px", self.source)
        self.assertIn(".return-v081:focus-visible{outline:2px", self.source)
        self.assertIn("return-v081:active", self.source)
        self.assertIn(
            "background:color-mix(in srgb,var(--primary-color,#03a9d9) 13%,var(--card-background-color,#fff))",
            self.source,
        )
        self.assertIn(
            "border-color:color-mix(in srgb,var(--primary-color,#03a9d9) 42%,var(--divider-color,#dfe3e8))",
            self.source,
        )
        self.assertIn("grid-column:2;grid-row:1;justify-self:center", self.source)
        self.assertIn('extends CURRENT_SHELL_BASE_V085', self.current)
        self.assertIn('extends CURRENT_SHELL_BASE_V090', self.delivery)

    def test_return_route_is_source_aware_and_safely_bounded(self) -> None:
        for route in [
            "/dashboard-house-v11/home",
            "/dashboard-actions/home",
            "/dashboard-infrastructure/overview",
        ]:
            self.assertIn(route, self.current)
        self.assertIn('const DEFAULT_RETURN_ROUTE_V085 = "/dashboard-infrastructure/overview"', self.current)
        self.assertIn('for (const key of ["return_to", "from"])', self.current)
        self.assertIn("consumeSourceRouteV085()", self.current)
        self.assertIn("savedReturnRouteV085()", self.current)
        self.assertIn("document.referrer", self.current)
        self.assertIn("panel?.config?.parent_route", self.current)
        self.assertIn("url.origin !== window.location.origin", self.current)
        self.assertNotIn('params.get("source")', self.current)
        self.assertNotIn("window.history.state", self.current)

    def test_navigation_is_explicit_and_never_history_back(self) -> None:
        self.assertIn('history.pushState(null, "", target)', self.source)
        self.assertIn('new Event("location-changed")', self.source)
        self.assertNotIn("history.back", self.source)
        self.assertNotIn("history.go(-1", self.source)
        self.assertNotIn("history.back", self.current)
        self.assertNotIn("history.go(-1", self.current)

    def test_fixed_side_actions_remain_home_assistant_menu_and_refresh(self) -> None:
        self.assertIn('icon="mdi:menu"', self.base)
        self.assertIn('icon="mdi:refresh"', self.base)
        self.assertIn('new CustomEvent("hass-toggle-menu"', self.base)
        self.assertIn("bubbles: true", self.base)
        self.assertIn("composed: true", self.base)
        self.assertIn("border:1px solid var(--divider-color)", self.base)
        self.assertIn("box-shadow:0 7px 20px rgba(23,45,76,.08)", self.base)

    def test_return_route_is_not_recomputed_by_telemetry_updates(self) -> None:
        self.assertIn("this._returnRouteV085 = null", self.current)
        self.assertIn("if (!this._returnRouteV085)", self.current)
        self.assertIn("this._returnRouteV081 = this._returnRouteV085", self.current)
        self.assertNotIn("set hass", self.current)

    def test_one_shot_handoff_and_saved_route_follow_rule_117(self) -> None:
        self.assertIn('sessionStorage.getItem(SOURCE_ROUTE_KEY_V085)', self.current)
        self.assertIn('sessionStorage.removeItem(SOURCE_ROUTE_KEY_V085)', self.current)
        self.assertIn('sessionStorage.removeItem(SOURCE_ROUTE_AT_KEY_V085)', self.current)
        self.assertIn('value === null || timestampValue === null', self.current)
        self.assertIn('age < 0', self.current)
        self.assertIn('localStorage.setItem(RETURN_ROUTE_KEY_V085, route)', self.current)
        self.assertIn('localStorage.getItem(RETURN_ROUTE_KEY_V085)', self.current)
        self.assertIn("SOURCE_ROUTE_MAX_AGE_MS_V085 = 30_000", self.current)


if __name__ == "__main__":
    unittest.main()
