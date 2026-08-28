# Changelog

## UI v0.8.6 / v1.00_b048 — 2026-08-28

- Replaces the degraded generated router layer with a transparent local asset derived from the official Keenetic Hero 4G+ KN-2311 product photograph.
- Preserves the approved real housing, grey top panel, four flat antennas, front indicators and right-side ventilation/USB geometry.
- Extends the red Cable, green LAN and vertical active-LTE paths under the router body so every channel visibly terminates at the device without drawing over it.
- Preloads and decodes the new asset once during stable Overview mounting and never reassigns its unchanged `src` from telemetry updates.
- Publishes a distinct autonomous `UI v0.8.6` bundle/cache key and registers only `keenetic-hero-app-panel-v086` as the current runtime component.

## UI v0.8.5 / v1.00_b047 — 2026-08-28

- Preserves the accepted b046 Overview composition, factual active/reserve channel logic, stable point-patched telemetry and fixed shell geometry.
- Aligns the panel contract, manifest and repository guards with NikaS UI Standard v1.8 and the required Navigation and Return Contract v1.0.
- Captures the Header return route once using the exact precedence `return_to` → `from` → one-shot session hand-off → saved panel route → same-origin referrer → configured parent → safe fallback.
- Normalizes House now, Actions and Infrastructure sources to their canonical entry routes and rejects legacy, arbitrary, specialized-panel and cross-origin destinations.
- Persists the accepted Keenetic return route per client without recalculating it during telemetry, tab changes, scroll or gestures.
- Publishes a distinct autonomous `UI v0.8.5` bundle/cache key and registers only `keenetic-hero-app-panel-v085` as the current runtime component.

## UI v0.8.4 / v1.00_b046 — 2026-08-27

- Shortens the phone hero from 340 px to 320 px while preserving the full Cable/LTE/LAN topology and router artwork.
- Moves the LTE reserve card down into a clear visual gap below the connection indicator and retunes all three SVG path anchors.
- Keeps Cable, router and LAN at their accepted absolute visual level while removing the remaining empty floor band.
- Reflows the final active-channel metric row into equal WAN IP and Uptime halves instead of leaving a two-thirds empty span.
- Compacts the reserve, metric and reserve-channel surfaces so the reserve row clears the fixed Bottom Tab Bar sooner.
- Publishes a distinct UI/cache key for repeat phone validation without merging the draft PR.

## UI v0.8.3 / v1.00_b045 — 2026-08-27

- Replaces the b044 double Overview hook with one differential point patch and prevents unchanged topology text or attributes from being rewritten.
- Disconnects the child MutationObserver after first mount so telemetry updates cannot remeasure or disturb the zoom surface.
- Measures scaled bounds from the active persistent view, excludes stale inline surface height, and defers ResizeObserver work until pinch/pan ends.
- Routes Overview drill-downs through the outer shell so the content, URL fragment and Bottom Tab selection remain synchronized.
- Restores factual `data-entity` bindings for active-channel more-info holds.
- Reduces the phone hero to 340 px, removes the empty lower floor band, widens the LTE caption and compacts the reserve and metric surfaces.
- Encodes Cable/LTE/LAN paths independently as active, ready reserve, down or unknown instead of fabricating a uniform healthy/red topology.
- Synchronizes panel metadata, contract, runtime component and asset cache keys at UI 0.8.3 / integration b045.

## UI metadata 0.8.0 / v1.00_b042 — 2026-08-27

- Replaces the accumulated application-shell and gesture inheritance chain with one independently mounted production shell.
- Restores native vertical scrolling at 100% by keeping the work surface in normal document flow with no transform or custom one-finger handler.
- Installs one new focal pinch engine for 75–200% content-only scaling; Header and Bottom Tab Bar remain outside every gesture and transform node.
- Keeps the two-finger double-tap reset, 97–103% snap, fixed safe areas and stable point-patched telemetry DOM.
- Rebalances the overview topology so LTE, Cable and LAN cards and their paths clear the router and KPI row.
- Removes the build/UI number from the visible Header; only release metadata carries it.
- Excludes superseded shell/zoom modules v066–v078 from the production dependency graph.

