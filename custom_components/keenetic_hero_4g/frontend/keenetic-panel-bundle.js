// GENERATED FILE. DO NOT EDIT DIRECTLY.
// Keenetic Hero 4G+ autonomous UI 1.0.0 production bundle.
// One active shell: keenetic-hero-app-panel-v100.

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-panel.js
(() => {
const BUNDLED_PANEL_CSS = ":host { display:block; min-height:100%; color:var(--primary-text-color); --kp-green:#36b37e; --kp-yellow:#d8a400; --kp-red:#d94b4b; --kp-grey:#7f8c99; --kp-blue:var(--primary-color,#03a9f4); --kp-surface:var(--ha-card-background,var(--card-background-color,#fff)); --kp-border:color-mix(in srgb,var(--primary-text-color) 11%,transparent); --kp-muted:var(--secondary-text-color,#6b7280); }\n* { box-sizing:border-box; }\nbutton { font:inherit; }\n.shell { width:min(100%,1100px); margin:0 auto; padding:12px max(12px,env(safe-area-inset-right)) calc(88px + env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left)); }\n.app-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin:2px 2px 12px; }\n.eyebrow { font-size:11px; color:var(--kp-muted); font-weight:700; letter-spacing:.06em; text-transform:uppercase; }\nh1 { font-size:23px; margin:3px 0 1px; line-height:1.15; }\n.subline { font-size:12px; color:var(--kp-muted); }\n.telemetry-chip { max-width:145px; display:flex; gap:6px; align-items:center; padding:7px 9px; border-radius:14px; font-size:11px; font-weight:700; background:color-mix(in srgb,var(--kp-grey) 10%,var(--kp-surface)); border:1px solid var(--kp-border); }\n.telemetry-chip ha-icon { --mdc-icon-size:17px; }\n.telemetry-chip.ok { color:var(--kp-green); background:color-mix(in srgb,var(--kp-green) 10%,var(--kp-surface)); }\n.telemetry-chip.warn { color:var(--kp-yellow); background:color-mix(in srgb,var(--kp-yellow) 10%,var(--kp-surface)); }\n.telemetry-chip.bad { color:var(--kp-red); background:color-mix(in srgb,var(--kp-red) 10%,var(--kp-surface)); }\n.view { display:grid; gap:10px; }\n.card { background:var(--kp-surface); border:1px solid var(--kp-border); border-radius:20px; box-shadow:0 3px 18px color-mix(in srgb,#000 7%,transparent); }\n.hero-card { padding:14px; }\n.hero-top { display:grid; grid-template-columns:1.15fr .85fr; gap:12px; align-items:end; }\n.label { display:block; color:var(--kp-muted); font-size:12px; font-weight:650; margin-bottom:2px; }\n.hero-value { display:flex; align-items:center; gap:7px; font-size:28px; font-weight:800; letter-spacing:-.02em; }\n.hero-value.ok { color:var(--kp-green); }\n.hero-value.bad { color:var(--kp-red); }\n.hero-value.unknown { color:var(--kp-grey); }\n.status-dot { width:10px; height:10px; border-radius:50%; background:currentColor; box-shadow:0 0 0 4px color-mix(in srgb,currentColor 12%,transparent); }\n.hero-top small { display:block; color:var(--kp-muted); font-size:10px; margin-top:2px; }\n.active-channel { text-align:right; }\n.active-channel > strong { font-size:24px; display:block; }\n.unknown-text { color:var(--kp-grey); }\n.rate-row { display:flex; justify-content:flex-end; gap:7px; font-size:10px; color:var(--kp-muted); margin-top:2px; }\n.network-map { margin-top:12px; padding:8px 8px 6px; border-radius:16px; background:color-mix(in srgb,var(--primary-text-color) 3%,transparent); display:grid; justify-items:center; }\n.node { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:700; }\n.node ha-icon { --mdc-icon-size:16px; }\n.internet-node.ok { color:var(--kp-green); }\n.internet-node.bad { color:var(--kp-red); }\n.internet-node.unknown { color:var(--kp-grey); }\n.trunk { width:2px; height:8px; background:var(--kp-border); }\n.branches { position:relative; width:100%; display:grid; grid-template-columns:1fr 1fr; gap:10px; }\n.branches:before { content:\"\"; position:absolute; top:0; left:25%; right:25%; height:2px; background:var(--kp-border); }\n.branch { padding-top:8px; display:grid; justify-items:center; gap:1px; color:var(--kp-grey); position:relative; }\n.branch .branch-line { position:absolute; top:0; width:2px; height:8px; background:var(--kp-border); }\n.branch ha-icon { --mdc-icon-size:17px; }\n.branch b { font-size:11px; }\n.branch small { font-size:9px; }\n.branch.active.ok { color:var(--kp-green); }\n.branch.active.warn { color:var(--kp-yellow); }\n.branch.active.bad { color:var(--kp-red); }\n.router-node { margin-top:5px; display:flex; align-items:center; gap:4px; color:var(--kp-muted); font-size:10px; }\n.router-node ha-icon { --mdc-icon-size:15px; }\n.integrity-banner { display:flex; gap:9px; align-items:center; padding:10px 12px; border-radius:16px; border:1px solid var(--kp-border); background:var(--kp-surface); }\n.integrity-banner ha-icon { --mdc-icon-size:22px; }\n.integrity-banner strong,.integrity-banner span { display:block; }\n.integrity-banner strong { font-size:13px; }\n.integrity-banner span { font-size:10px; color:var(--kp-muted); }\n.integrity-banner.bad ha-icon { color:var(--kp-red); }\n.integrity-banner.warn ha-icon { color:var(--kp-yellow); }\n.integrity-banner.unknown ha-icon { color:var(--kp-grey); }\n.wan-pair { display:grid; grid-template-columns:1fr 1fr; gap:10px; }\n.channel-card { padding:12px; min-width:0; }\n.channel-card.selected { border-color:color-mix(in srgb,var(--kp-blue) 65%,var(--kp-border)); box-shadow:0 0 0 1px color-mix(in srgb,var(--kp-blue) 30%,transparent),0 4px 20px color-mix(in srgb,var(--kp-blue) 10%,transparent); }\n.card-title,.section-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; }\n.card-title > div,.section-heading > div { display:flex; align-items:center; gap:6px; min-width:0; }\n.card-title ha-icon,.section-heading ha-icon { --mdc-icon-size:19px; color:var(--kp-blue); }\n.card-title strong { font-size:13px; }\n.section-heading h2 { margin:0; font-size:17px; }\n.pill { display:inline-flex; align-items:center; gap:2px; white-space:nowrap; font-size:9px; border-radius:999px; padding:3px 6px; background:color-mix(in srgb,var(--kp-grey) 9%,transparent); color:var(--kp-grey); }\n.pill ha-icon { --mdc-icon-size:12px; color:currentColor; }\n.pill.ok { color:var(--kp-green); background:color-mix(in srgb,var(--kp-green) 10%,transparent); }\n.pill.warn { color:var(--kp-yellow); background:color-mix(in srgb,var(--kp-yellow) 10%,transparent); }\n.pill.bad { color:var(--kp-red); background:color-mix(in srgb,var(--kp-red) 10%,transparent); }\n.big-rates { display:grid; grid-template-columns:1fr 1fr; gap:5px; margin:10px 0 8px; }\n.big-rates span { min-width:0; font-size:12px; font-weight:750; }\n.big-rates small { display:block; font-size:8px; color:var(--kp-muted); }\n.mini-grid,.radio-grid,.detail-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:5px; }\n.radio-grid { grid-template-columns:repeat(2,minmax(0,1fr)); margin:7px 0; }\n.metric { min-width:0; border-radius:11px; padding:6px 7px; background:color-mix(in srgb,var(--primary-text-color) 3.5%,transparent); cursor:default; outline:none; }\n.metric:focus { box-shadow:0 0 0 2px var(--kp-blue); }\n.metric span,.metric strong,.metric small { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }\n.metric span { font-size:8px; color:var(--kp-muted); }\n.metric strong { font-size:10.5px; margin-top:1px; }\n.metric small { font-size:8px; color:var(--kp-muted); }\n.metric-unknown strong { color:var(--kp-grey); font-weight:600; }\n.signal-summary { display:grid; grid-template-columns:auto 1fr; gap:0 5px; align-items:baseline; margin:8px 0 5px; }\n.signal-summary span { font-size:8px; color:var(--kp-muted); }\n.signal-summary strong { font-size:12px; }\n.signal-summary small { grid-column:1 / -1; font-size:9px; color:var(--kp-muted); }\n.signal-summary .ok,.signal-banner.ok strong { color:var(--kp-green); }\n.signal-summary .warn,.signal-banner.warn strong { color:var(--kp-yellow); }\n.signal-summary .bad,.signal-banner.bad strong { color:var(--kp-red); }\n.signal-summary .unknown,.signal-banner.unknown strong { color:var(--kp-grey); }\n.failover-strip { padding:12px; }\n.failover-main { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }\n.failover-main div,.reason { min-width:0; }\n.failover-main span,.reason span { display:block; font-size:9px; color:var(--kp-muted); }\n.failover-main strong,.reason strong { font-size:12px; display:block; }\n.failover-main small { color:var(--kp-muted); font-size:8px; }\n.reason { margin-top:7px; padding-top:7px; border-top:1px solid var(--kp-border); }\n.detail-card,.traffic-summary,.chart-card,.failover-hero,.event-card,.system-hero,.diagnostics-card,.diagnostic-actions { padding:14px; }\n.detail-grid { margin-top:10px; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; }\n.detail-grid .metric { padding:9px; }\n.detail-grid .metric span { font-size:10px; }\n.detail-grid .metric strong { font-size:12px; }\n.signal-banner { margin-top:10px; border-radius:14px; padding:9px 10px; background:color-mix(in srgb,var(--kp-grey) 6%,transparent); }\n.signal-banner span,.signal-banner strong,.signal-banner small { display:block; }\n.signal-banner span { font-size:9px; color:var(--kp-muted); }\n.signal-banner strong { font-size:16px; }\n.signal-banner small { font-size:9px; color:var(--kp-muted); }\n.hint { margin:0 5px; color:var(--kp-muted); font-size:10px; }\n.period-switch { display:flex; gap:3px; }\n.period { border:1px solid var(--kp-border); background:transparent; color:var(--kp-muted); border-radius:999px; padding:4px 8px; font-size:10px; }\n.period.selected { background:color-mix(in srgb,var(--kp-blue) 14%,transparent); color:var(--kp-blue); border-color:color-mix(in srgb,var(--kp-blue) 40%,var(--kp-border)); }\n.traffic-totals { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:11px; }\n.traffic-totals > div { padding:10px; border-radius:14px; background:color-mix(in srgb,var(--primary-text-color) 3.5%,transparent); }\n.traffic-totals span,.traffic-totals strong,.traffic-totals small { display:block; }\n.traffic-totals span { font-size:9px; color:var(--kp-muted); }\n.traffic-totals strong { font-size:15px; margin:2px 0; }\n.traffic-totals small { font-size:9px; color:var(--kp-muted); }\n.live-rate { color:var(--kp-muted); font-size:10px; text-align:right; }\n.chart-wrap { margin-top:8px; }\n.chart-wrap svg { width:100%; height:auto; max-height:180px; }\n.axis { stroke:var(--kp-border); stroke-width:1; }\n.series { fill:none; stroke-width:3; vector-effect:non-scaling-stroke; stroke-linecap:round; stroke-linejoin:round; }\n.series-0 { stroke:var(--kp-blue); }\n.series-1 { stroke:var(--kp-green); }\n.chart-legend { display:flex; gap:12px; align-items:center; font-size:9px; color:var(--kp-muted); }\n.chart-legend span { display:flex; align-items:center; gap:4px; }\n.chart-legend i { width:12px; height:3px; border-radius:3px; }\n.legend-0 { background:var(--kp-blue); }\n.legend-1 { background:var(--kp-green); }\n.chart-legend .scale { margin-left:auto; }\n.chart-empty { min-height:110px; display:flex; align-items:center; justify-content:center; gap:6px; color:var(--kp-muted); font-size:12px; }\n.failover-kpis { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px; }\n.failover-kpis > div { padding:10px; border-radius:14px; background:color-mix(in srgb,var(--primary-text-color) 3.5%,transparent); }\n.failover-kpis span,.failover-kpis strong,.failover-kpis small { display:block; }\n.failover-kpis span { color:var(--kp-muted); font-size:9px; }\n.failover-kpis strong { font-size:13px; }\n.failover-kpis small { color:var(--kp-muted); font-size:9px; }\n.event-list { margin-top:8px; }\n.event { display:grid; grid-template-columns:48px 1fr; gap:7px; padding:9px 0; border-top:1px solid var(--kp-border); }\n.event:first-child { border-top:0; }\n.event-time { font-weight:800; color:var(--kp-blue); font-size:12px; }\n.event strong,.event span { display:block; }\n.event strong { font-size:12px; }\n.event span { color:var(--kp-muted); font-size:9px; margin-top:2px; }\n.system-meta { display:flex; gap:8px; color:var(--kp-muted); font-size:10px; margin-top:5px; }\n.integrity-card { padding:13px; }\n.integrity-card > div { display:flex; gap:8px; align-items:center; }\n.integrity-card ha-icon { --mdc-icon-size:24px; }\n.integrity-card strong,.integrity-card span { display:block; }\n.integrity-card strong { font-size:14px; }\n.integrity-card span,.integrity-card > small { color:var(--kp-muted); font-size:9px; }\n.integrity-card.ok ha-icon { color:var(--kp-green); }\n.integrity-card.warn ha-icon { color:var(--kp-yellow); }\n.integrity-card.bad ha-icon { color:var(--kp-red); }\n.diag-list { margin-top:8px; }\n.diag-row { display:grid; grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr); gap:8px; padding:8px 0; border-top:1px solid var(--kp-border); outline:none; }\n.diag-row:first-child { border-top:0; }\n.diag-row > div:last-child { text-align:right; }\n.diag-row strong,.diag-row small,.diag-row span { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }\n.diag-row strong { font-size:11px; }\n.diag-row small { font-size:8px; color:var(--kp-muted); }\n.source-tag { display:inline-block !important; width:max-content; margin-left:auto; padding:1px 5px; border-radius:999px; background:color-mix(in srgb,var(--kp-blue) 10%,transparent); color:var(--kp-blue); font-size:8px; }\n.diag-row.warn > div:last-child strong { color:var(--kp-yellow); }\n.diag-row.bad > div:last-child strong { color:var(--kp-red); }\n.diag-row.neutral > div:last-child strong { color:var(--kp-grey); }\n.diagnostic-actions { display:flex; justify-content:space-between; gap:10px; align-items:center; }\n.diagnostic-actions > div { display:flex; gap:8px; align-items:center; }\n.diagnostic-actions ha-icon { color:var(--kp-blue); }\n.diagnostic-actions strong,.diagnostic-actions span { display:block; }\n.diagnostic-actions strong { font-size:12px; }\n.diagnostic-actions span { font-size:9px; color:var(--kp-muted); }\n.diagnostic-actions button { border:1px solid var(--kp-border); background:color-mix(in srgb,var(--kp-blue) 10%,transparent); color:var(--kp-blue); border-radius:12px; padding:8px 10px; }\n.bottom-nav { position:fixed; left:50%; transform:translateX(-50%); bottom:max(8px,env(safe-area-inset-bottom)); width:min(calc(100% - 20px),520px); display:grid; grid-template-columns:repeat(5,1fr); padding:6px; gap:2px; background:color-mix(in srgb,var(--kp-surface) 92%,transparent); backdrop-filter:blur(18px); border:1px solid var(--kp-border); border-radius:20px; box-shadow:0 8px 28px color-mix(in srgb,#000 18%,transparent); z-index:10; }\n.bottom-nav button { border:0; background:transparent; color:var(--kp-muted); border-radius:14px; min-height:48px; display:grid; place-items:center; align-content:center; gap:1px; padding:4px 2px; }\n.bottom-nav button.active { color:var(--kp-blue); background:color-mix(in srgb,var(--kp-blue) 10%,transparent); }\n.bottom-nav ha-icon { --mdc-icon-size:21px; }\n.bottom-nav span { font-size:9px; font-weight:700; }\n.loading,.fatal { min-height:60vh; display:flex; align-items:center; justify-content:center; gap:8px; flex-direction:column; text-align:center; color:var(--kp-muted); }\n.fatal ha-icon { color:var(--kp-red); --mdc-icon-size:40px; }\n.fatal strong { color:var(--primary-text-color); }\n.fatal button { border:0; border-radius:12px; padding:8px 12px; background:var(--kp-blue); color:var(--text-primary-color,#fff); }\n.spin { animation:spin 1s linear infinite; }\n@keyframes spin { to { transform:rotate(360deg); } }\n.bad-text { color:var(--kp-red); }\n@media (min-width:760px) {\n  .view { grid-template-columns:repeat(2,minmax(0,1fr)); }\n  .overview .hero-card,.overview .integrity-banner,.overview .wan-pair,.overview .failover-strip,.traffic-summary,.failover-hero,.system-hero,.integrity-card,.diagnostic-actions,.hint { grid-column:1 / -1; }\n  .wan-pair { grid-template-columns:1fr 1fr; }\n  .detail-card,.chart-card,.event-card,.diagnostics-card { align-self:start; }\n  .detail-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }\n}\n@media (max-width:390px) {\n  .shell { padding-left:8px; padding-right:8px; }\n  .app-header { align-items:center; }\n  .telemetry-chip { max-width:118px; padding:6px 7px; }\n  .telemetry-chip span { font-size:9px; }\n  h1 { font-size:20px; }\n  .hero-value { font-size:24px; }\n  .wan-pair { gap:7px; }\n  .channel-card { padding:9px; }\n  .pill { max-width:76px; overflow:hidden; text-overflow:ellipsis; }\n}\n@media (max-width:340px) { .wan-pair { grid-template-columns:1fr; } }\n@media (prefers-reduced-motion:reduce) { .spin { animation:none; } }\n";
const PANEL_VERSION = "0.9.0";
const UNKNOWN = new Set(["unknown", "unavailable", "none", "null", ""]);

const ROLE_LABELS = {
  internet_connectivity: "Интернет",
  router_connectivity: "Связь с роутером",
  router_uptime: "Uptime роутера",
  active_wan: "Активный WAN",
  active_rx_mbps: "Активный RX",
  active_tx_mbps: "Активный TX",
  ethernet_connected: "Ethernet WAN",
  ethernet_rx_mbps: "Ethernet RX",
  ethernet_tx_mbps: "Ethernet TX",
  ethernet_rx_total: "Ethernet RX total",
  ethernet_tx_total: "Ethernet TX total",
  ethernet_rx_total_gib: "Ethernet RX всего",
  ethernet_tx_total_gib: "Ethernet TX всего",
  ethernet_total_daily: "Ethernet сегодня",
  ethernet_total_monthly: "Ethernet месяц",
  ethernet_ping: "Пинг Ethernet",
  ethernet_packet_loss: "Потеря пакетов Ethernet",
  ethernet_link_speed: "Скорость Ethernet-link",
  ethernet_interface_uptime: "Uptime Ethernet",
  ethernet_wan_ipv4: "Ethernet WAN IPv4",
  lte_connected: "LTE",
  lte_rx_mbps: "LTE RX",
  lte_tx_mbps: "LTE TX",
  lte_rx_total: "LTE RX total",
  lte_tx_total: "LTE TX total",
  lte_rx_total_gb: "LTE RX всего",
  lte_tx_total_gb: "LTE TX всего",
  lte_total_daily: "LTE сегодня",
  lte_total_monthly: "LTE месяц",
  lte_ping: "Пинг LTE",
  lte_packet_loss: "Потеря пакетов LTE",
  lte_time_today: "Время через LTE сегодня",
  lte_operator: "Оператор LTE",
  lte_network_type: "Тип мобильной сети",
  lte_primary_band: "Основной диапазон LTE",
  lte_carriers: "Агрегация LTE",
  lte_bandwidth: "Ширина канала LTE",
  lte_enb_id: "eNB ID",
  lte_sector_id: "Sector ID",
  lte_phy_cell_id: "Physical Cell ID",
  lte_earfcn: "EARFCN",
  lte_modem_temperature: "Температура LTE-модема",
  lte_modem_model: "Модель LTE-модема",
  lte_modem_firmware: "Прошивка LTE-модема",
  lte_sim_state: "Состояние SIM",
  lte_wan_ipv4: "LTE WAN IPv4",
  lte_interface_uptime: "Uptime LTE",
  lte_rssi: "RSSI",
  lte_rsrp: "RSRP",
  lte_rsrq: "RSRQ",
  lte_sinr: "SINR",
  last_wan_switch: "Последнее переключение WAN",
  last_wan_switch_reason: "Причина переключения",
  wan_switches_today: "Переключений сегодня",
  cpu_load: "CPU",
  memory_usage: "RAM",
  firmware_version: "KeeneticOS",
};

const SOURCE_LABELS = {
  rci: "RCI",
  snmp: "SNMP",
  template: "Template",
  utility_meter: "Utility Meter",
  ndms2: "NDMS2 Router",
  external_probe: "Внешняя проверка",
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatAgo(dateValue) {
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

function formatClock(dateValue) {
  if (!dateValue) return "Неизвестно";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Неизвестно";
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

class KeeneticHeroPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._panel = null;
    this._bootstrap = null;
    this._bootstrapLoading = false;
    this._bootstrapError = null;
    this._refreshTimer = null;
    this._renderQueued = false;
    this._view = this._viewFromLocation();
    this._trafficPeriod = "24h";
    this._trafficHistory = {};
    this._trafficLoading = false;
    this._trafficError = null;
    this._failoverHistory = [];
    this._failoverLoading = false;
    this._failoverError = null;
    this._hashListener = () => {
      this._view = this._viewFromLocation();
      this._scheduleRender();
      this._loadViewData();
    };
  }

  set hass(value) {
    this._hass = value;
    if (!this._bootstrap && !this._bootstrapLoading) this._loadBootstrap();
    this._scheduleRender();
  }

  set panel(value) {
    this._panel = value;
    if (!location.hash && value?.config?.preferred_view) {
      this._view = value.config.preferred_view;
    }
    this._scheduleRender();
  }

  set route(value) {
    this._route = value;
  }

  connectedCallback() {
    window.addEventListener("hashchange", this._hashListener);
    this._refreshTimer = window.setInterval(() => this._loadBootstrap(true), 30000);
    this._scheduleRender();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this._hashListener);
    if (this._refreshTimer) window.clearInterval(this._refreshTimer);
  }

  _viewFromLocation() {
    const value = (location.hash || "#overview").slice(1).toLowerCase();
    return ["overview", "wan", "traffic", "failover", "system", "diagnostics"].includes(value)
      ? value
      : "overview";
  }

  _scheduleRender() {
    if (this._renderQueued) return;
    this._renderQueued = true;
    queueMicrotask(() => {
      this._renderQueued = false;
      this._render();
    });
  }

  async _loadBootstrap(silent = false) {
    if (!this._hass || this._bootstrapLoading) return;
    this._bootstrapLoading = true;
    if (!silent) this._bootstrapError = null;
    try {
      const config = this._panel?.config || {};
      this._bootstrap = await this._hass.callWS({
        type: "keenetic_hero_4g/panel/bootstrap",
        ...(config.entry_id ? { entry_id: config.entry_id } : {}),
      });
      this._bootstrapError = null;
      this._loadViewData();
    } catch (err) {
      this._bootstrapError = err?.message || String(err);
    } finally {
      this._bootstrapLoading = false;
      this._scheduleRender();
    }
  }

  _entities() {
    return this._bootstrap?.entities || {};
  }

  _sources() {
    return this._bootstrap?.sources || {};
  }

  _entityId(role) {
    return this._entities()[role] || null;
  }

  _stateObj(role) {
    const entityId = this._entityId(role);
    return entityId && this._hass ? this._hass.states[entityId] : null;
  }

  _raw(role) {
    return this._stateObj(role)?.state ?? null;
  }

  _isUnknownState(state) {
    if (state === null || state === undefined) return true;
    return UNKNOWN.has(String(state).trim().toLowerCase());
  }

  _display(role, fallback = "Неизвестно") {
    const obj = this._stateObj(role);
    if (!obj || this._isUnknownState(obj.state)) return fallback;
    const unit = obj.attributes?.unit_of_measurement;
    return unit ? `${obj.state} ${unit}` : String(obj.state);
  }

  _numeric(role) {
    const obj = this._stateObj(role);
    if (!obj || this._isUnknownState(obj.state)) return null;
    return numberOrNull(obj.state);
  }

  _connection(role) {
    if (!this._telemetry().trusted && ["ethernet_connected", "lte_connected"].includes(role)) {
      return { state: "unknown", label: "Состояние неизвестно", tone: "unknown" };
    }
    const value = this._raw(role);
    if (this._isUnknownState(value)) {
      return { state: "unknown", label: "Состояние неизвестно", tone: "unknown" };
    }
    const normalized = String(value).trim().toLowerCase();
    if (["on", "up", "true", "connected", "ready", "1"].includes(normalized)) {
      return { state: "up", label: "Подключён", tone: "ok" };
    }
    if (["off", "down", "false", "disconnected", "not-connected", "2"].includes(normalized)) {
      return { state: "down", label: "Недоступен", tone: "bad" };
    }
    return { state: "unknown", label: "Состояние неизвестно", tone: "unknown" };
  }

  _internet() {
    const value = this._raw("internet_connectivity");
    if (this._isUnknownState(value)) {
      return { label: "Неизвестно", tone: "unknown", online: null };
    }
    const normalized = String(value).toLowerCase();
    if (["on", "up", "true", "1", "connected"].includes(normalized)) {
      return { label: "Онлайн", tone: "ok", online: true };
    }
    if (["off", "down", "false", "0", "disconnected"].includes(normalized)) {
      return { label: "Нет доступа", tone: "bad", online: false };
    }
    return { label: "Неизвестно", tone: "unknown", online: null };
  }

  _activeWan() {
    const value = this._raw("active_wan");
    if (this._isUnknownState(value) || !this._telemetry().trusted) return null;
    const normalized = String(value).trim().toLowerCase();
    if (normalized.includes("ethernet")) return "ethernet";
    if (normalized === "lte" || normalized.includes("4g") || normalized.includes("mobile")) return "lte";
    return null;
  }

  _latestRciUpdate() {
    const entities = this._bootstrap?.entities || {};
    const sources = this._bootstrap?.sources || {};
    let latest = null;
    for (const [role, entityId] of Object.entries(entities)) {
      if (sources[role] !== "rci") continue;
      const obj = this._hass?.states?.[entityId];
      if (!obj?.last_updated) continue;
      const date = new Date(obj.last_updated);
      if (Number.isNaN(date.getTime())) continue;
      if (!latest || date > latest) latest = date;
    }
    if (latest) return latest;
    const fallback = this._bootstrap?.telemetry?.latest_rci_state_update;
    if (!fallback) return null;
    const date = new Date(fallback);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  _telemetry() {
    const t = this._bootstrap?.telemetry || {};
    const scan = Number(t.scan_interval_seconds || 30);
    const latest = this._latestRciUpdate();
    const age = latest
      ? Math.max(0, (Date.now() - latest.getTime()) / 1000)
      : null;
    const staleAfter = Math.max(90, scan * 3);
    if (t.last_update_success === false) {
      return {
        trusted: false,
        stale: false,
        tone: "bad",
        label: "Телеметрия недостоверна",
        detail: "Последний RCI-опрос завершился ошибкой",
        age,
      };
    }
    if (age !== null && age > staleAfter) {
      return {
        trusted: false,
        stale: true,
        tone: "warn",
        label: "Данные устарели",
        detail: `Возраст данных ${Math.round(age)} сек`,
        age,
      };
    }
    if (!latest) {
      return {
        trusted: false,
        stale: false,
        tone: "unknown",
        label: "Свежесть неизвестна",
        detail: "Нет метки последнего RCI-обновления",
        age,
      };
    }
    return {
      trusted: true,
      stale: false,
      tone: "ok",
      label: "Телеметрия актуальна",
      detail: `Обновлено ${formatAgo(latest)}`,
      age,
    };
  }

  _reason() {
    const value = this._raw("last_wan_switch_reason");
    if (this._isUnknownState(value)) return "Неизвестно";
    const normalized = String(value).trim().toLowerCase();
    const map = {
      ethernet_link_down: "Ethernet link отключён",
      ethernet_restored: "Ethernet link восстановлен",
      route_changed: "Маршрут WAN изменён",
    };
    return map[normalized] || String(value);
  }

  _switchDirection() {
    const reason = String(this._raw("last_wan_switch_reason") || "").toLowerCase();
    if (reason === "ethernet_link_down") return "Ethernet → LTE";
    if (reason === "ethernet_restored") return "LTE → Ethernet";
    return "Неизвестно";
  }

  _lteSignal() {
    const rsrp = this._numeric("lte_rsrp");
    const rsrq = this._numeric("lte_rsrq");
    const sinr = this._numeric("lte_sinr");
    const scores = [];
    if (rsrp !== null) scores.push(rsrp >= -90 ? 4 : rsrp >= -100 ? 3 : rsrp >= -110 ? 2 : rsrp >= -120 ? 1 : 0);
    if (rsrq !== null) scores.push(rsrq >= -10 ? 4 : rsrq >= -15 ? 3 : rsrq >= -20 ? 2 : 1);
    if (sinr !== null) scores.push(sinr >= 20 ? 4 : sinr >= 13 ? 3 : sinr >= 5 ? 2 : sinr >= 0 ? 1 : 0);
    if (!scores.length) return { label: "Неизвестно", tone: "unknown", score: null };
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (average >= 3.5) return { label: "Отличный", tone: "ok", score: average };
    if (average >= 2.5) return { label: "Хороший", tone: "ok", score: average };
    if (average >= 1.5) return { label: "Удовлетворительный", tone: "warn", score: average };
    return { label: "Слабый", tone: "bad", score: average };
  }

  _metric(role, label, options = {}) {
    const value = this._display(role, "Неизвестно");
    const entity = this._entityId(role);
    const unknown = value === "Неизвестно" || value === "Нет данных";
    const hint = entity ? `data-entity="${esc(entity)}" tabindex="0"` : "";
    return `<div class="metric ${unknown ? "metric-unknown" : ""}" ${hint}>
      <span>${esc(label)}</span><strong>${esc(value)}</strong>
      ${options.sub ? `<small>${esc(options.sub)}</small>` : ""}
    </div>`;
  }

  _statusPill(label, tone, icon = "mdi:circle-medium") {
    return `<span class="pill ${esc(tone)}"><ha-icon icon="${esc(icon)}"></ha-icon>${esc(label)}</span>`;
  }

  _source(role) {
    return SOURCE_LABELS[this._sources()[role]] || this._sources()[role] || "—";
  }

  _renderHeader() {
    const telemetry = this._telemetry();
    const entry = this._bootstrap?.entry || {};
    return `<header class="app-header">
      <div>
        <div class="eyebrow">Network Control Center · Panel v${esc(PANEL_VERSION)}</div>
        <h1>${esc(entry.title || "Keenetic Hero 4G+")}</h1>
        <div class="subline">${esc(entry.model || "Hero 4G+ (KN-2311)")}${entry.hostname ? ` · ${esc(entry.hostname)}` : ""}</div>
      </div>
      <div class="telemetry-chip ${esc(telemetry.tone)}" title="${esc(telemetry.detail)}">
        <ha-icon icon="${telemetry.trusted ? "mdi:shield-check" : telemetry.stale ? "mdi:clock-alert-outline" : "mdi:shield-alert"}"></ha-icon>
        <span>${esc(telemetry.label)}</span>
      </div>
    </header>`;
  }

  _renderOverview() {
    const internet = this._internet();
    const active = this._activeWan();
    const eth = this._connection("ethernet_connected");
    const lte = this._connection("lte_connected");
    const signal = this._lteSignal();
    const lastSwitch = this._stateObj("last_wan_switch")?.state;
    const switches = this._display("wan_switches_today", "0");
    const telemetry = this._telemetry();

    return `<section class="view overview">
      ${!telemetry.trusted ? `<div class="integrity-banner ${esc(telemetry.tone)}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><strong>${esc(telemetry.label)}</strong><span>${esc(telemetry.detail)}. Состояния WAN не трактуются как отказ.</span></div></div>` : ""}

      <div class="hero-card card">
        <div class="hero-top">
          <div>
            <span class="label">Интернет</span>
            <div class="hero-value ${esc(internet.tone)}"><span class="status-dot"></span>${esc(internet.label)}</div>
            <small>Источник: ${esc(this._source("internet_connectivity"))}</small>
          </div>
          <div class="active-channel">
            <span class="label">Активный канал</span>
            <strong class="${active ? "" : "unknown-text"}">${active === "ethernet" ? "Ethernet" : active === "lte" ? "LTE" : "Неизвестно"}</strong>
            <div class="rate-row"><span>↓ ${esc(this._display("active_rx_mbps", "—"))}</span><span>↑ ${esc(this._display("active_tx_mbps", "—"))}</span></div>
          </div>
        </div>
        <div class="network-map" aria-label="Схема активного WAN">
          <div class="node internet-node ${esc(internet.tone)}"><ha-icon icon="mdi:web"></ha-icon><span>Интернет</span></div>
          <div class="trunk"></div>
          <div class="branches">
            <div class="branch ${active === "ethernet" ? "active" : ""} ${esc(eth.tone)}">
              <span class="branch-line"></span><ha-icon icon="mdi:ethernet"></ha-icon><b>Ethernet</b><small>${esc(eth.label)}</small>
            </div>
            <div class="branch ${active === "lte" ? "active" : ""} ${esc(lte.tone)}">
              <span class="branch-line"></span><ha-icon icon="mdi:signal-4g"></ha-icon><b>LTE</b><small>${esc(lte.label)}</small>
            </div>
          </div>
          <div class="router-node"><ha-icon icon="mdi:router-network"></ha-icon>Keenetic</div>
        </div>
      </div>

      <div class="wan-pair">
        <article class="card channel-card ${active === "ethernet" ? "selected" : ""}">
          <div class="card-title"><div><ha-icon icon="mdi:ethernet"></ha-icon><strong>Ethernet WAN</strong></div>${this._statusPill(eth.label, eth.tone, eth.state === "up" ? "mdi:check-circle" : eth.state === "down" ? "mdi:close-circle" : "mdi:help-circle")}</div>
          <div class="big-rates"><span><small>RX</small>${esc(this._display("ethernet_rx_mbps", "—"))}</span><span><small>TX</small>${esc(this._display("ethernet_tx_mbps", "—"))}</span></div>
          <div class="mini-grid">
            ${this._metric("ethernet_ping", "Ping")}
            ${this._metric("ethernet_packet_loss", "Loss")}
            ${this._metric("ethernet_link_speed", "Link")}
            ${this._metric("ethernet_interface_uptime", "Uptime")}
          </div>
        </article>

        <article class="card channel-card ${active === "lte" ? "selected" : ""}">
          <div class="card-title"><div><ha-icon icon="mdi:signal-4g"></ha-icon><strong>LTE резерв</strong></div>${this._statusPill(lte.label, lte.tone, lte.state === "up" ? "mdi:check-circle" : lte.state === "down" ? "mdi:close-circle" : "mdi:help-circle")}</div>
          <div class="signal-summary"><span>Сигнал</span><strong class="${esc(signal.tone)}">${esc(signal.label)}</strong><small>${esc(this._display("lte_operator", "Оператор неизвестен"))}</small></div>
          <div class="radio-grid">
            ${this._metric("lte_rssi", "RSSI")}
            ${this._metric("lte_rsrp", "RSRP")}
            ${this._metric("lte_rsrq", "RSRQ")}
            ${this._metric("lte_sinr", "SINR")}
          </div>
          <div class="mini-grid">
            ${this._metric("lte_ping", "Ping")}
            ${this._metric("lte_packet_loss", "Loss")}
            ${this._metric("lte_time_today", "LTE сегодня")}
            ${this._metric("lte_network_type", "Сеть")}
          </div>
        </article>
      </div>

      <article class="card failover-strip">
        <div class="card-title"><div><ha-icon icon="mdi:swap-horizontal-bold"></ha-icon><strong>Последнее переключение</strong></div>${this._statusPill(`${switches} сегодня`, Number(switches) > 0 ? "warn" : "neutral", "mdi:counter")}</div>
        <div class="failover-main">
          <div><span>Направление</span><strong>${esc(this._switchDirection())}</strong></div>
          <div><span>Когда</span><strong>${lastSwitch && !this._isUnknownState(lastSwitch) ? esc(formatAgo(lastSwitch)) : "Неизвестно"}</strong><small>${lastSwitch && !this._isUnknownState(lastSwitch) ? esc(formatClock(lastSwitch)) : ""}</small></div>
        </div>
        <div class="reason"><span>Причина</span><strong>${esc(this._reason())}</strong></div>
      </article>
    </section>`;
  }

  _renderWan() {
    const eth = this._connection("ethernet_connected");
    const lte = this._connection("lte_connected");
    const signal = this._lteSignal();
    return `<section class="view">
      <article class="card detail-card">
        <div class="section-heading"><div><ha-icon icon="mdi:ethernet"></ha-icon><h2>Ethernet WAN</h2></div>${this._statusPill(eth.label, eth.tone)}</div>
        <div class="detail-grid">
          ${this._metric("ethernet_ping", "Ping")}
          ${this._metric("ethernet_packet_loss", "Packet loss")}
          ${this._metric("ethernet_rx_mbps", "RX сейчас")}
          ${this._metric("ethernet_tx_mbps", "TX сейчас")}
          ${this._metric("ethernet_link_speed", "Физический link")}
          ${this._metric("ethernet_wan_ipv4", "WAN IPv4")}
          ${this._metric("ethernet_interface_uptime", "Uptime интерфейса")}
          ${this._metric("ethernet_rx_total_gib", "RX всего")}
          ${this._metric("ethernet_tx_total_gib", "TX всего")}
          ${this._metric("ethernet_total_daily", "Трафик сегодня")}
          ${this._metric("ethernet_total_monthly", "Трафик месяц")}
        </div>
      </article>

      <article class="card detail-card">
        <div class="section-heading"><div><ha-icon icon="mdi:signal-4g"></ha-icon><h2>LTE резерв</h2></div>${this._statusPill(lte.label, lte.tone)}</div>
        <div class="signal-banner ${esc(signal.tone)}"><span>Оценка сигнала</span><strong>${esc(signal.label)}</strong><small>Расчёт панели по RSRP / RSRQ / SINR; исходные значения ниже.</small></div>
        <div class="detail-grid">
          ${this._metric("lte_operator", "Оператор")}
          ${this._metric("lte_network_type", "Тип сети")}
          ${this._metric("lte_ping", "Ping")}
          ${this._metric("lte_packet_loss", "Packet loss")}
          ${this._metric("lte_rssi", "RSSI")}
          ${this._metric("lte_rsrp", "RSRP")}
          ${this._metric("lte_rsrq", "RSRQ")}
          ${this._metric("lte_sinr", "SINR")}
          ${this._metric("lte_rx_mbps", "RX сейчас")}
          ${this._metric("lte_tx_mbps", "TX сейчас")}
          ${this._metric("lte_total_daily", "Трафик сегодня")}
          ${this._metric("lte_total_monthly", "Трафик месяц")}
          ${this._metric("lte_time_today", "Время через LTE сегодня")}
          ${this._metric("lte_wan_ipv4", "WAN IPv4")}
          ${this._metric("lte_primary_band", "Основной band")}
          ${this._metric("lte_carriers", "Carrier aggregation")}
          ${this._metric("lte_bandwidth", "Bandwidth")}
          ${this._metric("lte_earfcn", "EARFCN")}
          ${this._metric("lte_enb_id", "eNB")}
          ${this._metric("lte_sector_id", "Sector")}
          ${this._metric("lte_phy_cell_id", "Physical Cell ID")}
          ${this._metric("lte_modem_model", "Модель модема")}
          ${this._metric("lte_modem_firmware", "Прошивка модема")}
          ${this._metric("lte_sim_state", "SIM")}
          ${this._metric("lte_modem_temperature", "Температура модема")}
        </div>
      </article>
      <p class="hint">Long press на фактическом показателе открывает штатный Home Assistant more-info.</p>
    </section>`;
  }

  _historyIds(kind) {
    const roles = kind === "ethernet"
      ? ["ethernet_rx_mbps", "ethernet_tx_mbps"]
      : ["lte_rx_mbps", "lte_tx_mbps"];
    return roles.map((role) => ({ role, entityId: this._entityId(role) })).filter((x) => x.entityId);
  }

  async _loadTrafficHistory() {
    if (!this._hass || !this._bootstrap || this._trafficLoading) return;
    const period = this._trafficPeriod;
    const cacheKey = period;
    if (this._trafficHistory[cacheKey]) return;
    const series = [...this._historyIds("ethernet"), ...this._historyIds("lte")];
    if (!series.length) return;
    this._trafficLoading = true;
    this._trafficError = null;
    this._scheduleRender();
    try {
      const now = new Date();
      const spec = {
        "24h": { ms: 24 * 3600e3, bucket: "5minute" },
        "7d": { ms: 7 * 24 * 3600e3, bucket: "hour" },
        "30d": { ms: 30 * 24 * 3600e3, bucket: "day" },
      }[period];
      const start = new Date(now.getTime() - spec.ms);
      const statisticIds = [...new Set(series.map((item) => item.entityId))];
      const result = await this._hass.callWS({
        type: "recorder/statistics_during_period",
        start_time: start.toISOString(),
        end_time: now.toISOString(),
        statistic_ids: statisticIds,
        period: spec.bucket,
        types: ["mean"],
      });
      this._trafficHistory[cacheKey] = result || {};
    } catch (err) {
      this._trafficError = err?.message || String(err);
    } finally {
      this._trafficLoading = false;
      this._scheduleRender();
    }
  }

  _seriesPoints(entityId) {
    const rows = this._trafficHistory[this._trafficPeriod]?.[entityId] || [];
    return rows
      .map((row) => ({ x: Number(row.start), y: numberOrNull(row.mean) }))
      .filter((p) => Number.isFinite(p.x) && p.y !== null);
  }

  _chart(kind) {
    const ids = this._historyIds(kind);
    if (!ids.length) return `<div class="chart-empty">Нет источников истории</div>`;
    if (this._trafficLoading) return `<div class="chart-empty"><ha-icon icon="mdi:loading" class="spin"></ha-icon> Загрузка истории…</div>`;
    if (this._trafficError) return `<div class="chart-empty bad-text">История недоступна: ${esc(this._trafficError)}</div>`;

    const series = ids.map((item) => ({ ...item, points: this._seriesPoints(item.entityId) }));
    const all = series.flatMap((s) => s.points);
    if (!all.length) return `<div class="chart-empty">Нет статистики за выбранный период</div>`;
    const minX = Math.min(...all.map((p) => p.x));
    const maxX = Math.max(...all.map((p) => p.x));
    const maxY = Math.max(0.01, ...all.map((p) => p.y));
    const width = 760;
    const height = 220;
    const pad = 18;
    const usableW = width - pad * 2;
    const usableH = height - pad * 2;
    const line = (points) => points.map((p) => {
      const x = pad + ((p.x - minX) / Math.max(1, maxX - minX)) * usableW;
      const y = pad + usableH - (p.y / maxY) * usableH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return `<div class="chart-wrap">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="График ${esc(kind)} RX TX">
        <line x1="${pad}" y1="${height-pad}" x2="${width-pad}" y2="${height-pad}" class="axis" />
        <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height-pad}" class="axis" />
        ${series.map((s, index) => `<polyline class="series series-${index}" points="${line(s.points)}" />`).join("")}
      </svg>
      <div class="chart-legend">${series.map((s, index) => `<span><i class="legend-${index}"></i>${s.role.includes("rx") ? "RX" : "TX"}</span>`).join("")}<span class="scale">max ${maxY.toFixed(maxY < 10 ? 2 : 1)} Mbit/s</span></div>
    </div>`;
  }

  _renderTraffic() {
    return `<section class="view">
      <article class="card traffic-summary">
        <div class="section-heading"><div><ha-icon icon="mdi:chart-timeline-variant"></ha-icon><h2>Трафик</h2></div><div class="period-switch">${["24h", "7d", "30d"].map((p) => `<button class="period ${p === this._trafficPeriod ? "selected" : ""}" data-period="${p}">${p === "24h" ? "24 ч" : p === "7d" ? "7 дн" : "30 дн"}</button>`).join("")}</div></div>
        <div class="traffic-totals">
          <div><span>Ethernet сегодня</span><strong>${esc(this._display("ethernet_total_daily", "Неизвестно"))}</strong><small>месяц ${esc(this._display("ethernet_total_monthly", "—"))}</small></div>
          <div><span>LTE сегодня</span><strong>${esc(this._display("lte_total_daily", "Неизвестно"))}</strong><small>месяц ${esc(this._display("lte_total_monthly", "—"))}</small></div>
        </div>
      </article>
      <article class="card chart-card"><div class="card-title"><div><ha-icon icon="mdi:ethernet"></ha-icon><strong>Ethernet RX / TX</strong></div><span class="live-rate">↓ ${esc(this._display("ethernet_rx_mbps", "—"))} · ↑ ${esc(this._display("ethernet_tx_mbps", "—"))}</span></div>${this._chart("ethernet")}</article>
      <article class="card chart-card"><div class="card-title"><div><ha-icon icon="mdi:signal-4g"></ha-icon><strong>LTE RX / TX</strong></div><span class="live-rate">↓ ${esc(this._display("lte_rx_mbps", "—"))} · ↑ ${esc(this._display("lte_tx_mbps", "—"))}</span></div>${this._chart("lte")}</article>
      <article class="card detail-card"><div class="section-heading"><div><ha-icon icon="mdi:counter"></ha-icon><h2>Накопительные счётчики</h2></div></div><div class="detail-grid">
        ${this._metric("ethernet_rx_total_gib", "Ethernet RX всего")}
        ${this._metric("ethernet_tx_total_gib", "Ethernet TX всего")}
        ${this._metric("lte_rx_total_gb", "LTE RX всего")}
        ${this._metric("lte_tx_total_gb", "LTE TX всего")}
      </div></article>
    </section>`;
  }

  async _loadFailoverHistory() {
    if (!this._hass || !this._bootstrap || this._failoverLoading || this._failoverHistory.length) return;
    const entityId = this._entityId("active_wan");
    if (!entityId) return;
    this._failoverLoading = true;
    this._failoverError = null;
    this._scheduleRender();
    try {
      const now = new Date();
      const start = new Date(now.getTime() - 24 * 3600e3);
      const result = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: now.toISOString(),
        entity_ids: [entityId],
        include_start_time_state: true,
        significant_changes_only: true,
        minimal_response: true,
        no_attributes: true,
      });
      const states = result?.[entityId] || [];
      const transitions = [];
      let previous = null;
      for (const row of states) {
        const currentRaw = String(row.s ?? "").toLowerCase();
        const current = currentRaw.includes("ethernet") ? "Ethernet" : currentRaw.includes("lte") ? "LTE" : null;
        if (!current) continue;
        if (previous && current !== previous.value) {
          transitions.push({ from: previous.value, to: current, at: new Date(Number(row.lu) * 1000) });
        }
        previous = { value: current };
      }
      this._failoverHistory = transitions.reverse();
    } catch (err) {
      this._failoverError = err?.message || String(err);
    } finally {
      this._failoverLoading = false;
      this._scheduleRender();
    }
  }

  _eventReason(event, index) {
    if (index !== 0) return "Неизвестно";
    const last = this._stateObj("last_wan_switch")?.state;
    if (!last || this._isUnknownState(last)) return "Неизвестно";
    const lastTime = new Date(last).getTime();
    if (Number.isNaN(lastTime) || Math.abs(lastTime - event.at.getTime()) > 180000) return "Неизвестно";
    return this._reason();
  }

  _renderFailover() {
    const lastSwitch = this._stateObj("last_wan_switch")?.state;
    const switches = this._display("wan_switches_today", "0");
    const lteTime = this._display("lte_time_today", "Неизвестно");
    return `<section class="view">
      <article class="card failover-hero">
        <div class="section-heading"><div><ha-icon icon="mdi:swap-horizontal-bold"></ha-icon><h2>Failover</h2></div>${this._statusPill(`${switches} сегодня`, Number(switches) > 0 ? "warn" : "neutral")}</div>
        <div class="failover-kpis">
          <div><span>Последнее</span><strong>${lastSwitch && !this._isUnknownState(lastSwitch) ? esc(formatAgo(lastSwitch)) : "Неизвестно"}</strong><small>${lastSwitch && !this._isUnknownState(lastSwitch) ? esc(formatClock(lastSwitch)) : ""}</small></div>
          <div><span>Направление</span><strong>${esc(this._switchDirection())}</strong></div>
          <div><span>Причина</span><strong>${esc(this._reason())}</strong></div>
          <div><span>LTE сегодня</span><strong>${esc(lteTime)}</strong></div>
        </div>
      </article>
      <article class="card event-card">
        <div class="section-heading"><div><ha-icon icon="mdi:history"></ha-icon><h2>Переходы за 24 часа</h2></div><small>HA Recorder</small></div>
        ${this._failoverLoading ? `<div class="chart-empty"><ha-icon icon="mdi:loading" class="spin"></ha-icon> Загрузка…</div>` : this._failoverError ? `<div class="chart-empty bad-text">История недоступна: ${esc(this._failoverError)}</div>` : this._failoverHistory.length ? `<div class="event-list">${this._failoverHistory.map((e, i) => `<div class="event"><div class="event-time">${esc(new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(e.at))}</div><div><strong>${esc(e.from)} → ${esc(e.to)}</strong><span>Причина: ${esc(this._eventReason(e, i))}</span></div></div>`).join("")}</div>` : `<div class="chart-empty">Переключений в доступной истории не найдено</div>`}
        <p class="hint">История направления берётся из фактических состояний Active WAN в HA Recorder. Причина для старых событий не восстанавливается, если интеграция её не хранит.</p>
      </article>
    </section>`;
  }

  _renderSystem() {
    const entry = this._bootstrap?.entry || {};
    const telemetry = this._telemetry();
    return `<section class="view">
      <article class="card system-hero">
        <div class="section-heading"><div><ha-icon icon="mdi:router-network"></ha-icon><h2>${esc(entry.model || "Keenetic Hero 4G+")}</h2></div>${this._statusPill(telemetry.label, telemetry.tone)}</div>
        <div class="system-meta"><span>${esc(entry.hostname || entry.title || "Keenetic")}</span><span>${esc(entry.host || "")}</span></div>
      </article>
      <article class="card detail-card"><div class="section-heading"><div><ha-icon icon="mdi:gauge"></ha-icon><h2>Система</h2></div></div><div class="detail-grid">
        ${this._metric("cpu_load", "Загрузка CPU")}
        ${this._metric("memory_usage", "Использование RAM")}
        ${this._metric("router_uptime", "Uptime роутера")}
        ${this._metric("firmware_version", "Версия KeeneticOS")}
        ${this._metric("lte_modem_temperature", "Температура LTE-модема")}
        ${this._metric("lte_modem_model", "LTE-модем")}
        ${this._metric("lte_modem_firmware", "Прошивка LTE-модема")}
        ${this._metric("lte_sim_state", "SIM")}
      </div></article>
      <p class="hint">Температура выводится только для LTE-модема, потому что именно этот фактический параметр предоставляет текущая интеграция.</p>
    </section>`;
  }

  _diagnosticRow(role) {
    const entityId = this._entityId(role);
    const state = this._stateObj(role);
    const raw = state?.state;
    const status = !entityId ? "missing" : raw === "unavailable" ? "unavailable" : raw === "unknown" ? "unknown" : "ok";
    const tone = status === "ok" ? "ok" : status === "missing" ? "neutral" : status === "unknown" ? "warn" : "bad";
    return `<div class="diag-row ${tone}" ${entityId ? `data-entity="${esc(entityId)}" tabindex="0"` : ""}>
      <div><strong>${esc(ROLE_LABELS[role] || role)}</strong><small>${esc(entityId || "Источник не найден")}</small></div>
      <div><span class="source-tag">${esc(this._source(role))}</span><strong>${esc(state ? this._display(role) : "Нет источника")}</strong><small>${state ? esc(formatAgo(state.last_updated)) : ""}</small></div>
    </div>`;
  }

  _renderDiagnostics() {
    const telemetry = this._telemetry();
    const coreRoles = [
      "internet_connectivity", "active_wan", "ethernet_connected", "lte_connected",
      "ethernet_ping", "ethernet_packet_loss", "lte_ping", "lte_packet_loss",
      "active_rx_mbps", "active_tx_mbps", "lte_rsrp", "lte_rsrq", "lte_sinr",
    ];
    const radioRoles = [
      "lte_operator", "lte_network_type", "lte_primary_band", "lte_carriers", "lte_bandwidth",
      "lte_earfcn", "lte_enb_id", "lte_sector_id", "lte_phy_cell_id", "lte_wan_ipv4",
      "lte_modem_model", "lte_modem_firmware", "lte_sim_state", "lte_modem_temperature",
    ];
    return `<section class="view">
      <article class="card integrity-card ${esc(telemetry.tone)}"><div><ha-icon icon="${telemetry.trusted ? "mdi:shield-check" : "mdi:shield-alert"}"></ha-icon><div><strong>${esc(telemetry.label)}</strong><span>${esc(telemetry.detail)}</span></div></div><small>unknown / unavailable не считаются нормальным состоянием.</small></article>
      <article class="card diagnostics-card"><div class="section-heading"><div><ha-icon icon="mdi:stethoscope"></ha-icon><h2>WAN / источники данных</h2></div></div><div class="diag-list">${coreRoles.map((r) => this._diagnosticRow(r)).join("")}</div></article>
      <article class="card diagnostics-card"><div class="section-heading"><div><ha-icon icon="mdi:radio-tower"></ha-icon><h2>LTE radio diagnostics</h2></div></div><div class="diag-list">${radioRoles.map((r) => this._diagnosticRow(r)).join("")}</div></article>
      <article class="card diagnostic-actions"><div><ha-icon icon="mdi:information-outline"></ha-icon><div><strong>Стандартная диагностика Home Assistant</strong><span>Privacy-safe diagnostics интеграции доступны через Устройства и службы. Логин/пароль и идентификаторы SIM редактируются на стороне интеграции.</span></div></div><button data-view="system">Система</button></article>
      <p class="hint">Long press по строке открывает more-info с историей и атрибутами конкретной сущности.</p>
    </section>`;
  }

  _renderNav() {
    const items = [
      ["overview", "mdi:view-dashboard-outline", "Обзор"],
      ["wan", "mdi:wan", "WAN/LTE"],
      ["traffic", "mdi:chart-timeline-variant", "Трафик"],
      ["failover", "mdi:swap-horizontal-bold", "Failover"],
      ["diagnostics", "mdi:stethoscope", "Диагн."],
    ];
    return `<nav class="bottom-nav">${items.map(([view, icon, label]) => `<button class="${this._view === view ? "active" : ""}" data-view="${view}"><ha-icon icon="${icon}"></ha-icon><span>${label}</span></button>`).join("")}</nav>`;
  }

  _loadViewData() {
    if (this._view === "traffic") this._loadTrafficHistory();
    if (this._view === "failover") this._loadFailoverHistory();
  }

  _attachInteractions() {
    this.shadowRoot.querySelectorAll("[data-view]").forEach((el) => {
      el.addEventListener("click", () => {
        const view = el.dataset.view;
        if (!view) return;
        history.replaceState(null, "", `${location.pathname}${location.search}#${view}`);
        this._view = view;
        this._scheduleRender();
        this._loadViewData();
      });
    });

    this.shadowRoot.querySelectorAll("[data-period]").forEach((el) => {
      el.addEventListener("click", () => {
        this._trafficPeriod = el.dataset.period || "24h";
        this._scheduleRender();
        this._loadTrafficHistory();
      });
    });

    this.shadowRoot.querySelectorAll("[data-entity]").forEach((el) => {
      let timer = null;
      let fired = false;
      const open = () => {
        const entityId = el.dataset.entity;
        if (!entityId) return;
        fired = true;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId },
          bubbles: true,
          composed: true,
        }));
      };
      const clear = () => {
        if (timer) window.clearTimeout(timer);
        timer = null;
      };
      el.addEventListener("pointerdown", () => {
        fired = false;
        clear();
        timer = window.setTimeout(open, 550);
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach((name) => el.addEventListener(name, clear));
      el.addEventListener("click", (ev) => {
        if (fired) ev.preventDefault();
      });
      el.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") open();
      });
    });
  }

  _render() {
    if (!this.shadowRoot) return;
    const body = !this._hass
      ? `<div class="loading">Ожидание Home Assistant…</div>`
      : this._bootstrapError
      ? `<div class="fatal"><ha-icon icon="mdi:alert-circle"></ha-icon><strong>Панель Keenetic не получила данные</strong><span>${esc(this._bootstrapError)}</span><button id="retry">Повторить</button></div>`
      : !this._bootstrap
      ? `<div class="loading"><ha-icon icon="mdi:loading" class="spin"></ha-icon> Загрузка Keenetic…</div>`
      : this._view === "overview"
      ? this._renderOverview()
      : this._view === "wan"
      ? this._renderWan()
      : this._view === "traffic"
      ? this._renderTraffic()
      : this._view === "failover"
      ? this._renderFailover()
      : this._view === "system"
      ? this._renderSystem()
      : this._renderDiagnostics();

    this.shadowRoot.innerHTML = `<style>${BUNDLED_PANEL_CSS}</style><div class="shell">${this._bootstrap ? this._renderHeader() : ""}<main>${body}</main>${this._bootstrap ? this._renderNav() : ""}</div>`;
    const retry = this.shadowRoot.getElementById("retry");
    if (retry) retry.addEventListener("click", () => this._loadBootstrap(false));
    this._attachInteractions();
    this._loadViewData();
  }
}

