await import("./keenetic-app-v069.js?v=0.7.0");

const BASE_COMPONENT_V070 = customElements.get("keenetic-hero-app-panel-v069");
const TAB_VIEWS_V070 = new Set(["overview", "wan", "failover", "traffic", "diagnostics"]);

if (BASE_COMPONENT_V070 && !customElements.get("keenetic-hero-app-panel-v070")) {
  class KeeneticHeroAppPanelV070 extends BASE_COMPONENT_V070 {
    _setView(view) {
      if (!TAB_VIEWS_V070.has(view) || view === this._activeView) return;

      history.replaceState(null, "", `${location.pathname}${location.search}#${view}`);
      this._activeView = view;
      this._renderTabBar();

      // A view replacement changes the intrinsic height of the transform-owned
      // surface. Stop the old measurement cycle before the child rebuilds so a
      // ResizeObserver callback cannot race the render and keep iOS busy.
      window.cancelAnimationFrame(this._nikaCanvasResizeFrameV067);
      this._nikaCanvasResizeFrameV067 = 0;
      this._nikaCanvasResizeObserverV067?.disconnect();
      this._nikaCanvasResizeTargetV067 = null;
      this._nikaCanvasPanV067 = null;
      this._nikaCanvasPinchV067 = null;
      this._nikaCanvasTapGestureV067 = null;
      this._nikaCanvasMultiTouchV067 = false;
      this._nikaCanvasGuardUntilV067 = 0;

      const state = this._nikaCanvasStateV067;
      state.x = 0;
      state.y = 0;

      const child = this._child;
      if (!child) return;
      child._view = view;
      child._scheduleRender?.();

      // The child render is queued as a microtask. Load optional view data only
      // after that render, then measure the completed DOM once on the next frame.
      queueMicrotask(() => {
        child._loadViewData?.();
        window.cancelAnimationFrame(this._nikaCanvasResizeFrameV067);
        this._nikaCanvasResizeFrameV067 = window.requestAnimationFrame(() => {
          this._observeNikaZoomSurface();
          this._applyNikaZoom(state.scale, { remeasure: true });
        });
      });
    }

    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.7.0";
    }
  }

  customElements.define("keenetic-hero-app-panel-v070", KeeneticHeroAppPanelV070);
}