## UI v0.7.8 / v1.00_b041 — 2026-08-27

- Rebinds pinch gesture listeners in the capture phase only after `app-content`, `nika-zoom-stage`, `nika-zoom-surface` and the child panel exist.
- Retries viewport initialization instead of marking a missing surface as ready.
- Measures the active persistent view after mount and on `ResizeObserver` changes, then gives the stage the real scaled content height so native vertical scrolling works at 100%.
- Keeps Header and Bottom Tab Bar outside the only scroll/zoom viewport and preserves the stable no-flicker DOM update path.
- Rebalances the overview for the 12 px minimum type scale: Cable and LAN move above the router path, topology cards become symmetric, and the router is slightly smaller and lower.

## UI v0.7.7 / v1.00_b040 — 2026-08-26

- Removes the v0.7.6 mobile `position: fixed; inset: 0` host override that escaped the Home Assistant panel container and produced incorrect Header/work-viewport geometry on the real iPhone.
- Restores one height-locked three-row grid in normal panel flow; `#app-content` again owns explicit native vertical scrolling at 100% while Header and Bottom Tab Bar remain outside it.
- Re-arms the existing focal two-finger pinch after the child work surface has mounted and remeasures it on the second animation frame, avoiding a zero/incorrect initial canvas measurement.
- Rebuilds the Header with one effective HA/iOS safe-area source, explicit row placement and matched 44×44 controls.
- Replaces the flattened 12 px content override with a semantic 12–25 px hierarchy for captions, values, topology labels and headings.
- Keeps the v0.7.5 stable-DOM/no-flicker update path and the v0.7.6 two-line connection indicator unchanged.

## UI v0.7.6 / v1.00_b039 — 2026-08-26

- Rebuilds the panel against the repository-owned NikaS Specialized Panel UI Standard v1.6.
- Locks the phone shell to the viewport so only the single work viewport scrolls; Header and Bottom Tab Bar remain stationary and native-scale on long and short views.
- Updates Header to the 23/14 px reference pair (21/13 px narrow) and gives Menu and Refresh identical 44×44 reference plaques.
- Corrects the two-finger double-tap recognizer so releasing the first finger no longer discards the completed gesture; reset returns scale, transform and native scroll to 100%/origin.
- Converts visited tabs to lazy stable DOM caching while preserving point-patched telemetry and the field-confirmed no-flicker update path.
- Reworks the optional connection indicator as one fixed-size, two-line, status-tinted surface with 16/700 and 13/600 text; failed polling marks retained data stale without falsely changing the known transport.
- Enforces the 12–25 px meaningful typography envelope and deterministic v0.7.6 asset cache keys.
- Removes the obsolete automatic Git-tag publication workflow; builds are published only through traceable branches, commits and pull requests.

## UI v0.7.5 / v1.00_b038 — 2026-08-26

- Replaces live full-DOM rendering with one-time view mounting and `requestAnimationFrame` point patches.
- Keeps every tab container, the Header, zoom viewport and Bottom Tab Bar as persistent DOM nodes; tabs switch with `hidden` and `inert`.
- Updates the requested two-level connection indicator only when its semantic category changes; failed polling immediately marks retained values stale.
- Locks indicator typography to 16 px / 700 for the channel and 13 px / 600 for freshness, with no sub-13 px fallback.
- Preloads and decodes image elements and never reassigns an unchanged `src` or reconnects an existing event handler.

## UI v0.7.4 / v1.00_b037 — 2026-08-26

- Implements NIKAS Specialized Panel UI Standard v1.5.
- Uses native vertical-only scrolling at 100% and bounded axis-specific pan only above 100%.
- Removes permanent zoom controls and restores snap, two-finger reset, toast and gesture guards.
- Aligns Header and Bottom Tab Bar with the UPS reference geometry.

