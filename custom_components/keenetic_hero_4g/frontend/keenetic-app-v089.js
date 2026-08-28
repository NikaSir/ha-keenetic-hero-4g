await import("./keenetic-app-v088.js");

const UI_VERSION_V089 = "0.8.9";
const CORE_COMPONENT_V089 = customElements.get("keenetic-hero-panel");
const CURRENT_SHELL_BASE_V089 = customElements.get("keenetic-hero-app-panel-v088");

function installAcceptedClearanceV089(root) {
  if (!root || root.querySelector("style[data-keenetic-overview-v089]")) return;
  const style = document.createElement("style");
  style.dataset.keeneticOverviewV089 = "true";
  style.textContent = `
    .v083-overview .v061-lte{top:28.5%!important}
  `;
  root.append(style);
}

function tuneAcceptedLtePathV089(root) {
  root?.querySelectorAll(".v083-flow-glow.v083-lte-line,.v083-flow-line.v083-lte-line").forEach((path) => {
    const d = "M500 190 L500 406";
    if (path.getAttribute("d") !== d) path.setAttribute("d", d);
  });
}

if (CORE_COMPONENT_V089 && !CORE_COMPONENT_V089.prototype.__nikaAcceptedClearanceV089) {
  CORE_COMPONENT_V089.prototype.__nikaAcceptedClearanceV089 = true;
  const mountStableBaseV089 = CORE_COMPONENT_V089.prototype._mountStableDomV075;
  CORE_COMPONENT_V089.prototype._mountStableDomV075 = function (...args) {
    const mounted = mountStableBaseV089.apply(this, args);
    if (!mounted) return mounted;
    installAcceptedClearanceV089(this.shadowRoot);
    tuneAcceptedLtePathV089(this.shadowRoot);
    return mounted;
  };
}

if (CURRENT_SHELL_BASE_V089 && !customElements.get("keenetic-hero-app-panel-v089")) {
  class KeeneticHeroAppPanelV089 extends CURRENT_SHELL_BASE_V089 {
    _mountShell() {
      super._mountShell();
      if (!this.shadowRoot?.querySelector("style[data-fixed-chrome-v089]")) {
        const style = document.createElement("style");
        style.dataset.fixedChromeV089 = "true";
        style.textContent = `
          :host{overscroll-behavior:none!important}
          .header-v080,.tabbar-v080{touch-action:none!important}
        `;
        this.shadowRoot.append(style);
      }
      const version = this.shadowRoot?.querySelector("#return-v081 span");
      if (version && version.textContent !== `UI v${UI_VERSION_V089}`) {
        version.textContent = `UI v${UI_VERSION_V089}`;
      }
    }

    _onTouchStart(event) {
      const viewport = this.shadowRoot?.getElementById("work-viewport-v080");
      if (viewport && event.touches.length === 1 && this._zoom.scale <= 1) {
        this._nativeScrollTouchV089 = {
          clientY: event.touches[0].clientY,
        };
      } else {
        this._nativeScrollTouchV089 = null;
      }
      super._onTouchStart(event);
    }

    _onTouchMove(event) {
      const viewport = this.shadowRoot?.getElementById("work-viewport-v080");
      if (viewport && event.touches.length === 1 && this._zoom.scale <= 1 && this._nativeScrollTouchV089) {
        const deltaY = event.touches[0].clientY - this._nativeScrollTouchV089.clientY;
        const atTop = viewport.scrollTop <= 0;
        const atBottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 1;
        if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
          event.preventDefault();
          return;
        }
      }
      super._onTouchMove(event);
    }

    _onTouchEnd(event) {
      if (!event.touches.length) this._nativeScrollTouchV089 = null;
      super._onTouchEnd(event);
    }

    _onTouchCancel() {
      this._nativeScrollTouchV089 = null;
      super._onTouchCancel();
    }
  }

  customElements.define("keenetic-hero-app-panel-v089", KeeneticHeroAppPanelV089);
}
