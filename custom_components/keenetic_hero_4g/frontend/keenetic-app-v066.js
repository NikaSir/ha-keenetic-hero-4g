await import("./keenetic-app-v065.js?v=0.6.6");

const BASE_COMPONENT_V066 = customElements.get("keenetic-hero-app-panel-v065");

function _v066InstallHeaderSafeArea(root) {
  if (!root || root.querySelector("style[data-nikas-header-safe-area-v066]")) return;
  const style = document.createElement("style");
  style.dataset.nikasHeaderSafeAreaV066 = "true";
  style.textContent = `
    .nika-header{
      min-height:calc(63px + env(safe-area-inset-top,0px))!important;
      padding-top:calc(4px + env(safe-area-inset-top,0px))!important;
      padding-right:max(8px,env(safe-area-inset-right,0px))!important;
      padding-bottom:4px!important;
      padding-left:max(8px,env(safe-area-inset-left,0px))!important;
    }
    @media(max-width:390px){
      .nika-header{
        min-height:calc(60px + env(safe-area-inset-top,0px))!important;
      }
    }
  `;
  root.append(style);
}

if (BASE_COMPONENT_V066 && !customElements.get("keenetic-hero-app-panel-v066")) {
  class KeeneticHeroAppPanelV066 extends BASE_COMPONENT_V066 {
    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;
      _v066InstallHeaderSafeArea(root);
      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.6";
    }
  }

  customElements.define("keenetic-hero-app-panel-v066", KeeneticHeroAppPanelV066);
}
