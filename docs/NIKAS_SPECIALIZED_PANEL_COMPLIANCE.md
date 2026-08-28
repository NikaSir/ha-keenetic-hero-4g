# NikaS specialized-panel compliance — Keenetic Hero 4G+

**Audit date:** 2026-08-27
**Standard:** NikaS Specialized Panel UI Standard v1.9 + NikaS Panel Navigation and Return Contract v1.1
**Canonical snapshots:** UI `f02b40c0…`; navigation `c87dc760…`
**Audited production path:** `panel_runtime.py` + panel metadata `0.9.0` → autonomous bundle → `keenetic-hero-app-panel-v090`
**Scope:** b052 approved real-router composition retaining the b047 contract and b045 stable runtime; repeat phone field acceptance is required

| Area | Result | Evidence |
|---|---|---|
| Integration-owned fixed shell | PASS | v080 directly owns one height-locked three-row shell; Header and `.tabbar-v080` stay outside the only work viewport. |
| Native HA menu | PASS | `frontend/keenetic-app-v045.js` restores `mdi:menu` and dispatches bubbling/composed `hass-toggle-menu`. |
| One production entry / cache busting | PASS | `panel_runtime.py` selects one autonomous bundle; build-time asset URLs and the manifest use the same metadata key. |
| Stable live updates | PASS (code) | v083 replaces the double b044 Overview hook with one differential stable patch; the shell's MutationObserver disconnects after initial mount and telemetry cannot request a zoom measurement. |
| Persistent shell and lazy tab cache | PASS | Header, Bottom Tab Bar and zoom viewport keep DOM identity. Work views are created on first visit, retained, and switched with `hidden`/`inert`. |
| Requested connection indicator | PASS | v076 renders a stable two-line status-tinted surface, patches semantic categories/ARIA only, uses 16/700 plus 13/600 typography, and keeps current freshness neutral. |
| Scale 75–200% and focal pinch | PASS | v080 clamps 0.75–2.0 and maintains the content point under the live midpoint. |
| Native vertical scroll at 100% | PASS | v080 leaves the surface in normal flow with `overflow-y:auto`, `touch-action:pan-y` and no transform at 100%. |
| Origin fixed at 100%; no custom one-finger pan | PASS | v080 clears transform x/y at 100% and creates a pan candidate only above 100%. |
| Pan only above 100% / overflowing axes | PASS | v080 clamps both axes from measured scaled bounds. |
| 97–103% snap | PASS | v080 snaps this range to exactly 100% after gesture end. |
| Two-finger double-tap reset and toast | PASS | v080 retains the completed two-touch record until all fingers lift, then resets scale/position/native scroll and announces `Масштаб 100%`. |
| No permanent zoom buttons | PASS | The v080 shell creates no zoom controls. |
| Scale persistence granularity | PASS | v080 persists per panel/client and config-entry device key. |
| Tab reset and clamp | PASS | v080 resets scroll/x/y when the selected work view changes. |
| Resize clamp | PASS (code) | v080 measures the active persistent view rather than the previously sized surface and defers ResizeObserver work until an active gesture ends. |
| Header reference geometry | PASS | v080 uses 52/48 rails, 62/60 height, matched 44×44 radius-16 plaques, reference shadow, 25px icons and 23/14 or narrow 21/13 typography. |
| Source-aware Header return | PASS (code) | v085 captures once, consumes a complete route/timestamp pair, rejects invalid, stale and future timestamps, persists the accepted panel route, normalizes only the three canonical base entries and supplies the route before the persistent v081 button binds its single handler. |
| Data truth and command policy | PASS | The frontend is read-only and consumes integration/registry mappings; missing and unavailable values remain explicit, and no service command exists in the autonomous bundle. |
| Safe area | PASS | v080 resolves each HA/iOS inset through one shell-owned property and consumes it once at the corresponding shell edge. |
| Bottom Tab geometry | PASS | v080 preserves 6px insets, minimum 52px controls, radius 16, 3px gap, 28px icons, 12/700 labels and one bottom safe area. |
| Meaningful typography envelope | PASS | v076 content rules plus v080 shell retain the semantic 12–25px hierarchy. |
| Click/hold protection | PASS | v080 cancels pending holds on pinch/actual pan and captures post-gesture clicks without intercepting native 100% scroll. |
| Overview more-info | PASS (code) | v083 restores `data-entity` and keyboard focus for every factual active-channel metric. |
| Internal view synchronization | PASS (code) | Overview emits one cancelable view request; the outer shell owns URL, child view, reset and Bottom Tab selection. |
| Overview composition | PASS (code) | v084 keeps the 320 px phone hero, separated LTE/indicator geometry, retuned paths, balanced WAN IP/Uptime row and compact reserve surfaces. |
| Repository icon | PASS | README displays `docs/icon.svg`. |
| Integration icon assets | PASS | `custom_components/keenetic_hero_4g/brand/icon.png` and `dark_icon.png` are valid 256×256 RGBA assets and satisfy the HACS minimum. Logo variants are optional unless a wordmark surface requires them. |
| HACS packaging | PASS | `hacs.json` is configured and the local brand assets ship with the integration. |
| Deterministic production bundle | PASS | `build_frontend_bundle.py --check` reproduces the single import-free entrypoint and the configured UI version, cache key and `v090` component agree. |

## Remaining follow-up

Complete the phone field checks below for b052. Code/build compliance is not a substitute for Companion App gesture and navigation acceptance.

## Phone verification still required

Long Diagnostics scrolling at 100%; no outer Home Assistant scroll; no horizontal/top-edge displacement; pan axes at >100%; bounds after release/resize/tab change; pinch without snap-back; corrected two-finger reset; tap/hold behavior; matching Header plaques below Dynamic Island; return from each canonical base panel plus direct-open fallback; fixed Header/tab bar on short and long views; ten tab cycles; polling loss/recovery; Home Indicator clearance.
