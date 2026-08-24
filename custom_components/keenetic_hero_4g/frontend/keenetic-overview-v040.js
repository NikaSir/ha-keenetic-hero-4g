const BASE_V040 = customElements.get("keenetic-hero-panel");

function escV040(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (BASE_V040) {
  BASE_V040.prototype._renderOverview = function () {
    const internet = this._internet();
    const active = this._activeWan();
    const eth = this._connection("ethernet_connected");
    const lte = this._connection("lte_connected");
    const telemetry = this._telemetry();
    const signal = this._lteSignal();
    const lastSwitch = this._stateObj("last_wan_switch")?.state;
    const switches = this._display("wan_switches_today", "0");

    const activeRole = active === "ethernet" ? "ethernet" : active === "lte" ? "lte" : null;
    const activeIcon = activeRole === "ethernet" ? "mdi:ethernet" : activeRole === "lte" ? "mdi:signal-4g" : "mdi:close-network-outline";
    const activeLabel = activeRole === "ethernet" ? "Ethernet" : activeRole === "lte" ? "LTE / 4G" : "Нет активного канала";
    const activeSub = activeRole === "ethernet"
      ? `${this._display("ethernet_link_speed", "—")} · ↓ ${this._display("ethernet_rx_mbps", "—")} · ↑ ${this._display("ethernet_tx_mbps", "—")}`
      : activeRole === "lte"
        ? `${this._display("lte_operator", "—")} · ${this._display("lte_network_type", "—")} · ${this._display("lte_primary_band", "—")}`
        : "Оба WAN-канала недоступны или состояние недостоверно";
    const activeTone = activeRole ? (internet.online === false ? "bad" : activeRole === "lte" ? "blue" : "ok") : "bad";
    const reserveLabel = activeRole === "ethernet"
      ? (lte.state === "up" ? "LTE · Резерв готов" : lte.state === "down" ? "LTE · Недоступен" : "LTE · Неизвестно")
      : activeRole === "lte"
        ? (eth.state === "up" ? "Ethernet · Резерв готов" : eth.state === "down" ? "Ethernet · Недоступен" : "Ethernet · Неизвестно")
        : "Резервного канала нет";

    return `<section class="view overview v040-overview">
      ${!telemetry.trusted ? `<div class="integrity-banner ${escV040(telemetry.tone)}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><strong>${escV040(telemetry.label)}</strong><span>${escV040(telemetry.detail)}. WAN не трактуется как нормальный до восстановления телеметрии.</span></div></div>` : ""}

      <article class="card v040-hero">
        <div class="v040-hero-head">
          <div><span class="label">Интернет</span><div class="hero-value ${escV040(internet.tone)}"><span class="status-dot"></span>${escV040(internet.label)}</div><small>Основной канал · ${escV040(activeRole === "ethernet" ? "Ethernet" : activeRole === "lte" ? "LTE" : "Нет")}</small></div>
          <div class="v040-fresh ${escV040(telemetry.tone)}"><ha-icon icon="mdi:clock-outline"></ha-icon>${escV040(telemetry.age === null ? "Свежесть неизвестна" : `Обновлено ${Math.round(telemetry.age)} с назад`)}</div>
        </div>

        <div class="v040-live-map ${escV040(activeTone)}">
          <div class="v040-router"><ha-icon icon="mdi:router-network"></ha-icon><strong>Keenetic</strong></div>
          <div class="v040-flow"><span></span><span></span><span></span></div>
          <div class="v040-active-node"><ha-icon icon="${activeIcon}"></ha-icon><strong>${escV040(activeLabel)}</strong><small>${escV040(activeSub)}</small></div>
          <div class="v040-flow"><span></span><span></span><span></span></div>
          <div class="v040-internet"><ha-icon icon="mdi:web"></ha-icon><strong>Интернет</strong></div>
        </div>

        <div class="v040-reserve ${activeRole ? "" : "bad"}"><span>Резервный канал</span><strong>${escV040(reserveLabel)}</strong>${activeRole === "ethernet" ? `<small>${escV040(this._display("lte_operator", "—"))} · ${escV040(this._display("lte_primary_band", "—"))} · RSRP ${escV040(this._display("lte_rsrp", "—"))}</small>` : ""}${activeRole === "lte" ? `<small>WAN IP ${escV040(this._display("ethernet_wan_ipv4", "—"))} · Link ${escV040(this._display("ethernet_link_speed", "—"))}</small>` : ""}</div>

        <div class="v040-kpis">${this._metric(activeRole === "lte" ? "lte_ping" : "ethernet_ping", "Ping")}${this._metric(activeRole === "lte" ? "lte_packet_loss" : "ethernet_packet_loss", "Потеря пакетов")}<div class="metric"><span>Телеметрия</span><strong>${escV040(telemetry.age === null ? "—" : `${Math.round(telemetry.age)} с`)}</strong></div></div>
      </article>

      <article class="card v040-section">
        <div class="section-heading"><div><ha-icon icon="mdi:wan"></ha-icon><h2>Каналы</h2></div></div>
        <div class="v040-channel-grid">
          <div class="v040-channel ${active === "ethernet" ? "selected" : ""}"><div class="card-title"><div><ha-icon icon="mdi:ethernet"></ha-icon><strong>Ethernet</strong></div>${this._statusPill(active === "ethernet" ? "Активен" : eth.label, active === "ethernet" ? "ok" : eth.tone)}</div><div class="big-rates"><span><small>RX</small>${escV040(this._display("ethernet_rx_mbps", "—"))}</span><span><small>TX</small>${escV040(this._display("ethernet_tx_mbps", "—"))}</span></div><div class="mini-grid">${this._metric("ethernet_wan_ipv4", "WAN IP")}${this._metric("ethernet_link_speed", "Link")}${this._metric("ethernet_interface_uptime", "Uptime")}${this._metric("ethernet_packet_loss", "Loss")}</div></div>
          <div class="v040-channel ${active === "lte" ? "selected" : ""}"><div class="card-title"><div><ha-icon icon="mdi:signal-4g"></ha-icon><strong>LTE</strong></div>${this._statusPill(active === "lte" ? "Активен" : lte.state === "up" ? "Резерв готов" : lte.label, active === "lte" ? "ok" : lte.tone)}</div><div class="signal-summary"><span>Сигнал</span><strong class="${escV040(signal.tone)}">${escV040(signal.label)}</strong><small>${escV040(this._display("lte_operator", "—"))} · ${escV040(this._display("lte_network_type", "—"))}</small></div><div class="mini-grid">${this._metric("lte_primary_band", "Band")}${this._metric("lte_rsrp", "RSRP")}${this._metric("lte_sinr", "SINR")}${this._metric("lte_time_today", "LTE сегодня")}</div></div>
        </div>
      </article>

      <article class="card v040-section"><div class="section-heading"><div><ha-icon icon="mdi:swap-horizontal-bold"></ha-icon><h2>Резервирование</h2></div>${this._statusPill(`${switches} сегодня`, Number(switches) > 0 ? "warn" : "neutral", "mdi:counter")}</div><div class="failover-main"><div><span>Последнее переключение</span><strong>${escV040(this._switchDirection())}</strong></div><div><span>Когда</span><strong>${lastSwitch && !this._isUnknownState(lastSwitch) ? escV040(formatAgo(lastSwitch)) : "Неизвестно"}</strong></div></div><div class="reason"><span>Причина</span><strong>${escV040(this._reason())}</strong></div></article>

      <article class="card v040-section"><div class="section-heading"><div><ha-icon icon="mdi:chart-timeline-variant"></ha-icon><h2>Трафик</h2></div></div><div class="v040-traffic-grid"><div><span>Текущая скорость</span><strong>↓ ${escV040(this._display("active_rx_mbps", "—"))} · ↑ ${escV040(this._display("active_tx_mbps", "—"))}</strong><small>${escV040(activeRole === "ethernet" ? "Ethernet активен" : activeRole === "lte" ? "LTE активен" : "Нет активного канала")}</small></div><div><span>Трафик сегодня</span><strong>${escV040(this._display("ethernet_total_daily", "—"))}</strong><small>Ethernet · LTE ${escV040(this._display("lte_total_daily", "—"))}</small></div><div><span>Трафик за месяц</span><strong>${escV040(this._display("ethernet_total_monthly", "—"))}</strong><small>Ethernet · LTE ${escV040(this._display("lte_total_monthly", "—"))}</small></div></div></article>
    </section>`;
  };

  const renderBaseV040 = BASE_V040.prototype._render;
  BASE_V040.prototype._render = function (...args) {
    renderBaseV040.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-keenetic-v040]")) return;
    const style = document.createElement("style");
    style.dataset.keeneticV040 = "true";
    style.textContent = `
      .v040-overview{gap:12px}.v040-hero,.v040-section{padding:14px}.v040-hero-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.v040-hero-head small{color:var(--kp-muted);font-size:10px}.v040-fresh{display:flex;align-items:center;gap:4px;font-size:9px;font-weight:700;padding:6px 8px;border-radius:999px;background:color-mix(in srgb,var(--kp-grey) 8%,transparent)}.v040-fresh.ok{color:var(--kp-green);background:color-mix(in srgb,var(--kp-green) 9%,transparent)}.v040-fresh.bad{color:var(--kp-red);background:color-mix(in srgb,var(--kp-red) 9%,transparent)}.v040-fresh.warn{color:var(--kp-yellow)}.v040-fresh ha-icon{--mdc-icon-size:14px}
      .v040-live-map{margin:15px 0 10px;display:grid;grid-template-columns:minmax(68px,1fr) 36px minmax(92px,1.3fr) 36px minmax(64px,.9fr);align-items:center;gap:3px}.v040-router,.v040-active-node,.v040-internet{min-width:0;text-align:center;border-radius:16px;padding:10px 6px;background:color-mix(in srgb,var(--primary-text-color) 3%,transparent)}.v040-router ha-icon,.v040-active-node ha-icon,.v040-internet ha-icon{--mdc-icon-size:28px;display:block;margin:0 auto 4px}.v040-router strong,.v040-active-node strong,.v040-active-node small,.v040-internet strong{display:block}.v040-router strong,.v040-internet strong{font-size:10px}.v040-active-node strong{font-size:13px}.v040-active-node small{margin-top:3px;color:var(--kp-muted);font-size:8px;line-height:1.25}.v040-live-map.ok .v040-active-node,.v040-live-map.ok .v040-internet{color:var(--kp-green);background:color-mix(in srgb,var(--kp-green) 8%,transparent)}.v040-live-map.blue .v040-active-node,.v040-live-map.blue .v040-internet{color:var(--kp-blue);background:color-mix(in srgb,var(--kp-blue) 8%,transparent)}.v040-live-map.bad .v040-active-node,.v040-live-map.bad .v040-internet{color:var(--kp-red);background:color-mix(in srgb,var(--kp-red) 7%,transparent)}
      .v040-flow{display:flex;align-items:center;justify-content:center;gap:2px;overflow:hidden}.v040-flow span{width:6px;height:6px;border-radius:50%;background:var(--kp-green);animation:v040-flow 1.2s linear infinite}.v040-live-map.blue .v040-flow span{background:var(--kp-blue)}.v040-live-map.bad .v040-flow span{background:var(--kp-red);animation:none;opacity:.4}.v040-flow span:nth-child(2){animation-delay:.2s}.v040-flow span:nth-child(3){animation-delay:.4s}@keyframes v040-flow{0%,100%{opacity:.2;transform:translateX(0)}50%{opacity:1;transform:translateX(2px)}}
      .v040-reserve{margin:5px 0 10px;padding:8px 10px;border-radius:13px;background:color-mix(in srgb,var(--kp-blue) 6%,transparent)}.v040-reserve span,.v040-reserve strong,.v040-reserve small{display:block}.v040-reserve span{font-size:8px;color:var(--kp-muted)}.v040-reserve strong{font-size:11px}.v040-reserve small{margin-top:2px;font-size:8px;color:var(--kp-muted)}.v040-reserve.bad{background:color-mix(in srgb,var(--kp-red) 6%,transparent);color:var(--kp-red)}.v040-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.v040-channel-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.v040-channel{border:1px solid var(--kp-border);border-radius:16px;padding:10px;background:color-mix(in srgb,var(--primary-text-color) 2%,transparent)}.v040-channel.selected{border-color:color-mix(in srgb,var(--kp-blue) 55%,var(--kp-border));background:color-mix(in srgb,var(--kp-blue) 5%,transparent)}.v040-traffic-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:10px}.v040-traffic-grid>div{min-width:0;padding:9px;border-radius:13px;background:color-mix(in srgb,var(--primary-text-color) 3.5%,transparent)}.v040-traffic-grid span,.v040-traffic-grid strong,.v040-traffic-grid small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v040-traffic-grid span{font-size:8px;color:var(--kp-muted)}.v040-traffic-grid strong{margin-top:2px;font-size:11px}.v040-traffic-grid small{margin-top:2px;font-size:8px;color:var(--kp-muted)}
      @media(max-width:430px){.v040-live-map{grid-template-columns:66px 24px minmax(82px,1fr) 24px 58px}.v040-flow span{width:4px;height:4px}.v040-router,.v040-active-node,.v040-internet{padding:8px 4px}.v040-router ha-icon,.v040-active-node ha-icon,.v040-internet ha-icon{--mdc-icon-size:24px}.v040-channel-grid{grid-template-columns:1fr}.v040-traffic-grid{grid-template-columns:1fr}}
    `;
    root.append(style);
  };
}
