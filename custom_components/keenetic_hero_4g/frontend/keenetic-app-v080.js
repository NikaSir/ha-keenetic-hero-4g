await import("./keenetic-app-v076.js");

const MIN_SCALE_V080 = 0.75;
const MAX_SCALE_V080 = 2;
const SNAP_MIN_V080 = 0.97;
const SNAP_MAX_V080 = 1.03;
const DOUBLE_TAP_MS_V080 = 360;
const TAP_MS_V080 = 280;
const TAP_MOVE_V080 = 14;
const PAN_START_V080 = 6;
const CLICK_GUARD_MS_V080 = 380;

const clampScaleV080 = (value) => Math.min(MAX_SCALE_V080, Math.max(MIN_SCALE_V080, Number(value) || 1));
const distanceV080 = (a, b) => Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
const pointDistanceV080 = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const pageMidpointV080 = (a, b) => ({ x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 });

function midpointV080(a, b, viewport) {
  const rect = viewport.getBoundingClientRect();
  return {
    x: (a.clientX + b.clientX) / 2 - rect.left,
    y: (a.clientY + b.clientY) / 2 - rect.top,
  };
}

function deepElementV080(root, x, y) {
  let element = root?.elementFromPoint?.(x, y) || document.elementFromPoint(x, y);
  const seen = new Set();
  while (element?.shadowRoot?.elementFromPoint && !seen.has(element)) {
    seen.add(element);
    const inner = element.shadowRoot.elementFromPoint(x, y);
    if (!inner || inner === element) break;
    element = inner;
  }
  return element;
}

function cancelEntityHoldV080(target) {
  const entity = target?.closest?.("[data-entity]") || target;
  if (!entity?.dispatchEvent) return;
  const event = typeof PointerEvent === "function"
    ? new PointerEvent("pointercancel", { bubbles: true, composed: true })
    : new Event("pointercancel", { bubbles: true, composed: true });
  entity.dispatchEvent(event);
}

function installOverviewCompositionV080(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v080]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV080 = "true";
  style.textContent = `
    .v050-status-copy{
      left:14px!important;
      top:14px!important;
      max-width:calc(100% - 190px)!important;
    }
    .v050-status-copy h1{max-width:100%!important;line-height:1.04!important}
    .v061-topology-card{
      min-width:116px!important;
      max-width:136px!important;
      min-height:58px!important;
      padding:8px 9px!important;
      gap:7px!important;
      border-radius:16px!important;
    }
    .v061-topology-card ha-icon{--mdc-icon-size:23px!important;flex:0 0 auto!important}
    .v061-topology-card>div{min-width:0!important}
    .v061-topology-card strong{
      font-size:14px!important;
      line-height:1.12!important;
    }
    .v061-topology-card span{
      margin-top:3px!important;
      font-size:12px!important;
      line-height:1.15!important;
    }
    .v061-topology-card strong,.v061-topology-card span{
      display:block!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      white-space:nowrap!important;
    }
    .v061-lte{left:2.6%!important;top:31%!important}
    .v061-cable{left:2.6%!important;top:46%!important}
    .v061-lan{right:2.6%!important;top:46%!important}
    .v060-router{top:54%!important;width:44%!important;max-width:320px!important}
    .v050-kpi-row{bottom:77px!important;z-index:8!important}
    .v050-reserve-strip{bottom:10px!important;z-index:8!important}
    .v061-topology-layer{z-index:4!important}
    .v060-router{z-index:6!important}
    @media(max-width:390px){
      .v050-status-copy{max-width:calc(100% - 176px)!important}
      .v061-topology-card{min-width:106px!important;max-width:122px!important;padding:7px 8px!important}
      .v061-topology-card ha-icon{--mdc-icon-size:21px!important}
      .v060-router{width:42%!important}
    }
  `;
  root.append(style);
}

