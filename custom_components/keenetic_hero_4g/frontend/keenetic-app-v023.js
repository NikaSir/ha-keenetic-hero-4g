import "./keenetic-panel.js?v=0.2.3";

const APP_SHELL_VERSION = "0.2.3";
const PARENT_ROUTE = "/dashboard-infrastructure/overview";
const BASE_COMPONENT = customElements.get("keenetic-hero-panel");

if (BASE_COMPONENT) {
  BASE_COMPONENT.prototype._renderHeader = function () {
    return "";
  };

  // The NikaS app shell owns primary navigation. The specialized panel renders
  // only device content; this prevents a floating bar from overlapping content.
  BASE_COMPONENT.prototype._renderNav = function () {
    return "";
  };

  // WAN/LTE is one primary application screen. Inside it, use the same large
  // two-segment selector pattern as the Stark SolarPower panel so wired WAN and
  // LTE diagnostics are not presented as one long sensor page.
  const baseRenderWan = BASE_COMPONENT.prototype._renderWan;
  BASE_COMPONENT.prototype._renderWan = function (...args) {
    if (!this._wanTransport) {
      this._wanTransport = this._activeWan?.() || "ethernet";
    }
    if (!["ethernet", "lte"].includes(this._wanTransport)) {
      this._wanTransport = "ethernet";
    }

    const ethernet = this._connection?.("ethernet_connected") || {
      label: "Состояние неизвестно",
      tone: "unknown",
    };
    const lte = this._connection?.("lte_connected") || {
      label: "Состояние неизвестно",
      tone: "unknown",
    };
    const selected = this._wanTransport;

    let html = baseRenderWan.apply(this, args);
    html = html.replace(
      '<section class="view">',
      `<section class="view wan-detail-view wan-transport-${selected}">
        <div class="wan-segment-switch" role="tablist" aria-label="Канал WAN">
          <button type="button" class="wan-segment ${selected === "ethernet" ? "active" : ""}" data-wan-transport="ethernet" role="tab" aria-selected="${selected === "ethernet"}">
            <div class="wan-segment-title"><ha-icon icon="mdi:ethernet"></ha-icon><strong>Провод</strong></div>
            <span class="wan-segment-state ${ethernet.tone}"><i></i>${ethernet.label}</span>
          </button>
          <button type="button" class="wan-segment ${selected === "lte" ? "active" : ""}" data-wan-transport="lte" role="tab" aria-selected="${selected === "lte"}">
            <div class="wan-segment-title"><ha-icon icon="mdi:signal-4g"></ha-icon><strong>LTE</strong></div>
            <span class="wan-segment-state ${lte.tone}"><i></i>${lte.label}</span>
          </button>
        </div>`,
    );
    html = html.replace(
      '<article class="card detail-card">',
      '<article class="card detail-card wan-ethernet-detail">',
    );
    html = html.replace(
      '<article class="card detail-card">',
      '<article class="card detail-card wan-lte-detail">',
    );
    return html;
  };

  const baseAttachInteractions = BASE_COMPONENT.prototype._attachInteractions;
  BASE_COMPONENT.prototype._attachInteractions = function (...args) {
    baseAttachInteractions.apply(this, args);
    this.shadowRoot?.querySelectorAll("[data-wan-transport]").forEach((button) => {
      button.addEventListener("click", () => {
        const transport = button.dataset.wanTransport;
        if (!["ethernet", "lte"].includes(transport) || transport === this._wanTransport) {
          return;
        }
        this._wanTransport = transport;
        this._scheduleRender?.();
      });
    });
  };

  const baseRender = BASE_COMPONENT.prototype._render;
  BASE_COMPONENT.prototype._render = function (...args) {
    baseRender.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-nikas-v023-content]")) return;
    const style = document.createElement("style");
    style.dataset.nikasV023Content = "true";
    style.textContent = `
      .shell {
        width: min(100%, 1100px) !important;
        margin: 0 auto !important;
        padding: 12px max(12px, env(safe-area-inset-right)) 16px max(12px, env(safe-area-inset-left)) !important;
      }
      .wan-segment-switch {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin: 0 0 2px;
      }
      .wan-segment {
        min-width: 0;
        min-height: 72px;
        border: 1px solid var(--kp-border);
        border-radius: 18px;
        background: var(--kp-surface);
        color: var(--primary-text-color);
        display: grid;
        align-content: center;
        gap: 5px;
        padding: 10px 12px;
        text-align: left;
        font: inherit;
        -webkit-tap-highlight-color: transparent;
      }
      .wan-segment.active {
        border-color: var(--kp-blue);
        background: color-mix(in srgb, var(--kp-blue) 8%, var(--kp-surface));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--kp-blue) 22%, transparent);
      }
      .wan-segment-title {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .wan-segment-title ha-icon {
        --mdc-icon-size: 22px;
        color: var(--kp-blue);
      }
      .wan-segment-title strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }
      .wan-segment-state {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--kp-muted);
        font-size: 10px;
        font-weight: 650;
      }
      .wan-segment-state i {
        width: 7px;
        height: 7px;
        flex: 0 0 7px;
        border-radius: 50%;
        background: var(--kp-grey);
      }
      .wan-segment-state.ok i { background: var(--kp-green); }
      .wan-segment-state.warn i { background: var(--kp-yellow); }
      .wan-segment-state.bad i { background: var(--kp-red); }
      .wan-transport-ethernet .wan-lte-detail { display: none !important; }
      .wan-transport-lte .wan-ethernet-detail { display: none !important; }
      .wan-detail-view .wan-ethernet-detail,
      .wan-detail-view .wan-lte-detail {
        grid-column: 1 / -1;
      }
      @media (max-width: 390px) {
        .wan-segment-switch { gap: 8px; }
        .wan-segment { min-height: 68px; padding: 9px 10px; }
      }
    `;
    root.append(style);
  };
}

