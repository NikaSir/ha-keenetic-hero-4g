await import("./keenetic-app-v043.js?v=0.4.4");

const CORE_COMPONENT = customElements.get("keenetic-hero-panel");
const BOOTSTRAP_CACHE_KEY = "keenetic_hero_4g:panel_bootstrap:v1";
const BOOTSTRAP_TIMEOUT_MS = 5000;

function readBootstrapCache() {
  try {
    const raw = window.localStorage.getItem(BOOTSTRAP_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.entities) return null;
    return parsed;
  } catch (_err) {
    return null;
  }
}

function writeBootstrapCache(value) {
  try {
    if (value?.entities) window.localStorage.setItem(BOOTSTRAP_CACHE_KEY, JSON.stringify(value));
  } catch (_err) {
    // Storage is an acceleration layer only; panel operation never depends on it.
  }
}

if (CORE_COMPONENT && !CORE_COMPONENT.prototype.__nikaFastBootstrapV044) {
  CORE_COMPONENT.prototype.__nikaFastBootstrapV044 = true;

  const connectedBase = CORE_COMPONENT.prototype.connectedCallback;
  CORE_COMPONENT.prototype.connectedCallback = function (...args) {
    connectedBase?.apply(this, args);
    // Entity state updates already arrive through Home Assistant frontend state.
    // Do not poll the structural role mapping every 30 seconds.
    if (this._refreshTimer) {
      window.clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
  };

  CORE_COMPONENT.prototype._loadBootstrap = async function (silent = false) {
    if (!this._hass || this._bootstrapLoading) return;

    if (!this._bootstrap) {
      const cached = readBootstrapCache();
      if (cached) {
        this._bootstrap = cached;
        this._bootstrapError = null;
        this._scheduleRender?.();
        this._loadViewData?.();
      }
    }

    this._bootstrapLoading = true;
    if (!silent && !this._bootstrap) this._bootstrapError = null;
    let timer = null;
    try {
      const config = this._panel?.config || {};
      const request = this._hass.callWS({
        type: "keenetic_hero_4g/panel/bootstrap",
        ...(config.entry_id ? { entry_id: config.entry_id } : {}),
      });
      const timeout = new Promise((_, reject) => {
        timer = window.setTimeout(() => reject(new Error("Bootstrap timeout 5 s")), BOOTSTRAP_TIMEOUT_MS);
      });
      const fresh = await Promise.race([request, timeout]);
      this._bootstrap = fresh;
      writeBootstrapCache(fresh);
      this._bootstrapError = null;
      this._loadViewData?.();
    } catch (err) {
      // Cached role mapping remains usable with live hass.states. Never replace a
      // working panel with a fatal full-screen error because bootstrap is slow.
      if (!this._bootstrap) this._bootstrapError = err?.message || String(err);
      else this._bootstrapError = null;
    } finally {
      if (timer) window.clearTimeout(timer);
      this._bootstrapLoading = false;
      this._scheduleRender?.();
    }
  };
}

const BASE_COMPONENT = customElements.get("keenetic-hero-app-panel-v043");
if (BASE_COMPONENT && !customElements.get("keenetic-hero-app-panel-v044")) {
  class KeeneticHeroAppPanelV044 extends BASE_COMPONENT {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.4";
    }
  }
  customElements.define("keenetic-hero-app-panel-v044", KeeneticHeroAppPanelV044);
}
