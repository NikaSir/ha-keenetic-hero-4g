await import("./keenetic-app-v042.js?v=0.4.3");

const CORE_COMPONENT = customElements.get("keenetic-hero-panel");
if (CORE_COMPONENT && !CORE_COMPONENT.prototype.__nikaRecorderDisabledV043) {
  CORE_COMPONENT.prototype.__nikaRecorderDisabledV043 = true;
  CORE_COMPONENT.prototype._loadFailoverHistory = async function () {
    this._failoverLoading = false;
    this._failoverHistory = [];
    this._failoverError = "История HA Recorder временно отключена в UI v0.4.3";
    this._scheduleRender?.();
  };
}

const BASE_COMPONENT = customElements.get("keenetic-hero-app-panel-v042");
if (BASE_COMPONENT && !customElements.get("keenetic-hero-app-panel-v043")) {
  class KeeneticHeroAppPanelV043 extends BASE_COMPONENT {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.3";
    }
  }
  customElements.define("keenetic-hero-app-panel-v043", KeeneticHeroAppPanelV043);
}
