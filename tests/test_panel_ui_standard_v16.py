from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v080.js"
CURRENT_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v084.js"
INDICATOR_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v076.js"
STANDARD = ROOT / "docs" / "NIKAS_SPECIALIZED_PANEL_UI_STANDARD.md"
MENU_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v045.js"


class PanelUiStandardV16Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.current_source = CURRENT_SOURCE.read_text(encoding="utf-8")
        cls.indicator_source = INDICATOR_SOURCE.read_text(encoding="utf-8")
        cls.standard = STANDARD.read_text(encoding="utf-8")
        cls.menu_source = MENU_SOURCE.read_text(encoding="utf-8")
        cls.contract = json.loads(
            (INTEGRATION / "panel_contract.json").read_text(encoding="utf-8")
        )
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_canonical_standard_snapshot_is_v17(self) -> None:
        self.assertIn("NikaS Specialized Panel UI Standard v1.7", self.standard)
        self.assertEqual(self.contract["app_shell"]["version"], "1.7")
        self.assertEqual(
            self.contract["app_shell"]["canonical_sha256"],
            "22c0cec7fa61b8210fc40e3f053242335f8e502984cbb8a4fb93c33a93bd3706",
        )
        self.assertEqual(self.manifest["zoom_policy"]["standard"], "1.7")

    def test_phone_shell_owns_the_only_scroll_viewport(self) -> None:
        viewport = self.contract["app_shell"]["viewport_fit"]
        self.assertTrue(viewport["height_locked_phone_shell"])
        self.assertEqual(viewport["host_position"], "normal_home_assistant_panel_flow")
        self.assertFalse(viewport["fixed_host_override"])
        self.assertFalse(viewport["outer_home_assistant_scroll"])
        self.assertFalse(viewport["scroll_chaining_to_outer_document"])
        self.assertIn("height:100dvh", self.source)
        self.assertIn("grid-template-rows:auto minmax(0,1fr) auto", self.source)
        self.assertIn("overscroll-behavior-y:none", self.source)
        self.assertIn("#zoom-surface-v080{position:relative", self.source)
        self.assertNotIn(":host{position:fixed!important;inset:0!important", self.source)
        self.assertIn("overflow-x:hidden;overflow-y:auto", self.source)
        self.assertIn("touch-action:pan-y", self.source)

    def test_header_actions_match_reference_plaques(self) -> None:
        header = self.contract["app_shell"]["header"]
        self.assertEqual(header["title_px"], 23)
        self.assertEqual(header["subtitle_px"], 14)
        self.assertEqual(header["title_px_narrow"], 21)
        self.assertEqual(header["subtitle_px_narrow"], 13)
        self.assertIn("width:44px;height:44px", self.source)
        self.assertIn("border-radius:16px", self.source)
        self.assertIn("box-shadow:0 7px 20px rgba(23,45,76,.08)", self.source)
        self.assertIn('icon="mdi:menu"', self.source)
        self.assertIn('icon="mdi:refresh"', self.source)
        self.assertIn('new CustomEvent("hass-toggle-menu"', self.source)
        self.assertIn("bubbles: true", self.source)
        self.assertIn("composed: true", self.source)

    def test_bottom_bar_uses_v16_geometry_outside_canvas(self) -> None:
        navigation = self.contract["app_shell"]["bottom_navigation"]
        self.assertEqual(navigation["padding_top_px"], 6)
        self.assertEqual(navigation["padding_bottom_px_before_safe_area"], 6)
        self.assertEqual(navigation["item_radius_px"], 16)
        self.assertEqual(navigation["icon_label_gap_px"], 3)
        self.assertIn("calc(6px + var(--safe-bottom))", self.source)
        self.assertIn("--safe-bottom:var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))", self.source)
        self.assertIn(".tabbar-v080 ha-icon{--mdc-icon-size:28px}", self.source)

    def test_indicator_is_stable_two_line_tinted_surface(self) -> None:
        indicator = self.contract["app_shell"]["connection_indicator"]
        self.assertEqual(indicator["surface"], "stable_two_line_status_tinted")
        self.assertEqual(indicator["primary_font_px"], 16)
        self.assertEqual(indicator["secondary_font_px"], 13)
        self.assertEqual(indicator["current_freshness_tone"], "neutral")
        self.assertFalse(indicator["animations"])
        self.assertIn("failedPoll || age > staleAfter", self.indicator_source)
        self.assertNotIn("if (failedPoll) connection", self.indicator_source)
        self.assertIn("telemetryCategoryV076", self.indicator_source)
        self.assertIn("aria-live", self.indicator_source)

    def test_typography_envelope_and_current_component(self) -> None:
        typography = self.contract["app_shell"]["typography"]
        self.assertEqual(typography["meaningful_min_px"], 12)
        self.assertEqual(typography["meaningful_max_px"], 25)
        self.assertIn("font-size:23px", self.source)
        self.assertIn("font-size:12px", self.source)
        self.assertIsNone(re.search(r"font-size:(?:[0-9]|1[01])px", self.source))
        self.assertEqual(self.manifest["panel_version"], "0.8.4")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v084")
        self.assertIn('customElements.define("keenetic-hero-app-panel-v084"', self.current_source)
        self.assertIn('version.textContent !== `UI v${UI_VERSION_V084}`', self.current_source)


if __name__ == "__main__":
    unittest.main()
