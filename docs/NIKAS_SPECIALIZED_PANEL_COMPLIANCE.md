# NikaS specialized-panel compliance — Keenetic Hero 4G+

**Audit date:** 2026-08-30

**Standard:** NikaS Specialized Panel UI Standard v1.9 + NikaS Panel Navigation and Return Contract v1.1

**Canonical snapshots:** UI `a31dc454…`; navigation `c87dc760…`

**Audited production path:** `panel_runtime.py` → autonomous `keenetic-panel-bundle.js` → `keenetic-hero-app-panel-v100`

**Release candidate:** UI 1.0.4 / integration 1.0.0-b056

| Area | Result | Evidence |
|---|---|---|
| Height-locked shell | PASS (code) | v100 owns one three-row shell sized to `100dvh`; Header and Bottom Tab Bar stay outside the work viewport. |
| Full-height short view | PASS (code) | The child host/shell/main/view chain fills the work row and Overview gives the Hero a fluid `minmax(...,1fr)` row, eliminating the white tail above the Bottom Tab Bar. |
| Native HA menu | PASS | The permanent left `mdi:menu` button dispatches bubbling/composed `hass-toggle-menu`. |
| S8 OMNI Header surface | PASS (code) | The persistent Header uses the 97% primary-background strip, 70% divider, 18px/130% backdrop treatment, 12px safe padding and symmetric 52/48px rails. |
| S8 OMNI Header plaques | PASS (code) | Side actions are matched 44×44/radius-16 plaques with a 72% divider border, reference shadow and 25px icons; title plaque uses the canonical default/pressed/focus surfaces. |
| Source-aware Header return | PASS (code) | The center semantic button consumes the complete one-shot route/timestamp pair, validates the three canonical NikaS sources and navigates explicitly without browser-back history. |
| One work/zoom viewport | PASS (code) | `#k100-work` is the only scrolling/gesture viewport and `#k100-stage` is the only transformed work canvas. |
| Scale range and focal pinch | PASS (code) | v100 clamps 75–200% and retains the content point under the live two-touch midpoint. |
| Native behavior at 100% | PASS (code) | Exact 100% uses native vertical scrolling, origin x/y=0 and no horizontal overflow or transform pan. |
| Pan above 100% | PASS (code) | One-finger transform pan starts only above 100% and is clamped independently to measured overflow on each axis. |
| Canonical return to 100% | PASS (code) | Snap, invalid stored-state normalization and two-finger double tap all call the same reset operation, clearing scale/x/y and native scrollLeft/scrollTop before persistence. |
| Gesture safety | PASS (code) | Pinch/pan cancel pending touch holds, suppress generated click/contextmenu activation and defer resize reconciliation until the gesture ends. |
| Scale persistence | PASS (code) | Normalized transform state persists locally for the Keenetic panel/client context. |
| Stable runtime | PASS (code) | The fixed shell mounts once; tab content remains cached and telemetry updates continue through the existing stable child runtime. |
| Version coherence | PASS | Visible UI, runtime/cache key, asset URLs, contract, panel manifest and integration metadata agree on UI 1.0.4 / b056. |
| Deterministic delivery | PASS | The generated production bundle is autonomous, import-free and reproducible from the declared source list. |
| Repository packaging | PASS | Local icon assets, HACS metadata and Home Assistant integration metadata remain included. |

## Phone verification still required

Validate on the target iPhone/Companion App: no white tail in short Overview; last Diagnostics control clears the Bottom Tab Bar; Header remains fixed below the Dynamic Island; pinch at both limits; focal continuity while crossing 100%; one-finger pan only above 100%; release at 97–103%; stationary two-finger double tap; toast; exact scroll origin after reset; resize/orientation clamp; click/hold safety; and return to all three canonical NikaS base routes.
