from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v082.js"
BUILD = ROOT / "scripts" / "build_frontend_bundle.py"
RUNTIME = INTEGRATION / "panel_runtime.py"
MANIFEST = INTEGRATION / "manifest.json"


class PanelOverviewV082Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.build = BUILD.read_text(encoding="utf-8")
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.manifest = MANIFEST.read_text(encoding="utf-8")

    def test_overview_is_recomposed_without_duplicate_channels_section(self) -> None:
        self.assertIn("v082-active-card", self.source)
        self.assertIn("v082-reserve-channel", self.source)
        self.assertIn("v082-reserve-state", self.source)
        self.assertNotIn("<h2>Каналы</h2>", self.source)
        self.assertNotIn("v050-channel-list", self.source)
        self.assertNotIn("v050-kpi-row\">", self.source)
        self.assertNotIn("v050-reserve-strip\">", self.source)

    def test_photo_keeps_topology_and_connection_indicator_only(self) -> None:
        self.assertIn("v050-online-pill", self.source)
        self.assertIn("v050-fresh-pill", self.source)
        self.assertIn("v082-flow-layer", self.source)
        self.assertIn('title.textContent = "4G LTE"', self.source)
        self.assertIn('subtitle.textContent = active === "lte" ? "Активный канал" : lteState.state === "up" ? "Резервный канал"', self.source)
        self.assertIn('title.textContent = "Кабель"', self.source)
        self.assertIn('title.textContent = "LAN"', self.source)
        self.assertIn('subtitle.textContent = "Локальная сеть"', self.source)
        self.assertIn(".v061-lte{", self.source)
        self.assertIn("left:50%!important", self.source)
        self.assertIn(".v061-cable{left:3%!important", self.source)
        self.assertIn(".v061-lan{right:3%!important", self.source)

    def test_active_card_contains_each_requested_parameter_once(self) -> None:
        for label in ["Ping", "Потеря пакетов", "Телеметрия", "RX", "TX", "WAN IP", "Uptime"]:
            self.assertIn(f'"{label}"', self.source)
        self.assertIn('const linkLabel = activeRole === "lte" ? "Сигнал" : "Link"', self.source)
        self.assertIn('mdi:timer-outline', self.source)
        self.assertNotIn('mdi:signal-cellular-3', self.source)
        self.assertEqual(self.source.count('"Телеметрия"'), 1)
        self.assertEqual(self.source.count('"Потеря пакетов"'), 1)

    def test_reserve_ready_is_a_separate_surface_below_photo(self) -> None:
        hero_pos = self.source.index('<article class="v050-hero')
        reserve_pos = self.source.index('<div class="v082-reserve-state')
        active_pos = self.source.index('<article class="card v082-active-card')
        self.assertLess(hero_pos, reserve_pos)
        self.assertLess(reserve_pos, active_pos)
        self.assertIn('title: "Резерв готов"', self.source)
        self.assertIn('Резервный канал ${label} подключён и готов к работе.', self.source)

    def test_stable_point_patch_reapplies_composition_without_shell_rebuild(self) -> None:
        self.assertIn("const patchStableBaseV082 = CORE_COMPONENT_V082.prototype._patchStableDomV075", self.source)
        self.assertIn("patchStableBaseV082.apply(this, args)", self.source)
        self.assertIn("patchOverviewCompositionV082(this)", self.source)
        self.assertNotIn("shadowRoot.innerHTML", self.source)
        self.assertNotIn("history.back", self.source)

    def test_delivery_version_is_v082_and_package_is_b044(self) -> None:
        self.assertIn('FRONTEND / "keenetic-app-v082.js"', self.build)
        self.assertIn('PANEL_VERSION = "0.8.2"', self.build)
        self.assertIn('FRONTEND_UI_VERSION = "0.8.2"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v082"', self.runtime)
        self.assertIn('"version": "1.0.0-b044"', self.manifest)


if __name__ == "__main__":
    unittest.main()
