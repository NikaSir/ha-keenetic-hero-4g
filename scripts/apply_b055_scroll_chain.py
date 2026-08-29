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
replacement='connectedCallback(){this._mount();this._bind();this._bindScrollBoundaryGuard();window.addEventListener("hashchange",this._hashHandler);}'
s=s.replace(needle,replacement)
needle='disconnectedCallback(){this._unbind();window.removeEventListener("hashchange",this._hashHandler);}'
replacement='disconnectedCallback(){this._unbind();this._unbindScrollBoundaryGuard();window.removeEventListener("hashchange",this._hashHandler);}'
s=s.replace(needle,replacement)
insert='''\n  _bindScrollBoundaryGuard(){\n    if(this._scrollGuardBound)return;\n    const work=this.shadowRoot.getElementById("k100-work");\n    if(!work)return;\n    this._scrollGuardBound=true;\n    this._scrollTouchY=null;\n    this._scrollStart=e=>{if(e.touches?.length===1)this._scrollTouchY=e.touches[0].clientY;};\n    this._scrollMove=e=>{\n      if(e.touches?.length!==1||this._scrollTouchY===null)return;\n      const y=e.touches[0].clientY;const dy=y-this._scrollTouchY;\n      const atTop=work.scrollTop<=0;\n      const atBottom=work.scrollTop+work.clientHeight>=work.scrollHeight-1;\n      if((atTop&&dy>0)||(atBottom&&dy<0)){e.preventDefault();e.stopPropagation();}\n      this._scrollTouchY=y;\n    };\n    this._scrollEnd=()=>{this._scrollTouchY=null;};\n    work.addEventListener("touchstart",this._scrollStart,{passive:true});\n    work.addEventListener("touchmove",this._scrollMove,{passive:false});\n    work.addEventListener("touchend",this._scrollEnd,{passive:true});\n    work.addEventListener("touchcancel",this._scrollEnd,{passive:true});\n  }\n  _unbindScrollBoundaryGuard(){\n    const work=this.shadowRoot.getElementById("k100-work");\n    if(work&&this._scrollGuardBound){\n      work.removeEventListener("touchstart",this._scrollStart);\n      work.removeEventListener("touchmove",this._scrollMove);\n      work.removeEventListener("touchend",this._scrollEnd);\n      work.removeEventListener("touchcancel",this._scrollEnd);\n    }\n    this._scrollGuardBound=false;this._scrollTouchY=null;\n  }\n'''
marker='  _mount(){if(!this.shadowRoot.getElementById("k100-shell"))'
s=s.replace(marker,insert+'\n'+marker)
app.write_text(s,encoding='utf-8')

for p in [root/'custom_components/keenetic_hero_4g/panel_runtime.py',root/'custom_components/keenetic_hero_4g/manifest.json',root/'custom_components/keenetic_hero_4g/panel_manifest.json',root/'custom_components/keenetic_hero_4g/panel_contract.json']:
    if not p.exists(): continue
    t=p.read_text(encoding='utf-8')
    t=t.replace('1.0.2','1.0.3').replace('1.0.0-b054','1.0.0-b055')
    p.write_text(t,encoding='utf-8')
