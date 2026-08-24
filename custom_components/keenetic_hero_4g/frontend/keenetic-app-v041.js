import "./keenetic-app-v040.js?v=0.4.1";

const BASE_COMPONENT = customElements.get("keenetic-hero-app-panel-v040");

function openHomeAssistantMenu(target) {
  target.dispatchEvent(
    new CustomEvent("hass-toggle-menu", {
      bubbles: true,
      composed: true,
    }),
  );
}

if (BASE_COMPONENT && !customElements.get("keenetic-hero-app-panel-v041")) {
  class KeeneticHeroAppPanelV041 extends BASE_COMPONENT {
    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      const oldButton = root?.getElementById("nika-back");
      if (!oldButton || oldButton.dataset.haMenuButton === "true") return;

      const menuButton = oldButton.cloneNode(true);
      menuButton.dataset.haMenuButton = "true";
      menuButton.id = "nika-menu";
      menuButton.className = "back";
      menuButton.setAttribute("aria-label", "Открыть меню Home Assistant");
      menuButton.innerHTML = '<ha-icon icon="mdi:menu"></ha-icon>';
      oldButton.replaceWith(menuButton);

      menuButton.addEventListener("click", () => openHomeAssistantMenu(menuButton));

      const version = root?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.1";
    }
  }

  customElements.define("keenetic-hero-app-panel-v041", KeeneticHeroAppPanelV041);
}
