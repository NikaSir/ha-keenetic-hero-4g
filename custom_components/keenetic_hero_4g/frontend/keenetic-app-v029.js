import "./keenetic-app-v028.js?v=0.2.9";

const APP_SHELL_VERSION = "0.2.9";
const V028_COMPONENT = customElements.get("keenetic-hero-app-panel-v028");

class KeeneticHeroAppPanelV029 extends V028_COMPONENT {
  _upgradePredefinedProperty(name) {
    if (!Object.prototype.hasOwnProperty.call(this, name)) return;
    const value = this[name];
    delete this[name];
    this[name] = value;
  }

  set panel(value) {
    const fallback =
      value?.config?.bootstrap_fallback ||
      value?.config?.config?.bootstrap_fallback ||
      value?.bootstrap_fallback ||
      null;

    if (!this._bootstrap && fallback) {
      this._bootstrap = fallback;
      this._bootstrapError = null;
    }

    this._panel = value;
    if (!location.hash && value?.config?.preferred_view) {
      this._view = value.config.preferred_view;
    }
    this._scheduleRender?.();
  }

  connectedCallback() {
    // HA may assign properties before the custom element is upgraded. Replaying
    // them through the prototype setters prevents an own-property shadow from
    // bypassing bootstrap_fallback on iOS/WebView cold starts.
    this._upgradePredefinedProperty("panel");
    this._upgradePredefinedProperty("hass");
    this._upgradePredefinedProperty("route");

    super.connectedCallback();
    this._updateVersionLabelV029();
  }

  _renderShell() {
    super._renderShell();
    this._updateVersionLabelV029();
  }

  _loadViewData() {
    // Stabilisation build: Recorder-backed Traffic history is deliberately
    // disabled. Keep only failover history loading; Traffic renders factual
    // current/cumulative HA entities without any recorder request.
    if (this._view === "failover") this._loadFailoverHistory();
  }

  _renderTraffic() {
    return `<section class="view">
      <article class="card traffic-summary">
        <div class="section-heading"><div><ha-icon icon="mdi:chart-timeline-variant"></ha-icon><h2>Трафик</h2></div></div>
        <div class="traffic-totals">
          <div><span>Ethernet сегодня</span><strong>${this._display("ethernet_total_daily", "Неизвестно")}</strong><small>месяц ${this._display("ethernet_total_monthly", "—")}</small></div>
          <div><span>LTE сегодня</span><strong>${this._display("lte_total_daily", "Неизвестно")}</strong><small>месяц ${this._display("lte_total_monthly", "—")}</small></div>
        </div>
      </article>

      <article class="card detail-card">
        <div class="section-heading"><div><ha-icon icon="mdi:speedometer"></ha-icon><h2>Сейчас</h2></div></div>
        <div class="detail-grid">
          ${this._metric("ethernet_rx_mbps", "Ethernet RX")}
          ${this._metric("ethernet_tx_mbps", "Ethernet TX")}
          ${this._metric("lte_rx_mbps", "LTE RX")}
          ${this._metric("lte_tx_mbps", "LTE TX")}
        </div>
      </article>

      <article class="card detail-card">
        <div class="section-heading"><div><ha-icon icon="mdi:counter"></ha-icon><h2>Накопительные счётчики</h2></div></div>
        <div class="detail-grid">
          ${this._metric("ethernet_rx_total_gib", "Ethernet RX всего")}
          ${this._metric("ethernet_tx_total_gib", "Ethernet TX всего")}
          ${this._metric("lte_rx_total_gb", "LTE RX всего")}
          ${this._metric("lte_tx_total_gb", "LTE TX всего")}
        </div>
      </article>

      <p class="hint">История 24 ч / 7 дн / 30 дн временно отключена. Сначала стабилизируем запуск панели; Recorder-графики вернём отдельным изменением.</p>
    </section>`;
  }

  _updateVersionLabelV029() {
    const subtitle = this.shadowRoot?.querySelector(".title span");
    if (subtitle) subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION}`;
  }
}

if (!customElements.get("keenetic-hero-app-panel-v029")) {
  customElements.define("keenetic-hero-app-panel-v029", KeeneticHeroAppPanelV029);
}
