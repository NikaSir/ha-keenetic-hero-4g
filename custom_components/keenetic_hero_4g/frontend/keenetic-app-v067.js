await import("./keenetic-app-v066.js?v=0.6.7");

const BASE_COMPONENT_V067 = customElements.get("keenetic-hero-app-panel-v066");
const CANVAS_STORAGE_KEY_V067 = "nikas.keenetic.canvasZoom.v2";
const LEGACY_ZOOM_STORAGE_KEY_V067 = "nikas.keenetic.contentZoom.v1";
const CANVAS_MIN_SCALE_V067 = 0.75;
const CANVAS_MAX_SCALE_V067 = 2;
const CANVAS_SNAP_MIN_V067 = 0.97;
const CANVAS_SNAP_MAX_V067 = 1.03;
const CANVAS_PAN_THRESHOLD_PX_V067 = 5;
const CANVAS_GESTURE_GUARD_MS_V067 = 700;
const CANVAS_DOUBLE_TAP_DELAY_MS_V067 = 360;
const CANVAS_TAP_DURATION_MS_V067 = 280;
const CANVAS_TAP_MOVE_PX_V067 = 14;

function _v067ClampScale(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 1;
  return Math.min(CANVAS_MAX_SCALE_V067, Math.max(CANVAS_MIN_SCALE_V067, numeric));
}

function _v067ReadScale() {
  try {
    const current = localStorage.getItem(CANVAS_STORAGE_KEY_V067);
    const legacy = localStorage.getItem(LEGACY_ZOOM_STORAGE_KEY_V067);
    return _v067ClampScale(current ?? legacy ?? 1);
  } catch (_error) {
    return 1;
  }
}

