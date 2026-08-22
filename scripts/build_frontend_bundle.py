from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"
OUTPUT = FRONTEND / "keenetic-panel-bundle.js"
CSS_SOURCE = FRONTEND / "keenetic-panel.css"
SOURCES = [
    FRONTEND / "keenetic-panel.js",
    FRONTEND / "keenetic-app-v023.js",
    FRONTEND / "keenetic-app-v024.js",
    FRONTEND / "keenetic-app-v025.js",
    FRONTEND / "keenetic-app-v026.js",
    FRONTEND / "keenetic-app-v027.js",
    FRONTEND / "keenetic-app-v028.js",
    FRONTEND / "keenetic-app-v029.js",
]
IMPORT_RE = re.compile(r"^\s*import\s+[\"']\./[^\"']+[\"'];?\s*$", re.MULTILINE)


def _clean(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    text = IMPORT_RE.sub("", text).strip()
    if re.search(r"^\s*(?:import|export)\b", text, re.MULTILINE):
        raise SystemExit(f"Unsupported ES module statement remains in {path}")
    return text


def _wrap(path: Path) -> str:
    relative = path.relative_to(ROOT).as_posix()
    return "\n".join(
        [
            f"// BEGIN {relative}",
            "(() => {",
            _clean(path),
            "})();",
            f"// END {relative}",
        ]
    )


def _inline_css_patch() -> str:
    css = CSS_SOURCE.read_text(encoding="utf-8")
    css_literal = json.dumps(css, ensure_ascii=False)
    return f"""// BEGIN inlined keenetic-panel.css
(() => {{
  const BUNDLED_CSS = {css_literal};
  const BasePanel = customElements.get(\"keenetic-hero-panel\");
  if (!BasePanel || BasePanel.prototype.__keeneticBundledCss) return;
  BasePanel.prototype.__keeneticBundledCss = true;
  const previousRender = BasePanel.prototype._render;
  BasePanel.prototype._render = function (...args) {{
    previousRender.apply(this, args);
    const root = this.shadowRoot;
    if (!root) return;
    root.querySelectorAll('link[rel=\"stylesheet\"][href*=\"keenetic-panel.css\"]').forEach((node) => node.remove());
    let style = root.querySelector('style[data-keenetic-bundled-css]');
    if (!style) {{
      style = document.createElement(\"style\");
      style.dataset.keeneticBundledCss = \"true\";
      root.append(style);
    }}
    style.textContent = BUNDLED_CSS;
  }};
}})();
// END inlined keenetic-panel.css"""


def build() -> str:
    parts = [
        "// GENERATED FILE. DO NOT EDIT DIRECTLY.",
        "// Keenetic Hero 4G+ self-contained Home Assistant panel bundle.",
        "// Historical UI modules and CSS are composed at build time only.",
        "",
    ]
    for path in SOURCES:
        if not path.exists():
            raise SystemExit(f"Missing frontend source: {path}")
        parts.append(_wrap(path))
        parts.append("")
    parts.append(_inline_css_patch())
    parts.append("")
    return "\n".join(parts).rstrip() + "\n"


if __name__ == "__main__":
    content = build()
    OUTPUT.write_text(content, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({len(content)} bytes)")
