await import("./keenetic-app-v086.js");

const UI_VERSION_V087 = "0.8.7";
const CURRENT_SHELL_BASE_V087 = customElements.get("keenetic-hero-app-panel-v086");

if (CURRENT_SHELL_BASE_V087 && !customElements.get("keenetic-hero-app-panel-v087")) {
  class KeeneticHeroAppPanelV087 extends CURRENT_SHELL_BASE_V087 {
    _mountShell() {
      super._mountShell();
      const version = this.shadowRoot?.querySelector("#return-v081 span");
      if (version && version.textContent !== `UI v${UI_VERSION_V087}`) {
        version.textContent = `UI v${UI_VERSION_V087}`;
      }
    }
  }

  customElements.define("keenetic-hero-app-panel-v087", KeeneticHeroAppPanelV087);
}
