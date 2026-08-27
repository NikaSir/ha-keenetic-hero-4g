await import("./keenetic-app-v076.js?v=0.7.7");

const BASE_COMPONENT_V077 = customElements.get("keenetic-hero-app-panel-v076");

function installContentStandardV077(root) {
  if (!root || root.querySelector("style[data-nikas-content-standard-v077]")) return;
  const style = document.createElement("style");
  style.dataset.nikasContentStandardV077 = "true";
  style.textContent = `
    /* UI 0.7.7: restore a semantic type scale instead of flattening labels and values. */
    :host,.shell,.v075-view-slot{
      font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif))!important;
    }
    .v075-view-slot{font-size:14px!important;line-height:1.3!important}
    .v050-status-copy h1,.hero-value{font-size:25px!important;line-height:1.04!important}
    .v050-status-copy p,.hero-top strong,.section-heading h2{font-size:16px!important}
    .v050-kicker,.eyebrow,.telemetry-chip,.hero-top small,.rate-row,
    .integrity-banner span,.pill,.metric span,.metric small,.signal-summary span,
    .signal-summary small,.failover-main span,.failover-main small,.reason span,
    .signal-banner span,.signal-banner small,.hint,.period,.traffic-totals span,
    .traffic-totals small,.chart-legend,.failover-kpis span,.failover-kpis small,
    .event span,.system-meta,.integrity-card span,.integrity-card>small,
    .diag-row small,.source-tag,.diagnostic-actions span,.v050-path-node small,
    .v050-reserve-badge span,.v050-kpi span,.v050-reserve-strip div span,
    .v050-channel-grid small,.v050-lte-grid small,.v050-signal-line span,
    .v050-signal-line small,.v061-topology-card span{
      font-size:12px!important;
      line-height:1.2!important;
    }
    .card-title strong,.v050-channel-head strong,.v050-reserve-strip div strong,
    .v050-signal-line strong,.metric strong,.signal-summary strong,
    .failover-main strong,.reason strong,.traffic-totals strong,.live-rate,
    .failover-kpis strong,.event strong,.integrity-card strong,.diag-row strong,
    .v050-channel-grid strong,.v050-lte-grid strong{
      font-size:16px!important;
      line-height:1.18!important;
    }
    .big-rates>span{font-size:18px!important;line-height:1.15!important}
    .big-rates small{font-size:12px!important;line-height:1.2!important}
    .v061-topology-card strong,.v050-path-node strong,.v050-reserve-badge strong{
      font-size:14px!important;
      line-height:1.15!important;
    }
    .v050-kpi strong{
      font-size:15px!important;
      line-height:1.15!important;
    }
    .v050-kpi span,.v050-kpi strong,.v050-channel-grid small,.v050-channel-grid strong,
    .v050-lte-grid small,.v050-lte-grid strong{
      overflow:hidden!important;
      text-overflow:ellipsis!important;
    }
  `;
  root.append(style);
}

