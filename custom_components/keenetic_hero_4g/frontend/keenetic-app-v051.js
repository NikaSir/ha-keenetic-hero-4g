const CORE_COMPONENT_V051 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V051 = customElements.get("keenetic-hero-app-panel-v050");
const HERO_ASSET_V051 = "/keenetic_hero_4g_static/keenetic-room-v051.webp?v=0.5.1";

if (CORE_COMPONENT_V051 && !CORE_COMPONENT_V051.prototype.__nikaStaticHeroV051) {
  CORE_COMPONENT_V051.prototype.__nikaStaticHeroV051 = true;
  const renderBaseV051 = CORE_COMPONENT_V051.prototype._render;

  CORE_COMPONENT_V051.prototype._render = function (...args) {
    renderBaseV051.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-keenetic-v051]")) return;

    const style = document.createElement("style");
    style.dataset.keeneticV051 = "true";
    style.textContent = `
      .v050-scene {
        min-height: 430px !important;
        background-image: url("${HERO_ASSET_V051}") !important;
        background-size: cover !important;
        background-position: center 52% !important;
        background-repeat: no-repeat !important;
      }
      .v050-scene-shade {
        background: linear-gradient(180deg,rgba(255,255,255,.94) 0%,rgba(255,255,255,.54) 23%,rgba(255,255,255,.02) 52%,rgba(255,255,255,.14) 70%,rgba(255,255,255,.94) 100%) !important;
      }
      .v050-path { top: 184px !important; }
      .v050-reserve-badge { top: 252px !important; }
      .v050-kpi-row { bottom: 72px !important; }
      .v050-reserve-strip { bottom: 10px !important; }
      .v050-channels { padding: 12px !important; }
      .v050-channel-list { gap: 8px !important; margin-top: 8px !important; }
      .v050-channel { padding: 10px !important; }
      .v050-channel-grid { margin-top: 8px !important; }

      @media (max-width: 430px) {
        .v050-scene {
          min-height: 420px !important;
          background-position: center 52% !important;
        }
        .v050-path { top: 180px !important; }
        .v050-reserve-badge { top: 244px !important; }
        .v050-kpi-row { bottom: 70px !important; }
      }

      @media (min-width: 760px) {
        .v050-scene {
          min-height: 500px !important;
          background-position: center 50% !important;
        }
        .v050-path { top: 220px !important; }
        .v050-reserve-badge { top: 295px !important; }
      }
    `;
    root.append(style);
  };
}

if (BASE_COMPONENT_V051 && !customElements.get("keenetic-hero-app-panel-v051")) {
  class KeeneticHeroAppPanelV051 extends BASE_COMPONENT_V051 {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.5.1";
    }
  }

  customElements.define("keenetic-hero-app-panel-v051", KeeneticHeroAppPanelV051);
}
