import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const frontend = new URL(
  "../custom_components/keenetic_hero_4g/frontend/",
  import.meta.url,
);
const source = (name) => fs.readFileSync(new URL(name, frontend), "utf8");

class CorePanel {
  constructor() {
    this._bootstrap = { entities: { old: "sensor.old" } };
    this._bootstrapLoading = false;
    this._trafficHistory = { "24h": { old: [] } };
    this._failoverHistory = [{ from: "Ethernet", to: "LTE" }];
    this.renderCount = 0;
    this.viewLoadCount = 0;
  }
  _scheduleRender() { this.renderCount += 1; }
  _loadViewData() { this.viewLoadCount += 1; }
}

const registry = new Map([["keenetic-hero-panel", CorePanel]]);
class FakeHTMLElement {
  attachShadow() { this.shadowRoot = {}; }
}
const storage = new Map();
const context = {
  HTMLElement: FakeHTMLElement,
  customElements: {
    get: (name) => registry.get(name),
    define: (name, value) => registry.set(name, value),
  },
  document: { createElement: () => ({ dataset: {}, textContent: "" }) },
  location: { hash: "", pathname: "/dashboard-keenetic", search: "" },
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  },
  window: {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    setTimeout,
    clearTimeout,
  },
  setTimeout,
  clearTimeout,
  captureNikasShellReturnRoute: () => "/dashboard-infrastructure/overview",
  navigateNikasShell: () => {},
  nikasShellV2Styles: () => "",
  createNikasShellScrollBoundaryGuard: () => () => {},
};
vm.createContext(context);
vm.runInContext(source("keenetic-app-v045.js").replace(/^await import\([^\n]+\);\s*/, ""), context);
vm.runInContext(source("keenetic-app-v100.js"), context);

const fresh = {
  entities: { active_wan: "sensor.active_wan" },
  sources: { active_wan: "rci" },
  telemetry: { last_update_success: true },
};
const panel = new CorePanel();
const requests = [];
panel._panel = { config: { entry_id: "entry-1" } };
panel._hass = {
  async callWS(request) {
    requests.push(request);
    return fresh;
  },
};

await panel._refreshNow();
assert.equal(requests.length, 1);
assert.equal(requests[0].type, "keenetic_hero_4g/panel/refresh");
assert.equal(requests[0].entry_id, "entry-1");
assert.equal(panel._bootstrap, fresh, "manual refresh must install the post-poll payload");
assert.equal(Object.keys(panel._trafficHistory).length, 0, "manual refresh must invalidate traffic history");
assert.equal(panel._failoverHistory.length, 0, "manual refresh must invalidate failover history");
assert.equal(panel.viewLoadCount, 1, "active-view data must reload after the router poll");

const AppPanel = registry.get("keenetic-hero-app-panel-v100");
const buttonClasses = new Set();
const attributes = new Map();
const button = {
  disabled: false,
  classList: {
    add: (name) => buttonClasses.add(name),
    remove: (name) => buttonClasses.delete(name),
  },
  setAttribute: (name, value) => attributes.set(name, value),
  removeAttribute: (name) => attributes.delete(name),
};
const statusClasses = new Set();
const status = {
  textContent: "Масштаб 100%",
  classList: {
    add: (name) => statusClasses.add(name),
    remove: (name) => statusClasses.delete(name),
  },
};
let resolveRefresh;
const app = Object.create(AppPanel.prototype);
app._manualRefreshRunning = false;
app._child = { _refreshNow: () => new Promise((resolve) => { resolveRefresh = resolve; }) };
app.shadowRoot = {
  getElementById: (id) => id === "k100-refresh" ? button : id === "k100-scale-status" ? status : null,
};

const pending = app._runManualRefresh();
assert.equal(button.disabled, true, "refresh button must lock while the poll is running");
assert.equal(buttonClasses.has("refreshing"), true, "refresh icon must show progress");
assert.equal(attributes.get("aria-busy"), "true");
assert.equal(status.textContent, "Обновление данных…");
resolveRefresh();
await pending;
assert.equal(button.disabled, false);
assert.equal(buttonClasses.has("refreshing"), false);
assert.equal(attributes.has("aria-busy"), false);
assert.equal(status.textContent, "Данные обновлены");

app._child = { _refreshNow: async () => { throw new Error("router unavailable"); } };
await app._runManualRefresh();
assert.equal(status.textContent, "Ошибка обновления");
assert.equal(button.disabled, false, "failed refresh must unlock the button");

console.log("Keenetic manual refresh harness passed");
