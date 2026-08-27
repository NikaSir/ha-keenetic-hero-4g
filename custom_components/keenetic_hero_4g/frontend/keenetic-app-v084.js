await import("./keenetic-app-v083.js");

const UI_VERSION_V084 = "0.8.4";
const CORE_COMPONENT_V084 = customElements.get("keenetic-hero-panel");
const CURRENT_SHELL_BASE_V084 = customElements.get("keenetic-hero-app-panel-v083");

function installOverviewRefinementV084(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v084]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV084 = "true";
  style.textContent = `
    .v083-overview{gap:6px!important;padding-bottom:8px!important}
    .v083-overview .v050-scene{min-height:320px!important}
    .v083-overview .v060-router{top:65.5%!important}
    .v083-overview .v061-lte{top:36.5%!important;min-height:54px!important}
    .v083-overview .v061-cable,.v083-overview .v061-lan{top:61%!important;min-height:74px!important}

    .v083-reserve-state{min-height:52px;padding:7px 12px}
    .v083-active-card{padding:9px 10px 8px!important}
    .v083-active-head{min-height:38px}
    .v083-metric-grid{grid-template-columns:repeat(6,minmax(0,1fr));margin-top:4px}
    .v083-metric{grid-column:span 2;min-height:56px;padding:6px 7px}
    .v083-metric.wide,.v083-metric:nth-child(8){grid-column:span 3}
    .v083-reserve-channel{min-height:60px;padding:8px 12px!important}

    @media(max-width:390px){
      .v083-overview .v050-scene{min-height:310px!important}
      .v083-overview .v060-router{top:65.5%!important}
      .v083-overview .v061-lte{top:36.5%!important}
      .v083-overview .v061-cable,.v083-overview .v061-lan{top:61%!important}
    }
    @media(min-width:760px){
      .v083-overview .v050-scene{min-height:440px!important}
    }
  `;
  root.append(style);
}

function tuneOverviewPathsV084(root) {
  const paths = {
    ".v083-flow-glow.v083-lte-line,.v083-flow-line.v083-lte-line": "M500 228 L500 295",
    ".v083-flow-glow.v083-cable-line,.v083-flow-line.v083-cable-line": "M245 320 L420 320",
    ".v083-flow-glow.v083-lan-line,.v083-flow-line.v083-lan-line": "M580 320 L755 320",
  };
  for (const [selector, d] of Object.entries(paths)) {
    root?.querySelectorAll(selector).forEach((path) => {
      if (path.getAttribute("d") !== d) path.setAttribute("d", d);
    });
  }
}

if (CORE_COMPONENT_V084 && !CORE_COMPONENT_V084.prototype.__nikaOverviewRefinementV084) {
  CORE_COMPONENT_V084.prototype.__nikaOverviewRefinementV084 = true;
  const mountStableBaseV084 = CORE_COMPONENT_V084.prototype._mountStableDomV075;
  CORE_COMPONENT_V084.prototype._mountStableDomV075 = function (...args) {
    const mounted = mountStableBaseV084.apply(this, args);
    if (!mounted) return mounted;
    installOverviewRefinementV084(this.shadowRoot);
    tuneOverviewPathsV084(this.shadowRoot);
    return mounted;
  };
}

if (CURRENT_SHELL_BASE_V084 && !customElements.get("keenetic-hero-app-panel-v084")) {
  class KeeneticHeroAppPanelV084 extends CURRENT_SHELL_BASE_V084 {
    _mountShell() {
      super._mountShell();
      const version = this.shadowRoot?.querySelector("#return-v081 span");
      if (version && version.textContent !== `UI v${UI_VERSION_V084}`) version.textContent = `UI v${UI_VERSION_V084}`;
    }
  }
  customElements.define("keenetic-hero-app-panel-v084", KeeneticHeroAppPanelV084);
}
