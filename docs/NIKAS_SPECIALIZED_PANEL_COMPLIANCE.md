# NikaS specialized-panel compliance — Keenetic Hero 4G+

**Audit date:** 2026-08-26
**Standard:** NikaS Specialized Panel UI Standard v1.6
**Canonical revision checked:** `NikaSir/ha-contract-generated-ui@0cafa26faa145cc4d63e9c9ae7ecd668884d6f95`
**Audited production path:** `panel_runtime.py` + `PANEL_VERSION=0.7.6` → `keenetic-panel-bundle.js?v=0.7.6` → `keenetic-hero-app-panel-v076`
**Scope:** implemented in UI v0.7.6; phone field acceptance remains required

| Area | Result | Evidence |
|---|---|---|
| Integration-owned fixed shell | PASS | v076 height-locks the three-row phone shell, prevents scroll chaining and keeps Header/`.nika-tabbar` outside `#app-content`/zoom surface. |
| Native HA menu | PASS | `frontend/keenetic-app-v045.js` restores `mdi:menu` and dispatches bubbling/composed `hass-toggle-menu`. |
| One production entry / cache busting | PASS | `panel_runtime.py` selects one `keenetic-panel-bundle.js?v=0.7.6`; build-time asset URLs and the manifest use the same version key. |
| Stable live updates | PASS | v075's field-confirmed no-flicker point patch remains the update engine; v076 adds no telemetry-time shell or view replacement. |
| Persistent shell and lazy tab cache | PASS | Header, Bottom Tab Bar and zoom viewport keep DOM identity. Work views are created on first visit, retained, and switched with `hidden`/`inert`. |
| Requested connection indicator | PASS | v076 renders a stable two-line status-tinted surface, patches semantic categories/ARIA only, uses 16/700 plus 13/600 typography, and keeps current freshness neutral. |
| Scale 75–200% and focal pinch | PASS | Final `frontend/keenetic-app-v074.js` clamps 0.75–2.0 and maintains the content point under the live midpoint. |
| Native vertical scroll at 100% | PASS | v074 uses vertical native overflow, explicitly hides horizontal overflow and sets `touch-action:pan-y` at or below 100%. |
| Origin fixed at 100%; no custom one-finger pan | PASS | v074 clamps transform x/y to zero at or below 100% and creates a pan candidate only above 100%. |
| Pan only above 100% / overflowing axes | PASS | v074 independently enables and clamps each axis from measured scaled bounds. |
| 97–103% snap | PASS | v074 snaps this range to exactly 100% after gesture end. |
| Two-finger double-tap reset and toast | PASS | v076 preserves the completed two-touch record after the first finger lifts; v074 then resets scale/position/native scroll and announces `Масштаб 100%`. |
| No permanent zoom buttons | PASS | v074 never installs controls and removes legacy control nodes defensively. |
| Scale persistence granularity | PASS | v074 persists per panel/client and config-entry device key. |
| Tab reset and clamp | PASS | v074 resets scroll/x/y on each accepted tab transition, then remeasures the new content while preserving scale. |
| Resize clamp | PASS | v074 observes the surface and window/visual viewport resize, then remeasures and clamps. |
| Header reference geometry | PASS | Final v076 CSS sets 52/48 rails, 62/60 height, matched 44×44 radius-16 plaques, exact reference shadow, 25px icons and 23/14 or narrow 21/13 typography. |
| Safe area | PASS | `frontend/keenetic-app-v066.js` consumes top safe area; `v069.js` consumes bottom safe area while shell stays fixed. Must be field-checked for exactly-once consumption with `handle_safe_area=True`. |
| Bottom Tab geometry | PASS | Final v076 CSS uses 6px insets, minimum 52px controls, radius 16, 3px internal gap, 28px `ha-icon`, 12/700 labels, 11% active fill and bottom safe area. |
| Meaningful typography envelope | PASS | Final v076 overrides active panel views to 12–25px while retaining only the v1.6 redundant-schematic exception. |
| Click/hold protection | PASS | v074 cancels pending holds on pinch/actual pan and captures post-gesture clicks without intercepting native 100% scroll. |
| Repository icon | PASS | README displays `docs/icon.svg`. |
| Integration icon assets | PASS | `custom_components/keenetic_hero_4g/brand/icon.png` and `dark_icon.png` are valid 256×256 RGBA assets and satisfy the HACS minimum. Logo variants are optional unless a wordmark surface requires them. |
| HACS packaging | PASS | `hacs.json` is configured and the local brand assets ship with the integration. |

## Remaining follow-up

Complete the phone field checks below. Keep the approved README/integration identity aligned; add logo variants only if a future surface requires them.

## Phone verification still required

Long Diagnostics scrolling at 100%; no outer Home Assistant scroll; no horizontal/top-edge displacement; pan axes at >100%; bounds after release/resize/tab change; pinch without snap-back; corrected two-finger reset; tap/hold behavior; matching Header plaques below Dynamic Island; fixed Header/tab bar on short and long views; ten tab cycles; polling loss/recovery; Home Indicator clearance.
