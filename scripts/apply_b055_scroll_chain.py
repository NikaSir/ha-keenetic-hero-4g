#!/usr/bin/env python3
from pathlib import Path

root=Path('.')
app=root/'custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js'
s=app.read_text(encoding='utf-8')
s=s.replace('const K100_VERSION = "1.0.2";','const K100_VERSION = "1.0.3";')
s=s.replace('height:100dvh;overflow:hidden;background:', 'height:100%;min-height:0;max-height:100%;overflow:hidden;overscroll-behavior:none;position:relative;background:')
s=s.replace('#k100-shell{height:100%;display:grid;', '#k100-shell{height:100%;min-height:0;display:grid;overscroll-behavior:none;')
s=s.replace('.k100-header{min-height:', '.k100-header{touch-action:none;overscroll-behavior:none;min-height:')
s=s.replace('.k100-work{min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:none;', '.k100-work{min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior-y:contain;overscroll-behavior-x:none;')
s=s.replace('.k100-tabs{display:grid;', '.k100-tabs{touch-action:none;overscroll-behavior:none;display:grid;')
s=s.replace('<small>UI v1.0.2</small>', '<small>UI v1.0.3</small>')
s=s.replace('?v=1.0.2', '?v=1.0.3')
needle='connectedCallback(){this._mount();this._bind();window.addEventListener("hashchange",this._hashHandler);}'
s=s.replace(needle,'connectedCallback(){this._mount();this._bind();this._bindScrollBoundaryGuard();window.addEventListener("hashchange",this._hashHandler);}')
needle='disconnectedCallback(){this._unbind();window.removeEventListener("hashchange",this._hashHandler);}'
s=s.replace(needle,'disconnectedCallback(){this._unbind();this._unbindScrollBoundaryGuard();window.removeEventListener("hashchange",this._hashHandler);}')
insert='''\n  _bindScrollBoundaryGuard(){\n    if(this._scrollGuardBound)return;\n    const work=this.shadowRoot.getElementById("k100-work");if(!work)return;\n    this._scrollGuardBound=true;this._scrollTouchY=null;\n    this._scrollStart=e=>{if(e.touches?.length===1)this._scrollTouchY=e.touches[0].clientY;};\n    this._scrollMove=e=>{if(e.touches?.length!==1||this._scrollTouchY===null)return;const y=e.touches[0].clientY;const dy=y-this._scrollTouchY;const atTop=work.scrollTop<=0;const atBottom=work.scrollTop+work.clientHeight>=work.scrollHeight-1;if((atTop&&dy>0)||(atBottom&&dy<0)){e.preventDefault();e.stopPropagation();}this._scrollTouchY=y;};\n    this._scrollEnd=()=>{this._scrollTouchY=null;};\n    work.addEventListener("touchstart",this._scrollStart,{passive:true});work.addEventListener("touchmove",this._scrollMove,{passive:false});work.addEventListener("touchend",this._scrollEnd,{passive:true});work.addEventListener("touchcancel",this._scrollEnd,{passive:true});\n  }\n  _unbindScrollBoundaryGuard(){const work=this.shadowRoot.getElementById("k100-work");if(work&&this._scrollGuardBound){work.removeEventListener("touchstart",this._scrollStart);work.removeEventListener("touchmove",this._scrollMove);work.removeEventListener("touchend",this._scrollEnd);work.removeEventListener("touchcancel",this._scrollEnd);}this._scrollGuardBound=false;this._scrollTouchY=null;}\n'''
marker='  _mount(){if(!this.shadowRoot.getElementById("k100-shell"))'
s=s.replace(marker,insert+'\n'+marker)
app.write_text(s,encoding='utf-8')

for p in [root/'custom_components/keenetic_hero_4g/panel_runtime.py',root/'custom_components/keenetic_hero_4g/manifest.json',root/'custom_components/keenetic_hero_4g/panel_manifest.json',root/'custom_components/keenetic_hero_4g/panel_contract.json',root/'.nikas-ui-standard.json',root/'scripts/build_frontend_bundle.py',root/'scripts/check_nikas_ui_standard.py',*sorted((root/'tests').glob('test_*.py'))]:
    if not p.exists(): continue
    t=p.read_text(encoding='utf-8')
    t=t.replace('1.0.2','1.0.3').replace('1.0.0-b054','1.0.0-b055')
    p.write_text(t,encoding='utf-8')
