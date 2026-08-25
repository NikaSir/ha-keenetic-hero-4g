await import("./keenetic-app-v062.js?v=0.6.3");

const CORE_COMPONENT_V063 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V063 = customElements.get("keenetic-hero-app-panel-v062");
const ROOM_ASSET_V063 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v060.svg?v=0.6.3";
const ROUTER_ASSET_V063 = "/keenetic_hero_4g_static/assets/keenetic-hero-router-v063.webp?v=0.6.3";

function _v063EnhanceScene(root) {
  const scene = root.querySelector(".v050-scene");
  if (!scene) return;

  scene.classList.add("v063-target-composition");
  scene.style.backgroundImage = `url("${ROOM_ASSET_V063}")`;

  const router = scene.querySelector(".v060-router");
  if (router) router.src = ROUTER_ASSET_V063;

  scene.querySelectorAll(".v062-flow-layer").forEach((el) => {
    el.hidden = true;
  });

  if (!scene.querySelector(".v063-flow-layer")) {
    const layer = document.createElement("div");
    layer.className = "v063-flow-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <svg class="v063-flow-svg" viewBox="0 0 1000 520" preserveAspectRatio="none">
        <path class="v063-flow-glow v063-lte-line" d="M190 166 C282 172 350 212 438 270" />
        <path class="v063-flow-line v063-lte-line" d="M190 166 C282 172 350 212 438 270" />
        <path class="v063-flow-glow v063-cable-line" d="M160 270 C270 270 342 270 438 270" />
        <path class="v063-flow-line v063-cable-line" d="M160 270 C270 270 342 270 438 270" />
        <path class="v063-flow-glow v063-lan-line" d="M562 270 C658 270 724 270 800 270" />
        <path class="v063-flow-line v063-lan-line" d="M562 270 C658 270 724 270 800 270" />
      </svg>`;
    scene.append(layer);
  }

  // The topology card uses the operational label "Кабель", while the status
  // sentence keeps the factual transport name used in the accepted target.
  const status = root.querySelector(".v050-status-copy p");
  if (status) status.textContent = status.textContent.replace(/Кабель/gi, "Ethernet");

  const lte = scene.querySelector(".v061-lte");
  const lteIcon = lte?.querySelector("ha-icon");
  if (lteIcon) lteIcon.setAttribute("icon", "mdi:radio-tower");

  const lan = scene.querySelector(".v061-lan");
  const lanSubtitle = lan?.querySelector("span");
  if (lanSubtitle) lanSubtitle.textContent = "Локальная сеть";
}

function _v063InstallSceneStyles(root) {
  if (!root || root.querySelector("style[data-keenetic-v063]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticV063 = "true";
  style.textContent = `
    .shell{
      padding:6px 10px 12px!important;
    }
    .v050-overview{gap:9px!important}
    .v050-hero{border-radius:24px!important}
    .v050-scene{
      min-height:438px!important;
      padding:14px!important;
      background-image:url("${ROOM_ASSET_V063}")!important;
      background-size:cover!important;
      background-position:center!important;
      background-repeat:no-repeat!important;
    }
    .v050-scene-shade{
      background:linear-gradient(180deg,rgba(255,255,255,.86) 0%,rgba(255,255,255,.26) 28%,rgba(255,255,255,.04) 55%,rgba(255,255,255,.12) 72%,rgba(255,255,255,.78) 100%)!important;
    }
    .v060-router{
      width:53%!important;
      max-width:290px!important;
      top:52.5%!important;
      filter:drop-shadow(0 13px 12px rgba(70,48,30,.20))!important;
    }

    .v062-flow-layer[hidden]{display:none!important}
    .v063-flow-layer{position:absolute;inset:0;z-index:4;pointer-events:none}
    .v063-flow-svg{width:100%;height:100%;overflow:visible}
    .v063-flow-line,.v063-flow-glow{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .v063-flow-line{stroke-width:6}
    .v063-flow-glow{stroke-width:15;opacity:.16;filter:blur(3px)}
    .v063-lte-line{stroke:#179fe6}
    .v063-flow-line.v063-lte-line{stroke-dasharray:2 15;animation:v063-flow 1.35s linear infinite}
    .v063-cable-line,.v063-lan-line{stroke:#27bf78}
    .v063-flow-line.v063-cable-line,.v063-flow-line.v063-lan-line{stroke-dasharray:none;animation:none}
    .v061-lte-active .v063-lte-line{stroke:#27bf78}
    .v061-lte-active .v063-cable-line{opacity:0}
    .v061-no-wan .v063-lte-line,.v061-no-wan .v063-cable-line{stroke:var(--kp-red);opacity:.44;animation:none}
    @keyframes v063-flow{to{stroke-dashoffset:-34}}

    .v061-topology-card{z-index:6!important}
    .v061-lte{
      left:3%!important;top:25.5%!important;
      min-width:96px!important;min-height:52px!important;
      padding:10px 11px!important;border-radius:18px!important;
    }
    .v061-lte ha-icon{--mdc-icon-size:26px!important}
    .v061-lte strong{font-size:11px!important}
    .v061-lte span{font-size:8px!important}
    .v061-cable,.v061-lan{
      top:44%!important;min-width:0!important;min-height:72px!important;
      flex-direction:column!important;justify-content:center!important;
      gap:4px!important;padding:8px 6px!important;text-align:center!important;
      border-radius:18px!important;
    }
    .v061-cable{left:3%!important;width:68px!important}
    .v061-lan{right:3%!important;width:78px!important}
    .v061-cable ha-icon,.v061-lan ha-icon{--mdc-icon-size:27px!important}
    .v061-cable strong,.v061-lan strong{font-size:12px!important;color:var(--kp-green)!important}
    .v061-cable span,.v061-lan span{font-size:7.5px!important}
    .v061-cable div,.v061-lan div{text-align:center!important}

    .v050-kpi-row{left:10px!important;right:10px!important;bottom:82px!important;gap:7px!important}
    .v050-kpi{min-height:48px!important;padding:10px 7px!important;border-radius:16px!important}
    .v050-kpi ha-icon{--mdc-icon-size:19px!important}
    .v050-kpi strong{font-size:11px!important}
    .v050-reserve-strip{
      left:10px!important;right:10px!important;bottom:10px!important;
      min-height:54px!important;padding:10px 12px!important;border-radius:18px!important;
    }

    @media(max-width:430px){
      .shell{padding:6px 10px 12px!important}
      .v050-scene{min-height:438px!important;background-position:center!important}
      .v060-router{width:53%!important;max-width:260px!important;top:52.5%!important}
      .v061-lte{left:2.7%!important;top:25.5%!important}
      .v061-cable{left:2.7%!important;top:44%!important}
      .v061-lan{right:2.7%!important;top:44%!important}
      .v050-kpi-row{bottom:82px!important}
    }
    @media(max-width:390px){
      .shell{padding-left:8px!important;padding-right:8px!important}
      .v061-lte{min-width:92px!important;padding:9px 8px!important}
      .v061-cable{width:64px!important}.v061-lan{width:74px!important}
    }
    @media(min-width:760px){
      .shell{padding:10px 12px 16px!important}
      .v050-scene{min-height:500px!important}
      .v060-router{width:44%!important;max-width:400px!important;top:53%!important}
      .v061-lte{left:5%!important;top:27%!important}
      .v061-cable{left:5%!important;top:46%!important}
      .v061-lan{right:5%!important;top:46%!important}
    }
  `;
  root.append(style);
}

function _v063InstallShellStyles(root) {
  if (!root || root.querySelector("style[data-nikas-shell-v063]")) return;
  const style = document.createElement("style");
  style.dataset.nikasShellV063 = "true";
  style.textContent = `
    .nika-header{
      min-height:63px!important;
      padding:4px max(8px,env(safe-area-inset-right)) 4px max(8px,env(safe-area-inset-left))!important;
    }
    .nika-tabbar{
      padding-top:4px!important;
      padding-bottom:4px!important;
    }
    .nika-tabbar button{min-height:54px!important}
    @media(max-width:390px){
      .nika-header{min-height:60px!important}
    }
  `;
  root.append(style);
}

if (CORE_COMPONENT_V063 && !CORE_COMPONENT_V063.prototype.__nikaTargetGeometryV063) {
  CORE_COMPONENT_V063.prototype.__nikaTargetGeometryV063 = true;
  const renderBaseV063 = CORE_COMPONENT_V063.prototype._render;
  CORE_COMPONENT_V063.prototype._render = function (...args) {
    renderBaseV063.apply(this, args);
    const root = this.shadowRoot;
    if (!root) return;
    _v063InstallSceneStyles(root);
    _v063EnhanceScene(root);
  };
}

if (BASE_COMPONENT_V063 && !customElements.get("keenetic-hero-app-panel-v063")) {
  class KeeneticHeroAppPanelV063 extends BASE_COMPONENT_V063 {
    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;
      _v063InstallShellStyles(root);
      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.3";
    }
  }
  customElements.define("keenetic-hero-app-panel-v063", KeeneticHeroAppPanelV063);
}
