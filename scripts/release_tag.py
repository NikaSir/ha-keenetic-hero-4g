from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "custom_components" / "keenetic_hero_4g" / "manifest.json"
SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$")


def release_tag() -> str:
    """Return the immutable Git tag derived from the HA manifest version."""
    payload = json.loads(MANIFEST.read_text(encoding="utf-8"))
    version = str(payload.get("version", "")).strip()
    if not SEMVER_RE.fullmatch(version):
        raise SystemExit(f"Invalid manifest version for release tagging: {version!r}")
    return f"v{version}"


if __name__ == "__main__":
    print(release_tag())
