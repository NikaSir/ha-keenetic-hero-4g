from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v100.js"
STANDARD = ROOT / "docs" / "NIKAS_SPECIALIZED_PANEL_UI_STANDARD.md"


class PanelUiStandardV19Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.standard = STANDARD.read_text(encoding="utf-8")
        cls.contract = json.loads(
            (INTEGRATION / "panel_contract.json").read_text(encoding="utf-8")
        )
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_canonical_standard_snapshot_is_v19(self) -> None:
        self.assertIn("NikaS Specialized Panel UI Standard v1.9", self.standard)
        self.assertEqual(self.contract["app_shell"]["version"], "1.9")
        self.assertEqual(
            self.contract["app_shell"]["canonical_sha256"],
            "f02b40c0e16d49ced98f3f099382ede1798837e1d709cb8934787c110455fb9c",
        )
        self.assertEqual(
            self.contract["app_shell"]["navigation_contract_sha256"],
            "c87dc760c0900701f6a807a35aba40e790f68f52c39f4579583598f697997e52",
        )
        self.assertEqual(self.manifest["zoom_policy"]["standard"], "1.9")

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
        self.assertIn("overflow-x:hidden;overflow-y:auto", self.source)
        self.assertIn("touch-action:pan-y", self.source)
        self.assertEqual(self.source.count('id="k100-work"'), 1)
        self.assertEqual(self.source.count('id="k100-stage"'), 1)
        self.assertEqual(self.source.count('id="k100-surface"'), 1)

    def test_header_actions_and_return_plaque_match_reference(self) -> None:
        header = self.contract["app_shell"]["header"]
        self.assertEqual(header["title_px"], 23)
        self.assertEqual(header["subtitle_px"], 14)
        self.assertEqual(header["title_px_narrow"], 21)
        self.assertEqual(header["subtitle_px_narrow"], 13)
        self.assertIn("width:44px;height:44px", self.source)
        self.assertIn("box-shadow:0 7px 20px rgba(23,45,76,.08)", self.source)
        self.assertIn('icon="mdi:menu"', self.source)
        self.assertIn('icon="mdi:refresh"', self.source)
        self.assertIn('new CustomEvent("hass-toggle-menu"', self.source)
        self.assertIn("bubbles: true, composed: true", self.source)
        self.assertIn('id="k100-title" class="k100-title" type="button"', self.source)
        self.assertIn("min-width:min(290px,100%)", self.source)
        self.assertIn(".k100-title:focus-visible", self.source)
        self.assertIn(".k100-title:active", self.source)

    def test_bottom_bar_is_persistent_and_outside_canvas(self) -> None:
        navigation = self.contract["app_shell"]["bottom_navigation"]
        self.assertEqual(navigation["padding_top_px"], 6)
        self.assertEqual(navigation["padding_bottom_px_before_safe_area"], 6)
        self.assertEqual(navigation["item_radius_px"], 16)
        self.assertEqual(navigation["icon_label_gap_px"], 3)
        self.assertIn("calc(6px + var(--safe-bottom))", self.source)
        self.assertIn(".k100-tabs ha-icon{--mdc-icon-size:28px}", self.source)
        self.assertIn("if (!nav.firstElementChild)", self.source)
        self.assertNotIn("nav.innerHTML =", self.source)

    def test_indicator_transport_and_freshness_remain_independent(self) -> None:
        indicator = self.contract["app_shell"]["connection_indicator"]
        self.assertEqual(indicator["surface"], "stable_two_line_status_tinted")
        self.assertEqual(indicator["primary_font_px"], 16)
        self.assertEqual(indicator["secondary_font_px"], 13)
        self.assertEqual(indicator["current_freshness_tone"], "neutral")
        self.assertFalse(indicator["animations"])
        self.assertIn("failedPoll || age > staleAfter", self.source)
        self.assertNotIn("if (failedPoll) {\n    connection", self.source)
        self.assertIn('aria-live="polite"', self.source)
        self.assertIn('"Данные актуальны", tone: "neutral"', self.source)

    def test_typography_envelope_and_current_component(self) -> None:
        typography = self.contract["app_shell"]["typography"]
        self.assertEqual(typography["meaningful_min_px"], 12)
        self.assertEqual(typography["meaningful_max_px"], 25)
        self.assertIn("font-size:23px", self.source)
        self.assertIn("font-size:12px", self.source)
        self.assertIsNone(re.search(r"font-size:(?:[0-9]|1[01])px", self.source))
        self.assertEqual(self.manifest["panel_version"], "1.0.0")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v100")
        self.assertIn('customElements.define("keenetic-hero-app-panel-v100"', self.source)


if __name__ == "__main__":
    unittest.main()
