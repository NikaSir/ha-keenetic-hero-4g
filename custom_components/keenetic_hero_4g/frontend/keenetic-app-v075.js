await import("./keenetic-app-v074.js?v=0.7.5");

const CORE_COMPONENT_V075 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V075 = customElements.get("keenetic-hero-app-panel-v074");
const STABLE_VIEWS_V075 = ["overview", "wan", "failover", "traffic", "diagnostics", "system"];
const DYNAMIC_CLASSES_V075 = new Set([
  "ok", "bad", "warn", "unknown", "neutral", "blue", "selected", "active",
  "metric-unknown", "active-ethernet", "active-lte", "active-none", "missing",
  "unavailable",
]);

function fragmentV075(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
}

function bodyV075(panel, view) {
  if (view === "overview") return panel._renderOverview();
  if (view === "wan") return panel._renderWan();
  if (view === "traffic") return panel._renderTraffic();
  if (view === "failover") return panel._renderFailover();
  if (view === "system") return panel._renderSystem();
  return panel._renderDiagnostics();
}

function stableClassesV075(element) {
  return [...element.classList].filter(
    (name) => !DYNAMIC_CLASSES_V075.has(name) && !/^v06[0-8]-/.test(name),
  );
}

function directLabelV075(element) {
  for (const child of element.children) {
    if ((child.tagName === "SMALL" || child.classList.contains("label")) && child.children.length === 0) {
      return child.textContent.trim();
    }
  }
  return "";
}

function nodeKeyV075(element) {
  if (element.id) return `${element.tagName}#${element.id}`;
  for (const name of ["entity", "view", "period"]) {
    if (element.dataset?.[name]) return `${element.tagName}[${name}=${element.dataset[name]}]`;
  }
  const classes = stableClassesV075(element);
  if (classes.length) return `${element.tagName}.${classes.join(".")}`;
  const label = directLabelV075(element);
  return label ? `${element.tagName}[label=${label}]` : element.tagName;
}

function syncClassesV075(current, desired) {
  const preserved = [...current.classList].filter(
    (name) => (/^v06[0-8]-/.test(name) || /^v075-/.test(name)) && !DYNAMIC_CLASSES_V075.has(name),
  );
  const next = new Set([...desired.classList, ...preserved]);
  const value = [...next].join(" ");
  if (current.getAttribute("class") !== value) current.setAttribute("class", value);
}

function syncAttributesV075(current, desired) {
  syncClassesV075(current, desired);
  for (const attribute of desired.attributes) {
    if (attribute.name === "class" || attribute.name === "style" || attribute.name === "src") continue;
    if (current.getAttribute(attribute.name) !== attribute.value) current.setAttribute(attribute.name, attribute.value);
  }
  if (desired.hasAttribute("src")) {
    const nextSrc = desired.getAttribute("src");
    if (current.getAttribute("src") !== nextSrc) current.setAttribute("src", nextSrc);
  }
}

