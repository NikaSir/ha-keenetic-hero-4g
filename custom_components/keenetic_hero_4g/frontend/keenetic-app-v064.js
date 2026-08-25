await import("./keenetic-app-v063.js?v=0.6.4");

const CORE_COMPONENT_V064 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V064 = customElements.get("keenetic-hero-app-panel-v063");
const ROOM_ASSET_V064 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=0.6.4";

function _v064InstallRoom(root) {
  if (!root) return;

  if (!root.querySelector("style[data-keenetic-v064]")) {
    const style = document.createElement("style");
    style.dataset.keeneticV064 = "true";
    style.textContent = `
      .v050-scene{
        background-image:url("${ROOM_ASSET_V064}")!important;
        background-position:center!important;
        background-size:cover!important;
      }
    `;
    root.append(style);
  }

  const scene = root.querySelector(".v050-scene");
  if (!scene) return;
  scene.classList.add("v064-photorealistic-room");
  scene.style.backgroundImage = `url("${ROOM_ASSET_V064}")`;
}

if (CORE_COMPONENT_V064 && !CORE_COMPONENT_V064.prototype.__nikaPhotorealisticRoomV064) {
  CORE_COMPONENT_V064.prototype.__nikaPhotorealisticRoomV064 = true;
  const renderBaseV064 = CORE_COMPONENT_V064.prototype._render;
  CORE_COMPONENT_V064.prototype._render = function (...args) {
    renderBaseV064.apply(this, args);
    _v064InstallRoom(this.shadowRoot);
  };
}

if (BASE_COMPONENT_V064 && !customElements.get("keenetic-hero-app-panel-v064")) {
  class KeeneticHeroAppPanelV064 extends BASE_COMPONENT_V064 {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.4";
    }
  }
  customElements.define("keenetic-hero-app-panel-v064", KeeneticHeroAppPanelV064);
}
