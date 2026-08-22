# Native panel acceptance tests

Panel: Keenetic Hero 4G+  
Panel version: 0.2.2  
Target device: KN-2311  
Primary viewport: iPhone Pro Max portrait (control viewport 430 × 932 CSS px)

## General UI gate

For every scenario:

- no horizontal scrolling;
- Home Assistant header/safe areas do not cover controls;
- unified app header is present on every primary view;
- Back is explicit and navigates to `/dashboard-infrastructure/overview`, never browser history;
- Back and Refresh have >= 44 px touch targets;
- hold/double tap on header controls does not execute router/device actions;
- top operational block remains readable immediately below the header;
- no primary top-tab row is present;
- primary Tab Bar remains available during vertical scrolling;
- Tab Bar is **full-width and edge-attached** on the iPhone viewport;
- Tab Bar is a separate app-shell row outside the scroll region, not a fixed/floating card over content;
- Tab Bar has no external side/bottom gap;
- active tab remains highlighted inside the common Tab Bar rather than visually detached from it;
- bottom navigation order is Overview / WAN-LTE / Failover / Traffic / Diagnostics;
- System is secondary drill-down, not a sixth primary tab;
- Tab Bar never covers working content or the final content row;
- all factual entity metrics support long-press -> native more-info;
- header and bottom navigation never invoke entity-specific more-info;
- no browser-side RCI/SNMP write requests are made;
- no missing value is rendered as zero;
- switching views does not require a page reload;
- `/dashboard-keenetic` remains the stable entry route;
- a panel upgrade must display the current UI version and must not retain an older registered web component from the iOS/HA frontend cache.

## A. Normal operation — Ethernet active, LTE standby

Precondition: Ethernet is the active route; LTE is connected/ready as reserve.

Expected:

- Internet: Online when the independent probe is online;
- Active WAN: Ethernet;
- Ethernet: connected/active;
- LTE: ready/reserve, not shown as an Internet outage merely because it is not active;
- current Ethernet RX/TX shown when available;
- factual Ethernet ping/loss shown when available;
- factual LTE ping/loss shown when available; standby LTE diagnostics must not be fabricated;
- LTE radio values remain visible;
- last failover information is factual or unknown;
- telemetry trust is green only while RCI data is fresh.

Live RC2 observation on 2026-08-22: panel registration and `/dashboard-keenetic` succeeded; Ethernet active + LTE reserve were displayed; RCI Ethernet ping/loss and LTE ping/loss produced factual non-unknown values. LTE-only source-interface validation is still required.

## B. Primary WAN failure — Ethernet -> LTE

Precondition: disconnect/fail primary Ethernet WAN and allow Keenetic failover.

Expected:

- Internet stays Online if LTE provides connectivity;
- Active WAN changes to LTE;
- Ethernet becomes factually down only when router/interface data proves it;
- LTE becomes Active;
- LTE-only ping/loss remains factual after failover;
- last-switch time updates;
- direction is Ethernet -> LTE;
- reason is the integration-provided reason, otherwise Unknown;
- switches-today increments;
- LTE time today starts/increases.

## C. Primary WAN restored — LTE -> Ethernet

Expected:

- Active WAN returns to Ethernet;
- LTE returns to reserve-ready state;
- direction is LTE -> Ethernet;
- reason shows Ethernet restored only when the integration reports that factual state;
- Internet remains Online through the transition when connectivity is preserved.

## D. LTE radio degradation

Method: test with a factual period of lower RSRP/RSRQ/SINR; do not inject production values.

Expected:

- human quality label degrades according to the documented panel heuristic;
- raw RSSI/RSRP/RSRQ/SINR remain visible and unchanged by the UI;
- poor LTE quality does not automatically mark Ethernet or total Internet down;
- missing one radio input does not become zero.

## E. Ping/loss unavailable

Precondition: the Ethernet and/or LTE ping/loss entity is `unknown` or `unavailable`.

Expected:

- value: `Нет данных` / `Неизвестно`;
- never `0 ms` or `0%` as a fallback;
- channel connectivity is still determined from factual WAN state, not from missing ping.

## F. Keenetic/router telemetry unavailable

Precondition: make the router RCI endpoint unreachable from Home Assistant without using the WAN state as a proxy.

Expected:

- telemetry banner: untrusted/unavailable;
- Ethernet/LTE channel state is `Состояние неизвестно` unless a still-fresh factual source proves a state;
- UI must **not** claim `Ethernet отсутствует` merely because the Keenetic integration cannot update;
- independent Internet probe may still display its own factual state and source;
- technical Diagnostics exposes unavailable/stale source data.

## Additional regression tests

### G. Restart Home Assistant

- panel registers automatically after the config entry loads;
- existing config entry/credentials remain intact;
- route is present without YAML panel configuration;
- sidebar entry is registered;
- panel does not create duplicate entities.

### H. Entity ID renamed by user

Rename one integration-owned entity through Home Assistant.

- panel still resolves the role through entity registry unique-id/config-entry ownership;
- more-info opens the renamed entity.

### I. Recorder unavailable / no long-term statistics

- Overview and WAN screens continue to work;
- Traffic/Failover show a factual `Нет исторических данных` state instead of a fake chart/log.

### J. iPad / desktop

- information hierarchy is unchanged;
- cards expand to multi-column layout;
- app header and bottom navigation keep the same semantics;
- no mobile-only control becomes inaccessible.

### K. Deep-link/back contract

Open `/dashboard-keenetic` directly from a fresh browser/app session.

- Back still navigates to `/dashboard-infrastructure/overview`;
- it does not depend on prior browser navigation history.

### L. Long-scroll navigation

On Traffic or Diagnostics, scroll to the bottom of a long page.

- Tab Bar remains visible as a dedicated bottom app-shell row;
- it does not float above or cover the scroll region;
- last content row can be read completely without moving behind navigation;
- header remains logically consistent;
- switching tabs is possible one-handed without returning to page top.

### M. Frontend cache / component upgrade

Install an older panel candidate, then update to the next candidate and restart Home Assistant without manually clearing the iOS app cache.

- header reports the new UI version;
- new navigation geometry is loaded;
- old custom-element implementation is not reused;
- module URL and web-component name change when required to break stale frontend registration.

## Release gate

The panel is accepted only when scenarios A-F plus the app-shell navigation gates pass on the real KN-2311 and the Overview is faster to interpret for WAN/LTE/failover than the previous sensor-list detail page. Live iPhone Pro Max screenshots must be captured after hardware acceptance; design-reference screenshots are not a substitute for release evidence.
