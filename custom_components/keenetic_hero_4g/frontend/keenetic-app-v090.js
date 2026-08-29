await import("./keenetic-app-v089.js");

const UI_VERSION_V090 = "0.9.0";
const CORE_COMPONENT_V090 = customElements.get("keenetic-hero-panel");
const CURRENT_SHELL_BASE_V090 = customElements.get("keenetic-hero-app-panel-v089");

function installOverviewReadabilityStylesV090(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v090]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV090 = "true";
  style.textContent = `
    .v083-overview .v050-status-copy{
      top:8px!important;
      max-width:calc(100% - 170px)!important;
    }
    .v083-overview .v050-status-copy h1{
      margin:0 0 2px!important;
      font-size:20px!important;
      line-height:1!important;
    }
    .v083-overview .v050-status-copy p{
      max-width:100%!important;
      overflow:visible!important;
      text-overflow:clip!important;
      white-space:nowrap!important;
      font-size:12px!important;
      line-height:1.1!important;
      letter-spacing:-.02em!important;
    }
    .v083-overview .v061-lte{
      top:27.5%!important;
      left:50%!important;
      width:158px!important;
      min-width:158px!important;
      max-width:158px!important;
    }
    @media(max-width:390px){
      .v083-overview .v061-lte{
        top:28.5%!important;
        left:50%!important;
        width:150px!important;
        min-width:150px!important;
        max-width:150px!important;
      }
    }

    .v083-overview .v060-router{
      top:61%!important;
      width:38%!important;
      max-width:240px!important;
    }
    .v083-overview .v061-cable{left:3.2%!important;top:55%!important}
    .v083-overview .v061-lan{right:3.2%!important;top:55%!important}
    .v083-overview .v083-reserve-channel{display:none!important}
    @media(max-width:390px){
      .v083-overview .v060-router{top:61%!important;width:38%!important;max-width:226px!important}
      .v083-overview .v061-cable{left:2.8%!important;top:55%!important}
      .v083-overview .v061-lan{right:2.8%!important;top:55%!important}
    }
  `;
  root.append(style);
}

function patchOverviewReadabilityV090(panel) {
  const root = panel.shadowRoot;
  const scope = panel._stableSlotsV075?.get("overview") || root;
  const signalValue = scope?.querySelector(".v083-active-card .v083-metric:nth-child(4) strong");
  if (signalValue && panel._activeWan?.() === "lte") {
    const value = panel._display("lte_rsrp", "—");
    if (signalValue.textContent !== value) signalValue.textContent = value;
  }
  root?.querySelectorAll(".v083-flow-glow.v083-lte-line,.v083-flow-line.v083-lte-line").forEach((path) => {
    const d = "M500 190 L500 390";
    if (path.getAttribute("d") !== d) path.setAttribute("d", d);
  });
}

if (CORE_COMPONENT_V090 && !CORE_COMPONENT_V090.prototype.__nikaOverviewReadabilityV090) {
  CORE_COMPONENT_V090.prototype.__nikaOverviewReadabilityV090 = true;

  const mountStableBaseV090 = CORE_COMPONENT_V090.prototype._mountStableDomV075;
  CORE_COMPONENT_V090.prototype._mountStableDomV075 = function (...args) {
    const mounted = mountStableBaseV090.apply(this, args);
    if (!mounted) return mounted;
    installOverviewReadabilityStylesV090(this.shadowRoot);
    patchOverviewReadabilityV090(this);
    return mounted;
  };

  const patchStableBaseV090 = CORE_COMPONENT_V090.prototype._patchStableDomV075;
  CORE_COMPONENT_V090.prototype._patchStableDomV075 = function (...args) {
    patchStableBaseV090.apply(this, args);
    patchOverviewReadabilityV090(this);
  };
}

if (CURRENT_SHELL_BASE_V090 && !customElements.get("keenetic-hero-app-panel-v090")) {
  class KeeneticHeroAppPanelV090 extends CURRENT_SHELL_BASE_V090 {
    _mountShell() {
      super._mountShell();
      const version = this.shadowRoot?.querySelector("#return-v081 span");
      if (version && version.textContent !== `UI v${UI_VERSION_V090}`) {
        version.textContent = `UI v${UI_VERSION_V090}`;
      }
    }
  }

  customElements.define("keenetic-hero-app-panel-v090", KeeneticHeroAppPanelV090);
}
