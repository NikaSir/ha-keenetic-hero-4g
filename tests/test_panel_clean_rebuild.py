from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "custom_components" / "keenetic_hero_4g" / "frontend"
SOURCE = FRONTEND / "keenetic-app-v080.js"
BUNDLE = FRONTEND / "keenetic-panel-bundle.js"
BUILD = ROOT / "scripts" / "build_frontend_bundle.py"


class PanelCleanRebuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.bundle = BUNDLE.read_text(encoding="utf-8")
        cls.build = BUILD.read_text(encoding="utf-8")

    def test_old_shell_and_zoom_engines_are_not_shipped(self) -> None:
        for name in [
            "keenetic-app-v066.js",
            "keenetic-app-v067.js",
            "keenetic-app-v069.js",
            "keenetic-app-v070.js",
            "keenetic-app-v071.js",
            "keenetic-app-v072.js",
            "keenetic-app-v074.js",
            "keenetic-app-v077.js",
            "keenetic-app-v078.js",
        ]:
            self.assertNotIn(f'FRONTEND / "{name}"', self.build)
            self.assertNotIn(f"// BEGIN custom_components/keenetic_hero_4g/frontend/{name}", self.bundle)
        for marker in ["#nika-zoom-stage", "nika-zoom-dock", "_standardStateV074"]:
            self.assertNotIn(marker, self.bundle)
        for slug in ["v040", "v045", "v050", "v051", "v052", "v060", "v061", "v062", "v063", "v064", "v065", "v068", "v073", "v075", "v076", "v077", "v078"]:
            self.assertNotIn(f'customElements.get("keenetic-hero-app-panel-{slug}")', self.bundle)

    def test_native_scroll_is_the_default_untransformed_state(self) -> None:
        self.assertIn("overflow-x:hidden;overflow-y:auto", self.source)
        self.assertIn("touch-action:pan-y", self.source)
        self.assertIn("#zoom-surface-v080{position:relative", self.source)
        self.assertIn('viewport.classList.remove("scaled-v080", "zoomed-v080")', self.source)
        self.assertIn('surface.style.width = "";surface.style.height = "";surface.style.transform = ""', self.source)

    def test_new_shell_is_mounted_once_and_has_one_viewport(self) -> None:
        self.assertEqual(self.source.count('id="work-viewport-v080"'), 1)
        self.assertEqual(self.source.count('id="zoom-stage-v080"'), 1)
        self.assertEqual(self.source.count('id="zoom-surface-v080"'), 1)
        self.assertIn('if (this.shadowRoot.getElementById("app-shell-v080")) return', self.source)

    def test_ui_does_not_expose_a_build_number(self) -> None:
        self.assertIn("<span>Network Control Center</span>", self.source)
        self.assertNotIn("UI v0.", self.source)


if __name__ == "__main__":
    unittest.main()
