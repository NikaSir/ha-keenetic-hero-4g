from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v075.js"
STANDARD_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v076.js"
PANEL_SOURCE = INTEGRATION / "panel.py"


class PanelStableDomTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.standard_source = STANDARD_SOURCE.read_text(encoding="utf-8")
        cls.panel_source = PANEL_SOURCE.read_text(encoding="utf-8")
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

    def test_new_views_are_lazily_created_once_and_then_cached(self) -> None:
        self.assertIn("function ensureStableViewV076", self.standard_source)
        self.assertIn("panel._stableSlotsV075?.has(view)", self.standard_source)
        self.assertIn("panel._stableSlotsV075.set(view, slot)", self.standard_source)

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

    def test_indicator_uses_semantic_categories_not_exact_age(self) -> None:
        self.assertIn('"Локально"', self.source)
        self.assertIn('"Облако"', self.source)
        self.assertIn('"Резерв"', self.source)
        self.assertIn('"Нет связи"', self.source)
        self.assertIn('"Данные актуальны"', self.source)
        self.assertIn('"Данные устарели"', self.source)
        self.assertIn("scanInterval * 3", self.source)
        self.assertIn("failed || age > staleAfter", self.source)
        self.assertIn("telemetryCategoryV075", self.source)
        self.assertNotIn("Math.round(telemetry.age)", self.source)

    def test_bootstrap_exposes_factual_local_transport_availability(self) -> None:
        self.assertIn('"connection_available": bool(coordinator.last_update_success)', self.panel_source)
        self.assertIn('"data_channel": "local"', self.panel_source)
        self.assertIn("configured.connection_available === false", self.standard_source)

    def test_legacy_live_patches_skip_unchanged_text(self) -> None:
        self.assertIn("function setTextContentV075", self.source)
        self.assertIn("element.textContent !== value", self.source)
        self.assertNotIn("if (lteSubtitle) lteSubtitle.textContent", self.source)
        self.assertNotIn("if (cableSubtitle) cableSubtitle.textContent", self.source)

    def test_indicator_typography_has_no_sub_13px_text(self) -> None:
        indicator = self.contract["app_shell"]["connection_indicator"]
        self.assertEqual(indicator["primary_font_px"], 16)
        self.assertEqual(indicator["secondary_font_px"], 13)
        self.assertEqual(indicator["minimum_font_px"], 13)
        self.assertIn(".connection-primary{font-size:16px!important;font-weight:700!important", self.source)
        self.assertIn(".connection-secondary{font-size:13px!important;font-weight:600!important", self.source)

    def test_delivery_contract_selects_stable_component(self) -> None:
        updates = self.contract["app_shell"]["stable_updates"]
        self.assertEqual(updates["hass_update"], "point_patch")
        self.assertFalse(updates["shadow_root_inner_html_after_mount"])
        self.assertFalse(updates["replace_children_after_mount"])
        self.assertTrue(updates["persistent_view_containers"])
        self.assertEqual(self.manifest["panel_version"], "1.0.0")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v100")


if __name__ == "__main__":
    unittest.main()
