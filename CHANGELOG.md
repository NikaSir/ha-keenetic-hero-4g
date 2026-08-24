# Changelog

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
