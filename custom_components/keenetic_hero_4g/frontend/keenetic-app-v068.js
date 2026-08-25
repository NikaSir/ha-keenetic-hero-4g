await import("./keenetic-app-v067.js?v=0.6.8");

const CORE_COMPONENT_V068 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V068 = customElements.get("keenetic-hero-app-panel-v067");

function _v068InstallRouterPathOcclusion(root) {
  if (!root || root.querySelector("style[data-keenetic-v068]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticV068 = "true";
  style.textContent = `
    /* Connection paths terminate naturally at the router silhouette. */
    .v063-flow-layer{z-index:2!important}
    .v060-router{z-index:3!important}
  `;
  root.append(style);
}

if (CORE_COMPONENT_V068 && !CORE_COMPONENT_V068.prototype.__nikaRouterPathOcclusionV068) {
  CORE_COMPONENT_V068.prototype.__nikaRouterPathOcclusionV068 = true;
  const renderBaseV068 = CORE_COMPONENT_V068.prototype._render;
  CORE_COMPONENT_V068.prototype._render = function (...args) {
    renderBaseV068.apply(this, args);
    _v068InstallRouterPathOcclusion(this.shadowRoot);
  };
}

if (BASE_COMPONENT_V068 && !customElements.get("keenetic-hero-app-panel-v068")) {
  class KeeneticHeroAppPanelV068 extends BASE_COMPONENT_V068 {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.8";
    }
  }

  customElements.define("keenetic-hero-app-panel-v068", KeeneticHeroAppPanelV068);
}
