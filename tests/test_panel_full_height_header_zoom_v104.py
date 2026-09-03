from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "keenetic_hero_4g"
SOURCE = INTEGRATION / "frontend" / "keenetic-app-v100.js"
CONTRACT = INTEGRATION / "panel_contract.json"
PANEL_MANIFEST = INTEGRATION / "panel_manifest.json"
INTEGRATION_MANIFEST = INTEGRATION / "manifest.json"
STANDARD_CONFIG = ROOT / ".nikas-ui-standard.json"
SHELL = INTEGRATION / "frontend" / "nikas-specialized-shell.js"


class PanelFullHeightHeaderZoomV104Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SOURCE.read_text(encoding="utf-8")
        cls.contract = json.loads(CONTRACT.read_text(encoding="utf-8"))
        cls.panel_manifest = json.loads(PANEL_MANIFEST.read_text(encoding="utf-8"))
        cls.integration_manifest = json.loads(INTEGRATION_MANIFEST.read_text(encoding="utf-8"))
        cls.standard = json.loads(STANDARD_CONFIG.read_text(encoding="utf-8"))
        cls.shell = SHELL.read_text(encoding="utf-8")

    def test_release_metadata_is_coherent(self) -> None:
        self.assertEqual(self.standard["ui_version"], "1.0.7")
        self.assertEqual(self.contract["panel"]["version"], "1.0.7")
        self.assertEqual(self.panel_manifest["panel_version"], "1.0.7")
        self.assertEqual(self.integration_manifest["version"], "1.0.0-b060")
        self.assertIn('const K100_VERSION = "1.0.7";', self.source)
        self.assertIn("<small>UI v1.0.7</small>", self.source)

    def test_short_overview_fills_the_complete_work_row(self) -> None:
        for marker in (
            ":host{height:100%!important;min-height:100%!important}",
            ".shell>main{display:flex!important;flex:1 1 auto;min-height:0!important}",
            ".v075-view-slot{width:100%;min-height:100%!important;flex:1 0 auto}",
            "grid-template-rows:minmax(430px,1fr) auto auto auto",
            "grid-template-rows:minmax(350px,1fr) auto auto auto",
            "height:auto;min-height:350px",
            ".k100-stage>keenetic-hero-panel{display:block;inline-size:100%;block-size:100%;min-block-size:100%",
            "width:100%!important;height:100%!important;min-height:100%!important;margin:0!important;padding:0!important",
            "grid-template-rows:minmax(350px,1fr) auto auto auto;gap:5px;padding:0",
        ):
            self.assertIn(marker, self.source)
        self.assertIn(".nikas-shell__canvas{inline-size:100%;min-block-size:100%", self.shell)
        self.assertIn("padding:12px 12px 20px", self.shell)
        self.assertTrue(
            self.contract["app_shell"]["viewport_fit"]["short_views_fill_work_row"]
        )
        self.assertEqual(
            self.contract["app_shell"]["viewport_fit"]["canonical_gutter_owner"],
            "specialized_panel_shell",
        )
        self.assertFalse(
            self.contract["app_shell"]["viewport_fit"]["nested_page_padding"]
        )
        self.assertFalse(
            self.contract["app_shell"]["viewport_fit"]["overview_scroll_at_primary_viewport"]
        )
        self.assertEqual(
            self.contract["app_shell"]["viewport_fit"]["overview_artwork_anchor"],
            "hero_local_static",
        )
        self.assertTrue(
            self.contract["view_patterns"]["overview"]["hero_fills_available_work_row"]
        )
        self.assertEqual(self.source.count('id="k100-work"'), 1)
        self.assertEqual(self.source.count('id="k100-stage"'), 1)

    def test_header_copies_the_s8_omni_reference(self) -> None:
        reference = self.standard["header_reference"]
        self.assertEqual(reference["implementation"], "S8 OMNI")
        self.assertEqual(reference["background_primary_mix_percent"], 97)
        self.assertEqual(reference["divider_mix_percent"], 70)
        self.assertEqual(reference["side_action_border_divider_mix_percent"], 72)
        for marker in (
            "grid-template-columns:52px minmax(0,1fr) 52px",
            "padding:env(safe-area-inset-top,0px) calc(12px + env(safe-area-inset-right,0px)) 0",
            "var(--primary-background-color,#f4f6f8) 97%,transparent",
            "var(--divider-color,#dfe3e8) 70%,transparent",
            "backdrop-filter:blur(18px) saturate(130%)",
            "inline-size:44px;block-size:44px",
            "var(--divider-color,#dfe3e8) 72%,transparent",
            "box-shadow:0 7px 20px rgba(23,45,76,.08)",
        ):
            self.assertIn(marker, self.shell)
        for marker in (
            ".nikas-shell__title:focus-visible",
            ".nikas-shell__title:active",
            'type="button" aria-label="Открыть меню Home Assistant"',
            'type="button" aria-label="Вернуться в исходную базовую панель NikaS"',
        ):
            self.assertIn(marker, self.source if 'type="button"' in marker else self.shell)

    def test_zoom_range_focal_math_and_pan_policy_are_explicit(self) -> None:
        for marker in (
            "const K100_SCALE_MIN = 0.75;",
            "const K100_SCALE_MAX = 2;",
            "contentX:(localX-this._zoom.x)/this._zoom.scale",
            "contentY:(localY+nativeScrollY-this._zoom.y)/this._zoom.scale",
            "localX-session.contentX*scale",
            "localY-session.contentY*scale",
            "if(this._zoom.scale<=1||event.touches.length!==1||session.multi)return",
            "if(safeScale<=1)return{scale:safeScale,x:0,y:0}",
            "viewport.classList.toggle(\"zoomed\",zoomed)",
        ):
            self.assertIn(marker, self.source)
        self.assertIn("overscroll-behavior-y:none;touch-action:pan-y", self.shell)
        self.assertIn(".nikas-shell__viewport.zoomed{overflow:hidden;touch-action:none}", self.shell)

    def test_every_route_to_100_uses_the_canonical_reset(self) -> None:
        for marker in (
            "const K100_SCALE_SNAP_MIN = 0.97;",
            "const K100_SCALE_SNAP_MAX = 1.03;",
            "if(normalizeStoredZoom)this._resetZoom(false)",
            "session.moved&&this._zoom.scale>=K100_SCALE_SNAP_MIN",
            "this._resetZoom(true)",
            "this._zoom={scale:1,x:0,y:0}",
            "viewport.scrollLeft=0;viewport.scrollTop=0",
            "Масштаб 100%",
            "this._saveZoom()",
        ):
            self.assertIn(marker, self.source)
        self.assertGreaterEqual(self.source.count("this._resetZoom(true)"), 2)

    def test_gesture_safety_and_resize_reconciliation_are_locked(self) -> None:
        for marker in (
            "const K100_CLICK_GUARD = 460;",
            'new PointerEvent("pointercancel"',
            "event.stopImmediatePropagation?.()",
            'addEventListener("touchstart",this._touchStart,{capture:true,passive:false})',
            'addEventListener("touchcancel",this._touchCancel,{capture:true,passive:false})',
            "const twoFingerTap=!cancelled&&session.multi",
            "if(this._zoomSession){this._zoomResizePending=true;return;}",
            "if(this._zoomResizePending){this._zoomResizePending=false;this._clampAndApplyZoom(true);}",
            "nikas:panel-transform:v2:",
        ):
            self.assertIn(marker, self.source)
        zoom = self.contract["app_shell"]["content_zoom"]
        self.assertEqual(zoom["gesture_click_guard_ms"], 460)
        self.assertEqual(zoom["viewport_binding_requires_nodes"], ["k100-work", "k100-stage"])
        self.assertEqual(zoom["gesture_listener_phase"], "capture")


if __name__ == "__main__":
    unittest.main()
