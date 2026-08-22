const APP_SHELL_VERSION_V030 = "0.3.0";
const BOOTSTRAP_TIMEOUT_V030_MS = 5000;
const BASE_COMPONENT_V030 = customElements.get("keenetic-hero-panel");
const V029_COMPONENT = customElements.get("keenetic-hero-app-panel-v029");

function bootstrapFallbackV030(panel) {
  return (
    panel?.config?.bootstrap_fallback ||
    panel?.config?.config?.bootstrap_fallback ||
    panel?.bootstrap_fallback ||
    null
  );
}

if (BASE_COMPONENT_V030) {
  BASE_COMPONENT_V030.prototype._loadBootstrap = async function (silent = false) {
    if (!this._hass || this._bootstrapLoading) return;

    this._bootstrapLoading = true;
    if (!silent) this._bootstrapError = null;

    let timeoutId = null;
    try {
      const config = this._panel?.config || {};
      const request = this._hass.callWS({
        type: "keenetic_hero_4g/panel/bootstrap",
        ...(config.entry_id ? { entry_id: config.entry_id } : {}),
      });
      const timeout = new Promise((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error("Bootstrap Keenetic не ответил за 5 сек")),
          BOOTSTRAP_TIMEOUT_V030_MS,
        );
      });

      const result = await Promise.race([request, timeout]);
      this._bootstrap = result;
      this._bootstrapError = null;
      this._loadViewData?.();
    } catch (err) {
      const fallback = bootstrapFallbackV030(this._panel);
      if (!this._bootstrap && fallback) {
        this._bootstrap = fallback;
        this._bootstrapError = null;
      } else if (!this._bootstrap) {
        this._bootstrapError = err?.message || String(err);
      }
    } finally {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      this._bootstrapLoading = false;
      this._scheduleRender?.();
    }
  };

  BASE_COMPONENT_V030.prototype._loadViewData = function () {
    // Stabilisation build: Traffic must not perform Recorder requests.
    if (this._view === "failover") this._loadFailoverHistory?.();
  };

  BASE_COMPONENT_V030.prototype._renderTraffic = function () {
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

      <p class="hint">История трафика временно отключена. Периоды 24 ч / 7 дн / 30 дн вернутся отдельным изменением после стабилизации панели.</p>
    </section>`;
  };
}

class KeeneticHeroAppPanelV030 extends V029_COMPONENT {
  _upgradePredefinedPropertyV030(name) {
    if (!Object.prototype.hasOwnProperty.call(this, name)) return;
    const value = this[name];
    delete this[name];
    this[name] = value;
  }

  set panel(value) {
    this._panel = value;
    this._ensureChild?.();
    if (this._child) {
      this._child.panel = value;
      const fallback = bootstrapFallbackV030(value);
      if (!this._child._bootstrap && fallback) {
        this._child._bootstrap = fallback;
        this._child._bootstrapError = null;
        this._child._scheduleRender?.();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    // Home Assistant may set these properties before custom-element upgrade.
    // Replay own properties through setters after the shell/child exists.
    this._upgradePredefinedPropertyV030("panel");
    this._upgradePredefinedPropertyV030("hass");
    this._upgradePredefinedPropertyV030("route");

    if (this._panel && this._child) {
      const fallback = bootstrapFallbackV030(this._panel);
      if (!this._child._bootstrap && fallback) {
        this._child._bootstrap = fallback;
        this._child._bootstrapError = null;
        this._child._scheduleRender?.();
      }
    }

    this._updateVersionLabelV030();
  }

  _renderShell() {
    super._renderShell();
    this._updateVersionLabelV030();
  }

  _updateVersionLabelV030() {
    const subtitle = this.shadowRoot?.querySelector(".title span");
    if (subtitle) subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION_V030}`;
  }
}

if (!customElements.get("keenetic-hero-app-panel-v030")) {
  customElements.define("keenetic-hero-app-panel-v030", KeeneticHeroAppPanelV030);
}
