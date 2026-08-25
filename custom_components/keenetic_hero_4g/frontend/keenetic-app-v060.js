await import("./keenetic-app-v052.js?v=0.6.0");

const CORE_COMPONENT_V060 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V060 = customElements.get("keenetic-hero-app-panel-v052");
const ROOM_ASSET_V060 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v060.svg?v=0.6.0";
const ROUTER_ASSET_V060 = "/keenetic_hero_4g_static/assets/keenetic-hero-router-v060.svg?v=0.6.0";

function _v060CreateMetricCell(label, value, className = "") {
  const span = document.createElement("span");
  if (className) span.className = className;
  const small = document.createElement("small");
  small.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value || "—";
  span.append(small, strong);
  return span;
}

function _v060ArrangeChannelGrids(root) {
  const channels = [...root.querySelectorAll(".v050-channel")];
  const ethernet = channels[0];
  const lte = channels[1];

  const ethGrid = ethernet?.querySelector(".v050-channel-grid");
  if (ethGrid && ethGrid.dataset.v060Order !== "true") {
    const cells = [...ethGrid.children];
    // RX · TX · WAN IP / Link · Loss · Uptime
    if (cells.length >= 6) {
      [0, 1, 2, 3, 5, 4].forEach((index) => ethGrid.append(cells[index]));
    }
    ethGrid.dataset.v060Order = "true";
  }

  const lteGrid = lte?.querySelector(".v050-lte-grid");
  const signalLine = lte?.querySelector(".v050-signal-line");
  if (lteGrid && signalLine && lteGrid.dataset.v060Order !== "true") {
    const signal = signalLine.querySelector("strong")?.textContent?.trim() || "—";
    const operator = signalLine.querySelector("small")?.textContent?.trim() || "—";
    lteGrid.prepend(
      _v060CreateMetricCell("Signal", signal, "v060-signal-cell"),
      _v060CreateMetricCell("Operator", operator, "v060-operator-cell"),
    );
    signalLine.hidden = true;
    lteGrid.dataset.v060Order = "true";
  }
}

function _v060EnhanceScene(root) {
  const scene = root.querySelector(".v050-scene");
  if (!scene) return;

  scene.classList.add("v060-layered-scene");
  scene.style.backgroundImage = `url("${ROOM_ASSET_V060}")`;

  if (!scene.querySelector(".v060-router")) {
    const router = document.createElement("img");
    router.className = "v060-router";
    router.src = ROUTER_ASSET_V060;
    router.alt = "";
    router.setAttribute("aria-hidden", "true");
    router.draggable = false;
    scene.append(router);
  }

  if (!scene.querySelector(".v060-flow-svg")) {
    const flow = document.createElement("div");
    flow.className = "v060-flow-layer";
    flow.setAttribute("aria-hidden", "true");
    flow.innerHTML = `
      <svg class="v060-flow-svg" viewBox="0 0 1000 520" preserveAspectRatio="none">
        <path class="v060-flow-glow v060-flow-active" d="M188 270 C290 270 350 270 438 270" />
        <path class="v060-flow-line v060-flow-active" d="M188 270 C290 270 350 270 438 270" />
        <path class="v060-flow-glow v060-flow-internet" d="M562 270 C650 270 718 270 820 270" />
        <path class="v060-flow-line v060-flow-internet" d="M562 270 C650 270 718 270 820 270" />
        <path class="v060-flow-glow v060-flow-reserve" d="M558 322 C664 328 725 357 820 392" />
        <path class="v060-flow-line v060-flow-reserve" d="M558 322 C664 328 725 357 820 392" />
      </svg>`;
    scene.append(flow);
  }

  const reserve = scene.querySelector(".v050-reserve-badge");
  scene.classList.toggle("v060-reserve-bad", Boolean(reserve?.classList.contains("bad")));
  scene.classList.toggle("v060-reserve-unknown", Boolean(reserve?.classList.contains("unknown")));

  _v060ArrangeChannelGrids(root);
}

