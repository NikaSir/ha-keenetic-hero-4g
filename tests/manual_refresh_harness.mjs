import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const bundle = new URL("../custom_components/keenetic_hero_4g/frontend/keenetic-panel-bundle.js", import.meta.url);
const registry = new Map();
const storage = new Map();
const timers = new Map();
let now = 0;
let nextTimer = 0;

function schedule(callback, delay) {
  const id = ++nextTimer;
  timers.set(id, { callback, dueAt: now + delay });
  return id;
}

function advance(milliseconds) {
  const target = now + milliseconds;
  for (;;) {
    const due = [...timers.entries()].filter(([, timer]) => timer.dueAt <= target)
      .sort((left, right) => left[1].dueAt - right[1].dueAt)[0];
    if (!due) break;
    const [id, timer] = due;
    now = timer.dueAt;
    timers.delete(id);
    timer.callback();
  }
  now = target;
}

class FakeHTMLElement {
  constructor() { this.isConnected = true; }
  attachShadow() { this.shadowRoot = {}; }
}
const context = {
  HTMLElement: FakeHTMLElement,
  customElements: {
    get: (name) => registry.get(name),
    define: (name, value) => registry.set(name, value),
  },
  location: { hash: "", pathname: "/dashboard-keenetic", search: "" },
  window: {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    setTimeout: schedule,
    clearTimeout: (id) => timers.delete(id),
    removeEventListener() {},
  },
  setTimeout: schedule,
  clearTimeout: (id) => timers.delete(id),
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(bundle, "utf8"), context);

const fresh = {
  entities: { active_wan: "sensor.active_wan" },
  sources: { active_wan: "rci" },
  telemetry: { last_update_success: true },
};
const panel = new (registry.get("keenetic-hero-panel"))();
panel._scheduleRender = () => {};
let viewLoads = 0;
panel._loadViewData = () => { viewLoads += 1; };
panel._trafficHistory = { "24h": { old: [] } };
panel._failoverHistory = [{ from: "Ethernet", to: "LTE" }];
const requests = [];
panel._panel = { config: { entry_id: "entry-1" } };
let respond = async () => fresh;
panel._hass = {
  async callWS(request) {
    requests.push(request);
    return respond();
  },
};

const attributes = new Map();
const refreshIcon = { icon: "mdi:refresh", setAttribute: (_name, value) => { refreshIcon.icon = value; } };
const button = {
  disabled: false,
  dataset: {},
  setAttribute: (name, value) => attributes.set(name, value),
  removeAttribute: (name) => attributes.delete(name),
  querySelector: () => refreshIcon,
};
const status = { textContent: "", classList: { add() {}, remove() {} } };
const app = new (registry.get("keenetic-hero-app-panel-v100"))();
app._child = panel;
app.shadowRoot = {
  getElementById: (id) => id === "k100-refresh" ? button : id === "k100-scale-status" ? status : null,
};

const first = app._runManualRefresh();
assert.equal(requests.length, 1, "refresh must request a poll immediately");
assert.equal(requests[0].type, "keenetic_hero_4g/panel/refresh");
assert.equal(requests[0].entry_id, "entry-1");
assert.equal(button.disabled, true);
assert.equal(button.dataset.state, "busy");
assert.equal(attributes.get("aria-busy"), "true");
assert.equal(status.textContent, "Обновление данных…");
await app._runManualRefresh();
assert.equal(requests.length, 1, "duplicate activation must not poll again");
advance(899);
assert.equal(button.dataset.state, "busy");
advance(1);
await first;
assert.equal(button.disabled, false);
assert.equal(button.dataset.state, "success");
assert.equal(attributes.has("aria-busy"), false);
assert.equal(status.textContent, "Запрос обновления выполнен");
assert.equal(refreshIcon.icon, "mdi:check");
assert.equal(panel._bootstrap, fresh);
assert.deepEqual(Object.keys(panel._trafficHistory), []);
assert.equal(panel._failoverHistory.length, 0);
assert.equal(viewLoads, 1);
advance(1399);
assert.equal(refreshIcon.icon, "mdi:check");

let complete;
const failed = { ...fresh, telemetry: { last_update_success: false, connection_available: false } };
respond = () => new Promise(resolve => { complete = resolve; });
const retry = app._runManualRefresh();
advance(1500);
assert.equal(button.dataset.state, "busy", "old result timer or busy minimum must not clear a pending retry");
assert.equal(button.disabled, true);
complete(failed);
await retry;
assert.equal(panel._bootstrap, failed, "failed poll status remains available to the indicators");
assert.equal(button.dataset.state, "error");
assert.equal(button.disabled, false);
assert.equal(refreshIcon.icon, "mdi:alert-circle-outline");
assert.equal(status.textContent, "Не удалось обновить данные");
advance(1400);
assert.equal(button.dataset.state, "idle");
assert.equal(refreshIcon.icon, "mdi:refresh");
assert.equal(attributes.get("aria-label"), "Обновить");

respond = async () => { throw new Error("router unavailable"); };
const rejected = app._runManualRefresh();
advance(900);
await rejected;
assert.equal(button.dataset.state, "error");
advance(1400);
app._child = null;
const unavailable = app._runManualRefresh();
advance(900);
await unavailable;
assert.equal(button.dataset.state, "error");

app._child = panel;
respond = () => new Promise(resolve => { complete = resolve; });
const detached = app._runManualRefresh();
app.isConnected = false;
app.disconnectedCallback();
complete(fresh);
advance(900);
await detached;
assert.equal(button.dataset.state, "idle", "late result cannot change a detached header");
assert.equal(timers.size, 0);

console.log("Keenetic manual refresh harness passed");
