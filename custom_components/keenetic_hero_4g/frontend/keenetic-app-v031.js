const APP_SHELL_VERSION_V031 = "0.3.1";
const V030_COMPONENT = customElements.get("keenetic-hero-app-panel-v030");

class KeeneticHeroAppPanelV031 extends V030_COMPONENT {
  connectedCallback() {
    super.connectedCallback();
    this._applyLayoutV031();
  }

  _renderShell() {
    super._renderShell();
    this._applyLayoutV031();
  }

  _applyLayoutV031() {
    const root = this.shadowRoot;
    if (!root) return;

    const subtitle = root.querySelector(".title span");
    if (subtitle) subtitle.textContent = `KN-2311 · UI v${APP_SHELL_VERSION_V031}`;

    if (root.querySelector("style[data-nikas-v031-layout]")) return;
    const style = document.createElement("style");
    style.dataset.nikasV031Layout = "true";
    style.textContent = `
      /* Equal side rails keep the title geometrically centered on the viewport. */
      .nika-header {
        grid-template-columns: 92px minmax(0, 1fr) 92px !important;
        column-gap: 4px !important;
        min-height: 60px !important;
        padding-left: max(8px, env(safe-area-inset-left)) !important;
        padding-right: max(8px, env(safe-area-inset-right)) !important;
      }
      .back {
        width: 92px !important;
        min-width: 0 !important;
        justify-content: flex-start !important;
        padding: 0 4px !important;
        white-space: nowrap;
      }
      .refresh {
        width: 44px !important;
        min-width: 44px !important;
        justify-self: end !important;
        padding: 0 !important;
      }
      .title {
        min-width: 0 !important;
        width: 100%;
        justify-self: center;
      }
      .title strong {
        font-size: 17px !important;
        line-height: 1.12 !important;
      }
      .title span {
        font-size: 9px !important;
        line-height: 1.15 !important;
      }

      /* Full-width docked app navigation. */
      .nika-tabbar {
        width: 100% !important;
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
        gap: 2px !important;
        padding-left: max(6px, env(safe-area-inset-left)) !important;
        padding-right: max(6px, env(safe-area-inset-right)) !important;
      }
      .nika-tabbar button {
        min-width: 0 !important;
        min-height: 56px !important;
        padding: 4px 2px !important;
      }
      .nika-tabbar span {
        width: 100%;
        max-width: 100%;
        font-size: 9px !important;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* The content viewport itself may scroll vertically, never horizontally. */
      #app-content,
      keenetic-hero-panel {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        overflow-x: hidden;
      }

      /* Narrow phones keep symmetric rails; Back becomes icon-only. */
      @media (max-width: 390px) {
        .nika-header {
          grid-template-columns: 56px minmax(0, 1fr) 56px !important;
        }
        .back {
          width: 44px !important;
          justify-content: center !important;
          padding: 0 !important;
        }
        .back span { display: none !important; }
        .refresh { width: 44px !important; }
      }
    `;
    root.append(style);
  }
}

if (!customElements.get("keenetic-hero-app-panel-v031")) {
  customElements.define("keenetic-hero-app-panel-v031", KeeneticHeroAppPanelV031);
}
