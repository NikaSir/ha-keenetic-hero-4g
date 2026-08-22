import "./keenetic-app-v028.js?v=0.2.9";

const APP_SHELL_VERSION = "0.2.9";
const V028_COMPONENT = customElements.get("keenetic-hero-app-panel-v028");

class KeeneticHeroAppPanelV029 extends V028_COMPONENT {
  connectedCallback() {
    super.connectedCallback();
    this._updateVersionLabelV029();
  }

  _renderShell() {
    super._renderShell();
    this._updateVersionLabelV029();
  }

  _updateVersionLabelV029() {
    const subtitle = this.shadowRoot?.querySelector(".title span");
    if (subtitle) subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION}`;
  }
}

if (!customElements.get("keenetic-hero-app-panel-v029")) {
  customElements.define("keenetic-hero-app-panel-v029", KeeneticHeroAppPanelV029);
}
