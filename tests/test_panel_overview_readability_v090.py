from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v100.js"


class OverviewReadabilityV100Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.manifest = json.loads((INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8"))

    def test_overview_heading_and_channel_labels_remain_readable(self) -> None:
        self.assertIn(".k100-copy h1{margin:0 0 3px;font-size:20px", self.source)
        self.assertIn(".k100-copy p{margin:0;font-size:12px", self.source)
        self.assertIn(".k100-channel strong{font-size:15px}", self.source)
        self.assertIn(".k100-channel span{font-size:12px", self.source)
        self.assertIn(".k100-lte{left:50%;top:28.5%", self.source)

    def test_lte_signal_value_is_not_prefixed_or_truncated(self) -> None:
        self.assertIn('panel._display("lte_rsrp", "—")', self.source)
        self.assertIn('const linkLabel = active === "lte" ? "Сигнал" : "Link";', self.source)
        self.assertNotIn('`RSRP ${panel._display("lte_rsrp"', self.source)
        metric_css = self.source[
            self.source.index(".k100-metric span,.k100-metric strong")
            : self.source.index(".k100-metric.wide")
        ]
        self.assertNotIn("text-overflow:ellipsis", metric_css)
        self.assertNotIn("white-space:nowrap", metric_css)

    def test_detail_views_receive_the_v19_typography_floor(self) -> None:
        self.assertIn("/* v1.9 typography floor for the retained Keenetic detail views. */", self.source)
        self.assertIn(".metric strong{font-size:14px!important}", self.source)
        self.assertIn(".diag-row strong{font-size:13px!important}", self.source)
        self.assertIn(".eyebrow,.subline,.label{font-size:12px!important}", self.source)

    def test_current_delivery_is_v100_b052(self) -> None:
        self.assertEqual(self.manifest["panel_version"], "1.0.0")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v100")
        integration_manifest = json.loads((INTEGRATION / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(integration_manifest["version"], "1.0.0-b052")


if __name__ == "__main__":
    unittest.main()
