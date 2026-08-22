from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"
ENTRY = FRONTEND / "keenetic-app-v029.js"
CSS = FRONTEND / "keenetic-panel.css"
OUTPUT = FRONTEND / "keenetic-panel.bundle.js"

IMPORT_RE = re.compile(
    r'^\s*import\s+["\'](?P<path>\./[^"\']+)["\'];?\s*$',
    re.MULTILINE,
)
CSS_LINK = '<link rel="stylesheet" href="/keenetic_hero_4g_static/keenetic-panel.css?v=${encodeURIComponent(PANEL_VERSION)}">'
CSS_INLINE = '<style>${KEENETIC_PANEL_BUNDLE_CSS}</style>'


def _clean_import_path(value: str) -> str:
    return value.split("?", 1)[0]


def _collect(path: Path, seen: set[Path], ordered: list[tuple[Path, str]]) -> None:
    path = path.resolve()
    if path in seen:
        return
    seen.add(path)
    source = path.read_text(encoding="utf-8")
    for match in IMPORT_RE.finditer(source):
        dependency = (path.parent / _clean_import_path(match.group("path"))).resolve()
        if not dependency.is_file():
            raise SystemExit(f"Missing frontend dependency: {dependency}")
        _collect(dependency, seen, ordered)
    source = IMPORT_RE.sub("", source)
    if path.name == "keenetic-panel.js":
        if CSS_LINK not in source:
            raise SystemExit("Expected Keenetic stylesheet link was not found in base panel")
        source = source.replace(CSS_LINK, CSS_INLINE)
    ordered.append((path, source.strip()))


def build() -> str:
    ordered: list[tuple[Path, str]] = []
    _collect(ENTRY, set(), ordered)
    css = CSS.read_text(encoding="utf-8")
    parts = [
        "// GENERATED FILE. DO NOT EDIT DIRECTLY.",
        "// Source entry: frontend/keenetic-app-v029.js",
        "// Production contract: one self-contained Home Assistant panel module.",
        f"const KEENETIC_PANEL_BUNDLE_CSS = {json.dumps(css, ensure_ascii=False)};",
        "",
    ]
    for path, source in ordered:
        rel = path.relative_to(ROOT).as_posix()
        parts.extend(
            [
                "{",
                f"// ---- BEGIN {rel} ----",
                source,
                f"// ---- END {rel} ----",
                "}",
                "",
            ]
        )
    bundle = "\n".join(parts).rstrip() + "\n"
    if IMPORT_RE.search(bundle):
        raise SystemExit("Generated production bundle still contains a runtime import")
    if CSS_LINK in bundle:
        raise SystemExit("Generated production bundle still references external panel CSS")
    return bundle


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    expected = build()
    if args.check:
        if not OUTPUT.is_file() or OUTPUT.read_text(encoding="utf-8") != expected:
            raise SystemExit("Frontend production bundle is missing or stale")
        return
    OUTPUT.write_text(expected, encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({len(expected)} bytes)")


if __name__ == "__main__":
    main()
