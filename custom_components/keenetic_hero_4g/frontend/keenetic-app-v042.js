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
await import("./keenetic-app-v041.js?v=0.4.2");

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
