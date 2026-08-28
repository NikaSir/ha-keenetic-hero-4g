await import("./keenetic-app-v085.js");

const UI_VERSION_V086 = "0.8.6";
const CORE_COMPONENT_V086 = customElements.get("keenetic-hero-panel");
const CURRENT_SHELL_BASE_V086 = customElements.get("keenetic-hero-app-panel-v085");
const ROUTER_ASSET_V086 = "/keenetic_hero_4g_static/assets/keenetic-hero-router-v086.webp?v=0.8.6";

function installApprovedOverviewStylesV086(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v086]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV086 = "true";
  style.textContent = `
    .v083-overview .v060-router{
      top:66.5%!important;
      width:52%!important;
      max-width:330px!important;
      z-index:6!important;
      filter:drop-shadow(0 10px 9px rgba(70,48,30,.18))!important;
    }
    @media(max-width:390px){
      .v083-overview .v060-router{top:66.5%!important;width:52%!important;max-width:292px!important}
    }
    @media(min-width:760px){
      .v083-overview .v060-router{top:65.5%!important;width:44%!important;max-width:420px!important}
    }
  `;
  root.append(style);
}

function tuneApprovedPathsV086(root) {
  const paths = {
    ".v083-flow-glow.v083-lte-line,.v083-flow-line.v083-lte-line": "M500 228 L500 406",
    ".v083-flow-glow.v083-cable-line,.v083-flow-line.v083-cable-line": "M245 352 L430 352",
    ".v083-flow-glow.v083-lan-line,.v083-flow-line.v083-lan-line": "M570 352 L755 352",
  };
  for (const [selector, d] of Object.entries(paths)) {
    root?.querySelectorAll(selector).forEach((path) => {
      if (path.getAttribute("d") !== d) path.setAttribute("d", d);
    });
  }
}

function applyApprovedRouterV086(root) {
  const router = root?.querySelector(".v083-overview .v060-router");
  if (!router) return;
  if (router.getAttribute("src") !== ROUTER_ASSET_V086) {
    router.setAttribute("src", ROUTER_ASSET_V086);
  }
  if (router.dataset.approvedRouterV086 !== "true") {
    router.dataset.approvedRouterV086 = "true";
    router.decode?.().catch?.(() => {});
  }
}

if (CORE_COMPONENT_V086 && !CORE_COMPONENT_V086.prototype.__nikaApprovedRouterV086) {
  CORE_COMPONENT_V086.prototype.__nikaApprovedRouterV086 = true;
  const mountStableBaseV086 = CORE_COMPONENT_V086.prototype._mountStableDomV075;
  CORE_COMPONENT_V086.prototype._mountStableDomV075 = function (...args) {
    const mounted = mountStableBaseV086.apply(this, args);
    if (!mounted) return mounted;
    installApprovedOverviewStylesV086(this.shadowRoot);
    tuneApprovedPathsV086(this.shadowRoot);
    applyApprovedRouterV086(this.shadowRoot);
    return mounted;
  };
}

if (CURRENT_SHELL_BASE_V086 && !customElements.get("keenetic-hero-app-panel-v086")) {
  class KeeneticHeroAppPanelV086 extends CURRENT_SHELL_BASE_V086 {
    _mountShell() {
      super._mountShell();
      const version = this.shadowRoot?.querySelector("#return-v081 span");
      if (version && version.textContent !== `UI v${UI_VERSION_V086}`) {
        version.textContent = `UI v${UI_VERSION_V086}`;
      }
    }
  }

  customElements.define("keenetic-hero-app-panel-v086", KeeneticHeroAppPanelV086);
}
