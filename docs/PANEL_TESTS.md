# Native panel acceptance tests

Panel: Keenetic Hero 4G+  
Panel version: 0.3.1  
Integration build: 1.0.0-b004  
Template: NikaS Integration Panel Template v1.0  
Target device: KN-2311  
Primary viewport: iPhone Pro Max portrait (control viewport 430 × 932 CSS px)

## 1. App-shell / viewport gate

At 430 × 932 CSS px:

- no horizontal scrolling anywhere in the specialized panel;
- Header grid is `52px | minmax(0,1fr) | 52px`;
- left Header control is icon-only `mdi:arrow-left`; text `Назад` is not rendered;
- right Header control is one Refresh action;
- Back and Refresh touch targets are at least 44 × 44 px;
- title `Keenetic Hero 4G+` is geometrically centered against the viewport;
- subtitle is `Network Control Center · UI v0.3.1` and remains on one line or ellipsizes inside the center rail without moving the title;
- on <=390 px width Header rails become symmetric 48 px rails;
- Header never uses browser history for Back; Back navigates explicitly to `/dashboard-infrastructure/overview`;
- Bottom Tab Bar is full-width, edge-attached, outside the vertical scroll region and safe-area aware;
- Bottom Tab Bar order is `Обзор / WAN-LTE / Failover / Трафик / Диагн.`;
- each Bottom Tab Bar item has at least a 44 px touch target;
- active tab uses primary icon/text plus a light primary surface;
- no floating outer side/bottom gap exists around the Tab Bar;
- final content can scroll completely above the Tab Bar;
- mobile primary content is one-column at the screen level;
- cards use the common NikaS rhythm: radius about 22 px, padding 16 px, vertical gap about 14 px;
- desktop content does not grow beyond 1280 px and preserves the same information hierarchy.

## 2. Loading / bootstrap gate

- shell Header and Bottom Tab Bar remain present during loading;
- panel never remains indefinitely on a blank `Загрузка Keenetic…` state;
- registration bootstrap fallback is used when the live bootstrap WebSocket is delayed;
- bootstrap WebSocket has an approximately 5 second UI timeout;
- fallback excludes host and integration unique-id;
- later successful bootstrap refresh replaces fallback data;
- no fake healthy values are created from missing telemetry.

## 3. Overview — Ethernet active, LTE standby

Expected:

- Hero answers Internet state and factual active WAN first;
- compact network topology remains above the contextual channel selector;
- `Провод | LTE` is contextual inspection, not a Device Selector and never performs router control;
- `Провод` is selected initially when factual `active_wan` is Ethernet;
- only the selected channel detail is shown below the selector;
- LTE reserve state stays visible in topology/selector;
- missing/unknown values remain `Неизвестно` / `Нет данных`, never fabricated zero.

## 4. Failover — Ethernet -> LTE -> Ethernet

Expected:

- Ethernet failure changes active WAN to LTE only from factual router state;
- LTE becomes active and Overview defaults to LTE on a fresh/opened context;
- last switch timestamp, direction, factual reason, switches today and LTE time today update;
- recovery returns active WAN to Ethernet and LTE to reserve-ready;
- router/telemetry loss alone never proves Ethernet failure.

## 5. WAN/LTE screen

- selector is `Провод | LTE`;
- only one detailed transport is visible at a time;
- Ethernet and LTE raw metrics remain available;
- contextual selector does not alter Header Back semantics;
- long press on factual entity-backed values opens native Home Assistant more-info.

## 6. Traffic stabilization mode

For UI v0.3.1:

- `24 ч / 7 дн / 30 дн` controls are absent;
- Traffic screen makes no Recorder traffic-history request;
- current Ethernet/LTE RX/TX remain visible;
- daily/monthly factual counters remain visible where available;
- accumulated Ethernet/LTE counters remain visible;
- Traffic screen cannot block the entire app shell;
- Recorder-backed charts are explicitly deferred to a separate future change.

## 7. Diagnostics / trust semantics

- `unknown` / `unavailable` are never rendered as normal/OK/zero;
- stale or failed RCI telemetry is visibly distinguished from actual WAN down;
- Diagnostics exposes factual source type and entity state;
- technical LTE radio values remain available without overloading Overview.

## 8. Frontend production bundle

- Home Assistant `module_url` points to one self-contained `keenetic-panel-bundle.js`;
- production frontend contains no runtime import/export dependency on previous UI versions;
- panel CSS is embedded in the production bundle;
- `node --check` passes for the generated bundle;
- cold-cache local load works;
- cold-cache Home Assistant Cloud / Nabu Casa load works;
- first open after full Home Assistant restart works;
- repeated open/close works;
- no `Unable to load custom panel`;
- no `Configuration error`.

## Release gate

UI v0.3.1 is accepted only after the app-shell/viewport, bootstrap, Overview, WAN/LTE, Traffic stabilization and cold-load gates pass on the real iPhone Pro Max / KN-2311 environment.
