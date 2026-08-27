from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
CONTRACT = INTEGRATION / "panel_contract.json"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v080.js"


class PanelHeaderSafeAreaTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.contract = json.loads(CONTRACT.read_text(encoding="utf-8"))
        cls.source = SOURCE.read_text(encoding="utf-8")

    def test_panel_shell_owns_the_safe_area_once(self) -> None:
        viewport = self.contract["app_shell"]["viewport_fit"]
        header = self.contract["app_shell"]["header"]
        self.assertEqual(viewport["safe_area_owner"], "specialized_panel_shell")
        self.assertTrue(viewport["safe_area_applied_once"])
        self.assertTrue(header["safe_area_top"])

    def test_header_content_starts_below_the_system_inset(self) -> None:
        self.assertIn(
            "--safe-top:var(--safe-area-inset-top,env(safe-area-inset-top,0px))",
            self.source,
        )
        self.assertIn(
            "min-height:calc(62px + var(--safe-top))",
            self.source,
        )
        self.assertIn(
            "padding:var(--safe-top) max(8px,var(--safe-right))",
            self.source,
        )

    def test_safe_area_does_not_wrap_the_zoom_surface(self) -> None:
        start = self.source.index("#zoom-stage-v080")
        end = self.source.index(".tabbar-v080", start)
        self.assertNotIn("safe-top", self.source[start:end])


if __name__ == "__main__":
    unittest.main()
