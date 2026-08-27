await import("./keenetic-app-v080.js");

const UI_VERSION_V081 = "0.8.1";
const DEFAULT_RETURN_ROUTE_V081 = "/dashboard-infrastructure/overview";
const SAFE_RETURN_PREFIXES_V081 = [
  "/dashboard-house",
  "/dashboard-actions",
  "/dashboard-infrastructure",
];
const SOURCE_ROUTES_V081 = {
  house: "/dashboard-house",
  home: "/dashboard-house",
  actions: "/dashboard-actions",
  infrastructure: DEFAULT_RETURN_ROUTE_V081,
};

function normalizeReturnRouteV081(value) {
  if (!value || typeof value !== "string") return null;
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (!SAFE_RETURN_PREFIXES_V081.some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`))) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (_error) {
    return null;
  }
}

function sourceRouteV081(value) {
  const key = String(value || "").trim().toLowerCase();
  return SOURCE_ROUTES_V081[key] || null;
}

function resolveReturnRouteV081(panel) {
  const params = new URLSearchParams(window.location.search);
  for (const key of ["return_to", "from"]) {
    const candidate = normalizeReturnRouteV081(params.get(key));
    if (candidate) return candidate;
  }

  const explicitSource = sourceRouteV081(params.get("source"));
  if (explicitSource) return explicitSource;

  const stateCandidates = [
    window.history.state?.nikasReturnRoute,
    window.history.state?.nikasSourceRoute,
    window.history.state?.returnRoute,
  ];
  for (const value of stateCandidates) {
    const candidate = normalizeReturnRouteV081(value);
    if (candidate) return candidate;
  }

  const referrer = normalizeReturnRouteV081(document.referrer);
  if (referrer) return referrer;

  const configured = normalizeReturnRouteV081(panel?.config?.parent_route);
  return configured || DEFAULT_RETURN_ROUTE_V081;
}

function returnLabelV081(route) {
  if (route.startsWith("/dashboard-house")) return "Дом сейчас";
  if (route.startsWith("/dashboard-actions")) return "Действия";
  return "Инфраструктура";
}

function navigateExplicitV081(route) {
  const target = normalizeReturnRouteV081(route) || DEFAULT_RETURN_ROUTE_V081;
  history.pushState(null, "", target);
  window.dispatchEvent(new Event("location-changed"));
}

const CURRENT_SHELL_BASE_V081 = customElements.get("keenetic-hero-app-panel-v080");
if (CURRENT_SHELL_BASE_V081 && !customElements.get("keenetic-hero-app-panel-v081")) {
  class KeeneticHeroAppPanelV081 extends CURRENT_SHELL_BASE_V081 {
    constructor() {
      super();
      this._returnRouteV081 = null;
    }

    _mountShell() {
      super._mountShell();
      this._installReturnHeaderV081();
    }

    _installReturnHeaderV081() {
      const root = this.shadowRoot;
      if (!root) return;

      if (!this._returnRouteV081) {
        this._returnRouteV081 = resolveReturnRouteV081(this._panel);
      }

      if (!root.querySelector("style[data-nikas-header-return-v081]")) {
        const style = document.createElement("style");
        style.dataset.nikasHeaderReturnV081 = "true";
        style.textContent = `
          .return-v081{
            grid-column:2;grid-row:1;justify-self:center;
            width:min(100%,460px);min-width:0;min-height:44px;
            margin:0;padding:5px 14px;
            display:block;text-align:center;
            border:1px solid var(--divider-color);border-radius:16px;
            background:color-mix(in srgb,var(--card-background-color) 96%,var(--primary-color) 4%);
            color:var(--primary-text-color);
            box-shadow:0 7px 20px rgba(23,45,76,.08);
            appearance:none;-webkit-appearance:none;font:inherit;
            line-height:1;cursor:pointer;
            transition:transform .10s ease,background-color .10s ease;
            -webkit-tap-highlight-color:transparent;
          }
          .return-v081:active{
            transform:scale(.985);
            background:color-mix(in srgb,var(--card-background-color) 90%,var(--primary-color) 10%);
          }
          .return-v081:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
          .return-v081 strong,.return-v081 span{
            display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
          }
          .return-v081 strong{font-size:23px;font-weight:800;line-height:1.08;letter-spacing:-.02em}
          .return-v081 span{margin-top:2px;font-size:14px;font-weight:560;line-height:1.15;color:var(--secondary-text-color)}
          @media(max-width:390px){
            .return-v081{padding-left:9px;padding-right:9px}
            .return-v081 strong{font-size:21px}
            .return-v081 span{font-size:13px}
          }
        `;
        root.append(style);
      }

      if (root.getElementById("return-v081")) return;
      const oldTitle = root.querySelector(".title-v080");
      if (!oldTitle) return;

      const button = document.createElement("button");
      button.id = "return-v081";
      button.className = "return-v081";
      button.type = "button";
      const targetLabel = returnLabelV081(this._returnRouteV081);
      button.setAttribute("aria-label", `Вернуться в ${targetLabel}`);
      button.innerHTML = `<strong>Keenetic Hero 4G+</strong><span>UI v${UI_VERSION_V081}</span>`;
      button.addEventListener("click", () => navigateExplicitV081(this._returnRouteV081));
      oldTitle.replaceWith(button);
    }
  }

  customElements.define("keenetic-hero-app-panel-v081", KeeneticHeroAppPanelV081);
}
