# Native panel acceptance tests

Panel: Keenetic Hero 4G+  
Panel version: 0.1.0  
Target device: KN-2311  
Primary viewport: iPhone Pro Max portrait (control viewport 430 × 932 CSS px)

## General UI gate

For every scenario:

- no horizontal scrolling;
- Home Assistant header/safe areas do not cover controls;
- top operational block remains readable before deep scrolling;
- all factual entity metrics support long-press -> native more-info;
- no browser-side RCI/SNMP write requests are made;
- no missing value is rendered as zero;
- switching views does not require a page reload;
- `/dashboard-keenetic` remains the stable entry route.

## A. Normal operation — Ethernet active, LTE standby

Precondition: Ethernet is the active route; LTE is connected/ready as reserve.

Expected:

- Internet: Online when the independent probe is online;
- Active WAN: Ethernet;
- Ethernet: connected/active;
- LTE: ready/reserve, not shown as an Internet outage merely because it is not active;
- current Ethernet RX/TX shown when available;
- LTE radio values remain visible;
- last failover information is factual or unknown;
- telemetry trust is green only while RCI data is fresh.

## B. Primary WAN failure — Ethernet -> LTE

Precondition: disconnect/fail primary Ethernet WAN and allow Keenetic failover.

Expected:

- Internet stays Online if LTE provides connectivity;
- Active WAN changes to LTE;
- Ethernet becomes factually down only when router/interface data proves it;
- LTE becomes Active;
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
- no mobile-only control becomes inaccessible.

## Release gate

The panel is accepted only when scenarios A-F pass on the real KN-2311 and the Overview is faster to interpret for WAN/LTE/failover than the previous sensor-list detail page. Live screenshots must be captured after this hardware acceptance; design-reference screenshots are not a substitute for the release evidence.
