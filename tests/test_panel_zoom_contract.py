from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
CONTRACT = INTEGRATION / "panel_contract.json"
ZOOM_SOURCE = INTEGRATION / "frontend" / "keenetic-app-v065.js"


class PanelZoomContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.contract = json.loads(CONTRACT.read_text(encoding="utf-8"))
        cls.source = ZOOM_SOURCE.read_text(encoding="utf-8")

    def test_zoom_is_scoped_between_fixed_navigation_layers(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["scope"], "central_work_area_only")
        self.assertTrue(zoom["header_fixed"])
        self.assertTrue(zoom["bottom_navigation_fixed"])
        self.assertTrue(zoom["controls_fixed"])

    def test_zoom_limits_and_persistence_are_locked(self) -> None:
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["min_percent"], 85)
        self.assertEqual(zoom["max_percent"], 180)
        self.assertEqual(zoom["button_step_percent"], 10)
        self.assertEqual(zoom["persistence"], "localStorage")

    def test_pinch_uses_two_touches_and_the_live_midpoint(self) -> None:
        self.assertIn('event.touches.length !== 2', self.source)
        self.assertIn('_v065TouchMidpoint(event.touches)', self.source)
        self.assertIn('startDistance', self.source)
        self.assertIn('localX: midpoint.x - rect.left', self.source)

    def test_zoom_surface_excludes_header_tabbar_and_controls(self) -> None:
        stage_creation = self.source.index('stage.id = "nika-zoom-stage"')
        dock_creation = self.source.index('dock.className = "nika-zoom-dock"')
        self.assertLess(stage_creation, dock_creation)
        self.assertIn('shell.appendChild(dock)', self.source)
        self.assertIn('target.appendChild(this._child)', self.source)


if __name__ == "__main__":
    unittest.main()
