import "./keenetic-app-v024.js?v=0.2.5";

const APP_SHELL_VERSION = "0.2.5";
const BASE_COMPONENT = customElements.get("keenetic-hero-panel");
const V024_COMPONENT = customElements.get("keenetic-hero-app-panel-v024");

if (BASE_COMPONENT) {
  const v024RenderOverview = BASE_COMPONENT.prototype._renderOverview;
  BASE_COMPONENT.prototype._renderOverview = function (...args) {
    const active = this._activeWan?.();

    // Default Overview detail follows the factual active WAN. Once the user
    // explicitly selects another branch, keep that diagnostic selection until
    // the panel is recreated. If active WAN is unknown, do not invent one.
    if (!this._overviewTransportTouched) {
      this._overviewTransport = ["ethernet", "lte"].includes(active) ? active : null;
    }
    if (!["ethernet", "lte"].includes(this._overviewTransport)) {
      this._overviewTransport = null;
    }
    const selected = this._overviewTransport;

    let html = v024RenderOverview.apply(this, args);

    // v0.2.4 marks the factual active route. v0.2.5 adds an independent
    // selected state: factual activity and diagnostic selection are separate.
    let buttonIndex = 0;
    html = html.replace(
      /class="overview-wan-button(?: route-active)?"/g,
      () => {
        const transport = buttonIndex++ === 0 ? "ethernet" : "lte";
        const classes = ["overview-wan-button"];
        if (active === transport) classes.push("route-active");
        if (selected === transport) classes.push("selected");
        return `class="${classes.join(" ")}"`;
      },
    );

    const unknownHint = selected
      ? ""
      : `<div class="overview-wan-unknown"><ha-icon icon="mdi:help-circle-outline"></ha-icon><span>Активный WAN неизвестен. Выберите Провод или LTE для просмотра деталей.</span></div>`;

    html = html.replace(
      '<div class="wan-pair">',
      `${unknownHint}<div class="wan-pair overview-wan-detail ${selected ? `selected-${selected}` : "selected-unknown"}">`,
    );
    return html;
  };

  const v024AttachInteractions = BASE_COMPONENT.prototype._attachInteractions;
  BASE_COMPONENT.prototype._attachInteractions = function (...args) {
    v024AttachInteractions.apply(this, args);

    // v0.2.4 buttons navigated into the WAN/LTE screen. Clone them to remove
    // those handlers and make them an in-place Overview detail selector.
    this.shadowRoot?.querySelectorAll("[data-overview-wan]").forEach((button) => {
      const clone = button.cloneNode(true);
      button.replaceWith(clone);
      clone.addEventListener("click", () => {
        const transport = clone.dataset.overviewWan;
        if (!["ethernet", "lte"].includes(transport)) return;
        this._overviewTransportTouched = true;
        this._overviewTransport = transport;
        this._scheduleRender?.();
      });
    });
  };

  const v024Render = BASE_COMPONENT.prototype._render;
  BASE_COMPONENT.prototype._render = function (...args) {
    v024Render.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-nikas-v025-overview]")) return;

    const style = document.createElement("style");
    style.dataset.nikasV025Overview = "true";
    style.textContent = `
      .overview-wan-button.route-active:not(.selected) {
        border-color: var(--kp-border) !important;
        background: var(--kp-surface) !important;
        box-shadow: none !important;
      }
      .overview-wan-button.selected {
        border-color: var(--kp-blue) !important;
        background: color-mix(in srgb, var(--kp-blue) 8%, var(--kp-surface)) !important;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--kp-blue) 24%, transparent) !important;
      }
      .overview-wan-detail {
        grid-template-columns: minmax(0, 1fr) !important;
      }
      .overview-wan-detail.selected-ethernet .channel-card:nth-child(2),
      .overview-wan-detail.selected-lte .channel-card:nth-child(1),
      .overview-wan-detail.selected-unknown .channel-card {
        display: none !important;
      }
      .overview-wan-detail .channel-card {
        width: 100%;
        min-height: 0;
      }
      .overview-wan-unknown {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 48px;
        padding: 9px 11px;
        border: 1px solid var(--kp-border);
        border-radius: 14px;
        color: var(--kp-muted);
        background: var(--kp-surface);
        font-size: 10px;
      }
      .overview-wan-unknown ha-icon {
        --mdc-icon-size: 20px;
        color: var(--kp-grey);
      }
    `;
    root.append(style);
  };
}

class KeeneticHeroAppPanelV025 extends V024_COMPONENT {
  connectedCallback() {
    super.connectedCallback();
    this._updateVersionLabel025();
  }

  _renderShell() {
    super._renderShell();
    this._updateVersionLabel025();
  }

  _updateVersionLabel025() {
    const subtitle = this.shadowRoot?.querySelector(".title span");
    if (subtitle) subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION}`;
  }
}

if (!customElements.get("keenetic-hero-app-panel-v025")) {
  customElements.define("keenetic-hero-app-panel-v025", KeeneticHeroAppPanelV025);
}
