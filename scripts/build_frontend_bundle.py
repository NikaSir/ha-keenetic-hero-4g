from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"
OUTPUT = FRONTEND / "keenetic-panel-bundle.js"
CSS_SOURCE = FRONTEND / "keenetic-panel.css"
SHELL_SOURCE = FRONTEND / "nikas-specialized-shell.js"
SHELL_SHA256 = "c7171560b68e2c4118b327c5e6a63c65e3410a4e1f10a02691e0d15560166e65"
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
    FRONTEND / "keenetic-app-v100.js",
]
RUNTIME_IMPORT_RE = re.compile(r"^\s*(?:await\s+)?import(?:\s*\(\s*)?\s*[\"']\./[^\"']+[\"']\s*\)?\s*;?\s*$", re.MULTILINE)
LEGACY_INLINE_HERO_RE = re.compile(r'const KEENETIC_ROOM_V050 = "data:image/webp;base64,[^"]+";')
ASSET_QUERY_RE = re.compile(r"(/keenetic_hero_4g_static/assets/[A-Za-z0-9._-]+(?:webp|svg))\?v=[0-9.]+")
PANEL_VERSION = "1.0.7"
HERO_ASSET_URL = f"/keenetic_hero_4g_static/assets/keenetic-hero-room-v064.webp?v={PANEL_VERSION}"
CSS_LINK = '<link rel="stylesheet" href="/keenetic_hero_4g_static/keenetic-panel.css?v=${encodeURIComponent(PANEL_VERSION)}">'


def _strip_superseded_shell(path: Path, text: str) -> str:
    marker = None
    if path.name == "keenetic-app-v040.js":
        marker = "\nfunction openHomeAssistantMenu"
    elif path.name.startswith("keenetic-app-v") and path.name != "keenetic-app-v100.js":
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
    text = RUNTIME_IMPORT_RE.sub("", path.read_text(encoding="utf-8")).strip()
    text = ASSET_QUERY_RE.sub(rf"\1?v={PANEL_VERSION}", text)
    text = _strip_superseded_shell(path, text)
    if path.name == "keenetic-app-v050.js":
        text, count = LEGACY_INLINE_HERO_RE.subn(f'const KEENETIC_ROOM_V050 = "{HERO_ASSET_URL}";', text)
        if count != 1:
            raise SystemExit("Legacy inline hero payload was not found exactly once")
    if path.name == "keenetic-panel.js":
        css_literal = json.dumps(CSS_SOURCE.read_text(encoding="utf-8"), ensure_ascii=False)
        if CSS_LINK not in text:
            old = '<link rel="stylesheet" href="/keenetic_hero_4g_static/keenetic-panel.css?v=${encodeURIComponent(PANEL_VERSION)}">'
            if old not in text:
                raise SystemExit("Base panel no longer contains the expected stylesheet link")
        text = text.replace(CSS_LINK, '<style>${BUNDLED_PANEL_CSS}</style>')
        text = f"const BUNDLED_PANEL_CSS = {css_literal};\n" + text
    if re.search(r"^\s*(?:import|export)\b", text, re.MULTILINE) or re.search(r"^\s*await\s+import\b", text, re.MULTILINE):
        raise SystemExit(f"Runtime module statement remains in {path}")
    return text


def _wrap(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return "\n".join([f"// BEGIN {rel}", "(() => {", _clean(path), "})();", f"// END {rel}"])


def _embed_shell(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    source_bytes = path.read_bytes()
    digest = hashlib.sha256(source_bytes).hexdigest()
    if digest != SHELL_SHA256:
        raise SystemExit("Vendored NikaS shell source kit does not match the canonical v2.1 hash")
    source = source_bytes.decode("utf-8").rstrip()
    return "\n".join([f"// BEGIN {rel}", source, f"// END {rel}"])


def build() -> str:
    parts = [
        "// GENERATED FILE. DO NOT EDIT DIRECTLY.",
        "// Keenetic Hero 4G+ autonomous UI 1.0.7 production bundle.",
        "// One active shell: keenetic-hero-app-panel-v100.",
        "",
        _embed_shell(SHELL_SOURCE),
        "",
    ]
    for path in SOURCES:
        if not path.exists():
            raise SystemExit(f"Missing frontend source: {path}")
        parts.extend([_wrap(path), ""])
    bundle = "\n".join(parts).rstrip() + "\n"
    if RUNTIME_IMPORT_RE.search(bundle) or re.search(r"^\s*(?:import|export)\b", bundle, re.MULTILINE):
        raise SystemExit("Generated production bundle contains runtime imports")
    if "keenetic-panel.css?v=" in bundle:
        raise SystemExit("Generated production bundle contains external CSS")
    if "data:image/" in bundle or "base64," in bundle:
        raise SystemExit("Generated production bundle contains inline Base64 image")
    if 'customElements.define("keenetic-hero-app-panel-v100"' not in bundle:
        raise SystemExit("Current v100 web component is missing")
    for slug in ("v040","v045","v050","v051","v052","v060","v061","v062","v063","v064","v065","v068","v073","v075","v076","v080","v081","v083","v084","v085","v086","v087","v088","v089","v090"):
        if f'customElements.define("keenetic-hero-app-panel-{slug}"' in bundle:
            raise SystemExit(f"Superseded app shell remains: {slug}")
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
