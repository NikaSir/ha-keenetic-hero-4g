from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
SRC=(ROOT/"custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js").read_text(encoding="utf-8")

class B054Tests(unittest.TestCase):
    def test_system_is_nested_diagnostics_view(self):
        self.assertIn('K100_VIEW_IDS = new Set([...K100_TABS.map(([view])=>view),"system"])', SRC)
        self.assertIn('this._view==="system"&&button.dataset.view==="diagnostics"', SRC)
    def test_mobile_overview_is_compacted_and_fills_short_work_rows(self):
        self.assertIn('grid-template-rows:minmax(350px,1fr) auto auto auto', SRC)
        self.assertIn('.k100-hero{height:auto;min-height:350px;background-size:auto max(430px,100%);background-position:center top}', SRC)
        self.assertIn('gap:5px;padding:0', SRC)
        self.assertIn('.k100-active-head{min-height:50px;padding:7px 12px}', SRC)
        self.assertIn('.k100-metric{min-height:62px;padding:7px 8px}', SRC)

    def test_canonical_canvas_is_the_only_page_gutter_owner(self):
        self.assertIn('width:100%!important;height:100%!important', SRC)
        self.assertIn('margin:0!important;padding:0!important', SRC)
        self.assertNotIn('padding:5px 10px 6px', SRC)

if __name__ == '__main__': unittest.main()
