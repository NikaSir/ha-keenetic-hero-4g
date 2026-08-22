# Native panel acceptance tests

Panel: Keenetic Hero 4G+  
Panel version: 0.2.7  
Target device: KN-2311  
Primary viewport: iPhone Pro Max portrait (control viewport 430 × 932 CSS px)

## General UI gate

For every scenario:

- no horizontal scrolling;
- Header is present on every primary view;
- Back explicitly navigates to `/dashboard-infrastructure/overview`, never browser history;
- title is geometrically centered against the viewport;
- no decorative router/brand icon appears beside the Header title;
- Back and Refresh have >= 44 px touch targets;
- no primary top-tab row is present;
- primary Tab Bar remains available during vertical scrolling;
- Tab Bar is full-width, edge-attached and outside the scroll region;
- Tab Bar has no floating side/bottom gap;
- active tab is highlighted inside the common bar;
- bottom navigation order is Overview / WAN-LTE / Failover / Traffic / Diagnostics;
- System is a secondary drill-down;
- Tab Bar never covers the final content row;
- factual entity metrics support long-press -> native more-info;
- Header, contextual selectors and Bottom Tab Bar never invoke entity-specific actions;
- no browser-side RCI/SNMP write requests are made;
- no missing value is rendered as zero;
- `/dashboard-keenetic` remains the stable entry route;
- a panel upgrade must display the current UI version and must not retain an older registered web component.

## A. Normal operation — Ethernet active, LTE standby

Expected:

- Internet: Online when the independent probe is online;
- Active WAN: Ethernet;
- network topology remains visible at the top of Overview;
- `Провод` is selected by default below the topology;
- factual active-route indication identifies Ethernet;
- only the Ethernet detail card is shown below the selector;
- LTE reserve state remains visible in the topology and selector;
- user can select LTE for inspection without changing router state;
- factual Ethernet/LTE ping and loss are shown when available;
- telemetry trust is green only while RCI data is fresh.

## B. Primary WAN failure — Ethernet -> LTE

Expected:

- Internet stays Online if LTE provides connectivity;
- Active WAN changes to LTE;
- Ethernet becomes down only when factual router/interface data proves it;
- LTE becomes Active;
- after a fresh/opened Overview context, `LTE` is selected by default;
- LTE-only ping/loss remains factual after failover;
- last-switch time updates;
- direction is Ethernet -> LTE;
- reason is integration-provided or Unknown;
- switches-today increments;
- LTE time today increases.

## C. Primary WAN restored — LTE -> Ethernet

Expected:

- Active WAN returns to Ethernet;
- LTE returns to reserve-ready state;
- after a fresh/opened Overview context, `Провод` is selected by default;
- direction is LTE -> Ethernet;
- reason shows Ethernet restored only when factual;
- Internet remains Online through the transition when connectivity is preserved.

## D. LTE radio degradation

Expected:

- human quality label degrades according to the documented panel heuristic;
- raw RSSI/RSRP/RSRQ/SINR remain visible;
- poor LTE quality does not automatically mark Ethernet or total Internet down;
- missing radio inputs never become zero.

## E. Ping/loss unavailable

Expected:

- value is `Нет данных` / `Неизвестно`;
- never `0 ms` or `0%` as fallback;
- channel connectivity is still determined from factual WAN state.

## F. Keenetic/router telemetry unavailable

Expected:

- telemetry banner marks data untrusted/unavailable;
- Ethernet/LTE remain `Состояние неизвестно` unless another still-fresh factual source proves state;
- UI must not claim Ethernet failure merely because Keenetic cannot update;
- independent Internet probe may still show its own factual state;
- technical Diagnostics exposes unavailable/stale source data.

## Additional regression tests

### G. Restart Home Assistant

- panel registers automatically after config entry load;
- route and sidebar entry are present without Lovelace YAML;
- existing credentials/config entry remain intact;
- no duplicate entities are created.

### H. Entity ID renamed by user

- panel still resolves the role through entity registry unique-id/config-entry ownership;
- more-info opens the renamed entity.

### I. Recorder unavailable / no long-term statistics

- Overview and WAN continue to work;
- Traffic/Failover show factual no-history states instead of fake data.

### J. iPad / desktop

- information hierarchy remains unchanged;
- network topology stays above the contextual selector;
- app header and bottom navigation keep the same semantics.

### K. Deep-link/back contract

Open `/dashboard-keenetic` directly from a fresh app/browser session.

- Back still navigates to `/dashboard-infrastructure/overview`;
- browser history is irrelevant.

### L. Long-scroll navigation

On Traffic or Diagnostics:

- Tab Bar remains a dedicated bottom app-shell row;
- it never covers the scroll region;
- final content row can be read completely.

### M. Frontend cache / component upgrade

Install an older candidate then update without clearing iOS cache.

- header reports the new UI version;
- new navigation/selector geometry loads;
- old custom-element implementation is not reused.

### N. Overview channel selector

With Ethernet active and LTE reserve connected:

- topology remains visible above the selector;
- selector is `Провод | LTE`;
- selector is contextual and is not a Device Selector;
- `Провод` is selected by default from factual `active_wan`;
- only Ethernet detail is shown below it;
- selecting LTE keeps Overview open and replaces Ethernet detail with LTE detail;
- factual active-route indication still identifies Ethernet while LTE is inspected;
- selector never performs router control.

With LTE active:

- a fresh/opened Overview defaults to LTE;
- only LTE detail is shown initially;
- Ethernet may still be inspected manually.

With Active WAN unknown:

- neither channel is silently chosen as active/default;
- the UI asks for a diagnostic selection without claiming which WAN is active.

### O. WAN/LTE detail selector

- `Провод | LTE` remains contextual inside the WAN/LTE primary screen;
- only one detailed transport is visible at a time;
- switching segments does not change Back semantics or execute router control.

### P. Traffic period symmetry and non-blocking behavior

Open Traffic and exercise both directions:

- `24 ч -> 7 дн -> 30 дн` refreshes statistics for each selected range;
- `30 дн -> 7 дн -> 24 ч` also refreshes each selected range;
- returning to a previously viewed shorter period must not silently reuse a stale lifetime cache;
- the selected button, chart data and max scale belong to the same period;
- rapid period changes may leave older requests in flight, but a late response must not replace the loading/error state of the currently selected period;
- the UI must never remain indefinitely in `Загрузка истории…`;
- UI wait limits are finite: approximately 6 s for 24 h, 8 s for 7 d, 10 s for 30 d;
- after a timeout, Traffic remains interactive and the user can immediately select another period;
- a timeout is shown as an explicit Recorder/history error rather than a frozen panel;
- no period selection changes the traffic source entities or fabricates missing history.

## Release gate

The panel is accepted only when scenarios A-F plus app-shell, cache, selector and traffic-period gates pass on the real KN-2311. Final iPhone Pro Max screenshots must demonstrate the accepted layout and failover behavior.
