await import("./keenetic-app-v070.js?v=0.7.1");

const BASE_COMPONENT_V071 = customElements.get("keenetic-hero-app-panel-v070");
const TAB_VIEWS_V071 = new Set(["overview", "wan", "failover", "traffic", "diagnostics"]);

function _v071InstallStableViewport(root) {
  if (!root || root.querySelector("style[data-nikas-stable-viewport-v071]")) return;
  const style = document.createElement("style");
  style.dataset.nikasStableViewportV071 = "true";
  style.textContent = `
    /* Temporary stability mode: native content scroll, no transform canvas. */
    #app-content{
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior-y:contain!important;
      touch-action:pan-y!important;
      -webkit-overflow-scrolling:touch!important;
    }
    #nika-zoom-stage{
      position:static!important;
      width:100%!important;
      height:auto!important;
      min-height:100%!important;
      overflow:visible!important;
    }
    #nika-zoom-surface{
      position:static!important;
      width:100%!important;
      min-height:100%!important;
      transform:none!important;
      will-change:auto!important;
    }
  `;
  root.append(style);
}

if (BASE_COMPONENT_V071 && !customElements.get("keenetic-hero-app-panel-v071")) {
  class KeeneticHeroAppPanelV071 extends BASE_COMPONENT_V071 {
    _installNikaZoom() {
      // Disabled in b034 while the iOS tab stall is isolated.
      this._teardownNikaZoom?.();
    }

    _applyNikaZoom() {
      // Older connectedCallback hooks may still request one apply frame.
      // Keep that inherited callback harmless in stability mode.
    }

    _setView(view) {
      if (!TAB_VIEWS_V071.has(view) || view === this._activeView) return;

      history.replaceState(null, "", `${location.pathname}${location.search}#${view}`);
      this._activeView = view;
      if (this._child) {
        this._child._view = view;
        this._child._scheduleRender?.();
        this._child._loadViewData?.();
      }
      this._renderTabBar();
      this.shadowRoot?.getElementById("app-content")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    _renderShell() {
      super._renderShell();
      this._teardownNikaZoom?.();
      const root = this.shadowRoot;
      _v071InstallStableViewport(root);
      const version = root?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.7.1";
    }
  }

  customElements.define("keenetic-hero-app-panel-v071", KeeneticHeroAppPanelV071);
}
