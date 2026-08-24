await import("./keenetic-app-v044.js?v=0.4.5");

const CORE_COMPONENT_V045 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V045 = customElements.get("keenetic-hero-app-panel-v044");
const BOOTSTRAP_CACHE_KEY_V045 = "keenetic_hero_4g:panel_bootstrap:v2";
const BOOTSTRAP_TIMEOUT_MS_V045 = 5000;

function structuralBootstrapV045(value) {
  if (!value || typeof value !== "object" || !value.entities) return null;
  const entry = value.entry || {};
  const telemetry = value.telemetry || {};
  return {
    panel: value.panel || {},
    entry: {
      title: entry.title,
      hostname: entry.hostname,
      model: entry.model,
      firmware: entry.firmware,
    },
    entities: { ...(value.entities || {}) },
    sources: { ...(value.sources || {}) },
    telemetry: {
      scan_interval_seconds: telemetry.scan_interval_seconds,
    },
  };
}

function readBootstrapCacheV045() {
  try {
    const raw = window.localStorage.getItem(BOOTSTRAP_CACHE_KEY_V045);
    if (!raw) return null;
    return structuralBootstrapV045(JSON.parse(raw));
  } catch (_err) {
    return null;
  }
}

function writeBootstrapCacheV045(value) {
  try {
    const safe = structuralBootstrapV045(value);
    if (safe) window.localStorage.setItem(BOOTSTRAP_CACHE_KEY_V045, JSON.stringify(safe));
  } catch (_err) {
    // Cache is an acceleration layer only. Panel operation never depends on it.
  }
}

function seedBootstrapV045(instance) {
  if (instance._bootstrap) return true;
  const fallback = instance._panel?.config?.bootstrap_fallback;
  const seed = structuralBootstrapV045(fallback) || readBootstrapCacheV045();
  if (!seed) return false;
  instance._bootstrap = seed;
  instance._bootstrapError = null;
  instance._scheduleRender?.();
  instance._loadViewData?.();
  return true;
}

if (CORE_COMPONENT_V045 && !CORE_COMPONENT_V045.prototype.__nikaFastBootstrapV045) {
  CORE_COMPONENT_V045.prototype.__nikaFastBootstrapV045 = true;

  const panelDescriptorV045 = Object.getOwnPropertyDescriptor(CORE_COMPONENT_V045.prototype, "panel");
  if (panelDescriptorV045?.set) {
    Object.defineProperty(CORE_COMPONENT_V045.prototype, "panel", {
      configurable: true,
      enumerable: panelDescriptorV045.enumerable,
      set(value) {
        panelDescriptorV045.set.call(this, value);
        seedBootstrapV045(this);
        if (this._hass && !this._bootstrapLoading) {
          queueMicrotask(() => this._loadBootstrap(true));
        }
      },
    });
  }

  const hassDescriptorV045 = Object.getOwnPropertyDescriptor(CORE_COMPONENT_V045.prototype, "hass");
  if (hassDescriptorV045?.set) {
    Object.defineProperty(CORE_COMPONENT_V045.prototype, "hass", {
      configurable: true,
      enumerable: hassDescriptorV045.enumerable,
      set(value) {
        // Do not call the legacy setter: it starts a blocking websocket request
        // before the custom-panel config/fallback may have arrived.
        this._hass = value;
        seedBootstrapV045(this);
        this._scheduleRender?.();
        if (this._panel && !this._bootstrapLoading) {
          queueMicrotask(() => this._loadBootstrap(true));
        }
      },
    });
  }

  const connectedBaseV045 = CORE_COMPONENT_V045.prototype.connectedCallback;
  CORE_COMPONENT_V045.prototype.connectedCallback = function (...args) {
    connectedBaseV045?.apply(this, args);
    // Live entity values already flow through hass.states. The role mapping is
    // structural data and must not be polled every 30 seconds.
    if (this._refreshTimer) {
      window.clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
    seedBootstrapV045(this);
    if (this._hass && this._panel && !this._bootstrapLoading) {
      queueMicrotask(() => this._loadBootstrap(true));
    }
  };

  CORE_COMPONENT_V045.prototype._loadBootstrap = async function (silent = false) {
    if (!this._hass || this._bootstrapLoading) return;

    seedBootstrapV045(this);
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
        timer = window.setTimeout(
          () => reject(new Error("Bootstrap timeout 5 s")),
          BOOTSTRAP_TIMEOUT_MS_V045,
        );
      });
      const fresh = await Promise.race([request, timeout]);
      this._bootstrap = fresh;
      writeBootstrapCacheV045(fresh);
      this._bootstrapError = null;
      this._bootstrapBackgroundError = null;
      this._loadViewData?.();
    } catch (err) {
      // A slow structural refresh must never replace a usable panel with a
      // full-screen loading/error state. Cached/fallback mapping remains active.
      if (!this._bootstrap) this._bootstrapError = err?.message || String(err);
      else {
        this._bootstrapError = null;
        this._bootstrapBackgroundError = err?.message || String(err);
      }
    } finally {
      if (timer) window.clearTimeout(timer);
      this._bootstrapLoading = false;
      this._scheduleRender?.();
    }
  };
}

