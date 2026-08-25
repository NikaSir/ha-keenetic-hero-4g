await import("./keenetic-app-v060.js?v=0.6.1");

const CORE_COMPONENT_V061 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V061 = customElements.get("keenetic-hero-app-panel-v060");

function _v061LabelCard(kind, title, subtitle, icon) {
  const card = document.createElement("div");
  card.className = `v061-topology-card v061-${kind}`;
  card.innerHTML = `
    <ha-icon icon="${icon}"></ha-icon>
    <div><strong>${title}</strong><span>${subtitle}</span></div>
  `;
  return card;
}

function _v061EnhanceScene(root) {
  const scene = root.querySelector(".v050-scene");
  if (!scene) return;

  scene.classList.add("v061-topology-scene");
  scene.querySelectorAll(".v050-path,.v050-reserve-badge,.v060-flow-layer").forEach((el) => {
    el.hidden = true;
  });

  if (!scene.querySelector(".v061-topology-layer")) {
    const layer = document.createElement("div");
    layer.className = "v061-topology-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <svg class="v061-flow-svg" viewBox="0 0 1000 520" preserveAspectRatio="none">
        <path class="v061-flow-glow v061-cable-line" d="M190 322 C285 322 350 322 438 322" />
        <path class="v061-flow-line v061-cable-line" d="M190 322 C285 322 350 322 438 322" />
        <path class="v061-flow-glow v061-lte-line" d="M190 196 C290 205 355 236 438 276" />
        <path class="v061-flow-line v061-lte-line" d="M190 196 C290 205 355 236 438 276" />
        <path class="v061-flow-glow v061-lan-line" d="M562 322 C660 322 725 322 820 322" />
        <path class="v061-flow-line v061-lan-line" d="M562 322 C660 322 725 322 820 322" />
      </svg>`;
    scene.append(layer);

    scene.append(
      _v061LabelCard("lte", "4G LTE", "Резерв готов", "mdi:signal-4g"),
      _v061LabelCard("cable", "Кабель", "100.0 Mbit/s", "mdi:ethernet"),
      _v061LabelCard("lan", "LAN", "Локальная сеть", "mdi:lan"),
    );
  }

  const activeWan = root.querySelector(".v050-status-copy p")?.textContent?.toLowerCase() || "";
  const cableActive = activeWan.includes("ethernet");
  const lteActive = activeWan.includes("lte");

  scene.classList.toggle("v061-cable-active", cableActive);
  scene.classList.toggle("v061-lte-active", lteActive);
  scene.classList.toggle("v061-no-wan", !cableActive && !lteActive);

  const reserveText = root.querySelector(".v050-reserve-strip strong")?.textContent || "";
  const lteCard = scene.querySelector(".v061-lte");
  if (lteCard && cableActive) {
    const subtitle = lteCard.querySelector("span");
    if (subtitle) subtitle.textContent = /недоступ/i.test(reserveText) ? "Недоступен" : "Резерв готов";
  }

  const ethernetHead = root.querySelector(".v050-channel:first-of-type .v050-channel-head strong");
  if (ethernetHead) ethernetHead.textContent = "Кабель (Ethernet)";
}

function _v061InstallStyles(root) {
  if (!root || root.querySelector("style[data-keenetic-v061]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticV061 = "true";
  style.textContent = `
    .v061-topology-layer{position:absolute;inset:0;z-index:4;pointer-events:none}
    .v061-flow-svg{width:100%;height:100%;overflow:visible}
    .v061-flow-line,.v061-flow-glow{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .v061-flow-line{stroke-width:6;stroke-dasharray:2 15;animation:v061-flow 1.35s linear infinite}
    .v061-flow-glow{stroke-width:15;opacity:.16;filter:blur(3px)}
    .v061-cable-line{stroke:#27bf78}
    .v061-lte-line{stroke:#179fe6}
    .v061-lan-line{stroke:#27bf78}
    .v061-lte-active .v061-lte-line{stroke:#27bf78}
    .v061-lte-active .v061-cable-line{stroke:#9aa4ad;opacity:.28;animation:none}
    .v061-cable-active .v061-lte-line{stroke:#179fe6}
    .v061-no-wan .v061-cable-line,.v061-no-wan .v061-lte-line{stroke:var(--kp-red);opacity:.44;animation:none}
    @keyframes v061-flow{to{stroke-dashoffset:-34}}

    .v061-topology-card{
      position:absolute;z-index:6;display:flex;align-items:center;gap:8px;
      min-width:105px;padding:10px 11px;border:1px solid rgba(255,255,255,.88);
      border-radius:18px;background:rgba(255,255,255,.90);backdrop-filter:blur(12px);
      box-shadow:0 5px 16px rgba(0,0,0,.07);pointer-events:none
    }
    .v061-topology-card ha-icon{--mdc-icon-size:25px;color:var(--kp-blue)}
    .v061-topology-card strong,.v061-topology-card span{display:block;white-space:nowrap}
    .v061-topology-card strong{font-size:11px;line-height:1.15}
    .v061-topology-card span{margin-top:2px;font-size:8px;color:var(--kp-muted)}
    .v061-lte{left:3.5%;top:34%}.v061-lte ha-icon{color:var(--kp-blue)}
    .v061-cable{left:3.5%;top:61%}.v061-cable ha-icon{color:var(--kp-green)}
    .v061-lan{right:3.5%;top:58%}.v061-lan ha-icon{color:var(--kp-green)}
    .v061-lte-active .v061-lte ha-icon,.v061-lte-active .v061-lte strong{color:var(--kp-green)}
    .v061-lte-active .v061-cable{opacity:.72}

    .v050-kpi-row{bottom:72px!important}
    .v050-reserve-strip{bottom:10px!important}
    .v060-router{top:52.5%!important;width:50%!important}

    @media(max-width:430px){
      .v061-topology-card{min-width:92px;padding:9px 8px;border-radius:16px;gap:6px}
      .v061-topology-card ha-icon{--mdc-icon-size:22px}
      .v061-topology-card strong{font-size:10px}.v061-topology-card span{font-size:7.5px}
      .v061-lte{left:2.7%;top:34%}.v061-cable{left:2.7%;top:61%}.v061-lan{right:2.7%;top:58%}
      .v060-router{width:52%!important;top:52.5%!important}
    }
    @media(min-width:760px){
      .v061-lte{left:5%;top:35%}.v061-cable{left:5%;top:61%}.v061-lan{right:5%;top:59%}
      .v060-router{width:44%!important;max-width:400px!important}
    }
  `;
  root.append(style);
}

if (CORE_COMPONENT_V061 && !CORE_COMPONENT_V061.prototype.__nikaAcceptedTopologyV061) {
  CORE_COMPONENT_V061.prototype.__nikaAcceptedTopologyV061 = true;
  const renderBaseV061 = CORE_COMPONENT_V061.prototype._render;
  CORE_COMPONENT_V061.prototype._render = function (...args) {
    renderBaseV061.apply(this, args);
    const root = this.shadowRoot;
    if (!root) return;
    _v061InstallStyles(root);
    _v061EnhanceScene(root);
  };
}

if (BASE_COMPONENT_V061 && !customElements.get("keenetic-hero-app-panel-v061")) {
  class KeeneticHeroAppPanelV061 extends BASE_COMPONENT_V061 {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.1";
    }
  }
  customElements.define("keenetic-hero-app-panel-v061", KeeneticHeroAppPanelV061);
}
