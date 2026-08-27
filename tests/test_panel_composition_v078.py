from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (
    ROOT
    / "custom_components"
    / "keenetic_hero_4g"
    / "frontend"
    / "keenetic-app-v078.js"
)


class PanelCompositionV078Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")

    def test_topology_cards_clear_the_router_body(self) -> None:
        self.assertIn(".v061-cable{left:3%!important;top:50%!important}", self.source)
        self.assertIn(".v061-lan{right:3%!important;top:50%!important}", self.source)
        self.assertIn(".v060-router{top:56%!important;width:47%!important}", self.source)

    def test_topology_lines_follow_the_rebalanced_cards(self) -> None:
        self.assertIn("M190 278 C285 278 350 294 438 316", self.source)
        self.assertIn("M562 316 C660 294 725 278 820 278", self.source)

    def test_mandatory_typography_has_reserved_width(self) -> None:
        self.assertIn("max-width:calc(100% - 194px)!important", self.source)
        self.assertIn("min-width:126px!important", self.source)
        self.assertIn("text-overflow:ellipsis!important", self.source)


if __name__ == "__main__":
    unittest.main()
