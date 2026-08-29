#!/usr/bin/env python3
from pathlib import Path
import json

ROOT = Path('.')
FRONTEND = ROOT / 'custom_components/keenetic_hero_4g/frontend'

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f'{label}: expected 1 match, got {n}')
    return text.replace(old, new, 1)

app = FRONTEND / 'keenetic-app-v100.js'
s = app.read_text(encoding='utf-8')
s = once(s, 'const K100_VERSION = "1.0.1";', 'const K100_VERSION = "1.0.2";', 'app version')
s = s.replace('?v=1.0.1', '?v=1.0.2')
s = once(s,
    'const K100_VIEW_IDS = new Set(K100_TABS.map(([view])=>view));',
    'const K100_VIEW_IDS = new Set([...K100_TABS.map(([view])=>view),"system"]);',
    'system nested view')
s = once(s,
    'const active=button.dataset.view===this._view;',
    'const active=button.dataset.view===this._view||(this._view==="system"&&button.dataset.view==="diagnostics");',
    'diagnostics parent active state')
s = once(s,
    '@media(max-width:430px){.k100-hero{height:350px;background-size:auto 430px;background-position:center top}.k100-lines{height:430px}.k100-copy{max-width:50%;left:13px;top:12px}.k100-copy h1{font-size:24px}.k100-indicator{right:10px;top:10px;width:164px}.k100-router{top:260px;width:40%;max-width:245px}.k100-channel{min-width:132px;padding:9px 10px}.k100-lte{top:122px}.k100-eth,.k100-lan{top:240px}.k100-grid{grid-template-columns:repeat(3,1fr)}.k100-metric{padding:10px 8px}.k100-metric strong{font-size:14px}}',
    '@media(max-width:430px){.k100-overview{gap:5px;padding:5px 10px 6px}.k100-hero{height:350px;background-size:auto 430px;background-position:center top}.k100-lines{height:430px}.k100-copy{max-width:50%;left:13px;top:12px}.k100-copy h1{font-size:24px}.k100-indicator{right:10px;top:10px;width:164px}.k100-router{top:260px;width:40%;max-width:245px}.k100-channel{min-width:132px;padding:9px 10px}.k100-lte{top:122px}.k100-eth,.k100-lan{top:240px}.k100-reserve{padding:9px 14px}.k100-active-head{min-height:50px;padding:7px 12px}.k100-grid{grid-template-columns:repeat(3,1fr)}.k100-metric{min-height:62px;padding:7px 8px}.k100-metric strong{font-size:14px}}',
    'mobile overview density')
s = s.replace('<small>UI v1.0.1</small>', '<small>UI v1.0.2</small>')
app.write_text(s, encoding='utf-8')

panel = FRONTEND / 'keenetic-panel.js'
s = panel.read_text(encoding='utf-8')
s = once(s, 'const PANEL_VERSION = "1.0.1";', 'const PANEL_VERSION = "1.0.2";', 'panel version')
panel.write_text(s, encoding='utf-8')

build = ROOT / 'scripts/build_frontend_bundle.py'
s = build.read_text(encoding='utf-8')
s = once(s, 'PANEL_VERSION = "1.0.1"', 'PANEL_VERSION = "1.0.2"', 'build version')
s = s.replace('autonomous UI 1.0.1 production bundle', 'autonomous UI 1.0.2 production bundle')
build.write_text(s, encoding='utf-8')

runtime = ROOT / 'custom_components/keenetic_hero_4g/panel_runtime.py'
s = runtime.read_text(encoding='utf-8')
s = once(s, 'FRONTEND_UI_VERSION = "1.0.1"', 'FRONTEND_UI_VERSION = "1.0.2"', 'runtime version')
s = once(s, 'FRONTEND_CACHE_KEY = "1.0.1"', 'FRONTEND_CACHE_KEY = "1.0.2"', 'cache version')
s = s.replace('current autonomous UI 1.0.1 production component', 'current autonomous UI 1.0.2 production component')
runtime.write_text(s, encoding='utf-8')

const = ROOT / 'custom_components/keenetic_hero_4g/const.py'
s = const.read_text(encoding='utf-8')
s = once(s, 'PANEL_VERSION = "1.0.1"', 'PANEL_VERSION = "1.0.2"', 'const version')
const.write_text(s, encoding='utf-8')

manifest = ROOT / 'custom_components/keenetic_hero_4g/manifest.json'
data = json.loads(manifest.read_text(encoding='utf-8'))
if data.get('version') != '1.0.0-b053': raise SystemExit(data.get('version'))
data['version'] = '1.0.0-b054'
manifest.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

contract = ROOT / 'custom_components/keenetic_hero_4g/panel_contract.json'
data = json.loads(contract.read_text(encoding='utf-8')); data['panel']['version']='1.0.2'
contract.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

pm = ROOT / 'custom_components/keenetic_hero_4g/panel_manifest.json'
data = json.loads(pm.read_text(encoding='utf-8')); data['panel_version']='1.0.2'
def repl(v):
    if isinstance(v, dict): return {k:repl(x) for k,x in v.items()}
    if isinstance(v, list): return [repl(x) for x in v]
    if isinstance(v, str): return v.replace('?v=1.0.1','?v=1.0.2')
    return v
data=repl(data); pm.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

std = ROOT / '.nikas-ui-standard.json'
data=json.loads(std.read_text(encoding='utf-8')); data['ui_version']='1.0.2'; data['header_return']['version_marker']='<small>UI v1.0.2</small>'
std.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

for p in (ROOT/'tests').glob('test_*.py'):
    s=p.read_text(encoding='utf-8').replace('1.0.0-b053','1.0.0-b054').replace('UI v1.0.1','UI v1.0.2').replace('UI 1.0.1','UI 1.0.2').replace('?v=1.0.1','?v=1.0.2').replace('"1.0.1"','"1.0.2"')
    p.write_text(s,encoding='utf-8')

reg=ROOT/'tests/test_panel_b054_overview_fit_system.py'
reg.write_text('''from pathlib import Path\nimport unittest\n\nROOT=Path(__file__).resolve().parents[1]\nSRC=(ROOT/"custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js").read_text(encoding="utf-8")\n\nclass B054Tests(unittest.TestCase):\n    def test_system_is_nested_diagnostics_view(self):\n        self.assertIn('K100_VIEW_IDS = new Set([...K100_TABS.map(([view])=>view),"system"])', SRC)\n        self.assertIn('this._view==="system"&&button.dataset.view==="diagnostics"', SRC)\n    def test_mobile_overview_is_compacted_without_recropping_hero(self):\n        self.assertIn('.k100-hero{height:350px;background-size:auto 430px;background-position:center top}', SRC)\n        self.assertIn('.k100-overview{gap:5px;padding:5px 10px 6px}', SRC)\n        self.assertIn('.k100-active-head{min-height:50px;padding:7px 12px}', SRC)\n        self.assertIn('.k100-metric{min-height:62px;padding:7px 8px}', SRC)\n\nif __name__ == '__main__': unittest.main()\n''',encoding='utf-8')