function syncDirectTextV075(current, desired) {
  const currentText = [...current.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
  const desiredText = [...desired.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
  desiredText.forEach((node, index) => {
    if (currentText[index] && currentText[index].nodeValue !== node.nodeValue) {
      currentText[index].nodeValue = node.nodeValue;
    }
  });
}

function morphV075(current, desired) {
  if (current.matches?.(".v050-kpi") && current.querySelector("span")?.textContent.trim() === "Телеметрия") return;
  syncAttributesV075(current, desired);
  syncDirectTextV075(current, desired);
  const currentChildren = [...current.children];
  const used = new Set();
  for (const wanted of desired.children) {
    const key = nodeKeyV075(wanted);
    let match = currentChildren.find(
      (candidate) => !used.has(candidate) && nodeKeyV075(candidate) === key,
    );
    if (!match) {
      match = currentChildren.find(
        (candidate) => !used.has(candidate) && candidate.tagName === wanted.tagName,
      );
    }
    if (!match) continue;
    used.add(match);
    morphV075(match, wanted);
  }
}

function removeOptionalIndicatorV075(scope) {
  scope?.querySelectorAll?.(".v050-online-pill,.v050-fresh-pill").forEach((node) => node.remove());
}

function patchTopologyV075(panel, slot) {
  const scene = slot.querySelector(".v050-scene");
  if (!scene) return;
  const active = panel._activeWan?.();
  scene.classList.toggle("v061-cable-active", active === "ethernet");
  scene.classList.toggle("v061-lte-active", active === "lte");
  scene.classList.toggle("v061-no-wan", active !== "ethernet" && active !== "lte");

  const lte = panel._connection?.("lte_connected") || {};
  const cable = panel._connection?.("ethernet_connected") || {};
  const lteSubtitle = scene.querySelector(".v061-lte span");
  const cableSubtitle = scene.querySelector(".v061-cable span");
  if (lteSubtitle) lteSubtitle.textContent = active === "lte" ? "Активен" : lte.state === "up" ? "Резерв готов" : lte.label || "Нет данных";
  if (cableSubtitle) cableSubtitle.textContent = active === "ethernet" ? panel._display("ethernet_link_speed", "—") : cable.state === "up" ? "Резерв" : cable.label || "Нет данных";

  const signalCell = slot.querySelector(".v060-signal-cell strong");
  const operatorCell = slot.querySelector(".v060-operator-cell strong");
  if (signalCell) signalCell.textContent = panel._lteSignal?.().label || "—";
  if (operatorCell) operatorCell.textContent = panel._display("lte_operator", "—");
}

function ensureIntegrityPlaceholderV075(panel, slot) {
  if (slot.dataset.viewV075 !== "overview") return;
  let banner = slot.querySelector(":scope .integrity-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.className = "integrity-banner v075-integrity-placeholder";
    banner.innerHTML = '<ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><strong></strong><span></span></div>';
    slot.querySelector(".v050-overview")?.prepend(banner);
  }
  const telemetry = panel._telemetry?.() || {};
  banner.hidden = Boolean(telemetry.trusted);
  banner.classList.remove("ok", "bad", "warn", "unknown");
  banner.classList.add(telemetry.tone || "unknown");
  const strong = banner.querySelector("strong");
  const detail = banner.querySelector("span");
  if (strong) strong.textContent = telemetry.label || "Нет данных";
  if (detail) detail.textContent = `${telemetry.detail || "Состояние телеметрии не определено"}. WAN не трактуется как нормальный до восстановления телеметрии.`;
}

function patchSlotV075(panel, slot, view) {
  const desired = document.createElement("div");
  desired.append(fragmentV075(bodyV075(panel, view)));
  removeOptionalIndicatorV075(desired);
  morphV075(slot, desired);
  if (view === "overview") {
    patchTopologyV075(panel, slot);
    ensureIntegrityPlaceholderV075(panel, slot);
  }
}

function installStableStyleV075(root) {
  if (!root || root.querySelector("style[data-keenetic-stable-dom-v075]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticStableDomV075 = "true";
  style.textContent = `
    .v075-view-slot[hidden],.v075-integrity-placeholder[hidden]{display:none!important}
    .v075-view-slot{display:block;min-height:100%}
    .v050-online-pill,.v050-fresh-pill{display:none!important}
    .eyebrow,.telemetry-chip,.hero-top small,.rate-row,.node,.branch b,.branch small,
    .router-node,.integrity-banner span,.pill,.big-rates small,.metric span,.metric strong,
    .metric small,.signal-summary span,.signal-summary small,.failover-main span,.reason span,
    .failover-main small,.detail-grid .metric span,.signal-banner span,.signal-banner small,.hint,
    .period,.traffic-totals span,.traffic-totals small,.live-rate,.chart-legend,.failover-kpis span,
    .failover-kpis small,.event span,.system-meta,.integrity-card span,.integrity-card>small,
    .diag-row strong,.diag-row small,.source-tag,.diagnostic-actions span,.v050-kicker,
    .v050-path-node strong,.v050-path-node small,.v050-reserve-badge strong,.v050-reserve-badge span,
    .v050-kpi span,.v050-kpi strong,.v050-reserve-strip div strong,.v050-reserve-strip div span,
    .v050-channel-grid small,.v050-channel-grid strong,.v050-signal-line span,.v050-signal-line small,
    .v050-last-switch span,.v050-last-switch strong,.v050-last-switch small,.v050-last-switch time,
    .v061-topology-card strong,.v061-topology-card span{font-size:12px!important}
    .hero-value,.v050-status-copy h1{font-size:25px!important}
  `;
  root.append(style);
}

function preloadImagesV075(root) {
  root.querySelectorAll("img").forEach((image) => {
    if (image.dataset.preloadedV075 === "true") return;
    image.dataset.preloadedV075 = "true";
    image.decode?.().catch(() => {});
  });
  [
    "/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=0.7.5",
    "/keenetic_hero_4g_static/assets/keenetic-hero-router-v063.webp?v=0.7.5",
  ].forEach((url) => {
    const image = new Image();
    image.src = url;
    image.decode?.().catch(() => {});
  });
}

if (CORE_COMPONENT_V075 && !CORE_COMPONENT_V075.prototype.__nikaStableDomV075) {
  CORE_COMPONENT_V075.prototype.__nikaStableDomV075 = true;
  const renderBaseV075 = CORE_COMPONENT_V075.prototype._render;
  const hassDescriptorV075 = Object.getOwnPropertyDescriptor(CORE_COMPONENT_V075.prototype, "hass");

  CORE_COMPONENT_V075.prototype._bindStableInteractionsV075 = function (scope) {
    scope.querySelectorAll("[data-view]:not([data-stable-bound-v075])").forEach((element) => {
      element.dataset.stableBoundV075 = "true";
      element.addEventListener("click", () => {
        const view = element.dataset.view;
        if (!view) return;
        history.replaceState(null, "", `${location.pathname}${location.search}#${view}`);
        this._view = view;
        this._scheduleRender?.();
        this._loadViewData?.();
      });
    });
    scope.querySelectorAll("[data-period]:not([data-stable-bound-v075])").forEach((element) => {
      element.dataset.stableBoundV075 = "true";
      element.addEventListener("click", () => {
        this._trafficPeriod = element.dataset.period || "24h";
        this._scheduleRender?.();
        this._loadTrafficHistory?.();
      });
    });
    scope.querySelectorAll("[data-entity]:not([data-stable-bound-v075])").forEach((element) => {
      element.dataset.stableBoundV075 = "true";
      let timer = 0;
      let fired = false;
      const clear = () => { window.clearTimeout(timer); timer = 0; };
      const open = () => {
        const entityId = element.dataset.entity;
        if (!entityId) return;
        fired = true;
        this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
      };
      element.addEventListener("pointerdown", () => { fired = false; clear(); timer = window.setTimeout(open, 550); });
      ["pointerup", "pointercancel", "pointerleave"].forEach((name) => element.addEventListener(name, clear));
      element.addEventListener("click", (event) => { if (fired) event.preventDefault(); });
      element.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") open(); });
    });
  };

  CORE_COMPONENT_V075.prototype._attachInteractions = function () {
    this._bindStableInteractionsV075(this.shadowRoot);
  };

  CORE_COMPONENT_V075.prototype._showStableViewV075 = function (view) {
    for (const [name, slot] of this._stableSlotsV075) {
      const active = name === view;
      slot.classList.toggle("v075-active-view", active);
      slot.hidden = !active;
      slot.inert = !active;
      slot.setAttribute("aria-hidden", active ? "false" : "true");
    }
  };

  CORE_COMPONENT_V075.prototype._mountStableDomV075 = function (requestedView) {
    const main = this.shadowRoot?.querySelector(".shell>main");
    if (!main) return false;
    installStableStyleV075(this.shadowRoot);
    this._stableSlotsV075 = new Map();

    const overview = document.createElement("div");
    overview.className = "v075-view-slot";
    overview.dataset.viewV075 = "overview";
    while (main.firstChild) overview.append(main.firstChild);
    removeOptionalIndicatorV075(overview);
    main.append(overview);
    this._stableSlotsV075.set("overview", overview);

    for (const view of STABLE_VIEWS_V075.slice(1)) {
      const slot = document.createElement("div");
      slot.className = "v075-view-slot";
      slot.dataset.viewV075 = view;
      slot.append(fragmentV075(bodyV075(this, view)));
      main.append(slot);
      this._stableSlotsV075.set(view, slot);
    }

    this._stableMainV075 = main;
    this._view = requestedView;
    this._showStableViewV075(requestedView);
    this._bindStableInteractionsV075(main);
    ensureIntegrityPlaceholderV075(this, overview);
    preloadImagesV075(main);
    this._stableMountedV075 = true;
    return true;
  };

  CORE_COMPONENT_V075.prototype._patchStableDomV075 = function () {
    if (!this._stableMountedV075) return;
    const activeView = this._view;
    for (const [view, slot] of this._stableSlotsV075) patchSlotV075(this, slot, view);
    this._view = activeView;
    this._showStableViewV075(activeView);
  };

  CORE_COMPONENT_V075.prototype._scheduleRender = function () {
    if (this._renderQueuedV075) return;
    this._renderQueuedV075 = true;
    window.requestAnimationFrame(() => {
      this._renderQueuedV075 = false;
      this._render();
    });
  };

  CORE_COMPONENT_V075.prototype._render = function (...args) {
    if (this._stableMountedV075) {
      this._patchStableDomV075();
      return;
    }
    if (!this._hass || !this._bootstrap) return;
    const requestedView = this._view;
    this._view = "overview";
    renderBaseV075.apply(this, args);
    this._view = requestedView;
    this._mountStableDomV075(requestedView);
  };

  if (hassDescriptorV075?.set) {
    Object.defineProperty(CORE_COMPONENT_V075.prototype, "hass", {
      configurable: true,
      enumerable: hassDescriptorV075.enumerable,
      set(value) {
        if (!this._stableMountedV075) {
          hassDescriptorV075.set.call(this, value);
          return;
        }
        this._hass = value;
        this._scheduleRender();
      },
    });
  }
}

if (BASE_COMPONENT_V075 && !customElements.get("keenetic-hero-app-panel-v075")) {
  class KeeneticHeroAppPanelV075 extends BASE_COMPONENT_V075 {
    _ensureChild() {
      if (!this.isConnected) return;
      const target =
        this.shadowRoot?.getElementById("nika-zoom-surface") ||
        this.shadowRoot?.getElementById("app-content");
      if (!this._child) this._child = document.createElement("keenetic-hero-panel");
      if (target && this._child.parentElement !== target) target.append(this._child);
      if (this._panel && this._stablePanelSentV075 !== this._panel) {
        this._stablePanelSentV075 = this._panel;
        this._child.panel = this._panel;
      }
      if (this._route && this._stableRouteSentV075 !== this._route) {
        this._stableRouteSentV075 = this._route;
        this._child.route = this._route;
      }
      if (this._hass && this._panel) this._child.hass = this._hass;
    }

    _renderTabBar() {
      const nav = this.shadowRoot?.getElementById("nika-tabbar");
      if (!nav) return;
      if (!nav.querySelector("[data-view]")) super._renderTabBar();
      const active = this._activeView === "system" ? "diagnostics" : this._activeView;
      nav.querySelectorAll("[data-view]").forEach((button) => {
        const selected = button.dataset.view === active;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-current", selected ? "page" : "false");
      });
    }

    _renderShell() {
      super._renderShell();
      if (!this.shadowRoot?.querySelector("style[data-nikas-v16-v075]")) {
        const style = document.createElement("style");
        style.dataset.nikasV16V075 = "true";
        style.textContent = `
          .nika-header .title strong{font-size:23px!important;font-weight:800!important}
          .nika-header .title span{font-size:14px!important;font-weight:600!important}
          @media(max-width:390px){
            .nika-header .title strong{font-size:21px!important}
            .nika-header .title span{font-size:13px!important}
          }
        `;
        this.shadowRoot.append(style);
      }
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.7.5";
    }
  }

  customElements.define("keenetic-hero-app-panel-v075", KeeneticHeroAppPanelV075);
}