function installShellStandardV077(root) {
  if (!root || root.querySelector("style[data-nikas-shell-standard-v077]")) return;
  const style = document.createElement("style");
  style.dataset.nikasShellStandardV077 = "true";
  style.textContent = `
    :host{
      --nika-safe-top-v077:var(--safe-area-inset-top,env(safe-area-inset-top,0px));
      --nika-safe-right-v077:var(--safe-area-inset-right,env(safe-area-inset-right,0px));
      --nika-safe-bottom-v077:var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px));
      --nika-safe-left-v077:var(--safe-area-inset-left,env(safe-area-inset-left,0px));
      position:relative!important;
      inset:auto!important;
      display:block!important;
      width:100%!important;
      height:100vh!important;
      height:100dvh!important;
      min-height:0!important;
      max-height:100dvh!important;
      overflow:hidden!important;
      overscroll-behavior:none!important;
      font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif))!important;
      font-size:14px!important;
    }
    #nika-app-shell{
      position:relative!important;
      inset:auto!important;
      box-sizing:border-box!important;
      width:100%!important;
      height:100%!important;
      min-height:0!important;
      max-height:100%!important;
      display:grid!important;
      grid-template-rows:auto minmax(0,1fr) auto!important;
      overflow:hidden!important;
      overscroll-behavior:none!important;
    }
    .nika-header{
      box-sizing:border-box!important;
      grid-row:1!important;
      width:100%!important;
      min-width:0!important;
      min-height:calc(62px + var(--nika-safe-top-v077))!important;
      padding:var(--nika-safe-top-v077) max(8px,var(--nika-safe-right-v077)) 0 max(8px,var(--nika-safe-left-v077))!important;
      display:grid!important;
      grid-template-columns:52px minmax(0,1fr) 52px!important;
      align-items:center!important;
      gap:0!important;
      transform:none!important;
    }
    .nika-header .menu,.nika-header .refresh{
      grid-row:1!important;
      box-sizing:border-box!important;
      width:44px!important;
      min-width:44px!important;
      max-width:44px!important;
      height:44px!important;
      min-height:44px!important;
      max-height:44px!important;
      margin:0!important;
      padding:0!important;
      display:grid!important;
      place-items:center!important;
      align-self:center!important;
      justify-content:center!important;
      border:1px solid var(--shell-border,var(--divider-color))!important;
      border-radius:16px!important;
      background:var(--card-background-color)!important;
      box-shadow:0 7px 20px rgba(23,45,76,.08)!important;
      appearance:none!important;
      -webkit-appearance:none!important;
      font:inherit!important;
    }
    .nika-header .menu{grid-column:1!important;justify-self:start!important}
    .nika-header .refresh{grid-column:3!important;justify-self:end!important}
    .nika-header .menu ha-icon,.nika-header .refresh ha-icon{
      display:block!important;
      width:25px!important;
      height:25px!important;
      --mdc-icon-size:25px!important;
    }
    .nika-header .title{
      grid-column:2!important;
      grid-row:1!important;
      width:100%!important;
      min-width:0!important;
      display:grid!important;
      align-content:center!important;
      justify-items:center!important;
      text-align:center!important;
      line-height:1!important;
    }
    .nika-header .title strong,.nika-header .title span{
      display:block!important;
      width:100%!important;
      max-width:100%!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      white-space:nowrap!important;
    }
    .nika-header .title strong{
      margin:0!important;
      font-size:23px!important;
      font-weight:800!important;
      line-height:1.08!important;
      letter-spacing:-.02em!important;
    }
    .nika-header .title span{
      margin:2px 0 0!important;
      font-size:14px!important;
      font-weight:560!important;
      line-height:1.15!important;
      letter-spacing:0!important;
    }
    #app-content{
      grid-row:2!important;
      align-self:stretch!important;
      width:100%!important;
      min-width:0!important;
      min-height:0!important;
      height:auto!important;
      max-height:100%!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior-x:none!important;
      overscroll-behavior-y:none!important;
      -webkit-overflow-scrolling:touch!important;
      touch-action:pan-y!important;
      scrollbar-width:none!important;
    }
    #app-content::-webkit-scrollbar{display:none!important}
    #app-content.native-scroll-v074{
      overflow-x:hidden!important;
      overflow-y:auto!important;
      touch-action:pan-y!important;
    }
    #app-content.zoomed-v074{
      overflow:hidden!important;
      touch-action:none!important;
    }
    #nika-zoom-stage{
      position:relative!important;
      min-width:100%!important;
      min-height:100%!important;
      overflow:visible!important;
    }
    #nika-zoom-surface{
      position:absolute!important;
      left:0!important;
      top:0!important;
      min-width:100%!important;
      min-height:100%!important;
      margin:0!important;
      transform-origin:0 0!important;
    }
    .nika-tabbar{
      grid-row:3!important;
      box-sizing:border-box!important;
      padding:6px max(6px,var(--nika-safe-right-v077)) calc(6px + var(--nika-safe-bottom-v077)) max(6px,var(--nika-safe-left-v077))!important;
      font-family:inherit!important;
    }
    .nika-tabbar button{font:inherit!important}
    .nika-tabbar span{font-size:12px!important;font-weight:700!important;line-height:1.1!important}
    @media(max-width:390px){
      .nika-header{
        min-height:calc(60px + var(--nika-safe-top-v077))!important;
        grid-template-columns:48px minmax(0,1fr) 48px!important;
      }
      .nika-header .title strong{font-size:21px!important}
      .nika-header .title span{font-size:13px!important}
    }
  `;
  root.append(style);
}

if (BASE_COMPONENT_V077 && !customElements.get("keenetic-hero-app-panel-v077")) {
  class KeeneticHeroAppPanelV077 extends BASE_COMPONENT_V077 {
    connectedCallback() {
      super.connectedCallback();
      this._scheduleViewportReadyV077();
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._viewportReadyFrameV077);
      this._viewportInitializedV077 = false;
      super.disconnectedCallback();
    }

    _scheduleViewportReadyV077() {
      if (!this.isConnected || this._viewportInitializedV077) return;
      cancelAnimationFrame(this._viewportReadyFrameV077);
      this._viewportReadyFrameV077 = requestAnimationFrame(() => {
        this._viewportReadyFrameV077 = requestAnimationFrame(() => {
          if (!this.isConnected || this._viewportInitializedV077) return;
          this._installNikaZoom();
          this._scheduleStandardMeasureV074();
          this._viewportInitializedV077 = true;
        });
      });
    }

    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      installShellStandardV077(root);
      installContentStandardV077(this._child?.shadowRoot);
      const version = root?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.7.7";
    }

    _ensureChild() {
      const previousChild = this._child;
      super._ensureChild();
      installContentStandardV077(this._child?.shadowRoot);
      if (this._child !== previousChild || this._viewportChildV077 !== this._child) {
        this._viewportChildV077 = this._child;
        this._viewportInitializedV077 = false;
      }
      if (this.isConnected) this._scheduleViewportReadyV077();
    }
  }

  customElements.define("keenetic-hero-app-panel-v077", KeeneticHeroAppPanelV077);
}
