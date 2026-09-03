const K100_VERSION = "1.0.6";
const K100_SCALE_MIN = 0.75;
const K100_SCALE_MAX = 2;
const K100_SCALE_SNAP_MIN = 0.97;
const K100_SCALE_SNAP_MAX = 1.03;
const K100_PAN_THRESHOLD = 6;
const K100_TAP_DURATION = 300;
const K100_DOUBLE_TAP_GAP = 420;
const K100_CLICK_GUARD = 460;
const k100Clamp = (value,min,max)=>Math.min(max,Math.max(min,value));
const k100Finite = (value,fallback)=>value!==null&&value!==""&&Number.isFinite(Number(value))?Number(value):fallback;
const K100_CORE = customElements.get("keenetic-hero-panel");
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
function k100Reserve(panel,active){
  if(active==="lte")return ["reserve","mdi:check-circle","Работа через резерв","Основной Ethernet недоступен."];
  const role=active==="ethernet"?"lte":null;
  const c=role?panel._connection(`${role}_connected`):{state:"unknown"};
  const name=role==="lte"?"4G LTE":role==="ethernet"?"Ethernet":"Резерв";
  if(c.state==="up")return ["reserve","mdi:check-circle","Резерв готов",`${name} подключён и готов к работе.`];
  if(c.state==="down")return ["unavailable","mdi:alert-circle-outline","Резерв недоступен",`${name} сейчас недоступен.`];
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
  const channelCaption=(role,c)=>active===role?(role==="ethernet"?"Основной канал":"Активный канал"):c.state==="up"?(role==="lte"?"Резерв готов":"Канал доступен"):c.state==="down"?"Недоступен":"Нет данных";
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
      <div class="k100-channel k100-lte ${channelState("lte",lte)}"><ha-icon icon="mdi:radio-tower"></ha-icon><div><strong>4G LTE</strong><span>${channelCaption("lte",lte)}</span></div></div>
      <div class="k100-channel k100-eth ${channelState("ethernet",eth)}"><ha-icon icon="mdi:ethernet"></ha-icon><div><strong>Кабель</strong><span>${channelCaption("ethernet",eth)}</span></div></div>
      <div class="k100-channel k100-lan active"><ha-icon icon="mdi:lan"></ha-icon><div><strong>LAN</strong><span>Локальная сеть</span></div></div>
      <img class="k100-router" src="/keenetic_hero_4g_static/assets/keenetic-hero-router-v086.webp?v=1.0.6" alt="Keenetic Hero 4G+">
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
:host{height:100%!important;min-height:100%!important}.shell{height:100%!important;min-height:100%!important;display:flex!important;flex-direction:column!important}.shell>main{display:flex!important;flex:1 1 auto;min-height:0!important}.v075-view-slot{width:100%;min-height:100%!important;flex:1 0 auto}
.k100-overview{display:grid;grid-template-rows:minmax(430px,1fr) auto auto auto;gap:8px;padding:8px 10px 12px;min-height:100%}.k100-hero{position:relative;height:auto;min-height:430px;border:1px solid var(--divider-color);border-radius:24px;overflow:hidden;background:url('/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v=1.0.6') center/cover no-repeat;box-shadow:0 8px 26px rgba(23,45,76,.08)}
.k100-copy{position:absolute;z-index:8;left:16px;top:14px;max-width:48%}.k100-copy h1{margin:0 0 3px;font-size:25px;line-height:1.04}.k100-copy p{margin:0;font-size:14px;font-weight:650;color:var(--secondary-text-color)}
.k100-indicator{position:absolute;z-index:9;right:14px;top:14px;width:174px;padding:11px 14px;border:1px solid;border-radius:18px;background:var(--card-background-color)}.k100-indicator strong,.k100-indicator span{display:block}.k100-indicator strong{font-size:16px}.k100-indicator span{margin-top:6px;font-size:13px;font-weight:600;color:var(--secondary-text-color)}.k100-indicator i,.k100-active-head i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:8px;background:currentColor}.k100-indicator.ok{color:#2fb878;border-color:#9ce4c5;background:rgba(232,249,241,.94)}.k100-indicator.warn{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.94)}.k100-indicator.bad{color:#d95d63;border-color:#efb8ba;background:rgba(255,238,239,.94)}
.k100-router{position:absolute;z-index:6;left:50%;top:61%;transform:translate(-50%,-50%);width:42%;max-width:290px;filter:drop-shadow(0 10px 9px rgba(65,45,30,.18));pointer-events:none}.k100-channel{position:absolute;z-index:8;display:flex;align-items:center;gap:9px;padding:10px 12px;border:1px solid transparent;border-radius:18px;background:rgba(255,255,255,.94);box-shadow:0 6px 16px rgba(23,45,76,.08);min-width:145px}.k100-channel ha-icon{--mdc-icon-size:28px}.k100-channel strong,.k100-channel span{display:block}.k100-channel strong{font-size:15px}.k100-channel span{font-size:12px;margin-top:3px;color:var(--secondary-text-color)}.k100-channel.active{color:#279f69;border-color:#9fe4c8;background:rgba(232,249,241,.95)}.k100-channel.standby{color:#168fbd;border-color:#a7dced;background:rgba(235,247,252,.95)}.k100-channel.down{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.95)}.k100-channel.unknown{color:#69757f;border-color:#cdd3d8;background:rgba(248,249,250,.95)}.k100-lte{left:50%;top:31%;transform:translate(-50%,-50%)}.k100-eth{left:3%;top:58%}.k100-lan{right:3%;top:58%}
.k100-reserve,.k100-alert{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid;border-radius:20px}.k100-reserve ha-icon,.k100-alert ha-icon{--mdc-icon-size:30px}.k100-reserve strong,.k100-reserve span,.k100-alert strong,.k100-alert span{display:block}.k100-reserve strong,.k100-alert strong{font-size:16px}.k100-reserve span,.k100-alert span{font-size:13px;margin-top:2px;color:var(--secondary-text-color)}.k100-reserve.reserve{color:#168fbd;border-color:#a7dced;background:rgba(235,247,252,.95)}.k100-reserve.unavailable{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.95)}.k100-reserve.unknown{color:#69757f;border-color:#cdd3d8;background:rgba(248,249,250,.94)}.k100-alert.warn{color:#c58419;border-color:#efcf95;background:rgba(255,248,235,.94)}.k100-alert.bad{color:#d95d63;border-color:#efb8ba;background:rgba(255,238,239,.94)}.k100-alert.hidden{display:none}
.k100-active-card{border:1px solid color-mix(in srgb,var(--primary-color) 45%,var(--divider-color));border-radius:22px;background:var(--card-background-color);overflow:hidden}.k100-active-head{min-height:58px;display:flex;align-items:center;gap:9px;padding:10px 14px}.k100-active-head>ha-icon{color:var(--primary-color);--mdc-icon-size:28px}.k100-active-head>strong{font-size:20px}.k100-active-head>span{font-size:14px;font-weight:700;color:#2fb878}.k100-active-head button{margin-left:auto;border:0;background:none;color:var(--primary-color);padding:7px}.k100-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--divider-color)}.k100-metric{min-height:72px;padding:12px;display:flex;align-items:center;gap:9px;border-right:1px solid var(--divider-color);border-bottom:1px solid var(--divider-color)}.k100-metric:nth-child(3n){border-right:0}.k100-metric ha-icon{color:var(--primary-color);--mdc-icon-size:25px}.k100-metric span,.k100-metric strong{display:block}.k100-metric span{font-size:12px;color:var(--secondary-text-color);font-weight:650}.k100-metric strong{font-size:15px;margin-top:2px}.k100-metric.wide{grid-column:span 2}.k100-alert{margin-bottom:2px}
@media(max-width:430px){.k100-overview{grid-template-rows:minmax(350px,1fr) auto auto auto;gap:5px;padding:5px 10px 6px}.k100-hero{height:auto;min-height:350px;background-size:auto max(430px,100%);background-position:center top}.k100-copy{max-width:50%;left:13px;top:12px}.k100-copy h1{font-size:24px}.k100-indicator{right:10px;top:10px;width:164px}.k100-router{top:min(74%,260px);width:40%;max-width:245px}.k100-channel{min-width:132px;padding:9px 10px}.k100-lte{top:min(35%,122px)}.k100-eth,.k100-lan{top:min(69%,240px)}.k100-reserve{padding:9px 14px}.k100-active-head{min-height:50px;padding:7px 12px}.k100-grid{grid-template-columns:repeat(3,1fr)}.k100-metric{min-height:62px;padding:7px 8px}.k100-metric strong{font-size:14px}}
@media(max-width:390px){.k100-overview{grid-template-rows:minmax(342px,1fr) auto auto auto}.k100-hero{min-height:342px;background-size:auto max(420px,100%)}.k100-copy h1{font-size:22px}.k100-router{top:min(74%,253px);max-width:232px}.k100-lte{top:min(35%,118px)}.k100-eth,.k100-lan{top:min(69%,234px)}}
`;root.append(s);}

class KeeneticHeroAppPanelV100 extends HTMLElement{
  constructor(){super();this.attachShadow({mode:"open"});this._hass=null;this._panel=null;this._route=null;this._child=null;this._view=k100ViewFromLocation();this._zoom={scale:1,x:0,y:0};this._zoomSession=null;this._lastTwoFingerTap=0;this._suppressClicksUntil=0;this._returnRoute=null;this._sentPanel=null;this._sentRoute=null;this._sentHass=null;this._hashHandler=()=>{const view=k100ViewFromLocation();if(view!==this._view)this._setView(view,false);};}
  set hass(v){this._hass=v;this._mount();this._syncChild();} set panel(v){this._panel=v;if(!this._returnRoute)this._returnRoute=captureNikasShellReturnRoute({panelId:"keenetic",parentRoute:v?.config?.parent_route,safeReturnRoute:"/dashboard-infrastructure/overview"});this._mount();this._syncChild();} set route(v){this._route=v;this._mount();this._syncChild();}
  connectedCallback(){this._mount();this._bind();this._bindScrollBoundaryGuard();window.addEventListener("hashchange",this._hashHandler);}
  disconnectedCallback(){this._unbind();this._unbindScrollBoundaryGuard();window.removeEventListener("hashchange",this._hashHandler);}

  _zoomKey(){return `nikas:panel-transform:v2:${location.pathname}:keenetic:panel`;}
  _restoreZoom(){
    let state={scale:1,x:0,y:0};
    let resetTo100=true;
    try{
      const stored=JSON.parse(localStorage.getItem(this._zoomKey())||"null");
      if(stored){
        const scale=k100Clamp(k100Finite(stored.scale,1),K100_SCALE_MIN,K100_SCALE_MAX);
        state={scale,x:k100Finite(stored.x,0),y:k100Finite(stored.y,0)};
        resetTo100=scale>=K100_SCALE_SNAP_MIN&&scale<=K100_SCALE_SNAP_MAX;
      }
    }catch(_error){}
    if(resetTo100)state={scale:1,x:0,y:0};
    else if(state.scale<=1)state={scale:state.scale,x:0,y:0};
    this._zoom=state;
    return resetTo100;
  }
  _saveZoom(){try{localStorage.setItem(this._zoomKey(),JSON.stringify(this._zoom));}catch(_error){}}
  _zoomBounds(scale=this._zoom.scale){
    const viewport=this.shadowRoot.getElementById("k100-work");
    const stage=this.shadowRoot.getElementById("k100-stage");
    if(!viewport||!stage||scale<=1)return{minX:0,minY:0};
    const width=Math.max(stage.offsetWidth,stage.scrollWidth,1);
    const height=Math.max(stage.offsetHeight,stage.scrollHeight,1);
    return{minX:Math.min(0,viewport.clientWidth-width*scale),minY:Math.min(0,viewport.clientHeight-height*scale)};
  }
  _clampZoom(scale,x,y){
    const safeScale=k100Clamp(k100Finite(scale,1),K100_SCALE_MIN,K100_SCALE_MAX);
    if(safeScale<=1)return{scale:safeScale,x:0,y:0};
    const bounds=this._zoomBounds(safeScale);
    return{scale:safeScale,x:k100Clamp(k100Finite(x,0),bounds.minX,0),y:k100Clamp(k100Finite(y,0),bounds.minY,0)};
  }
  _applyZoom(){
    const viewport=this.shadowRoot.getElementById("k100-work");
    const stage=this.shadowRoot.getElementById("k100-stage");
    if(!viewport||!stage)return;
    const zoomed=this._zoom.scale>1.0001;
    if(!zoomed)this._zoom={scale:this._zoom.scale,x:0,y:0};
    viewport.classList.toggle("zoomed",zoomed);
    stage.style.transform=Math.abs(this._zoom.scale-1)<.0001?"none":`translate3d(${this._zoom.x}px,${this._zoom.y}px,0) scale(${this._zoom.scale})`;
  }
  _clampAndApplyZoom(persist=true){this._zoom=this._clampZoom(this._zoom.scale,this._zoom.x,this._zoom.y);this._applyZoom();if(persist)this._saveZoom();}
  _showScaleStatus(){
    const status=this.shadowRoot.getElementById("k100-scale-status");if(!status)return;
    status.classList.add("visible");clearTimeout(this._scaleStatusTimer);this._scaleStatusTimer=setTimeout(()=>status.classList.remove("visible"),1100);
  }
  _resetZoom(showStatus=false){
    this._zoom={scale:1,x:0,y:0};
    const viewport=this.shadowRoot.getElementById("k100-work");if(viewport){viewport.scrollLeft=0;viewport.scrollTop=0;}
    this._applyZoom();this._saveZoom();if(showStatus)this._showScaleStatus();
  }
  _resetZoomPosition(){
    const viewport=this.shadowRoot.getElementById("k100-work");if(viewport){viewport.scrollLeft=0;viewport.scrollTop=0;}
    this._zoom=this._clampZoom(this._zoom.scale,0,0);this._applyZoom();this._saveZoom();
  }
  _cancelPendingHold(target){
    if(!target?.dispatchEvent)return;
    const init={bubbles:true,composed:true,cancelable:false,pointerType:"touch"};
    target.dispatchEvent(typeof PointerEvent==="function"?new PointerEvent("pointercancel",init):new Event("pointercancel",init));
  }
  _guardActivation(event){
    if(Date.now()>=this._suppressClicksUntil)return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
  }

  _bindScrollBoundaryGuard(){
    if(this._scrollGuardCleanup)return;
    const viewport=this.shadowRoot.getElementById("k100-work");if(!viewport)return;
    this._scrollGuardCleanup=createNikasShellScrollBoundaryGuard({host:this,viewport});
  }
  _unbindScrollBoundaryGuard(){this._scrollGuardCleanup?.();this._scrollGuardCleanup=null;}

  _mount(){if(!this.shadowRoot.getElementById("k100-shell")){this.shadowRoot.innerHTML=`<style data-k100-shell-v106>${nikasShellV2Styles()}
.k100-stage{position:relative;display:flex;will-change:transform}.k100-work.zoomed .k100-stage{position:absolute;inset-inline-start:0;inset-block-start:0}.k100-stage>keenetic-hero-panel{display:block;inline-size:100%;block-size:100%;min-block-size:100%;flex:1 0 100%}
.k100-scale-status{position:absolute;z-index:90;inset-inline-start:50%;inset-block-end:calc(76px + env(safe-area-inset-bottom,0px));transform:translate(-50%,10px);opacity:0;pointer-events:none;padding:9px 14px;border-radius:999px;background:rgba(20,27,34,.88);color:#fff;font-size:13px;font-weight:720;white-space:nowrap;transition:opacity .14s ease,transform .14s ease}.k100-scale-status.visible{opacity:1;transform:translate(-50%,0)}
@media(prefers-reduced-motion:reduce){.k100-scale-status{transition:none}}
</style><div id="k100-shell" class="nikas-shell"><header class="k100-header nikas-shell__header"><button id="k100-menu" class="k100-side nikas-shell__side-action" type="button" aria-label="Открыть меню Home Assistant"><ha-icon icon="mdi:menu"></ha-icon></button><button id="k100-title" class="k100-title nikas-shell__title" type="button" aria-label="Вернуться в исходную базовую панель NikaS"><strong>Keenetic Hero 4G+</strong><small>UI v1.0.6</small></button><button id="k100-refresh" class="k100-side k100-refresh nikas-shell__side-action nikas-shell__side-action--right" type="button" aria-label="Обновить"><ha-icon icon="mdi:refresh"></ha-icon></button></header><main id="k100-work" class="k100-work nikas-shell__viewport" aria-label="Рабочая область панели Keenetic"><div id="k100-stage" class="k100-stage nikas-shell__canvas nikas-shell__content"></div></main><nav id="k100-tabs" class="k100-tabs nikas-shell__tabs" style="--nikas-shell-tab-count:5" aria-label="Основные разделы"></nav><div id="k100-scale-status" class="k100-scale-status" role="status" aria-live="polite">Масштаб 100%</div></div>`;
      this.shadowRoot.getElementById("k100-menu").onclick=e=>e.currentTarget.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:true,composed:true}));
      this.shadowRoot.getElementById("k100-title").onclick=()=>navigateNikasShell(this._returnRoute||"/dashboard-infrastructure/overview");
      this.shadowRoot.getElementById("k100-refresh").onclick=()=>this._child?._loadBootstrap?.(false);
      this._renderTabs();
    }
    this._mountChild();
  }
  _mountChild(){const stage=this.shadowRoot.getElementById("k100-stage");if(!this.isConnected||!stage)return;if(!this._child){this._child=document.createElement("keenetic-hero-panel");this._child.addEventListener("keenetic-view-request",event=>{const view=event.detail?.view;if(!K100_VIEW_IDS.has(view))return;event.preventDefault();this._setView(view);});stage.append(this._child);}this._syncChild();}
  _syncChild(){if(!this._child)return;if(this._panel&&this._sentPanel!==this._panel){this._child.panel=this._panel;this._sentPanel=this._panel;}if(this._route&&this._sentRoute!==this._route){this._child.route=this._route;this._sentRoute=this._route;}if(this._child._view!==this._view)this._child._view=this._view;if(this._hass&&this._sentHass!==this._hass){this._child.hass=this._hass;this._sentHass=this._hass;}}
  _renderTabs(){const nav=this.shadowRoot.getElementById("k100-tabs");if(!nav)return;if(nav.dataset.mounted!=="true"){for(const[v,icon,label]of K100_TABS){const button=document.createElement("button");button.className="nikas-shell__tab";button.dataset.view=v;button.type="button";const glyph=document.createElement("ha-icon");glyph.setAttribute("icon",icon);const text=document.createElement("small");text.textContent=label;button.append(glyph,text);button.addEventListener("click",()=>this._setView(v));nav.append(button);}nav.dataset.mounted="true";}this._updateTabs();}
  _updateTabs(){this.shadowRoot.querySelectorAll("#k100-tabs button").forEach(button=>{const active=button.dataset.view===this._view||(this._view==="system"&&button.dataset.view==="diagnostics");button.classList.toggle("active",active);if(active)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");});}
  _setView(v,updateLocation=true){if(!K100_VIEW_IDS.has(v))return;this._view=v;if(updateLocation)history.replaceState(null,"",`${location.pathname}${location.search}#${v}`);this._mountChild();if(this._child){this._child._view=v;this._child._showStableViewV075?.(v);this._child._scheduleRender?.();this._child._loadViewData?.();}this._resetZoomPosition();this._updateTabs();}
  _bind(){
    if(this._zoomBound)return;
    const viewport=this.shadowRoot.getElementById("k100-work");if(!viewport)return;
    const stage=this.shadowRoot.getElementById("k100-stage");if(!stage)return;
    this._zoomBound=true;const normalizeStoredZoom=this._restoreZoom();
    const distance=touches=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
    const midpoint=touches=>({x:(touches[0].clientX+touches[1].clientX)/2,y:(touches[0].clientY+touches[1].clientY)/2});
    this._touchStart=event=>{
      if(event.touches.length===1){
        const touch=event.touches[0];
        this._zoomSession={startedAt:performance.now(),moved:false,multi:false,startX:touch.clientX,startY:touch.clientY,startState:{...this._zoom},target:event.composedPath?.()[0]||event.target};
        return;
      }
      if(event.touches.length!==2)return;
      const mid=midpoint(event.touches);const rect=viewport.getBoundingClientRect();
      const localX=mid.x-rect.left-stage.offsetLeft;const localY=mid.y-rect.top-stage.offsetTop;
      const nativeScrollY=this._zoom.scale<=1?viewport.scrollTop:0;
      this._zoomSession={...(this._zoomSession||{}),startedAt:this._zoomSession?.startedAt||performance.now(),moved:false,multi:true,distance:Math.max(1,distance(event.touches)),scale:this._zoom.scale,contentX:(localX-this._zoom.x)/this._zoom.scale,contentY:(localY+nativeScrollY-this._zoom.y)/this._zoom.scale,midX:mid.x,midY:mid.y,target:this._zoomSession?.target||event.target};
      this._cancelPendingHold(this._zoomSession.target);this._suppressClicksUntil=Date.now()+K100_CLICK_GUARD;
      if(event.cancelable)event.preventDefault();
    };
    this._touchMove=event=>{
      const session=this._zoomSession;if(!session)return;
      if(session.multi&&event.touches.length===2){
        const mid=midpoint(event.touches);const currentDistance=Math.max(1,distance(event.touches));
        const delta=Math.hypot(mid.x-session.midX,mid.y-session.midY);
        if(!session.moved&&Math.abs(currentDistance-session.distance)<K100_PAN_THRESHOLD&&delta<K100_PAN_THRESHOLD)return;
        session.moved=true;const rect=viewport.getBoundingClientRect();
        const localX=mid.x-rect.left-stage.offsetLeft;const localY=mid.y-rect.top-stage.offsetTop;
        const scale=k100Clamp(session.scale*currentDistance/session.distance,K100_SCALE_MIN,K100_SCALE_MAX);
        if(scale>1)viewport.scrollTop=0;
        this._zoom=this._clampZoom(scale,localX-session.contentX*scale,localY-session.contentY*scale);
        this._applyZoom();this._cancelPendingHold(session.target);this._suppressClicksUntil=Date.now()+K100_CLICK_GUARD;
        if(event.cancelable)event.preventDefault();return;
      }
      if(this._zoom.scale<=1||event.touches.length!==1||session.multi)return;
      const touch=event.touches[0];const dx=touch.clientX-session.startX;const dy=touch.clientY-session.startY;
      if(!session.moved&&Math.hypot(dx,dy)<K100_PAN_THRESHOLD)return;
      if(!session.moved)this._cancelPendingHold(session.target);session.moved=true;
      this._zoom=this._clampZoom(session.startState.scale,session.startState.x+dx,session.startState.y+dy);
      this._applyZoom();this._suppressClicksUntil=Date.now()+K100_CLICK_GUARD;if(event.cancelable)event.preventDefault();
    };
    this._touchEnd=(event,cancelled=false)=>{
      if(!this._zoomSession)return;
      if(cancelled)this._zoomSession.moved=true;
      if(event.touches.length)return;
      const session=this._zoomSession;const now=performance.now();
      const twoFingerTap=!cancelled&&session.multi&&!session.moved&&now-session.startedAt<=K100_TAP_DURATION;
      if(session.moved&&this._zoom.scale>=K100_SCALE_SNAP_MIN&&this._zoom.scale<=K100_SCALE_SNAP_MAX)this._resetZoom(true);
      else if(twoFingerTap){
        if(now-this._lastTwoFingerTap<=K100_DOUBLE_TAP_GAP){this._lastTwoFingerTap=0;this._resetZoom(true);}else this._lastTwoFingerTap=now;
      }else this._clampAndApplyZoom(true);
      if(session.moved||session.multi)this._suppressClicksUntil=Date.now()+K100_CLICK_GUARD;
      this._zoomSession=null;
      if(this._zoomResizePending){this._zoomResizePending=false;this._clampAndApplyZoom(true);}
    };
    this._touchCancel=event=>this._touchEnd(event,true);
    this._clickGuard=event=>this._guardActivation(event);
    viewport.addEventListener("touchstart",this._touchStart,{capture:true,passive:false});
    viewport.addEventListener("touchmove",this._touchMove,{capture:true,passive:false});
    viewport.addEventListener("touchend",this._touchEnd,{capture:true,passive:false});
    viewport.addEventListener("touchcancel",this._touchCancel,{capture:true,passive:false});
    viewport.addEventListener("click",this._clickGuard,true);
    viewport.addEventListener("contextmenu",this._clickGuard,true);
    if(typeof ResizeObserver==="function"){this._zoomResizeObserver=new ResizeObserver(()=>{if(this._zoomSession){this._zoomResizePending=true;return;}this._clampAndApplyZoom(true);});this._zoomResizeObserver.observe(viewport);this._zoomResizeObserver.observe(stage);}
    if(normalizeStoredZoom)this._resetZoom(false);else this._clampAndApplyZoom(true);
  }
  _unbind(){
    const viewport=this.shadowRoot.getElementById("k100-work");
    if(viewport&&this._zoomBound){viewport.removeEventListener("touchstart",this._touchStart,true);viewport.removeEventListener("touchmove",this._touchMove,true);viewport.removeEventListener("touchend",this._touchEnd,true);viewport.removeEventListener("touchcancel",this._touchCancel,true);viewport.removeEventListener("click",this._clickGuard,true);viewport.removeEventListener("contextmenu",this._clickGuard,true);}
    this._zoomResizeObserver?.disconnect();this._zoomResizeObserver=null;this._zoomBound=false;this._zoomSession=null;this._zoomResizePending=false;clearTimeout(this._scaleStatusTimer);
  }
}
k100InstallCore();if(!customElements.get("keenetic-hero-app-panel-v100"))customElements.define("keenetic-hero-app-panel-v100",KeeneticHeroAppPanelV100);
