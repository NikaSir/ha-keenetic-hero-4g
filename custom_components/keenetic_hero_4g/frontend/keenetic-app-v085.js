await import("./keenetic-app-v084.js");

const UI_VERSION_V085 = "0.8.5";
const SOURCE_ROUTE_KEY_V085 = "nikas.specialized.source_route.v1";
const SOURCE_ROUTE_AT_KEY_V085 = "nikas.specialized.source_route_at.v1";
const RETURN_ROUTE_KEY_V085 = "nikas.keenetic.return_route.v1";
const DEFAULT_RETURN_ROUTE_V085 = "/dashboard-infrastructure/overview";
const SOURCE_ROUTE_MAX_AGE_MS_V085 = 30_000;
const CURRENT_SHELL_BASE_V085 = customElements.get("keenetic-hero-app-panel-v084");

function normalizeReturnRouteV085(value) {
  if (!value || typeof value !== "string") return null;
  const candidate = value.trim();
  if (!candidate || candidate.startsWith("//")) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(candidate);
  if (!candidate.startsWith("/") && !hasScheme) return null;
  try {
    const url = new URL(candidate, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === "/dashboard-house-v11" || url.pathname.startsWith("/dashboard-house-v11/")) {
      return "/dashboard-house-v11/home";
    }
    if (url.pathname === "/dashboard-actions" || url.pathname.startsWith("/dashboard-actions/")) {
      return "/dashboard-actions/home";
    }
    if (url.pathname === "/dashboard-infrastructure" || url.pathname.startsWith("/dashboard-infrastructure/")) {
      return DEFAULT_RETURN_ROUTE_V085;
    }
  } catch (_error) {
    // Invalid, cross-origin and non-URL values are rejected below.
  }
  return null;
}

function persistReturnRouteV085(route) {
  try {
    localStorage.setItem(RETURN_ROUTE_KEY_V085, route);
  } catch (_error) {
    // Private iOS WebViews may deny persistent storage; the captured route
    // remains stable in this panel instance.
  }
  return route;
}

function consumeSourceRouteV085() {
  try {
    const value = sessionStorage.getItem(SOURCE_ROUTE_KEY_V085);
    const timestampValue = sessionStorage.getItem(SOURCE_ROUTE_AT_KEY_V085);
    sessionStorage.removeItem(SOURCE_ROUTE_KEY_V085);
    sessionStorage.removeItem(SOURCE_ROUTE_AT_KEY_V085);

    if (timestampValue !== null) {
      const timestamp = Number(timestampValue);
      const age = Date.now() - timestamp;
      if (!Number.isFinite(timestamp) || age < 0 || age > SOURCE_ROUTE_MAX_AGE_MS_V085) return null;
    }
    return normalizeReturnRouteV085(value);
  } catch (_error) {
    return null;
  }
}

function savedReturnRouteV085() {
  try {
    return normalizeReturnRouteV085(localStorage.getItem(RETURN_ROUTE_KEY_V085));
  } catch (_error) {
    return null;
  }
}

function resolveReturnRouteV085(panel) {
  const params = new URLSearchParams(window.location.search);
  // Read and remove the one-shot hand-off on every mount. Explicit query
  // parameters still win, but cannot leave a stale source for the next open.
  const handedOff = consumeSourceRouteV085();
  for (const key of ["return_to", "from"]) {
    const explicit = normalizeReturnRouteV085(params.get(key));
    if (explicit) return persistReturnRouteV085(explicit);
  }

  if (handedOff) return persistReturnRouteV085(handedOff);

  const saved = savedReturnRouteV085();
  if (saved) return saved;

  const referrer = normalizeReturnRouteV085(document.referrer);
  if (referrer) return persistReturnRouteV085(referrer);

  const configured = normalizeReturnRouteV085(panel?.config?.parent_route);
  if (configured) return persistReturnRouteV085(configured);

  return persistReturnRouteV085(DEFAULT_RETURN_ROUTE_V085);
}

if (CURRENT_SHELL_BASE_V085 && !customElements.get("keenetic-hero-app-panel-v085")) {
  class KeeneticHeroAppPanelV085 extends CURRENT_SHELL_BASE_V085 {
    constructor() {
      super();
      this._returnRouteV085 = null;
    }

    _mountShell() {
      if (!this._returnRouteV085) {
        this._returnRouteV085 = resolveReturnRouteV085(this._panel);
      }

      // v081 owns the persistent semantic button and its single click handler.
      // Supplying the final route before that one-time mount prevents the older
      // compatibility resolver from participating in the production behavior.
      this._returnRouteV081 = this._returnRouteV085;
      super._mountShell();

      const titleButton = this.shadowRoot?.getElementById("return-v081");
      const version = titleButton?.querySelector("span");
      if (version && version.textContent !== `UI v${UI_VERSION_V085}`) {
        version.textContent = `UI v${UI_VERSION_V085}`;
      }
    }
  }

  customElements.define("keenetic-hero-app-panel-v085", KeeneticHeroAppPanelV085);
}
