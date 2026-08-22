import "./keenetic-app-v025.js?v=0.2.6";

const APP_SHELL_VERSION = "0.2.6";
const BASE_COMPONENT = customElements.get("keenetic-hero-panel");
const V025_COMPONENT = customElements.get("keenetic-hero-app-panel-v025");

if (BASE_COMPONENT) {
  // Period buttons must be symmetric. The base implementation cached each
  // period for the lifetime of the panel, so 24h -> 7d -> 30d fetched new data
  // while 30d -> 7d -> 24h reused stale cached results. Always refresh the
  // selected period and use a request generation so late responses cannot
  // overwrite the current period/loading state.
  BASE_COMPONENT.prototype._loadTrafficHistory = async function () {
    if (!this._hass || !this._bootstrap) return;

    const period = this._trafficPeriod;
    const spec = {
      "24h": { ms: 24 * 3600e3, bucket: "5minute" },
      "7d": { ms: 7 * 24 * 3600e3, bucket: "hour" },
      "30d": { ms: 30 * 24 * 3600e3, bucket: "day" },
    }[period];
    if (!spec) return;

    const series = [...this._historyIds("ethernet"), ...this._historyIds("lte")];
    if (!series.length) return;

    this._trafficRequestGeneration = (this._trafficRequestGeneration || 0) + 1;
    const generation = this._trafficRequestGeneration;
    this._trafficLoadingPeriod = period;
    this._trafficLoading = true;
    this._trafficError = null;
    this._scheduleRender();

    try {
      const now = new Date();
      const start = new Date(now.getTime() - spec.ms);
      const statisticIds = [...new Set(series.map((item) => item.entityId))];
      const result = await this._hass.callWS({
        type: "recorder/statistics_during_period",
        start_time: start.toISOString(),
        end_time: now.toISOString(),
        statistic_ids: statisticIds,
        period: spec.bucket,
        types: ["mean"],
      });

      // Cache by period for rendering, but never use the cache to suppress a
      // later user-requested refresh of that period.
      this._trafficHistory[period] = result || {};
    } catch (err) {
      if (generation === this._trafficRequestGeneration) {
        this._trafficError = err?.message || String(err);
      }
    } finally {
      if (generation === this._trafficRequestGeneration) {
        this._trafficLoadingPeriod = null;
        this._trafficLoading = false;
        this._scheduleRender();
      }
    }
  };
}

class KeeneticHeroAppPanelV026 extends V025_COMPONENT {
  connectedCallback() {
    super.connectedCallback();
    this._updateVersionLabel();
  }

  _renderShell() {
    super._renderShell();
    this._updateVersionLabel();
  }

  _updateVersionLabel() {
    const subtitle = this.shadowRoot?.querySelector(".title span");
    if (subtitle) subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION}`;
  }
}

if (!customElements.get("keenetic-hero-app-panel-v026")) {
  customElements.define("keenetic-hero-app-panel-v026", KeeneticHeroAppPanelV026);
}