## UI v0.7.3 / v1.00_b036 — 2026-08-26

- Fixed the central `Failover` tab freeze caused by the disabled Recorder-history override scheduling a new render after every render.
- The disabled-history notice is now committed once per panel instance; subsequent view render hooks return without scheduling work.
- Kept the b035 isolated pinch/screen-control zoom, native scrolling, shell geometry and factual Failover KPIs unchanged.

## UI v0.7.2 / v1.00_b035 — 2026-08-25

- Reintroduced content-only zoom on top of the proven b034 native-scroll navigation path.
- Removed ResizeObserver, transform translation state and global click capture from the active zoom implementation.
- Bound two-finger pinch only to the scaled work surface; Header and Bottom Tab Bar remain outside all gesture listeners.
- Added permanent `− / % / +` controls; the percentage button resets to 100%, and the selected 75–200% scale persists per client.
- View changes use one cancellable post-render measurement frame with no observer feedback loop.

## UI v0.7.1 / v1.00_b034 — 2026-08-25

- Temporarily disabled the transform-owned canvas, pinch/pan gesture handlers and ResizeObserver measurement loop after the iOS tab stall persisted in b033.
- Restored direct Bottom Tab Bar switching with ordinary native vertical scrolling in the central work area.
- Kept the Header, Bottom Tab Bar, top/bottom safe areas, artwork and router path occlusion unchanged.

## UI v0.7.0 / v1.00_b033 — 2026-08-25

- Fixed the Bottom Tab Bar transition race that could leave the panel stalled when opening the second `Каналы` view on iOS.
- View changes now stop the old ResizeObserver/frame cycle, render the child view, then perform one deferred transform-canvas measurement.
- Preserved the selected scale across views while resetting each newly opened view to its top-left origin.
- Kept the accepted iPhone top/bottom safe areas, S8 OMNI tab-bar geometry and router path occlusion unchanged.

## UI v0.6.9 / v1.00_b032 — 2026-08-25

- Restored the iPhone bottom safe-area inset below the fixed Bottom Tab Bar.
- Kept the accepted 54 px tab controls, 21 px icons and 9 px labels while matching the effective S8 OMNI shell height above the Home Indicator.
- Preserved the native-scale Header/Bottom Tab Bar, transform-owned work-canvas zoom and router path occlusion from b031.

## UI v0.6.8 / v1.00_b031 — 2026-08-25

- Moved the dynamic Cable, LAN and LTE connection layer behind the photorealistic router layer.
- Connection paths now disappear naturally at the router silhouette instead of crossing its visible top and front faces.
- Preserved the accepted room/router artwork, topology geometry, factual WAN/LTE states and NikaS v1.3 canvas zoom behavior.

## UI v0.6.7 / v1.00_b030 — 2026-08-25

- Migrated Keenetic to NikaS Specialized Panel UI Standard v1.3 without changing domain cards, artwork or WAN/LTE semantics.
- Replaced native overflow/scroll-position zoom with one transform-owned `translate3d(x,y,0) scale(s)` work canvas so iOS cannot rubber-band the panel back to an edge or origin.
- Added focal two-finger pinch and one-finger canvas pan at both 100% and enlarged scales; scale now follows the required 75–200% range.
- Removed permanent zoom controls; two stationary two-finger taps reset scale and translation to 100%/origin, while a completed 97–103% pinch snaps to 100%.
- Added the transient `Масштаб 100%` confirmation, per-client scale persistence and rebuild-safe transform state across telemetry updates.
- Added gesture guards that cancel pending entity holds and suppress post-pinch/pan clicks for 700 ms while preserving intentional stationary hold → native Home Assistant more-info.
- Preserved the iPhone safe area, native HA menu, geometrically centered Header, fixed full-width Bottom Tab Bar, local layered artwork and autonomous bundle delivery.

## UI v0.6.6 / v1.00_b029 — 2026-08-25

