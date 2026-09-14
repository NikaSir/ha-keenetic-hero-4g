import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const sourcePath = new URL(
  "../custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js",
  import.meta.url,
);
const source = fs.readFileSync(sourcePath, "utf8");
const overviewOnly = source.slice(0, source.indexOf("class KeeneticHeroAppPanelV100"));
let installedStyle = null;
const context = {
  customElements: { get: () => class {} },
  document: {
    createElement: () => ({ dataset: {}, textContent: "" }),
  },
};
vm.createContext(context);
vm.runInContext(
  `${overviewOnly}\nglobalThis.renderOverview = k100Overview;globalThis.installStyles = k100InstallStyles;`,
  context,
);

const panel = {
  _internet: () => ({ online: true }),
  _telemetry: () => ({ trusted: true, stale: false, age: 4 }),
  _activeWan: () => "ethernet",
  _connection: () => ({ state: "up" }),
  _entityId: () => null,
  _display: (_role, fallback) => fallback,
};

const markup = context.renderOverview(panel);
context.installStyles({
  querySelector: () => null,
  append: (style) => { installedStyle = style.textContent; },
});
assert.ok(installedStyle, "Overview styles must be installed");

function declarations(selector, css = installedStyle) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\{([^}]+)\\}`));
  assert.ok(match, `Missing CSS rule: ${selector}`);
  return Object.fromEntries(match[1].split(";").filter(Boolean).map((entry) => {
    const separator = entry.indexOf(":");
    return [entry.slice(0, separator).trim(), entry.slice(separator + 1).trim()];
  }));
}

function parseMarkup(html) {
  const root = { tag: "root", classes: [], children: [] };
  const stack = [root];
  const tagPattern = /<\/?[a-z][^>]*>/gi;
  for (const match of html.matchAll(tagPattern)) {
    const token = match[0];
    const closing = token.startsWith("</");
    const tag = token.match(/^<\/?([a-z][\w-]*)/i)?.[1]?.toLowerCase();
    if (!tag) continue;
    if (closing) {
      assert.equal(stack.at(-1)?.tag, tag, `Unbalanced closing tag: ${token}`);
      stack.pop();
      continue;
    }
    const classValue = token.match(/\bclass="([^"]*)"/i)?.[1] ?? "";
    const node = {
      tag,
      classes: classValue.split(/\s+/).filter(Boolean),
      children: [],
    };
    stack.at(-1).children.push(node);
    if (!new Set(["img", "input", "br", "hr", "meta", "link"]).has(tag)) {
      stack.push(node);
    }
  }
  assert.equal(stack.length, 1, "Markup must be balanced");
  return root;
}

function findByClass(node, className) {
  if (node.classes.includes(className)) return node;
  for (const child of node.children) {
    const found = findByClass(child, className);
    if (found) return found;
  }
  return null;
}

const tree = parseMarkup(markup);
const hero = findByClass(tree, "k100-hero");
assert.ok(hero, "Overview must render the hero surface");

const directHeroClasses = hero.children.flatMap((node) => node.classes);
assert.ok(directHeroClasses.includes("k100-copy"), "Status copy belongs on the hero background");
assert.ok(directHeroClasses.includes("k100-indicator"), "Connection status belongs on the hero background");
assert.ok(directHeroClasses.includes("k100-hero-decoration"), "Hero background needs a clipped decoration layer");
assert.ok(directHeroClasses.includes("k100-scene"), "Photo must be an inset scene");
assert.ok(!directHeroClasses.includes("k100-channel"), "Channel plaques must not sit on the hero background");
assert.ok(!directHeroClasses.includes("k100-router"), "Router must stay inside the photo scene");

const scene = findByClass(hero, "k100-scene");
assert.ok(findByClass(scene, "k100-lte"), "LTE plaque must stay inside the photo scene");
assert.ok(findByClass(scene, "k100-eth"), "Ethernet plaque must stay inside the photo scene");
assert.ok(findByClass(scene, "k100-lan"), "LAN plaque must stay inside the photo scene");
assert.ok(findByClass(scene, "k100-router"), "Router must stay inside the photo scene");

const decoration = findByClass(hero, "k100-hero-decoration");
assert.ok(findByClass(decoration, "k100-hero-accent"), "Cyan accent belongs inside the clipped layer");

const indicator = declarations(".k100-indicator");
assert.equal(indicator.width, "168px");
assert.equal(indicator["min-width"], "168px");
assert.equal(indicator["max-width"], "168px");
assert.equal(indicator.height, "58px");
assert.equal(indicator["min-height"], "58px");
assert.equal(indicator["max-height"], "58px");
assert.equal(indicator.top, "13px");
assert.equal(indicator.right, "13px");
assert.equal(indicator.padding, "11px 12px");
assert.equal(indicator["grid-template-columns"], "10px minmax(0,1fr)");
assert.equal(indicator["column-gap"], "9px");
assert.equal(indicator["white-space"], "nowrap");

const accent = declarations(".k100-hero-accent");
assert.equal(accent.width, "205px");
assert.equal(accent.height, "205px");
assert.equal(accent.top, "-92px");
assert.equal(accent.right, "-70px");
assert.equal(accent.background, "color-mix(in srgb,var(--primary-color,#03a9d9) 12%,var(--card-background-color,#fff))");

const healthyIndicator = declarations(".k100-indicator.ok");
assert.equal(healthyIndicator.color, "var(--success-color,#43a047)");
assert.equal(
  healthyIndicator.background,
  "color-mix(in srgb,var(--card-background-color) 89%,var(--success-color,#43a047) 11%)",
  "Healthy connection surface must inherit the active light or dark card background",
);
assert.equal(
  declarations(".k100-indicator.warn").background,
  "color-mix(in srgb,var(--card-background-color) 90%,var(--warning-color,#f6a623) 10%)",
);
assert.equal(
  declarations(".k100-indicator.bad").background,
  "color-mix(in srgb,var(--card-background-color) 90%,var(--error-color,#db4437) 10%)",
);

const readyReserve = declarations(".k100-reserve.reserve");
assert.equal(readyReserve.color, "var(--primary-color,#03a9d9)");
assert.equal(
  readyReserve.background,
  "color-mix(in srgb,var(--card-background-color) 90%,var(--primary-color,#03a9d9) 10%)",
  "Ready-reserve surface must inherit the active light or dark card background",
);
assert.equal(
  declarations(".k100-reserve.unavailable").background,
  "color-mix(in srgb,var(--card-background-color) 90%,var(--warning-color,#f6a623) 10%)",
);
assert.equal(
  declarations(".k100-reserve.unknown").background,
  "color-mix(in srgb,var(--card-background-color) 92%,var(--secondary-text-color) 8%)",
);

const mobileCss = installedStyle.slice(installedStyle.indexOf("@media(max-width:430px)"));
assert.doesNotMatch(mobileCss, /\.k100-indicator\{[^}]*\bwidth:/, "Phone CSS must not resize the connection plaque");
assert.doesNotMatch(mobileCss, /\.k100-indicator\{[^}]*(?:\btop:|\bright:)/, "Phone CSS must not move the connection plaque");
