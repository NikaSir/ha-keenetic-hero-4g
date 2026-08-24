await import("./keenetic-app-v043.js?v=0.4.4");

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