if (!customElements.get("keenetic-hero-panel")) {
  customElements.define("keenetic-hero-panel", KeeneticHeroPanel);
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-panel.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-overview-v040.js
(() => {
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
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-overview-v040.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v040.js
(() => {
const BASE_COMPONENT = customElements.get("keenetic-hero-panel");

if (BASE_COMPONENT) {
  BASE_COMPONENT.prototype._renderHeader = function () {
    return "";
  };

  BASE_COMPONENT.prototype._renderNav = function () {
    return "";
  };

  const baseRender = BASE_COMPONENT.prototype._render;
  BASE_COMPONENT.prototype._render = function (...args) {
    baseRender.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-nikas-v040-content]")) return;
    const style = document.createElement("style");
    style.dataset.nikasV040Content = "true";
    style.textContent = `
      .shell {
        width: min(100%, 1100px) !important;
        margin: 0 auto !important;
        padding: 12px max(12px, env(safe-area-inset-right)) 16px max(12px, env(safe-area-inset-left)) !important;
      }
    `;
    root.append(style);
  };
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v040.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v045.js
(() => {
const CORE_COMPONENT_V045 = customElements.get("keenetic-hero-panel");
const BOOTSTRAP_CACHE_KEY_V045 = "keenetic_hero_4g:panel_bootstrap:v2";
const BOOTSTRAP_TIMEOUT_MS_V045 = 5000;

function structuralBootstrapV045(value) {
  if (!value || typeof value !== "object" || !value.entities) return null;
  const entry = value.entry || {};
  const telemetry = value.telemetry || {};
  return {
    panel: value.panel || {},
    entry: {
      title: entry.title,
      hostname: entry.hostname,
      model: entry.model,
      firmware: entry.firmware,
    },
    entities: { ...(value.entities || {}) },
    sources: { ...(value.sources || {}) },
    telemetry: {
      scan_interval_seconds: telemetry.scan_interval_seconds,
    },
  };
}

function readBootstrapCacheV045() {
  try {
    const raw = window.localStorage.getItem(BOOTSTRAP_CACHE_KEY_V045);
    if (!raw) return null;
    return structuralBootstrapV045(JSON.parse(raw));
  } catch (_err) {
    return null;
  }
}

function writeBootstrapCacheV045(value) {
  try {
    const safe = structuralBootstrapV045(value);
    if (safe) window.localStorage.setItem(BOOTSTRAP_CACHE_KEY_V045, JSON.stringify(safe));
  } catch (_err) {
    // Cache is an acceleration layer only. Panel operation never depends on it.
  }
}

function seedBootstrapV045(instance) {
  if (instance._bootstrap) return true;
  const fallback = instance._panel?.config?.bootstrap_fallback;
  const seed = structuralBootstrapV045(fallback) || readBootstrapCacheV045();
  if (!seed) return false;
  instance._bootstrap = seed;
  instance._bootstrapError = null;
  instance._scheduleRender?.();
  instance._loadViewData?.();
  return true;
}

if (CORE_COMPONENT_V045 && !CORE_COMPONENT_V045.prototype.__nikaFastBootstrapV045) {
  CORE_COMPONENT_V045.prototype.__nikaFastBootstrapV045 = true;

  const panelDescriptorV045 = Object.getOwnPropertyDescriptor(CORE_COMPONENT_V045.prototype, "panel");
  if (panelDescriptorV045?.set) {
    Object.defineProperty(CORE_COMPONENT_V045.prototype, "panel", {
      configurable: true,
      enumerable: panelDescriptorV045.enumerable,
      set(value) {
        panelDescriptorV045.set.call(this, value);
        seedBootstrapV045(this);
        if (this._hass && !this._bootstrapLoading) {
          queueMicrotask(() => this._loadBootstrap(true));
        }
      },
    });
  }

  const hassDescriptorV045 = Object.getOwnPropertyDescriptor(CORE_COMPONENT_V045.prototype, "hass");
  if (hassDescriptorV045?.set) {
    Object.defineProperty(CORE_COMPONENT_V045.prototype, "hass", {
      configurable: true,
      enumerable: hassDescriptorV045.enumerable,
      set(value) {
        // Do not call the legacy setter: it starts a blocking websocket request
        // before the custom-panel config/fallback may have arrived.
        this._hass = value;
        seedBootstrapV045(this);
        this._scheduleRender?.();
        if (this._panel && !this._bootstrapLoading) {
          queueMicrotask(() => this._loadBootstrap(true));
        }
      },
    });
  }

  const connectedBaseV045 = CORE_COMPONENT_V045.prototype.connectedCallback;
  CORE_COMPONENT_V045.prototype.connectedCallback = function (...args) {
    connectedBaseV045?.apply(this, args);
    // Live entity values already flow through hass.states. The role mapping is
    // structural data and must not be polled every 30 seconds.
    if (this._refreshTimer) {
      window.clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
    seedBootstrapV045(this);
    if (this._hass && this._panel && !this._bootstrapLoading) {
      queueMicrotask(() => this._loadBootstrap(true));
    }
  };

  CORE_COMPONENT_V045.prototype._loadBootstrap = async function (silent = false) {
    if (!this._hass || this._bootstrapLoading) return;

    seedBootstrapV045(this);
    this._bootstrapLoading = true;
    if (!silent && !this._bootstrap) this._bootstrapError = null;

    let timer = null;
    try {
      const config = this._panel?.config || {};
      const request = this._hass.callWS({
        type: "keenetic_hero_4g/panel/bootstrap",
        ...(config.entry_id ? { entry_id: config.entry_id } : {}),
      });
      const timeout = new Promise((_, reject) => {
        timer = window.setTimeout(
          () => reject(new Error("Bootstrap timeout 5 s")),
          BOOTSTRAP_TIMEOUT_MS_V045,
        );
      });
      const fresh = await Promise.race([request, timeout]);
      this._bootstrap = fresh;
      writeBootstrapCacheV045(fresh);
      this._bootstrapError = null;
      this._bootstrapBackgroundError = null;
      this._loadViewData?.();
    } catch (err) {
      // A slow structural refresh must never replace a usable panel with a
      // full-screen loading/error state. Cached/fallback mapping remains active.
      if (!this._bootstrap) this._bootstrapError = err?.message || String(err);
      else {
        this._bootstrapError = null;
        this._bootstrapBackgroundError = err?.message || String(err);
      }
    } finally {
      if (timer) window.clearTimeout(timer);
      this._bootstrapLoading = false;
      this._scheduleRender?.();
    }
  };
}

function openHomeAssistantMenuV045(target) {
  target.dispatchEvent(
    new CustomEvent("hass-toggle-menu", {
      bubbles: true,
      composed: true,
    }),
  );
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v045.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v050.js
(() => {
const CORE_COMPONENT_V050 = customElements.get("keenetic-hero-panel");
const KEENETIC_ROOM_V050 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=1.0.0";

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
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v050.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v051.js
(() => {
const CORE_COMPONENT_V051 = customElements.get("keenetic-hero-panel");
const HERO_ASSET_V051 = "/keenetic_hero_4g_static/assets/keenetic-room-v052.webp?v=1.0.0";

if (CORE_COMPONENT_V051 && !CORE_COMPONENT_V051.prototype.__nikaStaticHeroV051) {
  CORE_COMPONENT_V051.prototype.__nikaStaticHeroV051 = true;
  const renderBaseV051 = CORE_COMPONENT_V051.prototype._render;

  CORE_COMPONENT_V051.prototype._render = function (...args) {
    renderBaseV051.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-keenetic-v051]")) return;

    const style = document.createElement("style");
    style.dataset.keeneticV051 = "true";
    style.textContent = `
      .v050-scene {
        min-height: 430px !important;
        background-image: url("${HERO_ASSET_V051}") !important;
        background-size: cover !important;
        background-position: center 52% !important;
        background-repeat: no-repeat !important;
      }
      .v050-scene-shade {
        background: linear-gradient(180deg,rgba(255,255,255,.94) 0%,rgba(255,255,255,.54) 23%,rgba(255,255,255,.02) 52%,rgba(255,255,255,.14) 70%,rgba(255,255,255,.94) 100%) !important;
      }
      .v050-path { top: 184px !important; }
      .v050-reserve-badge { top: 252px !important; }
      .v050-kpi-row { bottom: 72px !important; }
      .v050-reserve-strip { bottom: 10px !important; }
      .v050-channels { padding: 12px !important; }
      .v050-channel-list { gap: 8px !important; margin-top: 8px !important; }
      .v050-channel { padding: 10px !important; }
      .v050-channel-grid { margin-top: 8px !important; }

      @media (max-width: 430px) {
        .v050-scene {
          min-height: 420px !important;
          background-position: center 52% !important;
        }
        .v050-path { top: 180px !important; }
        .v050-reserve-badge { top: 244px !important; }
        .v050-kpi-row { bottom: 70px !important; }
      }

      @media (min-width: 760px) {
        .v050-scene {
          min-height: 500px !important;
          background-position: center 50% !important;
        }
        .v050-path { top: 220px !important; }
        .v050-reserve-badge { top: 295px !important; }
      }
    `;
    root.append(style);
  };
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v051.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v052.js
(() => {
const HERO_ASSET_V052 = "/keenetic_hero_4g_static/assets/keenetic-room-v052.webp?v=1.0.0";
const CORE_COMPONENT_V052 = customElements.get("keenetic-hero-panel");

if (CORE_COMPONENT_V052 && !CORE_COMPONENT_V052.prototype.__nikaAssetsStandardV052) {
  CORE_COMPONENT_V052.prototype.__nikaAssetsStandardV052 = true;
  const renderBaseV052 = CORE_COMPONENT_V052.prototype._render;

  CORE_COMPONENT_V052.prototype._render = function (...args) {
    renderBaseV052.apply(this, args);
    const root = this.shadowRoot;
    if (!root || root.querySelector("style[data-keenetic-v052]")) return;

    const style = document.createElement("style");
    style.dataset.keeneticV052 = "true";
    style.textContent = `
      .v050-scene {
        background-image: url("${HERO_ASSET_V052}") !important;
      }
    `;
    root.append(style);
  };
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v052.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v060.js
(() => {
const CORE_COMPONENT_V060 = customElements.get("keenetic-hero-panel");
const ROOM_ASSET_V060 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v060.svg?v=1.0.0";
const ROUTER_ASSET_V060 = "/keenetic_hero_4g_static/assets/keenetic-hero-router-v060.svg?v=1.0.0";

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
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v060.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v061.js
(() => {
const CORE_COMPONENT_V061 = customElements.get("keenetic-hero-panel");
const ROOM_ASSET_V061 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v060.svg?v=1.0.0";
const ROUTER_ASSET_V061 = "/keenetic_hero_4g_static/assets/keenetic-hero-router-v060.svg?v=1.0.0";

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
  scene.style.backgroundImage = `url("${ROOM_ASSET_V061}")`;
  const router = scene.querySelector(".v060-router");
  if (router && router.getAttribute("src") !== ROUTER_ASSET_V061) router.setAttribute("src", ROUTER_ASSET_V061);

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
  if (lteCard) {
    const subtitle = lteCard.querySelector("span");
    if (subtitle) {
      subtitle.textContent = lteActive ? "Активен" : /недоступ/i.test(reserveText) ? "Недоступен" : "Резерв готов";
    }
  }

  const cableCard = scene.querySelector(".v061-cable");
  if (cableCard) {
    const subtitle = cableCard.querySelector("span");
    if (subtitle) subtitle.textContent = cableActive ? "100.0 Mbit/s" : lteActive ? "Резерв" : "Недоступен";
  }

  const ethernet = root.querySelectorAll(".v050-channel")[0];
  const ethernetHead = ethernet?.querySelector(".v050-channel-head strong");
  if (ethernetHead) ethernetHead.textContent = "Кабель (Ethernet)";
}

function _v061InstallStyles(root) {
  if (!root || root.querySelector("style[data-keenetic-v061]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticV061 = "true";
  style.textContent = `
    .v050-path[hidden],.v050-reserve-badge[hidden],.v060-flow-layer[hidden]{display:none!important}
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
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v061.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v062.js
(() => {
const CORE_COMPONENT_V062 = customElements.get("keenetic-hero-panel");
const ROOM_ASSET_V062 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v062.svg?v=1.0.0";
const ROUTER_ASSET_V062 = "/keenetic_hero_4g_static/assets/keenetic-hero-router-v060.svg?v=1.0.0";

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
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v062.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v063.js
(() => {
const CORE_COMPONENT_V063 = customElements.get("keenetic-hero-panel");
const ROOM_ASSET_V063 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v060.svg?v=1.0.0";
const ROUTER_ASSET_V063 = "/keenetic_hero_4g_static/assets/keenetic-hero-router-v063.webp?v=1.0.0";

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
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v063.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v064.js
(() => {
const CORE_COMPONENT_V064 = customElements.get("keenetic-hero-panel");
const ROOM_ASSET_V064 = "/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=1.0.0";

function _v064InstallRoom(root) {
  if (!root) return;

  if (!root.querySelector("style[data-keenetic-v064]")) {
    const style = document.createElement("style");
    style.dataset.keeneticV064 = "true";
    style.textContent = `
      .v050-scene{
        background-image:url("${ROOM_ASSET_V064}")!important;
        background-position:center!important;
        background-size:cover!important;
      }
    `;
    root.append(style);
  }

  const scene = root.querySelector(".v050-scene");
  if (!scene) return;
  scene.classList.add("v064-photorealistic-room");
  scene.style.backgroundImage = `url("${ROOM_ASSET_V064}")`;
}

if (CORE_COMPONENT_V064 && !CORE_COMPONENT_V064.prototype.__nikaPhotorealisticRoomV064) {
  CORE_COMPONENT_V064.prototype.__nikaPhotorealisticRoomV064 = true;
  const renderBaseV064 = CORE_COMPONENT_V064.prototype._render;
  CORE_COMPONENT_V064.prototype._render = function (...args) {
    renderBaseV064.apply(this, args);
    _v064InstallRoom(this.shadowRoot);
  };
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v064.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v065.js
(() => {
const CORE_COMPONENT_V065 = customElements.get("keenetic-hero-panel");
const ZOOM_STORAGE_KEY_V065 = "nikas.keenetic.contentZoom.v1";
const ZOOM_MIN_V065 = 0.85;
const ZOOM_MAX_V065 = 1.8;
const ZOOM_STEP_V065 = 0.1;

function _v065ClampZoom(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 1;
  return Math.min(ZOOM_MAX_V065, Math.max(ZOOM_MIN_V065, numeric));
}

function _v065ReadZoom() {
  try {
    return _v065ClampZoom(localStorage.getItem(ZOOM_STORAGE_KEY_V065) || 1);
  } catch (_error) {
    return 1;
  }
}

function _v065TouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function _v065TouchMidpoint(touches) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

function _v065InstallHeroStyles(root) {
  if (!root || root.querySelector("style[data-keenetic-v065]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticV065 = "true";
  style.textContent = `
    .v050-scene-shade{
      background:linear-gradient(180deg,rgba(255,255,255,.80) 0%,rgba(255,255,255,.20) 28%,rgba(255,255,255,.02) 55%,rgba(255,255,255,.08) 72%,rgba(255,255,255,.72) 100%)!important;
    }
    .v060-router{top:49%!important}
    .v061-lte{
      top:25.8%!important;
      min-height:48px!important;
      padding:8px 10px!important;
      border-radius:17px!important;
    }
    .v061-lte ha-icon{--mdc-icon-size:23px!important}
    .v061-cable,.v061-lan{
      top:44.4%!important;
      min-height:66px!important;
      padding:7px 5px!important;
      border-radius:17px!important;
    }
    .v061-cable{width:66px!important}
    .v061-lan{width:76px!important}
    .v061-cable ha-icon,.v061-lan ha-icon{--mdc-icon-size:24px!important}
    @media(min-width:760px){
      .v060-router{top:50%!important}
    }
  `;
  root.append(style);
}

if (CORE_COMPONENT_V065 && !CORE_COMPONENT_V065.prototype.__nikaHeroAlignmentV065) {
  CORE_COMPONENT_V065.prototype.__nikaHeroAlignmentV065 = true;
  const renderBaseV065 = CORE_COMPONENT_V065.prototype._render;
  CORE_COMPONENT_V065.prototype._render = function (...args) {
    renderBaseV065.apply(this, args);
    _v065InstallHeroStyles(this.shadowRoot);
  };
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v065.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v068.js
(() => {
const CORE_COMPONENT_V068 = customElements.get("keenetic-hero-panel");

function _v068InstallRouterPathOcclusion(root) {
  if (!root || root.querySelector("style[data-keenetic-v068]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticV068 = "true";
  style.textContent = `
    /* Connection paths terminate naturally at the router silhouette. */
    .v063-flow-layer{z-index:2!important}
    .v060-router{z-index:3!important}
  `;
  root.append(style);
}

if (CORE_COMPONENT_V068 && !CORE_COMPONENT_V068.prototype.__nikaRouterPathOcclusionV068) {
  CORE_COMPONENT_V068.prototype.__nikaRouterPathOcclusionV068 = true;
  const renderBaseV068 = CORE_COMPONENT_V068.prototype._render;
  CORE_COMPONENT_V068.prototype._render = function (...args) {
    renderBaseV068.apply(this, args);
    _v068InstallRouterPathOcclusion(this.shadowRoot);
  };
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v068.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v073.js
(() => {
const CORE_COMPONENT_V073 = customElements.get("keenetic-hero-panel");

if (CORE_COMPONENT_V073 && !CORE_COMPONENT_V073.prototype.__nikaFailoverIdempotentV073) {
  CORE_COMPONENT_V073.prototype.__nikaFailoverIdempotentV073 = true;

  CORE_COMPONENT_V073.prototype._loadFailoverHistory = function () {
    // Recorder history stays disabled, but the notice must be committed once.
    // The previous override scheduled another render after every render, which
    // created an endless microtask loop whenever the Failover view was active.
    if (this._failoverHistoryDisabledV073) return;
    this._failoverHistoryDisabledV073 = true;
    this._failoverLoading = false;
    this._failoverHistory = [];
    this._failoverError = "История HA Recorder временно отключена";
    this._scheduleRender?.();
  };
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v073.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v075.js
(() => {
const CORE_COMPONENT_V075 = customElements.get("keenetic-hero-panel");
const STABLE_VIEWS_V075 = ["overview", "wan", "failover", "traffic", "diagnostics", "system"];
const DYNAMIC_CLASSES_V075 = new Set([
  "ok", "bad", "warn", "unknown", "neutral", "blue", "selected", "active",
  "metric-unknown", "active-ethernet", "active-lte", "active-none", "missing",
  "unavailable",
]);

function fragmentV075(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
}

function bodyV075(panel, view) {
  if (view === "overview") return panel._renderOverview();
  if (view === "wan") return panel._renderWan();
  if (view === "traffic") return panel._renderTraffic();
  if (view === "failover") return panel._renderFailover();
  if (view === "system") return panel._renderSystem();
  return panel._renderDiagnostics();
}

function stableClassesV075(element) {
  return [...element.classList].filter(
    (name) => !DYNAMIC_CLASSES_V075.has(name) && !/^v06[0-8]-/.test(name),
  );
}

function directLabelV075(element) {
  for (const child of element.children) {
    if ((child.tagName === "SMALL" || child.classList.contains("label")) && child.children.length === 0) {
      return child.textContent.trim();
    }
  }
  return "";
}

function nodeKeyV075(element) {
  if (element.id) return `${element.tagName}#${element.id}`;
  for (const name of ["entity", "view", "period"]) {
    if (element.dataset?.[name]) return `${element.tagName}[${name}=${element.dataset[name]}]`;
  }
  const classes = stableClassesV075(element);
  if (classes.length) return `${element.tagName}.${classes.join(".")}`;
  const label = directLabelV075(element);
  return label ? `${element.tagName}[label=${label}]` : element.tagName;
}

function syncClassesV075(current, desired) {
  const preserved = [...current.classList].filter(
    (name) => (/^v06[0-8]-/.test(name) || /^v075-/.test(name)) && !DYNAMIC_CLASSES_V075.has(name),
  );
  const next = new Set([...desired.classList, ...preserved]);
  const value = [...next].join(" ");
  if (current.getAttribute("class") !== value) current.setAttribute("class", value);
}

function syncAttributesV075(current, desired) {
  syncClassesV075(current, desired);
  for (const attribute of desired.attributes) {
    if (attribute.name === "class" || attribute.name === "style" || attribute.name === "src") continue;
    if (current.getAttribute(attribute.name) !== attribute.value) current.setAttribute(attribute.name, attribute.value);
  }
  if (desired.hasAttribute("src")) {
    const nextSrc = desired.getAttribute("src");
    if (current.getAttribute("src") !== nextSrc) current.setAttribute("src", nextSrc);
  }
}

function syncDirectTextV075(current, desired) {
  const currentText = [...current.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
  const desiredText = [...desired.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
  desiredText.forEach((node, index) => {
    if (currentText[index] && currentText[index].nodeValue !== node.nodeValue) {
      currentText[index].nodeValue = node.nodeValue;
    }
  });
}

function morphV075(current, desired) {
  if (current.closest?.(".v050-online-pill,.v050-fresh-pill")) return;
  if (current.matches?.(".v050-kpi") && current.querySelector("span")?.textContent.trim() === "Телеметрия") return;
  syncAttributesV075(current, desired);
  syncDirectTextV075(current, desired);
  const currentChildren = [...current.children];
  const used = new Set();
  for (const wanted of desired.children) {
    const key = nodeKeyV075(wanted);
    let match = currentChildren.find(
      (candidate) => !used.has(candidate) && nodeKeyV075(candidate) === key,
    );
    if (!match) {
      match = currentChildren.find(
        (candidate) => !used.has(candidate) && candidate.tagName === wanted.tagName,
      );
    }
    if (!match) continue;
    used.add(match);
    morphV075(match, wanted);
  }
}

function setDirectTextV075(element, value) {
  if (!element) return;
  const text = [...element.childNodes].find(
    (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim(),
  );
  if (text && text.nodeValue !== value) text.nodeValue = value;
  else if (!text) element.append(document.createTextNode(value));
}

function setTextContentV075(element, value) {
  if (element && element.textContent !== value) element.textContent = value;
}

function indicatorCategoryV075(panel) {
  const telemetry = panel._telemetry?.() || {};
  const configured = panel._bootstrap?.telemetry || {};
  const age = Number(telemetry.age);
  const hasAge = telemetry.age !== null && telemetry.age !== undefined && Number.isFinite(age);
  const failed = configured.last_update_success === false;
  const scanInterval = Math.max(1, Number(configured.scan_interval_seconds || 30));
  const staleAfter = scanInterval * 3;
  const declaredChannel = String(configured.active_data_channel || configured.data_channel || "local").toLowerCase();

  let connection = { label: "Локально", tone: "ok" };
  if (failed) connection = { label: "Нет связи", tone: "bad" };
  else if (declaredChannel === "cloud") connection = { label: "Облако", tone: "ok" };
  else if (declaredChannel === "reserve" || declaredChannel === "backup") connection = { label: "Резерв", tone: "warn" };
  else if (!["local", "lan", "api", "rci", "snmp"].includes(declaredChannel)) connection = { label: "Нет данных", tone: "unknown" };

  let freshness = { label: "Нет данных", tone: "unknown" };
  if (hasAge && (failed || age > staleAfter)) freshness = { label: "Данные устарели", tone: "warn" };
  else if (hasAge) freshness = { label: "Данные актуальны", tone: "ok" };
  return { connection, freshness, key: `${connection.label}:${freshness.label}` };
}

function patchIndicatorV075(panel, slot) {
  const category = indicatorCategoryV075(panel);
  if (slot.dataset.telemetryCategoryV075 === category.key) return;
  slot.dataset.telemetryCategoryV075 = category.key;

  const primary = slot.querySelector(".v050-online-pill");
  if (primary) {
    primary.classList.add("connection-primary");
    primary.classList.remove("ok", "bad", "warn", "unknown", "neutral");
    primary.classList.add(category.connection.tone);
    setDirectTextV075(primary, category.connection.label);
  }
  const secondary = slot.querySelector(".v050-fresh-pill");
  if (secondary) {
    secondary.classList.add("connection-secondary");
    secondary.classList.remove("ok", "bad", "warn", "unknown", "neutral");
    secondary.classList.add(category.freshness.tone);
    setDirectTextV075(secondary, category.freshness.label);
  }
}

function patchTopologyV075(panel, slot) {
  const scene = slot.querySelector(".v050-scene");
  if (!scene) return;
  const active = panel._activeWan?.();
  scene.classList.toggle("v061-cable-active", active === "ethernet");
  scene.classList.toggle("v061-lte-active", active === "lte");
  scene.classList.toggle("v061-no-wan", active !== "ethernet" && active !== "lte");

  const lte = panel._connection?.("lte_connected") || {};
  const cable = panel._connection?.("ethernet_connected") || {};
  const lteSubtitle = scene.querySelector(".v061-lte span");
  const cableSubtitle = scene.querySelector(".v061-cable span");
  setTextContentV075(lteSubtitle, active === "lte" ? "Активен" : lte.state === "up" ? "Резерв готов" : lte.label || "Нет данных");
  setTextContentV075(cableSubtitle, active === "ethernet" ? panel._display("ethernet_link_speed", "—") : cable.state === "up" ? "Резерв" : cable.label || "Нет данных");

  const signalCell = slot.querySelector(".v060-signal-cell strong");
  const operatorCell = slot.querySelector(".v060-operator-cell strong");
  setTextContentV075(signalCell, panel._lteSignal?.().label || "—");
  setTextContentV075(operatorCell, panel._display("lte_operator", "—"));
}

function ensureIntegrityPlaceholderV075(panel, slot) {
  if (slot.dataset.viewV075 !== "overview") return;
  let banner = slot.querySelector(":scope .integrity-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.className = "integrity-banner v075-integrity-placeholder";
    banner.innerHTML = '<ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><strong></strong><span></span></div>';
    slot.querySelector(".v050-overview")?.prepend(banner);
  }
  const telemetry = panel._telemetry?.() || {};
  const hidden = Boolean(telemetry.trusted);
  if (banner.hidden !== hidden) banner.hidden = hidden;
  const tone = telemetry.tone || "unknown";
  for (const candidate of ["ok", "bad", "warn", "unknown"]) {
    const enabled = candidate === tone;
    if (banner.classList.contains(candidate) !== enabled) banner.classList.toggle(candidate, enabled);
  }
  const strong = banner.querySelector("strong");
  const detail = banner.querySelector("span");
  setTextContentV075(strong, telemetry.label || "Нет данных");
  setTextContentV075(detail, `${telemetry.detail || "Состояние телеметрии не определено"}. WAN не трактуется как нормальный до восстановления телеметрии.`);
}

function patchSlotV075(panel, slot, view) {
  const desired = document.createElement("div");
  desired.append(fragmentV075(bodyV075(panel, view)));
  morphV075(slot, desired);
  if (view === "overview") {
    patchIndicatorV075(panel, slot);
    patchTopologyV075(panel, slot);
    ensureIntegrityPlaceholderV075(panel, slot);
  }
}

function installStableStyleV075(root) {
  if (!root || root.querySelector("style[data-keenetic-stable-dom-v075]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticStableDomV075 = "true";
  style.textContent = `
    .v075-view-slot[hidden],.v075-integrity-placeholder[hidden]{display:none!important}
    .v075-view-slot{display:block;min-height:100%}
    .connection-primary{font-size:16px!important;font-weight:700!important;max-width:min(58%,260px);white-space:normal;line-height:1.15}
    .connection-secondary{font-size:13px!important;font-weight:600!important;max-width:min(68%,300px);white-space:normal;line-height:1.2}
    .connection-primary.warn{color:var(--kp-yellow)!important}
    @media(max-width:430px){
      .v050-online-pill.connection-primary{font-size:16px!important;padding:8px 11px!important}
      .v050-fresh-pill.connection-secondary{font-size:13px!important;padding:7px 10px!important;top:56px!important}
    }
  `;
  root.append(style);
}

function preloadImagesV075(root) {
  root.querySelectorAll("img").forEach((image) => {
    if (image.dataset.preloadedV075 === "true") return;
    image.dataset.preloadedV075 = "true";
    image.decode?.().catch(() => {});
  });
  [
    "/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=1.0.0",
    "/keenetic_hero_4g_static/assets/keenetic-hero-router-v063.webp?v=1.0.0",
  ].forEach((url) => {
    const image = new Image();
    image.src = url;
    image.decode?.().catch(() => {});
  });
}

if (CORE_COMPONENT_V075 && !CORE_COMPONENT_V075.prototype.__nikaStableDomV075) {
  CORE_COMPONENT_V075.prototype.__nikaStableDomV075 = true;
  const renderBaseV075 = CORE_COMPONENT_V075.prototype._render;
  const hassDescriptorV075 = Object.getOwnPropertyDescriptor(CORE_COMPONENT_V075.prototype, "hass");

  CORE_COMPONENT_V075.prototype._bindStableInteractionsV075 = function (scope) {
    scope.querySelectorAll("[data-view]:not([data-stable-bound-v075])").forEach((element) => {
      element.dataset.stableBoundV075 = "true";
      element.addEventListener("click", () => {
        const view = element.dataset.view;
        if (!view) return;
        const request = new CustomEvent("keenetic-view-request", {
          detail: { view },
          bubbles: true,
          composed: true,
          cancelable: true,
        });
        if (!this.dispatchEvent(request)) return;
        history.replaceState(null, "", `${location.pathname}${location.search}#${view}`);
        this._view = view;
        this._scheduleRender?.();
        this._loadViewData?.();
      });
    });
    scope.querySelectorAll("[data-period]:not([data-stable-bound-v075])").forEach((element) => {
      element.dataset.stableBoundV075 = "true";
      element.addEventListener("click", () => {
        this._trafficPeriod = element.dataset.period || "24h";
        this._scheduleRender?.();
        this._loadTrafficHistory?.();
      });
    });
    scope.querySelectorAll("[data-entity]:not([data-stable-bound-v075])").forEach((element) => {
      element.dataset.stableBoundV075 = "true";
      let timer = 0;
      let fired = false;
      const clear = () => { window.clearTimeout(timer); timer = 0; };
      const open = () => {
        const entityId = element.dataset.entity;
        if (!entityId) return;
        fired = true;
        this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
      };
      element.addEventListener("pointerdown", () => { fired = false; clear(); timer = window.setTimeout(open, 550); });
      ["pointerup", "pointercancel", "pointerleave"].forEach((name) => element.addEventListener(name, clear));
      element.addEventListener("click", (event) => { if (fired) event.preventDefault(); });
      element.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") open(); });
    });
  };

  CORE_COMPONENT_V075.prototype._attachInteractions = function () {
    this._bindStableInteractionsV075(this.shadowRoot);
  };

  CORE_COMPONENT_V075.prototype._showStableViewV075 = function (view) {
    for (const [name, slot] of this._stableSlotsV075) {
      const active = name === view;
      if (slot.classList.contains("v075-active-view") !== active) slot.classList.toggle("v075-active-view", active);
      if (slot.hidden === active) slot.hidden = !active;
      if (slot.inert === active) slot.inert = !active;
      const ariaHidden = active ? "false" : "true";
      if (slot.getAttribute("aria-hidden") !== ariaHidden) slot.setAttribute("aria-hidden", ariaHidden);
    }
  };

  CORE_COMPONENT_V075.prototype._mountStableDomV075 = function (requestedView) {
    const main = this.shadowRoot?.querySelector(".shell>main");
    if (!main) return false;
    installStableStyleV075(this.shadowRoot);
    this._stableSlotsV075 = new Map();

    const overview = document.createElement("div");
    overview.className = "v075-view-slot";
    overview.dataset.viewV075 = "overview";
    while (main.firstChild) overview.append(main.firstChild);
    main.append(overview);
    this._stableSlotsV075.set("overview", overview);

    for (const view of STABLE_VIEWS_V075.slice(1)) {
      const slot = document.createElement("div");
      slot.className = "v075-view-slot";
      slot.dataset.viewV075 = view;
      slot.append(fragmentV075(bodyV075(this, view)));
      main.append(slot);
      this._stableSlotsV075.set(view, slot);
    }

    this._stableMainV075 = main;
    this._view = requestedView;
    this._showStableViewV075(requestedView);
    this._bindStableInteractionsV075(main);
    patchIndicatorV075(this, overview);
    ensureIntegrityPlaceholderV075(this, overview);
    preloadImagesV075(main);
    this._stableMountedV075 = true;
    return true;
  };

  CORE_COMPONENT_V075.prototype._patchStableDomV075 = function () {
    if (!this._stableMountedV075) return;
    const activeView = this._view;
    for (const [view, slot] of this._stableSlotsV075) patchSlotV075(this, slot, view);
    this._view = activeView;
    this._showStableViewV075(activeView);
  };

  CORE_COMPONENT_V075.prototype._scheduleRender = function () {
    if (this._renderQueuedV075) return;
    this._renderQueuedV075 = true;
    window.requestAnimationFrame(() => {
      this._renderQueuedV075 = false;
      this._render();
    });
  };

  CORE_COMPONENT_V075.prototype._maybeRefreshIndicatorV075 = function () {
    const interval = Math.max(1, Number(this._bootstrap?.telemetry?.scan_interval_seconds || 30)) * 1000;
    const now = Date.now();
    if (this._bootstrapLoading || now < Number(this._nextIndicatorRefreshV075 || 0)) return;
    this._nextIndicatorRefreshV075 = now + interval;
    this._loadBootstrap?.(true);
  };

  CORE_COMPONENT_V075.prototype._render = function (...args) {
    if (this._stableMountedV075) {
      this._patchStableDomV075();
      return;
    }
    if (!this._hass || !this._bootstrap) return;
    const requestedView = this._view;
    this._view = "overview";
    renderBaseV075.apply(this, args);
    this._view = requestedView;
    this._mountStableDomV075(requestedView);
  };

  if (hassDescriptorV075?.set) {
    Object.defineProperty(CORE_COMPONENT_V075.prototype, "hass", {
      configurable: true,
      enumerable: hassDescriptorV075.enumerable,
      set(value) {
        if (!this._stableMountedV075) {
          hassDescriptorV075.set.call(this, value);
          return;
        }
        this._hass = value;
        this._scheduleRender();
        this._maybeRefreshIndicatorV075();
      },
    });
  }
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v075.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js
(() => {
const K100_VERSION = "1.0.0";
const K100_CORE = customElements.get("keenetic-hero-panel");
const K100_ALLOWED = ["/dashboard-house-v11/home", "/dashboard-actions/home", "/dashboard-infrastructure/overview"];
const K100_TABS = [
  ["overview","mdi:view-dashboard-outline","Обзор"],
  ["wan","mdi:web","Каналы"],
  ["failover","mdi:swap-horizontal-bold","Failover"],
  ["traffic","mdi:chart-timeline-variant","Трафик"],
  ["diagnostics","mdi:stethoscope","Диагн."],
];

function k100Esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function k100SafeRoute(v){
  if(!v)return null;
  try{const url=new URL(v,window.location.origin);if(url.origin!==window.location.origin)return null;const pathname=url.pathname;return K100_ALLOWED.some(p=>pathname===p||pathname.startsWith(`${p}/`))?`${url.pathname}${url.search}${url.hash}`:null;}catch{return null;}
}
function k100Return(panel){
  const q=new URLSearchParams(location.search);
  for(const key of ["return_to","from"]){const v=k100SafeRoute(q.get(key));if(v)return v;}
  const once=sessionStorage.getItem("nikas.specialized.source_route.v1");
  const onceAt=sessionStorage.getItem("nikas.specialized.source_route_at.v1");
  if(once!==null||onceAt!==null){sessionStorage.removeItem("nikas.specialized.source_route.v1");sessionStorage.removeItem("nikas.specialized.source_route_at.v1");if(once!==null&&onceAt!==null){const handedOffAge=Date.now()-Number(onceAt);const v=k100SafeRoute(once);if(v&&Number.isFinite(handedOffAge)&&handedOffAge>=0&&handedOffAge<10*60*1000)return v;}}
  const saved=k100SafeRoute(localStorage.getItem("nikas.keenetic.return_route.v1"));if(saved)return saved;
  const ref=k100SafeRoute(document.referrer);if(ref)return ref;
  const configured=k100SafeRoute(panel?.config?.parent_route);if(configured)return configured;
  return "/dashboard-infrastructure/overview";
}
function k100Navigate(route){history.pushState(null,"",route);window.dispatchEvent(new Event("location-changed"));}

function k100Reserve(panel,active){
  const role=active==="ethernet"?"lte":active==="lte"?"ethernet":null;
  const c=role?panel._connection(`${role}_connected`):{state:"unknown"};
  const name=role==="lte"?"4G LTE":role==="ethernet"?"Ethernet":"Резерв";
  if(c.state==="up")return ["ok","mdi:check-circle",active==="lte"?"Работа через резерв":"Резерв готов",active==="lte"?"Основной Ethernet недоступен.":`${name} подключён и готов к работе.`];
  if(c.state==="down")return ["bad","mdi:alert-circle-outline","Резерв недоступен",`${name} сейчас недоступен.`];
  return ["unknown","mdi:help-circle-outline","Нет данных о резерве","Готовность резервного канала не подтверждена."];
}
function k100Metric(panel,role,icon,label,value,wide=""){const id=role?panel._entityId?.(role):null;return `<div class="k100-metric ${wide}"${id?` data-entity="${k100Esc(id)}" tabindex="0"`:""}><ha-icon icon="${icon}"></ha-icon><div><span>${k100Esc(label)}</span><strong>${k100Esc(value)}</strong></div></div>`;}
function k100Overview(panel){
  const internet=panel._internet();const telemetry=panel._telemetry();const active=panel._activeWan();
  const activeName=active==="ethernet"?"Ethernet":active==="lte"?"4G LTE":"Канал не определён";
  const heroTitle=internet.online===true?"Интернет работает":internet.online===false?"Нет подключения":"Состояние неизвестно";
  const reserve=k100Reserve(panel,active);
  const eth=panel._connection("ethernet_connected");const lte=panel._connection("lte_connected");
  const channelState=(role,c)=>active===role?"active":c.state==="up"?"standby":c.state==="down"?"down":"unknown";
  const ping=active==="lte"?"lte_ping":active==="ethernet"?"ethernet_ping":null;
  const loss=active==="lte"?"lte_packet_loss":active==="ethernet"?"ethernet_packet_loss":null;
  const rx=active==="lte"?"lte_rx_mbps":active==="ethernet"?"ethernet_rx_mbps":null;
  const tx=active==="lte"?"lte_tx_mbps":active==="ethernet"?"ethernet_tx_mbps":null;
  const ip=active==="lte"?"lte_wan_ipv4":active==="ethernet"?"ethernet_wan_ipv4":null;
  const uptime=active==="lte"?"lte_interface_uptime":active==="ethernet"?"ethernet_interface_uptime":null;
  const link=active==="lte"?"lte_rsrp":active==="ethernet"?"ethernet_link_speed":null;
  const linkLabel=active==="lte"?"Сигнал":"Link";
  const linkValue=active==="lte"?panel._display("lte_rsrp","—"):active==="ethernet"?panel._display("ethernet_link_speed","—"):"—";
  return `<section class="k100-overview">
    <article class="k100-hero">
      <div class="k100-copy"><h1>${k100Esc(heroTitle)}</h1><p>${active?`Основной канал · ${k100Esc(activeName)}`:"Канал не определён"}</p></div>
      <div class="k100-indicator ${telemetry.trusted?"ok":telemetry.stale?"warn":"bad"}"><strong><i></i>${telemetry.trusted?"Локально":telemetry.stale?"Локально":"Нет связи"}</strong><span>${telemetry.trusted?"Данные актуальны":telemetry.stale?"Данные устарели":"Нет данных"}</span></div>
      <svg class="k100-lines" viewBox="0 0 1000 620" preserveAspectRatio="none"><path class="lte ${channelState("lte",lte)}" d="M500 185 L500 405"/><path class="eth ${channelState("ethernet",eth)}" d="M215 420 L435 420"/><path class="lan active" d="M565 420 L785 420"/></svg>
      <div class="k100-channel k100-lte ${channelState("lte",lte)}"><ha-icon icon="mdi:radio-tower"></ha-icon><div><strong>4G LTE</strong><span>${active==="lte"?"Активный канал":lte.state==="up"?"Резервный канал":"Нет данных"}</span></div></div>
      <div class="k100-channel k100-eth ${channelState("ethernet",eth)}"><ha-icon icon="mdi:ethernet"></ha-icon><div><strong>Кабель</strong><span>${active==="ethernet"?"Основной канал":eth.state==="up"?"Резервный канал":"Нет данных"}</span></div></div>
      <div class="k100-channel k100-lan active"><ha-icon icon="mdi:lan"></ha-icon><div><strong>LAN</strong><span>Локальная сеть</span></div></div>
      <img class="k100-router" src="/keenetic_hero_4g_static/assets/keenetic-hero-router-v086.webp?v=1.0.0" alt="Keenetic Hero 4G+">
    </article>
    <div class="k100-reserve ${reserve[0]}"><ha-icon icon="${reserve[1]}"></ha-icon><div><strong>${reserve[2]}</strong><span>${reserve[3]}</span></div></div>
    <article class="k100-active-card">
      <div class="k100-active-head"><ha-icon icon="${active==="lte"?"mdi:radio-tower":active==="ethernet"?"mdi:ethernet":"mdi:lan-disconnect"}"></ha-icon><strong>${k100Esc(activeName)}</strong><span class="${active?"ok":"unknown"}"><i></i>${active?"Активен":"Нет данных"}</span><button data-k100-view="wan"><ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
      <div class="k100-grid">
        ${k100Metric(panel,ping,"mdi:earth","Ping",active?panel._display(ping,"—"):"—")}
        ${k100Metric(panel,loss,"mdi:shield-check-outline","Потеря пакетов",active?panel._display(loss,"—"):"—")}
        ${k100Metric(panel,null,"mdi:timer-outline","Телеметрия",telemetry.age===null?"—":`${Math.round(telemetry.age)} с`)}
        ${k100Metric(panel,link,"mdi:link-variant",linkLabel,linkValue)}
        ${k100Metric(panel,rx,"mdi:download-network-outline","RX",active?panel._display(rx,"—"):"—")}
        ${k100Metric(panel,tx,"mdi:upload-network-outline","TX",active?panel._display(tx,"—"):"—")}
        ${k100Metric(panel,ip,"mdi:ip-network-outline","WAN IP",active?panel._display(ip,"—"):"—","wide")}
        ${k100Metric(panel,uptime,"mdi:clock-outline","Uptime",active?panel._display(uptime,"—"):"—")}
      </div>
    </article>
    <div class="k100-alert ${telemetry.trusted?"hidden":telemetry.stale?"warn":"bad"}"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><strong>${k100Esc(telemetry.label)}</strong><span>${k100Esc(telemetry.detail)}</span></div></div>
  </section>`;
}

function k100InstallCore(){
  if(!K100_CORE||K100_CORE.prototype.__k100)return;K100_CORE.prototype.__k100=true;
  K100_CORE.prototype._renderOverview=function(){return k100Overview(this);};
  const oldMount=K100_CORE.prototype._mountStableDomV075;
  if(oldMount)K100_CORE.prototype._mountStableDomV075=function(...args){const r=oldMount.apply(this,args);k100InstallStyles(this.shadowRoot);return r;};
  const oldRender=K100_CORE.prototype._render;
  K100_CORE.prototype._render=function(...args){const r=oldRender.apply(this,args);k100InstallStyles(this.shadowRoot);return r;};
}
function k100InstallStyles(root){if(!root||root.querySelector("style[data-k100]"))return;const s=document.createElement("style");s.dataset.k100="1";s.textContent=`
.k100-overview{display:grid;gap:10px;padding:10px 10px 18px;min-height:100%}.k100-hero{position:relative;height:430px;border:1px solid var(--divider-color);border-radius:24px;overflow:hidden;background:url('/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=1.0.0') center/cover no-repeat;box-shadow:0 8px 26px rgba(23,45,76,.08)}
.k100-copy{position:absolute;z-index:8;left:16px;top:14px;max-width:48%}.k100-copy h1{margin:0 0 3px;font-size:25px;line-height:1.04}.k100-copy p{margin:0;font-size:14px;font-weight:650;color:var(--secondary-text-color)}
.k100-indicator{position:absolute;z-index:9;right:14px;top:14px;width:174px;padding:11px 14px;border:1px solid;border-radius:18px;background:var(--card-background-color)}.k100-indicator strong,.k100-indicator span{display:block}.k100-indicator strong{font-size:16px}.k100-indicator span{margin-top:6px;font-size:13px;font-weight:600;color:var(--secondary-text-color)}.k100-indicator i,.k100-active-head i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:8px;background:currentColor}.k100-indicator.ok{color:#2fb878;border-color:#9ce4c5;background:rgba(232,249,241,.94)}.k100-indicator.warn{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.94)}.k100-indicator.bad{color:#d95d63;border-color:#efb8ba;background:rgba(255,238,239,.94)}
.k100-lines{position:absolute;inset:0;z-index:3;width:100%;height:100%}.k100-lines path{fill:none;stroke:#9aa3ab;stroke-width:7;stroke-linecap:round;stroke-dasharray:8 13}.k100-lines path.active{stroke:#2fbd7c;stroke-dasharray:none}.k100-lines path.standby{stroke:#16a4db}.k100-lines path.down{stroke:#dc6267;opacity:.65}
.k100-router{position:absolute;z-index:6;left:50%;top:61%;transform:translate(-50%,-50%);width:42%;max-width:290px;filter:drop-shadow(0 10px 9px rgba(65,45,30,.18));pointer-events:none}.k100-channel{position:absolute;z-index:8;display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:18px;background:rgba(255,255,255,.94);box-shadow:0 8px 20px rgba(23,45,76,.09);min-width:145px}.k100-channel ha-icon{--mdc-icon-size:28px}.k100-channel strong,.k100-channel span{display:block}.k100-channel strong{font-size:15px}.k100-channel span{font-size:12px;margin-top:3px;color:var(--secondary-text-color)}.k100-channel.active{color:#2fbd7c}.k100-channel.standby{color:#139ed1}.k100-channel.down{color:#d95d63}.k100-channel.unknown{color:#7e8993}.k100-lte{left:50%;top:31%;transform:translate(-50%,-50%)}.k100-eth{left:3%;top:58%}.k100-lan{right:3%;top:58%}
.k100-reserve,.k100-alert{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid;border-radius:20px}.k100-reserve ha-icon,.k100-alert ha-icon{--mdc-icon-size:30px}.k100-reserve strong,.k100-reserve span,.k100-alert strong,.k100-alert span{display:block}.k100-reserve strong,.k100-alert strong{font-size:16px}.k100-reserve span,.k100-alert span{font-size:13px;margin-top:2px;color:var(--secondary-text-color)}.k100-reserve.ok{color:#279f69;border-color:#9fe4c8;background:rgba(232,249,241,.9)}.k100-reserve.bad,.k100-alert.bad{color:#d95d63;border-color:#efb8ba;background:rgba(255,238,239,.94)}.k100-reserve.unknown{color:#69757f;border-color:#cdd3d8;background:rgba(248,249,250,.94)}.k100-alert.warn{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.94)}.k100-alert.hidden{display:none}
.k100-active-card{border:1px solid color-mix(in srgb,var(--primary-color) 45%,var(--divider-color));border-radius:22px;background:var(--card-background-color);overflow:hidden}.k100-active-head{min-height:58px;display:flex;align-items:center;gap:9px;padding:10px 14px}.k100-active-head>ha-icon{color:var(--primary-color);--mdc-icon-size:28px}.k100-active-head>strong{font-size:20px}.k100-active-head>span{font-size:14px;font-weight:700;color:#2fb878}.k100-active-head button{margin-left:auto;border:0;background:none;color:var(--primary-color);padding:7px}.k100-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--divider-color)}.k100-metric{min-height:72px;padding:12px;display:flex;align-items:center;gap:9px;border-right:1px solid var(--divider-color);border-bottom:1px solid var(--divider-color)}.k100-metric:nth-child(3n){border-right:0}.k100-metric ha-icon{color:var(--primary-color);--mdc-icon-size:25px}.k100-metric span,.k100-metric strong{display:block}.k100-metric span{font-size:12px;color:var(--secondary-text-color);font-weight:650}.k100-metric strong{font-size:15px;margin-top:2px}.k100-metric.wide{grid-column:span 2}.k100-alert{margin-bottom:2px}
@media(max-width:390px){.k100-hero{height:410px}.k100-copy{max-width:50%;left:13px;top:12px}.k100-copy h1{font-size:22px}.k100-indicator{right:10px;top:10px;width:164px}.k100-router{width:43%;max-width:245px}.k100-channel{min-width:132px;padding:9px 10px}.k100-lte{top:31%}.k100-eth,.k100-lan{top:59%}.k100-grid{grid-template-columns:repeat(3,1fr)}.k100-metric{padding:10px 8px}.k100-metric strong{font-size:14px}}
`;root.append(s);}

class KeeneticHeroAppPanelV100 extends HTMLElement{
  constructor(){super();this.attachShadow({mode:"open"});this._hass=null;this._panel=null;this._route=null;this._child=null;this._view="overview";this._scale=1;this._returnRoute=null;this._pinch=null;}
  set hass(v){this._hass=v;this._mountChild();if(this._child)this._child.hass=v;} set panel(v){this._panel=v;if(!this._returnRoute){this._returnRoute=k100Return(v);localStorage.setItem("nikas.keenetic.return_route.v1",this._returnRoute);}this._mount();} set route(v){this._route=v;if(this._child)this._child.route=v;}
  connectedCallback(){this._mount();this._bind();}
  disconnectedCallback(){this._unbind();}
  _mount(){if(!this.shadowRoot.getElementById("k100-shell")){this.shadowRoot.innerHTML=`<style>
:host{--safe-top:env(safe-area-inset-top,0px);--safe-bottom:env(safe-area-inset-bottom,0px);display:block;width:100%;height:100dvh;overflow:hidden;background:var(--primary-background-color);font-family:var(--ha-font-family-body,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)}*{box-sizing:border-box}#k100-shell{height:100%;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden}.k100-header{min-height:calc(62px + var(--safe-top));padding:var(--safe-top) 8px 0;display:grid;grid-template-columns:52px minmax(0,1fr) 52px;align-items:center;background:var(--card-background-color);border-bottom:1px solid var(--divider-color);z-index:20}.k100-side{width:44px;height:44px;border:1px solid var(--divider-color);border-radius:16px;background:var(--card-background-color);box-shadow:0 7px 20px rgba(23,45,76,.08);display:grid;place-items:center}.k100-side ha-icon{--mdc-icon-size:25px}.k100-refresh{justify-self:end;color:var(--primary-color)}.k100-title{justify-self:center;min-width:min(290px,100%);max-width:100%;min-height:44px;padding:5px 14px;border:1px solid color-mix(in srgb,var(--primary-color,#03a9d9) 24%,var(--divider-color));border-radius:16px;background:color-mix(in srgb,var(--primary-color,#03a9d9) 5%,var(--card-background-color));box-shadow:0 5px 16px rgba(23,45,76,.06);text-align:center}.k100-title strong,.k100-title small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k100-title strong{font-size:23px;font-weight:800;line-height:1.08}.k100-title small{font-size:14px;font-weight:560;color:var(--secondary-text-color);margin-top:2px}.k100-title:active{background:color-mix(in srgb,var(--primary-color) 13%,var(--card-background-color));border-color:color-mix(in srgb,var(--primary-color) 42%,var(--divider-color));transform:scale(.985)}.k100-title:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.k100-work{min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:none;-webkit-overflow-scrolling:touch;touch-action:pan-y}.k100-stage{min-height:100%;transform-origin:0 0}.k100-stage>keenetic-hero-panel{display:block;min-height:100%}.k100-tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px;padding:6px 6px calc(6px + var(--safe-bottom));background:var(--card-background-color);border-top:1px solid var(--divider-color);box-shadow:0 -4px 18px rgba(23,45,76,.08);z-index:20}.k100-tabs button{min-height:52px;border:0;border-radius:16px;background:transparent;color:var(--secondary-text-color);display:grid;place-items:center;align-content:center;gap:3px}.k100-tabs button.active{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 11%,transparent)}.k100-tabs ha-icon{--mdc-icon-size:28px}.k100-tabs span{font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}@media(max-width:390px){.k100-header{grid-template-columns:48px minmax(0,1fr) 48px;min-height:calc(60px + var(--safe-top))}.k100-title{min-width:0;width:100%;padding-inline:8px}.k100-title strong{font-size:21px}.k100-title small{font-size:13px}}
</style><div id="k100-shell"><header class="k100-header"><button id="k100-menu" class="k100-side" aria-label="Открыть меню Home Assistant"><ha-icon icon="mdi:menu"></ha-icon></button><button id="k100-title" class="k100-title"><strong>Keenetic Hero 4G+</strong><small>UI v1.0.0</small></button><button id="k100-refresh" class="k100-side k100-refresh" aria-label="Обновить"><ha-icon icon="mdi:refresh"></ha-icon></button></header><main id="k100-work" class="k100-work"><div id="k100-stage" class="k100-stage"></div></main><nav id="k100-tabs" class="k100-tabs"></nav></div>`;this.shadowRoot.getElementById("k100-menu").onclick=e=>e.currentTarget.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:true,composed:true}));this.shadowRoot.getElementById("k100-title").onclick=()=>k100Navigate(this._returnRoute||"/dashboard-infrastructure/overview");this.shadowRoot.getElementById("k100-refresh").onclick=()=>this._child?._loadBootstrap?.(false);this._renderTabs();}this._mountChild();}
  _mountChild(){if(!this.isConnected||!this.shadowRoot.getElementById("k100-stage"))return;if(!this._child){this._child=document.createElement("keenetic-hero-panel");this._child._view=this._view;this.shadowRoot.getElementById("k100-stage").append(this._child);}if(this._panel)this._child.panel=this._panel;if(this._route)this._child.route=this._route;if(this._hass)this._child.hass=this._hass;}
  _renderTabs(){const n=this.shadowRoot.getElementById("k100-tabs");if(!n)return;n.innerHTML=K100_TABS.map(([v,i,l])=>`<button data-view="${v}" class="${v===this._view?"active":""}"><ha-icon icon="${i}"></ha-icon><span>${l}</span></button>`).join("");n.querySelectorAll("button").forEach(b=>b.onclick=()=>this._setView(b.dataset.view));}
  _setView(v){if(!K100_TABS.some(x=>x[0]===v))return;this._view=v;this._child._view=v;this._child._scheduleRender?.();this._child._loadViewData?.();this.shadowRoot.getElementById("k100-work").scrollTop=0;this._renderTabs();}
  _bind(){this._touchStart=e=>{if(e.touches.length===2){const [a,b]=e.touches;this._pinch={d:Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY),s:this._scale};}};this._touchMove=e=>{if(e.touches.length===2&&this._pinch){e.preventDefault();const[a,b]=e.touches;const d=Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY);this._scale=Math.max(.75,Math.min(2,this._pinch.s*d/this._pinch.d));if(this._scale>=.97&&this._scale<=1.03)this._scale=1;this.shadowRoot.getElementById("k100-stage").style.transform=`scale(${this._scale})`;}};this._touchEnd=e=>{if(e.touches.length<2)this._pinch=null;};const w=this.shadowRoot.getElementById("k100-work");w.addEventListener("touchstart",this._touchStart,{passive:true});w.addEventListener("touchmove",this._touchMove,{passive:false});w.addEventListener("touchend",this._touchEnd,{passive:true});}
  _unbind(){const w=this.shadowRoot.getElementById("k100-work");if(!w)return;w.removeEventListener("touchstart",this._touchStart);w.removeEventListener("touchmove",this._touchMove);w.removeEventListener("touchend",this._touchEnd);}
}
k100InstallCore();if(!customElements.get("keenetic-hero-app-panel-v100"))customElements.define("keenetic-hero-app-panel-v100",KeeneticHeroAppPanelV100);
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js
