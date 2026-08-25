from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v071.js"


class PanelStabilityModeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_transform_runtime_is_disabled(self) -> None:
        self.assertIn("_installNikaZoom()", self.source)
        self.assertIn("_applyNikaZoom()", self.source)
        self.assertIn("this._teardownNikaZoom?.()", self.source)
        self.assertNotIn("_observeNikaZoomSurface(", self.source)

    def test_work_area_uses_native_vertical_scroll(self) -> None:
        self.assertIn("overflow-y:auto!important", self.source)
        self.assertIn("touch-action:pan-y!important", self.source)
        self.assertIn("transform:none!important", self.source)

    def test_tab_switch_has_no_measurement_or_gesture_work(self) -> None:
        start = self.source.index("_setView(view)")
        end = self.source.index("_renderShell()", start)
        transition = self.source[start:end]
        self.assertIn("this._child._scheduleRender?.()", transition)
        self.assertIn("this._renderTabBar()", transition)
        self.assertNotIn("requestAnimationFrame", transition)
        self.assertNotIn("ResizeObserver", transition)

    def test_current_component_and_policy_are_cache_safe(self) -> None:
        self.assertIn('import("./keenetic-app-v070.js?v=0.7.1")', self.source)
        self.assertEqual(self.manifest["panel_version"], "0.7.1")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v071")
        self.assertEqual(
            self.manifest["zoom_policy"]["engine"], "native_scroll_stability_mode"
        )


if __name__ == "__main__":
    unittest.main()