- Restored the iOS top safe area that had been overridden by the compact v0.6.3 Header geometry.
- Moved the complete specialized-panel Header below the iPhone notch / Dynamic Island while keeping its title geometrically centered.
- Added the system top inset to Header height instead of taking space from the 44 px menu and refresh touch targets.
- Kept desktop geometry, central-content zoom, fixed Bottom Tab Bar and live WAN/LTE behavior unchanged.

## UI v0.6.5 / v1.00_b028 — 2026-08-25

- Aligned the router with the live Cable/LAN and LTE connection paths and reduced the three topology cards without changing their factual states.
- Added NikaS content-only zoom: two-finger pinch around the gesture midpoint plus fixed on-screen decrease, increase and reset controls.
- Kept Header, Bottom Tab Bar and zoom controls outside the scaled work area; zoomed content supports horizontal and vertical panning.
- Added an 85–180% zoom range, 10% button steps and local persistence across tabs and panel restarts.
- Preserved the UI v0.6.4 photorealistic local background, read-only WAN/LTE behavior and autonomous frontend bundle.

## UI v0.6.4 / v1.00_b027 — 2026-08-25

- Replaced the flat illustrated hero room with a warm photorealistic living-room background prepared specifically for the mobile overview composition.
- Kept the room bitmap free of the router, connection lines, labels and telemetry so every live UI element remains an independent layer.
- Optimized the new local 820×820 WebP background to approximately 33 KB; no external image dependency or Base64 payload was introduced.
- Preserved the accepted UI v0.6.3 geometry, transparent router layer, WAN/LTE semantics, fast bootstrap and autonomous production bundle.

## UI v0.6.3 / v1.00_b026 — 2026-08-25

- Aligned the live iPhone overview with the accepted target composition without changing read-only WAN/LTE semantics.
- Removed duplicate top and bottom safe-area padding inside the Home Assistant-hosted app shell; Header and Bottom Tab Bar now consume the safe area exactly once.
- Restored the accepted warm room background and added a transparent, photorealistic 53 KB WebP router layer while keeping all artwork local to the integration.
- Restored the target mobile rhythm: 10 px content rails, compact Header, 438 px hero, larger KPI tiles and LTE reserve strip.
- Rebuilt the live topology with separate LTE, Cable and LAN cards: Cable/LAN use a solid green active path, LTE reserve uses animated blue dots, and no inactive grey branch is rendered.
- Kept factual naming: the status sentence reports `Ethernet`, the topology uses the operational label `Кабель`, and the channel detail remains `Кабель (Ethernet)`.
- Preserved the b019 fast bootstrap, cached role mapping, five-second background WebSocket timeout and self-contained frontend bundle.

## UI v0.4.4 / v1.00_b018 — 2026-08-24

- Restored the mandatory NikaS specialized-panel Header contract: explicit `← Назад` on the left, `Keenetic Hero 4G+` geometrically centered, and one global Refresh action on the right.
- Back now explicitly navigates to `/dashboard-infrastructure/overview`; the integration-owned Header no longer substitutes the Home Assistant hamburger menu for the application Back action.
- Made Header side rails symmetric: 84 px on the iPhone Pro Max target viewport and 52 px on <=390 px layouts; the `Назад` label hides only on the narrower layout while the arrow remains.
- Preserved >=44 px touch targets for Back/Refresh and 56 px primary Bottom Tab Bar buttons.
- Hardened mobile horizontal fit: shell, Header, scroll content and Bottom Tab Bar are constrained to the viewport with no horizontal scrolling; the five bottom navigation items use equal-width tracks.
- Kept the Bottom Tab Bar full-width, edge-attached, safe-area aware and outside the vertical scroll region.
- Restored the mandatory self-contained production frontend delivery: Home Assistant now registers `keenetic-panel-bundle.js?v=0.4.4` and `keenetic-hero-app-panel-v044`; previous UI modules are build-time inputs only and are not runtime dependencies.
- Rebuilt the current v0.4.x dependency graph into one autonomous JS artifact with embedded panel CSS; production bundle CI rejects runtime imports and external panel stylesheet loading.
- Traffic remains in stabilization mode without `24 ч / 7 дн / 30 дн` Recorder history; Failover Recorder history also remains disabled. WAN/LTE, ping/loss, failover telemetry and read-only router semantics are unchanged.

