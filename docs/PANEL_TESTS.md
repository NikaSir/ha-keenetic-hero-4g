# Native panel acceptance tests

Panel: Keenetic Hero 4G+

Panel metadata version: 0.8.7

Integration build: 1.0.0-b049

Standard: NikaS Specialized Panel UI Standard v1.9 + NikaS Panel Navigation and Return Contract v1.1

Target device: KN-2311

Primary viewport: Home Assistant Companion App on iPhone Pro Max portrait

## 1. Native shell and safe area

- Header remains completely below the Dynamic Island/notch and consumes the effective top safe area exactly once.
- The permanent left Header control is only the Home Assistant menu `☰`; it dispatches `hass-toggle-menu` with bubbling/composed semantics.
- Title `Keenetic Hero 4G+` is geometrically centered between symmetric side rails.
- Refresh is the only global right-rail action; menu and Refresh keep approximately 44 × 44 pt touch targets.
- Header, menu, Refresh and fixed Bottom Tab Bar remain at native scale.
- Menu and Refresh render as matching 44 × 44 px, radius-16 plaques with 25 px `ha-icon` glyphs and remain fully visible below the Dynamic Island.
- The height-locked shell prevents the Home Assistant outer document from scrolling; short views fill the work row instead of moving either menu.
- The custom-panel host remains in normal Home Assistant layout flow; no mobile `position: fixed; inset: 0` override may detach it from the HA panel container.
- Bottom Tab Bar is full-width, edge-attached, safe-area-aware and contains exactly `Обзор / Каналы / Failover / Трафик / Диагн.`.
- Bottom Tab Bar keeps minimum 52 px controls, 28 px `ha-icon` pictograms and 12 px / 700 labels, and adds the iPhone bottom safe-area inset below them.
- Final work content remains reachable above the Bottom Tab Bar; no horizontal page overflow is introduced at 430 px or 390 px.

## 2. Native scroll at 100%; bounded transform above 100%

- Exactly one `#work-viewport-v080`, one direct `#zoom-stage-v080` and one direct `#zoom-surface-v080` exist after initial load, tab changes and repeated HA state updates.
- At 100%, the central work area keeps native vertical scrolling, hides horizontal overflow, fixes transform `x = 0`, `y = 0`, and does not install one-finger custom pan.
- Above 100%, one-finger pan is enabled only on axes whose scaled content overflows; release, resize and view changes clamp position to measured bounds.
- Scale is 75–200%, persists per panel/config-entry device/client, and 97–103% snaps to exactly 100% when the gesture ends.
- ResizeObserver and window/visual-viewport resize handling remeasure and clamp the single canvas without creating another viewport.
- The shell mounts its viewport, stage and surface before attaching the child panel; the active persistent view supplies measurements only after scale leaves 100%.
- Each Bottom Tab Bar action directly changes the child view, returns the viewport to origin and schedules one cancellable post-render measurement frame.
- A `data-view` action inside Overview requests the change from the outer shell, so the child view, URL fragment and highlighted Bottom Tab item always agree.
- Telemetry DOM mutations never trigger viewport measurement. The mount observer disconnects permanently once `.shell` exists.
- Scaled height is measured from the active persistent view and shell padding, never from the previously sized transform surface.
- Resize changes received during pinch or custom pan are deferred until the gesture ends.
- Responsive mobile/tablet/desktop layout is resolved before user scale is applied.

## 3. iPhone gestures

- Two-finger pinch is bound only to `#work-viewport-v080` and preserves the content point under the live midpoint through native scroll offsets at or below 100% and transform offsets above it.
- One-finger native vertical scrolling remains available at 100%; custom one-finger pan is available only above 100%.
- There are no permanent zoom controls. A stationary two-finger double tap returns scale and position to 100%/origin and briefly shows `Масштаб 100%`.
- Native Header and Bottom Tab Bar interactions are outside all gesture listeners.

## 4. Interaction

- A stationary intentional hold outside a gesture still opens native more-info.
- Ping, loss, Link/signal, RX, TX, WAN IP and uptime on Overview retain their factual `data-entity` mapping.
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

- Home Assistant registers one self-contained `keenetic-panel-bundle.js?v=0.8.7` and component `keenetic-hero-app-panel-v087`.
- Superseded shell/zoom modules v066–v078 are excluded; production contains no runtime import chain, external panel CSS or Base64 artwork payload.
- Panel contract, manifest, component, route, HA menu event, zoom/reset policy and asset cache-busting agree.
- `python scripts/build_frontend_bundle.py --check`, JavaScript syntax, unit tests, HACS, Hassfest and repository checks pass.

## 7. Stable live-update acceptance

- Wait for several telemetry cycles on every tab while repeatedly scrolling up/down; content, artwork, Header and Bottom Tab Bar must remain visually continuous.
- Verify inertial scrolling and pinch while telemetry arrives. No active tab, image, shell or zoom viewport may be recreated.
- Switch every tab at least ten times. Each view is created only on first visit; returning to it must reuse the same subtree and only toggle `hidden` / `inert`.
- Verify polling failure and recovery: `Локально · Данные актуальны` changes to `Нет связи · Данные устарели`, then recovers without a loading frame.
- Verify the phone hero is approximately 340 px high at 430 CSS px, contains no empty lower floor band, and shows the full `Резервный канал` caption without reducing its 12 px text.
- Verify the channel/freshness indicator uses 16 px / 700 and 13 px / 600 text respectively and never shrinks below 13 px.
- Verify all meaningful content stays within 12–25 px; only redundant schematic annotations may use the documented 9–10 px exception.
- Minimize and reopen the Companion App; scroll, active tab and fixed-shell continuity must remain valid.

## Release gate

Build b049 is a phone-validation candidate. It is accepted only after all NikaS rule 1.17, v1.9 navigation-contract and production-bundle checks pass together with return tests from all three base panels, repeated `Failover` opening at 75%, 100%, 150% and 200%; native vertical scroll, focal pinch, two-finger double-tap reset, fixed Header/Bottom Tab Bar, more-info holds, semantic typography, persistence, bounded pan, exactly-once safe areas and the approved real KN-2311 Cable/LTE/LAN composition must pass on the real iPhone Pro Max / KN-2311 environment.
