from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v100.js"


class PanelChannelStatusFillsV105Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.contract = json.loads(
            (INTEGRATION / "panel_contract.json").read_text(encoding="utf-8")
        )

    def test_hero_has_no_connection_lines(self) -> None:
        self.assertNotIn('class="k100-lines"', self.source)
        self.assertNotIn(".k100-lines{", self.source)
        overview = self.contract["view_patterns"]["overview"]
        self.assertTrue(overview["line_free_channel_composition"])
        self.assertFalse(overview["topology"]["visual_connectors"])

    def test_channel_surfaces_use_the_approved_light_state_palette(self) -> None:
        for marker in (
            ".k100-channel.active{color:#279f69;border-color:#9fe4c8;background:rgba(232,249,241,.95)}",
            ".k100-channel.standby{color:#168fbd;border-color:#a7dced;background:rgba(235,247,252,.95)}",
            ".k100-channel.down{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.95)}",
            ".k100-channel.unknown{color:#69757f;border-color:#cdd3d8;background:rgba(248,249,250,.95)}",
        ):
            self.assertIn(marker, self.source)

        self.assertEqual(
            self.contract["view_patterns"]["overview"]["channel_surface_states"],
            {
                "active_or_healthy": "light_green",
                "ready_reserve": "light_blue",
                "down": "light_orange",
                "unknown": "neutral_grey",
            },
        )
        self.assertIn(
            ".k100-reserve.reserve{color:#168fbd;border-color:#a7dced;background:rgba(235,247,252,.95)}",
            self.source,
        )
        self.assertIn(
            ".k100-reserve.unavailable{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.95)}",
            self.source,
        )

    def test_unavailable_and_unknown_are_not_conflated(self) -> None:
        self.assertIn('c.state==="down"?"Недоступен":"Нет данных"', self.source)
        self.assertIn('role==="lte"?"Резерв готов":"Канал доступен"', self.source)
        self.assertIn(
            'if(active==="lte")return ["reserve","mdi:check-circle","Работа через резерв"',
            self.source,
        )
        self.assertIn('return ["reserve","mdi:check-circle","Резерв готов"', self.source)
        self.assertIn('return ["unavailable","mdi:alert-circle-outline"', self.source)
        self.assertNotIn(".k100-channel.down{color:#d95d63", self.source)
        self.assertNotIn(".k100-reserve.unavailable{color:#d95d63", self.source)
        self.assertIn(".k100-indicator.bad{color:#d95d63", self.source)


if __name__ == "__main__":
    unittest.main()