## v1.00_b010 — 2026-08-23

- Reordered Home Assistant startup so integration-owned sensor/binary-sensor entities are registered before the Keenetic panel bootstrap is built.
- The stable `/dashboard-keenetic` route is still registered before the first physical-router RCI refresh, so panel existence remains independent of router availability.
- Fixed a startup race where `bootstrap_fallback` could be created before new b009 traffic entities existed in the Entity Registry, causing the panel to keep Template/SNMP role mappings instead of the new RCI-owned traffic entities.
- Added regression coverage that locks the required order: `runtime_data -> entity platforms -> panel registration -> non-fatal RCI refresh`.
- UI remains v0.3.0; no traffic calculation, WAN/failover or RCI endpoint semantics changed.

## v1.00_b009 — 2026-08-23

- Added optional RCI interface-statistics polling through `/rci/show/interface/stat?name=<interface>` for `GigabitEthernet1` and `UsbLte0`.
- Added integration-owned Ethernet and LTE RX/TX rate sensors from factual `rxspeed` / `txspeed` values, converted from bit/s to Mbit/s.
- Added integration-owned cumulative Ethernet and LTE RX/TX counters from factual `rxbytes` / `txbytes`, converted to GiB; existing LTE `_gb` entity-key suffixes are preserved for panel compatibility while the unit is GiB.
- Added integration-owned Active WAN RX/TX sensors that follow the factual `active_wan` state rather than Lovelace/template inference.
- Interface statistics are optional telemetry: HTTP/RCI errors or unsupported stats payloads remain unknown and do not make the base coordinator unavailable.
- Factual zero traffic remains `0`; missing or malformed values remain unknown and are never manufactured as zero.
- Added pure regression coverage for rate/counter conversion, Active-WAN selection and RCI error payload handling.
- The existing panel role resolver automatically prefers these new integration-owned entities; daily/monthly traffic totals remain on the legacy utility-meter fallback for now.
- UI remains on v0.3.0; WAN/LTE/failover semantics are unchanged.

## v1.00_b008 — 2026-08-23

- Fixed a fatal `binary_sensor.py` import regression that prevented the Keenetic Config Entry from loading: `KeeneticBinarySensor` inherited from `KeeneticEntity`, but the `KeeneticEntity` import had been removed during WAN-contract refactoring.
- The observed Home Assistant failure was `NameError: name 'KeeneticEntity' is not defined`, followed by `ImportError: Exception importing custom_components.keenetic_hero_4g.binary_sensor` and `Error setting up entry Keenetic-5027`.
- Restored the missing `from .entity import KeeneticEntity` import.
- Added an AST regression test that rejects unbound names used as module-level class bases, covering this class of import-time failure that `compileall` alone cannot detect.
- Preserved the b007 startup lifecycle fix: `/dashboard-keenetic` is registered before the first non-fatal RCI refresh, and UI remains on v0.3.0.
- No WAN/LTE/failover telemetry semantics were changed in this build.

## v1.00_b007 — 2026-08-23

- Decoupled the Keenetic panel lifecycle from physical router availability during Home Assistant startup.
- `runtime_data` and the stable `/dashboard-keenetic` panel are now published before the first RCI poll.
- Replaced startup `async_config_entry_first_refresh()` with a non-fatal `async_refresh()` so a transient RCI failure no longer sends the whole Config Entry into retry before panel registration.
- Added a fail-closed empty coordinator snapshot before the first poll; the panel remains present and reports unavailable/unknown telemetry until real data arrives.
- Normal coordinator retries continue on the configured polling cadence after an initial failure.
- Added a regression test that locks the startup order and forbids first-refresh-gated panel registration.
- UI remains on the last known working v0.3.0 runtime from b006; WAN/LTE/failover behavior from b005 is unchanged.

