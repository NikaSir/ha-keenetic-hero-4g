import "./keenetic-app-v026.js?v=0.2.7";

const APP_SHELL_VERSION = "0.2.7";
const BASE_COMPONENT = customElements.get("keenetic-hero-panel");
const V026_COMPONENT = customElements.get("keenetic-hero-app-panel-v026");

function trafficTimeoutMs(period) {
  if (period === "30d") return 10000;
  if (period === "7d") return 8000;
  return 6000;
}

if (BASE_COMPONENT) {
  // Recorder can occasionally leave a long-range statistics request pending for
  // a long time. A primary mobile panel must never become trapped in Loading.
  // Each click starts an independent logical generation; older responses are
  // ignored, and the current generation has a finite UI timeout.
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
    const timeoutMs = trafficTimeoutMs(period);

    this._trafficLoadingPeriod = period;
    this._trafficLoading = true;
    this._trafficError = null;
    this._scheduleRender();

    let timeoutId = null;
    try {
      const now = new Date();
      const start = new Date(now.getTime() - spec.ms);
      const statisticIds = [...new Set(series.map((item) => item.entityId))];

      const recorderRequest = this._hass.callWS({
        type: "recorder/statistics_during_period",
        start_time: start.toISOString(),
        end_time: now.toISOString(),
        statistic_ids: statisticIds,
        period: spec.bucket,
        types: ["mean"],
      });

      const timeoutRequest = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error(`Recorder не ответил за ${Math.round(timeoutMs / 1000)} сек`));
        }, timeoutMs);
      });

      const result = await Promise.race([recorderRequest, timeoutRequest]);

      if (generation === this._trafficRequestGeneration) {
        this._trafficHistory[period] = result || {};
        this._trafficError = null;
      }
    } catch (err) {
      if (generation === this._trafficRequestGeneration) {
        this._trafficError = err?.message || String(err);
      }
    } finally {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (generation === this._trafficRequestGeneration) {
        this._trafficLoadingPeriod = null;
        this._trafficLoading = false;
        this._scheduleRender();
      }
    }
  };
}

class KeeneticHeroAppPanelV027 extends V026_COMPONENT {
  connectedCallback() {
    super.connectedCallback();
    this._updateVersionLabelV027();
  }

  _renderShell() {
    super._renderShell();
    this._updateVersionLabelV027();
  }

  _updateVersionLabelV027() {
    const subtitle = this.shadowRoot?.querySelector(".title span");
    if (subtitle) subtitle.textContent = `Network Control Center · UI v${APP_SHELL_VERSION}`;
  }
}

if (!customElements.get("keenetic-hero-app-panel-v027")) {
  customElements.define("keenetic-hero-app-panel-v027", KeeneticHeroAppPanelV027);
}
