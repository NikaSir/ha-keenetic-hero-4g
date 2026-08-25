from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (
    ROOT
    / "custom_components"
    / "keenetic_hero_4g"
    / "frontend"
    / "keenetic-app-v070.js"
)


class PanelTabTransitionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")

    def test_view_switch_stops_old_measurement_cycle(self) -> None:
        self.assertIn("this._nikaCanvasResizeObserverV067?.disconnect()", self.source)
        self.assertIn("this._nikaCanvasResizeTargetV067 = null", self.source)
        self.assertIn("window.cancelAnimationFrame(this._nikaCanvasResizeFrameV067)", self.source)

    def test_new_view_starts_from_origin_without_losing_scale(self) -> None:
        self.assertIn("state.x = 0", self.source)
        self.assertIn("state.y = 0", self.source)
        self.assertIn("this._applyNikaZoom(state.scale, { remeasure: true })", self.source)

    def test_child_render_precedes_deferred_measurement(self) -> None:
        render = self.source.index("child._scheduleRender?.()")
        deferred = self.source.index("queueMicrotask(() =>")
        measured = self.source.index("this._observeNikaZoomSurface()", deferred)
        self.assertLess(render, deferred)
        self.assertLess(deferred, measured)

    def test_current_component_is_cache_safe(self) -> None:
        self.assertIn('import("./keenetic-app-v069.js?v=0.7.0")', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v070"', self.source)


if __name__ == "__main__":
    unittest.main()
