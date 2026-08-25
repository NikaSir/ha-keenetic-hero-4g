# Native panel acceptance tests

Panel: Keenetic Hero 4G+

Panel version: 0.7.1

Integration build: 1.0.0-b034

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

## 2. Temporary stability mode

- Exactly one `#app-content`, one direct `#nika-zoom-stage` and one direct `#nika-zoom-surface` exist after initial load, tab changes and repeated HA state updates.
- Transform, pinch/pan gesture handling and ResizeObserver measurement are disabled in b034.
- The central work area uses native vertical scrolling; Header and Bottom Tab Bar remain fixed outside it.
- Each Bottom Tab Bar action directly changes the child view and returns the work area to its top-left origin.
- Responsive mobile/tablet/desktop layout remains active at native 100% scale.

## 3. iPhone gestures

- Pinch-to-zoom, canvas pan, reset gesture and gesture click guard are temporarily disabled.
- One-finger vertical scrolling remains available in the work area.
- Native Header and Bottom Tab Bar interactions remain available and do not enter a gesture state.

## 4. Interaction

- A stationary intentional hold outside a gesture still opens native more-info.
- Bottom Tab Bar clicks are not intercepted by canvas gesture guards.

## 5. Loading and factual semantics

- Shell Header and Bottom Tab Bar remain present during loading.
- Registration snapshot fallback is used if the background bootstrap WebSocket is delayed; the panel never remains indefinitely blank.
- Ethernet/LTE active state, rates, ping, loss, failover and radio values remain factual and read-only.
- `unknown`, `unavailable`, stale or untrusted data never appear healthy and are never fabricated as zero.
- Domain cards, local room/router artwork and dynamic SVG topology remain unchanged by the shell migration.
- Cable, LAN and LTE paths remain behind the router bitmap and disappear at its visible silhouette instead of crossing the top or front face.

## 6. Frontend delivery

- Home Assistant registers one self-contained `keenetic-panel-bundle.js?v=0.7.1` and component `keenetic-hero-app-panel-v071`.
- Historical modules are build-time inputs only; production contains no runtime import chain, external panel CSS or Base64 artwork payload.
- Panel contract, manifest, component, route, HA menu event, zoom/reset policy and asset cache-busting agree.
- `python scripts/build_frontend_bundle.py --check`, JavaScript syntax, unit tests, HACS, Hassfest and repository checks pass.

## Release gate

UI v0.7.1 / b034 is accepted after all five Bottom Tab Bar views switch repeatedly without a stalled UI, while native vertical scrolling, safe-area geometry and router path occlusion continue to pass on the real iPhone Pro Max / KN-2311 environment.
