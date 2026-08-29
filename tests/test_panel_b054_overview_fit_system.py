from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
SRC=(ROOT/"custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js").read_text(encoding="utf-8")

class B054Tests(unittest.TestCase):
    def test_system_is_nested_diagnostics_view(self):
        self.assertIn('K100_VIEW_IDS = new Set([...K100_TABS.map(([view])=>view),"system"])', SRC)
        self.assertIn('this._view==="system"&&button.dataset.view==="diagnostics"', SRC)
    def test_mobile_overview_is_compacted_without_recropping_hero(self):
        self.assertIn('.k100-hero{height:350px;background-size:auto 430px;background-position:center top}', SRC)
        self.assertIn('.k100-overview{gap:5px;padding:5px 10px 6px}', SRC)
        self.assertIn('.k100-active-head{min-height:50px;padding:7px 12px}', SRC)
        self.assertIn('.k100-metric{min-height:62px;padding:7px 8px}', SRC)

if __name__ == '__main__': unittest.main()
