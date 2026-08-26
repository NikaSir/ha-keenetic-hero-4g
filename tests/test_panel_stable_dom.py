from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v075.js"
BUNDLE = INTEGRATION / "frontend" / "keenetic-panel-bundle.js"


class PanelStableDomTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.contract = json.loads(
            (INTEGRATION / "panel_contract.json").read_text(encoding="utf-8")
        )
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_all_view_containers_are_mounted_once_and_only_toggled(self) -> None:
        self.assertIn("STABLE_VIEWS_V075", self.source)
        self.assertIn("this._stableSlotsV075 = new Map()", self.source)
        self.assertIn("slot.hidden = !active", self.source)
        self.assertIn("slot.inert = !active", self.source)
        self.assertIn('slot.classList.toggle("v075-active-view", active)', self.source)
        self.assertNotIn("replaceChildren", self.source)

    def test_live_update_path_is_point_patch_only(self) -> None:
        start = self.source.index("_patchStableDomV075 = function")
        end = self.source.index("_scheduleRender = function", start)
        live_path = self.source[start:end]
        self.assertIn("patchSlotV075", live_path)
        self.assertNotIn("innerHTML", live_path)
        self.assertNotIn("append(", live_path)
        self.assertNotIn("remove(", live_path)

    def test_hass_updates_are_batched_by_animation_frame(self) -> None:
        self.assertIn("window.requestAnimationFrame(() =>", self.source)
        self.assertIn("if (this._renderQueuedV075) return", self.source)
        setter = self.source[self.source.rindex("set(value) {") :]
        self.assertIn("this._hass = value", setter)
        self.assertIn("this._scheduleRender()", setter)

    def test_images_and_handlers_are_not_reassigned_unchanged(self) -> None:
        self.assertIn('current.getAttribute("src") !== nextSrc', self.source)
        self.assertIn(":not([data-stable-bound-v075])", self.source)
        self.assertIn("image.decode?.()", self.source)
        self.assertIn("this._stablePanelSentV075 !== this._panel", self.source)
        self.assertIn("this._stableRouteSentV075 !== this._route", self.source)

    def test_optional_indicator_is_explicitly_disabled(self) -> None:
        indicator = self.contract["app_shell"]["connection_indicator"]
        self.assertFalse(indicator["enabled"])
        self.assertFalse(indicator["enabled_by_request"])
        self.assertEqual(indicator["policy"], "explicit_request_only")
        self.assertIn("removeOptionalIndicatorV075", self.source)
        self.assertIn(".v050-online-pill,.v050-fresh-pill{display:none!important}", self.source)
        self.assertNotIn("indicatorCategoryV075", self.source)
        self.assertNotIn('label: "Онлайн"', self.bundle)
        self.assertIn('label: "Доступен"', self.bundle)

    def test_v16_header_and_typography_contract(self) -> None:
        header = self.contract["app_shell"]["header"]
        typography = self.contract["app_shell"]["typography"]
        self.assertEqual((header["title_px"], header["subtitle_px"]), (23, 14))
        self.assertEqual((header["title_px_narrow"], header["subtitle_px_narrow"]), (21, 13))
        self.assertEqual(typography["meaningful_minimum_px"], 12)
        self.assertEqual(typography["maximum_px"], 25)
        self.assertIn(".nika-header .title strong{font-size:23px!important", self.source)
        self.assertIn(".nika-header .title span{font-size:14px!important", self.source)
        self.assertIn(".hero-value,.v050-status-copy h1{font-size:25px!important}", self.source)

    def test_delivery_contract_selects_stable_component(self) -> None:
        updates = self.contract["app_shell"]["stable_updates"]
        self.assertEqual(updates["hass_update"], "point_patch")
        self.assertFalse(updates["shadow_root_inner_html_after_mount"])
        self.assertFalse(updates["replace_children_after_mount"])
        self.assertTrue(updates["persistent_view_containers"])
        self.assertEqual(self.manifest["panel_version"], "0.7.5")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v075")


if __name__ == "__main__":
    unittest.main()
