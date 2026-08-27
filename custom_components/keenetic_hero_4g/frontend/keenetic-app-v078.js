await import("./keenetic-app-v077.js?v=0.7.8");

const BASE_COMPONENT_V078 = customElements.get("keenetic-hero-app-panel-v077");
const MAX_VIEWPORT_RETRIES_V078 = 24;

function installContentCompositionV078(root) {
  if (!root || root.querySelector("style[data-nikas-content-composition-v078]")) return;
  const style = document.createElement("style");
  style.dataset.nikasContentCompositionV078 = "true";
  style.textContent = `
    /* UI 0.7.8: rebalance the overview after the mandatory 12 px minimum type scale. */
    .v050-status-copy{
      top:14px!important;
      left:14px!important;
      max-width:calc(100% - 194px)!important;
    }
    .v050-status-copy h1{max-width:100%!important}
    .v061-topology-card{
      min-width:126px!important;
      max-width:148px!important;
      padding:9px 10px!important;
      gap:7px!important;
    }
    .v061-topology-card ha-icon{--mdc-icon-size:23px!important;flex:0 0 auto!important}
    .v061-topology-card>div{min-width:0!important}
    .v061-topology-card strong,.v061-topology-card span{
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      white-space:nowrap!important;
    }
    .v061-lte{left:3%!important;top:34%!important}
    .v061-cable{left:3%!important;top:50%!important}
    .v061-lan{right:3%!important;top:50%!important}
    .v060-router{top:56%!important;width:47%!important}
    @media(max-width:430px){
      .v050-status-copy{max-width:calc(100% - 180px)!important}
      .v061-topology-card{min-width:116px!important;max-width:136px!important;padding:8px 9px!important}
      .v061-lte{left:2.5%!important;top:34%!important}
      .v061-cable{left:2.5%!important;top:49%!important}
      .v061-lan{right:2.5%!important;top:49%!important}
      .v060-router{top:56%!important;width:47%!important}
    }
    @media(max-width:390px){
      .v050-status-copy{max-width:calc(100% - 174px)!important}
      .v061-topology-card{min-width:110px!important;max-width:128px!important}
      .v060-router{width:45%!important}
    }
  `;
  root.append(style);
}

function tuneTopologyPathsV078(root) {
  if (!root) return;
  const paths = {
    ".v061-cable-line": "M190 278 C285 278 350 294 438 316",
    ".v061-lan-line": "M562 316 C660 294 725 278 820 278",
  };
  for (const [selector, value] of Object.entries(paths)) {
    root.querySelectorAll(selector).forEach((path) => {
      if (path.getAttribute("d") !== value) path.setAttribute("d", value);
    });
  }
}

function contentHeightV078(panel, surface, viewport) {
  const child = panel._child;
  const childRoot = child?.shadowRoot;
  const innerShell = childRoot?.querySelector(".shell");
  const activeSlot = childRoot?.querySelector(".v075-view-slot:not([hidden])");
  const values = [
    viewport?.clientHeight,
    surface?.scrollHeight,
    child?.scrollHeight,
    child?.offsetHeight,
    innerShell?.scrollHeight,
    innerShell?.offsetHeight,
    activeSlot?.scrollHeight,
    activeSlot?.offsetHeight,
  ].map((value) => Number(value) || 0);
  return Math.max(1, ...values);
}

