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
      const root = this.shadowRoot;
      const version = root?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.4";

      if (root && !root.querySelector("style[data-nikas-v044-tabbar]")) {
        const style = document.createElement("style");
        style.dataset.nikasV044Tabbar = "true";
        style.textContent = `
          .nika-tabbar {
            gap: 0 !important;
            padding: 4px max(8px, env(safe-area-inset-right)) calc(4px + env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left)) !important;
            box-shadow: 0 -1px 0 var(--shell-border) !important;
          }
          .nika-tabbar button {
            min-height: 52px !important;
            border-radius: 12px !important;
            gap: 1px !important;
            padding: 3px 2px !important;
          }
          .nika-tabbar button.active {
            background: transparent !important;
          }
          .nika-tabbar button.active::before {
            content: "";
            position: absolute;
            inset: 4px 16%;
            border-radius: 12px;
            background: color-mix(in srgb, var(--shell-accent) 10%, transparent);
            z-index: -1;
          }
          .nika-tabbar button {
            position: relative;
            isolation: isolate;
          }
          .nika-tabbar ha-icon {
            --mdc-icon-size: 21px !important;
          }
          .nika-tabbar span {
            font-size: 9px !important;
            font-weight: 650 !important;
          }
          @media (min-width: 700px) {
            .nika-tabbar {
              padding-left: max(18px, env(safe-area-inset-left)) !important;
              padding-right: max(18px, env(safe-area-inset-right)) !important;
            }
            .nika-tabbar button.active::before {
              inset: 4px 28%;
            }
          }
        `;
        root.append(style);
      }
    }
  }
  customElements.define("keenetic-hero-app-panel-v044", KeeneticHeroAppPanelV044);
}
