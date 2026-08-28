from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
CONTRACT = INTEGRATION / "panel_contract.json"
PANEL_MANIFEST = INTEGRATION / "panel_manifest.json"
ZOOM_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v080.js"
STANDARD_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v076.js"
DELIVERY_SOURCE = ZOOM_SOURCE


class PanelZoomContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.contract = json.loads(CONTRACT.read_text(encoding="utf-8"))
        cls.manifest = json.loads(PANEL_MANIFEST.read_text(encoding="utf-8"))
        cls.source = ZOOM_SOURCE.read_text(encoding="utf-8")
        cls.standard_source = STANDARD_SOURCE.read_text(encoding="utf-8")
        cls.delivery_source = DELIVERY_SOURCE.read_text(encoding="utf-8")

    def test_zoom_is_scoped_between_fixed_navigation_layers(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["scope"], "central_work_area_only")
        self.assertTrue(zoom["enabled"])
        self.assertEqual(zoom["engine"], "native_vertical_at_100_transform_pan_above_100")
        self.assertTrue(zoom["header_fixed"])
        self.assertTrue(zoom["bottom_navigation_fixed"])
        self.assertTrue(zoom["single_viewport_per_panel_instance"])

    def test_zoom_limits_and_persistence_are_locked(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["min_percent"], 75)
        self.assertEqual(zoom["max_percent"], 200)
        self.assertEqual(zoom["persistence"], "localStorage")
        self.assertEqual(zoom["persistence_scope"], "panel_client_device")

    def test_pinch_uses_two_touches_and_the_live_midpoint(self) -> None:
        self.assertIn("event.touches.length >= 2", self.source)
        self.assertIn("midpointV080(a, b, viewport)", self.source)
        self.assertIn("anchor: this._contentPoint(focal)", self.source)
        self.assertIn("state.x = options.focal.x - options.anchor.x * state.scale", self.source)

    def test_native_scroll_at_100_and_transform_pan_above_100(self) -> None:
        self.assertIn("overflow-x:hidden;overflow-y:auto", self.source)
        self.assertIn("touch-action:pan-y", self.source)
        self.assertIn("zoomed-v080", self.source)
        self.assertIn("translate3d(${state.x}px,${state.y}px,0) scale(${state.scale})", self.source)
        self.assertIn("state.scale > 1", self.source)
        self.assertNotIn("style.zoom", self.source)
        self.assertIn("stage.style.height", self.delivery_source)
        self.assertIn("this._baseHeight * state.scale", self.delivery_source)
        self.assertIn('viewport.classList.remove("scaled-v080", "zoomed-v080")', self.delivery_source)

    def test_runtime_waits_for_real_nodes_and_rebinds_gestures_in_capture(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(
            zoom["viewport_binding_requires_nodes"],
            ["work-viewport-v080", "zoom-stage-v080", "zoom-surface-v080"],
        )
        self.assertEqual(zoom["gesture_listener_phase"], "capture")
        self.assertTrue(zoom["remeasure_after_mount"])
        self.assertIn('getElementById("work-viewport-v080")', self.delivery_source)
        self.assertIn("if (!viewport || viewport.clientWidth <= 0) return false", self.delivery_source)
        self.assertIn('{ capture: true, passive: false }', self.delivery_source)
        self.assertIn("new ResizeObserver", self.delivery_source)

    def test_controls_are_removed_and_reset_is_gesture_only(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertFalse(zoom["permanent_controls"])
        self.assertEqual(zoom["controls"], [])
        self.assertEqual(zoom["reset_gesture"], "two_finger_double_tap")
        self.assertNotIn("nika-zoom-dock", self.source)
        self.assertIn("DOUBLE_TAP_MS_V080 = 360", self.source)

    def test_snap_reset_feedback_and_origin_are_locked(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["snap_to_100_percent"], {"min_percent": 97, "max_percent": 103})
        self.assertEqual(zoom["reset_feedback"], "Масштаб 100%")
        self.assertIn('role="status">Масштаб 100%</div>', self.source)
        self.assertIn("this._zoom = { scale: 1, x: 0, y: 0 }", self.source)
        self.assertIn('surface.style.width = "";surface.style.height = "";surface.style.transform = ""', self.source)

    def test_gestures_cancel_more_info_and_guard_generated_clicks(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertTrue(zoom["cancel_entity_hold_on_gesture"])
        self.assertEqual(zoom["gesture_click_guard_ms"], 380)
        self.assertIn('new PointerEvent("pointercancel"', self.source)
        self.assertIn("event.stopImmediatePropagation()", self.source)

    def test_reconciliation_keeps_exactly_one_canvas_structure(self) -> None:
        self.assertIn('getElementById("zoom-stage-v080")', self.source)
        self.assertIn('getElementById("zoom-surface-v080")', self.source)
        self.assertIn('if (this.shadowRoot.getElementById("app-shell-v080")) return', self.source)

    def test_delivery_manifest_matches_shell_and_zoom_policy(self) -> None:
        self.assertEqual(self.manifest["route"], "/dashboard-keenetic")
        self.assertEqual(self.manifest["entry_module"], "keenetic-panel-bundle.js")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v089")
        self.assertEqual(
            self.manifest["ha_menu_event"],
            {"type": "hass-toggle-menu", "bubbles": True, "composed": True},
        )
        self.assertEqual(self.manifest["zoom_policy"]["engine"], "native_vertical_at_100_transform_pan_above_100")
        self.assertFalse(self.manifest["zoom_policy"]["permanent_controls"])


if __name__ == "__main__":
    unittest.main()