if (BASE_COMPONENT_V078 && !customElements.get("keenetic-hero-app-panel-v078")) {
  class KeeneticHeroAppPanelV078 extends BASE_COMPONENT_V078 {
    constructor() {
      super();
      this._viewportRetryCountV078 = 0;
      this._viewportReadyV078 = false;
      this._viewportMeasureV078 = () => this._scheduleMeasureV078();
    }

    connectedCallback() {
      super.connectedCallback();
      this._viewportRetryCountV078 = 0;
      this._viewportReadyV078 = false;
      this._scheduleViewportV078();
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._viewportFrameV078);
      cancelAnimationFrame(this._viewportMeasureFrameV078);
      this._contentResizeObserverV078?.disconnect();
      this._contentResizeObserverV078 = null;
      this._unbindViewportEventsV078();
      super.disconnectedCallback();
    }

    _viewportNodesV078() {
      const root = this.shadowRoot;
      return {
        viewport: root?.getElementById("app-content"),
        stage: root?.getElementById("nika-zoom-stage"),
        surface: root?.getElementById("nika-zoom-surface"),
      };
    }

    _scheduleViewportV078() {
      if (!this.isConnected || this._viewportReadyV078) return;
      cancelAnimationFrame(this._viewportFrameV078);
      this._viewportFrameV078 = requestAnimationFrame(() => {
        const ready = this._installViewportV078();
        if (ready) {
          this._viewportReadyV078 = true;
          this._viewportRetryCountV078 = 0;
          this._scheduleMeasureV078();
          requestAnimationFrame(() => this._scheduleMeasureV078());
          return;
        }
        this._viewportRetryCountV078 += 1;
        if (this._viewportRetryCountV078 < MAX_VIEWPORT_RETRIES_V078) this._scheduleViewportV078();
      });
    }

    _installViewportV078() {
      const { viewport, stage, surface } = this._viewportNodesV078();
      if (!viewport || !stage || !surface || !this._child) return false;
      if (this._child.parentElement !== surface) surface.append(this._child);

      /* Rebind in capture phase so gestures cannot be swallowed inside the child shadow root. */
      this._unbindViewportEventsV078();
      viewport.removeEventListener("touchstart", this._standardTouchStartV074, false);
      viewport.removeEventListener("touchmove", this._standardTouchMoveV074, false);
      viewport.removeEventListener("touchend", this._standardTouchEndV074, false);
      viewport.removeEventListener("touchcancel", this._standardTouchCancelV074, false);
      viewport.addEventListener("touchstart", this._standardTouchStartV074, { capture: true, passive: false });
      viewport.addEventListener("touchmove", this._standardTouchMoveV074, { capture: true, passive: false });
      viewport.addEventListener("touchend", this._standardTouchEndV074, { capture: true, passive: true });
      viewport.addEventListener("touchcancel", this._standardTouchCancelV074, { capture: true, passive: true });
      viewport.addEventListener("click", this._standardClickGuardV074, { capture: true });
      viewport.dataset.standardZoomV074 = "true";
      viewport.dataset.standardZoomV078 = "true";
      this._boundViewportV078 = viewport;

      this._observeActiveContentV078();
      return true;
    }

    _unbindViewportEventsV078() {
      const viewport = this._boundViewportV078;
      if (!viewport) return;
      viewport.removeEventListener("touchstart", this._standardTouchStartV074, true);
      viewport.removeEventListener("touchmove", this._standardTouchMoveV074, true);
      viewport.removeEventListener("touchend", this._standardTouchEndV074, true);
      viewport.removeEventListener("touchcancel", this._standardTouchCancelV074, true);
      viewport.removeEventListener("click", this._standardClickGuardV074, true);
      delete viewport.dataset.standardZoomV078;
      this._boundViewportV078 = null;
    }

    _observeActiveContentV078() {
      this._contentResizeObserverV078?.disconnect();
      if (typeof ResizeObserver !== "function") return;
      this._contentResizeObserverV078 = new ResizeObserver(this._viewportMeasureV078);
      const root = this._child?.shadowRoot;
      const active = root?.querySelector(".v075-view-slot:not([hidden])");
      const shell = root?.querySelector(".shell");
      if (shell) this._contentResizeObserverV078.observe(shell);
      if (active && active !== shell) this._contentResizeObserverV078.observe(active);
    }

    _scheduleMeasureV078() {
      cancelAnimationFrame(this._viewportMeasureFrameV078);
      this._viewportMeasureFrameV078 = requestAnimationFrame(() => {
        installContentCompositionV078(this._child?.shadowRoot);
        tuneTopologyPathsV078(this._child?.shadowRoot);
        this._applyStandardZoomV074(this._standardStateV074?.scale || 1, { remeasure: true });
      });
    }

    _measureStandardV074() {
      const { viewport, surface } = this._viewportNodesV078();
      if (!viewport || !surface || viewport.clientWidth <= 0) return false;
      this._standardBaseWidthV074 = Math.max(1, viewport.clientWidth);
      surface.style.width = `${this._standardBaseWidthV074}px`;
      surface.style.height = "auto";
      this._standardBaseHeightV074 = contentHeightV078(this, surface, viewport);
      surface.style.height = `${this._standardBaseHeightV074}px`;
      return true;
    }

    _applyStandardZoomV074(value, options = {}) {
      super._applyStandardZoomV074(value, options);
      const { viewport, stage, surface } = this._viewportNodesV078();
      if (!viewport || !stage || !surface || !this._standardStateV074) return;
      const scale = this._standardStateV074.scale;
      const stageHeight = Math.max(viewport.clientHeight, this._standardBaseHeightV074 * scale);
      stage.style.height = `${stageHeight}px`;
      stage.style.minHeight = `${stageHeight}px`;
      if (scale <= 1) {
        viewport.classList.add("native-scroll-v074");
        viewport.classList.remove("zoomed-v074");
        surface.style.transform = scale === 1 ? "none" : `scale(${scale})`;
      }
    }

    _setView(view) {
      super._setView(view);
      this._observeActiveContentV078();
      this._scheduleMeasureV078();
      requestAnimationFrame(() => {
        this._observeActiveContentV078();
        this._scheduleMeasureV078();
      });
    }

    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;
      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.7.8";
      this._viewportReadyV078 = false;
      this._scheduleViewportV078();
    }

    _ensureChild() {
      const previous = this._child;
      super._ensureChild();
      const root = this._child?.shadowRoot;
      installContentCompositionV078(root);
      tuneTopologyPathsV078(root);
      if (previous !== this._child || this._boundViewportV078 !== this.shadowRoot?.getElementById("app-content")) {
        this._viewportReadyV078 = false;
        this._viewportRetryCountV078 = 0;
      }
      this._scheduleViewportV078();
    }
  }

  customElements.define("keenetic-hero-app-panel-v078", KeeneticHeroAppPanelV078);
}
