import "./keenetic-app-v023.js?v=0.2.4";

const APP_SHELL_VERSION = "0.2.4";
const BASE_COMPONENT = customElements.get("keenetic-hero-panel");
const V023_COMPONENT = customElements.get("keenetic-hero-app-panel-v023");

function routeLabel(connection, isActive, transport) {
  if (isActive) return "Активен";
  if (connection?.state === "up") {
    return transport === "lte" ? "Резерв готов" : "Основной готов";
  }
  if (connection?.state === "down") return "Недоступен";
  return "Состояние неизвестно";
}

if (BASE_COMPONENT) {
  const baseRenderOverview = BASE_COMPONENT.prototype._renderOverview;
  BASE_COMPONENT.prototype._renderOverview = function (...args) {
    const active = this._activeWan?.();
    const ethernet = this._connection?.("ethernet_connected") || {
      state: "unknown",
      tone: "unknown",
    };
    const lte = this._connection?.("lte_connected") || {
      state: "unknown",
      tone: "unknown",
    };

    const selector = `<div class="overview-wan-switch" role="group" aria-label="WAN каналы">
      <button type="button" class="overview-wan-button ${active === "ethernet" ? "route-active" : ""}" data-overview-wan="ethernet" aria-pressed="${active === "ethernet"}">
        <div class="overview-wan-title"><ha-icon icon="mdi:ethernet"></ha-icon><strong>Провод</strong></div>
        <div class="overview-wan-meta">
          <span class="overview-route-state ${active === "ethernet" ? "active" : ethernet.tone}"><i></i>${routeLabel(ethernet, active === "ethernet", "ethernet")}</span>
          <small>Открыть WAN/LTE</small>
        </div>
      </button>
      <button type="button" class="overview-wan-button ${active === "lte" ? "route-active" : ""}" data-overview-wan="lte" aria-pressed="${active === "lte"}">
        <div class="overview-wan-title"><ha-icon icon="mdi:signal-4g"></ha-icon><strong>LTE</strong></div>
        <div class="overview-wan-meta">
          <span class="overview-route-state ${active === "lte" ? "active" : lte.tone}"><i></i>${routeLabel(lte, active === "lte", "lte")}</span>
          <small>Открыть WAN/LTE</small>
        </div>
      </button>
    </div>`;

    let html = baseRenderOverview.apply(this, args);
    html = html.replace('<div class="wan-pair">', `${selector}<div class="wan-pair">`);
    return html;
  };

  const baseAttachInteractions = BASE_COMPONENT.prototype._attachInteractions;
  BASE_COMPONENT.prototype._attachInteractions = function (...args) {
    baseAttachInteractions.apply(this, args);
    this.shadowRoot?.querySelectorAll("[data-overview-wan]").forEach((button) => {
      button.addEventListener("click", () => {
        const transport = button.dataset.overviewWan;
        if (!["ethernet", "lte"].includes(transport)) return;
        this._wanTransport = transport;
        history.replaceState(null, "", `${location.pathname}${location.search}#wan`);
        this._view = "wan";
        this._scheduleRender?.();
        this._loadViewData?.();
      });
    });
  };

  const baseRender = BASE_COMPONENT.prototype._render;
  BASE_COMPONENT.prototype._render = function (...args) {
    baseRender.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-nikas-v024-overview]")) return;

    const style = document.createElement("style");
    style.dataset.nikasV024Overview = "true";
    style.textContent = `
      .overview-wan-switch {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin: 0;
      }
      .overview-wan-button {
        min-width: 0;
        min-height: 70px;
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
      .overview-wan-button.route-active {
        border-color: var(--kp-blue);
        background: color-mix(in srgb, var(--kp-blue) 8%, var(--kp-surface));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--kp-blue) 24%, transparent);
      }
      .overview-wan-title {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .overview-wan-title ha-icon {
        --mdc-icon-size: 22px;
        color: var(--kp-blue);
      }
      .overview-wan-title strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }
      .overview-wan-meta {
        min-width: 0;
      }
      .overview-wan-meta small {
        display: block;
        margin-top: 2px;
        color: var(--kp-muted);
        font-size: 8px;
      }
      .overview-route-state {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--kp-muted);
        font-size: 10px;
        font-weight: 700;
      }
      .overview-route-state i {
        width: 7px;
        height: 7px;
        flex: 0 0 7px;
        border-radius: 50%;
        background: var(--kp-grey);
      }
      .overview-route-state.active {
        color: var(--kp-blue);
      }
      .overview-route-state.active i { background: var(--kp-blue); }
      .overview-route-state.ok i { background: var(--kp-green); }
      .overview-route-state.warn i { background: var(--kp-yellow); }
      .overview-route-state.bad i { background: var(--kp-red); }
      @media (max-width: 390px) {
        .overview-wan-switch { gap: 8px; }
        .overview-wan-button { min-height: 66px; padding: 9px 10px; }
      }
    `;
    root.append(style);
  };
}

class KeeneticHeroAppPanelV024 extends V023_COMPONENT {
  connectedCallback() {
    super.connectedCallback();
    this._updateVersionLabel();
  }

  _renderShell() {
    super._renderShell();
    this._updateVersionLabel();
  }

  _updateVersionLabel() {
    const subtitle = this.shadowRoot?.querySelector(".title span");
    if (subtitle) subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION}`;
  }
}

if (!customElements.get("keenetic-hero-app-panel-v024")) {
  customElements.define("keenetic-hero-app-panel-v024", KeeneticHeroAppPanelV024);
}
