await import("./keenetic-app-v075.js?v=0.7.6");

const CORE_COMPONENT_V076 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V076 = customElements.get("keenetic-hero-app-panel-v075");
const INDICATOR_TONES_V076 = ["ok", "warn", "bad", "unknown", "neutral"];
const STABLE_VIEWS_V076 = ["overview", "wan", "failover", "traffic", "diagnostics", "system"];
const PERSISTENT_ASSETS_V076 = [
  "/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=0.7.6",
  "/keenetic_hero_4g_static/assets/keenetic-hero-router-v063.webp?v=0.7.6",
];
const PRELOADED_ASSETS_V076 = PERSISTENT_ASSETS_V076.map((url) => {
  const image = new Image();
  image.src = url;
  image.decode?.().catch(() => {});
  return image;
});

function fragmentV076(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
}

function bodyV076(panel, view) {
  if (view === "overview") return panel._renderOverview();
  if (view === "wan") return panel._renderWan();
  if (view === "traffic") return panel._renderTraffic();
  if (view === "failover") return panel._renderFailover();
  if (view === "system") return panel._renderSystem();
  return panel._renderDiagnostics();
}

function ensureStableViewV076(panel, view) {
  if (!STABLE_VIEWS_V076.includes(view) || panel._stableSlotsV075?.has(view)) return;
  const slot = document.createElement("div");
  slot.className = "v075-view-slot";
  slot.dataset.viewV075 = view;
  slot.append(fragmentV076(bodyV076(panel, view)));
  panel._stableMainV075?.append(slot);
  panel._stableSlotsV075.set(view, slot);
  panel._bindStableInteractionsV075(slot);
  slot.querySelectorAll("img").forEach((image) => image.decode?.().catch(() => {}));
}

