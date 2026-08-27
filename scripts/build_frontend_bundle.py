from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"
OUTPUT = FRONTEND / "keenetic-panel-bundle.js"
CSS_SOURCE = FRONTEND / "keenetic-panel.css"

# Current production dependency graph only. Historical source files may remain in
# Git, but the generated runtime bundle must be autonomous and asset-clean.
SOURCES = [
    FRONTEND / "keenetic-panel.js",
    FRONTEND / "keenetic-overview-v040.js",
    FRONTEND / "keenetic-app-v040.js",
    FRONTEND / "keenetic-app-v045.js",
    FRONTEND / "keenetic-app-v050.js",
    FRONTEND / "keenetic-app-v051.js",
    FRONTEND / "keenetic-app-v052.js",
    FRONTEND / "keenetic-app-v060.js",
    FRONTEND / "keenetic-app-v061.js",
    FRONTEND / "keenetic-app-v062.js",
    FRONTEND / "keenetic-app-v063.js",
    FRONTEND / "keenetic-app-v064.js",
    FRONTEND / "keenetic-app-v065.js",
    FRONTEND / "keenetic-app-v068.js",
    FRONTEND / "keenetic-app-v073.js",
    FRONTEND / "keenetic-app-v075.js",
    FRONTEND / "keenetic-app-v076.js",
    FRONTEND / "keenetic-app-v080.js",
    FRONTEND / "keenetic-app-v081.js",
    FRONTEND / "keenetic-app-v083.js",
    FRONTEND / "keenetic-app-v084.js",
]

RUNTIME_IMPORT_RE = re.compile(
    r"^\s*(?:await\s+)?import(?:\s*\(\s*)?\s*[\"']\./[^\"']+[\"']\s*\)?\s*;?\s*$",
    re.MULTILINE,
)
LEGACY_INLINE_HERO_RE = re.compile(
    r'const KEENETIC_ROOM_V050 = "data:image/webp;base64,[^"]+";'
)
ASSET_QUERY_RE = re.compile(
    r"(/keenetic_hero_4g_static/assets/[A-Za-z0-9._-]+(?:webp|svg))\?v=[0-9.]+"
)
PANEL_VERSION = "0.8.4"
HERO_ASSET_URL = f"/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v={PANEL_VERSION}"
CSS_LINK = '<link rel="stylesheet" href="/keenetic_hero_4g_static/keenetic-panel.css?v=${encodeURIComponent(PANEL_VERSION)}">'


def _strip_superseded_shell(path: Path, text: str) -> str:
    """Keep data/content patches, but never ship an inherited app shell."""
    marker: str | None = None
    if path.name == "keenetic-app-v040.js":
        marker = "\nfunction openHomeAssistantMenu"
    elif path.name == "keenetic-app-v076.js":
        marker = "\nfunction installShellStandardV076"
    elif path.name.startswith("keenetic-app-v") and path.name != "keenetic-app-v080.js":
        match = re.search(r"\nif \(BASE_COMPONENT[^\n]*", text)
        if match:
            marker = match.group(0)
    if marker and marker in text:
        text = text.split(marker, 1)[0].rstrip()
    text = re.sub(r"^const BASE_COMPONENT_V\d+ = .*\n", "", text, flags=re.MULTILINE)
    if path.name == "keenetic-app-v040.js":
        text = re.sub(r'^const APP_SHELL_VERSION = "[^"]+";\n', "", text)
    return text


def _clean(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    text = RUNTIME_IMPORT_RE.sub("", text).strip()
    text = ASSET_QUERY_RE.sub(rf"\1?v={PANEL_VERSION}", text)
    text = _strip_superseded_shell(path, text)

    # v0.5.0 historically embedded the room artwork as Base64. Keep source
    # history readable, but never ship that payload in the production bundle.
    if path.name == "keenetic-app-v050.js":
        text, count = LEGACY_INLINE_HERO_RE.subn(
            f'const KEENETIC_ROOM_V050 = "{HERO_ASSET_URL}";', text
        )
        if count != 1:
            raise SystemExit("Legacy inline hero payload was not found exactly once")

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
        "// Current production sources and CSS are composed at build time only.",
        "// Runtime dependency on prior UI modules is forbidden.",
        "// Artwork is delivered from frontend/assets; Base64 data URIs are forbidden.",
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
    if "data:image/" in bundle or "base64," in bundle:
        raise SystemExit("Generated production bundle contains an inline Base64 image")
    for marker in ("#nika-zoom-stage", "nika-zoom-dock", "_standardStateV074"):
        if marker in bundle:
            raise SystemExit(f"Generated production bundle contains superseded shell marker: {marker}")
    for slug in ("v040", "v045", "v050", "v051", "v052", "v060", "v061", "v062", "v063", "v064", "v065", "v068", "v073", "v075", "v076", "v077", "v078"):
        marker = f'customElements.get("keenetic-hero-app-panel-{slug}")'
        if marker in bundle:
            raise SystemExit(f"Generated production bundle contains superseded app component: {slug}")
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
