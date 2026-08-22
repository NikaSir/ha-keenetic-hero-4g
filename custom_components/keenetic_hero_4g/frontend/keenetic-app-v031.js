const APP_SHELL_VERSION_V031 = "0.3.1";
const V030_COMPONENT = customElements.get("keenetic-hero-app-panel-v030");

class KeeneticHeroAppPanelV031 extends V030_COMPONENT {
  connectedCallback() {
    super.connectedCallback();
    this._applyTemplateV031();
  }

  _renderShell() {
    super._renderShell();
    this._applyTemplateV031();
  }

  _applyTemplateV031() {
    const root = this.shadowRoot;
    if (!root) return;

    const subtitle = root.querySelector(".title span");
    if (subtitle) {
      subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION_V031}`;
    }

    if (root.querySelector("style[data-nikas-v031-template]")) return;
    const style = document.createElement("style");
    style.dataset.nikasV031Template = "true";
    style.textContent = `
      /* NikaS Integration Panel Template v1.0
         Header = 52px | minmax(0,1fr) | 52px. */
      .nika-header {
        grid-template-columns: 52px minmax(0, 1fr) 52px !important;
        column-gap: 4px !important;
        min-height: 60px !important;
        padding-left: max(8px, env(safe-area-inset-left)) !important;
        padding-right: max(8px, env(safe-area-inset-right)) !important;
      }
      .back,
      .refresh {
        width: 52px !important;
        min-width: 52px !important;
        min-height: 44px !important;
        padding: 0 !important;
        justify-self: center !important;
        justify-content: center !important;
      }
      .back span { display: none !important; }
      .back ha-icon,
      .refresh ha-icon { --mdc-icon-size: 24px !important; }

      .title {
        width: 100%;
        min-width: 0 !important;
        justify-self: center;
        text-align: center !important;
        line-height: 1.1 !important;
      }
      .title strong {
        display: block;
        font-size: 17px !important;
        font-weight: 750 !important;
        line-height: 1.12 !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .title span {
        display: block;
        margin-top: 2px !important;
        font-size: 9px !important;
        font-weight: 600 !important;
        line-height: 1.15 !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Common NikaS card rhythm. */
      #app-content .view {
        gap: 14px !important;
      }
      #app-content .card {
        border-radius: 22px !important;
        box-shadow: 0 2px 10px color-mix(in srgb, #000 5%, transparent) !important;
      }
      #app-content .hero-card,
      #app-content .channel-card,
      #app-content .failover-strip,
      #app-content .detail-card,
      #app-content .traffic-summary,
      #app-content .failover-hero,
      #app-content .event-card,
      #app-content .system-hero,
      #app-content .diagnostics-card,
      #app-content .diagnostic-actions,
      #app-content .integrity-card {
        padding: 16px !important;
      }

      /* Full-width, edge-attached Bottom Tab Bar. */
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

      /* Mobile content: vertical scroll only. */
      #app-content,
      keenetic-hero-panel {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        overflow-x: hidden;
      }

      /* Desktop is an adaptation of the same information hierarchy. */
      #app-content > keenetic-hero-panel {
        max-width: 1280px;
        margin: 0 auto;
      }

      /* NikaS narrow-mobile header = 48px | 1fr | 48px. */
      @media (max-width: 390px) {
        .nika-header {
          grid-template-columns: 48px minmax(0, 1fr) 48px !important;
        }
        .back,
        .refresh {
          width: 48px !important;
          min-width: 48px !important;
        }
        .title strong { font-size: 16px !important; }
        .title span { font-size: 8.5px !important; }
      }
    `;
    root.append(style);
  }
}

if (!customElements.get("keenetic-hero-app-panel-v031")) {
  customElements.define("keenetic-hero-app-panel-v031", KeeneticHeroAppPanelV031);
}
