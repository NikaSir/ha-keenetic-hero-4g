from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
CONTRACT = INTEGRATION / "panel_contract.json"
PANEL_MANIFEST = INTEGRATION / "panel_manifest.json"
ZOOM_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v067.js"


class PanelZoomContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.contract = json.loads(CONTRACT.read_text(encoding="utf-8"))
        cls.manifest = json.loads(PANEL_MANIFEST.read_text(encoding="utf-8"))
        cls.source = ZOOM_SOURCE.read_text(encoding="utf-8")

    def test_zoom_is_scoped_between_fixed_navigation_layers(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["scope"], "central_work_area_only")
        self.assertEqual(zoom["engine"], "transform_owned_canvas")
        self.assertTrue(zoom["header_fixed"])
        self.assertTrue(zoom["bottom_navigation_fixed"])
        self.assertTrue(zoom["single_viewport_per_panel_instance"])

    def test_zoom_limits_and_persistence_are_locked(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["min_percent"], 75)
        self.assertEqual(zoom["max_percent"], 200)
        self.assertEqual(zoom["persistence"], "localStorage")
        self.assertEqual(zoom["persistence_scope"], "panel_client")

    def test_pinch_uses_two_touches_and_the_live_midpoint(self) -> None:
        self.assertIn("event.touches.length >= 2", self.source)
        self.assertIn("_v067Midpoint(first, second, viewport)", self.source)
        self.assertIn("contentX: (point.x - state.x) / state.scale", self.source)
        self.assertIn("state.x = point.x - pinch.contentX * state.scale", self.source)

    def test_transform_canvas_owns_pan_without_native_scroll(self) -> None:
        self.assertIn("overflow:hidden!important", self.source)
        self.assertIn("touch-action:none!important", self.source)
        self.assertIn("translate3d(${state.x}px,${state.y}px,0) scale(${state.scale})", self.source)
        self.assertNotIn("scrollLeft =", self.source)
        self.assertNotIn("scrollTop =", self.source)
        self.assertNotIn(".scrollTo(", self.source)
        self.assertNotIn("style.zoom", self.source)

    def test_controls_are_removed_and_reset_is_gesture_only(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertFalse(zoom["permanent_controls"])
        self.assertEqual(zoom["controls"], [])
        self.assertEqual(zoom["reset_gesture"], "two_finger_double_tap")
        self.assertIn('root.querySelectorAll(".nika-zoom-dock")', self.source)
        self.assertIn("CANVAS_DOUBLE_TAP_DELAY_MS_V067 = 360", self.source)

    def test_snap_reset_feedback_and_origin_are_locked(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["snap_to_100_percent"], {"min_percent": 97, "max_percent": 103})
        self.assertEqual(zoom["reset_feedback"], "Масштаб 100%")
        self.assertIn('toast.textContent = "Масштаб 100%"', self.source)
        self.assertIn("state.scale = 1", self.source)
        self.assertIn("state.x = 0", self.source)
        self.assertIn("state.y = 0", self.source)

    def test_gestures_cancel_more_info_and_guard_generated_clicks(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertTrue(zoom["cancel_entity_hold_on_gesture"])
        self.assertEqual(zoom["gesture_click_guard_ms"], 700)
        self.assertIn('new PointerEvent("pointercancel"', self.source)
        self.assertIn("event.stopImmediatePropagation()", self.source)

    def test_reconciliation_keeps_exactly_one_canvas_structure(self) -> None:
        self.assertIn('viewport.querySelector(":scope > #nika-zoom-stage")', self.source)
        self.assertIn('stage?.querySelector(":scope > #nika-zoom-surface")', self.source)
        self.assertIn("viewport.replaceChildren(stage)", self.source)
        self.assertIn('viewport.dataset.nikasCanvasBoundV067 !== "true"', self.source)

    def test_delivery_manifest_matches_shell_and_zoom_policy(self) -> None:
        self.assertEqual(self.manifest["route"], "/dashboard-keenetic")
        self.assertEqual(self.manifest["entry_module"], "keenetic-panel-bundle.js")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v069")
        self.assertEqual(
            self.manifest["ha_menu_event"],
            {"type": "hass-toggle-menu", "bubbles": True, "composed": True},
        )
        self.assertEqual(self.manifest["zoom_policy"]["engine"], "transform_owned_canvas")
        self.assertFalse(self.manifest["zoom_policy"]["permanent_controls"])


if __name__ == "__main__":
    unittest.main()
