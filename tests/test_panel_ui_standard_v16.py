from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
CURRENT_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v100.js"
SHELL_SOURCE = INTEGRATION / "frontend" / "nikas-specialized-shell.js"
INDICATOR_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v076.js"
STANDARD = ROOT / "docs" / "NIKAS_SPECIALIZED_PANEL_UI_STANDARD.md"


class PanelUiStandardV22Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.current_source = CURRENT_SOURCE.read_text(encoding="utf-8")
        cls.shell_source = SHELL_SOURCE.read_text(encoding="utf-8")
        cls.indicator_source = INDICATOR_SOURCE.read_text(encoding="utf-8")
        cls.standard = STANDARD.read_text(encoding="utf-8")
        cls.contract = json.loads(
            (INTEGRATION / "panel_contract.json").read_text(encoding="utf-8")
        )
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_canonical_standard_snapshot_is_v22(self) -> None:
        self.assertIn("NikaS Specialized Panel UI Standard v2.2", self.standard)
        self.assertEqual(self.contract["app_shell"]["version"], "2.2")
        self.assertEqual(
            self.contract["app_shell"]["canonical_sha256"],
            "3b6cc750b08aa0d2a375d1430ea04ac68c90525a527d197b014abd96728d23d1",
        )
        self.assertEqual(
            self.contract["app_shell"]["navigation_contract_sha256"],
            "d495eca80345b96976c168029a96146803f3d8195b6f6fc723827b601ffb578e",
        )
        self.assertEqual(self.manifest["zoom_policy"]["standard"], "2.2")

    def test_phone_shell_owns_the_only_scroll_viewport(self) -> None:
        viewport = self.contract["app_shell"]["viewport_fit"]
        self.assertTrue(viewport["height_locked_phone_shell"])
        self.assertEqual(viewport["host_position"], "home_assistant_panel_host_boundary")
        self.assertFalse(viewport["fixed_host_override"])
        self.assertFalse(viewport["outer_home_assistant_scroll"])
        self.assertFalse(viewport["scroll_chaining_to_outer_document"])
        self.assertIn(":host{", self.shell_source)
        self.assertIn("inline-size:100%;block-size:100%", self.shell_source)
        self.assertNotIn("100vh", self.shell_source)
        self.assertNotIn("100dvh", self.shell_source)
        self.assertIn("grid-template-rows:calc(60px + env(safe-area-inset-top,0px))", self.shell_source)
        self.assertIn("calc(64px + env(safe-area-inset-bottom,0px))", self.shell_source)
        self.assertIn("overscroll-behavior-y:none", self.shell_source)
        self.assertIn(".nikas-shell__canvas{inline-size:100%", self.shell_source)
        self.assertNotIn("position:fixed", self.shell_source)
        self.assertIn("overflow-y:auto;overflow-x:hidden", self.shell_source)
        self.assertIn("touch-action:pan-y", self.shell_source)
        self.assertEqual(self.current_source.count('id="k100-work"'), 1)

    def test_header_actions_match_reference_plaques(self) -> None:
        header = self.contract["app_shell"]["header"]
        self.assertEqual(header["title_px"], 23)
        self.assertEqual(header["subtitle_px"], 14)
        self.assertEqual(header["title_px_narrow"], 21)
        self.assertEqual(header["subtitle_px_narrow"], 13)
        self.assertIn("inline-size:44px;block-size:44px", self.shell_source)
        self.assertIn("border-radius:16px", self.shell_source)
        self.assertIn("box-shadow:0 7px 20px rgba(23,45,76,.08)", self.shell_source)
        self.assertIn('icon="mdi:menu"', self.current_source)
        self.assertIn('icon="mdi:refresh"', self.current_source)
        self.assertIn('new CustomEvent("hass-toggle-menu"', self.current_source)
        self.assertIn("bubbles:true", self.current_source)
        self.assertIn("composed:true", self.current_source)

    def test_bottom_bar_uses_v16_geometry_outside_canvas(self) -> None:
        navigation = self.contract["app_shell"]["bottom_navigation"]
        self.assertEqual(navigation["padding_top_px"], 6)
        self.assertEqual(navigation["padding_bottom_px_before_safe_area"], 6)
        self.assertEqual(navigation["item_radius_px"], 16)
        self.assertEqual(navigation["icon_label_gap_px"], 1)
        self.assertEqual(navigation["icon_px"], 26)
        self.assertTrue(navigation["active_full_cell_fill"])
        self.assertIn("calc(6px + env(safe-area-inset-bottom,0px))", self.shell_source)
        self.assertIn(".nikas-shell__tab ha-icon{--mdc-icon-size:26px", self.shell_source)
        self.assertIn("line-height:14px", self.shell_source)

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
        self.assertIn("font-size:23px", self.shell_source)
        self.assertIn("font-size:12px", self.shell_source)
        self.assertIsNone(re.search(r"font-size:(?:[0-9]|1[01])px", self.shell_source))
        self.assertEqual(self.manifest["panel_version"], "1.0.6")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v100")
        self.assertIn('const K100_VERSION = "1.0.6";', self.current_source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v100"', self.current_source)
        self.assertIn("<small>UI v1.0.6</small>", self.current_source)


if __name__ == "__main__":
    unittest.main()
