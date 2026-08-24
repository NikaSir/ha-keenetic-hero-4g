from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"
OUTPUT = FRONTEND / "keenetic-panel-bundle.js"
CSS_SOURCE = FRONTEND / "keenetic-panel.css"
BASE_SOURCE = FRONTEND / "keenetic-panel.js"
FIRST_PATCH_VERSION = 23
CURRENT_PATCH_VERSION = 44

# Source modules may use either historical static imports or newer top-level
# dynamic imports. Both are build-time dependency declarations only: neither is
# allowed to survive into the production artifact.
RUNTIME_IMPORT_RE = re.compile(
    r"^\s*(?:await\s+)?import(?:\s*\(\s*)?\s*[\"']\./[^\"']+[\"']\s*\)?\s*;?\s*$",
    re.MULTILINE,
)
CSS_LINK = '<link rel="stylesheet" href="/keenetic_hero_4g_static/keenetic-panel.css?v=${encodeURIComponent(PANEL_VERSION)}">'


def _version_number(path: Path) -> int | None:
    match = re.fullmatch(r"keenetic-app-v(\d+)\.js", path.name)
    return int(match.group(1)) if match else None


def _sources() -> list[Path]:
    versioned: list[tuple[int, Path]] = []
    for path in FRONTEND.glob("keenetic-app-v*.js"):
        version = _version_number(path)
        if version is None or not FIRST_PATCH_VERSION <= version <= CURRENT_PATCH_VERSION:
            continue
        versioned.append((version, path))
    versioned.sort(key=lambda item: item[0])

    expected = set(range(FIRST_PATCH_VERSION, CURRENT_PATCH_VERSION + 1))
    actual = {version for version, _ in versioned}
    missing = sorted(expected - actual)
    if missing:
        raise SystemExit(f"Missing frontend source versions: {missing}")
    return [BASE_SOURCE, *(path for _, path in versioned)]


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
        "// Historical UI modules and CSS are composed at build time only.",
        "// Runtime dependency on prior UI versions is forbidden.",
        "",
    ]
    for path in _sources():
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