function navigateExplicit(path) {
  if (!path) return;
  history.pushState(null, "", path);
  window.dispatchEvent(new Event("location-changed"));
}

class KeeneticHeroAppPanelV023 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._panel = null;
    this._route = null;
    this._child = null;
    this._activeView = this._viewFromLocation();
    this._hashListener = () => {
      this._activeView = this._viewFromLocation();
      this._renderTabBar();
    };
  }

  set hass(value) {
    this._hass = value;
    this._ensureChild();
    if (this._child) this._child.hass = value;
  }

  set panel(value) {
    this._panel = value;
    this._ensureChild();
    if (this._child) this._child.panel = value;
  }

  set route(value) {
    this._route = value;
    this._ensureChild();
    if (this._child) this._child.route = value;
  }

  connectedCallback() {
    this._renderShell();
    this._ensureChild();
    window.addEventListener("hashchange", this._hashListener);
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this._hashListener);
  }

  _viewFromLocation() {
    const value = (location.hash || "#overview").slice(1).toLowerCase();
    return ["overview", "wan", "failover", "traffic", "diagnostics", "system"].includes(value)
      ? value
      : "overview";
  }

  _ensureChild() {
    if (!this.isConnected) return;
    if (!this._child) {
      this._child = document.createElement("keenetic-hero-panel");
      this.shadowRoot.getElementById("app-content")?.appendChild(this._child);
    }
    if (this._hass) this._child.hass = this._hass;
    if (this._panel) this._child.panel = this._panel;
    if (this._route) this._child.route = this._route;
  }

  _setView(view) {
    history.replaceState(null, "", `${location.pathname}${location.search}#${view}`);
    this._activeView = view;
    if (this._child) {
      this._child._view = view;
      this._child._scheduleRender?.();
      this._child._loadViewData?.();
    }
    this._renderTabBar();
    this.shadowRoot.getElementById("app-content")?.scrollTo({ top: 0, behavior: "auto" });
  }

  _renderTabBar() {
    const nav = this.shadowRoot.getElementById("nika-tabbar");
    if (!nav) return;
    const items = [
      ["overview", "mdi:view-dashboard-outline", "Обзор"],
      ["wan", "mdi:wan", "WAN/LTE"],
      ["failover", "mdi:swap-horizontal-bold", "Failover"],
      ["traffic", "mdi:chart-timeline-variant", "Трафик"],
      ["diagnostics", "mdi:stethoscope", "Диагн."],
    ];
    const active = this._activeView === "system" ? "diagnostics" : this._activeView;
    nav.innerHTML = items
      .map(
        ([view, icon, label]) => `<button type="button" data-view="${view}" class="${active === view ? "active" : ""}" aria-current="${active === view ? "page" : "false"}">
          <ha-icon icon="${icon}"></ha-icon><span>${label}</span>
        </button>`,
      )
      .join("");
    nav.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => this._setView(button.dataset.view));
    });
  }

  _renderShell() {
    if (this.shadowRoot.getElementById("nika-app-shell")) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100dvh;
          min-height: 100%;
          color: var(--primary-text-color);
          background: var(--primary-background-color);
          --shell-surface: var(--ha-card-background, var(--card-background-color, #fff));
          --shell-border: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
          --shell-muted: var(--secondary-text-color, #6b7280);
          --shell-accent: var(--primary-color, #03a9f4);
        }
        * { box-sizing: border-box; }
        #nika-app-shell {
          height: 100%;
          min-height: 0;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          overflow: hidden;
          background: var(--primary-background-color);
        }
        .nika-header {
          min-height: 56px;
          display: grid;
          grid-template-columns: minmax(76px, auto) 1fr 52px;
          align-items: center;
          gap: 4px;
          padding: max(4px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) 4px max(8px, env(safe-area-inset-left));
          background: var(--shell-surface);
          border-bottom: 1px solid var(--shell-border);
          z-index: 2;
        }
        .back, .refresh {
          min-width: 44px;
          min-height: 44px;
          border: 0;
          border-radius: 14px;
          background: transparent;
          color: var(--primary-text-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 0 8px;
          font: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .back { justify-self: start; font-size: 13px; font-weight: 650; }
        .refresh { justify-self: end; }
        .back ha-icon, .refresh ha-icon { --mdc-icon-size: 23px; }
        .title { min-width: 0; text-align: center; line-height: 1.1; }
        .title strong {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 17px;
          font-weight: 750;
        }
        .title span {
          display: block;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--shell-muted);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .02em;
        }
        #app-content {
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior-y: contain;
          -webkit-overflow-scrolling: touch;
        }
        keenetic-hero-panel { display: block; min-height: 100%; }
        .nika-tabbar {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 2px;
          padding: 6px max(6px, env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(6px, env(safe-area-inset-left));
          background: var(--shell-surface);
          border-top: 1px solid var(--shell-border);
          box-shadow: 0 -3px 14px color-mix(in srgb, #000 8%, transparent);
          z-index: 3;
        }
        .nika-tabbar button {
          min-width: 0;
          min-height: 56px;
          border: 0;
          border-radius: 14px;
          background: transparent;
          color: var(--shell-muted);
          display: grid;
          place-items: center;
          align-content: center;
          gap: 2px;
          padding: 4px 2px;
          font: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .nika-tabbar button.active {
          color: var(--shell-accent);
          background: color-mix(in srgb, var(--shell-accent) 11%, transparent);
        }
        .nika-tabbar ha-icon { --mdc-icon-size: 22px; }
        .nika-tabbar span {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 9px;
          font-weight: 700;
        }
        @media (max-width: 390px) {
          .nika-header { grid-template-columns: 50px 1fr 50px; }
          .back span { display: none; }
        }
      </style>
      <div id="nika-app-shell">
        <header class="nika-header" aria-label="Keenetic">
          <button type="button" class="back" id="nika-back" aria-label="Назад в Инфраструктуру">
            <ha-icon icon="mdi:arrow-left"></ha-icon><span>Назад</span>
          </button>
          <div class="title">
            <strong>Keenetic Hero 4G+</strong>
            <span>Network Control Center · UI v${APP_SHELL_VERSION}</span>
          </div>
          <button type="button" class="refresh" id="nika-refresh" aria-label="Обновить">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </button>
        </header>
        <div id="app-content"></div>
        <nav class="nika-tabbar" id="nika-tabbar" aria-label="Разделы Keenetic"></nav>
      </div>`;

    this.shadowRoot.getElementById("nika-back")?.addEventListener("click", () => {
      navigateExplicit(this._panel?.config?.parent_route || PARENT_ROUTE);
    });
    this.shadowRoot.getElementById("nika-refresh")?.addEventListener("click", () => {
      this._child?._loadBootstrap?.(false);
    });
    this._renderTabBar();
  }
}

if (!customElements.get("keenetic-hero-app-panel-v023")) {
  customElements.define("keenetic-hero-app-panel-v023", KeeneticHeroAppPanelV023);
}
