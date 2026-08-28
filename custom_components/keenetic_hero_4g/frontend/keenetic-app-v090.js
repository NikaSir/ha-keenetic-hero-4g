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
  `;
  root.append(style);
}

function patchOverviewReadabilityV090(panel) {
  const root = panel.shadowRoot;
  const scope = panel._stableSlotsV075?.get("overview") || root;
  const signalValue = scope?.querySelector(".v083-active-card .v083-metric:nth-child(4) strong");
  if (!signalValue || panel._activeWan?.() !== "lte") return;
  const value = panel._display("lte_rsrp", "—");
  if (signalValue.textContent !== value) signalValue.textContent = value;
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
