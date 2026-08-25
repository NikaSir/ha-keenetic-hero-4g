await import("./keenetic-app-v061.js?v=0.6.2");

const CORE_COMPONENT_V062 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V062 = customElements.get("keenetic-hero-app-panel-v061");
const ROOM_ASSET_V062 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v062.svg?v=0.6.2";
const ROUTER_ASSET_V062 = "/keenetic_hero_4g_static/assets/keenetic-hero-router-v060.svg?v=0.6.2";

function _v062EnhanceScene(root) {
  const scene = root.querySelector(".v050-scene");
  if (!scene) return;

  scene.classList.add("v062-composition");
  scene.style.backgroundImage = `url("${ROOM_ASSET_V062}")`;

  const router = scene.querySelector(".v060-router");
  if (router) router.src = ROUTER_ASSET_V062;

  scene.querySelectorAll(".v061-topology-layer").forEach((el) => {
    el.hidden = true;
  });

  if (!scene.querySelector(".v062-flow-layer")) {
    const layer = document.createElement("div");
    layer.className = "v062-flow-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <svg class="v062-flow-svg" viewBox="0 0 1000 520" preserveAspectRatio="none">
        <path class="v062-flow-glow v062-lte-line" d="M185 188 C270 196 320 222 392 272" />
        <path class="v062-flow-line v062-lte-line" d="M185 188 C270 196 320 222 392 272" />
        <path class="v062-flow-glow v062-cable-line" d="M185 329 C270 329 326 329 390 329" />
        <path class="v062-flow-line v062-cable-line" d="M185 329 C270 329 326 329 390 329" />
        <path class="v062-flow-glow v062-lan-line" d="M612 329 C690 329 754 329 822 329" />
        <path class="v062-flow-line v062-lan-line" d="M612 329 C690 329 754 329 822 329" />
      </svg>`;
    scene.append(layer);
  }

  const status = root.querySelector(".v050-status-copy p");
  if (status) {
    status.textContent = status.textContent.replace(/Ethernet/gi, "Кабель");
  }

  const lte = scene.querySelector(".v061-lte");
  const cable = scene.querySelector(".v061-cable");
  const lan = scene.querySelector(".v061-lan");
  if (lte) {
    const title = lte.querySelector("strong");
    if (title) title.textContent = "4G LTE";
  }
  if (cable) {
    const title = cable.querySelector("strong");
    if (title) title.textContent = "Кабель";
  }
  if (lan) {
    const title = lan.querySelector("strong");
    const subtitle = lan.querySelector("span");
    if (title) title.textContent = "LAN";
    if (subtitle) subtitle.textContent = "Локальная сеть";
  }
}

function _v062InstallStyles(root) {
  if (!root || root.querySelector("style[data-keenetic-v062]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticV062 = "true";
  style.textContent = `
    .v050-scene{
      min-height:448px!important;
      background-image:url("${ROOM_ASSET_V062}")!important;
      background-size:cover!important;
      background-position:center!important;
    }
    .v050-scene-shade{
      background:linear-gradient(180deg,rgba(255,255,255,.82) 0%,rgba(255,255,255,.16) 25%,rgba(255,255,255,.02) 55%,rgba(255,255,255,.08) 72%,rgba(255,255,255,.70) 100%)!important;
    }
    .v060-router{
      width:60%!important;
      max-width:370px!important;
      top:49%!important;
      filter:drop-shadow(0 15px 13px rgba(66,48,34,.24))!important;
    }

    .v062-flow-layer{position:absolute;inset:0;z-index:4;pointer-events:none}
    .v062-flow-svg{width:100%;height:100%;overflow:visible}
    .v062-flow-line,.v062-flow-glow{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .v062-flow-line{stroke-width:6;stroke-dasharray:2 15;animation:v062-flow 1.35s linear infinite}
    .v062-flow-glow{stroke-width:15;opacity:.16;filter:blur(3px)}
    .v062-lte-line{stroke:#179fe6}
    .v062-cable-line,.v062-lan-line{stroke:#27bf78}
    .v061-lte-active .v062-lte-line{stroke:#27bf78}
    .v061-lte-active .v062-cable-line{stroke:#9aa4ad;opacity:.28;animation:none}
    .v061-no-wan .v062-lte-line,.v061-no-wan .v062-cable-line{stroke:var(--kp-red);opacity:.44;animation:none}
    @keyframes v062-flow{to{stroke-dashoffset:-34}}

    .v061-topology-card{z-index:6!important}
    .v061-lte{left:3.2%!important;top:31.5%!important}
    .v061-cable{left:3.2%!important;top:57.5%!important}
    .v061-lan{right:3.2%!important;top:55.5%!important}
    .v050-kpi-row{bottom:72px!important}
    .v050-reserve-strip{bottom:10px!important}

    @media(max-width:430px){
      .v050-scene{min-height:446px!important}
      .v060-router{width:61%!important;max-width:292px!important;top:49%!important}
      .v061-lte{left:2.6%!important;top:31.5%!important}
      .v061-cable{left:2.6%!important;top:57.5%!important}
      .v061-lan{right:2.6%!important;top:55.5%!important}
    }
    @media(min-width:760px){
      .v050-scene{min-height:510px!important}
      .v060-router{width:50%!important;max-width:430px!important;top:50%!important}
      .v061-lte{left:5%!important;top:32.5%!important}
      .v061-cable{left:5%!important;top:58%!important}
      .v061-lan{right:5%!important;top:56%!important}
    }
  `;
  root.append(style);
}

if (CORE_COMPONENT_V062 && !CORE_COMPONENT_V062.prototype.__nikaHeroCompositionV062) {
  CORE_COMPONENT_V062.prototype.__nikaHeroCompositionV062 = true;
  const renderBaseV062 = CORE_COMPONENT_V062.prototype._render;
  CORE_COMPONENT_V062.prototype._render = function (...args) {
    renderBaseV062.apply(this, args);
    const root = this.shadowRoot;
    if (!root) return;
    _v062InstallStyles(root);
    _v062EnhanceScene(root);
  };
}

if (BASE_COMPONENT_V062 && !customElements.get("keenetic-hero-app-panel-v062")) {
  class KeeneticHeroAppPanelV062 extends BASE_COMPONENT_V062 {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.2";
    }
  }
  customElements.define("keenetic-hero-app-panel-v062", KeeneticHeroAppPanelV062);
}