function setDirectTextV076(element, value) {
  if (!element) return;
  const text = [...element.childNodes].find(
    (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim(),
  );
  if (text && text.nodeValue !== value) text.nodeValue = value;
  else if (!text) element.append(document.createTextNode(value));
}

function indicatorCategoryV076(panel) {
  const telemetry = panel._telemetry?.() || {};
  const configured = panel._bootstrap?.telemetry || {};
  const age = Number(telemetry.age);
  const hasSample = telemetry.age !== null && telemetry.age !== undefined && Number.isFinite(age);
  const failedPoll = configured.last_update_success === false;
  const scanInterval = Math.max(1, Number(configured.scan_interval_seconds || 30));
  const staleAfter = scanInterval * 3;
  const declared = String(
    configured.active_data_channel || configured.data_channel || "local",
  ).toLowerCase();
  const transportUnavailable =
    configured.connection_available === false ||
    configured.transport_available === false ||
    ["none", "offline", "disconnected"].includes(declared);

  let connection = { label: "Нет данных", tone: "unknown" };
  if (transportUnavailable) connection = { label: "Нет связи", tone: "bad" };
  else if (["local", "lan", "api", "rci", "modbus", "snmp", "mqtt", "zigbee2mqtt", "tuya_local"].includes(declared)) {
    connection = { label: "Локально", tone: "ok" };
  } else if (["cloud", "remote", "tuya_cloud"].includes(declared)) {
    connection = { label: "Облако", tone: "ok" };
  } else if (["reserve", "backup", "fallback"].includes(declared)) {
    connection = { label: "Резерв", tone: "warn" };
  }

  let freshness = { label: "Нет данных", tone: "unknown" };
  if (hasSample && (failedPoll || age > staleAfter)) {
    freshness = { label: "Данные устарели", tone: "warn" };
  } else if (hasSample) {
    freshness = { label: "Данные актуальны", tone: "neutral" };
  }
  return { connection, freshness, key: `${connection.label}:${freshness.label}` };
}

function patchIndicatorV076(panel) {
  const slot = panel._stableSlotsV075?.get("overview");
  if (!slot) return;
  const primary = slot.querySelector(".v050-online-pill");
  const secondary = slot.querySelector(".v050-fresh-pill");
  if (!primary || !secondary) return;
  const category = indicatorCategoryV076(panel);
  if (slot.dataset.telemetryCategoryV076 === category.key) return;
  slot.dataset.telemetryCategoryV076 = category.key;

  primary.classList.add("connection-primary", "connection-surface-v076");
  primary.classList.remove(...INDICATOR_TONES_V076);
  primary.classList.add(category.connection.tone);
  setDirectTextV076(primary, category.connection.label);
  primary.setAttribute("role", "status");
  primary.setAttribute("aria-live", "polite");
  primary.setAttribute("aria-atomic", "true");
  primary.setAttribute("aria-label", `${category.connection.label} · ${category.freshness.label}`);

  secondary.classList.add("connection-secondary", "connection-surface-v076");
  secondary.classList.remove(...INDICATOR_TONES_V076);
  secondary.classList.add(category.freshness.tone);
  secondary.setAttribute("aria-hidden", "true");
  setDirectTextV076(secondary, category.freshness.label);
}

function installContentStandardV076(root) {
  if (!root || root.querySelector("style[data-nikas-content-standard-v076]")) return;
  const style = document.createElement("style");
  style.dataset.nikasContentStandardV076 = "true";
  style.textContent = `
    .v075-view-slot[hidden],.v075-integrity-placeholder[hidden]{display:none!important}
    .v075-view-slot{display:block;min-height:100%}
    /* NikaS v1.6: meaningful panel text remains inside the 12–25 px envelope. */
    .v050-status-copy h1,.hero-value{font-size:25px!important}
    .eyebrow,.telemetry-chip,.hero-top small,.rate-row,.node,.branch b,.router-node,
    .integrity-banner span,.pill,.big-rates small,.metric span,.metric strong,.metric small,
    .signal-summary span,.signal-summary small,.failover-main span,.reason span,.failover-main small,
    .detail-grid .metric span,.signal-banner span,.signal-banner small,.hint,.period,
    .traffic-totals span,.traffic-totals small,.live-rate,.chart-legend,
    .failover-kpis span,.failover-kpis small,.event span,.system-meta,
    .integrity-card span,.integrity-card>small,.diag-row strong,.diag-row small,.source-tag,
    .diagnostic-actions span,.v050-kicker,.v050-path-node strong,.v050-path-node small,
    .v050-reserve-badge strong,.v050-reserve-badge span,.v050-kpi span,.v050-kpi strong,
    .v050-reserve-strip div strong,.v050-reserve-strip div span,
    .v050-channel-grid small,.v050-channel-grid strong,.v050-lte-grid small,.v050-lte-grid strong,
    .v050-signal-line span,.v050-signal-line small,.v061-topology-card strong,.v061-topology-card span,
    .v061-lte strong,.v061-lte span,.v061-cable strong,.v061-cable span,.v061-lan strong,.v061-lan span{
      font-size:12px!important;
    }
    .v050-kpi span,.v050-path-node small,.v050-reserve-badge span,
    .v050-reserve-strip div span,.v050-channel-grid small,.v050-lte-grid small{
      line-height:1.18!important;
    }

    /* One quiet, status-tinted two-line connection surface. */
    .v050-online-pill.connection-primary,.v050-fresh-pill.connection-secondary{
      right:10px!important;
      width:164px!important;
      max-width:calc(100% - 20px)!important;
      box-sizing:border-box!important;
      margin:0!important;
      border-color:color-mix(in srgb,var(--indicator-tone,var(--kp-grey)) 30%,transparent)!important;
      background:color-mix(in srgb,var(--indicator-tone,var(--kp-grey)) 10%,var(--kp-surface))!important;
      box-shadow:none!important;
      backdrop-filter:none!important;
      animation:none!important;
      transition:none!important;
      justify-content:flex-start!important;
      white-space:normal!important;
    }
    .v050-online-pill.connection-primary{
      top:10px!important;
      min-height:38px!important;
      padding:8px 12px 4px!important;
      border-radius:17px 17px 0 0!important;
      border-bottom:0!important;
      font-size:16px!important;
      font-weight:700!important;
      line-height:1.15!important;
    }
    .v050-fresh-pill.connection-secondary{
      top:48px!important;
      min-height:31px!important;
      padding:2px 12px 8px!important;
      border-radius:0 0 17px 17px!important;
      border-top:0!important;
      font-size:13px!important;
      font-weight:600!important;
      line-height:1.2!important;
    }
    .v050-fresh-pill.connection-secondary ha-icon{display:none!important}
    .v050-online-pill.connection-primary .status-dot{
      width:10px!important;
      min-width:10px!important;
      height:10px!important;
      box-shadow:none!important;
    }
    .v050-online-pill.connection-primary.ok{--indicator-tone:var(--kp-green);color:var(--kp-green)!important}
    .v050-online-pill.connection-primary.warn{--indicator-tone:var(--kp-yellow);color:var(--kp-yellow)!important}
    .v050-online-pill.connection-primary.bad{--indicator-tone:var(--kp-red);color:var(--kp-red)!important}
    .v050-online-pill.connection-primary.unknown{--indicator-tone:var(--kp-grey);color:var(--kp-grey)!important}
    .v050-online-pill.connection-primary.ok+.v050-fresh-pill{--indicator-tone:var(--kp-green)}
    .v050-online-pill.connection-primary.warn+.v050-fresh-pill{--indicator-tone:var(--kp-yellow)}
    .v050-online-pill.connection-primary.bad+.v050-fresh-pill{--indicator-tone:var(--kp-red)}
    .v050-online-pill.connection-primary.unknown+.v050-fresh-pill{--indicator-tone:var(--kp-grey)}
    .v050-fresh-pill.connection-secondary.neutral{color:var(--secondary-text-color)!important}
    .v050-fresh-pill.connection-secondary.warn{color:var(--kp-yellow)!important}
    .v050-fresh-pill.connection-secondary.unknown{color:var(--kp-grey)!important}

    @media(max-width:430px){
      .v050-status-copy{max-width:56%!important}
      .v050-online-pill.connection-primary,.v050-fresh-pill.connection-secondary{width:156px!important}
    }
  `;
  root.append(style);
}

if (CORE_COMPONENT_V076 && !CORE_COMPONENT_V076.prototype.__nikaStandardV076) {
  CORE_COMPONENT_V076.prototype.__nikaStandardV076 = true;
  const patchStableBaseV076 = CORE_COMPONENT_V076.prototype._patchStableDomV075;
  const showStableBaseV076 = CORE_COMPONENT_V076.prototype._showStableViewV075;

  CORE_COMPONENT_V076.prototype._mountStableDomV075 = function (...args) {
    const requestedView = args[0] || "overview";
    const main = this.shadowRoot?.querySelector(".shell>main");
    if (!main) return false;
    installContentStandardV076(this.shadowRoot);
    this._stableSlotsV075 = new Map();

    const overview = document.createElement("div");
    overview.className = "v075-view-slot";
    overview.dataset.viewV075 = "overview";
    while (main.firstChild) overview.append(main.firstChild);
    main.append(overview);
    this._stableSlotsV075.set("overview", overview);
    this._stableMainV075 = main;
    ensureStableViewV076(this, requestedView);
    this._view = requestedView;
    this._stableMountedV075 = true;
    patchStableBaseV076.call(this);
    this._bindStableInteractionsV075(main);
    main.querySelectorAll("img").forEach((image) => image.decode?.().catch(() => {}));
    patchIndicatorV076(this);
    return true;
  };

  CORE_COMPONENT_V076.prototype._patchStableDomV075 = function (...args) {
    ensureStableViewV076(this, this._view);
    patchStableBaseV076.apply(this, args);
    installContentStandardV076(this.shadowRoot);
    patchIndicatorV076(this);
  };

  CORE_COMPONENT_V076.prototype._showStableViewV075 = function (view) {
    ensureStableViewV076(this, view);
    showStableBaseV076.call(this, view);
  };
}

function installShellStandardV076(root) {
  if (!root || root.querySelector("style[data-nikas-shell-standard-v076]")) return;
  const style = document.createElement("style");
  style.dataset.nikasShellStandardV076 = "true";
  style.textContent = `
    :host{
      display:block!important;
      width:100%!important;
      height:100dvh!important;
      min-height:0!important;
      max-height:100dvh!important;
      overflow:hidden!important;
      overscroll-behavior:none!important;
    }
    #nika-app-shell{
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
      position:relative!important;
      inset:auto!important;
      transform:none!important;
      display:grid!important;
      grid-template-columns:52px minmax(0,1fr) 52px!important;
      min-height:calc(62px + env(safe-area-inset-top,0px))!important;
      padding:env(safe-area-inset-top,0px) max(8px,env(safe-area-inset-right,0px)) 0 max(8px,env(safe-area-inset-left,0px))!important;
      align-items:center!important;
      gap:0!important;
      z-index:4!important;
    }
    .nika-header .menu,.nika-header .refresh{
      width:44px!important;
      min-width:44px!important;
      height:44px!important;
      min-height:44px!important;
      padding:0!important;
      border-radius:16px!important;
      border:1px solid var(--shell-border,var(--divider-color))!important;
      background:var(--card-background-color)!important;
      box-shadow:0 7px 20px rgba(23,45,76,.08)!important;
      display:grid!important;
      place-items:center!important;
    }
    .nika-header .menu{grid-column:1!important;justify-self:start!important;color:var(--primary-text-color)!important}
    .nika-header .refresh{grid-column:3!important;justify-self:end!important;color:var(--primary-color)!important}
    .nika-header .menu ha-icon,.nika-header .refresh ha-icon{--mdc-icon-size:25px!important}
    .nika-header .title{grid-column:2!important;grid-row:1!important;text-align:center!important;min-width:0!important}
    .nika-header .title strong{font-size:23px!important;font-weight:800!important;line-height:1.08!important}
    .nika-header .title span{font-size:14px!important;font-weight:560!important;line-height:1.15!important;color:var(--secondary-text-color)!important}
    #app-content{
      position:relative!important;
      min-width:0!important;
      min-height:0!important;
      height:auto!important;
      max-height:none!important;
      overflow-x:hidden!important;
      overscroll-behavior-x:none!important;
      overscroll-behavior-y:none!important;
      -webkit-overflow-scrolling:touch!important;
      scroll-behavior:auto!important;
    }
    #app-content.native-scroll-v074{overflow-x:hidden!important;overflow-y:auto!important;touch-action:pan-y!important}
    #app-content.zoomed-v074{overflow:hidden!important;overscroll-behavior:none!important;touch-action:none!important;user-select:none!important;-webkit-user-select:none!important}
    #nika-zoom-stage{min-width:100%!important;min-height:100%!important}
    #nika-zoom-surface{min-width:100%!important;min-height:100%!important;transform-origin:0 0!important}
    .nika-tabbar{
      position:relative!important;
      inset:auto!important;
      transform:none!important;
      width:100%!important;
      min-width:0!important;
      display:grid!important;
      grid-template-columns:repeat(5,minmax(0,1fr))!important;
      gap:2px!important;
      padding:6px max(6px,env(safe-area-inset-right,0px)) calc(6px + env(safe-area-inset-bottom,0px)) max(6px,env(safe-area-inset-left,0px))!important;
      border-radius:0!important;
      border-top:1px solid var(--shell-border,var(--divider-color))!important;
      background:var(--card-background-color)!important;
      box-shadow:0 -4px 18px rgba(23,45,76,.08)!important;
      z-index:5!important;
    }
    .nika-tabbar button{
      min-height:52px!important;
      min-width:0!important;
      border-radius:16px!important;
      gap:3px!important;
      padding:3px 2px!important;
      color:var(--secondary-text-color)!important;
      background:transparent!important;
      box-shadow:none!important;
    }
    .nika-tabbar button.active{color:var(--primary-color)!important;background:color-mix(in srgb,var(--primary-color) 11%,transparent)!important}
    .nika-tabbar button.active::before{display:none!important}
    .nika-tabbar ha-icon{--mdc-icon-size:28px!important}
    .nika-tabbar span{font-size:12px!important;font-weight:700!important;white-space:nowrap!important;line-height:1.1!important}
    @media(max-width:680px){
      :host{position:fixed!important;inset:0!important;width:auto!important;height:auto!important;max-height:none!important}
      #nika-app-shell{position:absolute!important;inset:0!important;width:auto!important;height:auto!important;max-height:none!important}
    }
    @media(max-width:390px){
      .nika-header{grid-template-columns:48px minmax(0,1fr) 48px!important;min-height:calc(60px + env(safe-area-inset-top,0px))!important}
      .nika-header .title strong{font-size:21px!important}
      .nika-header .title span{font-size:13px!important}
    }
  `;
  root.append(style);
}

if (BASE_COMPONENT_V076 && !customElements.get("keenetic-hero-app-panel-v076")) {
  class KeeneticHeroAppPanelV076 extends BASE_COMPONENT_V076 {
    _onStandardTouchEndV074(event) {
      if (this._standardMultiV074 && event.touches.length === 1) {
        this._completedMultiTouchV076 = this._standardPinchV074;
        this._standardPinchV074 = null;
        this._standardPanV074 = null;
        return;
      }
      if (
        this._standardMultiV074 &&
        event.touches.length === 0 &&
        !this._standardPinchV074 &&
        this._completedMultiTouchV076
      ) {
        this._standardPinchV074 = this._completedMultiTouchV076;
      }
      super._onStandardTouchEndV074(event);
      if (event.touches.length === 0) this._completedMultiTouchV076 = null;
    }

    _onStandardTouchCancelV074() {
      this._completedMultiTouchV076 = null;
      super._onStandardTouchCancelV074();
    }

    _applyStandardZoomV074(value, options = {}) {
      super._applyStandardZoomV074(value, options);
      if (this._standardStateV074?.scale === 1) {
        this._standardStateV074.x = 0;
        this._standardStateV074.y = 0;
        const surface = this.shadowRoot?.getElementById("nika-zoom-surface");
        if (surface && surface.style.transform !== "none") surface.style.transform = "none";
      }
    }

    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      installShellStandardV076(root);
      const menuIcon = root?.querySelector("#nika-menu ha-icon");
      const refreshIcon = root?.querySelector("#nika-refresh ha-icon");
      if (menuIcon?.getAttribute("icon") !== "mdi:menu") menuIcon?.setAttribute("icon", "mdi:menu");
      if (refreshIcon?.getAttribute("icon") !== "mdi:refresh") refreshIcon?.setAttribute("icon", "mdi:refresh");
      const version = root?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.7.6";
    }
  }

  customElements.define("keenetic-hero-app-panel-v076", KeeneticHeroAppPanelV076);
}
