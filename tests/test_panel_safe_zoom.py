from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v072.js"


class PanelSafeZoomTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_has_no_resize_observer_or_click_capture(self) -> None:
        self.assertNotIn("ResizeObserver", self.source)
        self.assertNotIn('addEventListener("click", this.', self.source)
        self.assertNotIn("capture: true", self.source)

    def test_pinch_is_bound_only_to_scaled_surface(self) -> None:
        self.assertIn('surface.addEventListener("touchstart"', self.source)
        self.assertIn('surface.addEventListener("touchmove"', self.source)
        self.assertNotIn('viewport.addEventListener("touchstart"', self.source)

    def test_midpoint_and_native_scroll_own_focal_zoom(self) -> None:
        self.assertIn("_v072Midpoint(first, second, viewport)", self.source)
        self.assertIn("viewport.scrollLeft + focal.x", self.source)
        self.assertIn("viewport.scrollTop + focal.y", self.source)
        self.assertIn("viewport.scrollTo({", self.source)

    def test_controls_and_persistence_follow_standard(self) -> None:
        self.assertIn("data-safe-zoom-out", self.source)
        self.assertIn("data-safe-zoom-reset", self.source)
        self.assertIn("data-safe-zoom-in", self.source)
        self.assertIn("this._resetSafeZoomV072()", self.source)
        self.assertIn('viewport?.scrollTo({ top: 0, left: 0, behavior: "auto" })', self.source)
        self.assertIn("SAFE_ZOOM_MIN_V072 = 0.75", self.source)
        self.assertIn("SAFE_ZOOM_MAX_V072 = 2", self.source)
        self.assertIn("localStorage.setItem(SAFE_ZOOM_STORAGE_V072", self.source)

    def test_tab_switch_uses_one_cancelled_measurement_frame(self) -> None:
        self.assertIn("window.cancelAnimationFrame(this._safeZoomFrameV072)", self.source)
        self.assertIn("queueMicrotask(() => this._scheduleSafeZoomMeasureV072())", self.source)
        self.assertNotIn("_observeNikaZoomSurface", self.source)

    def test_b035_delivery_is_cache_safe(self) -> None:
        self.assertIn('import("./keenetic-app-v071.js?v=0.7.2")', self.source)
        self.assertEqual(self.manifest["zoom_policy"]["engine"], "isolated_native_scroll_scale")


if __name__ == "__main__":
    unittest.main()
