from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "release_tag.py"
MANIFEST = ROOT / "custom_components" / "keenetic_hero_4g" / "manifest.json"

SPEC = importlib.util.spec_from_file_location("keenetic_release_tag", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
release_tag_module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(release_tag_module)


class ReleaseTagContractTests(unittest.TestCase):
    def test_tag_matches_manifest_version(self) -> None:
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        self.assertEqual(release_tag_module.release_tag(), f"v{manifest['version']}")

    def test_current_tag_is_semantic_and_not_sha_like(self) -> None:
        tag = release_tag_module.release_tag()
        self.assertRegex(tag, r"^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$")
        self.assertNotRegex(tag, r"^[0-9a-f]{7,40}$")


if __name__ == "__main__":
    unittest.main()
