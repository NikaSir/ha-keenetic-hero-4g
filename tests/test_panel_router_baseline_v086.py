from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v100.js"
ASSET = INTEGRATION / "frontend" / "assets" / "keenetic-hero-router-v086.webp"
BUNDLE = INTEGRATION / "frontend" / "keenetic-panel-bundle.js"


class PanelRouterBaselineV100Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_approved_router_is_a_versioned_local_layer(self) -> None:
        self.assertTrue(ASSET.is_file())
        self.assertGreater(ASSET.stat().st_size, 50_000)
        self.assertIn("keenetic-hero-router-v086.webp?v=1.0.0", self.source)
        router = next(
            item for item in self.manifest["assets"] if item["role"] == "overview_router_layer"
        )
        self.assertEqual(router["path"], "frontend/assets/keenetic-hero-router-v086.webp")
        self.assertEqual(
            router["url"],
            "/keenetic_hero_4g_static/assets/keenetic-hero-router-v086.webp?v=1.0.0",
        )

    def test_all_three_paths_continue_under_the_router(self) -> None:
        self.assertIn('d="M500 185 L500 405"', self.source)
        self.assertIn('d="M215 420 L435 420"', self.source)
        self.assertIn('d="M565 420 L785 420"', self.source)
        self.assertIn(".k100-lines{position:absolute;inset:0;z-index:3", self.source)
        self.assertIn(".k100-router{position:absolute;z-index:6", self.source)

    def test_router_asset_is_static_and_not_rewritten_by_telemetry_patch(self) -> None:
        self.assertEqual(self.source.count("keenetic-hero-router-v086.webp?v=1.0.0"), 1)
        self.assertNotIn("router.setAttribute", self.source)
        self.assertNotIn("router.src =", self.source)

    def test_delivery_component_is_current(self) -> None:
        self.assertIn('const K100_VERSION = "1.0.0";', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v100"', self.source)
        self.assertIn(
            "// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js",
            self.bundle,
        )
        self.assertNotIn(
            "// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v086.js",
            self.bundle,
        )


if __name__ == "__main__":
    unittest.main()
