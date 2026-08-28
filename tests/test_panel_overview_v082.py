from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v083.js"
TUNING = INTEGRATION / "frontend" / "keenetic-app-v084.js"
SHELL = INTEGRATION / "frontend" / "keenetic-app-v080.js"
STABLE = INTEGRATION / "frontend" / "keenetic-app-v075.js"
BUILD = ROOT / "scripts" / "build_frontend_bundle.py"
RUNTIME = INTEGRATION / "panel_runtime.py"
MANIFEST = INTEGRATION / "manifest.json"
CURRENT = INTEGRATION / "frontend" / "keenetic-app-v085.js"
DELIVERY = INTEGRATION / "frontend" / "keenetic-app-v087.js"

# This test file is intentionally outside frontend bundle inputs so the final
# generated-bundle head can be revalidated without starting a rebuild loop.


class PanelOverviewV084Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.tuning = TUNING.read_text(encoding="utf-8")
        cls.shell = SHELL.read_text(encoding="utf-8")
        cls.stable = STABLE.read_text(encoding="utf-8")
        cls.build = BUILD.read_text(encoding="utf-8")
        cls.runtime = RUNTIME.read_text(encoding="utf-8")
        cls.manifest = MANIFEST.read_text(encoding="utf-8")
        cls.current = CURRENT.read_text(encoding="utf-8")
        cls.delivery = DELIVERY.read_text(encoding="utf-8")

    def test_overview_is_recomposed_without_duplicate_channels_section(self) -> None:
        self.assertIn("v083-active-card", self.source)
        self.assertIn("v083-reserve-channel", self.source)
        self.assertIn("v083-reserve-state", self.source)
        self.assertNotIn("<h2>Каналы</h2>", self.source)
        self.assertNotIn("v050-channel-list", self.source)
        self.assertNotIn("v050-kpi-row\">", self.source)
        self.assertNotIn("v050-reserve-strip\">", self.source)

    def test_photo_keeps_topology_and_connection_indicator_only(self) -> None:
        self.assertIn("v050-online-pill", self.source)
        self.assertIn("v050-fresh-pill", self.source)
        self.assertIn("v083-flow-layer", self.source)
        self.assertIn('setTextV083(lte?.querySelector("strong"), "4G LTE")', self.source)
        self.assertIn('activeRole === "lte" ? "Активный канал" : lteState.state === "up" ? "Резервный канал"', self.source)
        self.assertIn('setTextV083(cable?.querySelector("strong"), "Кабель")', self.source)
        self.assertIn('setTextV083(lan?.querySelector("strong"), "LAN")', self.source)
        self.assertIn('"Локальная сеть"', self.source)
        self.assertIn(".v061-lte{", self.source)
        self.assertIn("left:50%!important", self.source)
        self.assertIn(".v061-cable{left:3%!important", self.source)
        self.assertIn(".v061-lan{right:3%!important", self.source)
        for state in ["active", "standby", "down", "unknown"]:
            self.assertIn(f'"{state}"', self.source)

    def test_active_card_contains_each_requested_parameter_once(self) -> None:
        for label in ["Ping", "Потеря пакетов", "Телеметрия", "RX", "TX", "WAN IP", "Uptime"]:
            self.assertIn(f'"{label}"', self.source)
        self.assertIn('const linkLabel = activeRole === "lte" ? "Сигнал" : "Link"', self.source)
        self.assertIn('mdi:timer-outline', self.source)
        self.assertNotIn('mdi:signal-cellular-3', self.source)
        self.assertEqual(self.source.count('"Телеметрия"'), 1)
        self.assertEqual(self.source.count('"Потеря пакетов"'), 1)
        self.assertIn('data-entity="${escV083(entity)}" tabindex="0"', self.source)
        self.assertIn("panel._bindStableInteractionsV075?.(overview)", self.source)

    def test_reserve_ready_is_a_separate_surface_below_photo(self) -> None:
        hero_pos = self.source.index('<article class="v050-hero')
        reserve_pos = self.source.index('<div class="v083-reserve-state')
        active_pos = self.source.index('<article class="card v083-active-card')
        self.assertLess(hero_pos, reserve_pos)
        self.assertLess(reserve_pos, active_pos)
        self.assertIn('title: "Резерв готов"', self.source)
        self.assertIn('${label} подключён и готов к работе.', self.source)

    def test_stable_point_patch_is_single_and_differential(self) -> None:
        self.assertIn("const patchStableBaseV083 = CORE_COMPONENT_V083.prototype._patchStableDomV075", self.source)
        live_patch = self.source[self.source.index("CORE_COMPONENT_V083.prototype._patchStableDomV075 = function") :]
        self.assertEqual(live_patch.count("patchOverviewStateV083(this)"), 1)
        self.assertNotIn("CORE_COMPONENT_V083.prototype._render = function", self.source)
        self.assertIn("element.textContent !== value", self.source)
        self.assertIn("element.getAttribute(name) !== value", self.source)
        self.assertNotIn("shadowRoot.innerHTML", self.source)
        self.assertNotIn("history.back", self.source)

    def test_telemetry_cannot_retrigger_shell_measurement(self) -> None:
        observer_start = self.shell.index("_observeChild()")
        observer_end = self.shell.index("_scheduleAfterMount()", observer_start)
        observer = self.shell[observer_start:observer_end]
        self.assertIn("finishMount", observer)
        self.assertIn("this._childObserver = null", observer)
        self.assertNotIn("new MutationObserver(() => this._scheduleAfterMount())", self.shell)
        measure_start = self.shell.index("_measure()")
        measure_end = self.shell.index("_scheduleMeasure()", measure_start)
        measure = self.shell[measure_start:measure_end]
        self.assertNotIn("surface.scrollHeight", measure)
        self.assertNotIn("this._child?.scrollHeight", measure)
        self.assertIn("this._measureAfterGesture = true", self.shell)

    def test_inner_navigation_is_owned_by_the_shell(self) -> None:
        self.assertIn('new CustomEvent("keenetic-view-request"', self.stable)
        self.assertIn('this._child.addEventListener("keenetic-view-request"', self.shell)
        self.assertIn("this._setView(view, true)", self.shell)

    def test_phone_composition_refinement_is_static_and_balanced(self) -> None:
        self.assertIn("min-height:320px!important", self.tuning)
        self.assertIn("top:36.5%!important", self.tuning)
        self.assertIn("top:61%!important", self.tuning)
        self.assertIn("top:65.5%!important", self.tuning)
        self.assertIn("grid-template-columns:repeat(6,minmax(0,1fr))", self.tuning)
        self.assertIn(".v083-metric.wide,.v083-metric:nth-child(8){grid-column:span 3}", self.tuning)
        self.assertIn('"M500 228 L500 295"', self.tuning)
        self.assertNotIn("top:32.5%!important", self.tuning)
        self.assertNotIn("_patchStableDomV075", self.tuning)
        self.assertNotIn("shadowRoot.innerHTML", self.tuning)

    def test_delivery_version_is_v087_and_package_is_b049(self) -> None:
        self.assertIn('FRONTEND / "keenetic-app-v083.js"', self.build)
        self.assertIn('FRONTEND / "keenetic-app-v084.js"', self.build)
        self.assertIn('FRONTEND / "keenetic-app-v085.js"', self.build)
        self.assertIn('FRONTEND / "keenetic-app-v087.js"', self.build)
        self.assertNotIn('FRONTEND / "keenetic-app-v082.js"', self.build)
        self.assertIn('PANEL_VERSION = "0.8.7"', self.build)
        self.assertIn('FRONTEND_UI_VERSION = "0.8.7"', self.runtime)
        self.assertIn('FRONTEND_COMPONENT_SLUG = "v087"', self.runtime)
        self.assertIn('customElements.define("keenetic-hero-app-panel-v087"', self.delivery)
        self.assertIn('"version": "1.0.0-b049"', self.manifest)


if __name__ == "__main__":
    unittest.main()