function _v067Distance(first, second) {
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

function _v067Midpoint(first, second, viewport = null) {
  const point = {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2,
  };
  if (!viewport) return point;
  const rect = viewport.getBoundingClientRect();
  return { x: point.x - rect.left, y: point.y - rect.top };
}

function _v067PointDistance(first, second) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function _v067DeepElementFromPoint(root, x, y) {
  let element = root?.elementFromPoint?.(x, y) || document.elementFromPoint(x, y);
  const visited = new Set();
  while (element?.shadowRoot?.elementFromPoint && !visited.has(element)) {
    visited.add(element);
    const inner = element.shadowRoot.elementFromPoint(x, y);
    if (!inner || inner === element) break;
    element = inner;
  }
  return element;
}

function _v067CancelEntityHold(target) {
  const entity = target?.closest?.("[data-entity]") || target;
  if (!entity?.dispatchEvent) return;
  const event = typeof PointerEvent === "function"
    ? new PointerEvent("pointercancel", { bubbles: true, composed: true })
    : new Event("pointercancel", { bubbles: true, composed: true });
  entity.dispatchEvent(event);
}

if (BASE_COMPONENT_V067 && !customElements.get("keenetic-hero-app-panel-v067")) {
  class KeeneticHeroAppPanelV067 extends BASE_COMPONENT_V067 {
    constructor() {
      super();
      this._nikaCanvasStateV067 = { scale: _v067ReadScale(), x: 0, y: 0 };
      this._nikaZoomScale = this._nikaCanvasStateV067.scale;
      this._nikaCanvasBaseWidthV067 = 1;
      this._nikaCanvasBaseHeightV067 = 1;
      this._nikaCanvasPanV067 = null;
      this._nikaCanvasPinchV067 = null;
      this._nikaCanvasTapGestureV067 = null;
      this._nikaCanvasMultiTouchV067 = false;
      this._nikaCanvasGuardUntilV067 = 0;
      this._nikaLastTwoFingerTapV067 = null;
      this._nikaCanvasResizeObserverV067 = null;
      this._nikaCanvasResizeTargetV067 = null;
      this._nikaCanvasResizeFrameV067 = 0;
      this._nikaCanvasToastTimerV067 = 0;
      this._nikaCanvasTouchStartV067 = (event) => this._onNikaCanvasTouchStartV067(event);
      this._nikaCanvasTouchMoveV067 = (event) => this._onNikaCanvasTouchMoveV067(event);
      this._nikaCanvasTouchEndV067 = (event) => this._onNikaCanvasTouchEndV067(event);
      this._nikaCanvasTouchCancelV067 = () => this._onNikaCanvasTouchCancelV067();
      this._nikaCanvasClickGuardV067 = (event) => this._onNikaCanvasClickGuardV067(event);
      this._nikaCanvasWindowResizeV067 = () => this._scheduleNikaCanvasMeasureV067();
    }

    _renderShell() {
      super._renderShell();
      const root = this.shadowRoot;
      if (!root) return;

      root.querySelectorAll(".nika-zoom-dock").forEach((element) => element.remove());
      this._installNikaCanvasStylesV067(root);
      this._reconcileNikaCanvasV067();
      this._installNikaZoom();

      const version = root.querySelector(".title span");
      if (version) version.textContent = "Network Control Center · UI v0.6.7";
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
      this._scheduleNikaCanvasMeasureV067();
    }

    _installNikaCanvasStylesV067(root) {
      if (root.querySelector("style[data-nikas-canvas-v067]")) return;
      const style = document.createElement("style");
      style.dataset.nikasCanvasV067 = "true";
      style.textContent = `
        /* UI v0.6.7: transform-owned canvas; iOS scroll/bounce is not state. */
        #app-content{
          position:relative;
          min-height:0;
          overflow:hidden!important;
          overscroll-behavior:none!important;
          overflow-anchor:none!important;
          touch-action:none!important;
          -webkit-overflow-scrolling:auto!important;
        }
        #nika-zoom-stage{
          position:relative;
          width:100%!important;
          height:100%!important;
          min-width:0!important;
          min-height:0!important;
          overflow:hidden!important;
        }
        #nika-zoom-surface{
          position:absolute;
          top:0;
          left:0!important;
          transform-origin:0 0!important;
          will-change:transform;
          overflow-anchor:none!important;
        }
        #nika-zoom-surface>keenetic-hero-panel{display:block;min-height:100%}
        .nika-zoom-dock{display:none!important}
        .nika-canvas-reset-toast-v067{
          position:absolute;
          z-index:30;
          left:50%;
          top:14px;
          transform:translate(-50%,-8px);
          opacity:0;
          pointer-events:none;
          white-space:nowrap;
          padding:8px 12px;
          border-radius:999px;
          color:var(--primary-text-color);
          background:color-mix(in srgb,var(--card-background-color,#fff) 94%,transparent);
          border:1px solid color-mix(in srgb,var(--primary-text-color) 12%,transparent);
          box-shadow:0 6px 20px color-mix(in srgb,#000 16%,transparent);
          backdrop-filter:blur(14px);
          font:700 12px/1 system-ui,sans-serif;
          transition:opacity .16s ease,transform .16s ease;
        }
        .nika-canvas-reset-toast-v067.visible{
          opacity:1;
          transform:translate(-50%,0);
        }
        @media(prefers-reduced-motion:reduce){
          .nika-canvas-reset-toast-v067{transition:none}
        }
      `;
      root.append(style);
    }

    _reconcileNikaCanvasV067() {
      const root = this.shadowRoot;
      const viewport = root?.getElementById("app-content");
      if (!viewport) return null;

      root.querySelectorAll(".nika-zoom-dock").forEach((element) => element.remove());
      let stage = viewport.querySelector(":scope > #nika-zoom-stage");
      let surface = stage?.querySelector(":scope > #nika-zoom-surface");
      const structuralChildren = Array.from(viewport.children).filter(
        (element) => !element.classList.contains("nika-canvas-reset-toast-v067"),
      );
      const valid = stage && surface && structuralChildren.length === 1;

      if (!valid) {
        const panel = this._child || viewport.querySelector("keenetic-hero-panel");
        stage = document.createElement("div");
        stage.id = "nika-zoom-stage";
        surface = document.createElement("div");
        surface.id = "nika-zoom-surface";
        stage.append(surface);
        if (panel) surface.append(panel);
        const toast = viewport.querySelector(":scope > .nika-canvas-reset-toast-v067");
        viewport.replaceChildren(stage);
        if (toast) viewport.append(toast);
      }

      stage.dataset.nikasCanvasStageV067 = "true";
      surface.dataset.nikasCanvasSurfaceV067 = "true";
      if (this._child && this._child.parentElement !== surface) surface.append(this._child);
      return viewport;
    }

    _installNikaZoom() {
      const viewport = this._reconcileNikaCanvasV067();
      if (!viewport) return;
      if (viewport.dataset.nikasCanvasBoundV067 !== "true") {
        viewport.dataset.nikasCanvasBoundV067 = "true";
        viewport.addEventListener("touchstart", this._nikaCanvasTouchStartV067, { passive: false });
        viewport.addEventListener("touchmove", this._nikaCanvasTouchMoveV067, { passive: false });
        viewport.addEventListener("touchend", this._nikaCanvasTouchEndV067, { passive: true });
        viewport.addEventListener("touchcancel", this._nikaCanvasTouchCancelV067, { passive: true });
        viewport.addEventListener("click", this._nikaCanvasClickGuardV067, { capture: true });
      }
      this._observeNikaZoomSurface();
      this._scheduleNikaCanvasMeasureV067();
    }

    _teardownNikaZoom() {
      const viewport = this.shadowRoot?.getElementById("app-content");
      viewport?.removeEventListener("touchstart", this._nikaCanvasTouchStartV067);
      viewport?.removeEventListener("touchmove", this._nikaCanvasTouchMoveV067);
      viewport?.removeEventListener("touchend", this._nikaCanvasTouchEndV067);
      viewport?.removeEventListener("touchcancel", this._nikaCanvasTouchCancelV067);
      viewport?.removeEventListener("click", this._nikaCanvasClickGuardV067, { capture: true });
      if (viewport) delete viewport.dataset.nikasCanvasBoundV067;
      this._nikaCanvasResizeObserverV067?.disconnect();
      this._nikaCanvasResizeObserverV067 = null;
      this._nikaCanvasResizeTargetV067 = null;
      window.removeEventListener("resize", this._nikaCanvasWindowResizeV067);
      window.visualViewport?.removeEventListener("resize", this._nikaCanvasWindowResizeV067);
      window.cancelAnimationFrame(this._nikaCanvasResizeFrameV067);
      window.clearTimeout(this._nikaCanvasToastTimerV067);
    }

    _observeNikaZoomSurface() {
      const surface = this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!surface || this._nikaCanvasResizeTargetV067 === surface) return;
      this._nikaCanvasResizeObserverV067?.disconnect();
      this._nikaCanvasResizeTargetV067 = surface;
      if (typeof ResizeObserver === "function") {
        this._nikaCanvasResizeObserverV067 = new ResizeObserver(() => {
          this._scheduleNikaCanvasMeasureV067();
        });
        this._nikaCanvasResizeObserverV067.observe(surface);
      }
      window.removeEventListener("resize", this._nikaCanvasWindowResizeV067);
      window.visualViewport?.removeEventListener("resize", this._nikaCanvasWindowResizeV067);
      window.addEventListener("resize", this._nikaCanvasWindowResizeV067, { passive: true });
      window.visualViewport?.addEventListener("resize", this._nikaCanvasWindowResizeV067, { passive: true });
    }

    _scheduleNikaCanvasMeasureV067() {
      window.cancelAnimationFrame(this._nikaCanvasResizeFrameV067);
      this._nikaCanvasResizeFrameV067 = window.requestAnimationFrame(() => {
        this._applyNikaZoom(this._nikaCanvasStateV067.scale, { remeasure: true });
      });
    }

    _measureNikaCanvasV067() {
      const viewport = this.shadowRoot?.getElementById("app-content");
      const surface = this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!viewport || !surface || viewport.clientWidth <= 0) return false;
      const state = this._nikaCanvasStateV067;
      const baseWidth = Math.max(1, viewport.clientWidth);
      surface.style.width = `${baseWidth}px`;
      const renderedHeight = surface.getBoundingClientRect().height / Math.max(state.scale, 0.01);
      this._nikaCanvasBaseWidthV067 = baseWidth;
      this._nikaCanvasBaseHeightV067 = Math.max(
        1,
        viewport.clientHeight,
        surface.scrollHeight,
        Number.isFinite(renderedHeight) ? renderedHeight : 0,
      );
      return true;
    }

    _clampNikaCanvasPositionV067() {
      const viewport = this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      const state = this._nikaCanvasStateV067;
      const scaledWidth = this._nikaCanvasBaseWidthV067 * state.scale;
      const scaledHeight = this._nikaCanvasBaseHeightV067 * state.scale;
      if (scaledWidth <= viewport.clientWidth) {
        state.x = (viewport.clientWidth - scaledWidth) / 2;
      } else {
        state.x = Math.min(0, Math.max(viewport.clientWidth - scaledWidth, state.x));
      }
      if (scaledHeight <= viewport.clientHeight) {
        state.y = 0;
      } else {
        state.y = Math.min(0, Math.max(viewport.clientHeight - scaledHeight, state.y));
      }
    }

    _applyNikaZoom(value, options = {}) {
      const viewport = this.shadowRoot?.getElementById("app-content");
      const stage = this.shadowRoot?.getElementById("nika-zoom-stage");
      const surface = this.shadowRoot?.getElementById("nika-zoom-surface");
      if (!viewport || !stage || !surface) return;
      const state = this._nikaCanvasStateV067;
      state.scale = _v067ClampScale(value ?? state.scale);
      this._nikaZoomScale = state.scale;
      if (options.remeasure || this._nikaCanvasBaseWidthV067 <= 1) {
        if (!this._measureNikaCanvasV067()) return;
      }
      this._clampNikaCanvasPositionV067();
      stage.style.width = `${Math.max(1, viewport.clientWidth)}px`;
      stage.style.height = `${Math.max(1, viewport.clientHeight)}px`;
      surface.style.transform = `translate3d(${state.x}px,${state.y}px,0) scale(${state.scale})`;
      if (options.persist) this._persistNikaCanvasScaleV067();
    }

    _persistNikaCanvasScaleV067() {
      try {
        localStorage.setItem(CANVAS_STORAGE_KEY_V067, this._nikaCanvasStateV067.scale.toFixed(3));
      } catch (_error) {
        // Storage is optional; the current panel instance keeps its state.
      }
    }

    _resetNikaCanvasV067(notify = true) {
      const state = this._nikaCanvasStateV067;
      state.scale = 1;
      state.x = 0;
      state.y = 0;
      this._applyNikaZoom(1, { persist: true });
      if (notify) this._showNikaCanvasResetV067();
    }

    _showNikaCanvasResetV067() {
      const viewport = this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      let toast = viewport.querySelector(":scope > .nika-canvas-reset-toast-v067");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "nika-canvas-reset-toast-v067";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.textContent = "Масштаб 100%";
        viewport.append(toast);
      }
      window.clearTimeout(this._nikaCanvasToastTimerV067);
      window.requestAnimationFrame(() => toast.classList.add("visible"));
      this._nikaCanvasToastTimerV067 = window.setTimeout(() => {
        toast.classList.remove("visible");
      }, 1250);
    }

    _beginNikaCanvasPanV067(touch, target) {
      const state = this._nikaCanvasStateV067;
      this._nikaCanvasPanV067 = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        x: state.x,
        y: state.y,
        target,
        moved: false,
      };
    }

    _onNikaCanvasTouchStartV067(event) {
      const viewport = this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      if (event.touches.length >= 2) {
        const [first, second] = event.touches;
        const point = _v067Midpoint(first, second, viewport);
        const state = this._nikaCanvasStateV067;
        this._nikaCanvasMultiTouchV067 = true;
        this._nikaCanvasPanV067 = null;
        this._nikaCanvasPinchV067 = {
          distance: Math.max(1, _v067Distance(first, second)),
          scale: state.scale,
          contentX: (point.x - state.x) / state.scale,
          contentY: (point.y - state.y) / state.scale,
        };
        this._nikaCanvasTapGestureV067 = {
          startedAt: performance.now(),
          midpoint: _v067Midpoint(first, second),
          distance: _v067Distance(first, second),
          moved: false,
        };
        this._nikaCanvasGuardUntilV067 = Number.POSITIVE_INFINITY;
        Array.from(event.touches).forEach((touch) => {
          _v067CancelEntityHold(
            _v067DeepElementFromPoint(this.shadowRoot, touch.clientX, touch.clientY),
          );
        });
        event.preventDefault();
        return;
      }
      if (event.touches.length === 1 && !this._nikaCanvasMultiTouchV067) {
        const touch = event.touches[0];
        const target = _v067DeepElementFromPoint(this.shadowRoot, touch.clientX, touch.clientY) || event.target;
        this._beginNikaCanvasPanV067(touch, target);
      }
    }

    _onNikaCanvasTouchMoveV067(event) {
      const viewport = this.shadowRoot?.getElementById("app-content");
      if (!viewport) return;
      if (event.touches.length >= 2 && this._nikaCanvasPinchV067) {
        const [first, second] = event.touches;
        const point = _v067Midpoint(first, second, viewport);
        const currentDistance = _v067Distance(first, second);
        const pinch = this._nikaCanvasPinchV067;
        const state = this._nikaCanvasStateV067;
        state.scale = _v067ClampScale(pinch.scale * currentDistance / pinch.distance);
        state.x = point.x - pinch.contentX * state.scale;
        state.y = point.y - pinch.contentY * state.scale;
        this._applyNikaZoom(state.scale);
        if (
          this._nikaCanvasTapGestureV067 &&
          (_v067PointDistance(
            this._nikaCanvasTapGestureV067.midpoint,
            _v067Midpoint(first, second),
          ) > CANVAS_TAP_MOVE_PX_V067 ||
            Math.abs(currentDistance - this._nikaCanvasTapGestureV067.distance) > CANVAS_TAP_MOVE_PX_V067)
        ) {
          this._nikaCanvasTapGestureV067.moved = true;
        }
        event.preventDefault();
        return;
      }

      const pan = this._nikaCanvasPanV067;
      if (!pan || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - pan.clientX;
      const dy = touch.clientY - pan.clientY;
      if (!pan.moved && Math.hypot(dx, dy) < CANVAS_PAN_THRESHOLD_PX_V067) return;
      if (!pan.moved) {
        pan.moved = true;
        this._nikaCanvasGuardUntilV067 = Number.POSITIVE_INFINITY;
        _v067CancelEntityHold(pan.target);
      }
      const state = this._nikaCanvasStateV067;
      state.x = pan.x + dx;
      state.y = pan.y + dy;
      this._applyNikaZoom(state.scale);
      event.preventDefault();
    }

    _onNikaCanvasTouchEndV067(event) {
      if (this._nikaCanvasMultiTouchV067 && event.touches.length === 1) {
        this._nikaCanvasPinchV067 = null;
        const touch = event.touches[0];
        const target = _v067DeepElementFromPoint(this.shadowRoot, touch.clientX, touch.clientY) || event.target;
        this._beginNikaCanvasPanV067(touch, target);
        return;
      }
      if (event.touches.length !== 0) return;

      const completedTap = this._nikaCanvasTapGestureV067;
      const wasMultiTouch = this._nikaCanvasMultiTouchV067;
      const panMoved = Boolean(this._nikaCanvasPanV067?.moved);
      this._nikaCanvasMultiTouchV067 = false;
      this._nikaCanvasPinchV067 = null;
      this._nikaCanvasTapGestureV067 = null;
      this._nikaCanvasPanV067 = null;

      const state = this._nikaCanvasStateV067;
      if (state.scale >= CANVAS_SNAP_MIN_V067 && state.scale <= CANVAS_SNAP_MAX_V067 && state.scale !== 1) {
        this._resetNikaCanvasV067(true);
      } else {
        this._applyNikaZoom(state.scale, { persist: true });
      }

      const now = performance.now();
      if (wasMultiTouch) {
        this._nikaCanvasGuardUntilV067 = now + CANVAS_GESTURE_GUARD_MS_V067;
        const isTwoFingerTap = completedTap && !completedTap.moved &&
          now - completedTap.startedAt <= CANVAS_TAP_DURATION_MS_V067;
        if (isTwoFingerTap) {
          const previousTap = this._nikaLastTwoFingerTapV067;
          if (
            previousTap && now - previousTap.at <= CANVAS_DOUBLE_TAP_DELAY_MS_V067 &&
            _v067PointDistance(previousTap.midpoint, completedTap.midpoint) <= 48
          ) {
            this._nikaLastTwoFingerTapV067 = null;
            this._resetNikaCanvasV067(true);
          } else {
            this._nikaLastTwoFingerTapV067 = { at: now, midpoint: completedTap.midpoint };
          }
        } else {
          this._nikaLastTwoFingerTapV067 = null;
        }
      } else if (panMoved) {
        this._nikaCanvasGuardUntilV067 = now + CANVAS_GESTURE_GUARD_MS_V067;
      }
    }

    _onNikaCanvasTouchCancelV067() {
      this._nikaCanvasMultiTouchV067 = false;
      this._nikaCanvasPinchV067 = null;
      this._nikaCanvasTapGestureV067 = null;
      this._nikaCanvasPanV067 = null;
      this._applyNikaZoom(this._nikaCanvasStateV067.scale, { persist: true });
      this._nikaCanvasGuardUntilV067 = performance.now() + CANVAS_GESTURE_GUARD_MS_V067;
    }

    _onNikaCanvasClickGuardV067(event) {
      if (
        this._nikaCanvasGuardUntilV067 === Number.POSITIVE_INFINITY ||
        performance.now() < this._nikaCanvasGuardUntilV067
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    }

    _updateNikaZoomLabel() {
      // UI Standard v1.3 forbids persistent zoom controls.
    }

    _scheduleNikaZoomCollapse() {
      // Legacy v0.6.5 controls are intentionally absent.
    }
  }

  customElements.define("keenetic-hero-app-panel-v067", KeeneticHeroAppPanelV067);
}
