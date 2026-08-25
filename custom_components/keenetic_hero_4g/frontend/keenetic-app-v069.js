await import("./keenetic-app-v068.js?v=0.6.9");

const BASE_COMPONENT_V069 = customElements.get("keenetic-hero-app-panel-v068");

function _v069InstallBottomSafeArea(root) {
  if (!root || root.querySelector("style[data-nikas-bottom-safe-area-v069]")) return;
  const style = document.createElement("style");
  style.dataset.nikasBottomSafeAreaV069 = "true";
  style.textContent = `
    /* Keep the native tab controls above the iPhone Home Indicator. */
    .nika-tabbar{
      padding-bottom:calc(4px + env(safe-area-inset-bottom,0px))!important;
    }
  `;
  root.append(style);
}

if (BASE_COMPONENT_V069 && !customElements.get("keenetic-hero-app-panel-v069")) {
  class KeeneticHeroAppPanelV069 extends BASE_COMPONENT_V069 {
    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;
      _v069InstallBottomSafeArea(root);
      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.9";
    }
  }

  customElements.define("keenetic-hero-app-panel-v069", KeeneticHeroAppPanelV069);
}
