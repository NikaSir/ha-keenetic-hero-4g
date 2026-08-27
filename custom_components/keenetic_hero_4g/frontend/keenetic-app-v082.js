await import("./keenetic-app-v081.js");

const UI_VERSION_V082 = "0.8.2";
const CORE_COMPONENT_V082 = customElements.get("keenetic-hero-panel");
const CURRENT_SHELL_BASE_V082 = customElements.get("keenetic-hero-app-panel-v081");

function escV082(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function reserveStateV082(panel, reserveRole, reserveConnection) {
  const label = reserveRole === "lte" ? "4G LTE" : reserveRole === "ethernet" ? "Ethernet" : "Резерв";
  if (reserveConnection?.state === "up") {
    return {
      tone: "ok",
      icon: "mdi:check-circle",
      title: "Резерв готов",
      detail: `Резервный канал ${label} подключён и готов к работе.`,
    };
  }
  if (reserveConnection?.state === "down") {
    return {
      tone: "bad",
      icon: "mdi:alert-circle-outline",
      title: "Резерв недоступен",
      detail: `Резервный канал ${label} сейчас недоступен.`,
    };
  }
  return {
    tone: "unknown",
    icon: "mdi:help-circle-outline",
    title: "Состояние резерва неизвестно",
    detail: `Нет подтверждённых данных о готовности канала ${label}.`,
  };
}

function metricV082(icon, label, value, className = "") {
  return `<div class="v082-metric ${className}"><ha-icon icon="${icon}"></ha-icon><div><span>${escV082(label)}</span><strong>${escV082(value)}</strong></div></div>`;
}

function reserveMetaV082(panel, reserveRole) {
  if (reserveRole === "lte") {
    return `${panel._display("lte_operator", "—")} · ${panel._display("lte_network_type", "—")} · ${panel._display("lte_primary_band", "—")} · RSRP ${panel._display("lte_rsrp", "—")}`;
  }
  if (reserveRole === "ethernet") {
    return `Link ${panel._display("ethernet_link_speed", "—")} · WAN IP ${panel._display("ethernet_wan_ipv4", "—")}`;
  }
  return "Нет подтверждённого резервного канала";
}

function renderOverviewV082(panel) {
  const internet = panel._internet();
  const active = panel._activeWan();
  const eth = panel._connection("ethernet_connected");
  const lte = panel._connection("lte_connected");
  const telemetry = panel._telemetry();

  const activeRole = active === "ethernet" ? "ethernet" : active === "lte" ? "lte" : null;
  const reserveRole = activeRole === "ethernet" ? "lte" : activeRole === "lte" ? "ethernet" : null;
  const reserveConnection = reserveRole === "lte" ? lte : reserveRole === "ethernet" ? eth : null;
  const reserveState = reserveStateV082(panel, reserveRole, reserveConnection);

  const heroTitle = internet.online === true ? "Интернет работает" : internet.online === false ? "Нет подключения" : "Состояние неизвестно";
  const heroTone = internet.online === true ? "ok" : internet.online === false ? "bad" : "unknown";
  const activeClass = activeRole ? `active-${activeRole}` : "active-none";
  const activeName = activeRole === "ethernet" ? "Ethernet" : activeRole === "lte" ? "4G LTE" : "Нет активного канала";
  const activeIcon = activeRole === "ethernet" ? "mdi:ethernet" : activeRole === "lte" ? "mdi:radio-tower" : "mdi:lan-disconnect";

  const pingRole = activeRole === "lte" ? "lte_ping" : "ethernet_ping";
  const lossRole = activeRole === "lte" ? "lte_packet_loss" : "ethernet_packet_loss";
  const rxRole = activeRole === "lte" ? "lte_rx_mbps" : "ethernet_rx_mbps";
  const txRole = activeRole === "lte" ? "lte_tx_mbps" : "ethernet_tx_mbps";
  const wanRole = activeRole === "lte" ? "lte_wan_ipv4" : "ethernet_wan_ipv4";
  const uptimeRole = activeRole === "lte" ? "lte_interface_uptime" : "ethernet_interface_uptime";
  const linkLabel = activeRole === "lte" ? "Сигнал" : "Link";
  const linkValue = activeRole === "lte"
    ? `RSRP ${panel._display("lte_rsrp", "—")}`
    : panel._display("ethernet_link_speed", "—");

  const reserveName = reserveRole === "lte" ? "4G LTE" : reserveRole === "ethernet" ? "Ethernet" : "Резервный канал";
  const reserveIcon = reserveRole === "lte" ? "mdi:radio-tower" : reserveRole === "ethernet" ? "mdi:ethernet" : "mdi:lan-disconnect";

  return `<section class="view v050-overview v082-overview">
    ${!telemetry.trusted ? `<div class="integrity-banner ${escV082(telemetry.tone)}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><strong>${escV082(telemetry.label)}</strong><span>${escV082(telemetry.detail)}. WAN не трактуется как нормальный до восстановления телеметрии.</span></div></div>` : ""}

    <article class="v050-hero ${escV082(heroTone)} ${activeClass}">
      <div class="v050-scene">
        <div class="v050-scene-shade"></div>
        <div class="v050-status-copy">
          <h1>${escV082(heroTitle)}</h1>
          <p>Основной канал · ${escV082(activeName)}</p>
        </div>
        <div class="v050-online-pill ${escV082(heroTone)}"><span class="status-dot"></span>${escV082(internet.label)}</div>
        <div class="v050-fresh-pill ${escV082(telemetry.tone)}"><ha-icon icon="mdi:clock-outline"></ha-icon>${escV082(telemetry.age === null ? "Свежесть неизвестна" : `Обновлено ${Math.round(telemetry.age)} с назад`)}</div>
      </div>
    </article>

    <div class="v082-reserve-state ${reserveState.tone}">
      <ha-icon icon="${reserveState.icon}"></ha-icon>
      <div><strong>${escV082(reserveState.title)}</strong><span>${escV082(reserveState.detail)}</span></div>
    </div>

    <article class="card v082-active-card">
      <div class="v082-active-head">
        <ha-icon icon="${activeIcon}"></ha-icon>
        <strong>${escV082(activeName)}</strong>
        <span class="v082-active-state ${activeRole ? "ok" : "bad"}"><i></i>${activeRole ? "Активен" : "Нет канала"}</span>
        <button type="button" class="v082-open" data-view="wan" aria-label="Открыть каналы"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
      <div class="v082-metric-grid">
        ${metricV082("mdi:earth", "Ping", activeRole ? panel._display(pingRole, "—") : "—")}
        ${metricV082("mdi:shield-check-outline", "Потеря пакетов", activeRole ? panel._display(lossRole, "—") : "—")}
        ${metricV082("mdi:timer-outline", "Телеметрия", telemetry.age === null ? "—" : `${Math.round(telemetry.age)} с`)}
        ${metricV082("mdi:link-variant", linkLabel, activeRole ? linkValue : "—")}
        ${metricV082("mdi:download-network-outline", "RX", activeRole ? panel._display(rxRole, "—") : "—")}
        ${metricV082("mdi:upload-network-outline", "TX", activeRole ? panel._display(txRole, "—") : "—")}
        ${metricV082("mdi:ip-network-outline", "WAN IP", activeRole ? panel._display(wanRole, "—") : "—", "wide")}
        ${metricV082("mdi:clock-outline", "Uptime", activeRole ? panel._display(uptimeRole, "—") : "—")}
      </div>
    </article>

    <button type="button" class="card v082-reserve-channel" data-view="wan" aria-label="Открыть резервный канал">
      <ha-icon class="v082-reserve-icon" icon="${reserveIcon}"></ha-icon>
      <div><strong>${escV082(reserveName)}</strong><span>${escV082(reserveMetaV082(panel, reserveRole))}</span></div>
      <ha-icon class="v082-chevron" icon="mdi:chevron-right"></ha-icon>
    </button>
  </section>`;
}

function installOverviewStylesV082(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v082]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV082 = "true";
  style.textContent = `
    .v082-overview{gap:10px!important;padding-bottom:12px!important}
    .v082-overview .v050-channels,.v082-overview .v050-kpi-row,.v082-overview .v050-reserve-strip,.v082-overview .v050-reserve-badge,.v082-overview .v050-path{display:none!important}
    .v082-overview .v061-topology-layer,.v082-overview .v060-flow-layer,.v082-overview .v062-flow-layer,.v082-overview .v063-flow-layer{display:none!important}
    .v082-overview .v050-scene{
      min-height:410px!important;
      padding:14px!important;
      overflow:hidden!important;
      background-position:center!important;
    }
    .v082-overview .v050-status-copy{left:14px!important;top:14px!important;max-width:calc(100% - 184px)!important}
    .v082-overview .v050-status-copy h1{margin:0 0 6px!important;font-size:25px!important;line-height:1.04!important}
    .v082-overview .v050-status-copy p{font-size:14px!important;line-height:1.2!important;font-weight:650!important}
    .v082-overview .v060-router{top:60%!important;width:46%!important;max-width:300px!important;z-index:6!important}

    .v082-flow-layer{position:absolute;inset:0;z-index:4;pointer-events:none}
    .v082-flow-layer svg{width:100%;height:100%;overflow:visible}
    .v082-flow-line,.v082-flow-glow{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .v082-flow-line{stroke-width:6}
    .v082-flow-glow{stroke-width:14;opacity:.13;filter:blur(2px)}
    .v082-cable-line,.v082-lan-line{stroke:#27bf78}
    .v082-lte-line{stroke:#179fe6;stroke-dasharray:5 11}
    .v050-hero.active-lte .v082-lte-line{stroke:#27bf78;stroke-dasharray:none}
    .v050-hero.active-lte .v082-cable-line{stroke:#a0a8af;opacity:.34}
    .v050-hero.active-none .v082-cable-line,.v050-hero.active-none .v082-lte-line{stroke:var(--kp-red);opacity:.45}

    .v082-overview .v061-topology-card{z-index:8!important;background:rgba(255,255,255,.93)!important;backdrop-filter:blur(10px)!important}
    .v082-overview .v061-topology-card strong{font-size:14px!important;line-height:1.12!important}
    .v082-overview .v061-topology-card span{font-size:12px!important;line-height:1.15!important;margin-top:3px!important}
    .v082-overview .v061-lte{
      left:50%!important;right:auto!important;top:34%!important;transform:translate(-50%,-50%)!important;
      min-width:126px!important;max-width:148px!important;min-height:58px!important;padding:8px 10px!important;flex-direction:row!important;text-align:left!important;
    }
    .v082-overview .v061-lte ha-icon{--mdc-icon-size:25px!important}
    .v082-overview .v061-cable,.v082-overview .v061-lan{
      top:58%!important;transform:none!important;width:108px!important;min-width:108px!important;max-width:108px!important;min-height:82px!important;
      padding:9px 7px!important;flex-direction:column!important;justify-content:center!important;text-align:center!important;gap:5px!important;
    }
    .v082-overview .v061-cable{left:3%!important;right:auto!important}
    .v082-overview .v061-lan{right:3%!important;left:auto!important}
    .v082-overview .v061-cable ha-icon,.v082-overview .v061-lan ha-icon{--mdc-icon-size:27px!important}
    .v082-overview .v061-cable div,.v082-overview .v061-lan div{text-align:center!important}

    .v082-reserve-state{
      --v082-tone:var(--secondary-text-color);
      min-height:68px;padding:11px 14px;display:flex;align-items:center;gap:12px;
      border:1px solid color-mix(in srgb,var(--v082-tone) 30%,transparent);border-radius:22px;
      background:color-mix(in srgb,var(--v082-tone) 8%,var(--card-background-color));
    }
    .v082-reserve-state.ok{--v082-tone:var(--kp-green)}
    .v082-reserve-state.bad{--v082-tone:var(--kp-red)}
    .v082-reserve-state.unknown{--v082-tone:var(--secondary-text-color)}
    .v082-reserve-state>ha-icon{--mdc-icon-size:31px;color:var(--v082-tone);flex:0 0 auto}
    .v082-reserve-state div{min-width:0}.v082-reserve-state strong,.v082-reserve-state span{display:block}
    .v082-reserve-state strong{font-size:16px;font-weight:750;color:color-mix(in srgb,var(--v082-tone) 80%,var(--primary-text-color));line-height:1.15}
    .v082-reserve-state span{margin-top:4px;font-size:13px;font-weight:550;color:var(--secondary-text-color);line-height:1.25}

    .v082-active-card{position:relative;padding:13px 12px 12px!important;border-color:color-mix(in srgb,var(--primary-color) 34%,var(--kp-border))!important}
    .v082-active-head{min-height:44px;display:flex;align-items:center;gap:8px;padding-right:42px}
    .v082-active-head>ha-icon{--mdc-icon-size:28px;color:var(--primary-color)}
    .v082-active-head>strong{font-size:18px;font-weight:780;line-height:1.15}
    .v082-active-state{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:700;line-height:1.1}
    .v082-active-state.ok{color:var(--kp-green)}.v082-active-state.bad{color:var(--kp-red)}
    .v082-active-state i{display:block;width:8px;height:8px;border-radius:50%;background:currentColor}
    .v082-open{position:absolute;right:8px;top:8px;width:44px;height:44px;border:0;background:transparent;color:var(--primary-color);display:grid;place-items:center;border-radius:14px}
    .v082-open ha-icon{--mdc-icon-size:25px}

    .v082-metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:7px;border-top:1px solid color-mix(in srgb,var(--kp-border) 72%,transparent)}
    .v082-metric{min-width:0;min-height:64px;padding:9px 8px;display:grid;grid-template-columns:22px minmax(0,1fr);align-items:center;gap:7px;border-top:1px solid color-mix(in srgb,var(--kp-border) 58%,transparent)}
    .v082-metric:nth-child(-n+3){border-top:0}
    .v082-metric:nth-child(3n+2),.v082-metric:nth-child(3n+3){border-left:1px solid color-mix(in srgb,var(--kp-border) 58%,transparent)}
    .v082-metric.wide{grid-column:span 2}
    .v082-metric>ha-icon{--mdc-icon-size:21px;color:var(--primary-color)}
    .v082-metric div{min-width:0}.v082-metric span,.v082-metric strong{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis}
    .v082-metric span{font-size:12px;font-weight:550;color:var(--secondary-text-color);line-height:1.18;white-space:normal}
    .v082-metric strong{margin-top:3px;font-size:14px;font-weight:760;color:var(--primary-text-color);line-height:1.15;white-space:nowrap}

    .v082-reserve-channel{
      width:100%;min-height:72px;margin:0;padding:11px 13px!important;display:grid;grid-template-columns:32px minmax(0,1fr) 28px;align-items:center;gap:10px;
      text-align:left;color:var(--primary-text-color);font:inherit;appearance:none;-webkit-appearance:none;background:var(--card-background-color);cursor:pointer;
    }
    .v082-reserve-icon{--mdc-icon-size:28px;color:var(--primary-color)}
    .v082-reserve-channel div{min-width:0}.v082-reserve-channel strong,.v082-reserve-channel span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .v082-reserve-channel strong{font-size:17px;font-weight:760;line-height:1.15}
    .v082-reserve-channel span{margin-top:4px;font-size:13px;font-weight:550;color:var(--secondary-text-color);line-height:1.18}
    .v082-chevron{--mdc-icon-size:25px;color:var(--primary-color)}

    @media(max-width:390px){
      .v082-overview .v050-scene{min-height:398px!important}
      .v082-overview .v050-status-copy{max-width:calc(100% - 170px)!important}
      .v082-overview .v060-router{width:44%!important;top:60%!important}
      .v082-overview .v061-lte{min-width:118px!important;max-width:136px!important}
      .v082-overview .v061-cable,.v082-overview .v061-lan{width:98px!important;min-width:98px!important;max-width:98px!important}
      .v082-metric{padding-left:6px;padding-right:6px;grid-template-columns:20px minmax(0,1fr);gap:5px}
      .v082-metric>ha-icon{--mdc-icon-size:19px}
      .v082-metric strong{font-size:13px}
    }
    @media(min-width:760px){
      .v082-overview .v050-scene{min-height:470px!important}
      .v082-overview .v060-router{width:42%!important;max-width:400px!important}
      .v082-overview .v061-cable{left:5%!important}.v082-overview .v061-lan{right:5%!important}
    }
  `;
  root.append(style);
}

function patchOverviewCompositionV082(panel) {
  const root = panel.shadowRoot;
  if (!root) return;
  installOverviewStylesV082(root);
  const scope = panel._stableSlotsV075?.get("overview") || root;
  const overview = scope.querySelector(".v082-overview");
  const scene = overview?.querySelector(".v050-scene");
  if (!scene) return;

  scene.querySelectorAll(".v061-topology-layer,.v060-flow-layer,.v062-flow-layer,.v063-flow-layer").forEach((layer) => {
    layer.hidden = true;
  });

  if (!scene.querySelector(".v082-flow-layer")) {
    const flow = document.createElement("div");
    flow.className = "v082-flow-layer";
    flow.setAttribute("aria-hidden", "true");
    flow.innerHTML = `
      <svg viewBox="0 0 1000 500" preserveAspectRatio="none">
        <path class="v082-flow-glow v082-lte-line" d="M500 205 L500 278" />
        <path class="v082-flow-line v082-lte-line" d="M500 205 L500 278" />
        <path class="v082-flow-glow v082-cable-line" d="M245 302 L420 302" />
        <path class="v082-flow-line v082-cable-line" d="M245 302 L420 302" />
        <path class="v082-flow-glow v082-lan-line" d="M580 302 L755 302" />
        <path class="v082-flow-line v082-lan-line" d="M580 302 L755 302" />
      </svg>`;
    scene.append(flow);
  }

  const active = panel._activeWan?.();
  const lteState = panel._connection?.("lte_connected") || {};
  const ethState = panel._connection?.("ethernet_connected") || {};
  const lte = scene.querySelector(".v061-lte");
  const cable = scene.querySelector(".v061-cable");
  const lan = scene.querySelector(".v061-lan");

  if (lte) {
    lte.querySelector("ha-icon")?.setAttribute("icon", "mdi:radio-tower");
    const title = lte.querySelector("strong");
    const subtitle = lte.querySelector("span");
    if (title) title.textContent = "4G LTE";
    if (subtitle) subtitle.textContent = active === "lte" ? "Активный канал" : lteState.state === "up" ? "Резервный канал" : lteState.state === "down" ? "Недоступен" : "Нет данных";
  }
  if (cable) {
    cable.querySelector("ha-icon")?.setAttribute("icon", "mdi:ethernet");
    const title = cable.querySelector("strong");
    const subtitle = cable.querySelector("span");
    if (title) title.textContent = "Кабель";
    if (subtitle) subtitle.textContent = active === "ethernet" ? "Основной канал" : ethState.state === "up" ? "Резервный канал" : ethState.state === "down" ? "Недоступен" : "Нет данных";
  }
  if (lan) {
    lan.querySelector("ha-icon")?.setAttribute("icon", "mdi:lan");
    const title = lan.querySelector("strong");
    const subtitle = lan.querySelector("span");
    if (title) title.textContent = "LAN";
    if (subtitle) subtitle.textContent = "Локальная сеть";
  }
}

if (CORE_COMPONENT_V082 && !CORE_COMPONENT_V082.prototype.__nikaOverviewV082) {
  CORE_COMPONENT_V082.prototype.__nikaOverviewV082 = true;
  CORE_COMPONENT_V082.prototype._renderOverview = function () {
    return renderOverviewV082(this);
  };

  const renderBaseV082 = CORE_COMPONENT_V082.prototype._render;
  CORE_COMPONENT_V082.prototype._render = function (...args) {
    renderBaseV082.apply(this, args);
    patchOverviewCompositionV082(this);
  };

  const patchStableBaseV082 = CORE_COMPONENT_V082.prototype._patchStableDomV075;
  if (typeof patchStableBaseV082 === "function") {
    CORE_COMPONENT_V082.prototype._patchStableDomV075 = function (...args) {
      patchStableBaseV082.apply(this, args);
      patchOverviewCompositionV082(this);
    };
  }
}

if (CURRENT_SHELL_BASE_V082 && !customElements.get("keenetic-hero-app-panel-v082")) {
  class KeeneticHeroAppPanelV082 extends CURRENT_SHELL_BASE_V082 {
    _mountShell() {
      super._mountShell();
      const version = this.shadowRoot?.querySelector("#return-v081 span");
      if (version) version.textContent = `UI v${UI_VERSION_V082}`;
    }
  }
  customElements.define("keenetic-hero-app-panel-v082", KeeneticHeroAppPanelV082);
}
