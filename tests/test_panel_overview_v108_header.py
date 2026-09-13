from __future__ import annotations

import json
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js"
HARNESS = ROOT / "tests/overview_v108_markup_harness.mjs"
CONTRACT = ROOT / "custom_components/keenetic_hero_4g/panel_contract.json"


class PanelOverviewV108HeaderTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.contract = json.loads(CONTRACT.read_text(encoding="utf-8"))

    def test_status_header_and_photo_scene_have_separate_ownership(self) -> None:
        result = subprocess.run(
            ["node", str(HARNESS)],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_phone_scene_is_shorter_and_header_keeps_the_overview_compact(self) -> None:
        for marker in (
            ".k100-hero{position:relative;min-height:430px",
            ".k100-scene{position:absolute;left:12px;right:12px;bottom:12px;height:310px",
            ".k100-copy{position:absolute;z-index:1;left:16px;right:16px;top:20px;min-height:58px;padding-right:177px",
            ".k100-indicator{position:absolute;z-index:2;right:13px;top:13px",
            ".k100-hero-accent{position:absolute;right:-70px;top:-92px;width:205px;height:205px",
            "@media(max-width:430px)",
            ".k100-hero{min-height:350px}",
            ".k100-scene{left:10px;right:10px;top:100px;bottom:10px;height:auto}",
        ):
            self.assertIn(marker, self.source)

        self.assertNotIn(".k100-hero{height:auto;min-height:350px;background-size:", self.source)

        overview = self.contract["view_patterns"]["overview"]
        self.assertEqual(overview["hero_style"], "status_header_with_inset_room_scene")
        self.assertEqual(overview["photo_scene_mobile_height_px"], 240)
        self.assertEqual(overview["composition"]["router_vertical_percent"], 68)
        self.assertEqual(overview["composition"]["lte_card_top_percent"], 25)


if __name__ == "__main__":
    unittest.main()
