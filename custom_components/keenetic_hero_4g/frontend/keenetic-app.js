import "./keenetic-panel.js";

const APP_SHELL_VERSION = "0.2.0";
const PARENT_ROUTE = "/dashboard-infrastructure/overview";
const BASE_COMPONENT = customElements.get("keenetic-hero-panel");

if (BASE_COMPONENT) {
  // The shared NikaS app shell owns the header. Keep the specialized panel
  // focused on device state/content and its fixed bottom navigation.
  BASE_COMPONENT.prototype._renderHeader = function () {
    return "";
  };

  // Unified NikaS bottom-navigation order: max five primary destinations.
  // System remains a secondary drill-down reachable from Diagnostics.
  BASE_COMPONENT.prototype._renderNav = function () {
    const items = [
      ["overview", "mdi:view-dashboard-outline", "Обзор"],
      ["wan", "mdi:wan", "WAN/LTE"],
      ["failover", "mdi:swap-horizontal-bold", "Failover"],
      ["traffic", "mdi:chart-timeline-variant", "Трафик"],
      ["diagnostics", "mdi:stethoscope", "Диагн."],
    ];
    return `<nav class="bottom-nav" aria-label="Разделы Keenetic">
      ${items
        .map(
          ([view, icon, label]) => `<button type="button" data-view="${view}" class="${
            this._view === view ? "active" : ""
          }" aria-current="${this._view === view ? "page" : "false"}">
            <ha-icon icon="${icon}"></ha-icon><span>${label}</span>
          </button>`,
        )
        .join("")}
    </nav>`;
  };
}

function navigateExplicit(path) {
  if (!path) return;
  history.pushState(null, "", path);
  window.dispatchEvent(new Event("location-changed"));
}

class KeeneticHeroAppPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._panel = null;
    this._route = null;
    this._child = null;
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

  _renderShell() {
    if (this.shadowRoot.getElementById("nika-app-shell")) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100%;
          color: var(--primary-text-color);
          background: var(--primary-background-color);
          --shell-surface: var(--ha-card-background, var(--card-background-color, #fff));
          --shell-border: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
          --shell-muted: var(--secondary-text-color, #6b7280);
          --shell-accent: var(--primary-color, #03a9f4);
        }
        * { box-sizing: border-box; }
        #nika-app-shell { min-height: 100%; }
        .nika-header {
          position: sticky;
          top: 0;
          z-index: 30;
          min-height: 56px;
          display: grid;
          grid-template-columns: minmax(76px, auto) 1fr 52px;
          align-items: center;
          gap: 4px;
          padding: max(4px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) 4px max(8px, env(safe-area-inset-left));
          background: color-mix(in srgb, var(--shell-surface) 94%, transparent);
          border-bottom: 1px solid var(--shell-border);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
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
        #app-content { min-height: 0; }
        keenetic-hero-panel { display: block; min-height: 100%; }
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
      </div>`;

    this.shadowRoot.getElementById("nika-back")?.addEventListener("click", () => {
      navigateExplicit(this._panel?.config?.parent_route || PARENT_ROUTE);
    });

    this.shadowRoot.getElementById("nika-refresh")?.addEventListener("click", () => {
      if (this._child?._loadBootstrap) this._child._loadBootstrap(false);
    });
  }
}

if (!customElements.get("keenetic-hero-app-panel")) {
  customElements.define("keenetic-hero-app-panel", KeeneticHeroAppPanel);
}