function openHomeAssistantMenuV045(target) {
  target.dispatchEvent(
    new CustomEvent("hass-toggle-menu", {
      bubbles: true,
      composed: true,
    }),
  );
}

if (BASE_COMPONENT_V045 && !customElements.get("keenetic-hero-app-panel-v045")) {
  class KeeneticHeroAppPanelV045 extends BASE_COMPONENT_V045 {
    set hass(value) {
      this._hass = value;
      this._ensureChild();
    }

    set panel(value) {
      this._panel = value;
      this._ensureChild();
    }

    set route(value) {
      this._route = value;
      this._ensureChild();
    }

    _ensureChild() {
      if (!this.isConnected) return;
      if (!this._child) {
        this._child = document.createElement("keenetic-hero-panel");
        this.shadowRoot.getElementById("app-content")?.appendChild(this._child);
      }
      // Panel config first: it contains the privacy-safe registration fallback.
      if (this._panel) this._child.panel = this._panel;
      if (this._route) this._child.route = this._route;
      if (this._hass && this._panel) this._child.hass = this._hass;
    }

    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;

      const currentLeft = root.getElementById("nika-back") || root.getElementById("nika-menu");
      if (currentLeft && currentLeft.dataset.nikasMenuV045 !== "true") {
        const menu = currentLeft.cloneNode(false);
        menu.id = "nika-menu";
        menu.className = "menu";
        menu.dataset.nikasMenuV045 = "true";
        menu.setAttribute("type", "button");
        menu.setAttribute("aria-label", "Открыть меню Home Assistant");
        menu.innerHTML = '<ha-icon icon="mdi:menu"></ha-icon>';
        currentLeft.replaceWith(menu);
        menu.addEventListener("click", () => openHomeAssistantMenuV045(menu));
      }

      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.5";

      if (!root.querySelector("style[data-nikas-shell-v045]")) {
        const style = document.createElement("style");
        style.dataset.nikasShellV045 = "true";
        style.textContent = `
          .nika-header {
            grid-template-columns: 64px minmax(0, 1fr) 64px !important;
          }
          .nika-header .menu,
          .nika-header .refresh {
            width: 64px;
            min-width: 44px;
            min-height: 44px;
          }
          .nika-header .menu {
            justify-self: start;
            justify-content: flex-start;
            padding: 0 8px;
          }
          .nika-header .refresh {
            justify-self: end;
            justify-content: flex-end;
            padding: 0 8px;
          }
          .nika-tabbar {
            gap: 0 !important;
            padding-top: 4px !important;
            padding-bottom: calc(4px + env(safe-area-inset-bottom)) !important;
            box-shadow: 0 -2px 10px color-mix(in srgb, #000 7%, transparent) !important;
          }
          .nika-tabbar button {
            position: relative;
            min-width: 0;
            min-height: 54px !important;
            border-radius: 0 !important;
            background: transparent !important;
            overflow: visible;
            isolation: isolate;
          }
          .nika-tabbar button.active {
            background: transparent !important;
          }
          .nika-tabbar button.active::before {
            content: "";
            position: absolute;
            z-index: -1;
            left: 50%;
            top: 2px;
            width: min(112px, calc(100% - 10px));
            height: 50px;
            transform: translateX(-50%);
            border-radius: 16px;
            background: color-mix(in srgb, var(--shell-accent) 11%, transparent);
          }
          .nika-tabbar ha-icon {
            --mdc-icon-size: 21px;
          }
          .nika-tabbar span {
            font-size: 9px;
            font-weight: 700;
          }
          @media (max-width: 390px) {
            .nika-header {
              grid-template-columns: 52px minmax(0, 1fr) 52px !important;
            }
            .nika-header .menu,
            .nika-header .refresh {
              width: 52px;
              justify-content: center;
              padding: 0;
            }
          }
        `;
        root.append(style);
      }
    }
  }

  customElements.define("keenetic-hero-app-panel-v045", KeeneticHeroAppPanelV045);
}
