from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v090.js"


class OverviewReadabilityV090Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.manifest = json.loads((INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8"))
        cls.contract = json.loads((INTEGRATION / "panel_contract.json").read_text(encoding="utf-8"))

    def test_failover_subtitle_clears_lte_card(self) -> None:
        self.assertIn("top:8px!important", self.source)
        self.assertIn("font-size:20px!important", self.source)
        self.assertIn("font-size:12px!important", self.source)
        self.assertIn("white-space:nowrap!important", self.source)
        composition = self.contract["view_patterns"]["overview"]["composition"]
        self.assertEqual(composition["hero_title_font_px"], 20)
        self.assertEqual(composition["hero_subtitle_font_px"], 12)
        self.assertEqual(composition["lte_card_top_percent"], 28.5)

    def test_lte_signal_value_is_not_prefixed_or_truncated(self) -> None:
        self.assertIn('panel._display("lte_rsrp", "—")', self.source)
        self.assertIn("signalValue.textContent = value", self.source)
        self.assertNotIn('`RSRP ${panel._display("lte_rsrp", "—")}`', self.source)

    def test_current_delivery_is_v090_b052(self) -> None:
        self.assertEqual(self.manifest["panel_version"], "0.9.0")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v090")
        integration_manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(integration_manifest["version"], "1.0.0-b052")


if __name__ == "__main__":
    unittest.main()