## v1.00_b006 — 2026-08-23

- Rolled the integration-owned Keenetic panel runtime back from UI v0.3.1 to the last known working UI v0.3.0 after the v0.3.1 update caused `/dashboard-keenetic` to disappear from the Home Assistant sidebar on the target installation.
- Restored `panel_v030` as the registered runtime panel component and restored the v0.3.0 machine-readable panel contract.
- Kept all accepted `v1.00_b005` backend work intact: shared WAN/failover semantics, Ethernet/LTE diagnostics, regression tests and live KN-2311 acceptance remain unchanged.
- This is a conservative frontend rollback only; no RCI, WAN, LTE, failover or entity behavior is reverted.

## v1.00_b005 — 2026-08-22

- Unified Ethernet/LTE link-state, route and failover semantics in a shared pure backend contract module (`wan.py`).
- Made the coordinator/failover logic and connectivity binary sensors use the same factual state normalization, including `connected` / `ready` / `disconnected` variants returned by Keenetic.
- Preserved fail-closed behavior: missing, partial or ambiguous telemetry remains unknown and is never converted into a healthy WAN state.
- Added automated regression coverage for Ethernet active, LTE active, default-route selection, rejecting/ambiguous routes, partial telemetry and failover reasons.
- Added the WAN contract tests to the repository CI gate; Repository checks, Hassfest and HACS validation passed before release preparation.
- Completed live hardware acceptance on the target Keenetic Hero 4G+ KN-2311 by physically removing and restoring the Ethernet WAN cable.
- Confirmed `Ethernet -> LTE` failover with Internet remaining online, factual Ethernet-down state, active LTE, direct RCI LTE ping and `0.0%` packet loss, switch counter increment and LTE active-time accumulation.
- Confirmed `LTE -> Ethernet` recovery with `ethernet_restored` reason, Ethernet ping `216.84 ms`, Ethernet packet loss `0.0%`, LTE ping still measurable in reserve (`217.15 ms`) and the daily switch counter reaching 2.
- Confirmed that an explicitly down Ethernet path exposes unavailable/unknown diagnostics instead of fabricated `0 ms` / `0%` values.
- This build is a backend reliability/acceptance release. No new integration-owned panel features are added; generated panel ownership is being migrated separately to `ha-contract-generated-ui`.

## Native panel v0.3.1 / v1.00_b004 — 2026-08-22

- Adopted **NikaS Integration Panel Template v1.0** for the Keenetic specialized panel shell.
- Standardized Header geometry to symmetric `52px | minmax(0,1fr) | 52px`; <=390 px uses symmetric 48 px side rails.
- Removed Header Back text; the left control is now icon-only `mdi:arrow-left` with an explicit parent navigation contract.
- Kept one global Refresh action in the symmetric right Header rail.
- Standardized center title/subtitle as `Keenetic Hero 4G+` and `Network Control Center · UI v0.3.1`.
- Standardized common card rhythm to approximately 22 px radius, 16 px padding and 14 px vertical gaps with minimal shadow.
- Hardened mobile horizontal fit: panel content is constrained to the viewport with no horizontal scroll.
- Kept the Bottom Tab Bar full-width, edge-attached, safe-area aware and outside the scroll region; five equal navigation cells remain `Обзор / WAN-LTE / Failover / Трафик / Диагн.`.
- Desktop content is capped at 1280 px while preserving the mobile information hierarchy.
- Traffic remains in v0.3.0 stabilization mode: Recorder-backed `24 ч / 7 дн / 30 дн` history stays disabled.
- Self-contained production frontend bundle delivery is preserved.

## Native panel v0.3.0 — 2026-08-22

