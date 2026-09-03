# NikaS specialized-panel compliance — Keenetic Hero 4G+

**Audit date:** 2026-09-03

**Standard:** NikaS Specialized Panel UI Standard v2.2 + NikaS Panel Navigation and Return Contract v1.2

**Canonical snapshots:** UI `3b6cc750…`; navigation `d495eca8…`; shell kit `c7171560…`

**Audited production path:** `panel_runtime.py` → autonomous `keenetic-panel-bundle.js` → `keenetic-hero-app-panel-v100`

**Release candidate:** UI 1.0.7 / integration 1.0.0-b060

| Area | Result | Evidence |
|---|---|---|
| Home Assistant host boundary | PASS (code) | The shell uses `inline-size`/`block-size: 100%` inside the `ha-panel` host; viewport units and fixed host positioning are absent. |
| Canonical shell rows | PASS (code) | Header, work viewport and Bottom Tab Bar occupy the exact 60 px / flexible / 64 px rows with safe-area additions owned once by the shell. |
| Canonical content frame | PASS (code) | The work canvas is centred at max 1280 px and uses the required 12/16/24 px responsive gutters. |
| Overview canvas fit | PASS (code) | Shell v2.1 owns the sole page gutter; inherited child-shell and Overview padding are zero, removing the false 430×932 scroll range while long views retain native scrolling. |
| Native HA menu | PASS | The permanent left `mdi:menu` button dispatches bubbling/composed `hass-toggle-menu`. |
| Header geometry | PASS (code) | The Header uses symmetric 52/48 px rails, 44×44 side plaques, a 52 px title plaque and the S8 OMNI surface treatment. |
| Source-aware Header return | PASS (code) | The center semantic button captures once, consumes the complete hand-off pair within 30 seconds, recognizes House v13, Rooms v11, Actions and Infrastructure, and navigates without browser history back. |
| One work/zoom viewport | PASS (code) | `#k100-work` is the only scrolling/gesture viewport and `#k100-stage` is the only transformed work canvas. |
| iOS scroll boundary | PASS (code) | The canonical capture-phase, non-passive guard is installed on the panel host, passes multi-touch zoom through and is removed on disconnect. |
| Bottom Tab Bar | PASS (code) | Five equal 52 px tabs use 26 px MDI glyphs, 12/14 px labels and the canonical active tint. |
| Scale and gesture safety | PASS (code) | Existing 75–200% focal pinch, bounded pan, snap/reset, hold cancellation and click suppression remain unchanged. |
| Stable runtime | PASS (code) | The fixed shell mounts once; tab content remains cached and telemetry updates continue through the existing stable child runtime. |
| Domain UI preservation | PASS (code) | Cable/LTE/LAN lines remain absent and the approved green, blue, orange and grey state fills are unchanged. |
| Single-device scope | PASS | Keenetic represents one physical router, so no peer selector or peer-status lamp row is rendered. |
| Version coherence | PASS | Visible UI, runtime/cache key, asset URLs, contract, panel manifest and integration metadata agree on UI 1.0.7 / b060. |
| Deterministic delivery | PASS | The generated production bundle is autonomous, import-free and reproducible from the declared source list, including the hash-pinned shell kit. |

## Device verification still required

Validate the acceptance matrix at 430×932, 932×430, 768×1024, 1024×768 and 1440×900 with the Home Assistant sidebar open and closed where applicable. On the target iPhone/Companion App also verify the fixed Header/Bottom Tab Bar, top/bottom edge gestures, short and long views, pinch at both limits, two-finger reset, more-info holds, all five tabs and Header return from each canonical base panel.
