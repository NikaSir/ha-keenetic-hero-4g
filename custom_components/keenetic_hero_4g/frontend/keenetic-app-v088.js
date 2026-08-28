await import("./keenetic-app-v087.js");

const UI_VERSION_V088 = "0.8.8";
const CORE_COMPONENT_V088 = customElements.get("keenetic-hero-panel");
const CURRENT_SHELL_BASE_V088 = customElements.get("keenetic-hero-app-panel-v087");

function installTargetOverviewStylesV088(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v088]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV088 = "true";
  style.textContent = `
    .v083-overview .v060-router{
      top:64.5%!important;
      width:40%!important;
      max-width:252px!important;
      z-index:6!important;
      filter:drop-shadow(0 9px 8px rgba(70,48,30,.16))!important;
    }
    .v083-reserve-state.warn{--v083-tone:#d88b18}
    @media(max-width:390px){
      .v083-overview .v060-router{top:64.5%!important;width:40%!important;max-width:238px!important}
    }
    @media(min-width:760px){
      .v083-overview .v060-router{top:64%!important;width:38%!important;max-width:360px!important}
    }
  `;
  root.append(style);
}

function tuneTargetPathsV088(root) {
  const paths = {
    ".v083-flow-glow.v083-lte-line,.v083-flow-line.v083-lte-line": "M500 210 L500 406",
    ".v083-flow-glow.v083-cable-line,.v083-flow-line.v083-cable-line": "M245 370 L430 370",
    ".v083-flow-glow.v083-lan-line,.v083-flow-line.v083-lan-line": "M570 370 L755 370",
  };
  for (const [selector, d] of Object.entries(paths)) {
    root?.querySelectorAll(selector).forEach((path) => {
      if (path.getAttribute("d") !== d) path.setAttribute("d", d);
    });
  }
}

function reserveOperationBannerV088(panel) {
  const ethernet = panel._connection?.("ethernet_connected") || {};
  const detail = ethernet.state === "down"
    ? "Основной канал Ethernet недоступен."
    : ethernet.state === "up"
      ? "4G LTE фактически используется вместо Ethernet."
      : "Состояние основного канала Ethernet не определено.";
  return `<div class="v083-reserve-state warn">
      <ha-icon icon="mdi:swap-horizontal-bold"></ha-icon>
      <div><strong>Работа через резерв</strong><span>${detail}</span></div>
    </div>`;
}

function alignOverviewMeaningV088(panel, html) {
  const activeRole = panel._activeWan?.();
  if (activeRole !== "lte") return html;
  const reserveBlock = /<div class="v083-reserve-state [^"]+">[\s\S]*?<\/div>\s*<\/div>/;
  return html
    .replace("<p>Основной канал · 4G LTE</p>", "<p>Работа через резерв · 4G LTE</p>")
    .replace(reserveBlock, reserveOperationBannerV088(panel));
}

if (CORE_COMPONENT_V088 && !CORE_COMPONENT_V088.prototype.__nikaTargetOverviewV088) {
  CORE_COMPONENT_V088.prototype.__nikaTargetOverviewV088 = true;

  const renderOverviewBaseV088 = CORE_COMPONENT_V088.prototype._renderOverview;
  CORE_COMPONENT_V088.prototype._renderOverview = function (...args) {
    return alignOverviewMeaningV088(this, renderOverviewBaseV088.apply(this, args));
  };

  const mountStableBaseV088 = CORE_COMPONENT_V088.prototype._mountStableDomV075;
  CORE_COMPONENT_V088.prototype._mountStableDomV075 = function (...args) {
    const mounted = mountStableBaseV088.apply(this, args);
    if (!mounted) return mounted;
    installTargetOverviewStylesV088(this.shadowRoot);
    tuneTargetPathsV088(this.shadowRoot);
    return mounted;
  };
}

if (CURRENT_SHELL_BASE_V088 && !customElements.get("keenetic-hero-app-panel-v088")) {
  class KeeneticHeroAppPanelV088 extends CURRENT_SHELL_BASE_V088 {
    _mountShell() {
      super._mountShell();
      const version = this.shadowRoot?.querySelector("#return-v081 span");
      if (version && version.textContent !== `UI v${UI_VERSION_V088}`) {
        version.textContent = `UI v${UI_VERSION_V088}`;
      }
    }
  }

  customElements.define("keenetic-hero-app-panel-v088", KeeneticHeroAppPanelV088);
}
