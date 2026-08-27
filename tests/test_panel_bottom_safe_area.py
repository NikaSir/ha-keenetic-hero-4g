from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v080.js"
CONTRACT = INTEGRATION / "panel_contract.json"


class PanelBottomSafeAreaTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.contract = json.loads(CONTRACT.read_text(encoding="utf-8"))

    def test_tabbar_consumes_bottom_safe_area_once(self) -> None:
        navigation = self.contract["app_shell"]["bottom_navigation"]
        self.assertTrue(navigation["safe_area"])
        self.assertIn(
            "calc(6px + var(--safe-bottom))",
            self.source,
        )

    def test_safe_area_stays_outside_scaled_canvas(self) -> None:
        start = self.source.index("#zoom-stage-v080")
        end = self.source.index(".tabbar-v080", start)
        self.assertNotIn("safe-bottom", self.source[start:end])

    def test_current_component_is_cache_safe(self) -> None:
        self.assertIn('import("./keenetic-app-v076.js")', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v080"', self.source)
        self.assertNotIn("UI v0.", self.source)


if __name__ == "__main__":
    unittest.main()
