from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v086.js"
ASSET = INTEGRATION / "frontend" / "assets" / "keenetic-hero-router-v086.webp"
BUNDLE = INTEGRATION / "frontend" / "keenetic-panel-bundle.js"


class PanelRouterBaselineV086Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.manifest = json.loads(
            (INTEGRATION / "panel_manifest.json").read_text(encoding="utf-8")
        )

    def test_official_router_is_a_versioned_local_layer(self) -> None:
        self.assertTrue(ASSET.is_file())
        self.assertGreater(ASSET.stat().st_size, 50_000)
        self.assertIn("keenetic-hero-router-v086.webp?v=0.8.6", self.source)
        router = next(
            item for item in self.manifest["assets"] if item["role"] == "overview_router_layer"
        )
        self.assertEqual(router["path"], "frontend/assets/keenetic-hero-router-v086.webp")

    def test_all_three_paths_continue_under_the_router(self) -> None:
        self.assertIn('"M500 228 L500 406"', self.source)
        self.assertIn('"M245 352 L430 352"', self.source)
        self.assertIn('"M570 352 L755 352"', self.source)
        self.assertIn("z-index:6!important", self.source)
        self.assertIn(".v083-flow-layer{position:absolute;inset:0;z-index:4", self.bundle)

    def test_asset_src_is_set_once_and_never_from_telemetry_patch(self) -> None:
        self.assertIn('router.getAttribute("src") !== ROUTER_ASSET_V086', self.source)
        self.assertIn('router.dataset.approvedRouterV086 !== "true"', self.source)
        self.assertIn("router.decode?.().catch?.", self.source)
        self.assertNotIn("_patchStableDomV075", self.source)
        self.assertNotIn("set hass", self.source)
        self.assertNotIn("shadowRoot.innerHTML", self.source)

    def test_delivery_component_is_current(self) -> None:
        self.assertIn('const UI_VERSION_V086 = "0.8.6"', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v086"', self.source)
        self.assertIn(
            "// BEGIN custom_components/keenetic_hero_4g/frontend/keenetic-app-v086.js",
            self.bundle,
        )


if __name__ == "__main__":
    unittest.main()
