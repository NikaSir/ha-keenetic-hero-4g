from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (
    ROOT
    / "custom_components"
    / "keenetic_hero_4g"
    / "frontend"
    / "keenetic-app-v080.js"
)


class PanelCompositionV080Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")

    def test_topology_cards_clear_the_router_body(self) -> None:
        self.assertIn(".v061-cable{left:2.6%!important;top:46%!important}", self.source)
        self.assertIn(".v061-lan{right:2.6%!important;top:46%!important}", self.source)
        self.assertIn(".v060-router{top:54%!important;width:44%!important", self.source)

    def test_topology_lines_follow_the_rebalanced_cards(self) -> None:
        self.assertIn('".v061-lte-line": "M190 184 L438 304"', self.source)
        self.assertIn('".v061-cable-line": "M190 270 L438 316"', self.source)
        self.assertIn('".v061-lan-line": "M562 316 L820 270"', self.source)

    def test_mandatory_typography_has_reserved_width(self) -> None:
        self.assertIn("max-width:calc(100% - 190px)!important", self.source)
        self.assertIn("min-width:116px!important", self.source)
        self.assertIn("text-overflow:ellipsis!important", self.source)


if __name__ == "__main__":
    unittest.main()
