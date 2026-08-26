from __future__ import annotations

import struct
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "custom_components" / "keenetic_hero_4g" / "brand"


class BrandAssetTests(unittest.TestCase):
    def test_repository_icon_is_valid_and_used(self) -> None:
        icon = ROOT / "docs" / "icon.svg"
        self.assertTrue(icon.is_file())
        self.assertTrue(ET.parse(icon).getroot().tag.endswith("svg"))
        self.assertIn("docs/icon.svg", (ROOT / "README.md").read_text(encoding="utf-8"))

    def test_packaged_light_and_dark_icons_are_256_square(self) -> None:
        for name in ("icon.png", "dark_icon.png"):
            data = (BRAND / name).read_bytes()
            self.assertEqual(data[:8], b"\x89PNG\r\n\x1a\n")
            self.assertEqual(struct.unpack(">II", data[16:24]), (256, 256))


if __name__ == "__main__":
    unittest.main()
