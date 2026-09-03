from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"
SOURCE = FRONTEND / "keenetic-app-v100.js"
BUNDLE = FRONTEND / "keenetic-panel-bundle.js"
BUILD = ROOT / "scripts" / "build_frontend_bundle.py"
SHELL = FRONTEND / "nikas-specialized-shell.js"


class PanelCleanRebuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.build = BUILD.read_text(encoding="utf-8")
        cls.shell = SHELL.read_text(encoding="utf-8")

    def test_only_v100_app_shell_is_shipped(self) -> None:
        self.assertIn('customElements.define("keenetic-hero-app-panel-v100"', self.bundle)
        self.assertEqual(self.bundle.count('customElements.define("keenetic-hero-app-panel-v100"'), 1)
        for slug in [
            "v040", "v045", "v050", "v051", "v052", "v060", "v061", "v062",
            "v063", "v064", "v065", "v068", "v073", "v075", "v076", "v080",
            "v081", "v083", "v084", "v085", "v086", "v087", "v088", "v089", "v090",
        ]:
            self.assertNotIn(f'customElements.define("keenetic-hero-app-panel-{slug}"', self.bundle)

    def test_build_has_one_current_shell_source_and_no_superseded_delivery_sources(self) -> None:
        self.assertIn('FRONTEND / "keenetic-app-v100.js"', self.build)
        self.assertIn('SHELL_SOURCE = FRONTEND / "nikas-specialized-shell.js"', self.build)
        self.assertIn('SHELL_SHA256 = "c7171560b68e2c4118b327c5e6a63c65e3410a4e1f10a02691e0d15560166e65"', self.build)
        self.assertIn(
            "// BEGIN custom_components/keenetic_hero_4g/frontend/nikas-specialized-shell.js",
            self.bundle,
        )
        for name in [
            "keenetic-app-v066.js", "keenetic-app-v067.js", "keenetic-app-v069.js",
            "keenetic-app-v070.js", "keenetic-app-v071.js", "keenetic-app-v072.js",
            "keenetic-app-v074.js", "keenetic-app-v077.js", "keenetic-app-v078.js",
            "keenetic-app-v080.js", "keenetic-app-v081.js", "keenetic-app-v083.js",
            "keenetic-app-v084.js", "keenetic-app-v085.js", "keenetic-app-v086.js",
            "keenetic-app-v087.js", "keenetic-app-v088.js", "keenetic-app-v089.js",
            "keenetic-app-v090.js",
        ]:
            self.assertNotIn(f'FRONTEND / "{name}"', self.build)

    def test_production_bundle_is_autonomous(self) -> None:
        self.assertNotIn("keenetic-panel.css?v=", self.bundle)
        self.assertNotIn("data:image/", self.bundle)
        self.assertNotIn("base64,", self.bundle)
        self.assertNotIn("history.back(", self.bundle)

    def test_v100_runtime_exposes_current_version_and_semantic_return_shell(self) -> None:
        self.assertIn('const K100_VERSION = "1.0.6";', self.source)
        self.assertIn("nikas.specialized.source_route.v1", self.shell)
        self.assertIn("history.pushState", self.shell)
        self.assertIn("location-changed", self.shell)
        self.assertIn("captureNikasShellReturnRoute", self.source)
        self.assertIn("navigateNikasShell", self.source)
        self.assertIn("UI v", self.source)


if __name__ == "__main__":
    unittest.main()
