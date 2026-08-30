from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend" / "keenetic-app-v100.js"


class PanelTabsViewportV100Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")

    def test_hass_updates_do_not_reassign_panel_or_reset_view(self) -> None:
        self.assertIn("this._sentPanel!==this._panel", self.source)
        self.assertEqual(self.source.count("this._child.panel=this._panel"), 1)
        self.assertIn("if(this._child._view!==this._view)this._child._view=this._view", self.source)
        self.assertIn("this._sentHass!==this._hass", self.source)

    def test_selected_tab_is_synchronized_with_hash_and_child(self) -> None:
        self.assertIn("this._view=k100ViewFromLocation()", self.source)
        self.assertIn("history.replaceState", self.source)
        self.assertIn("#${v}", self.source)
        self.assertIn("this._child._showStableViewV075?.(v)", self.source)
        self.assertIn("hashchange", self.source)
        self.assertNotIn("n.innerHTML=K100_TABS", self.source)

    def test_mobile_scene_fills_available_height_without_moving_topology(self) -> None:
        self.assertIn("@media(max-width:430px)", self.source)
        self.assertIn("grid-template-rows:minmax(350px,1fr) auto auto auto", self.source)
        self.assertIn(".k100-hero{height:auto;min-height:350px;background-size:auto max(430px,100%);background-position:center top}", self.source)
        self.assertNotIn(".k100-lines{", self.source)
        self.assertIn(".k100-router{top:min(74%,260px);width:40%", self.source)
        self.assertIn(".k100-lte{top:min(35%,122px)}", self.source)
        self.assertIn(".k100-eth,.k100-lan{top:min(69%,240px)}", self.source)


if __name__ == "__main__":
    unittest.main()
