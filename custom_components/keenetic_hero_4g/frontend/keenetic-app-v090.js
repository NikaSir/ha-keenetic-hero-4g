await import("./keenetic-app-v089.js");

const UI_VERSION_V090 = "0.9.0";
const CORE_COMPONENT_V090 = customElements.get("keenetic-hero-panel");
const CURRENT_SHELL_BASE_V090 = customElements.get("keenetic-hero-app-panel-v089");

function installOverviewReadabilityStylesV090(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v090]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV090 = "true";
  style.textContent = `
    .v083-overview .v050-scene{
      min-height:380px!important;
      background-position:center 54%!important;
    }
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
      top:25%!important;
      left:50%!important;
      width:154px!important;
      min-width:154px!important;
      max-width:154px!important;
    }
    .v083-overview .v060-router{
      top:59%!important;
      width:42%!important;
      max-width:270px!important;
    }
    .v083-overview .v061-cable{left:3.2%!important;top:53%!important}
    .v083-overview .v061-lan{right:3.2%!important;top:53%!important}
    .v083-overview .v083-reserve-channel{display:none!important}
    .v083-overview>.integrity-banner{
      position:fixed!important;
      left:max(12px,env(safe-area-inset-left,0px))!important;
      right:max(12px,env(safe-area-inset-right,0px))!important;
      bottom:calc(78px + env(safe-area-inset-bottom,0px))!important;
      width:auto!important;
      margin:0!important;
      z-index:40!important;
      box-shadow:0 10px 28px rgba(28,35,45,.18)!important;
    }
    @media(max-width:390px){
      .v083-overview .v050-scene{min-height:365px!important}
      .v083-overview .v061-lte{
        top:26%!important;
        left:50%!important;
        width:148px!important;
        min-width:148px!important;
        max-width:148px!important;
      }
      .v083-overview .v060-router{top:59%!important;width:42%!important;max-width:252px!important}
      .v083-overview .v061-cable{left:2.8%!important;top:53%!important}
      .v083-overview .v061-lan{right:2.8%!important;top:53%!important}
      .v083-overview>.integrity-banner{left:8px!important;right:8px!important}
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
    const d = "M500 175 L500 390";
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
