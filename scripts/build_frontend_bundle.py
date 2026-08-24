from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"
OUTPUT = FRONTEND / "keenetic-panel-bundle.js"
CSS_SOURCE = FRONTEND / "keenetic-panel.css"

# Current production dependency graph only. Historical v0.2/v0.3 modules remain
# in Git as source history but must not be executed by the current bundle.
SOURCES = [
    FRONTEND / "keenetic-panel.js",
    FRONTEND / "keenetic-overview-v040.js",
    FRONTEND / "keenetic-app-v040.js",
    FRONTEND / "keenetic-app-v041.js",
    FRONTEND / "keenetic-app-v042.js",
    FRONTEND / "keenetic-app-v043.js",
    FRONTEND / "keenetic-app-v044.js",
]

RUNTIME_IMPORT_RE = re.compile(
    r"^\s*(?:await\s+)?import(?:\s*\(\s*)?\s*[\"']\./[^\"']+[\"']\s*\)?\s*;?\s*$",
    re.MULTILINE,
)
CSS_LINK = '<link rel="stylesheet" href="/keenetic_hero_4g_static/keenetic-panel.css?v=${encodeURIComponent(PANEL_VERSION)}">'


def _clean(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    text = RUNTIME_IMPORT_RE.sub("", text).strip()

    if path.name == "keenetic-panel.js":
        css_literal = json.dumps(CSS_SOURCE.read_text(encoding="utf-8"), ensure_ascii=False)
        if CSS_LINK not in text:
            raise SystemExit("Base panel no longer contains the expected stylesheet link")
        text = text.replace(CSS_LINK, '<style>${BUNDLED_PANEL_CSS}</style>')
        text = f"const BUNDLED_PANEL_CSS = {css_literal};\n" + text

    if re.search(r"^\s*(?:import|export)\b", text, re.MULTILINE):
        raise SystemExit(f"Unsupported ES module statement remains in {path}")
    if re.search(r"^\s*await\s+import\b", text, re.MULTILINE):
        raise SystemExit(f"Dynamic runtime import remains in {path}")
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


def build() -> str:
    parts = [
        "// GENERATED FILE. DO NOT EDIT DIRECTLY.",
        "// Keenetic Hero 4G+ self-contained Home Assistant panel bundle.",
        "// Current v0.4.x sources and CSS are composed at build time only.",
        "// Runtime dependency on prior UI modules is forbidden.",
        "",
    ]
    for path in SOURCES:
        if not path.exists():
            raise SystemExit(f"Missing frontend source: {path}")
        parts.append(_wrap(path))
        parts.append("")
    bundle = "\n".join(parts).rstrip() + "\n"
    if RUNTIME_IMPORT_RE.search(bundle) or re.search(r"^\s*(?:import|export)\b", bundle, re.MULTILINE):
        raise SystemExit("Generated production bundle contains a runtime module dependency")
    if "keenetic-panel.css?v=" in bundle:
        raise SystemExit("Generated production bundle contains an external panel stylesheet reference")
    return bundle


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    content = build()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != content:
            raise SystemExit("Frontend production bundle is missing or stale")
        return
    OUTPUT.write_text(content, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({len(content)} bytes)")


if __name__ == "__main__":
    main()
