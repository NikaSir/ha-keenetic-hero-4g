# NikaS specialized-panel compliance — Keenetic Hero 4G+

**Audit date:** 2026-08-26
**Standard:** NikaS Specialized Panel UI Standard v1.5
**Audited production path:** `panel_runtime.py` + `PANEL_VERSION=0.7.3` → `keenetic-panel-bundle.js?v=0.7.3` → `keenetic-hero-app-panel-v073`
**Scope:** audit only; runtime deliberately unchanged in this PR

| Area | Result | Evidence |
|---|---|---|
| Integration-owned fixed shell | PASS | `frontend/keenetic-app-v040.js` owns a three-row shell; Header and `.nika-tabbar` are outside `#app-content`/zoom surface. |
| Native HA menu | PASS | `frontend/keenetic-app-v045.js` restores `mdi:menu` and dispatches bubbling/composed `hass-toggle-menu`. |
| One production entry / cache busting | PASS | `panel_runtime.py` selects one `keenetic-panel-bundle.js?v=0.7.3`; `panel.py` serves local assets. |
| Scale 75–200% and focal pinch | PASS | Effective v0.7.2 layer in the bundle clamps `0.75..2` and recomputes scroll around the finger midpoint. |
| Native vertical scroll at 100% | PARTIAL | Effective `v072` uses `#app-content { overflow:auto; -webkit-overflow-scrolling:touch }`, so vertical scrolling is native. However `overflow:auto` and `touch-action:pan-x pan-y` also allow horizontal scrolling instead of explicitly forbidding it at 100%. |
| Origin fixed at 100%; no custom one-finger pan | PARTIAL | Effective `v072` supersedes v067 custom pan and has no custom single-finger transform handler. It does not explicitly force `scrollLeft=0` at 100% after restore/resize, nor suppress horizontal native scroll. |
| Pan only above 100% / overflowing axes | GAP | v0.7.2 relies on native two-axis overflow scrolling at every scale. It does not gate one-finger horizontal/vertical pan per scale and per overflowing axis. |
| 97–103% snap | GAP | `frontend/keenetic-app-v072.js::_onSafeZoomTouchEndV072` only persists the current value; it has no 97–103% snap. |
| Two-finger double-tap reset and toast | GAP | Effective v0.7.2 has no double-tap detector and no `Масштаб 100%` toast. |
| No permanent zoom buttons | GAP | `v072::_installSafeZoomControlsV072` adds permanent `− / 100% / +` controls, expressly prohibited by v1.5. |
| Scale persistence granularity | PARTIAL | `SAFE_ZOOM_STORAGE_V072` persists per client/panel, but not per peer. Keenetic currently has one peer device, so this is sufficient until peer selection exists. |
| Tab reset and clamp | PARTIAL | Base `v040::_setView` scrolls to top, but effective `v072::_setView` calls `super`, remeasures only, and does not explicitly reset horizontal scroll or transform offset. Native top reset is inherited; full origin/clamp contract is not explicit. |
| Resize clamp | GAP | Effective v0.7.2 removed observer/window resize handling (“no observer loop”) and only schedules measure during install/tab change. No current viewport-resize remeasure/clamp is installed. |
| Header reference geometry | GAP | Layered `v040/v045/v063/v066` CSS leaves `64px` rails (or `52px` narrow), transparent radius-14 controls, `24px` icons, title `17px`/subtitle `9px`; this conflicts with required rails, matching `44×44` plaques/radius 16, icon 25, title 21/subtitle 12 and refresh primary colour. |
| Safe area | PASS | `frontend/keenetic-app-v066.js` consumes top safe area; `v069.js` consumes bottom safe area while shell stays fixed. Must be field-checked for exactly-once consumption with `handle_safe_area=True`. |
| Bottom Tab geometry | GAP | Base/final layers use `21–22px` icons and `9px` labels, not `28px` and `12px`. Active 11% colour and safe area are present; bar is full-width and fixed. |
| Click/hold protection | GAP | Effective v0.7.2 pinch handlers do not cancel pending entity holds or add a post-pinch click guard. |
| Repository icon | PASS | README displays `docs/icon.svg`. |
| Integration icon assets | PASS | `custom_components/keenetic_hero_4g/brand/icon.png` and `dark_icon.png` are valid 256×256 RGBA assets and satisfy the HACS minimum. Logo variants are optional unless a wordmark surface requires them. |
| HACS packaging | PASS | `hacs.json` is configured and the local brand assets ship with the integration. |

## Required runtime follow-up

1. Remove permanent zoom controls; restore 97–103% snap, two-finger double tap and reset toast.
2. Make 100% strictly native vertical-only scroll with `x=0,y=0` and no horizontal movement.
3. Enable one-finger pan only above 100%, independently by overflowing axis, with edge clamps.
4. Re-measure/clamp on resize and reset scroll/offsets on every tab change.
5. Add pinch hold-cancellation and post-gesture click guard without delaying intentional holds.
6. Consolidate Header/Bottom Tab geometry in one final layer.
7. Keep the approved README/integration identity aligned; add logo variants only if a future surface requires them.

## Phone verification still required

Long Diagnostics scrolling at 100%; no horizontal/top-edge displacement; pan axes at >100%; bounds after release/resize/tab change; pinch without snap-back; tap/hold behavior; fixed Header/tab bar; Home Indicator clearance.
