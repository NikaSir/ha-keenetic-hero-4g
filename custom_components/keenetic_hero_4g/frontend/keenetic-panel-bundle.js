// GENERATED FILE. DO NOT EDIT DIRECTLY.
// Keenetic Hero 4G+ self-contained Home Assistant panel bundle.
// Current v0.4.x sources and CSS are composed at build time only.
// Runtime dependency on prior UI modules is forbidden.

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-panel.js
(() => {
const BUNDLED_PANEL_CSS = ":host { display:block; min-height:100%; color:var(--primary-text-color); --kp-green:#36b37e; --kp-yellow:#d8a400; --kp-red:#d94b4b; --kp-grey:#7f8c99; --kp-blue:var(--primary-color,#03a9f4); --kp-surface:var(--ha-card-background,var(--card-background-color,#fff)); --kp-border:color-mix(in srgb,var(--primary-text-color) 11%,transparent); --kp-muted:var(--secondary-text-color,#6b7280); }\n* { box-sizing:border-box; }\nbutton { font:inherit; }\n.shell { width:min(100%,1100px); margin:0 auto; padding:12px max(12px,env(safe-area-inset-right)) calc(88px + env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left)); }\n.app-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin:2px 2px 12px; }\n.eyebrow { font-size:11px; color:var(--kp-muted); font-weight:700; letter-spacing:.06em; text-transform:uppercase; }\nh1 { font-size:23px; margin:3px 0 1px; line-height:1.15; }\n.subline { font-size:12px; color:var(--kp-muted); }\n.telemetry-chip { max-width:145px; display:flex; gap:6px; align-items:center; padding:7px 9px; border-radius:14px; font-size:11px; font-weight:700; background:color-mix(in srgb,var(--kp-grey) 10%,var(--kp-surface)); border:1px solid var(--kp-border); }\n.telemetry-chip ha-icon { --mdc-icon-size:17px; }\n.telemetry-chip.ok { color:var(--kp-green); background:color-mix(in srgb,var(--kp-green) 10%,var(--kp-surface)); }\n.telemetry-chip.warn { color:var(--kp-yellow); background:color-mix(in srgb,var(--kp-yellow) 10%,var(--kp-surface)); }\n.telemetry-chip.bad { color:var(--kp-red); background:color-mix(in srgb,var(--kp-red) 10%,var(--kp-surface)); }\n.view { display:grid; gap:10px; }\n.card { background:var(--kp-surface); border:1px solid var(--kp-border); border-radius:20px; box-shadow:0 3px 18px color-mix(in srgb,#000 7%,transparent); }\n.hero-card { padding:14px; }\n.hero-top { display:grid; grid-template-columns:1.15fr .85fr; gap:12px; align-items:end; }\n.label { display:block; color:var(--kp-muted); font-size:12px; font-weight:650; margin-bottom:2px; }\n.hero-value { display:flex; align-items:center; gap:7px; font-size:28px; font-weight:800; letter-spacing:-.02em; }\n.hero-value.ok { color:var(--kp-green); }\n.hero-value.bad { color:var(--kp-red); }\n.hero-value.unknown { color:var(--kp-grey); }\n.status-dot { width:10px; height:10px; border-radius:50%; background:currentColor; box-shadow:0 0 0 4px color-mix(in srgb,currentColor 12%,transparent); }\n.hero-top small { display:block; color:var(--kp-muted); font-size:10px; margin-top:2px; }\n.active-channel { text-align:right; }\n.active-channel > strong { font-size:24px; display:block; }\n.unknown-text { color:var(--kp-grey); }\n.rate-row { display:flex; justify-content:flex-end; gap:7px; font-size:10px; color:var(--kp-muted); margin-top:2px; }\n.network-map { margin-top:12px; padding:8px 8px 6px; border-radius:16px; background:color-mix(in srgb,var(--primary-text-color) 3%,transparent); display:grid; justify-items:center; }\n.node { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:700; }\n.node ha-icon { --mdc-icon-size:16px; }\n.internet-node.ok { color:var(--kp-green); }\n.internet-node.bad { color:var(--kp-red); }\n.internet-node.unknown { color:var(--kp-grey); }\n.trunk { width:2px; height:8px; background:var(--kp-border); }\n.branches { position:relative; width:100%; display:grid; grid-template-columns:1fr 1fr; gap:10px; }\n.branches:before { content:\"\"; position:absolute; top:0; left:25%; right:25%; height:2px; background:var(--kp-border); }\n.branch { padding-top:8px; display:grid; justify-items:center; gap:1px; color:var(--kp-grey); position:relative; }\n.branch .branch-line { position:absolute; top:0; width:2px; height:8px; background:var(--kp-border); }\n.branch ha-icon { --mdc-icon-size:17px; }\n.branch b { font-size:11px; }\n.branch small { font-size:9px; }\n.branch.active.ok { color:var(--kp-green); }\n.branch.active.warn { color:var(--kp-yellow); }\n.branch.active.bad { color:var(--kp-red); }\n.router-node { margin-top:5px; display:flex; align-items:center; gap:4px; color:var(--kp-muted); font-size:10px; }\n.router-node ha-icon { --mdc-icon-size:15px; }\n.integrity-banner { display:flex; gap:9px; align-items:center; padding:10px 12px; border-radius:16px; border:1px solid var(--kp-border); background:var(--kp-surface); }\n.integrity-banner ha-icon { --mdc-icon-size:22px; }\n.integrity-banner strong,.integrity-banner span { display:block; }\n.integrity-banner strong { font-size:13px; }\n.integrity-banner span { font-size:10px; color:var(--kp-muted); }\n.integrity-banner.bad ha-icon { color:var(--kp-red); }\n.integrity-banner.warn ha-icon { color:var(--kp-yellow); }\n.integrity-banner.unknown ha-icon { color:var(--kp-grey); }\n.wan-pair { display:grid; grid-template-columns:1fr 1fr; gap:10px; }\n.channel-card { padding:12px; min-width:0; }\n.channel-card.selected { border-color:color-mix(in srgb,var(--kp-blue) 65%,var(--kp-border)); box-shadow:0 0 0 1px color-mix(in srgb,var(--kp-blue) 30%,transparent),0 4px 20px color-mix(in srgb,var(--kp-blue) 10%,transparent); }\n.card-title,.section-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; }\n.card-title > div,.section-heading > div { display:flex; align-items:center; gap:6px; min-width:0; }\n.card-title ha-icon,.section-heading ha-icon { --mdc-icon-size:19px; color:var(--kp-blue); }\n.card-title strong { font-size:13px; }\n.section-heading h2 { margin:0; font-size:17px; }\n.pill { display:inline-flex; align-items:center; gap:2px; white-space:nowrap; font-size:9px; border-radius:999px; padding:3px 6px; background:color-mix(in srgb,var(--kp-grey) 9%,transparent); color:var(--kp-grey); }\n.pill ha-icon { --mdc-icon-size:12px; color:currentColor; }\n.pill.ok { color:var(--kp-green); background:color-mix(in srgb,var(--kp-green) 10%,transparent); }\n.pill.warn { color:var(--kp-yellow); background:color-mix(in srgb,var(--kp-yellow) 10%,transparent); }\n.pill.bad { color:var(--kp-red); background:color-mix(in srgb,var(--kp-red) 10%,transparent); }\n.big-rates { display:grid; grid-template-columns:1fr 1fr; gap:5px; margin:10px 0 8px; }\n.big-rates span { min-width:0; font-size:12px; font-weight:750; }\n.big-rates small { display:block; font-size:8px; color:var(--kp-muted); }\n.mini-grid,.radio-grid,.detail-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:5px; }\n.radio-grid { grid-template-columns:repeat(2,minmax(0,1fr)); margin:7px 0; }\n.metric { min-width:0; border-radius:11px; padding:6px 7px; background:color-mix(in srgb,var(--primary-text-color) 3.5%,transparent); cursor:default; outline:none; }\n.metric:focus { box-shadow:0 0 0 2px var(--kp-blue); }\n.metric span,.metric strong,.metric small { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }\n.metric span { font-size:8px; color:var(--kp-muted); }\n.metric strong { font-size:10.5px; margin-top:1px; }\n.metric small { font-size:8px; color:var(--kp-muted); }\n.metric-unknown strong { color:var(--kp-grey); font-weight:600; }\n.signal-summary { display:grid; grid-template-columns:auto 1fr; gap:0 5px; align-items:baseline; margin:8px 0 5px; }\n.signal-summary span { font-size:8px; color:var(--kp-muted); }\n.signal-summary strong { font-size:12px; }\n.signal-summary small { grid-column:1 / -1; font-size:9px; color:var(--kp-muted); }\n.signal-summary .ok,.signal-banner.ok strong { color:var(--kp-green); }\n.signal-summary .warn,.signal-banner.warn strong { color:var(--kp-yellow); }\n.signal-summary .bad,.signal-banner.bad strong { color:var(--kp-red); }\n.signal-summary .unknown,.signal-banner.unknown strong { color:var(--kp-grey); }\n.failover-strip { padding:12px; }\n.failover-main { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }\n.failover-main div,.reason { min-width:0; }\n.failover-main span,.reason span { display:block; font-size:9px; color:var(--kp-muted); }\n.failover-main strong,.reason strong { font-size:12px; display:block; }\n.failover-main small { color:var(--kp-muted); font-size:8px; }\n.reason { margin-top:7px; padding-top:7px; border-top:1px solid var(--kp-border); }\n.detail-card,.traffic-summary,.chart-card,.failover-hero,.event-card,.system-hero,.diagnostics-card,.diagnostic-actions { padding:14px; }\n.detail-grid { margin-top:10px; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; }\n.detail-grid .metric { padding:9px; }\n.detail-grid .metric span { font-size:10px; }\n.detail-grid .metric strong { font-size:12px; }\n.signal-banner { margin-top:10px; border-radius:14px; padding:9px 10px; background:color-mix(in srgb,var(--kp-grey) 6%,transparent); }\n.signal-banner span,.signal-banner strong,.signal-banner small { display:block; }\n.signal-banner span { font-size:9px; color:var(--kp-muted); }\n.signal-banner strong { font-size:16px; }\n.signal-banner small { font-size:9px; color:var(--kp-muted); }\n.hint { margin:0 5px; color:var(--kp-muted); font-size:10px; }\n.period-switch { display:flex; gap:3px; }\n.period { border:1px solid var(--kp-border); background:transparent; color:var(--kp-muted); border-radius:999px; padding:4px 8px; font-size:10px; }\n.period.selected { background:color-mix(in srgb,var(--kp-blue) 14%,transparent); color:var(--kp-blue); border-color:color-mix(in srgb,var(--kp-blue) 40%,var(--kp-border)); }\n.traffic-totals { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:11px; }\n.traffic-totals > div { padding:10px; border-radius:14px; background:color-mix(in srgb,var(--primary-text-color) 3.5%,transparent); }\n.traffic-totals span,.traffic-totals strong,.traffic-totals small { display:block; }\n.traffic-totals span { font-size:9px; color:var(--kp-muted); }\n.traffic-totals strong { font-size:15px; margin:2px 0; }\n.traffic-totals small { font-size:9px; color:var(--kp-muted); }\n.live-rate { color:var(--kp-muted); font-size:10px; text-align:right; }\n.chart-wrap { margin-top:8px; }\n.chart-wrap svg { width:100%; height:auto; max-height:180px; }\n.axis { stroke:var(--kp-border); stroke-width:1; }\n.series { fill:none; stroke-width:3; vector-effect:non-scaling-stroke; stroke-linecap:round; stroke-linejoin:round; }\n.series-0 { stroke:var(--kp-blue); }\n.series-1 { stroke:var(--kp-green); }\n.chart-legend { display:flex; gap:12px; align-items:center; font-size:9px; color:var(--kp-muted); }\n.chart-legend span { display:flex; align-items:center; gap:4px; }\n.chart-legend i { width:12px; height:3px; border-radius:3px; }\n.legend-0 { background:var(--kp-blue); }\n.legend-1 { background:var(--kp-green); }\n.chart-legend .scale { margin-left:auto; }\n.chart-empty { min-height:110px; display:flex; align-items:center; justify-content:center; gap:6px; color:var(--kp-muted); font-size:12px; }\n.failover-kpis { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px; }\n.failover-kpis > div { padding:10px; border-radius:14px; background:color-mix(in srgb,var(--primary-text-color) 3.5%,transparent); }\n.failover-kpis span,.failover-kpis strong,.failover-kpis small { display:block; }\n.failover-kpis span { color:var(--kp-muted); font-size:9px; }\n.failover-kpis strong { font-size:13px; }\n.failover-kpis small { color:var(--kp-muted); font-size:9px; }\n.event-list { margin-top:8px; }\n.event { display:grid; grid-template-columns:48px 1fr; gap:7px; padding:9px 0; border-top:1px solid var(--kp-border); }\n.event:first-child { border-top:0; }\n.event-time { font-weight:800; color:var(--kp-blue); font-size:12px; }\n.event strong,.event span { display:block; }\n.event strong { font-size:12px; }\n.event span { color:var(--kp-muted); font-size:9px; margin-top:2px; }\n.system-meta { display:flex; gap:8px; color:var(--kp-muted); font-size:10px; margin-top:5px; }\n.integrity-card { padding:13px; }\n.integrity-card > div { display:flex; gap:8px; align-items:center; }\n.integrity-card ha-icon { --mdc-icon-size:24px; }\n.integrity-card strong,.integrity-card span { display:block; }\n.integrity-card strong { font-size:14px; }\n.integrity-card span,.integrity-card > small { color:var(--kp-muted); font-size:9px; }\n.integrity-card.ok ha-icon { color:var(--kp-green); }\n.integrity-card.warn ha-icon { color:var(--kp-yellow); }\n.integrity-card.bad ha-icon { color:var(--kp-red); }\n.diag-list { margin-top:8px; }\n.diag-row { display:grid; grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr); gap:8px; padding:8px 0; border-top:1px solid var(--kp-border); outline:none; }\n.diag-row:first-child { border-top:0; }\n.diag-row > div:last-child { text-align:right; }\n.diag-row strong,.diag-row small,.diag-row span { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }\n.diag-row strong { font-size:11px; }\n.diag-row small { font-size:8px; color:var(--kp-muted); }\n.source-tag { display:inline-block !important; width:max-content; margin-left:auto; padding:1px 5px; border-radius:999px; background:color-mix(in srgb,var(--kp-blue) 10%,transparent); color:var(--kp-blue); font-size:8px; }\n.diag-row.warn > div:last-child strong { color:var(--kp-yellow); }\n.diag-row.bad > div:last-child strong { color:var(--kp-red); }\n.diag-row.neutral > div:last-child strong { color:var(--kp-grey); }\n.diagnostic-actions { display:flex; justify-content:space-between; gap:10px; align-items:center; }\n.diagnostic-actions > div { display:flex; gap:8px; align-items:center; }\n.diagnostic-actions ha-icon { color:var(--kp-blue); }\n.diagnostic-actions strong,.diagnostic-actions span { display:block; }\n.diagnostic-actions strong { font-size:12px; }\n.diagnostic-actions span { font-size:9px; color:var(--kp-muted); }\n.diagnostic-actions button { border:1px solid var(--kp-border); background:color-mix(in srgb,var(--kp-blue) 10%,transparent); color:var(--kp-blue); border-radius:12px; padding:8px 10px; }\n.bottom-nav { position:fixed; left:50%; transform:translateX(-50%); bottom:max(8px,env(safe-area-inset-bottom)); width:min(calc(100% - 20px),520px); display:grid; grid-template-columns:repeat(5,1fr); padding:6px; gap:2px; background:color-mix(in srgb,var(--kp-surface) 92%,transparent); backdrop-filter:blur(18px); border:1px solid var(--kp-border); border-radius:20px; box-shadow:0 8px 28px color-mix(in srgb,#000 18%,transparent); z-index:10; }\n.bottom-nav button { border:0; background:transparent; color:var(--kp-muted); border-radius:14px; min-height:48px; display:grid; place-items:center; align-content:center; gap:1px; padding:4px 2px; }\n.bottom-nav button.active { color:var(--kp-blue); background:color-mix(in srgb,var(--kp-blue) 10%,transparent); }\n.bottom-nav ha-icon { --mdc-icon-size:21px; }\n.bottom-nav span { font-size:9px; font-weight:700; }\n.loading,.fatal { min-height:60vh; display:flex; align-items:center; justify-content:center; gap:8px; flex-direction:column; text-align:center; color:var(--kp-muted); }\n.fatal ha-icon { color:var(--kp-red); --mdc-icon-size:40px; }\n.fatal strong { color:var(--primary-text-color); }\n.fatal button { border:0; border-radius:12px; padding:8px 12px; background:var(--kp-blue); color:var(--text-primary-color,#fff); }\n.spin { animation:spin 1s linear infinite; }\n@keyframes spin { to { transform:rotate(360deg); } }\n.bad-text { color:var(--kp-red); }\n@media (min-width:760px) {\n  .view { grid-template-columns:repeat(2,minmax(0,1fr)); }\n  .overview .hero-card,.overview .integrity-banner,.overview .wan-pair,.overview .failover-strip,.traffic-summary,.failover-hero,.system-hero,.integrity-card,.diagnostic-actions,.hint { grid-column:1 / -1; }\n  .wan-pair { grid-template-columns:1fr 1fr; }\n  .detail-card,.chart-card,.event-card,.diagnostics-card { align-self:start; }\n  .detail-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }\n}\n@media (max-width:390px) {\n  .shell { padding-left:8px; padding-right:8px; }\n  .app-header { align-items:center; }\n  .telemetry-chip { max-width:118px; padding:6px 7px; }\n  .telemetry-chip span { font-size:9px; }\n  h1 { font-size:20px; }\n  .hero-value { font-size:24px; }\n  .wan-pair { gap:7px; }\n  .channel-card { padding:9px; }\n  .pill { max-width:76px; overflow:hidden; text-overflow:ellipsis; }\n}\n@media (max-width:340px) { .wan-pair { grid-template-columns:1fr; } }\n@media (prefers-reduced-motion:reduce) { .spin { animation:none; } }\n";
const PANEL_VERSION = "0.1.0";
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
const APP_SHELL_VERSION = "0.4.1";
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

function openHomeAssistantMenu(target) {
  target.dispatchEvent(
    new CustomEvent("hass-toggle-menu", {
      bubbles: true,
      composed: true,
    }),
  );
}

class KeeneticHeroAppPanelV040 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._panel = null;
    this._route = null;
    this._child = null;
    this._activeView = this._viewFromLocation();
    this._hashListener = () => {
      this._activeView = this._viewFromLocation();
      this._renderTabBar();
    };
  }

  set hass(value) {
    this._hass = value;
    this._ensureChild();
    if (this._child) this._child.hass = value;
  }

  set panel(value) {
    this._panel = value;
    this._ensureChild();
    if (this._child) this._child.panel = value;
  }

  set route(value) {
    this._route = value;
    this._ensureChild();
    if (this._child) this._child.route = value;
  }

  connectedCallback() {
    this._renderShell();
    this._ensureChild();
    window.addEventListener("hashchange", this._hashListener);
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this._hashListener);
  }

  _viewFromLocation() {
    const value = (location.hash || "#overview").slice(1).toLowerCase();
    return ["overview", "wan", "failover", "traffic", "diagnostics", "system"].includes(value)
      ? value
      : "overview";
  }

  _ensureChild() {
    if (!this.isConnected) return;
    if (!this._child) {
      this._child = document.createElement("keenetic-hero-panel");
      this.shadowRoot.getElementById("app-content")?.appendChild(this._child);
    }
    if (this._hass) this._child.hass = this._hass;
    if (this._panel) this._child.panel = this._panel;
    if (this._route) this._child.route = this._route;
  }

  _setView(view) {
    history.replaceState(null, "", `${location.pathname}${location.search}#${view}`);
    this._activeView = view;
    if (this._child) {
      this._child._view = view;
      this._child._scheduleRender?.();
      this._child._loadViewData?.();
    }
    this._renderTabBar();
    this.shadowRoot.getElementById("app-content")?.scrollTo({ top: 0, behavior: "auto" });
  }

  _renderTabBar() {
    const nav = this.shadowRoot.getElementById("nika-tabbar");
    if (!nav) return;
    const items = [
      ["overview", "mdi:view-dashboard-outline", "Обзор"],
      ["wan", "mdi:wan", "Каналы"],
      ["failover", "mdi:swap-horizontal-bold", "Failover"],
      ["traffic", "mdi:chart-timeline-variant", "Трафик"],
      ["diagnostics", "mdi:stethoscope", "Диагн."],
    ];
    const active = this._activeView === "system" ? "diagnostics" : this._activeView;
    nav.innerHTML = items
      .map(
        ([view, icon, label]) => `<button type="button" data-view="${view}" class="${active === view ? "active" : ""}" aria-current="${active === view ? "page" : "false"}">
          <ha-icon icon="${icon}"></ha-icon><span>${label}</span>
        </button>`,
      )
      .join("");
    nav.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => this._setView(button.dataset.view));
    });
  }

  _renderShell() {
    if (this.shadowRoot.getElementById("nika-app-shell")) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100dvh;
          min-height: 100%;
          color: var(--primary-text-color);
          background: var(--primary-background-color);
          --shell-surface: var(--ha-card-background, var(--card-background-color, #fff));
          --shell-border: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
          --shell-muted: var(--secondary-text-color, #6b7280);
          --shell-accent: var(--primary-color, #03a9f4);
        }
        * { box-sizing: border-box; }
        #nika-app-shell {
          height: 100%;
          min-height: 0;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          overflow: hidden;
          background: var(--primary-background-color);
        }
        .nika-header {
          min-height: 56px;
          display: grid;
          grid-template-columns: 52px 1fr 52px;
          align-items: center;
          gap: 4px;
          padding: max(4px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) 4px max(8px, env(safe-area-inset-left));
          background: var(--shell-surface);
          border-bottom: 1px solid var(--shell-border);
          z-index: 2;
        }
        .menu, .refresh {
          min-width: 44px;
          min-height: 44px;
          border: 0;
          border-radius: 14px;
          background: transparent;
          color: var(--primary-text-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          font: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .menu { justify-self: start; }
        .refresh { justify-self: end; }
        .menu ha-icon, .refresh ha-icon { --mdc-icon-size: 24px; }
        .title { min-width: 0; text-align: center; line-height: 1.1; }
        .title strong {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 17px;
          font-weight: 750;
        }
        .title span {
          display: block;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--shell-muted);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .02em;
        }
        #app-content {
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior-y: contain;
          -webkit-overflow-scrolling: touch;
        }
        keenetic-hero-panel { display: block; min-height: 100%; }
        .nika-tabbar {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 2px;
          padding: 6px max(6px, env(safe-area-inset-right)) calc(6px + env(safe-area-inset-bottom)) max(6px, env(safe-area-inset-left));
          background: var(--shell-surface);
          border-top: 1px solid var(--shell-border);
          box-shadow: 0 -3px 14px color-mix(in srgb, #000 8%, transparent);
          z-index: 3;
        }
        .nika-tabbar button {
          min-width: 0;
          min-height: 56px;
          border: 0;
          border-radius: 14px;
          background: transparent;
          color: var(--shell-muted);
          display: grid;
          place-items: center;
          align-content: center;
          gap: 2px;
          padding: 4px 2px;
          font: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .nika-tabbar button.active {
          color: var(--shell-accent);
          background: color-mix(in srgb, var(--shell-accent) 11%, transparent);
        }
        .nika-tabbar ha-icon { --mdc-icon-size: 22px; }
        .nika-tabbar span {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 9px;
          font-weight: 700;
        }
      </style>
      <div id="nika-app-shell">
        <header class="nika-header" aria-label="Keenetic">
          <button type="button" class="menu" id="nika-menu" aria-label="Открыть меню Home Assistant">
            <ha-icon icon="mdi:menu"></ha-icon>
          </button>
          <div class="title">
            <strong>Keenetic Hero 4G+</strong>
            <span>Network Control Center · UI v${APP_SHELL_VERSION}</span>
          </div>
          <button type="button" class="refresh" id="nika-refresh" aria-label="Обновить">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </button>
        </header>
        <div id="app-content"></div>
        <nav class="nika-tabbar" id="nika-tabbar" aria-label="Разделы Keenetic"></nav>
      </div>`;

    this.shadowRoot.getElementById("nika-menu")?.addEventListener("click", (event) => {
      openHomeAssistantMenu(event.currentTarget);
    });
    this.shadowRoot.getElementById("nika-refresh")?.addEventListener("click", () => {
      this._child?._loadBootstrap?.(false);
    });
    this._renderTabBar();
  }
}

if (!customElements.get("keenetic-hero-app-panel-v040")) {
  customElements.define("keenetic-hero-app-panel-v040", KeeneticHeroAppPanelV040);
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v040.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v041.js
(() => {
const BASE_COMPONENT = customElements.get("keenetic-hero-app-panel-v040");

function openHomeAssistantMenu(target) {
  target.dispatchEvent(
    new CustomEvent("hass-toggle-menu", {
      bubbles: true,
      composed: true,
    }),
  );
}

if (BASE_COMPONENT && !customElements.get("keenetic-hero-app-panel-v041")) {
  class KeeneticHeroAppPanelV041 extends BASE_COMPONENT {
    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      const oldButton = root?.getElementById("nika-back");
      if (!oldButton || oldButton.dataset.haMenuButton === "true") return;

      const menuButton = oldButton.cloneNode(true);
      menuButton.dataset.haMenuButton = "true";
      menuButton.id = "nika-menu";
      menuButton.className = "back";
      menuButton.setAttribute("aria-label", "Открыть меню Home Assistant");
      menuButton.innerHTML = '<ha-icon icon="mdi:menu"></ha-icon>';
      oldButton.replaceWith(menuButton);

      menuButton.addEventListener("click", () => openHomeAssistantMenu(menuButton));

      const version = root?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.1";
    }
  }

  customElements.define("keenetic-hero-app-panel-v041", KeeneticHeroAppPanelV041);
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v041.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v042.js
(() => {
function installLegacyTimeHelpers() {
  if (typeof globalThis.formatAgo !== "function") {
    globalThis.formatAgo = (dateValue) => {
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
    };
  }
}

installLegacyTimeHelpers();

const CORE_COMPONENT = customElements.get("keenetic-hero-panel");
if (CORE_COMPONENT && !CORE_COMPONENT.prototype.__nikaFailoverTimeoutV042) {
  CORE_COMPONENT.prototype.__nikaFailoverTimeoutV042 = true;
  const loadFailoverHistoryBase = CORE_COMPONENT.prototype._loadFailoverHistory;

  CORE_COMPONENT.prototype._loadFailoverHistory = async function (...args) {
    if (this._failoverTimedOutV042) return;
    let timer;
    const timeout = new Promise((resolve) => {
      timer = window.setTimeout(() => resolve("timeout"), 8000);
    });
    const work = Promise.resolve(loadFailoverHistoryBase.apply(this, args)).then(() => "done");
    const result = await Promise.race([work, timeout]);
    window.clearTimeout(timer);
    if (result === "timeout") {
      this._failoverTimedOutV042 = true;
      this._failoverLoading = false;
      this._failoverError = "HA Recorder не ответил за 8 с";
      this._scheduleRender?.();
    }
  };
}

const BASE_COMPONENT = customElements.get("keenetic-hero-app-panel-v041");
if (BASE_COMPONENT && !customElements.get("keenetic-hero-app-panel-v042")) {
  class KeeneticHeroAppPanelV042 extends BASE_COMPONENT {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.2";
    }
  }
  customElements.define("keenetic-hero-app-panel-v042", KeeneticHeroAppPanelV042);
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v042.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v043.js
(() => {
const CORE_COMPONENT = customElements.get("keenetic-hero-panel");
if (CORE_COMPONENT && !CORE_COMPONENT.prototype.__nikaRecorderDisabledV043) {
  CORE_COMPONENT.prototype.__nikaRecorderDisabledV043 = true;
  CORE_COMPONENT.prototype._loadFailoverHistory = async function () {
    this._failoverLoading = false;
    this._failoverHistory = [];
    this._failoverError = "История HA Recorder временно отключена в UI v0.4.3";
    this._scheduleRender?.();
  };
}

const BASE_COMPONENT = customElements.get("keenetic-hero-app-panel-v042");
if (BASE_COMPONENT && !customElements.get("keenetic-hero-app-panel-v043")) {
  class KeeneticHeroAppPanelV043 extends BASE_COMPONENT {
    _renderShell() {
      super._renderShell();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.3";
    }
  }
  customElements.define("keenetic-hero-app-panel-v043", KeeneticHeroAppPanelV043);
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v043.js

// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v044.js
(() => {
const BASE_COMPONENT_V044 = customElements.get("keenetic-hero-app-panel-v043");
const PARENT_ROUTE_V044 = "/dashboard-infrastructure/overview";

function navigateExplicitV044(path) {
  if (!path) return;
  history.pushState(null, "", path);
  window.dispatchEvent(new Event("location-changed"));
}

if (BASE_COMPONENT_V044 && !customElements.get("keenetic-hero-app-panel-v044")) {
  class KeeneticHeroAppPanelV044 extends BASE_COMPONENT_V044 {
    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;

      // NikaS navigation contract: explicit Back exits the specialized app.
      const currentLeft = root.getElementById("nika-menu") || root.getElementById("nika-back");
      if (currentLeft && currentLeft.dataset.nikasBackV044 !== "true") {
        const back = currentLeft.cloneNode(false);
        back.id = "nika-back";
        back.className = "back";
        back.dataset.nikasBackV044 = "true";
        back.setAttribute("type", "button");
        back.setAttribute("aria-label", "Назад в Инфраструктуру");
        back.innerHTML = '<ha-icon icon="mdi:arrow-left"></ha-icon><span>Назад</span>';
        currentLeft.replaceWith(back);
        back.addEventListener("click", () => {
          navigateExplicitV044(this._panel?.config?.parent_route || PARENT_ROUTE_V044);
        });
      }

      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.4.4";

      if (!root.querySelector("style[data-nikas-shell-v044]")) {
        const style = document.createElement("style");
        style.dataset.nikasShellV044 = "true";
        style.textContent = `
          :host {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          }
          #nika-app-shell {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            overflow-x: hidden;
          }
          .nika-header {
            width: 100%;
            min-width: 0;
            grid-template-columns: 84px minmax(0, 1fr) 84px !important;
            gap: 0 !important;
          }
          .nika-header .back,
          .nika-header .refresh {
            width: 84px;
            min-width: 44px;
            min-height: 44px;
          }
          .nika-header .back {
            justify-self: start;
            justify-content: flex-start;
            padding: 0 6px;
          }
          .nika-header .refresh {
            justify-self: end;
            justify-content: flex-end;
            padding: 0 6px;
          }
          .nika-header .title {
            min-width: 0;
            width: 100%;
            justify-self: center;
            text-align: center;
          }
          .nika-header .title strong,
          .nika-header .title span {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          #app-content {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            overflow-x: hidden;
          }
          .nika-tabbar {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
            gap: 0 !important;
            padding-left: max(4px, env(safe-area-inset-left)) !important;
            padding-right: max(4px, env(safe-area-inset-right)) !important;
          }
          .nika-tabbar button {
            min-width: 0;
            min-height: 56px;
            padding-left: 1px;
            padding-right: 1px;
          }
          .nika-tabbar span {
            width: 100%;
            max-width: 100%;
            font-size: clamp(8px, 2.15vw, 9px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          @media (max-width: 390px) {
            .nika-header {
              grid-template-columns: 52px minmax(0, 1fr) 52px !important;
            }
            .nika-header .back,
            .nika-header .refresh {
              width: 52px;
              justify-content: center;
              padding: 0;
            }
            .nika-header .back span {
              display: none !important;
            }
          }
          @media (max-width: 350px) {
            .nika-header .title strong { font-size: 15px; }
            .nika-header .title span { font-size: 8px; }
            .nika-tabbar ha-icon { --mdc-icon-size: 20px; }
          }
        `;
        root.append(style);
      }
    }
  }

  customElements.define("keenetic-hero-app-panel-v044", KeeneticHeroAppPanelV044);
}
})();
// END custom_components/keenetic_hero_4g/frontend/keenetic-app-v044.js
