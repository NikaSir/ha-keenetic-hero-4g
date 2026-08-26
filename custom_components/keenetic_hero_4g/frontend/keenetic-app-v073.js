await import("./keenetic-app-v072.js?v=0.7.3");

const CORE_COMPONENT_V073 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V073 = customElements.get("keenetic-hero-app-panel-v072");

if (CORE_COMPONENT_V073 && !CORE_COMPONENT_V073.prototype.__nikaFailoverIdempotentV073) {
  CORE_COMPONENT_V073.prototype.__nikaFailoverIdempotentV073 = true;

  CORE_COMPONENT_V073.prototype._loadFailoverHistory = function () {
    // Recorder history stays disabled, but the notice must be committed once.
    // The previous override scheduled another render after every render, which
    // created an endless microtask loop whenever the Failover view was active.
    if (this._failoverHistoryDisabledV073) return;
    this._failoverHistoryDisabledV073 = true;
    this._failoverLoading = false;
    this._failoverHistory = [];
    this._failoverError = "История HA Recorder временно отключена";
    this._scheduleRender?.();
  };
}

if (BASE_COMPONENT_V073 && !customElements.get("keenetic-hero-app-panel-v073")) {
  class KeeneticHeroAppPanelV073 extends BASE_COMPONENT_V073 {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.7.3";
    }
  }

  customElements.define("keenetic-hero-app-panel-v073", KeeneticHeroAppPanelV073);
}