function _v060InstallStyles(root) {
  if (!root || root.querySelector("style[data-keenetic-v060]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticV060 = "true";
  style.textContent = `
    .v050-hero{border-radius:24px!important}
    .v050-scene{
      min-height:440px!important;
      padding:14px!important;
      background-image:url("${ROOM_ASSET_V060}")!important;
      background-size:cover!important;
      background-position:center!important;
      background-repeat:no-repeat!important;
      overflow:hidden!important;
      isolation:isolate!important;
    }
    .v050-scene-shade{
      z-index:1!important;
      background:linear-gradient(180deg,rgba(255,255,255,.86) 0%,rgba(255,255,255,.26) 28%,rgba(255,255,255,.04) 55%,rgba(255,255,255,.12) 72%,rgba(255,255,255,.78) 100%)!important;
      pointer-events:none!important;
    }
    .v060-router{
      position:absolute;
      z-index:3;
      left:50%;
      top:52.5%;
      width:50%;
      max-width:340px;
      height:auto;
      transform:translate(-50%,-50%);
      object-fit:contain;
      pointer-events:none;
      user-select:none;
      filter:drop-shadow(0 13px 12px rgba(70,48,30,.20));
    }
    .v060-flow-layer{position:absolute;inset:0;z-index:2;pointer-events:none}
    .v060-flow-svg{width:100%;height:100%;overflow:visible}
    .v060-flow-line,.v060-flow-glow{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .v060-flow-line{stroke-width:6;stroke-dasharray:2 15;animation:v060-flow 1.35s linear infinite}
    .v060-flow-glow{stroke-width:15;opacity:.16;filter:blur(3px)}
    .v060-flow-active{stroke:#13a9ee}
    .v060-flow-internet{stroke:#31c986}
    .v060-flow-reserve{stroke:#2f9fee}
    .v050-hero.bad .v060-flow-line,.v050-hero.bad .v060-flow-glow{stroke:var(--kp-red)!important;animation:none!important}
    .v060-reserve-bad .v060-flow-reserve{stroke:var(--kp-red)!important;animation:none!important;opacity:.48!important}
    .v060-reserve-unknown .v060-flow-reserve{stroke:var(--kp-muted)!important;animation:none!important;opacity:.32!important}
    @keyframes v060-flow{to{stroke-dashoffset:-34}}

    .v050-status-copy,.v050-online-pill,.v050-fresh-pill,.v050-path,.v050-reserve-badge,.v050-kpi-row,.v050-reserve-strip{z-index:5!important}
    .v050-status-copy{left:16px!important;top:15px!important;max-width:67%!important}
    .v050-status-copy h1{font-size:27px!important;line-height:1.03!important}
    .v050-online-pill{right:13px!important;top:12px!important}
    .v050-fresh-pill{right:13px!important;top:49px!important}
    .v050-path{top:44.5%!important}
    .v050-path-left{left:4.5%!important}
    .v050-path-right{right:3.5%!important}
    .v050-dots{display:none!important}
    .v050-path-node{background:rgba(255,255,255,.88)!important;backdrop-filter:blur(12px)!important}
    .v050-reserve-badge{right:3.5%!important;top:58%!important;background:rgba(255,255,255,.89)!important}
    .v050-kpi-row{left:12px!important;right:12px!important;bottom:72px!important;gap:6px!important}
    .v050-kpi{background:rgba(255,255,255,.91)!important;backdrop-filter:blur(12px)!important}
    .v050-reserve-strip{left:12px!important;right:12px!important;bottom:10px!important;background:rgba(237,248,255,.94)!important}

    .v050-channels{padding:12px!important}
    .v050-channel-list{gap:8px!important;margin-top:8px!important}
    .v050-channel{padding:10px!important;border-radius:18px!important}
    .v050-channel-grid,.v050-lte-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;margin-top:8px!important}
    .v050-channel-grid span,.v050-lte-grid span{padding:7px 8px!important;border-top:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)!important;border-left:0!important}
    .v050-channel-grid span:nth-child(-n+3),.v050-lte-grid span:nth-child(-n+3){border-top:0!important}
    .v050-channel-grid span:not(:nth-child(3n+1)),.v050-lte-grid span:not(:nth-child(3n+1)){border-left:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)!important}
    .v050-channel-grid small,.v050-lte-grid small{font-size:8px!important}
    .v050-channel-grid strong,.v050-lte-grid strong{font-size:11px!important}
    .v050-signal-line[hidden]{display:none!important}
    .v060-signal-cell strong{color:var(--kp-green)}
    .v050-last-switch{display:none!important}

    @media(max-width:430px){
      .v050-scene{min-height:438px!important;background-position:center!important}
      .v060-router{width:53%;max-width:260px;top:52.5%}
      .v050-status-copy{left:13px!important;top:13px!important;max-width:69%!important}
      .v050-status-copy h1{font-size:25px!important}
      .v050-online-pill{right:10px!important;top:10px!important}
      .v050-fresh-pill{right:10px!important;top:47px!important}
      .v050-path{top:45%!important}
      .v050-path-left{left:3%!important}.v050-path-right{right:2.5%!important}
      .v050-path-node{min-width:65px!important;padding:8px 6px!important}
      .v050-reserve-badge{right:2.5%!important;top:58.5%!important;padding:8px!important}
      .v050-kpi-row{left:9px!important;right:9px!important;bottom:70px!important;gap:5px!important}
      .v050-kpi{grid-template-columns:18px 1fr!important;padding:8px 6px!important}
      .v050-kpi ha-icon{--mdc-icon-size:17px!important}.v050-kpi strong{font-size:10px!important}
      .v050-reserve-strip{left:9px!important;right:9px!important;bottom:9px!important;padding:9px 10px!important}
      .v050-channel-grid,.v050-lte-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
    }
    @media(min-width:760px){
      .v050-scene{min-height:500px!important;background-position:center!important}
      .v060-router{width:44%;max-width:400px;top:53%}
      .v050-path{top:47%!important}
      .v050-reserve-badge{top:59%!important}
      .v050-kpi-row{bottom:78px!important}
    }
  `;
  root.append(style);
}

if (CORE_COMPONENT_V060 && !CORE_COMPONENT_V060.prototype.__nikaLayeredHeroV060) {
  CORE_COMPONENT_V060.prototype.__nikaLayeredHeroV060 = true;
  const renderBaseV060 = CORE_COMPONENT_V060.prototype._render;

  CORE_COMPONENT_V060.prototype._render = function (...args) {
    renderBaseV060.apply(this, args);
    const root = this.shadowRoot;
    if (!root) return;
    _v060InstallStyles(root);
    _v060EnhanceScene(root);
  };
}

if (BASE_COMPONENT_V060 && !customElements.get("keenetic-hero-app-panel-v060")) {
  class KeeneticHeroAppPanelV060 extends BASE_COMPONENT_V060 {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.0";
    }
  }

  customElements.define("keenetic-hero-app-panel-v060", KeeneticHeroAppPanelV060);
}