- Stabilization release focused on getting the specialized Keenetic panel reliably usable before restoring Recorder-backed traffic history.
- Removed the `24 ч / 7 дн / 30 дн` period selector from the Traffic screen.
- Disabled all Recorder traffic-history requests from the Traffic screen; current RX/TX and accumulated counters remain available from factual Home Assistant entities.
- Added cold-start property replay for `panel`, `hass`, and `route` to handle Home Assistant/iOS cases where properties are assigned before custom-element upgrade.
- Applied bootstrap timeout/fallback handling to the actual child `keenetic-hero-panel` component instead of the outer app shell.
- Added a new frontend component id `keenetic-hero-app-panel-v030` and cache-busting UI version `0.3.0`.
- Preserved the self-contained production frontend bundle architecture introduced in v0.2.9.
- WAN/LTE, failover, diagnostics, Back navigation, bottom Tab Bar, read-only behavior, and `unknown` / `unavailable` semantics are unchanged.

## Native panel v0.2.9 / v1.00_b003 — 2026-08-22

- Replaced the runtime chain of versioned Keenetic frontend modules with one autonomous production bundle: `keenetic-panel-bundle.js`.
- Inlined `keenetic-panel.css` into the generated JavaScript artifact so the specialized panel has one production frontend loading point.
- Registered the v0.2.9 shell from the self-contained bundle with query-string cache busting.
- Added deterministic build tooling and CI guards that reject runtime `import` / `export` dependencies and verify the committed bundle against a clean rebuild.
- Historical `keenetic-app-v0xx.js`, base panel source and CSS remain development/build inputs only; they are not production runtime dependencies.
- Preserved the accepted panel UX, explicit Back route, full-width fixed Bottom Tab Bar, bootstrap fallback, read-only behavior and strict `unknown` / `unavailable` semantics.
- This is a frontend loading-architecture hardening release; RCI, ping, failover and telemetry semantics are unchanged.

## Native panel v0.2.1 — draft

- Aligned the Keenetic panel with Home Assistant NikaS specialized-panel UI standard v1.1.
- Replaced the floating bottom navigation geometry with a **full-width, edge-attached fixed Tab Bar** on the iPhone viewport.
- Removed external side/bottom gaps from primary navigation and kept active-tab highlighting inside the shared bar.
- Increased primary navigation touch targets to 56 px and retained iOS safe-area padding.
- Increased content bottom clearance so the final card scrolls completely above the Tab Bar.
- Kept the existing five primary sections, explicit Back route, read-only behavior and `unknown` / `unavailable` semantics unchanged.

## Native panel v0.2.0 — draft

- Adopted the common Home Assistant NikaS specialized-panel app shell.
- Added persistent top header with explicit `← Назад`, centered `Keenetic Hero 4G+`, and global Refresh action.
- Back now navigates deterministically to `/dashboard-infrastructure/overview`; browser-history semantics are not used.
- Standardized 44+ px header touch targets and kept header free of device actions on hold/double tap.
- Standardized fixed five-item bottom navigation: Overview / WAN-LTE / Failover / Traffic / Diagnostics.
- Removed System from primary navigation; it remains a secondary drill-down from Diagnostics.
- Kept primary content immediately below the header with no top-tab navigation row.
- Extended machine-readable panel contract with parent route, app-shell metadata, primary/secondary view roles and navigation constraints.
- Extended iPhone Pro Max acceptance tests with Back/deep-link, long-scroll and bottom-safe-area gates.
- Panel remains read-only and preserves strict `unknown` / `unavailable` semantics.

## Native panel v0.1.0 — draft