function tuneOverviewPathsV080(root) {
  if (!root) return;
  const paths = {
    ".v061-lte-line": "M190 184 L438 304",
    ".v061-cable-line": "M190 270 L438 316",
    ".v061-lan-line": "M562 316 L820 270",
  };
  for (const [selector, d] of Object.entries(paths)) {
    root.querySelectorAll(selector).forEach((path) => {
      if (path.getAttribute("d") !== d) path.setAttribute("d", d);
    });
  }
}

if (!customElements.get("keenetic-hero-app-panel-v080")) {
  class KeeneticHeroAppPanelV080 extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._hass = null;
      this._panel = null;
      this._route = null;
      this._child = null;
      this._activeView = this._viewFromLocation();
      this._zoom = { scale: 1, x: 0, y: 0 };
      this._baseWidth = 1;
      this._baseHeight = 1;
      this._pinch = null;
      this._pan = null;
      this._multiTouch = false;
      this._lastTwoFingerTap = null;
      this._guardUntil = 0;
      this._storageKey = null;
      this._hashHandler = () => this._syncHashView();
      this._resizeHandler = () => this._scheduleMeasure();
      this._touchStartHandler = (event) => this._onTouchStart(event);
      this._touchMoveHandler = (event) => this._onTouchMove(event);
      this._touchEndHandler = (event) => this._onTouchEnd(event);
      this._touchCancelHandler = () => this._onTouchCancel();
      this._clickGuardHandler = (event) => this._onClickGuard(event);
      this._childViewHandler = (event) => this._onChildViewRequest(event);
    }

    set hass(value) {
      this._hass = value;
      this._mountChild();
      if (this._child) this._child.hass = value;
    }

    set panel(value) {
      this._panel = value;
      this._loadStoredScale();
      this._mountChild();
      if (this._child) this._child.panel = value;
    }

    set route(value) {
      this._route = value;
      this._mountChild();
      if (this._child) this._child.route = value;
    }

    connectedCallback() {
      this._mountShell();
      this._mountChild();
      window.addEventListener("hashchange", this._hashHandler);
      window.addEventListener("resize", this._resizeHandler, { passive: true });
      window.visualViewport?.addEventListener("resize", this._resizeHandler, { passive: true });
      this._scheduleAfterMount();
    }

    disconnectedCallback() {
      window.removeEventListener("hashchange", this._hashHandler);
      window.removeEventListener("resize", this._resizeHandler);
      window.visualViewport?.removeEventListener("resize", this._resizeHandler);
      this._childObserver?.disconnect();
      this._contentResizeObserver?.disconnect();
      cancelAnimationFrame(this._measureFrame);
      cancelAnimationFrame(this._afterMountFrame);
      clearTimeout(this._toastTimer);
      this._unbindGestures();
    }

    _viewFromLocation() {
      const value = (location.hash || "#overview").slice(1).toLowerCase();
      return ["overview", "wan", "failover", "traffic", "diagnostics", "system"].includes(value)
        ? value
        : "overview";
    }

    _syncHashView() {
      const view = this._viewFromLocation();
      if (view !== this._activeView) this._setView(view, false);
    }

    _mountShell() {
      if (this.shadowRoot.getElementById("app-shell-v080")) return;
      this.shadowRoot.innerHTML = `
        <style>
          :host{
            --safe-top:var(--safe-area-inset-top,env(safe-area-inset-top,0px));
            --safe-right:var(--safe-area-inset-right,env(safe-area-inset-right,0px));
            --safe-bottom:var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px));
            --safe-left:var(--safe-area-inset-left,env(safe-area-inset-left,0px));
            display:block;
            width:100%;
            height:100vh;
            height:100dvh;
            min-height:0;
            max-height:100dvh;
            overflow:hidden;
            color:var(--primary-text-color);
            background:var(--primary-background-color);
            font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif));
          }
          *{box-sizing:border-box}
          #app-shell-v080{
            width:100%;height:100%;min-height:0;
            display:grid;grid-template-rows:auto minmax(0,1fr) auto;
            overflow:hidden;overscroll-behavior:none;
            background:var(--primary-background-color);
          }
          .header-v080{
            grid-row:1;min-width:0;
            min-height:calc(62px + var(--safe-top));
            padding:var(--safe-top) max(8px,var(--safe-right)) 0 max(8px,var(--safe-left));
            display:grid;grid-template-columns:52px minmax(0,1fr) 52px;
            align-items:center;
            background:var(--card-background-color);
            border-bottom:1px solid var(--divider-color);
            z-index:10;
          }
          .header-action-v080{
            width:44px;height:44px;margin:0;padding:0;
            display:grid;place-items:center;
            border:1px solid var(--divider-color);border-radius:16px;
            background:var(--card-background-color);color:var(--primary-text-color);
            box-shadow:0 7px 20px rgba(23,45,76,.08);
            appearance:none;-webkit-appearance:none;font:inherit;
          }
          #menu-v080{grid-column:1;justify-self:start}
          #refresh-v080{grid-column:3;justify-self:end;color:var(--primary-color)}
          .header-action-v080 ha-icon{width:25px;height:25px;--mdc-icon-size:25px}
          .title-v080{grid-column:2;grid-row:1;min-width:0;text-align:center;line-height:1}
          .title-v080 strong,.title-v080 span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .title-v080 strong{font-size:23px;font-weight:800;line-height:1.08;letter-spacing:-.02em}
          .title-v080 span{margin-top:2px;font-size:14px;font-weight:560;line-height:1.15;color:var(--secondary-text-color)}
          #work-viewport-v080{
            grid-row:2;min-width:0;min-height:0;
            overflow-x:hidden;overflow-y:auto;
            overscroll-behavior-x:none;overscroll-behavior-y:none;
            -webkit-overflow-scrolling:touch;
            touch-action:pan-y;
            scrollbar-width:none;
          }
          #work-viewport-v080::-webkit-scrollbar{display:none}
          #zoom-stage-v080{position:relative;width:100%;min-height:100%}
          #zoom-surface-v080{position:relative;width:100%;min-height:100%;transform-origin:0 0}
          #zoom-surface-v080>keenetic-hero-panel{display:block;min-height:100%}
          #work-viewport-v080.scaled-v080 #zoom-surface-v080{position:absolute;left:0;top:0;will-change:transform}
          #work-viewport-v080.zoomed-v080{overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none}
          .tabbar-v080{
            grid-row:3;width:100%;min-width:0;
            display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px;
            padding:6px max(6px,var(--safe-right)) calc(6px + var(--safe-bottom)) max(6px,var(--safe-left));
            background:var(--card-background-color);
            border-top:1px solid var(--divider-color);
            box-shadow:0 -4px 18px rgba(23,45,76,.08);z-index:10;
          }
          .tabbar-v080 button{
            min-width:0;min-height:52px;padding:3px 2px;
            display:grid;place-items:center;align-content:center;gap:3px;
            border:0;border-radius:16px;background:transparent;
            color:var(--secondary-text-color);font:inherit;
          }
          .tabbar-v080 button.active{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 11%,transparent)}
          .tabbar-v080 ha-icon{--mdc-icon-size:28px}
          .tabbar-v080 span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:700;line-height:1.1}
          .zoom-toast-v080{
            position:fixed;left:50%;bottom:calc(78px + var(--safe-bottom));z-index:30;
            transform:translate(-50%,8px);opacity:0;pointer-events:none;
            padding:8px 13px;border-radius:999px;background:rgba(20,24,31,.88);
            color:#fff;font-size:12px;font-weight:700;transition:.18s;
          }
          .zoom-toast-v080.visible{opacity:1;transform:translate(-50%,0)}
          @media(max-width:390px){
            .header-v080{grid-template-columns:48px minmax(0,1fr) 48px;min-height:calc(60px + var(--safe-top))}
            .title-v080 strong{font-size:21px}.title-v080 span{font-size:13px}
          }
        </style>
        <div id="app-shell-v080">
          <header class="header-v080" aria-label="Keenetic">
            <button id="menu-v080" class="header-action-v080" type="button" aria-label="Открыть меню Home Assistant"><ha-icon icon="mdi:menu"></ha-icon></button>
            <div class="title-v080"><strong>Keenetic Hero 4G+</strong><span>Network Control Center</span></div>
            <button id="refresh-v080" class="header-action-v080" type="button" aria-label="Обновить"><ha-icon icon="mdi:refresh"></ha-icon></button>
          </header>
          <div id="work-viewport-v080">
            <div id="zoom-stage-v080"><div id="zoom-surface-v080"></div></div>
          </div>
          <nav id="tabbar-v080" class="tabbar-v080" aria-label="Разделы Keenetic"></nav>
          <div id="zoom-toast-v080" class="zoom-toast-v080" role="status">Масштаб 100%</div>
        </div>`;
      this.shadowRoot.getElementById("menu-v080").addEventListener("click", (event) => {
        event.currentTarget.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
      });
      this.shadowRoot.getElementById("refresh-v080").addEventListener("click", () => this._child?._loadBootstrap?.(false));
      this._renderTabbar();
      this._bindGestures();
    }

    _mountChild() {
      if (!this.isConnected || !this.shadowRoot.getElementById("zoom-surface-v080")) return;
      if (!this._child) {
        this._child = document.createElement("keenetic-hero-panel");
        this._child._view = this._activeView;
        this._child.addEventListener("keenetic-view-request", this._childViewHandler);
        this.shadowRoot.getElementById("zoom-surface-v080").append(this._child);
        this._observeChild();
      }
      if (this._panel && this._sentPanel !== this._panel) {
        this._sentPanel = this._panel;
        this._child.panel = this._panel;
      }
      if (this._route && this._sentRoute !== this._route) {
        this._sentRoute = this._route;
        this._child.route = this._route;
      }
      if (this._hass) this._child.hass = this._hass;
    }

    _observeChild() {
      this._childObserver?.disconnect();
      const finishMount = () => {
        if (!this._child?.shadowRoot?.querySelector(".shell")) return false;
        this._childObserver?.disconnect();
        this._childObserver = null;
        this._scheduleAfterMount();
        return true;
      };
      if (finishMount()) return;
      this._childObserver = new MutationObserver(() => finishMount());
      this._childObserver.observe(this._child.shadowRoot, { childList: true, subtree: true });
    }

    _scheduleAfterMount() {
      cancelAnimationFrame(this._afterMountFrame);
      this._afterMountFrame = requestAnimationFrame(() => {
        const root = this._child?.shadowRoot;
        installOverviewCompositionV080(root);
        tuneOverviewPathsV080(root);
        this._observeActiveContent();
        if (this._zoom.scale !== 1) this._scheduleMeasure();
      });
    }

    _observeActiveContent() {
      this._contentResizeObserver?.disconnect();
      if (typeof ResizeObserver !== "function") return;
      this._contentResizeObserver = new ResizeObserver(() => {
        if (this._zoom.scale === 1) return;
        if (this._pinch || this._pan || this._multiTouch) {
          this._measureAfterGesture = true;
          return;
        }
        this._scheduleMeasure();
      });
      const root = this._child?.shadowRoot;
      const shell = root?.querySelector(".shell");
      const active = root?.querySelector(".v075-view-slot:not([hidden])");
      if (shell) this._contentResizeObserver.observe(shell);
      if (active && active !== shell) this._contentResizeObserver.observe(active);
    }

    _renderTabbar() {
      const nav = this.shadowRoot.getElementById("tabbar-v080");
      if (!nav) return;
      const items = [
        ["overview", "mdi:view-dashboard-outline", "Обзор"],
        ["wan", "mdi:wan", "Каналы"],
        ["failover", "mdi:swap-horizontal-bold", "Failover"],
        ["traffic", "mdi:chart-timeline-variant", "Трафик"],
        ["diagnostics", "mdi:stethoscope", "Диагн."],
      ];
      if (!nav.firstElementChild) {
        for (const [view, icon, label] of items) {
          const button = document.createElement("button");
          button.type = "button";
          button.dataset.view = view;
          button.innerHTML = `<ha-icon icon="${icon}"></ha-icon><span>${label}</span>`;
          button.addEventListener("click", () => this._setView(view, true));
          nav.append(button);
        }
      }
      const active = this._activeView === "system" ? "diagnostics" : this._activeView;
      nav.querySelectorAll("[data-view]").forEach((button) => {
        const selected = button.dataset.view === active;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-current", selected ? "page" : "false");
      });
    }

    _setView(view, updateLocation = true) {
      if (!view || view === this._activeView) return;
      this._activeView = view;
      if (updateLocation) history.replaceState(null, "", `${location.pathname}${location.search}#${view}`);
      this._renderTabbar();
      this._resetZoom(false);
      if (this._child) {
        this._child._view = view;
        this._child._scheduleRender?.();
        this._child._loadViewData?.();
      }
      requestAnimationFrame(() => requestAnimationFrame(() => this._scheduleAfterMount()));
    }

    _onChildViewRequest(event) {
      const view = event?.detail?.view;
      if (!["overview", "wan", "failover", "traffic", "diagnostics", "system"].includes(view)) return;
      event.preventDefault();
      this._setView(view, true);
    }

    _bindGestures() {
      const viewport = this.shadowRoot.getElementById("work-viewport-v080");
      if (!viewport || this._gestureViewport === viewport) return;
      this._unbindGestures();
      viewport.addEventListener("touchstart", this._touchStartHandler, { capture: true, passive: false });
      viewport.addEventListener("touchmove", this._touchMoveHandler, { capture: true, passive: false });
      viewport.addEventListener("touchend", this._touchEndHandler, { capture: true, passive: true });
      viewport.addEventListener("touchcancel", this._touchCancelHandler, { capture: true, passive: true });
      viewport.addEventListener("click", this._clickGuardHandler, { capture: true });
      this._gestureViewport = viewport;
    }

    _unbindGestures() {
      const viewport = this._gestureViewport;
      if (!viewport) return;
      viewport.removeEventListener("touchstart", this._touchStartHandler, true);
      viewport.removeEventListener("touchmove", this._touchMoveHandler, true);
      viewport.removeEventListener("touchend", this._touchEndHandler, true);
      viewport.removeEventListener("touchcancel", this._touchCancelHandler, true);
      viewport.removeEventListener("click", this._clickGuardHandler, true);
      this._gestureViewport = null;
    }

    _loadStoredScale() {
      const key = `nikas.keenetic.cleanZoom.v1:${this._panel?.config?.entry_id || "default"}`;
      if (this._storageKey === key) return;
      this._storageKey = key;
      let scale = 1;
      try { scale = clampScaleV080(localStorage.getItem(key) || 1); } catch (_error) { scale = 1; }
      this._zoom = { scale, x: 0, y: 0 };
      if (scale !== 1) this._scheduleMeasure();
    }

    _persistScale() {
      try { localStorage.setItem(this._storageKey, this._zoom.scale.toFixed(3)); } catch (_error) { /* private WebView */ }
    }

    _nodes() {
      return {
        viewport: this.shadowRoot.getElementById("work-viewport-v080"),
        stage: this.shadowRoot.getElementById("zoom-stage-v080"),
        surface: this.shadowRoot.getElementById("zoom-surface-v080"),
      };
    }

    _measure() {
      const { viewport } = this._nodes();
      if (!viewport || viewport.clientWidth <= 0) return false;
      const root = this._child?.shadowRoot;
      const shell = root?.querySelector(".shell");
      const main = root?.querySelector(".shell>main");
      const active = root?.querySelector(".v075-view-slot:not([hidden])");
      let shellPadding = 0;
      if (shell && typeof getComputedStyle === "function") {
        const style = getComputedStyle(shell);
        shellPadding = (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0);
      }
      const contentHeight = Math.max(active?.scrollHeight || 0, main?.scrollHeight || 0) + shellPadding;
      this._baseWidth = viewport.clientWidth;
      this._baseHeight = Math.max(
        viewport.clientHeight,
        contentHeight,
      );
      return this._baseHeight > 0;
    }

    _scheduleMeasure() {
      cancelAnimationFrame(this._measureFrame);
      this._measureFrame = requestAnimationFrame(() => {
        if (!this._measure()) return;
        this._applyScale(this._zoom.scale, { persist: false });
      });
    }

    _contentPoint(focal) {
      const { viewport } = this._nodes();
      const state = this._zoom;
      if (state.scale > 1) return { x: (focal.x - state.x) / state.scale, y: (focal.y - state.y) / state.scale };
      return { x: focal.x / state.scale, y: (viewport.scrollTop + focal.y) / state.scale };
    }

    _clampPan() {
      const { viewport } = this._nodes();
      const state = this._zoom;
      const minX = Math.min(0, viewport.clientWidth - this._baseWidth * state.scale);
      const minY = Math.min(0, viewport.clientHeight - this._baseHeight * state.scale);
      state.x = Math.min(0, Math.max(minX, state.x));
      state.y = Math.min(0, Math.max(minY, state.y));
    }

    _applyScale(value, options = {}) {
      const { viewport, stage, surface } = this._nodes();
      if (!viewport || !stage || !surface) return;
      const state = this._zoom;
      state.scale = clampScaleV080(value);
      if (state.scale === 1) {
        state.x = 0;state.y = 0;
        viewport.classList.remove("scaled-v080", "zoomed-v080");
        stage.style.width = "";stage.style.height = "";stage.style.minHeight = "";
        surface.style.width = "";surface.style.height = "";surface.style.transform = "";
        if (Number.isFinite(options.scrollTop)) viewport.scrollTop = Math.max(0, options.scrollTop);
      } else {
        if ((options.remeasure || this._baseHeight <= 1) && !this._measure()) return;
        viewport.classList.add("scaled-v080");
        surface.style.width = `${this._baseWidth}px`;
        surface.style.height = `${this._baseHeight}px`;
        if (state.scale > 1) {
          viewport.classList.add("zoomed-v080");
          viewport.scrollTop = 0;
          if (options.focal && options.anchor) {
            state.x = options.focal.x - options.anchor.x * state.scale;
            state.y = options.focal.y - options.anchor.y * state.scale;
          }
          this._clampPan();
          stage.style.width = `${viewport.clientWidth}px`;
          stage.style.height = `${viewport.clientHeight}px`;
          stage.style.minHeight = `${viewport.clientHeight}px`;
          surface.style.transform = `translate3d(${state.x}px,${state.y}px,0) scale(${state.scale})`;
        } else {
          viewport.classList.remove("zoomed-v080");
          state.x = 0;state.y = 0;
          const height = Math.max(1, this._baseHeight * state.scale);
          stage.style.width = `${viewport.clientWidth}px`;
          stage.style.height = `${height}px`;
          stage.style.minHeight = `${height}px`;
          surface.style.transform = `scale(${state.scale})`;
          if (options.focal && options.anchor) viewport.scrollTop = Math.max(0, options.anchor.y * state.scale - options.focal.y);
        }
      }
      if (options.persist) this._persistScale();
    }

    _resetZoom(notify = true) {
      const { viewport } = this._nodes();
      this._zoom = { scale: 1, x: 0, y: 0 };
      this._applyScale(1, { scrollTop: 0, persist: true });
      viewport?.scrollTo({ left: 0, top: 0, behavior: "auto" });
      if (notify) this._showResetToast();
    }

    _showResetToast() {
      const toast = this.shadowRoot.getElementById("zoom-toast-v080");
      if (!toast) return;
      clearTimeout(this._toastTimer);
      requestAnimationFrame(() => toast.classList.add("visible"));
      this._toastTimer = setTimeout(() => toast.classList.remove("visible"), 1250);
    }

    _onTouchStart(event) {
      const { viewport } = this._nodes();
      if (!viewport) return;
      if (event.touches.length >= 2) {
        if (!this._measure()) return;
        const [a, b] = event.touches;
        const focal = midpointV080(a, b, viewport);
        this._multiTouch = true;
        this._pan = null;
        this._pinch = {
          distance: Math.max(1, distanceV080(a, b)),
          scale: this._zoom.scale,
          anchor: this._contentPoint(focal),
          startedAt: performance.now(),
          midpoint: pageMidpointV080(a, b),
          moved: false,
        };
        this._guardUntil = Infinity;
        for (const touch of event.touches) cancelEntityHoldV080(deepElementV080(this.shadowRoot, touch.clientX, touch.clientY));
        event.preventDefault();
      } else if (event.touches.length === 1 && this._zoom.scale > 1 && !this._multiTouch) {
        const touch = event.touches[0];
        this._pan = { clientX: touch.clientX, clientY: touch.clientY, x: this._zoom.x, y: this._zoom.y, moved: false };
      }
    }

    _onTouchMove(event) {
      const { viewport } = this._nodes();
      if (!viewport) return;
      if (event.touches.length >= 2 && this._pinch) {
        const [a, b] = event.touches;
        const focal = midpointV080(a, b, viewport);
        const current = distanceV080(a, b);
        const next = clampScaleV080(this._pinch.scale * current / this._pinch.distance);
        if (Math.abs(current - this._pinch.distance) > TAP_MOVE_V080 || pointDistanceV080(this._pinch.midpoint, pageMidpointV080(a, b)) > TAP_MOVE_V080) this._pinch.moved = true;
        this._applyScale(next, { focal, anchor: this._pinch.anchor });
        event.preventDefault();
        return;
      }
      if (!this._pan || event.touches.length !== 1 || this._zoom.scale <= 1 || this._multiTouch) return;
      const touch = event.touches[0];
      const dx = touch.clientX - this._pan.clientX;
      const dy = touch.clientY - this._pan.clientY;
      if (!this._pan.moved && Math.hypot(dx, dy) < PAN_START_V080) return;
      this._pan.moved = true;
      this._guardUntil = Infinity;
      this._zoom.x = this._pan.x + dx;
      this._zoom.y = this._pan.y + dy;
      this._applyScale(this._zoom.scale);
      event.preventDefault();
    }

    _onTouchEnd(event) {
      if (event.touches.length) return;
      const completed = this._pinch;
      const wasMulti = this._multiTouch;
      const movedPan = Boolean(this._pan?.moved);
      this._pinch = null;this._pan = null;this._multiTouch = false;
      const now = performance.now();
      if (this._zoom.scale >= SNAP_MIN_V080 && this._zoom.scale <= SNAP_MAX_V080 && this._zoom.scale !== 1) {
        this._resetZoom(true);
      } else {
        this._applyScale(this._zoom.scale, { persist: true });
      }
      if (wasMulti) {
        this._guardUntil = now + CLICK_GUARD_MS_V080;
        const isTap = completed && !completed.moved && now - completed.startedAt <= TAP_MS_V080;
        if (isTap) {
          const previous = this._lastTwoFingerTap;
          if (previous && now - previous.at <= DOUBLE_TAP_MS_V080 && pointDistanceV080(previous.midpoint, completed.midpoint) <= 48) {
            this._lastTwoFingerTap = null;
            this._resetZoom(true);
          } else {
            this._lastTwoFingerTap = { at: now, midpoint: completed.midpoint };
          }
        } else {
          this._lastTwoFingerTap = null;
        }
      } else if (movedPan) {
        this._guardUntil = now + CLICK_GUARD_MS_V080;
      }
      if (this._measureAfterGesture) {
        this._measureAfterGesture = false;
        this._scheduleMeasure();
      }
    }

    _onTouchCancel() {
      this._pinch = null;this._pan = null;this._multiTouch = false;
      this._applyScale(this._zoom.scale, { persist: true });
      this._guardUntil = performance.now() + CLICK_GUARD_MS_V080;
      if (this._measureAfterGesture) {
        this._measureAfterGesture = false;
        this._scheduleMeasure();
      }
    }

    _onClickGuard(event) {
      if (this._guardUntil === Infinity || performance.now() < Number(this._guardUntil || 0)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
  }

  customElements.define("keenetic-hero-app-panel-v080", KeeneticHeroAppPanelV080);
}
