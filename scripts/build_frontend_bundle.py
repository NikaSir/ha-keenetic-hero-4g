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
CSS_LINK = '<link rel="stylesheet" href="/keenetic_hero_4g_static/keenetic-panel.css?v=${encodeURIComponent(PANEL_VERSION)}">'


def _clean(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    text = IMPORT_RE.sub("", text).strip()

    if path.name == "keenetic-panel.js":
        css_literal = json.dumps(CSS_SOURCE.read_text(encoding="utf-8"), ensure_ascii=False)
        if CSS_LINK not in text:
            raise SystemExit("Base panel no longer contains the expected stylesheet link")
        text = text.replace(CSS_LINK, '<style>${BUNDLED_PANEL_CSS}</style>')
        text = f"const BUNDLED_PANEL_CSS = {css_literal};\n" + text

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
    return "\n".join(parts).rstrip() + "\n"


if __name__ == "__main__":
    content = build()
    OUTPUT.write_text(content, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({len(content)} bytes)")
