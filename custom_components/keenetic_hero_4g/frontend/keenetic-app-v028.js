import "./keenetic-app-v027.js?v=0.2.8";

const APP_SHELL_VERSION = "0.2.8";
const BOOTSTRAP_TIMEOUT_MS = 5000;
const V027_COMPONENT = customElements.get("keenetic-hero-app-panel-v027");

class KeeneticHeroAppPanelV028 extends V027_COMPONENT {
  set panel(value) {
    const fallback = value?.config?.bootstrap_fallback;
    if (!this._bootstrap && fallback) {
      this._bootstrap = fallback;
      this._bootstrapError = null;
    }

    this._panel = value;
    if (!location.hash && value?.config?.preferred_view) {
      this._view = value.config.preferred_view;
    }
    this._scheduleRender?.();
  }

  async _loadBootstrap(silent = false) {
    if (!this._hass || this._bootstrapLoading) return;

    this._bootstrapLoading = true;
    if (!silent) this._bootstrapError = null;

    let timeoutId = null;
    try {
      const config = this._panel?.config || {};
      const request = this._hass.callWS({
        type: "keenetic_hero_4g/panel/bootstrap",
        ...(config.entry_id ? { entry_id: config.entry_id } : {}),
      });
      const timeout = new Promise((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error("Bootstrap Keenetic не ответил за 5 сек")),
          BOOTSTRAP_TIMEOUT_MS,
        );
      });

      const result = await Promise.race([request, timeout]);
      this._bootstrap = result;
      this._bootstrapError = null;
      this._loadViewData?.();
    } catch (err) {
      this._bootstrapError = err?.message || String(err);
      // Keep a previously supplied registration snapshot. A transient
      // WebSocket problem must never blank the whole application shell.
      if (!this._bootstrap) {
        const fallback = this._panel?.config?.bootstrap_fallback;
        if (fallback) this._bootstrap = fallback;
      }
    } finally {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      this._bootstrapLoading = false;
      this._scheduleRender?.();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateVersionLabelV028();
  }

  _renderShell() {
    super._renderShell();
    this._updateVersionLabelV028();
  }

  _updateVersionLabelV028() {
    const subtitle = this.shadowRoot?.querySelector(".title span");
    if (subtitle) subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION}`;
  }
}

if (!customElements.get("keenetic-hero-app-panel-v028")) {
  customElements.define("keenetic-hero-app-panel-v028", KeeneticHeroAppPanelV028);
}
