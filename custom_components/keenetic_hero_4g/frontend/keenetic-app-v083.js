await import("./keenetic-app-v081.js");

const UI_VERSION_V083 = "0.8.3";
const CORE_COMPONENT_V083 = customElements.get("keenetic-hero-panel");
const CURRENT_SHELL_BASE_V083 = customElements.get("keenetic-hero-app-panel-v081");

function escV083(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setTextV083(element, value) {
  if (element && element.textContent !== value) element.textContent = value;
}

function setAttributeV083(element, name, value) {
  if (element && element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function setDatasetV083(element, name, value) {
  if (element && element.dataset[name] !== value) element.dataset[name] = value;
}

function reserveStateV083(reserveRole, reserveConnection) {
  const label = reserveRole === "lte" ? "4G LTE" : reserveRole === "ethernet" ? "Ethernet" : "резервного канала";
  if (reserveConnection?.state === "up") {
    return {
      tone: "ok",
      icon: "mdi:check-circle",
      title: "Резерв готов",
      detail: `${label} подключён и готов к работе.`,
    };
  }
  if (reserveConnection?.state === "down") {
    return {
      tone: "bad",
      icon: "mdi:alert-circle-outline",
      title: "Резерв недоступен",
      detail: `${label} сейчас недоступен.`,
    };
  }
  return {
    tone: "unknown",
    icon: "mdi:help-circle-outline",
    title: "Нет данных о резерве",
    detail: `Готовность ${label} не подтверждена.`,
  };
}

function metricV083(panel, role, icon, label, value, className = "") {
  const entity = role ? panel._entityId?.(role) : null;
  const entityAttributes = entity ? ` data-entity="${escV083(entity)}" tabindex="0"` : "";
  return `<div class="v083-metric ${className}"${entityAttributes}><ha-icon icon="${icon}"></ha-icon><div><span>${escV083(label)}</span><strong>${escV083(value)}</strong></div></div>`;
}

function reserveMetaV083(panel, reserveRole) {
  if (reserveRole === "lte") {
    return `${panel._display("lte_operator", "—")} · ${panel._display("lte_network_type", "—")} · ${panel._display("lte_primary_band", "—")} · RSRP ${panel._display("lte_rsrp", "—")}`;
  }
  if (reserveRole === "ethernet") {
    return `Link ${panel._display("ethernet_link_speed", "—")} · WAN IP ${panel._display("ethernet_wan_ipv4", "—")}`;
  }
  return "Нет подтверждённого резервного канала";
}

function renderOverviewV083(panel) {
  const internet = panel._internet();
  const active = panel._activeWan();
  const eth = panel._connection("ethernet_connected");
  const lte = panel._connection("lte_connected");
  const telemetry = panel._telemetry();

  const activeRole = active === "ethernet" ? "ethernet" : active === "lte" ? "lte" : null;
  const reserveRole = activeRole === "ethernet" ? "lte" : activeRole === "lte" ? "ethernet" : null;
  const reserveConnection = reserveRole === "lte" ? lte : reserveRole === "ethernet" ? eth : null;
  const reserveState = reserveStateV083(reserveRole, reserveConnection);
  const knownNoChannel = telemetry.trusted && internet.online === false;

  const heroTitle = internet.online === true ? "Интернет работает" : internet.online === false ? "Нет подключения" : "Состояние неизвестно";
  const heroTone = internet.online === true ? "ok" : internet.online === false ? "bad" : "unknown";
  const activeClass = activeRole ? `active-${activeRole}` : "active-none";
  const activeName = activeRole === "ethernet" ? "Ethernet" : activeRole === "lte" ? "4G LTE" : knownNoChannel ? "Нет активного канала" : "Канал не определён";
  const activeIcon = activeRole === "ethernet" ? "mdi:ethernet" : activeRole === "lte" ? "mdi:radio-tower" : "mdi:lan-disconnect";
  const activeTone = activeRole ? "ok" : knownNoChannel ? "bad" : "unknown";
  const activeStateLabel = activeRole ? "Активен" : knownNoChannel ? "Нет канала" : "Нет данных";

  const pingRole = activeRole === "lte" ? "lte_ping" : activeRole === "ethernet" ? "ethernet_ping" : null;
  const lossRole = activeRole === "lte" ? "lte_packet_loss" : activeRole === "ethernet" ? "ethernet_packet_loss" : null;
  const rxRole = activeRole === "lte" ? "lte_rx_mbps" : activeRole === "ethernet" ? "ethernet_rx_mbps" : null;
  const txRole = activeRole === "lte" ? "lte_tx_mbps" : activeRole === "ethernet" ? "ethernet_tx_mbps" : null;
  const wanRole = activeRole === "lte" ? "lte_wan_ipv4" : activeRole === "ethernet" ? "ethernet_wan_ipv4" : null;
  const uptimeRole = activeRole === "lte" ? "lte_interface_uptime" : activeRole === "ethernet" ? "ethernet_interface_uptime" : null;
  const linkRole = activeRole === "lte" ? "lte_rsrp" : activeRole === "ethernet" ? "ethernet_link_speed" : null;
  const linkLabel = activeRole === "lte" ? "Сигнал" : "Link";
  const linkValue = activeRole === "lte"
    ? `RSRP ${panel._display("lte_rsrp", "—")}`
    : activeRole === "ethernet" ? panel._display("ethernet_link_speed", "—") : "—";

  const reserveName = reserveRole === "lte" ? "4G LTE" : reserveRole === "ethernet" ? "Ethernet" : "Резервный канал";
  const reserveIcon = reserveRole === "lte" ? "mdi:radio-tower" : reserveRole === "ethernet" ? "mdi:ethernet" : "mdi:lan-disconnect";

  return `<section class="view v050-overview v083-overview">
    ${!telemetry.trusted ? `<div class="integrity-banner ${escV083(telemetry.tone)}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><strong>${escV083(telemetry.label)}</strong><span>${escV083(telemetry.detail)}. WAN не трактуется как нормальный до восстановления телеметрии.</span></div></div>` : ""}

    <article class="v050-hero ${escV083(heroTone)} ${activeClass}">
      <div class="v050-scene">
        <div class="v050-scene-shade"></div>
        <div class="v050-status-copy">
          <h1>${escV083(heroTitle)}</h1>
          <p>Основной канал · ${escV083(activeName)}</p>
        </div>
        <div class="v050-online-pill ${escV083(heroTone)}"><span class="status-dot"></span>${escV083(internet.label)}</div>
        <div class="v050-fresh-pill ${escV083(telemetry.tone)}"><ha-icon icon="mdi:clock-outline"></ha-icon>${escV083(telemetry.age === null ? "Свежесть неизвестна" : `Обновлено ${Math.round(telemetry.age)} с назад`)}</div>
      </div>
    </article>

    <div class="v083-reserve-state ${reserveState.tone}">
      <ha-icon icon="${reserveState.icon}"></ha-icon>
      <div><strong>${escV083(reserveState.title)}</strong><span>${escV083(reserveState.detail)}</span></div>
    </div>

    <article class="card v083-active-card">
      <div class="v083-active-head">
        <ha-icon icon="${activeIcon}"></ha-icon>
        <strong>${escV083(activeName)}</strong>
        <span class="v083-active-state ${activeTone}"><i></i>${activeStateLabel}</span>
        <button type="button" class="v083-open" data-view="wan" aria-label="Открыть каналы"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
      <div class="v083-metric-grid">
        ${metricV083(panel, pingRole, "mdi:earth", "Ping", activeRole ? panel._display(pingRole, "—") : "—")}
        ${metricV083(panel, lossRole, "mdi:shield-check-outline", "Потеря пакетов", activeRole ? panel._display(lossRole, "—") : "—")}
        ${metricV083(panel, null, "mdi:timer-outline", "Телеметрия", telemetry.age === null ? "—" : `${Math.round(telemetry.age)} с`)}
        ${metricV083(panel, linkRole, "mdi:link-variant", linkLabel, linkValue)}
        ${metricV083(panel, rxRole, "mdi:download-network-outline", "RX", activeRole ? panel._display(rxRole, "—") : "—")}
        ${metricV083(panel, txRole, "mdi:upload-network-outline", "TX", activeRole ? panel._display(txRole, "—") : "—")}
        ${metricV083(panel, wanRole, "mdi:ip-network-outline", "WAN IP", activeRole ? panel._display(wanRole, "—") : "—", "wide")}
        ${metricV083(panel, uptimeRole, "mdi:clock-outline", "Uptime", activeRole ? panel._display(uptimeRole, "—") : "—")}
      </div>
    </article>

    <button type="button" class="card v083-reserve-channel" data-view="wan" aria-label="Открыть резервный канал">
      <ha-icon class="v083-reserve-icon" icon="${reserveIcon}"></ha-icon>
      <div><strong>${escV083(reserveName)}</strong><span>${escV083(reserveMetaV083(panel, reserveRole))}</span></div>
      <ha-icon class="v083-chevron" icon="mdi:chevron-right"></ha-icon>
    </button>
  </section>`;
}

function installOverviewStylesV083(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v083]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV083 = "true";
  style.textContent = `
    .v083-overview{gap:8px!important;padding-bottom:10px!important}
    .v083-overview .v050-channels,.v083-overview .v050-kpi-row,.v083-overview .v050-reserve-strip,.v083-overview .v050-reserve-badge,.v083-overview .v050-path{display:none!important}
    .v083-overview .v061-topology-layer,.v083-overview .v060-flow-layer,.v083-overview .v062-flow-layer,.v083-overview .v063-flow-layer{display:none!important}
    .v083-overview .v050-scene{
      min-height:340px!important;padding:12px!important;overflow:hidden!important;
      background-position:center 54%!important;
    }
    .v083-overview .v050-status-copy{left:14px!important;top:13px!important;max-width:calc(100% - 194px)!important}
    .v083-overview .v050-status-copy h1{margin:0 0 5px!important;font-size:25px!important;line-height:1.04!important}
    .v083-overview .v050-status-copy p{font-size:14px!important;line-height:1.18!important;font-weight:650!important}
    .v083-overview .v060-router{top:61.5%!important;width:47%!important;max-width:300px!important;z-index:6!important}

    .v083-flow-layer{position:absolute;inset:0;z-index:4;pointer-events:none}
    .v083-flow-layer svg{width:100%;height:100%;overflow:visible}
    .v083-flow-line,.v083-flow-glow{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .v083-flow-line{stroke-width:6;stroke:#8c969f;stroke-dasharray:5 11}
    .v083-flow-glow{stroke-width:14;stroke:#8c969f;opacity:.10;filter:blur(2px)}
    .v083-flow-layer[data-cable-state="active"] .v083-cable-line,
    .v083-flow-layer[data-lte-state="active"] .v083-lte-line,
    .v083-flow-layer[data-lan-state="active"] .v083-lan-line{stroke:#27bf78}
    .v083-flow-layer[data-cable-state="active"] .v083-flow-line.v083-cable-line,
    .v083-flow-layer[data-lte-state="active"] .v083-flow-line.v083-lte-line,
    .v083-flow-layer[data-lan-state="active"] .v083-flow-line.v083-lan-line{stroke-dasharray:none}
    .v083-flow-layer[data-cable-state="standby"] .v083-cable-line,
    .v083-flow-layer[data-lte-state="standby"] .v083-lte-line{stroke:#179fe6}
    .v083-flow-layer[data-cable-state="down"] .v083-cable-line,
    .v083-flow-layer[data-lte-state="down"] .v083-lte-line,
    .v083-flow-layer[data-lan-state="down"] .v083-lan-line{stroke:var(--kp-red);opacity:.55}

    .v083-overview .v061-topology-card{z-index:8!important;background:rgba(255,255,255,.93)!important;backdrop-filter:blur(10px)!important}
    .v083-overview .v061-topology-card strong{font-size:14px!important;line-height:1.12!important}
    .v083-overview .v061-topology-card span{font-size:12px!important;line-height:1.15!important;margin-top:3px!important}
    .v083-overview .v061-topology-card[data-channel-state="active"] ha-icon,
    .v083-overview .v061-topology-card[data-channel-state="active"] strong{color:var(--kp-green)!important}
    .v083-overview .v061-topology-card[data-channel-state="standby"] ha-icon,
    .v083-overview .v061-topology-card[data-channel-state="standby"] strong{color:var(--kp-blue)!important}
    .v083-overview .v061-topology-card[data-channel-state="down"] ha-icon,
    .v083-overview .v061-topology-card[data-channel-state="down"] strong{color:var(--kp-red)!important}
    .v083-overview .v061-topology-card[data-channel-state="unknown"] ha-icon,
    .v083-overview .v061-topology-card[data-channel-state="unknown"] strong{color:var(--kp-grey)!important}
    .v083-overview .v061-lte{
      left:50%!important;right:auto!important;top:32.5%!important;transform:translate(-50%,-50%)!important;
      width:164px!important;min-width:164px!important;max-width:164px!important;min-height:58px!important;padding:8px 10px!important;flex-direction:row!important;text-align:left!important;
    }
    .v083-overview .v061-lte ha-icon{--mdc-icon-size:25px!important}
    .v083-overview .v061-lte div{min-width:0!important;flex:1 1 auto!important}
    .v083-overview .v061-cable,.v083-overview .v061-lan{
      top:57.5%!important;transform:none!important;width:104px!important;min-width:104px!important;max-width:104px!important;min-height:78px!important;
      padding:8px 7px!important;flex-direction:column!important;justify-content:center!important;text-align:center!important;gap:4px!important;
    }
    .v083-overview .v061-cable{left:3%!important;right:auto!important}
    .v083-overview .v061-lan{right:3%!important;left:auto!important}
    .v083-overview .v061-cable ha-icon,.v083-overview .v061-lan ha-icon{--mdc-icon-size:27px!important}
    .v083-overview .v061-cable div,.v083-overview .v061-lan div{text-align:center!important}

    .v083-reserve-state{
      --v083-tone:var(--secondary-text-color);min-height:56px;padding:8px 12px;display:flex;align-items:center;gap:10px;
      border:1px solid color-mix(in srgb,var(--v083-tone) 30%,transparent);border-radius:20px;
      background:color-mix(in srgb,var(--v083-tone) 8%,var(--card-background-color));
    }
    .v083-reserve-state.ok{--v083-tone:var(--kp-green)}.v083-reserve-state.bad{--v083-tone:var(--kp-red)}.v083-reserve-state.unknown{--v083-tone:var(--secondary-text-color)}
    .v083-reserve-state>ha-icon{--mdc-icon-size:27px;color:var(--v083-tone);flex:0 0 auto}
    .v083-reserve-state div{min-width:0}.v083-reserve-state strong,.v083-reserve-state span{display:block}
    .v083-reserve-state strong{font-size:16px;font-weight:750;color:color-mix(in srgb,var(--v083-tone) 80%,var(--primary-text-color));line-height:1.12}
    .v083-reserve-state span{margin-top:2px;font-size:13px;font-weight:550;color:var(--secondary-text-color);line-height:1.2}

    .v083-active-card{position:relative;padding:10px 10px 9px!important;border-color:color-mix(in srgb,var(--primary-color) 34%,var(--kp-border))!important}
    .v083-active-head{min-height:40px;display:flex;align-items:center;gap:7px;padding-right:40px}
    .v083-active-head>ha-icon{--mdc-icon-size:27px;color:var(--primary-color)}
    .v083-active-head>strong{font-size:18px;font-weight:780;line-height:1.15}
    .v083-active-state{display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:700;line-height:1.1}
    .v083-active-state.ok{color:var(--kp-green)}.v083-active-state.bad{color:var(--kp-red)}.v083-active-state.unknown{color:var(--kp-grey)}
    .v083-active-state i{display:block;width:8px;height:8px;border-radius:50%;background:currentColor}
    .v083-open{position:absolute;right:6px;top:5px;width:44px;height:44px;border:0;background:transparent;color:var(--primary-color);display:grid;place-items:center;border-radius:14px}
    .v083-open ha-icon{--mdc-icon-size:25px}

    .v083-metric-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:5px;border-top:1px solid color-mix(in srgb,var(--kp-border) 72%,transparent)}
    .v083-metric{min-width:0;min-height:58px;padding:7px;display:grid;grid-template-columns:21px minmax(0,1fr);align-items:center;gap:6px;border-top:1px solid color-mix(in srgb,var(--kp-border) 58%,transparent);outline:none}
    .v083-metric:nth-child(-n+3){border-top:0}.v083-metric:nth-child(3n+2),.v083-metric:nth-child(3n+3){border-left:1px solid color-mix(in srgb,var(--kp-border) 58%,transparent)}
    .v083-metric.wide{grid-column:span 2}.v083-metric:focus{box-shadow:inset 0 0 0 2px var(--primary-color)}
    .v083-metric>ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}
    .v083-metric div{min-width:0}.v083-metric span,.v083-metric strong{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis}
    .v083-metric span{font-size:12px;font-weight:550;color:var(--secondary-text-color);line-height:1.14;white-space:normal}
    .v083-metric strong{margin-top:2px;font-size:14px;font-weight:760;color:var(--primary-text-color);line-height:1.13;white-space:nowrap}

    .v083-reserve-channel{
      width:100%;min-height:64px;margin:0;padding:9px 12px!important;display:grid;grid-template-columns:30px minmax(0,1fr) 28px;align-items:center;gap:9px;
      text-align:left;color:var(--primary-text-color);font:inherit;appearance:none;-webkit-appearance:none;background:var(--card-background-color);cursor:pointer;
    }
    .v083-reserve-icon{--mdc-icon-size:27px;color:var(--primary-color)}
    .v083-reserve-channel div{min-width:0}.v083-reserve-channel strong,.v083-reserve-channel span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .v083-reserve-channel strong{font-size:17px;font-weight:760;line-height:1.12}.v083-reserve-channel span{margin-top:3px;font-size:13px;font-weight:550;color:var(--secondary-text-color);line-height:1.15}
    .v083-chevron{--mdc-icon-size:25px;color:var(--primary-color)}

    @media(max-width:390px){
      .v083-overview .v050-scene{min-height:330px!important}
      .v083-overview .v050-status-copy{max-width:calc(100% - 182px)!important}
      .v083-overview .v060-router{width:46%!important;top:61.5%!important}
      .v083-overview .v061-lte{width:158px!important;min-width:158px!important;max-width:158px!important}
      .v083-overview .v061-cable,.v083-overview .v061-lan{width:96px!important;min-width:96px!important;max-width:96px!important}
      .v083-metric{padding-left:5px;padding-right:5px;grid-template-columns:19px minmax(0,1fr);gap:5px}
      .v083-metric>ha-icon{--mdc-icon-size:19px}.v083-metric strong{font-size:13px}
    }
    @media(min-width:760px){
      .v083-overview .v050-scene{min-height:440px!important}
      .v083-overview .v060-router{width:42%!important;max-width:400px!important}
      .v083-overview .v061-cable{left:5%!important}.v083-overview .v061-lan{right:5%!important}
    }
  `;
  root.append(style);
}

function ensureOverviewStructureV083(panel) {
  const root = panel.shadowRoot;
  const scope = panel._stableSlotsV075?.get("overview") || root;
  const scene = scope?.querySelector(".v083-overview .v050-scene");
  if (!scene || scene.dataset.structureV083 === "true") return;

  scene.querySelectorAll(".v061-topology-layer,.v060-flow-layer,.v062-flow-layer,.v063-flow-layer").forEach((layer) => {
    if (!layer.hidden) layer.hidden = true;
  });

  if (!scene.querySelector(".v083-flow-layer")) {
    const flow = document.createElement("div");
    flow.className = "v083-flow-layer";
    flow.setAttribute("aria-hidden", "true");
    flow.innerHTML = `
      <svg viewBox="0 0 1000 500" preserveAspectRatio="none">
        <path class="v083-flow-glow v083-lte-line" d="M500 195 L500 278" />
        <path class="v083-flow-line v083-lte-line" d="M500 195 L500 278" />
        <path class="v083-flow-glow v083-cable-line" d="M245 302 L420 302" />
        <path class="v083-flow-line v083-cable-line" d="M245 302 L420 302" />
        <path class="v083-flow-glow v083-lan-line" d="M580 302 L755 302" />
        <path class="v083-flow-line v083-lan-line" d="M580 302 L755 302" />
      </svg>`;
    scene.append(flow);
  }
  scene.dataset.structureV083 = "true";
}

function channelStateV083(activeRole, role, connection) {
  if (activeRole === role) return "active";
  if (connection?.state === "up") return "standby";
  if (connection?.state === "down") return "down";
  return "unknown";
}

function patchOverviewStateV083(panel) {
  const root = panel.shadowRoot;
  const scope = panel._stableSlotsV075?.get("overview") || root;
  const overview = scope?.querySelector(".v083-overview");
  const scene = overview?.querySelector(".v050-scene");
  if (!scene) return;

  const activeRole = panel._activeWan?.();
  const lteState = panel._connection?.("lte_connected") || {};
  const ethState = panel._connection?.("ethernet_connected") || {};
  const configured = panel._bootstrap?.telemetry || {};
  const routerState = panel._connection?.("router_connectivity") || {};
  const lanState = configured.connection_available === true || routerState.state === "up"
    ? "active"
    : configured.connection_available === false || routerState.state === "down" ? "down" : "unknown";
  const lteVisual = channelStateV083(activeRole, "lte", lteState);
  const cableVisual = channelStateV083(activeRole, "ethernet", ethState);

  const flow = scene.querySelector(".v083-flow-layer");
  setDatasetV083(flow, "lteState", lteVisual);
  setDatasetV083(flow, "cableState", cableVisual);
  setDatasetV083(flow, "lanState", lanState);

  const lte = scene.querySelector(".v061-lte");
  const cable = scene.querySelector(".v061-cable");
  const lan = scene.querySelector(".v061-lan");
  setDatasetV083(lte, "channelState", lteVisual);
  setDatasetV083(cable, "channelState", cableVisual);
  setDatasetV083(lan, "channelState", lanState);

  setAttributeV083(lte?.querySelector("ha-icon"), "icon", "mdi:radio-tower");
  setTextV083(lte?.querySelector("strong"), "4G LTE");
  setTextV083(lte?.querySelector("span"), activeRole === "lte" ? "Активный канал" : lteState.state === "up" ? "Резервный канал" : lteState.state === "down" ? "Недоступен" : "Нет данных");

  setAttributeV083(cable?.querySelector("ha-icon"), "icon", "mdi:ethernet");
  setTextV083(cable?.querySelector("strong"), "Кабель");
  setTextV083(cable?.querySelector("span"), activeRole === "ethernet" ? "Основной канал" : ethState.state === "up" ? "Резервный канал" : ethState.state === "down" ? "Недоступен" : "Нет данных");

  setAttributeV083(lan?.querySelector("ha-icon"), "icon", "mdi:lan");
  setTextV083(lan?.querySelector("strong"), "LAN");
  setTextV083(lan?.querySelector("span"), lanState === "down" ? "Нет связи" : lanState === "unknown" ? "Нет данных" : "Локальная сеть");

  panel._bindStableInteractionsV075?.(overview);
}

if (CORE_COMPONENT_V083 && !CORE_COMPONENT_V083.prototype.__nikaOverviewV083) {
  CORE_COMPONENT_V083.prototype.__nikaOverviewV083 = true;
  CORE_COMPONENT_V083.prototype._renderOverview = function () {
    return renderOverviewV083(this);
  };

  const mountStableBaseV083 = CORE_COMPONENT_V083.prototype._mountStableDomV075;
  CORE_COMPONENT_V083.prototype._mountStableDomV075 = function (...args) {
    const mounted = mountStableBaseV083.apply(this, args);
    if (!mounted) return mounted;
    installOverviewStylesV083(this.shadowRoot);
    ensureOverviewStructureV083(this);
    patchOverviewStateV083(this);
    return mounted;
  };

  const patchStableBaseV083 = CORE_COMPONENT_V083.prototype._patchStableDomV075;
  CORE_COMPONENT_V083.prototype._patchStableDomV075 = function (...args) {
    patchStableBaseV083.apply(this, args);
    patchOverviewStateV083(this);
  };
}

if (CURRENT_SHELL_BASE_V083 && !customElements.get("keenetic-hero-app-panel-v083")) {
  class KeeneticHeroAppPanelV083 extends CURRENT_SHELL_BASE_V083 {
    _mountShell() {
      super._mountShell();
      const version = this.shadowRoot?.querySelector("#return-v081 span");
      if (version && version.textContent !== `UI v${UI_VERSION_V083}`) version.textContent = `UI v${UI_VERSION_V083}`;
    }
  }
  customElements.define("keenetic-hero-app-panel-v083", KeeneticHeroAppPanelV083);
}
