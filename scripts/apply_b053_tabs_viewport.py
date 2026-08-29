#!/usr/bin/env python3
"""Apply the reviewed Keenetic UI 1.0.1 tab-state and mobile viewport patch."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def main() -> None:
    source_path = FRONTEND / "keenetic-app-v100.js"
    source = source_path.read_text(encoding="utf-8")
    source = replace_once(
        source,
        'const K100_VERSION = "1.0.0";',
        'const K100_VERSION = "1.0.1";',
        "UI version",
    )
    source = source.replace("?v=1.0.0", "?v=1.0.1")
    source = replace_once(
        source,
        "];\n\nfunction k100Esc",
        "];\nconst K100_VIEW_IDS = new Set(K100_TABS.map(([view])=>view));\n"
        'function k100ViewFromLocation(){const value=(location.hash||"").slice(1).toLowerCase();return K100_VIEW_IDS.has(value)?value:"overview";}\n\n'
        "function k100Esc",
        "view parser",
    )
    source = replace_once(
        source,
        'data-k100-view="wan"',
        'data-view="wan"',
        "active card navigation",
    )
    source = replace_once(
        source,
        ".k100-overview{display:grid;gap:10px;padding:10px 10px 18px;min-height:100%}",
        ".k100-overview{display:grid;gap:8px;padding:8px 10px 12px;min-height:100%}",
        "overview spacing",
    )

    old_media = (
        "@media(max-width:390px){.k100-hero{height:410px}"
        ".k100-copy{max-width:50%;left:13px;top:12px}"
        ".k100-copy h1{font-size:22px}"
        ".k100-indicator{right:10px;top:10px;width:164px}"
        ".k100-router{width:43%;max-width:245px}"
        ".k100-channel{min-width:132px;padding:9px 10px}"
        ".k100-lte{top:31%}.k100-eth,.k100-lan{top:59%}"
        ".k100-grid{grid-template-columns:repeat(3,1fr)}"
        ".k100-metric{padding:10px 8px}.k100-metric strong{font-size:14px}}"
    )
    new_media = (
        "@media(max-width:430px){"
        ".k100-hero{height:350px;background-size:auto 430px;background-position:center top}"
        ".k100-lines{height:430px}"
        ".k100-copy{max-width:50%;left:13px;top:12px}"
        ".k100-copy h1{font-size:24px}"
        ".k100-indicator{right:10px;top:10px;width:164px}"
        ".k100-router{top:260px;width:40%;max-width:245px}"
        ".k100-channel{min-width:132px;padding:9px 10px}"
        ".k100-lte{top:122px}.k100-eth,.k100-lan{top:240px}"
        ".k100-grid{grid-template-columns:repeat(3,1fr)}"
        ".k100-metric{padding:10px 8px}.k100-metric strong{font-size:14px}}\n"
        "@media(max-width:390px){"
        ".k100-hero{height:342px;background-size:auto 420px}"
        ".k100-lines{height:420px}.k100-copy h1{font-size:22px}"
        ".k100-router{top:253px;max-width:232px}"
        ".k100-lte{top:118px}.k100-eth,.k100-lan{top:234px}}"
    )
    source = replace_once(source, old_media, new_media, "mobile hero crop")

    source = replace_once(
        source,
        'constructor(){super();this.attachShadow({mode:"open"});this._hass=null;this._panel=null;this._route=null;this._child=null;this._view="overview";this._scale=1;this._returnRoute=null;this._pinch=null;}',
        'constructor(){super();this.attachShadow({mode:"open"});this._hass=null;this._panel=null;this._route=null;this._child=null;this._view=k100ViewFromLocation();this._scale=1;this._returnRoute=null;this._pinch=null;this._sentPanel=null;this._sentRoute=null;this._sentHass=null;this._hashHandler=()=>{const view=k100ViewFromLocation();if(view!==this._view)this._setView(view,false);};}',
        "constructor state",
    )
    source = replace_once(
        source,
        'set hass(v){this._hass=v;this._mountChild();if(this._child)this._child.hass=v;} set panel(v){this._panel=v;if(!this._returnRoute){this._returnRoute=k100Return(v);localStorage.setItem("nikas.keenetic.return_route.v1",this._returnRoute);}this._mount();} set route(v){this._route=v;if(this._child)this._child.route=v;}',
        'set hass(v){this._hass=v;this._mount();this._syncChild();} set panel(v){this._panel=v;if(!this._returnRoute){this._returnRoute=k100Return(v);localStorage.setItem("nikas.keenetic.return_route.v1",this._returnRoute);}this._mount();this._syncChild();} set route(v){this._route=v;this._mount();this._syncChild();}',
        "property setters",
    )
    source = replace_once(
        source,
        "connectedCallback(){this._mount();this._bind();}\n  disconnectedCallback(){this._unbind();}",
        'connectedCallback(){this._mount();this._bind();window.addEventListener("hashchange",this._hashHandler);}\n  disconnectedCallback(){this._unbind();window.removeEventListener("hashchange",this._hashHandler);}',
        "lifecycle hash sync",
    )

    old_tabs = (
        '  _mountChild(){if(!this.isConnected||!this.shadowRoot.getElementById("k100-stage"))return;'
        'if(!this._child){this._child=document.createElement("keenetic-hero-panel");this._child._view=this._view;'
        'this.shadowRoot.getElementById("k100-stage").append(this._child);}if(this._panel)this._child.panel=this._panel;'
        'if(this._route)this._child.route=this._route;if(this._hass)this._child.hass=this._hass;}\n'
        '  _renderTabs(){const n=this.shadowRoot.getElementById("k100-tabs");if(!n)return;'
        'n.innerHTML=K100_TABS.map(([v,i,l])=>`<button data-view="${v}" class="${v===this._view?"active":""}">'
        '<ha-icon icon="${i}"></ha-icon><span>${l}</span></button>`).join("");'
        'n.querySelectorAll("button").forEach(b=>b.onclick=()=>this._setView(b.dataset.view));}\n'
        '  _setView(v){if(!K100_TABS.some(x=>x[0]===v))return;this._view=v;this._child._view=v;'
        'this._child._scheduleRender?.();this._child._loadViewData?.();'
        'this.shadowRoot.getElementById("k100-work").scrollTop=0;this._renderTabs();}'
    )
    new_tabs = (
        '  _mountChild(){const stage=this.shadowRoot.getElementById("k100-stage");if(!this.isConnected||!stage)return;'
        'if(!this._child){this._child=document.createElement("keenetic-hero-panel");'
        'this._child.addEventListener("keenetic-view-request",event=>{const view=event.detail?.view;'
        'if(!K100_VIEW_IDS.has(view))return;event.preventDefault();this._setView(view);});stage.append(this._child);}'
        'this._syncChild();}\n'
        '  _syncChild(){if(!this._child)return;if(this._panel&&this._sentPanel!==this._panel)'
        '{this._child.panel=this._panel;this._sentPanel=this._panel;}'
        'if(this._route&&this._sentRoute!==this._route){this._child.route=this._route;this._sentRoute=this._route;}'
        'if(this._child._view!==this._view)this._child._view=this._view;'
        'if(this._hass&&this._sentHass!==this._hass){this._child.hass=this._hass;this._sentHass=this._hass;}}\n'
        '  _renderTabs(){const nav=this.shadowRoot.getElementById("k100-tabs");if(!nav)return;'
        'if(nav.dataset.mounted!=="true"){for(const[v,icon,label]of K100_TABS){const button=document.createElement("button");'
        'button.dataset.view=v;button.type="button";const glyph=document.createElement("ha-icon");glyph.setAttribute("icon",icon);'
        'const text=document.createElement("span");text.textContent=label;button.append(glyph,text);'
        'button.addEventListener("click",()=>this._setView(v));nav.append(button);}nav.dataset.mounted="true";}'
        'this._updateTabs();}\n'
        '  _updateTabs(){this.shadowRoot.querySelectorAll("#k100-tabs button").forEach(button=>{'
        'const active=button.dataset.view===this._view;button.classList.toggle("active",active);'
        'if(active)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");});}\n'
        '  _setView(v,updateLocation=true){if(!K100_VIEW_IDS.has(v))return;this._view=v;'
        'if(updateLocation)history.replaceState(null,"",`${location.pathname}${location.search}#${v}`);'
        'this._mountChild();if(this._child){this._child._view=v;this._child._showStableViewV075?.(v);'
        'this._child._scheduleRender?.();this._child._loadViewData?.();}'
        'const viewport=this.shadowRoot.getElementById("k100-work");if(viewport)viewport.scrollTop=0;this._updateTabs();}'
    )
    source = replace_once(source, old_tabs, new_tabs, "child and tab state")
    source = source.replace("<small>UI v1.0.0</small>", "<small>UI v1.0.1</small>")
    if "<small>UI v1.0.1</small>" not in source:
        raise SystemExit("Header UI version was not updated")
    source_path.write_text(source, encoding="utf-8")

    panel_source = FRONTEND / "keenetic-panel.js"
    text = panel_source.read_text(encoding="utf-8")
    text = replace_once(
        text,
        'const PANEL_VERSION = "0.9.0";',
        'const PANEL_VERSION = "1.0.1";',
        "base panel version",
    )
    panel_source.write_text(text, encoding="utf-8")

    build_path = ROOT / "scripts" / "build_frontend_bundle.py"
    text = build_path.read_text(encoding="utf-8")
    text = replace_once(text, 'PANEL_VERSION = "1.0.0"', 'PANEL_VERSION = "1.0.1"', "build version")
    text = text.replace("autonomous UI 1.0.0 production bundle", "autonomous UI 1.0.1 production bundle")
    build_path.write_text(text, encoding="utf-8")

    runtime_path = ROOT / "custom_components" / "keenetic_hero_4g" / "panel_runtime.py"
    text = runtime_path.read_text(encoding="utf-8")
    text = replace_once(text, 'FRONTEND_UI_VERSION = "1.0.0"', 'FRONTEND_UI_VERSION = "1.0.1"', "runtime UI version")
    text = replace_once(text, 'FRONTEND_CACHE_KEY = "1.0.0"', 'FRONTEND_CACHE_KEY = "1.0.1"', "runtime cache key")
    text = text.replace("current autonomous UI 1.0.0 production component", "current autonomous UI 1.0.1 production component")
    runtime_path.write_text(text, encoding="utf-8")

    const_path = ROOT / "custom_components" / "keenetic_hero_4g" / "const.py"
    text = const_path.read_text(encoding="utf-8")
    text = replace_once(text, 'PANEL_VERSION = "1.0.0"', 'PANEL_VERSION = "1.0.1"', "panel contract version")
    const_path.write_text(text, encoding="utf-8")

    manifest_path = ROOT / "custom_components" / "keenetic_hero_4g" / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("version") != "1.0.0-b052":
        raise SystemExit(f'Unexpected integration version: {manifest.get("version")}')
    manifest["version"] = "1.0.0-b053"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    contract_path = ROOT / "custom_components" / "keenetic_hero_4g" / "panel_contract.json"
    contract = json.loads(contract_path.read_text(encoding="utf-8"))
    contract["panel"]["version"] = "1.0.1"
    contract_path.write_text(json.dumps(contract, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def replace_versioned_strings(value):
        if isinstance(value, dict):
            return {key: replace_versioned_strings(item) for key, item in value.items()}
        if isinstance(value, list):
            return [replace_versioned_strings(item) for item in value]
        if isinstance(value, str):
            return value.replace("?v=1.0.0", "?v=1.0.1")
        return value

    panel_manifest_path = ROOT / "custom_components" / "keenetic_hero_4g" / "panel_manifest.json"
    panel_manifest = json.loads(panel_manifest_path.read_text(encoding="utf-8"))
    panel_manifest["panel_version"] = "1.0.1"
    panel_manifest = replace_versioned_strings(panel_manifest)
    panel_manifest_path.write_text(json.dumps(panel_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    standard_path = ROOT / ".nikas-ui-standard.json"
    standard = json.loads(standard_path.read_text(encoding="utf-8"))
    standard["ui_version"] = "1.0.1"
    standard["header_return"]["version_marker"] = "<small>UI v1.0.1</small>"
    standard_path.write_text(json.dumps(standard, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    for test_path in (ROOT / "tests").glob("test_*.py"):
        text = test_path.read_text(encoding="utf-8")
        text = text.replace('"1.0.0-b052"', '"1.0.0-b053"')
        text = text.replace('"1.0.0"', '"1.0.1"')
        text = text.replace("UI v1.0.0", "UI v1.0.1")
        text = text.replace("UI 1.0.0", "UI 1.0.1")
        text = text.replace("?v=1.0.0", "?v=1.0.1")
        test_path.write_text(text, encoding="utf-8")

    regression = ROOT / "tests" / "test_panel_tabs_viewport_v100.py"
    regression.write_text(
        '''from __future__ import annotations

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

    def test_mobile_scene_is_cropped_from_the_bottom(self) -> None:
        self.assertIn("@media(max-width:430px)", self.source)
        self.assertIn(".k100-hero{height:350px;background-size:auto 430px;background-position:center top}", self.source)
        self.assertIn(".k100-lines{height:430px}", self.source)
        self.assertIn(".k100-router{top:260px;width:40%", self.source)
        self.assertIn(".k100-lte{top:122px}", self.source)
        self.assertIn(".k100-eth,.k100-lan{top:240px}", self.source)


if __name__ == "__main__":
    unittest.main()
''',
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
