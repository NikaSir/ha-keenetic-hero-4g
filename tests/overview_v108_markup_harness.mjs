import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const sourcePath = new URL(
  "../custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js",
  import.meta.url,
);
const source = fs.readFileSync(sourcePath, "utf8");
const overviewOnly = source.slice(0, source.indexOf("function k100InstallCore"));
const context = {
  customElements: { get: () => class {} },
};
vm.createContext(context);
vm.runInContext(`${overviewOnly}\nglobalThis.renderOverview = k100Overview;`, context);

const panel = {
  _internet: () => ({ online: true }),
  _telemetry: () => ({ trusted: true, stale: false, age: 4 }),
  _activeWan: () => "ethernet",
  _connection: () => ({ state: "up" }),
  _entityId: () => null,
  _display: (_role, fallback) => fallback,
};

const markup = context.renderOverview(panel);

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
assert.ok(directHeroClasses.includes("k100-hero-accent"), "Hero background needs the cyan accent");
assert.ok(directHeroClasses.includes("k100-scene"), "Photo must be an inset scene");
assert.ok(!directHeroClasses.includes("k100-channel"), "Channel plaques must not sit on the hero background");
assert.ok(!directHeroClasses.includes("k100-router"), "Router must stay inside the photo scene");

const scene = findByClass(hero, "k100-scene");
assert.ok(findByClass(scene, "k100-lte"), "LTE plaque must stay inside the photo scene");
assert.ok(findByClass(scene, "k100-eth"), "Ethernet plaque must stay inside the photo scene");
assert.ok(findByClass(scene, "k100-lan"), "LAN plaque must stay inside the photo scene");
assert.ok(findByClass(scene, "k100-router"), "Router must stay inside the photo scene");

