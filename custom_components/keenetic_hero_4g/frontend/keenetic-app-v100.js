const K100_VERSION = "1.0.3";
const K100_CORE = customElements.get("keenetic-hero-panel");
const K100_ALLOWED = ["/dashboard-house-v11/home", "/dashboard-actions/home", "/dashboard-infrastructure/overview"];
const K100_TABS = [
  ["overview","mdi:view-dashboard-outline","Обзор"],
  ["wan","mdi:web","Каналы"],
  ["failover","mdi:swap-horizontal-bold","Failover"],
  ["traffic","mdi:chart-timeline-variant","Трафик"],
  ["diagnostics","mdi:stethoscope","Диагн."],
];
const K100_VIEW_IDS = new Set([...K100_TABS.map(([view])=>view),"system"]);
function k100ViewFromLocation(){const value=(location.hash||"").slice(1).toLowerCase();return K100_VIEW_IDS.has(value)?value:"overview";}

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
      <img class="k100-router" src="/keenetic_hero_4g_static/assets/keenetic-hero-router-v086.webp?v=1.0.3" alt="Keenetic Hero 4G+">
    </article>
    <div class="k100-reserve ${reserve[0]}"><ha-icon icon="${reserve[1]}"></ha-icon><div><strong>${reserve[2]}</strong><span>${reserve[3]}</span></div></div>
    <article class="k100-active-card">
      <div class="k100-active-head"><ha-icon icon="${active==="lte"?"mdi:radio-tower":active==="ethernet"?"mdi:ethernet":"mdi:lan-disconnect"}"></ha-icon><strong>${k100Esc(activeName)}</strong><span class="${active?"ok":"unknown"}"><i></i>${active?"Активен":"Нет данных"}</span><button data-view="wan"><ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
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
.k100-overview{display:grid;gap:8px;padding:8px 10px 12px;min-height:100%}.k100-hero{position:relative;height:430px;border:1px solid var(--divider-color);border-radius:24px;overflow:hidden;background:url('/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=1.0.3') center/cover no-repeat;box-shadow:0 8px 26px rgba(23,45,76,.08)}
.k100-copy{position:absolute;z-index:8;left:16px;top:14px;max-width:48%}.k100-copy h1{margin:0 0 3px;font-size:25px;line-height:1.04}.k100-copy p{margin:0;font-size:14px;font-weight:650;color:var(--secondary-text-color)}
.k100-indicator{position:absolute;z-index:9;right:14px;top:14px;width:174px;padding:11px 14px;border:1px solid;border-radius:18px;background:var(--card-background-color)}.k100-indicator strong,.k100-indicator span{display:block}.k100-indicator strong{font-size:16px}.k100-indicator span{margin-top:6px;font-size:13px;font-weight:600;color:var(--secondary-text-color)}.k100-indicator i,.k100-active-head i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:8px;background:currentColor}.k100-indicator.ok{color:#2fb878;border-color:#9ce4c5;background:rgba(232,249,241,.94)}.k100-indicator.warn{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.94)}.k100-indicator.bad{color:#d95d63;border-color:#efb8ba;background:rgba(255,238,239,.94)}
.k100-lines{position:absolute;inset:0;z-index:3;width:100%;height:100%}.k100-lines path{fill:none;stroke:#9aa3ab;stroke-width:7;stroke-linecap:round;stroke-dasharray:8 13}.k100-lines path.active{stroke:#2fbd7c;stroke-dasharray:none}.k100-lines path.standby{stroke:#16a4db}.k100-lines path.down{stroke:#dc6267;opacity:.65}
.k100-router{position:absolute;z-index:6;left:50%;top:61%;transform:translate(-50%,-50%);width:42%;max-width:290px;filter:drop-shadow(0 10px 9px rgba(65,45,30,.18));pointer-events:none}.k100-channel{position:absolute;z-index:8;display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:18px;background:rgba(255,255,255,.94);box-shadow:0 8px 20px rgba(23,45,76,.09);min-width:145px}.k100-channel ha-icon{--mdc-icon-size:28px}.k100-channel strong,.k100-channel span{display:block}.k100-channel strong{font-size:15px}.k100-channel span{font-size:12px;margin-top:3px;color:var(--secondary-text-color)}.k100-channel.active{color:#2fbd7c}.k100-channel.standby{color:#139ed1}.k100-channel.down{color:#d95d63}.k100-channel.unknown{color:#7e8993}.k100-lte{left:50%;top:31%;transform:translate(-50%,-50%)}.k100-eth{left:3%;top:58%}.k100-lan{right:3%;top:58%}
.k100-reserve,.k100-alert{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid;border-radius:20px}.k100-reserve ha-icon,.k100-alert ha-icon{--mdc-icon-size:30px}.k100-reserve strong,.k100-reserve span,.k100-alert strong,.k100-alert span{display:block}.k100-reserve strong,.k100-alert strong{font-size:16px}.k100-reserve span,.k100-alert span{font-size:13px;margin-top:2px;color:var(--secondary-text-color)}.k100-reserve.ok{color:#279f69;border-color:#9fe4c8;background:rgba(232,249,241,.9)}.k100-reserve.bad,.k100-alert.bad{color:#d95d63;border-color:#efb8ba;background:rgba(255,238,239,.94)}.k100-reserve.unknown{color:#69757f;border-color:#cdd3d8;background:rgba(248,249,250,.94)}.k100-alert.warn{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.94)}.k100-alert.hidden{display:none}
.k100-active-card{border:1px solid color-mix(in srgb,var(--primary-color) 45%,var(--divider-color));border-radius:22px;background:var(--card-background-color);overflow:hidden}.k100-active-head{min-height:58px;display:flex;align-items:center;gap:9px;padding:10px 14px}.k100-active-head>ha-icon{color:var(--primary-color);--mdc-icon-size:28px}.k100-active-head>strong{font-size:20px}.k100-active-head>span{font-size:14px;font-weight:700;color:#2fb878}.k100-active-head button{margin-left:auto;border:0;background:none;color:var(--primary-color);padding:7px}.k100-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--divider-color)}.k100-metric{min-height:72px;padding:12px;display:flex;align-items:center;gap:9px;border-right:1px solid var(--divider-color);border-bottom:1px solid var(--divider-color)}.k100-metric:nth-child(3n){border-right:0}.k100-metric ha-icon{color:var(--primary-color);--mdc-icon-size:25px}.k100-metric span,.k100-metric strong{display:block}.k100-metric span{font-size:12px;color:var(--secondary-text-color);font-weight:650}.k100-metric strong{font-size:15px;margin-top:2px}.k100-metric.wide{grid-column:span 2}.k100-alert{margin-bottom:2px}
@media(max-width:430px){.k100-overview{gap:5px;padding:5px 10px 6px}.k100-hero{height:350px;background-size:auto 430px;background-position:center top}.k100-lines{height:430px}.k100-copy{max-width:50%;left:13px;top:12px}.k100-copy h1{font-size:24px}.k100-indicator{right:10px;top:10px;width:164px}.k100-router{top:260px;width:40%;max-width:245px}.k100-channel{min-width:132px;padding:9px 10px}.k100-lte{top:122px}.k100-eth,.k100-lan{top:240px}.k100-reserve{padding:9px 14px}.k100-active-head{min-height:50px;padding:7px 12px}.k100-grid{grid-template-columns:repeat(3,1fr)}.k100-metric{min-height:62px;padding:7px 8px}.k100-metric strong{font-size:14px}}
@media(max-width:390px){.k100-hero{height:342px;background-size:auto 420px}.k100-lines{height:420px}.k100-copy h1{font-size:22px}.k100-router{top:253px;max-width:232px}.k100-lte{top:118px}.k100-eth,.k100-lan{top:234px}}
`;root.append(s);}

class KeeneticHeroAppPanelV100 extends HTMLElement{
  constructor(){super();this.attachShadow({mode:"open"});this._hass=null;this._panel=null;this._route=null;this._child=null;this._view=k100ViewFromLocation();this._scale=1;this._returnRoute=null;this._pinch=null;this._sentPanel=null;this._sentRoute=null;this._sentHass=null;this._hashHandler=()=>{const view=k100ViewFromLocation();if(view!==this._view)this._setView(view,false);};}
  set hass(v){this._hass=v;this._mount();this._syncChild();} set panel(v){this._panel=v;if(!this._returnRoute){this._returnRoute=k100Return(v);localStorage.setItem("nikas.keenetic.return_route.v1",this._returnRoute);}this._mount();this._syncChild();} set route(v){this._route=v;this._mount();this._syncChild();}
  connectedCallback(){this._mount();this._bind();this._bindScrollBoundaryGuard();window.addEventListener("hashchange",this._hashHandler);}
  disconnectedCallback(){this._unbind();this._unbindScrollBoundaryGuard();window.removeEventListener("hashchange",this._hashHandler);}

  _bindScrollBoundaryGuard(){
    if(this._scrollGuardBound)return;
    const work=this.shadowRoot.getElementById("k100-work");if(!work)return;
    this._scrollGuardBound=true;this._scrollTouchY=null;
    this._scrollStart=e=>{if(e.touches?.length===1)this._scrollTouchY=e.touches[0].clientY;};
    this._scrollMove=e=>{if(e.touches?.length!==1||this._scrollTouchY===null)return;const y=e.touches[0].clientY;const dy=y-this._scrollTouchY;const atTop=work.scrollTop<=0;const atBottom=work.scrollTop+work.clientHeight>=work.scrollHeight-1;if((atTop&&dy>0)||(atBottom&&dy<0)){e.preventDefault();e.stopPropagation();}this._scrollTouchY=y;};
    this._scrollEnd=()=>{this._scrollTouchY=null;};
    work.addEventListener("touchstart",this._scrollStart,{passive:true});work.addEventListener("touchmove",this._scrollMove,{passive:false});work.addEventListener("touchend",this._scrollEnd,{passive:true});work.addEventListener("touchcancel",this._scrollEnd,{passive:true});
  }
  _unbindScrollBoundaryGuard(){const work=this.shadowRoot.getElementById("k100-work");if(work&&this._scrollGuardBound){work.removeEventListener("touchstart",this._scrollStart);work.removeEventListener("touchmove",this._scrollMove);work.removeEventListener("touchend",this._scrollEnd);work.removeEventListener("touchcancel",this._scrollEnd);}this._scrollGuardBound=false;this._scrollTouchY=null;}

  _mount(){if(!this.shadowRoot.getElementById("k100-shell")){this.shadowRoot.innerHTML=`<style>
:host{--safe-top:env(safe-area-inset-top,0px);--safe-bottom:env(safe-area-inset-bottom,0px);display:block;width:100%;height:100%;min-height:0;max-height:100%;overflow:hidden;overscroll-behavior:none;position:relative;background:var(--primary-background-color);font-family:var(--ha-font-family-body,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)}*{box-sizing:border-box}#k100-shell{height:100%;min-height:0;display:grid;overscroll-behavior:none;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden}.k100-header{touch-action:none;overscroll-behavior:none;min-height:calc(62px + var(--safe-top));padding:var(--safe-top) 8px 0;display:grid;grid-template-columns:52px minmax(0,1fr) 52px;align-items:center;background:var(--card-background-color);border-bottom:1px solid var(--divider-color);z-index:20}.k100-side{width:44px;height:44px;border:1px solid var(--divider-color);border-radius:16px;background:var(--card-background-color);box-shadow:0 7px 20px rgba(23,45,76,.08);display:grid;place-items:center}.k100-side ha-icon{--mdc-icon-size:25px}.k100-refresh{justify-self:end;color:var(--primary-color)}.k100-title{justify-self:center;min-width:min(290px,100%);max-width:100%;min-height:44px;padding:5px 14px;border:1px solid color-mix(in srgb,var(--primary-color,#03a9d9) 24%,var(--divider-color));border-radius:16px;background:color-mix(in srgb,var(--primary-color,#03a9d9) 5%,var(--card-background-color));box-shadow:0 5px 16px rgba(23,45,76,.06);text-align:center}.k100-title strong,.k100-title small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k100-title strong{font-size:23px;font-weight:800;line-height:1.08}.k100-title small{font-size:14px;font-weight:560;color:var(--secondary-text-color);margin-top:2px}.k100-title:active{background:color-mix(in srgb,var(--primary-color) 13%,var(--card-background-color));border-color:color-mix(in srgb,var(--primary-color) 42%,var(--divider-color));transform:scale(.985)}.k100-title:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.k100-work{min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior-y:contain;overscroll-behavior-x:none;-webkit-overflow-scrolling:touch;touch-action:pan-y}.k100-stage{min-height:100%;transform-origin:0 0}.k100-stage>keenetic-hero-panel{display:block;min-height:100%}.k100-tabs{touch-action:none;overscroll-behavior:none;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px;padding:6px 6px calc(6px + var(--safe-bottom));background:var(--card-background-color);border-top:1px solid var(--divider-color);box-shadow:0 -4px 18px rgba(23,45,76,.08);z-index:20}.k100-tabs button{min-height:52px;border:0;border-radius:16px;background:transparent;color:var(--secondary-text-color);display:grid;place-items:center;align-content:center;gap:3px}.k100-tabs button.active{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 11%,transparent)}.k100-tabs ha-icon{--mdc-icon-size:28px}.k100-tabs span{font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}@media(max-width:390px){.k100-header{grid-template-columns:48px minmax(0,1fr) 48px;min-height:calc(60px + var(--safe-top))}.k100-title{min-width:0;width:100%;padding-inline:8px}.k100-title strong{font-size:21px}.k100-title small{font-size:13px}}
</style><div id="k100-shell"><header class="k100-header"><button id="k100-menu" class="k100-side" aria-label="Открыть меню Home Assistant"><ha-icon icon="mdi:menu"></ha-icon></button><button id="k100-title" class="k100-title"><strong>Keenetic Hero 4G+</strong><small>UI v1.0.3</small></button><button id="k100-refresh" class="k100-side k100-refresh" aria-label="Обновить"><ha-icon icon="mdi:refresh"></ha-icon></button></header><main id="k100-work" class="k100-work"><div id="k100-stage" class="k100-stage"></div></main><nav id="k100-tabs" class="k100-tabs"></nav></div>`;this.shadowRoot.getElementById("k100-menu").onclick=e=>e.currentTarget.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:true,composed:true}));this.shadowRoot.getElementById("k100-title").onclick=()=>k100Navigate(this._returnRoute||"/dashboard-infrastructure/overview");this.shadowRoot.getElementById("k100-refresh").onclick=()=>this._child?._loadBootstrap?.(false);this._renderTabs();}this._mountChild();}
  _mountChild(){const stage=this.shadowRoot.getElementById("k100-stage");if(!this.isConnected||!stage)return;if(!this._child){this._child=document.createElement("keenetic-hero-panel");this._child.addEventListener("keenetic-view-request",event=>{const view=event.detail?.view;if(!K100_VIEW_IDS.has(view))return;event.preventDefault();this._setView(view);});stage.append(this._child);}this._syncChild();}
  _syncChild(){if(!this._child)return;if(this._panel&&this._sentPanel!==this._panel){this._child.panel=this._panel;this._sentPanel=this._panel;}if(this._route&&this._sentRoute!==this._route){this._child.route=this._route;this._sentRoute=this._route;}if(this._child._view!==this._view)this._child._view=this._view;if(this._hass&&this._sentHass!==this._hass){this._child.hass=this._hass;this._sentHass=this._hass;}}
  _renderTabs(){const nav=this.shadowRoot.getElementById("k100-tabs");if(!nav)return;if(nav.dataset.mounted!=="true"){for(const[v,icon,label]of K100_TABS){const button=document.createElement("button");button.dataset.view=v;button.type="button";const glyph=document.createElement("ha-icon");glyph.setAttribute("icon",icon);const text=document.createElement("span");text.textContent=label;button.append(glyph,text);button.addEventListener("click",()=>this._setView(v));nav.append(button);}nav.dataset.mounted="true";}this._updateTabs();}
  _updateTabs(){this.shadowRoot.querySelectorAll("#k100-tabs button").forEach(button=>{const active=button.dataset.view===this._view||(this._view==="system"&&button.dataset.view==="diagnostics");button.classList.toggle("active",active);if(active)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");});}
  _setView(v,updateLocation=true){if(!K100_VIEW_IDS.has(v))return;this._view=v;if(updateLocation)history.replaceState(null,"",`${location.pathname}${location.search}#${v}`);this._mountChild();if(this._child){this._child._view=v;this._child._showStableViewV075?.(v);this._child._scheduleRender?.();this._child._loadViewData?.();}const viewport=this.shadowRoot.getElementById("k100-work");if(viewport)viewport.scrollTop=0;this._updateTabs();}
  _bind(){this._touchStart=e=>{if(e.touches.length===2){const [a,b]=e.touches;this._pinch={d:Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY),s:this._scale};}};this._touchMove=e=>{if(e.touches.length===2&&this._pinch){e.preventDefault();const[a,b]=e.touches;const d=Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY);this._scale=Math.max(.75,Math.min(2,this._pinch.s*d/this._pinch.d));if(this._scale>=.97&&this._scale<=1.03)this._scale=1;this.shadowRoot.getElementById("k100-stage").style.transform=`scale(${this._scale})`;}};this._touchEnd=e=>{if(e.touches.length<2)this._pinch=null;};const w=this.shadowRoot.getElementById("k100-work");w.addEventListener("touchstart",this._touchStart,{passive:true});w.addEventListener("touchmove",this._touchMove,{passive:false});w.addEventListener("touchend",this._touchEnd,{passive:true});}
  _unbind(){const w=this.shadowRoot.getElementById("k100-work");if(!w)return;w.removeEventListener("touchstart",this._touchStart);w.removeEventListener("touchmove",this._touchMove);w.removeEventListener("touchend",this._touchEnd);}
}
k100InstallCore();if(!customElements.get("keenetic-hero-app-panel-v100"))customElements.define("keenetic-hero-app-panel-v100",KeeneticHeroAppPanelV100);
