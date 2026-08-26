# Native panel acceptance tests

Panel: Keenetic Hero 4G+

Panel version: 0.7.5

Integration build: 1.0.0-b038

Standard: NikaS Specialized Panel UI Standard v1.6

Target device: KN-2311

Primary viewport: Home Assistant Companion App on iPhone Pro Max portrait

## 1. Native shell and safe area

- Header remains completely below the Dynamic Island/notch and consumes the effective top safe area exactly once.
- The permanent left Header control is only the Home Assistant menu `☰`; it dispatches `hass-toggle-menu` with bubbling/composed semantics.
- Title `Keenetic Hero 4G+` is geometrically centered between symmetric side rails.
- Refresh is the only global right-rail action; menu and Refresh keep approximately 44 × 44 pt touch targets.
- Header uses 52px side rails (48px narrow), 16px plaque radius, 25px icons and 23/14 text (21/13 narrow).
- Header, menu, Refresh and fixed Bottom Tab Bar remain at native scale.
- Bottom Tab Bar is full-width, edge-attached, safe-area-aware and contains exactly `Обзор / Каналы / Failover / Трафик / Диагн.`.
- Bottom Tab Bar keeps minimum 52 px controls, 28 px `ha-icon` pictograms and 12 px / 700 labels, and adds the iPhone bottom safe-area inset below them.
- Final work content remains reachable above the Bottom Tab Bar; no horizontal page overflow is introduced at 430 px or 390 px.

## 2. Native scroll at 100%; bounded transform above 100%

- Exactly one `#app-content`, one direct `#nika-zoom-stage` and one direct `#nika-zoom-surface` exist after initial load, tab changes and repeated HA state updates.
- At 100%, the central work area keeps native vertical scrolling, hides horizontal overflow, fixes transform `x = 0`, `y = 0`, and does not install one-finger custom pan.
- Above 100%, one-finger pan is enabled only on axes whose scaled content overflows; release, resize and view changes clamp position to measured bounds.
- Scale is 75–200%, persists per panel/config-entry device/client, and 97–103% snaps to exactly 100% when the gesture ends.
- ResizeObserver and window/visual-viewport resize handling remeasure and clamp the single canvas without creating another viewport.
- Each Bottom Tab Bar action directly changes the child view, returns the viewport to origin and schedules one cancellable post-render measurement frame.
- Responsive mobile/tablet/desktop layout is resolved before user scale is applied.

## 3. iPhone gestures

- Two-finger pinch is bound only to `#app-content` and preserves the content point under the live midpoint through native scroll offsets at or below 100% and transform offsets above it.
- One-finger native vertical scrolling remains available at 100%; custom one-finger pan is available only above 100%.
- There are no permanent zoom controls. A stationary two-finger double tap returns scale and position to 100%/origin and briefly shows `Масштаб 100%`.
- Native Header and Bottom Tab Bar interactions are outside all gesture listeners.

## 4. Interaction

- A stationary intentional hold outside a gesture still opens native more-info.
- The second finger or a real pan sends `pointercancel`; generated clicks after a gesture are briefly suppressed.
- Bottom Tab Bar clicks are not intercepted by work-surface gesture handlers.

## 5. Loading and factual semantics

- Shell Header and Bottom Tab Bar remain present during loading.
- Registration snapshot fallback is used if the background bootstrap WebSocket is delayed; the panel never remains indefinitely blank.
- Ethernet/LTE active state, rates, ping, loss, failover and radio values remain factual and read-only.
- `unknown`, `unavailable`, stale or untrusted data never appear healthy and are never fabricated as zero.
- Domain cards, local room/router artwork and dynamic SVG topology remain unchanged by the shell migration.
- Cable, LAN and LTE paths remain behind the router bitmap and disappear at its visible silhouette instead of crossing the top or front face.
- Opening the central `Failover` tab commits the disabled Recorder-history notice once; repeated render hooks do not schedule another render and do not call Recorder.

## 6. Frontend delivery

- Home Assistant registers one self-contained `keenetic-panel-bundle.js?v=0.7.5` and component `keenetic-hero-app-panel-v075`.
- Historical modules are build-time inputs only; production contains no runtime import chain, external panel CSS or Base64 artwork payload.
- Panel contract, manifest, component, route, HA menu event, zoom/reset policy and asset cache-busting agree.
- `python scripts/build_frontend_bundle.py --check`, JavaScript syntax, unit tests, HACS, Hassfest and repository checks pass.

## 7. Stable live-update acceptance

- Wait for several telemetry cycles on every tab while repeatedly scrolling up/down; content, artwork, Header and Bottom Tab Bar must remain visually continuous.
- Verify inertial scrolling and pinch while telemetry arrives. No active tab, image, shell or zoom viewport may be recreated.
- Switch every tab at least ten times. Existing tab containers must only toggle `hidden` / `inert` and retain their DOM identity.
- Verify that no common two-level connection/freshness plaque is present: Keenetic keeps Internet reachability, active WAN and LTE reserve as separate domain facts until explicitly requested.
- Verify that meaningful text remains 12–25px at 390px and 430px widths without truncating critical state labels.
- Minimize and reopen the Companion App; scroll, active tab and fixed-shell continuity must remain valid.

## Release gate

UI v0.7.5 / b038 is accepted after all stable live-update checks pass together with repeated `Failover` opening at 75%, 100%, 150% and 200%; pinch midpoint, persistence, native scroll, bounded pan, safe areas and router path occlusion must continue to pass on the real iPhone Pro Max / KN-2311 environment.
