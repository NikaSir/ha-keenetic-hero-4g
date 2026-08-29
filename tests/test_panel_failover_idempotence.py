from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v073.js"


class PanelFailoverIdempotenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.contract = json.loads(
            (INTEGRATION / "panel_contract.json").read_text(encoding="utf-8")
        )
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_disabled_history_notice_is_committed_once(self) -> None:
        guard = self.source.index("if (this._failoverHistoryDisabledV073) return")
        committed = self.source.index("this._failoverHistoryDisabledV073 = true")
        scheduled = self.source.index("this._scheduleRender?.()")
        self.assertLess(guard, committed)
        self.assertLess(committed, scheduled)
        self.assertEqual(self.source.count("this._scheduleRender?.()"), 1)

    def test_failover_override_does_not_call_recorder(self) -> None:
        self.assertNotIn("callWS", self.source)
        self.assertNotIn("history/history_during_period", self.source)
        self.assertIn("История HA Recorder временно отключена", self.source)
        self.assertFalse(self.contract["runtime_guards"]["failover_recorder_history_enabled"])

    def test_current_delivery_is_cache_safe(self) -> None:
        self.assertIn('import("./keenetic-app-v072.js?v=0.7.3")', self.source)
        self.assertEqual(self.manifest["panel_version"], "1.0.1")
        self.assertEqual(self.manifest["web_component"], "keenetic-hero-app-panel-v100")


if __name__ == "__main__":
    unittest.main()
