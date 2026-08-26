from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v074.js"


class PanelSafeZoomTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_resize_clamp_and_click_capture_are_enabled(self) -> None:
        self.assertIn("ResizeObserver", self.source)
        self.assertIn('addEventListener("click",this._standardClickGuardV074,{capture:true})', self.source)

    def test_single_viewport_owns_pinch_and_pan(self) -> None:
        self.assertIn('viewport.addEventListener("touchstart"', self.source)
        self.assertIn('viewport.addEventListener("touchmove"', self.source)

    def test_midpoint_and_native_scroll_own_focal_zoom(self) -> None:
        self.assertIn("midpointV074(a,b,viewport)", self.source)
        self.assertIn("viewport.scrollTop+focal.y", self.source)
        self.assertIn("viewport?.scrollTo({left:0,top:0", self.source)

    def test_controls_and_persistence_follow_standard(self) -> None:
        self.assertNotIn("data-safe-zoom-out", self.source)
        self.assertNotIn("data-safe-zoom-in", self.source)
        self.assertIn("MIN_SCALE_V074 = 0.75", self.source)
        self.assertIn("MAX_SCALE_V074 = 2", self.source)
        self.assertIn("this._storageKeyV074()", self.source)

    def test_tab_switch_uses_one_cancelled_measurement_frame(self) -> None:
        self.assertIn("cancelAnimationFrame(this._standardFrameV074)", self.source)
        self.assertIn("queueMicrotask(()=>this._scheduleStandardMeasureV074())", self.source)

    def test_b037_delivery_is_cache_safe(self) -> None:
        self.assertIn('import("./keenetic-app-v073.js?v=0.7.4")', self.source)
        self.assertEqual(self.manifest["zoom_policy"]["engine"], "native_vertical_at_100_transform_pan_above_100")


if __name__ == "__main__":
    unittest.main()
