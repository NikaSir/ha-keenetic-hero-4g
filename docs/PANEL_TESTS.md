# Native panel acceptance tests

Panel: Keenetic Hero 4G+

Panel version: 0.7.0

Integration build: 1.0.0-b033

Standard: NikaS Specialized Panel UI Standard v1.3

Target device: KN-2311

Primary viewport: Home Assistant Companion App on iPhone Pro Max portrait

## 1. Native shell and safe area

- Header remains completely below the Dynamic Island/notch and consumes the effective top safe area exactly once.
- The permanent left Header control is only the Home Assistant menu `☰`; it dispatches `hass-toggle-menu` with bubbling/composed semantics.
- Title `Keenetic Hero 4G+` is geometrically centered between symmetric side rails.
- Refresh is the only global right-rail action; menu and Refresh keep approximately 44 × 44 pt touch targets.
- Header, menu, Refresh and fixed Bottom Tab Bar remain at native scale.
- Bottom Tab Bar is full-width, edge-attached, safe-area-aware and contains exactly `Обзор / Каналы / Failover / Трафик / Диагн.`.
- Bottom Tab Bar keeps its 54 px controls and adds the iPhone bottom safe-area inset below them, matching the accepted S8 OMNI shell geometry.
- Final work content remains reachable above the Bottom Tab Bar; no horizontal page overflow is introduced at 430 px or 390 px.

## 2. Transform-owned work canvas

- Exactly one `#app-content`, one direct `#nika-zoom-stage` and one direct `#nika-zoom-surface` exist after initial load, tab changes and repeated HA state updates.
- Only the work canvas scales; Header and Bottom Tab Bar remain outside it.
- Canvas position is represented only by `translate3d(x,y,0) scale(s)`; native `scrollLeft`, `scrollTop`, CSS `zoom` and browser rubber-band offsets are not used as state.
- Responsive mobile/tablet/desktop layout is resolved before the user transform is applied.
- Scale is limited to 75–200%, defaults to 100% and persists locally for this panel/client.
- At less than 100%, the native-width work canvas is centered horizontally.
- Changing any Bottom Tab Bar view stops the previous ResizeObserver/animation-frame measurement, renders the new child view, then performs exactly one deferred canvas measurement from the new view origin.

## 3. iPhone gestures

- Two-finger pinch preserves the content point below the live midpoint between the fingers.
- At 100%, one finger moves the canvas vertically to content below the fold and the released position remains stable.
- At 150–200%, one finger pans the canvas horizontally and vertically; all edges remain clamped to the viewport.
- No permanent `− / % / +` controls are rendered.
- Two consecutive stationary two-finger taps within 360 ms reset scale and translation to 100%/origin.
- A completed pinch between 97% and 103% snaps to exactly 100%.
- Reset and snap briefly show `Масштаб 100%` outside the scaled canvas.
- The same logical transform survives normal telemetry updates and unavailable/available transitions.

## 4. Interaction guard

- Starting a two-finger gesture immediately cancels pending entity holds.
- Crossing the 5 px one-finger pan threshold dispatches `pointercancel` to the touched factual entity.
- Clicks generated after pinch/pan are suppressed for 700 ms.
- Pinch and pan never open native Home Assistant more-info/history.
- A stationary intentional hold outside a gesture still opens native more-info.

## 5. Loading and factual semantics

- Shell Header and Bottom Tab Bar remain present during loading.
- Registration snapshot fallback is used if the background bootstrap WebSocket is delayed; the panel never remains indefinitely blank.
- Ethernet/LTE active state, rates, ping, loss, failover and radio values remain factual and read-only.
- `unknown`, `unavailable`, stale or untrusted data never appear healthy and are never fabricated as zero.
- Domain cards, local room/router artwork and dynamic SVG topology remain unchanged by the shell migration.
- Cable, LAN and LTE paths remain behind the router bitmap and disappear at its visible silhouette instead of crossing the top or front face.

## 6. Frontend delivery

- Home Assistant registers one self-contained `keenetic-panel-bundle.js?v=0.7.0` and component `keenetic-hero-app-panel-v070`.
- Historical modules are build-time inputs only; production contains no runtime import chain, external panel CSS or Base64 artwork payload.
- Panel contract, manifest, component, route, HA menu event, zoom/reset policy and asset cache-busting agree.
- `python scripts/build_frontend_bundle.py --check`, JavaScript syntax, unit tests, HACS, Hassfest and repository checks pass.

## Release gate

UI v0.7.0 / b033 is accepted after all five Bottom Tab Bar views switch without a stalled UI or loading state, while safe-area geometry, router path occlusion and native shell/zoom checks continue to pass on the real iPhone Pro Max / KN-2311 environment.
