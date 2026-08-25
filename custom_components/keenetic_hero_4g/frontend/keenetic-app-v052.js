await import("./keenetic-app-v051.js?v=0.5.2");

const BASE_COMPONENT_V052 = customElements.get("keenetic-hero-app-panel-v051");
const HERO_ASSET_V052 = "/keenetic_hero_4g_static/assets/keenetic-room-v052.webp?v=0.5.2";
const CORE_COMPONENT_V052 = customElements.get("keenetic-hero-panel");

if (CORE_COMPONENT_V052 && !CORE_COMPONENT_V052.prototype.__nikaAssetsStandardV052) {
  CORE_COMPONENT_V052.prototype.__nikaAssetsStandardV052 = true;
  const renderBaseV052 = CORE_COMPONENT_V052.prototype._render;

  CORE_COMPONENT_V052.prototype._render = function (...args) {
    renderBaseV052.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-keenetic-v052]")) return;

    const style = document.createElement("style");
    style.dataset.keeneticV052 = "true";
    style.textContent = `
      .v050-scene {
        background-image: url("${HERO_ASSET_V052}") !important;
      }
    `;
    root.append(style);
  };
}

if (BASE_COMPONENT_V052 && !customElements.get("keenetic-hero-app-panel-v052")) {
  class KeeneticHeroAppPanelV052 extends BASE_COMPONENT_V052 {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.5.2";
    }
  }

  customElements.define("keenetic-hero-app-panel-v052", KeeneticHeroAppPanelV052);
}
