await import("./keenetic-app-v071.js?v=0.7.2");

const BASE_COMPONENT_V072 = customElements.get("keenetic-hero-app-panel-v071");
const TAB_VIEWS_V072 = new Set(["overview", "wan", "failover", "traffic", "diagnostics"]);
const SAFE_ZOOM_STORAGE_V072 = "nikas.keenetic.safeZoom.v3";
const SAFE_ZOOM_MIN_V072 = 0.75;
const SAFE_ZOOM_MAX_V072 = 2;
const SAFE_ZOOM_STEP_V072 = 0.25;

function _v072ClampScale(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 1;
  return Math.min(SAFE_ZOOM_MAX_V072, Math.max(SAFE_ZOOM_MIN_V072, numeric));
}

function _v072ReadScale() {
  try {
    return _v072ClampScale(localStorage.getItem(SAFE_ZOOM_STORAGE_V072) ?? 1);
  } catch (_error) {
    return 1;
  }
}

function _v072Distance(first, second) {
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

function _v072Midpoint(first, second, viewport) {
  const rect = viewport.getBoundingClientRect();
  return {
    x: (first.clientX + second.clientX) / 2 - rect.left,
    y: (first.clientY + second.clientY) / 2 - rect.top,
  };
}

function _v072InstallStyles(root) {
  if (!root || root.querySelector("style[data-nikas-safe-zoom-v072]")) return;
  const style = document.createElement("style");
  style.dataset.nikasSafeZoomV072 = "true";
  style.textContent = `
    /* UI v0.7.2: isolated zoom with native scroll and no observer loop. */
    #app-content{
      overflow:auto!important;
      overscroll-behavior:contain!important;
      touch-action:pan-x pan-y!important;
      -webkit-overflow-scrolling:touch!important;
    }
    #nika-zoom-stage{
      position:relative!important;
      overflow:visible!important;
      min-width:100%!important;
      min-height:100%!important;
    }
    #nika-zoom-surface{
      position:absolute!important;
      top:0!important;
      left:0!important;
      min-height:0!important;
      transform-origin:0 0!important;
      will-change:transform!important;
    }
    .nika-safe-zoom-v072{
      position:fixed;
      z-index:40;
      right:12px;
      bottom:calc(70px + env(safe-area-inset-bottom,0px));
      display:grid;
      grid-template-columns:38px 58px 38px;
      gap:4px;
      padding:5px;
      border-radius:16px;
      border:1px solid color-mix(in srgb,var(--primary-text-color) 12%,transparent);
      background:color-mix(in srgb,var(--card-background-color,#fff) 94%,transparent);
      box-shadow:0 6px 22px color-mix(in srgb,#000 16%,transparent);
      backdrop-filter:blur(14px);
    }
    .nika-safe-zoom-v072 button{
      min-width:38px;
      min-height:38px;
      border:0;
      border-radius:11px;
      color:var(--primary-text-color);
      background:color-mix(in srgb,var(--primary-color,#03a9f4) 10%,transparent);
      font:700 15px/1 system-ui,sans-serif;
    }
    .nika-safe-zoom-v072 [data-safe-zoom-reset]{font-size:12px}
  `;
  root.append(style);
}

if (BASE_COMPONENT_V072 && !customElements.get("keenetic-hero-app-panel-v072")) {
  class KeeneticHeroAppPanelV072 extends BASE_COMPONENT_V072 {
    constructor() {
      super();
      this._safeZoomScaleV072 = _v072ReadScale();
      this._safeZoomBaseWidthV072 = 1;
      this._safeZoomBaseHeightV072 = 1;
      this._safeZoomPinchV072 = null;
      this._safeZoomFrameV072 = 0;
      this._safeZoomTouchStartV072 = (event) => this._onSafeZoomTouchStartV072(event);
      this._safeZoomTouchMoveV072 = (event) => this._onSafeZoomTouchMoveV072(event);
      this._safeZoomTouchEndV072 = (event) => this._onSafeZoomTouchEndV072(event);
    }

    _installNikaZoom() {
      const root = this.shadowRoot;
      const viewport = root?.getElementById("app-content");
      const surface = root?.getElementById("nika-zoom-surface");
      if (!viewport || !surface) return;
      this._teardownNikaZoom();
      _v072InstallStyles(root);
      if (surface.dataset.safeZoomBoundV072 !== "true") {
        surface.dataset.safeZoomBoundV072 = "true";
        surface.addEventListener("touchstart", this._safeZoomTouchStartV072, { passive: false });
        surface.addEventListener("touchmove", this._safeZoomTouchMoveV072, { passive: false });
        surface.addEventListener("touchend", this._safeZoomTouchEndV072, { passive: true });
        surface.addEventListener("touchcancel", this._safeZoomTouchEndV072, { passive: true });
      }
      this._installSafeZoomControlsV072();
      this._scheduleSafeZoomMeasureV072();
    }

    _teardownNikaZoom() {
      const root = this.shadowRoot;
      const surface = root?.getElementById("nika-zoom-surface");
      surface?.removeEventListener("touchstart", this._safeZoomTouchStartV072);
      surface?.removeEventListener("touchmove", this._safeZoomTouchMoveV072);
      surface?.removeEventListener("touchend", this._safeZoomTouchEndV072);
      surface?.removeEventListener("touchcancel", this._safeZoomTouchEndV072);
      if (surface) delete surface.dataset.safeZoomBoundV072;
      window.cancelAnimationFrame(this._safeZoomFrameV072);
      this._safeZoomFrameV072 = 0;
      this._safeZoomPinchV072 = null;
      super._teardownNikaZoom?.();
    }

    _applyNikaZoom(value, options = {}) {
      this._applySafeZoomV072(value, options);
    }

    _installSafeZoomControlsV072() {
      const viewport = this.shadowRoot?.getElementById("app-content");
      if (!viewport || viewport.querySelector(":scope > .nika-safe-zoom-v072")) return;
      const controls = document.createElement("div");
      controls.className = "nika-safe-zoom-v072";
      controls.innerHTML = `
        <button type="button" data-safe-zoom-out aria-label="Уменьшить">−</button>
        <button type="button" data-safe-zoom-reset aria-label="Вернуть 100%">100%</button>
        <button type="button" data-safe-zoom-in aria-label="Увеличить">+</button>
      `;
      controls.querySelector("[data-safe-zoom-out]")?.addEventListener("click", () => {
        this._setSafeZoomFromControlV072(this._safeZoomScaleV072 - SAFE_ZOOM_STEP_V072);
      });
      controls.querySelector("[data-safe-zoom-reset]")?.addEventListener("click", () => {
        this._resetSafeZoomV072();
      });
      controls.querySelector("[data-safe-zoom-in]")?.addEventListener("click", () => {
        this._setSafeZoomFromControlV072(this._safeZoomScaleV072 + SAFE_ZOOM_STEP_V072);
      });
      viewport.append(controls);
      this._updateSafeZoomLabelV072();
    }

    _scheduleSafeZoomMeasureV072() {
      window.cancelAnimationFrame(this._safeZoomFrameV072);
      this._safeZoomFrameV072 = window.requestAnimationFrame(() => {
        this._safeZoomFrameV072 = 0;
        this._applySafeZoomV072(this._safeZoomScaleV072, { remeasure: true });
      });
    }

    _measureSafeZoomV072() {
      const viewport = this.shadowRoot?.getElementById("app-content");
      const surface = this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!viewport || !surface || viewport.clientWidth <= 0) return false;
      const baseWidth = Math.max(1, viewport.clientWidth);
      surface.style.width = `${baseWidth}px`;
      this._safeZoomBaseWidthV072 = baseWidth;
      this._safeZoomBaseHeightV072 = Math.max(1, viewport.clientHeight, surface.scrollHeight);
      return true;
    }

    _applySafeZoomV072(value, options = {}) {
      const viewport = this.shadowRoot?.getElementById("app-content");
      const stage = this.shadowRoot?.getElementById("nika-zoom-stage");
      const surface = this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!viewport || !stage || !surface) return;
      const scale = _v072ClampScale(value);
      this._safeZoomScaleV072 = scale;
      this._nikaZoomScale = scale;
      if (options.remeasure || this._safeZoomBaseWidthV072 <= 1) {
        if (!this._measureSafeZoomV072()) return;
      }
      const scaledWidth = this._safeZoomBaseWidthV072 * scale;
      const scaledHeight = this._safeZoomBaseHeightV072 * scale;
      const margin = Math.max(0, (viewport.clientWidth - scaledWidth) / 2);
      surface.style.marginLeft = `${margin}px`;
      surface.style.transform = `scale(${scale})`;
      stage.style.width = `${Math.max(viewport.clientWidth, margin + scaledWidth)}px`;
      stage.style.height = `${Math.max(viewport.clientHeight, scaledHeight)}px`;
      this._updateSafeZoomLabelV072();
      if (options.persist) this._persistSafeZoomV072();
    }

    _setSafeZoomFromControlV072(value) {
      const viewport = this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      const focal = { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 };
      this._applySafeZoomAroundV072(value, focal, true);
    }

    _resetSafeZoomV072() {
      const viewport = this.shadowRoot?.getElementById("app-content");
      this._applySafeZoomV072(1, { persist: true });
      viewport?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    _applySafeZoomAroundV072(value, focal, persist = false) {
      const viewport = this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      if (this._safeZoomBaseWidthV072 <= 1 && !this._measureSafeZoomV072()) return;
      const oldScale = this._safeZoomScaleV072;
      const oldWidth = this._safeZoomBaseWidthV072 * oldScale;
      const oldMargin = Math.max(0, (viewport.clientWidth - oldWidth) / 2);
      const contentX = (viewport.scrollLeft + focal.x - oldMargin) / oldScale;
      const contentY = (viewport.scrollTop + focal.y) / oldScale;
      this._applySafeZoomV072(value, { persist });
      const newScale = this._safeZoomScaleV072;
      const newWidth = this._safeZoomBaseWidthV072 * newScale;
      const newMargin = Math.max(0, (viewport.clientWidth - newWidth) / 2);
      viewport.scrollTo({
        left: Math.max(0, newMargin + contentX * newScale - focal.x),
        top: Math.max(0, contentY * newScale - focal.y),
        behavior: "auto",
      });
    }

    _onSafeZoomTouchStartV072(event) {
      if (event.touches.length !== 2) return;
      const viewport = this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      event.preventDefault();
      const first = event.touches[0];
      const second = event.touches[1];
      this._safeZoomPinchV072 = {
        distance: Math.max(1, _v072Distance(first, second)),
        scale: this._safeZoomScaleV072,
        focal: _v072Midpoint(first, second, viewport),
      };
    }

    _onSafeZoomTouchMoveV072(event) {
      if (!this._safeZoomPinchV072 || event.touches.length !== 2) return;
      event.preventDefault();
      const first = event.touches[0];
      const second = event.touches[1];
      const pinch = this._safeZoomPinchV072;
      const next = pinch.scale * (_v072Distance(first, second) / pinch.distance);
      this._applySafeZoomAroundV072(next, _v072Midpoint(first, second, this.shadowRoot.getElementById("app-content")));
    }

    _onSafeZoomTouchEndV072(event) {
      if (!this._safeZoomPinchV072 || event.touches.length >= 2) return;
      this._safeZoomPinchV072 = null;
      this._persistSafeZoomV072();
    }

    _persistSafeZoomV072() {
      try {
        localStorage.setItem(SAFE_ZOOM_STORAGE_V072, this._safeZoomScaleV072.toFixed(2));
      } catch (_error) {
        // Storage may be unavailable in a private WebView.
      }
    }

    _updateSafeZoomLabelV072() {
      const label = this.shadowRoot?.querySelector("[data-safe-zoom-reset]");
      if (label) label.textContent = `${Math.round(this._safeZoomScaleV072 * 100)}%`;
    }

    _setView(view) {
      if (!TAB_VIEWS_V072.has(view) || view === this._activeView) return;
      super._setView(view);
      this._safeZoomBaseHeightV072 = 1;
      queueMicrotask(() => this._scheduleSafeZoomMeasureV072());
    }

    _renderShell() {
      super._renderShell();
      _v072InstallStyles(this.shadowRoot);
      this._installNikaZoom();
      const version = this.shadowRoot?.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.7.2";
    }
  }

  customElements.define("keenetic-hero-app-panel-v072", KeeneticHeroAppPanelV072);
}
