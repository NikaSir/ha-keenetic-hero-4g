const CORE_COMPONENT_V050 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V050 = customElements.get("keenetic-hero-app-panel-v045");
const KEENETIC_ROOM_V050 = "data:image/webp;base64,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 ";

function escV050(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function agoV050(dateValue) {
  if (!dateValue) return "Неизвестно";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Неизвестно";
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds} сек назад`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  return `${Math.round(hours / 24)} дн назад`;
}

if (CORE_COMPONENT_V050 && !CORE_COMPONENT_V050.prototype.__nikaOverviewV050) {
  CORE_COMPONENT_V050.prototype.__nikaOverviewV050 = true;

  CORE_COMPONENT_V050.prototype._renderOverview = function () {
    const internet = this._internet();
    const active = this._activeWan();
    const eth = this._connection("ethernet_connected");
    const lte = this._connection("lte_connected");
    const telemetry = this._telemetry();
    const signal = this._lteSignal();
    const lastSwitch = this._stateObj("last_wan_switch")?.state;
    const switches = this._display("wan_switches_today", "0");

    const activeRole = active === "ethernet" ? "ethernet" : active === "lte" ? "lte" : null;
    const activeLabel = activeRole === "ethernet" ? "Ethernet" : activeRole === "lte" ? "LTE" : "Нет активного канала";
    const activeIcon = activeRole === "ethernet" ? "mdi:ethernet" : activeRole === "lte" ? "mdi:signal-4g" : "mdi:close-network-outline";
    const reserveRole = activeRole === "ethernet" ? "lte" : activeRole === "lte" ? "ethernet" : null;
    const reserveConnection = reserveRole === "lte" ? lte : reserveRole === "ethernet" ? eth : null;
    const reserveLabel = reserveRole === "lte" ? "LTE" : reserveRole === "ethernet" ? "Ethernet" : "Резерв";
    const reserveStatus = reserveConnection?.state === "up" ? "Резерв готов" : reserveConnection?.state === "down" ? "Недоступен" : "Неизвестно";
    const reserveTone = reserveConnection?.state === "up" ? "ok" : reserveConnection?.state === "down" ? "bad" : "unknown";

    const heroTitle = internet.online === true ? "Интернет работает" : internet.online === false ? "Нет подключения" : "Состояние неизвестно";
    const heroTone = internet.online === true ? "ok" : internet.online === false ? "bad" : "unknown";
    const activeRxRole = activeRole === "lte" ? "lte_rx_mbps" : "ethernet_rx_mbps";
    const activeTxRole = activeRole === "lte" ? "lte_tx_mbps" : "ethernet_tx_mbps";
    const pingRole = activeRole === "lte" ? "lte_ping" : "ethernet_ping";
    const lossRole = activeRole === "lte" ? "lte_packet_loss" : "ethernet_packet_loss";
    const activeMeta = activeRole === "ethernet"
      ? `${this._display("ethernet_link_speed", "—")}`
      : activeRole === "lte"
        ? `${this._display("lte_operator", "—")} · ${this._display("lte_primary_band", "—")}`
        : "Состояние канала недостоверно";

    const reserveMeta = reserveRole === "lte"
      ? `${this._display("lte_operator", "—")} · ${this._display("lte_network_type", "—")} · ${this._display("lte_primary_band", "—")} · RSRP ${this._display("lte_rsrp", "—")}`
      : reserveRole === "ethernet"
        ? `WAN IP ${this._display("ethernet_wan_ipv4", "—")} · Link ${this._display("ethernet_link_speed", "—")}`
        : "Нет подтверждённого резервного канала";

    const activeClass = activeRole ? `active-${activeRole}` : "active-none";
    const flowTone = heroTone === "bad" ? "bad" : activeRole === "lte" ? "blue" : "ok";

    return `<section class="view v050-overview">
      ${!telemetry.trusted ? `<div class="integrity-banner ${escV050(telemetry.tone)}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><strong>${escV050(telemetry.label)}</strong><span>${escV050(telemetry.detail)}. WAN не трактуется как нормальный до восстановления телеметрии.</span></div></div>` : ""}

      <article class="v050-hero ${escV050(heroTone)} ${activeClass}">
        <div class="v050-scene" style="--v050-room:url('${KEENETIC_ROOM_V050}')">
          <div class="v050-scene-shade"></div>

          <div class="v050-status-copy">
            <span class="v050-kicker">СОСТОЯНИЕ СЕТИ</span>
            <h1>${escV050(heroTitle)}</h1>
            <p>Основной канал · ${escV050(activeLabel)}</p>
          </div>

          <div class="v050-online-pill ${escV050(heroTone)}">
            <span class="status-dot"></span>${escV050(internet.label)}
          </div>

          <div class="v050-fresh-pill ${escV050(telemetry.tone)}">
            <ha-icon icon="mdi:clock-outline"></ha-icon>
            ${escV050(telemetry.age === null ? "Свежесть неизвестна" : `Обновлено ${Math.round(telemetry.age)} с назад`)}
          </div>

          <div class="v050-path v050-path-left ${escV050(flowTone)}">
            <div class="v050-path-node">
              <ha-icon icon="${activeIcon}"></ha-icon>
              <strong>${escV050(activeLabel)}</strong>
              <small>${escV050(activeMeta)}</small>
            </div>
            <div class="v050-dots"><i></i><i></i><i></i><i></i><i></i></div>
          </div>

          <div class="v050-path v050-path-right ${escV050(flowTone)}">
            <div class="v050-dots"><i></i><i></i><i></i><i></i></div>
            <div class="v050-path-node internet">
              <ha-icon icon="mdi:web"></ha-icon>
              <strong>Интернет</strong>
            </div>
          </div>

          <div class="v050-reserve-badge ${escV050(reserveTone)}">
            <ha-icon icon="${reserveRole === "lte" ? "mdi:signal-4g" : reserveRole === "ethernet" ? "mdi:ethernet" : "mdi:lan-disconnect"}"></ha-icon>
            <div><strong>${escV050(reserveLabel)}</strong><span>${escV050(reserveStatus)}</span></div>
          </div>

          <div class="v050-kpi-row">
            <div class="v050-kpi"><ha-icon icon="mdi:pulse"></ha-icon><span>Ping</span><strong>${escV050(this._display(pingRole, "—"))}</strong></div>
            <div class="v050-kpi"><ha-icon icon="mdi:shield-check-outline"></ha-icon><span>Потеря пакетов</span><strong>${escV050(this._display(lossRole, "—"))}</strong></div>
            <div class="v050-kpi"><ha-icon icon="mdi:signal-cellular-3"></ha-icon><span>Телеметрия</span><strong>${escV050(telemetry.age === null ? "—" : `${Math.round(telemetry.age)} с`)}</strong></div>
          </div>

          <div class="v050-reserve-strip ${escV050(reserveTone)}">
            <ha-icon icon="${reserveRole === "lte" ? "mdi:signal-4g" : "mdi:ethernet"}"></ha-icon>
            <div><strong>${escV050(reserveLabel)} · ${escV050(reserveStatus)}</strong><span>${escV050(reserveMeta)}</span></div>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </div>
        </div>
      </article>

      <article class="card v050-channels">
        <div class="section-heading"><div><ha-icon icon="mdi:wan"></ha-icon><h2>Каналы</h2></div></div>
        <div class="v050-channel-list">
          <div class="v050-channel ${activeRole === "ethernet" ? "selected" : ""}">
            <div class="v050-channel-head"><div><ha-icon icon="mdi:ethernet"></ha-icon><strong>Ethernet</strong></div>${this._statusPill(activeRole === "ethernet" ? "Активен" : eth.label, activeRole === "ethernet" ? "ok" : eth.tone)}</div>
            <div class="v050-channel-grid">
              <span><small>RX</small><strong>${escV050(this._display("ethernet_rx_mbps", "—"))}</strong></span>
              <span><small>TX</small><strong>${escV050(this._display("ethernet_tx_mbps", "—"))}</strong></span>
              <span><small>WAN IP</small><strong>${escV050(this._display("ethernet_wan_ipv4", "—"))}</strong></span>
              <span><small>Link</small><strong>${escV050(this._display("ethernet_link_speed", "—"))}</strong></span>
              <span><small>Uptime</small><strong>${escV050(this._display("ethernet_interface_uptime", "—"))}</strong></span>
              <span><small>Loss</small><strong>${escV050(this._display("ethernet_packet_loss", "—"))}</strong></span>
            </div>
          </div>

          <div class="v050-channel ${activeRole === "lte" ? "selected" : ""}">
            <div class="v050-channel-head"><div><ha-icon icon="mdi:signal-4g"></ha-icon><strong>LTE</strong></div>${this._statusPill(activeRole === "lte" ? "Активен" : lte.state === "up" ? "Резерв готов" : lte.label, activeRole === "lte" ? "ok" : lte.tone)}</div>
            <div class="v050-signal-line"><span>Сигнал</span><strong class="${escV050(signal.tone)}">${escV050(signal.label)}</strong><small>${escV050(this._display("lte_operator", "—"))} · ${escV050(this._display("lte_network_type", "—"))}</small></div>
            <div class="v050-channel-grid v050-lte-grid">
              <span><small>Band</small><strong>${escV050(this._display("lte_primary_band", "—"))}</strong></span>
              <span><small>RSRP</small><strong>${escV050(this._display("lte_rsrp", "—"))}</strong></span>
              <span><small>SINR</small><strong>${escV050(this._display("lte_sinr", "—"))}</strong></span>
              <span><small>LTE сегодня</small><strong>${escV050(this._display("lte_time_today", "—"))}</strong></span>
            </div>
          </div>
        </div>
      </article>

      <article class="card v050-last-switch">
        <div class="v050-switch-icon"><ha-icon icon="mdi:swap-horizontal"></ha-icon></div>
        <div><span>Последнее переключение</span><strong>${escV050(this._switchDirection())}</strong><small>${escV050(this._reason())}</small></div>
        <time>${lastSwitch && !this._isUnknownState(lastSwitch) ? escV050(agoV050(lastSwitch)) : "Неизвестно"}</time>
        <em>${escV050(switches)} сегодня</em>
      </article>
    </section>`;
  };

  const renderBaseV050 = CORE_COMPONENT_V050.prototype._render;
  CORE_COMPONENT_V050.prototype._render = function (...args) {
    renderBaseV050.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-keenetic-v050]")) return;
    const style = document.createElement("style");
    style.dataset.keeneticV050 = "true";
    style.textContent = `
      .v050-overview{gap:12px;padding-bottom:8px}
      .v050-hero{position:relative;overflow:hidden;border:1px solid var(--kp-border);border-radius:24px;background:var(--card-background-color);box-shadow:0 10px 28px color-mix(in srgb,#000 7%,transparent)}
      .v050-scene{position:relative;min-height:560px;padding:18px;background-image:var(--v050-room);background-size:cover;background-position:center 48%;isolation:isolate}
      .v050-scene-shade{position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.54) 23%,rgba(255,255,255,.08) 54%,rgba(255,255,255,.18) 72%,rgba(255,255,255,.94) 100%)}
      .v050-status-copy{position:absolute;left:18px;top:18px;max-width:68%;text-shadow:0 1px 10px rgba(255,255,255,.95)}
      .v050-kicker{display:block;font-size:9px;font-weight:800;letter-spacing:.08em;color:var(--kp-muted)}
      .v050-status-copy h1{margin:5px 0 3px;font-size:28px;line-height:1.04;color:var(--primary-text-color)}
      .v050-status-copy p{margin:0;font-size:12px;font-weight:600;color:var(--secondary-text-color)}
      .v050-online-pill,.v050-fresh-pill{position:absolute;right:16px;display:flex;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.8);border-radius:999px;background:rgba(255,255,255,.82);backdrop-filter:blur(12px);box-shadow:0 4px 16px rgba(0,0,0,.06);font-weight:800}
      .v050-online-pill{top:16px;padding:8px 11px;font-size:11px}.v050-online-pill.ok{color:var(--kp-green)}.v050-online-pill.bad{color:var(--kp-red)}.v050-online-pill.unknown{color:var(--kp-muted)}.v050-online-pill .status-dot{width:7px;height:7px}
      .v050-fresh-pill{top:55px;padding:6px 9px;font-size:8px;color:var(--kp-muted)}.v050-fresh-pill.ok{color:var(--kp-green)}.v050-fresh-pill.warn{color:var(--kp-yellow)}.v050-fresh-pill.bad{color:var(--kp-red)}.v050-fresh-pill ha-icon{--mdc-icon-size:14px}
      .v050-path{position:absolute;top:255px;display:flex;align-items:center;gap:0}.v050-path-left{left:16px}.v050-path-right{right:14px}.v050-path-node{min-width:76px;padding:9px 8px;border:1px solid rgba(255,255,255,.88);border-radius:17px;background:rgba(255,255,255,.82);backdrop-filter:blur(10px);text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.07)}.v050-path-node ha-icon{--mdc-icon-size:24px;display:block;margin:0 auto 2px}.v050-path-node strong,.v050-path-node small{display:block}.v050-path-node strong{font-size:11px}.v050-path-node small{margin-top:2px;font-size:7px;color:var(--kp-muted);max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v050-path-node.internet{min-width:65px}
      .v050-path.ok .v050-path-node{color:var(--kp-green)}.v050-path.blue .v050-path-node{color:var(--kp-blue)}.v050-path.bad .v050-path-node{color:var(--kp-red)}
      .v050-dots{display:flex;gap:3px;width:46px;justify-content:center}.v050-dots i{width:5px;height:5px;border-radius:50%;background:var(--kp-green);animation:v050-flow 1.3s infinite ease-in-out}.v050-path.blue .v050-dots i{background:var(--kp-blue)}.v050-path.bad .v050-dots i{background:var(--kp-red);animation:none;opacity:.35}.v050-dots i:nth-child(2){animation-delay:.12s}.v050-dots i:nth-child(3){animation-delay:.24s}.v050-dots i:nth-child(4){animation-delay:.36s}.v050-dots i:nth-child(5){animation-delay:.48s}@keyframes v050-flow{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}
      .v050-reserve-badge{position:absolute;right:18px;top:340px;display:flex;align-items:center;gap:7px;padding:9px 10px;border:1px solid rgba(255,255,255,.88);border-radius:17px;background:rgba(255,255,255,.82);backdrop-filter:blur(10px);box-shadow:0 4px 14px rgba(0,0,0,.06)}.v050-reserve-badge ha-icon{--mdc-icon-size:23px}.v050-reserve-badge strong,.v050-reserve-badge span{display:block}.v050-reserve-badge strong{font-size:10px}.v050-reserve-badge span{font-size:8px;color:var(--kp-muted)}.v050-reserve-badge.ok{color:var(--kp-blue)}.v050-reserve-badge.bad{color:var(--kp-red)}
      .v050-kpi-row{position:absolute;left:16px;right:16px;bottom:82px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.v050-kpi{display:grid;grid-template-columns:22px 1fr;grid-template-rows:auto auto;column-gap:5px;padding:9px;border:1px solid rgba(255,255,255,.9);border-radius:15px;background:rgba(255,255,255,.86);backdrop-filter:blur(12px);box-shadow:0 4px 14px rgba(0,0,0,.05)}.v050-kpi ha-icon{grid-row:1/3;align-self:center;--mdc-icon-size:20px;color:var(--kp-blue)}.v050-kpi span{font-size:7px;color:var(--kp-muted)}.v050-kpi strong{font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .v050-reserve-strip{position:absolute;left:16px;right:16px;bottom:14px;display:grid;grid-template-columns:24px minmax(0,1fr) 20px;align-items:center;gap:8px;padding:10px 12px;border:1px solid rgba(255,255,255,.92);border-radius:17px;background:rgba(239,248,255,.91);backdrop-filter:blur(12px);box-shadow:0 5px 16px rgba(0,0,0,.06)}.v050-reserve-strip>ha-icon{--mdc-icon-size:21px;color:var(--kp-blue)}.v050-reserve-strip div strong,.v050-reserve-strip div span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v050-reserve-strip div strong{font-size:11px}.v050-reserve-strip div span{margin-top:2px;font-size:8px;color:var(--kp-muted)}.v050-reserve-strip.bad{background:rgba(255,241,241,.92)}.v050-reserve-strip.bad>ha-icon{color:var(--kp-red)}
      .v050-channels{padding:14px}.v050-channel-list{display:grid;gap:9px;margin-top:10px}.v050-channel{border:1px solid var(--kp-border);border-radius:19px;padding:12px;background:color-mix(in srgb,var(--primary-text-color) 2%,transparent)}.v050-channel.selected{border-color:color-mix(in srgb,var(--kp-blue) 55%,var(--kp-border));background:color-mix(in srgb,var(--kp-blue) 5%,transparent)}.v050-channel-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.v050-channel-head>div{display:flex;align-items:center;gap:7px}.v050-channel-head ha-icon{--mdc-icon-size:22px;color:var(--kp-blue)}.v050-channel-head strong{font-size:14px}.v050-channel-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin-top:10px}.v050-channel-grid span{min-width:0;padding:7px 8px;border-top:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)}.v050-channel-grid span:nth-child(-n+3){border-top:0}.v050-channel-grid span:not(:nth-child(3n+1)){border-left:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)}.v050-channel-grid small,.v050-channel-grid strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v050-channel-grid small{font-size:8px;color:var(--kp-muted)}.v050-channel-grid strong{margin-top:2px;font-size:11px}.v050-lte-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.v050-lte-grid span:nth-child(-n+4){border-top:0}.v050-lte-grid span:not(:nth-child(4n+1)){border-left:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)}.v050-signal-line{margin-top:9px}.v050-signal-line span,.v050-signal-line strong,.v050-signal-line small{display:block}.v050-signal-line span{font-size:8px;color:var(--kp-muted)}.v050-signal-line strong{font-size:13px}.v050-signal-line small{font-size:8px;color:var(--kp-muted)}
      .v050-last-switch{display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:center;gap:9px;padding:11px 13px}.v050-switch-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:12px;background:color-mix(in srgb,var(--kp-blue) 9%,transparent);color:var(--kp-blue)}.v050-switch-icon ha-icon{--mdc-icon-size:21px}.v050-last-switch span,.v050-last-switch strong,.v050-last-switch small{display:block}.v050-last-switch span{font-size:8px;color:var(--kp-muted)}.v050-last-switch strong{font-size:11px}.v050-last-switch small{margin-top:1px;font-size:8px;color:var(--kp-muted)}.v050-last-switch time{font-size:9px;color:var(--kp-muted);white-space:nowrap}.v050-last-switch em{display:none}
      @media(max-width:430px){.v050-scene{min-height:540px;padding:14px;background-position:center 48%}.v050-status-copy{left:14px;top:14px;max-width:72%}.v050-status-copy h1{font-size:25px}.v050-online-pill{right:12px;top:12px;padding:7px 9px}.v050-fresh-pill{right:12px;top:49px}.v050-path{top:245px}.v050-path-left{left:10px}.v050-path-right{right:9px}.v050-path-node{min-width:67px;padding:8px 6px}.v050-dots{width:32px;gap:2px}.v050-dots i{width:4px;height:4px}.v050-reserve-badge{right:10px;top:330px;padding:8px}.v050-kpi-row{left:10px;right:10px;bottom:78px;gap:5px}.v050-kpi{grid-template-columns:18px 1fr;padding:8px 6px}.v050-kpi ha-icon{--mdc-icon-size:17px}.v050-kpi strong{font-size:10px}.v050-reserve-strip{left:10px;right:10px;bottom:10px;padding:9px 10px}.v050-channel-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v050-channel-grid span:nth-child(-n+3){border-top:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)}.v050-channel-grid span:nth-child(-n+2){border-top:0}.v050-channel-grid span:not(:nth-child(3n+1)){border-left:0}.v050-channel-grid span:nth-child(even){border-left:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)}.v050-lte-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v050-lte-grid span:nth-child(-n+4){border-top:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)}.v050-lte-grid span:nth-child(-n+2){border-top:0}.v050-lte-grid span:not(:nth-child(4n+1)){border-left:0}.v050-lte-grid span:nth-child(even){border-left:1px solid color-mix(in srgb,var(--kp-border) 65%,transparent)}}
      @media(min-width:760px){.v050-overview{max-width:980px;margin:0 auto}.v050-scene{min-height:600px;background-size:cover;background-position:center 46%}.v050-channel-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    root.append(style);
  };
}

if (BASE_COMPONENT_V050 && !customElements.get("keenetic-hero-app-panel-v050")) {
  class KeeneticHeroAppPanelV050 extends BASE_COMPONENT_V050 {
    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;
      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.5.0";
    }
  }
  customElements.define("keenetic-hero-app-panel-v050", KeeneticHeroAppPanelV050);
}
