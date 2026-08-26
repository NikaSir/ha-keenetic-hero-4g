await import("./keenetic-app-v073.js?v=0.7.4");

const BASE_COMPONENT_V074 = customElements.get("keenetic-hero-app-panel-v073");
const MIN_SCALE_V074 = 0.75;
const MAX_SCALE_V074 = 2;
const SNAP_MIN_V074 = 0.97;
const SNAP_MAX_V074 = 1.03;
const PAN_THRESHOLD_V074 = 7;
const TAP_MOVE_V074 = 12;
const TAP_DURATION_V074 = 260;
const DOUBLE_TAP_DELAY_V074 = 360;
const GUARD_MS_V074 = 380;

const clampScaleV074 = (value) => Math.min(MAX_SCALE_V074, Math.max(MIN_SCALE_V074, Number(value) || 1));
const distanceV074 = (a,b) => Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY);
const midpointV074 = (a,b,viewport) => { const r=viewport.getBoundingClientRect(); return {x:(a.clientX+b.clientX)/2-r.left,y:(a.clientY+b.clientY)/2-r.top}; };
const pageMidpointV074 = (a,b) => ({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
const pointDistanceV074 = (a,b) => Math.hypot(b.x-a.x,b.y-a.y);

function deepElementV074(root,x,y) {
  let found=root?.elementFromPoint?.(x,y) || document.elementFromPoint(x,y);
  while (found?.shadowRoot) { const nested=found.shadowRoot.elementFromPoint?.(x,y); if (!nested || nested===found) break; found=nested; }
  return found;
}
function cancelHoldV074(target) {
  const entity=target?.closest?.("[data-entity]");
  if (!entity) return;
  const event=typeof PointerEvent==="function"?new PointerEvent("pointercancel",{bubbles:true,composed:true}):new Event("pointercancel",{bubbles:true,composed:true});
  entity.dispatchEvent(event);
}

if (BASE_COMPONENT_V074 && !customElements.get("keenetic-hero-app-panel-v074")) {
  class KeeneticHeroAppPanelV074 extends BASE_COMPONENT_V074 {
    constructor() {
      super();
      this._standardTouchStartV074=(event)=>this._onStandardTouchStartV074(event);
      this._standardTouchMoveV074=(event)=>this._onStandardTouchMoveV074(event);
      this._standardTouchEndV074=(event)=>this._onStandardTouchEndV074(event);
      this._standardTouchCancelV074=()=>this._onStandardTouchCancelV074();
      this._standardClickGuardV074=(event)=>this._onStandardClickGuardV074(event);
      this._standardResizeV074=()=>this._scheduleStandardMeasureV074();
      this._standardStateV074={scale:1,x:0,y:0};
      this._standardLoadedKeyV074=null;
      this._standardBaseWidthV074=1;
      this._standardBaseHeightV074=1;
    }

    _storageKeyV074() { return `nikas.keenetic.zoom.v4:${this._panel?.config?.entry_id || "default"}`; }
    _loadStandardStateV074() {
      const key=this._storageKeyV074();
      if (this._standardLoadedKeyV074===key) return;
      this._standardLoadedKeyV074=key;
      let scale=1;
      try { scale=clampScaleV074(localStorage.getItem(key) || 1); } catch (_error) { scale=1; }
      this._standardStateV074={scale,x:0,y:0};
    }
    _persistStandardStateV074() {
      try { localStorage.setItem(this._storageKeyV074(),this._standardStateV074.scale.toFixed(3)); } catch (_error) { /* private WebView */ }
    }

    _installNikaZoom() {
      const root=this.shadowRoot;
      const viewport=root?.getElementById("app-content");
      const surface=root?.getElementById("nika-zoom-surface");
      if (!viewport || !surface) return;
      this._loadStandardStateV074();
      root.querySelectorAll(".nika-safe-zoom-v072,.nika-zoom-dock").forEach((node)=>node.remove());
      if (viewport.dataset.standardZoomV074!=="true") {
        viewport.dataset.standardZoomV074="true";
        viewport.addEventListener("touchstart",this._standardTouchStartV074,{passive:false});
        viewport.addEventListener("touchmove",this._standardTouchMoveV074,{passive:false});
        viewport.addEventListener("touchend",this._standardTouchEndV074,{passive:true});
        viewport.addEventListener("touchcancel",this._standardTouchCancelV074,{passive:true});
        viewport.addEventListener("click",this._standardClickGuardV074,{capture:true});
      }
      this._standardResizeObserverV074?.disconnect();
      if (typeof ResizeObserver==="function") { this._standardResizeObserverV074=new ResizeObserver(this._standardResizeV074);this._standardResizeObserverV074.observe(surface); }
      window.removeEventListener("resize",this._standardResizeV074);
      window.visualViewport?.removeEventListener("resize",this._standardResizeV074);
      window.addEventListener("resize",this._standardResizeV074,{passive:true});
      window.visualViewport?.addEventListener("resize",this._standardResizeV074,{passive:true});
      this._scheduleStandardMeasureV074();
    }

    _teardownNikaZoom() {
      const viewport=this.shadowRoot?.getElementById("app-content");
      viewport?.removeEventListener("touchstart",this._standardTouchStartV074);
      viewport?.removeEventListener("touchmove",this._standardTouchMoveV074);
      viewport?.removeEventListener("touchend",this._standardTouchEndV074);
      viewport?.removeEventListener("touchcancel",this._standardTouchCancelV074);
      viewport?.removeEventListener("click",this._standardClickGuardV074,{capture:true});
      if (viewport) delete viewport.dataset.standardZoomV074;
      this._standardResizeObserverV074?.disconnect();
      window.removeEventListener("resize",this._standardResizeV074);
      window.visualViewport?.removeEventListener("resize",this._standardResizeV074);
      cancelAnimationFrame(this._standardFrameV074);
    }

    _scheduleStandardMeasureV074() {
      cancelAnimationFrame(this._standardFrameV074);
      this._standardFrameV074=requestAnimationFrame(()=>this._applyStandardZoomV074(this._standardStateV074.scale,{remeasure:true}));
    }
    _measureStandardV074() {
      const viewport=this.shadowRoot?.getElementById("app-content");
      const surface=this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!viewport || !surface || viewport.clientWidth<=0) return false;
      this._standardBaseWidthV074=Math.max(1,viewport.clientWidth);
      surface.style.width=`${this._standardBaseWidthV074}px`;
      const rendered=surface.getBoundingClientRect().height/Math.max(this._standardStateV074.scale,.01);
      this._standardBaseHeightV074=Math.max(1,surface.scrollHeight,Number.isFinite(rendered)?rendered:0);
      return true;
    }
    _boundsV074() {
      const viewport=this.shadowRoot?.getElementById("app-content");
      const s=this._standardStateV074;
      return {minX:Math.min(0,viewport.clientWidth-this._standardBaseWidthV074*s.scale),minY:Math.min(0,viewport.clientHeight-this._standardBaseHeightV074*s.scale),overflowX:this._standardBaseWidthV074*s.scale>viewport.clientWidth+.5,overflowY:this._standardBaseHeightV074*s.scale>viewport.clientHeight+.5};
    }
    _clampStandardV074() {
      const s=this._standardStateV074;
      if (s.scale<=1) { s.x=0;s.y=0;return; }
      const b=this._boundsV074();
      s.x=b.overflowX?Math.min(0,Math.max(b.minX,s.x)):0;
      s.y=b.overflowY?Math.min(0,Math.max(b.minY,s.y)):0;
    }
    _applyStandardZoomV074(value,options={}) {
      const viewport=this.shadowRoot?.getElementById("app-content");
      const stage=this.shadowRoot?.getElementById("nika-zoom-stage");
      const surface=this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!viewport || !stage || !surface) return;
      const s=this._standardStateV074;
      s.scale=clampScaleV074(value??s.scale);
      if (options.remeasure || this._standardBaseWidthV074<=1) if (!this._measureStandardV074()) return;
      this._clampStandardV074();
      const native=s.scale<=1;
      viewport.classList.toggle("native-scroll-v074",native);
      viewport.classList.toggle("zoomed-v074",!native);
      stage.style.width=`${Math.max(viewport.clientWidth,this._standardBaseWidthV074*s.scale)}px`;
      stage.style.height=`${Math.max(viewport.clientHeight,this._standardBaseHeightV074*s.scale)}px`;
      surface.style.marginLeft="0";
      surface.style.transform=native?`scale(${s.scale})`:`translate3d(${s.x}px,${s.y}px,0) scale(${s.scale})`;
      if (!native) { viewport.scrollLeft=0;viewport.scrollTop=0; }
      this._nikaZoomScale=s.scale;
      if (options.persist) this._persistStandardStateV074();
    }
    _applyNikaZoom(value,options={}) { this._applyStandardZoomV074(value,options); }
    _applySafeZoomV072(value,options={}) { this._applyStandardZoomV074(value,options); }
    _scheduleSafeZoomMeasureV072() { this._scheduleStandardMeasureV074(); }

    _contentPointV074(focal) {
      const viewport=this.shadowRoot.getElementById("app-content");
      const s=this._standardStateV074;
      return s.scale<=1?{x:focal.x/s.scale,y:(viewport.scrollTop+focal.y)/s.scale}:{x:(focal.x-s.x)/s.scale,y:(focal.y-s.y)/s.scale};
    }
    _setAroundV074(value,focal,anchor) {
      const viewport=this.shadowRoot.getElementById("app-content");
      const s=this._standardStateV074;
      s.scale=clampScaleV074(value);
      if (s.scale>1) { s.x=focal.x-anchor.x*s.scale;s.y=focal.y-anchor.y*s.scale;this._applyStandardZoomV074(s.scale); }
      else { s.x=0;s.y=0;this._applyStandardZoomV074(s.scale);viewport.scrollLeft=0;viewport.scrollTop=Math.max(0,anchor.y*s.scale-focal.y); }
    }
    _showResetV074() {
      const viewport=this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      let toast=viewport.querySelector(":scope > .zoom-toast-v074");
      if (!toast) { toast=document.createElement("div");toast.className="zoom-toast-v074";toast.setAttribute("role","status");toast.textContent="Масштаб 100%";viewport.append(toast); }
      clearTimeout(this._standardToastTimerV074);requestAnimationFrame(()=>toast.classList.add("visible"));this._standardToastTimerV074=setTimeout(()=>toast.classList.remove("visible"),1250);
    }
    _resetStandardV074(notify=true) {
      const viewport=this.shadowRoot?.getElementById("app-content");
      this._standardStateV074={scale:1,x:0,y:0};
      viewport?.scrollTo({left:0,top:0,behavior:"auto"});
      this._applyStandardZoomV074(1,{persist:true});
      if (notify) this._showResetV074();
    }

    _onStandardTouchStartV074(event) {
      const viewport=this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      if (event.touches.length>=2) {
        const [a,b]=event.touches;const focal=midpointV074(a,b,viewport);
        this._standardMultiV074=true;this._standardPanV074=null;
        this._standardPinchV074={distance:Math.max(1,distanceV074(a,b)),scale:this._standardStateV074.scale,anchor:this._contentPointV074(focal),startedAt:performance.now(),midpoint:pageMidpointV074(a,b),moved:false};
        this._standardGuardUntilV074=Infinity;
        Array.from(event.touches).forEach((touch)=>cancelHoldV074(deepElementV074(this.shadowRoot,touch.clientX,touch.clientY)));
        event.preventDefault();
      } else if (event.touches.length===1 && this._standardStateV074.scale>1 && !this._standardMultiV074) {
        const t=event.touches[0];this._standardPanV074={clientX:t.clientX,clientY:t.clientY,x:this._standardStateV074.x,y:this._standardStateV074.y,target:deepElementV074(this.shadowRoot,t.clientX,t.clientY)||event.target,moved:false};
      }
    }
    _onStandardTouchMoveV074(event) {
      const viewport=this.shadowRoot?.getElementById("app-content");
      const pinch=this._standardPinchV074;
      if (event.touches.length>=2 && pinch) {
        const [a,b]=event.touches;const focal=midpointV074(a,b,viewport);const current=distanceV074(a,b);
        this._setAroundV074(pinch.scale*current/pinch.distance,focal,pinch.anchor);
        if (pointDistanceV074(pinch.midpoint,pageMidpointV074(a,b))>TAP_MOVE_V074 || Math.abs(current-pinch.distance)>TAP_MOVE_V074) pinch.moved=true;
        event.preventDefault();return;
      }
      const pan=this._standardPanV074;if (!pan || event.touches.length!==1 || this._standardStateV074.scale<=1) return;
      const t=event.touches[0],dx=t.clientX-pan.clientX,dy=t.clientY-pan.clientY;
      if (!pan.moved && Math.hypot(dx,dy)<PAN_THRESHOLD_V074) return;
      if (!pan.moved) {pan.moved=true;this._standardGuardUntilV074=Infinity;cancelHoldV074(pan.target);}
      const b=this._boundsV074();if (b.overflowX)this._standardStateV074.x=pan.x+dx;if(b.overflowY)this._standardStateV074.y=pan.y+dy;
      this._applyStandardZoomV074(this._standardStateV074.scale);event.preventDefault();
    }
    _onStandardTouchEndV074(event) {
      if (this._standardMultiV074 && event.touches.length===1) {this._standardPinchV074=null;this._standardPanV074=null;return;}
      if (event.touches.length) return;
      const completed=this._standardPinchV074,wasMulti=this._standardMultiV074,moved=Boolean(this._standardPanV074?.moved);
      this._standardPinchV074=null;this._standardPanV074=null;this._standardMultiV074=false;
      const s=this._standardStateV074;
      if(s.scale>=SNAP_MIN_V074&&s.scale<=SNAP_MAX_V074&&s.scale!==1){s.scale=1;s.x=0;s.y=0;this._applyStandardZoomV074(1,{persist:true});this._showResetV074();}else this._applyStandardZoomV074(s.scale,{persist:true});
      const now=performance.now();
      if(wasMulti){this._standardGuardUntilV074=now+GUARD_MS_V074;const isTap=completed&&!completed.moved&&now-completed.startedAt<=TAP_DURATION_V074;if(isTap){const prior=this._standardTwoTapV074;if(prior&&now-prior.at<=DOUBLE_TAP_DELAY_V074&&pointDistanceV074(prior.midpoint,completed.midpoint)<=48){this._standardTwoTapV074=null;this._resetStandardV074(true);}else this._standardTwoTapV074={at:now,midpoint:completed.midpoint};}else this._standardTwoTapV074=null;}else if(moved)this._standardGuardUntilV074=now+GUARD_MS_V074;
    }
    _onStandardTouchCancelV074(){this._standardPinchV074=null;this._standardPanV074=null;this._standardMultiV074=false;this._applyStandardZoomV074(this._standardStateV074.scale,{persist:true});this._standardGuardUntilV074=performance.now()+GUARD_MS_V074;}
    _onStandardClickGuardV074(event){if(this._standardGuardUntilV074===Infinity||performance.now()<Number(this._standardGuardUntilV074||0)){event.preventDefault();event.stopImmediatePropagation();}}

    _setView(view) {
      if (view===this._activeView) return;
      super._setView(view);
      const viewport=this.shadowRoot?.getElementById("app-content");
      this._standardStateV074.x=0;this._standardStateV074.y=0;
      viewport?.scrollTo({left:0,top:0,behavior:"auto"});
      queueMicrotask(()=>this._scheduleStandardMeasureV074());
    }

    _renderShell() {
      super._renderShell();
      const root=this.shadowRoot;if(!root)return;
      root.querySelectorAll(".nika-safe-zoom-v072,.nika-zoom-dock").forEach((node)=>node.remove());
      if(!root.querySelector("style[data-nikas-standard-v074]")){
        const style=document.createElement("style");style.dataset.nikasStandardV074="true";style.textContent=`
          .nika-header{display:grid!important;grid-template-columns:52px minmax(0,1fr) 52px!important;min-height:calc(62px + env(safe-area-inset-top,0px))!important;padding:calc(env(safe-area-inset-top,0px)) max(8px,env(safe-area-inset-right,0px)) 0 max(8px,env(safe-area-inset-left,0px))!important;align-items:center!important;gap:0!important}
          .nika-header .menu,.nika-header .refresh{width:44px!important;min-width:44px!important;height:44px!important;min-height:44px!important;padding:0!important;border-radius:16px!important;border:1px solid var(--shell-border,var(--divider-color))!important;background:var(--card-background-color)!important;box-shadow:var(--ha-card-box-shadow,0 2px 8px rgba(0,0,0,.12))!important;display:grid!important;place-items:center!important}
          .nika-header .menu{grid-column:1!important;justify-self:start!important;color:var(--primary-text-color)!important}.nika-header .refresh{grid-column:3!important;justify-self:end!important;color:var(--primary-color)!important}.nika-header .menu ha-icon,.nika-header .refresh ha-icon{--mdc-icon-size:25px!important}
          .nika-header .title{grid-column:2!important;grid-row:1!important;text-align:center!important}.nika-header .title strong{font-size:21px!important;font-weight:800!important}.nika-header .title span{font-size:12px!important;font-weight:560!important;color:var(--secondary-text-color)!important}
          .nika-tabbar{position:relative!important;width:100%!important;padding:4px max(4px,env(safe-area-inset-right,0px)) calc(4px + env(safe-area-inset-bottom,0px)) max(4px,env(safe-area-inset-left,0px))!important;border-top:1px solid var(--shell-border,var(--divider-color))!important;background:var(--card-background-color)!important;box-shadow:0 -3px 14px rgba(0,0,0,.08)!important;gap:1px!important}
          .nika-tabbar button{min-height:52px!important;border-radius:14px!important;color:var(--secondary-text-color)!important;background:transparent!important;box-shadow:none!important}.nika-tabbar button.active{color:var(--primary-color)!important;background:color-mix(in srgb,var(--primary-color) 11%,transparent)!important}.nika-tabbar button.active::before{display:none!important}
          .nika-tabbar ha-icon{--mdc-icon-size:28px!important}.nika-tabbar span{font-size:12px!important;font-weight:700!important;white-space:nowrap!important}
          #app-content.native-scroll-v074{overflow-x:hidden!important;overflow-y:auto!important;touch-action:pan-y!important;-webkit-overflow-scrolling:touch!important}#app-content.zoomed-v074{overflow:hidden!important;touch-action:none!important}
          #nika-zoom-stage{position:relative!important;min-width:100%!important;min-height:100%!important;overflow:visible!important}#nika-zoom-surface{position:absolute!important;left:0!important;top:0!important;margin:0!important;transform-origin:0 0!important;will-change:transform!important}
          .nika-safe-zoom-v072,.nika-zoom-dock{display:none!important}.zoom-toast-v074{position:fixed;left:50%;bottom:calc(76px + env(safe-area-inset-bottom,0px));transform:translate(-50%,8px);opacity:0;pointer-events:none;padding:8px 13px;border-radius:999px;background:rgba(20,24,31,.88);color:#fff;font-size:12px;font-weight:700;transition:.18s;z-index:50}.zoom-toast-v074.visible{opacity:1;transform:translate(-50%,0)}
          @media(max-width:390px){.nika-header{grid-template-columns:48px minmax(0,1fr) 48px!important;min-height:calc(60px + env(safe-area-inset-top,0px))!important}}
        `;root.append(style);
      }
      const version=root.querySelector(".title span");if(version)version.textContent="Network Control Center · UI v0.7.4";
      this._installNikaZoom();
    }
  }
  customElements.define("keenetic-hero-app-panel-v074",KeeneticHeroAppPanelV074);
}
