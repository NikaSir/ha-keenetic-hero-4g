await import("./keenetic-app-v064.js?v=0.6.5");

const CORE_COMPONENT_V065 = customElements.get("keenetic-hero-panel");
const BASE_COMPONENT_V065 = customElements.get("keenetic-hero-app-panel-v064");
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

if (BASE_COMPONENT_V065 && !customElements.get("keenetic-hero-app-panel-v065")) {
  class KeeneticHeroAppPanelV065 extends BASE_COMPONENT_V065 {
    constructor() {
      super();
      this._nikaZoomScale = _v065ReadZoom();
      this._nikaZoomGesture = null;
      this._nikaZoomResizeObserver = null;
      this._nikaZoomCollapseTimer = null;
      this._nikaZoomTouchStart = (event) => this._onNikaZoomTouchStart(event);
      this._nikaZoomTouchMove = (event) => this._onNikaZoomTouchMove(event);
      this._nikaZoomTouchEnd = () => this._onNikaZoomTouchEnd();
    }

    connectedCallback() {
      super.connectedCallback();
      this._installNikaZoom();
      requestAnimationFrame(() => this._applyNikaZoom(this._nikaZoomScale));
    }

    disconnectedCallback() {
      this._teardownNikaZoom();
      super.disconnectedCallback();
    }

    _ensureChild() {
      if (!this.isConnected) return;
      const target =
        this.shadowRoot.getElementById("nika-zoom-surface") ||
        this.shadowRoot.getElementById("app-content");
      if (!this._child) {
        this._child = document.createElement("keenetic-hero-panel");
      }
      if (target && this._child.parentElement !== target) target.appendChild(this._child);
      if (this._panel) this._child.panel = this._panel;
      if (this._route) this._child.route = this._route;
      if (this._hass && this._panel) this._child.hass = this._hass;
      this._observeNikaZoomSurface();
      requestAnimationFrame(() => this._applyNikaZoom(this._nikaZoomScale));
    }

    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;

      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.5";

      if (!root.querySelector("style[data-nikas-zoom-v065]")) {
        const style = document.createElement("style");
        style.dataset.nikasZoomV065 = "true";
        style.textContent = `
          #nika-app-shell{position:relative}
          #app-content{
            position:relative;
            overflow:auto!important;
            overscroll-behavior:contain;
            touch-action:pan-x pan-y;
            scrollbar-width:none;
          }
          #app-content::-webkit-scrollbar{display:none}
          #nika-zoom-stage{position:relative;min-width:100%;min-height:100%}
          #nika-zoom-surface{
            position:absolute;
            left:0;
            top:0;
            transform-origin:0 0;
            will-change:transform;
          }
          #nika-zoom-surface>keenetic-hero-panel{display:block}
          .nika-zoom-dock{
            position:absolute;
            z-index:20;
            left:max(10px,env(safe-area-inset-left));
            bottom:calc(66px + env(safe-area-inset-bottom));
            display:flex;
            align-items:center;
            gap:6px;
            pointer-events:none;
          }
          .nika-zoom-toggle,.nika-zoom-panel{
            pointer-events:auto;
            border:1px solid color-mix(in srgb,var(--primary-text-color) 12%,transparent);
            background:color-mix(in srgb,var(--card-background-color,#fff) 92%,transparent);
            box-shadow:0 5px 18px color-mix(in srgb,#000 14%,transparent);
            backdrop-filter:blur(14px);
          }
          .nika-zoom-toggle{
            width:42px;
            height:42px;
            border-radius:15px;
            display:grid;
            place-items:center;
            padding:0;
            color:var(--shell-accent);
          }
          .nika-zoom-toggle ha-icon{--mdc-icon-size:21px}
          .nika-zoom-panel{
            min-height:42px;
            display:flex;
            align-items:center;
            gap:2px;
            padding:3px;
            border-radius:15px;
          }
          .nika-zoom-panel[hidden]{display:none}
          .nika-zoom-panel button{
            width:36px;
            height:34px;
            border:0;
            border-radius:11px;
            display:grid;
            place-items:center;
            padding:0;
            background:transparent;
            color:var(--primary-text-color);
            font:700 17px/1 system-ui,sans-serif;
          }
          .nika-zoom-panel button:active{background:color-mix(in srgb,var(--shell-accent) 12%,transparent)}
          .nika-zoom-panel ha-icon{--mdc-icon-size:18px}
          .nika-zoom-value{
            min-width:48px;
            text-align:center;
            color:var(--primary-text-color);
            font:700 11px/1 system-ui,sans-serif;
          }
        `;
        root.append(style);
      }

      const content = root.getElementById("app-content");
      if (content && !root.getElementById("nika-zoom-stage")) {
        const stage = document.createElement("div");
        stage.id = "nika-zoom-stage";
        const surface = document.createElement("div");
        surface.id = "nika-zoom-surface";
        while (content.firstChild) surface.appendChild(content.firstChild);
        stage.appendChild(surface);
        content.appendChild(stage);
      }

      const shell = root.getElementById("nika-app-shell");
      if (shell && !root.querySelector(".nika-zoom-dock")) {
        const dock = document.createElement("div");
        dock.className = "nika-zoom-dock";
        dock.innerHTML = `
          <button type="button" class="nika-zoom-toggle" aria-label="Масштаб панели" aria-expanded="false">
            <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
          </button>
          <div class="nika-zoom-panel" hidden aria-label="Управление масштабом">
            <button type="button" data-zoom-action="out" aria-label="Уменьшить">−</button>
            <span class="nika-zoom-value" aria-live="polite">100%</span>
            <button type="button" data-zoom-action="in" aria-label="Увеличить">+</button>
            <button type="button" data-zoom-action="reset" aria-label="Сбросить масштаб">
              <ha-icon icon="mdi:backup-restore"></ha-icon>
            </button>
          </div>`;
        shell.appendChild(dock);
      }

      this._installNikaZoom();
      this._updateNikaZoomLabel();
    }

    _installNikaZoom() {
      const content = this.shadowRoot?.getElementById("app-content");
      if (!content) return;
      if (content.dataset.nikasZoomBound !== "true") {
        content.dataset.nikasZoomBound = "true";
        content.addEventListener("touchstart", this._nikaZoomTouchStart, { passive: false });
        content.addEventListener("touchmove", this._nikaZoomTouchMove, { passive: false });
        content.addEventListener("touchend", this._nikaZoomTouchEnd, { passive: true });
        content.addEventListener("touchcancel", this._nikaZoomTouchEnd, { passive: true });
      }

      const toggle = this.shadowRoot.querySelector(".nika-zoom-toggle");
      const panel = this.shadowRoot.querySelector(".nika-zoom-panel");
      const dock = this.shadowRoot.querySelector(".nika-zoom-dock");
      if (dock && dock.dataset.nikasZoomControlsBound !== "true") {
        dock.dataset.nikasZoomControlsBound = "true";
        toggle?.addEventListener("click", () => {
          const expanded = panel?.hasAttribute("hidden") ?? true;
          if (panel) panel.toggleAttribute("hidden", !expanded);
          toggle.setAttribute("aria-expanded", String(expanded));
          if (expanded) this._scheduleNikaZoomCollapse();
        });
        panel?.querySelectorAll("[data-zoom-action]").forEach((button) => {
          button.addEventListener("click", () => {
            const action = button.dataset.zoomAction;
            if (action === "reset") {
              this._setNikaZoomFromControl(1, true);
            } else {
              const delta = action === "in" ? ZOOM_STEP_V065 : -ZOOM_STEP_V065;
              this._setNikaZoomFromControl(this._nikaZoomScale + delta, false);
            }
            this._scheduleNikaZoomCollapse();
          });
        });
      }

      this._observeNikaZoomSurface();
    }

    _teardownNikaZoom() {
      const content = this.shadowRoot?.getElementById("app-content");
      content?.removeEventListener("touchstart", this._nikaZoomTouchStart);
      content?.removeEventListener("touchmove", this._nikaZoomTouchMove);
      content?.removeEventListener("touchend", this._nikaZoomTouchEnd);
      content?.removeEventListener("touchcancel", this._nikaZoomTouchEnd);
      if (content) delete content.dataset.nikasZoomBound;
      this._nikaZoomResizeObserver?.disconnect();
      this._nikaZoomResizeObserver = null;
      clearTimeout(this._nikaZoomCollapseTimer);
    }

    _observeNikaZoomSurface() {
      if (this._nikaZoomResizeObserver || typeof ResizeObserver === "undefined") return;
      const surface = this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!surface) return;
      this._nikaZoomResizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => this._applyNikaZoom(this._nikaZoomScale));
      });
      this._nikaZoomResizeObserver.observe(surface);
    }

    _nikaZoomOffsetX(scale, viewportWidth) {
      return scale < 1 ? (viewportWidth - viewportWidth * scale) / 2 : 0;
    }

    _nikaZoomFocalPoint() {
      const content = this.shadowRoot?.getElementById("app-content");
      if (!content) return null;
      const localX = content.clientWidth / 2;
      const localY = content.clientHeight / 2;
      const offsetX = this._nikaZoomOffsetX(this._nikaZoomScale, content.clientWidth);
      return {
        localX,
        localY,
        contentX: (content.scrollLeft + localX - offsetX) / this._nikaZoomScale,
        contentY: (content.scrollTop + localY) / this._nikaZoomScale,
      };
    }

    _applyNikaZoom(value, options = {}) {
      const content = this.shadowRoot?.getElementById("app-content");
      const stage = this.shadowRoot?.getElementById("nika-zoom-stage");
      const surface = this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!content || !stage || !surface || content.clientWidth <= 0) return;

      const scale = _v065ClampZoom(value);
      const viewportWidth = content.clientWidth;
      const offsetX = this._nikaZoomOffsetX(scale, viewportWidth);
      this._nikaZoomScale = scale;
      surface.style.width = `${viewportWidth}px`;
      surface.style.left = `${offsetX}px`;
      surface.style.transform = `scale(${scale})`;
      stage.style.width = `${Math.max(viewportWidth, viewportWidth * scale)}px`;
      stage.style.height = `${Math.max(1, surface.scrollHeight * scale)}px`;

      const focal = options.focal;
      if (focal) {
        content.scrollLeft = Math.max(0, focal.contentX * scale + offsetX - focal.localX);
        content.scrollTop = Math.max(0, focal.contentY * scale - focal.localY);
      }
      if (options.resetPosition) content.scrollLeft = 0;
      if (options.persist) this._persistNikaZoom();
      this._updateNikaZoomLabel();
    }

    _setNikaZoomFromControl(value, resetPosition) {
      const focal = this._nikaZoomFocalPoint();
      this._applyNikaZoom(value, { focal, persist: true, resetPosition });
    }

    _persistNikaZoom() {
      try {
        localStorage.setItem(ZOOM_STORAGE_KEY_V065, this._nikaZoomScale.toFixed(2));
      } catch (_error) {
        // Storage is optional; zoom remains available for the current session.
      }
    }

    _updateNikaZoomLabel() {
      const label = this.shadowRoot?.querySelector(".nika-zoom-value");
      if (label) label.textContent = `${Math.round(this._nikaZoomScale * 100)}%`;
    }

    _scheduleNikaZoomCollapse() {
      clearTimeout(this._nikaZoomCollapseTimer);
      this._nikaZoomCollapseTimer = setTimeout(() => {
        const panel = this.shadowRoot?.querySelector(".nika-zoom-panel");
        const toggle = this.shadowRoot?.querySelector(".nika-zoom-toggle");
        panel?.setAttribute("hidden", "");
        toggle?.setAttribute("aria-expanded", "false");
      }, 4500);
    }

    _onNikaZoomTouchStart(event) {
      if (event.touches.length !== 2) return;
      event.preventDefault();
      const content = this.shadowRoot?.getElementById("app-content");
      if (!content) return;
      const rect = content.getBoundingClientRect();
      const midpoint = _v065TouchMidpoint(event.touches);
      const localX = midpoint.x - rect.left;
      const localY = midpoint.y - rect.top;
      const offsetX = this._nikaZoomOffsetX(this._nikaZoomScale, content.clientWidth);
      this._nikaZoomGesture = {
        startDistance: Math.max(1, _v065TouchDistance(event.touches)),
        startScale: this._nikaZoomScale,
        localX,
        localY,
        contentX: (content.scrollLeft + localX - offsetX) / this._nikaZoomScale,
        contentY: (content.scrollTop + localY) / this._nikaZoomScale,
      };
    }

    _onNikaZoomTouchMove(event) {
      if (event.touches.length !== 2 || !this._nikaZoomGesture) return;
      event.preventDefault();
      const content = this.shadowRoot?.getElementById("app-content");
      if (!content) return;
      const rect = content.getBoundingClientRect();
      const midpoint = _v065TouchMidpoint(event.touches);
      const ratio = _v065TouchDistance(event.touches) / this._nikaZoomGesture.startDistance;
      this._applyNikaZoom(this._nikaZoomGesture.startScale * ratio, {
        focal: {
          ...this._nikaZoomGesture,
          localX: midpoint.x - rect.left,
          localY: midpoint.y - rect.top,
        },
      });
    }

    _onNikaZoomTouchEnd() {
      if (!this._nikaZoomGesture) return;
      this._nikaZoomGesture = null;
      this._persistNikaZoom();
      this._updateNikaZoomLabel();
    }
  }

  customElements.define("keenetic-hero-app-panel-v065", KeeneticHeroAppPanelV065);
}
