from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (
    ROOT
    / "custom_components"
    / "keenetic_hero_4g"
    / "frontend"
    / "keenetic-app-v068.js"
)


class PanelTopologyLayeringTests(unittest.TestCase):
    """Keep live connection paths behind the photorealistic router body."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")

    def test_router_occludes_connection_paths(self) -> None:
        self.assertIn(".v063-flow-layer{z-index:2!important}", self.source)
        self.assertIn(".v060-router{z-index:3!important}", self.source)

    def test_current_component_is_cache_safe(self) -> None:
        self.assertIn('import("./keenetic-app-v067.js?v=0.6.8")', self.source)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v068"', self.source)


if __name__ == "__main__":
    unittest.main()