- Added integration-owned Home Assistant panel with stable route `/dashboard-keenetic`.
- Added mobile-first Network Control Center layout for iPhone Pro Max portrait.
- Added Overview, WAN/LTE, Traffic, Failover, System and Diagnostics views.
- Added compact functional Internet -> Ethernet/LTE -> Keenetic topology on Overview.
- Added explicit telemetry-trust semantics: stale/failed RCI data is not treated as a WAN failure.
- Added strict `unknown` / `unavailable` handling; missing ping/loss is never rendered as zero.
- Added human-readable LTE signal assessment while preserving factual RSSI/RSRP/RSRQ/SINR values.
- Added Recorder-backed traffic charts and Active-WAN transition history when historical data exists.
- Added long-press Home Assistant more-info support for factual entity metrics.
- Added authenticated panel bootstrap WebSocket API and entity-role resolution by config-entry ownership plus stable unique-id suffix.
- Added transitional factual mapping for existing NikaS SNMP/template/utility-meter/NDMS2/external-probe sources; integration-owned RCI entities always take precedence.
- Added machine-readable panel/generated-UI navigation contract and panel acceptance tests.
- Added JavaScript syntax validation to repository CI.
- Panel remains read-only and performs no direct browser-side RCI/SNMP/shell access.
- Live iPhone/KN-2311 acceptance scenarios and screenshots are required before this panel is merged into an integration release.

## v1.00_b002 — 2026-08-22

- Added factual active WAN detection from Keenetic route/interface state.
- Supports VPN-default-route installations by identifying the public /32 transport route carried by `GigabitEthernet1` or `UsbLte0`; no Lovelace traffic inference is used.
- Added Ethernet and LTE average ping sensors.
- Added Ethernet and LTE packet-loss sensors.
- Added persistent last WAN switch timestamp.
- Added conservative last-switch reason states: Ethernet link down, Ethernet restored, or route changed when the root cause cannot be proven.
- Added WAN switch count for the current day.
- Added cumulative LTE active time for the current day.
- Diagnostic ICMP runs on a slower 60-second cadence and cannot make the base telemetry coordinator unavailable.
- Added English custom-integration translations and state translations for WAN/failover enum sensors.
- Integration remains read-only; VPN/WAN/LTE control is still out of scope.
- Live failover validation confirmed Ethernet -> LTE -> Ethernet tracking, switch count, switch timestamp, `ethernet_link_down`, and `ethernet_restored` reasons on the target KN-2311.
- Ethernet connectivity/IP/link speed correctly become unavailable when the cable is removed; LTE remains connected and changes to factual 4G+ carrier aggregation.
- Hardened diagnostic ping collection after live validation: first diagnostics run immediately, explicitly down interfaces are skipped, probe count is three, and packet loss is only published from the router's factual packet summary.
- Replaced the experimental Web CLI Parse transport with Keenetic's command-specific RCI background resource `/rci/tools/ping`: POST starts the process and GET polls the same resource while `continued` is true. The diagnostic is bound to the authenticated HTTP session, matching RCI background-process semantics.
- Source-interface probing is sent as the factual `source` parameter (`GigabitEthernet1` / `UsbLte0`).
- Added timeout cleanup for RCI background diagnostics using DELETE; diagnostic failures remain isolated from normal telemetry.
- Completed Russian labels for Ethernet/LTE ping, packet loss and LTE EARFCN.
- Final live validation of the direct `/rci/tools/ping` transport is still required before merge.

## v1.00_b001 — 2026-08-21

- Added first installable Home Assistant custom integration under `custom_components/keenetic_hero_4g`.
- Added Config Flow and local Keenetic `x-ndw2-interactive` challenge-response authentication.
- Added RCI polling coordinator.
- Added system CPU/RAM/firmware telemetry.
- Added Ethernet WAN IPv4, link speed, uptime and connectivity entities.
- Added LTE operator/network/band/carrier/cell/modem/SIM telemetry from factual RCI fields.
- Added Russian UI translation.
- Added HACS metadata.
- Added project icon using a router + radio-link visual.
- Kept the integration read-only; failover accounting and active probing are deferred to `b002`.
- Live-tested Config Flow and RCI polling on Home Assistant 2026.8.2 with Keenetic Hero 4G+ KN-2311.
- Corrected LTE modem model selection to prefer the factual Quectel product/ATI model over Keenetic's numeric modem type code.
- Refined Ethernet/LTE connectivity entity names for cleaner Home Assistant UI state rendering.
