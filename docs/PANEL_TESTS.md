# Native panel acceptance tests

Panel: Keenetic Hero 4G+  
Panel version: 0.4.4  
Integration build: 1.0.0-b018  
Standard: Home Assistant NikaS specialized panel UI v1.2  
Target device: KN-2311  
Primary viewport: iPhone Pro Max portrait (430 × 932 CSS px)

## 1. App-shell / viewport gate

At 430 × 932 CSS px:

- no horizontal scrolling anywhere in the specialized panel;
- Header has three semantic zones: explicit Back / centered title / Refresh;
- Header side rails are symmetric `84px | minmax(0,1fr) | 84px` so the title is geometrically centered against the viewport, not merely centered between unequal buttons;
- left Header control is `mdi:arrow-left` + `Назад` and explicitly navigates to `/dashboard-infrastructure/overview`;
- browser history is never used as the Back contract;
- right Header control is one global Refresh action;
- Back and Refresh touch targets are at least 44 × 44 px;
- title `Keenetic Hero 4G+` remains on one line or ellipsizes inside the center rail without moving the center point;
- subtitle is `Network Control Center · UI v0.4.4` and remains secondary;
- at <=390 px the Header switches to symmetric 52 px rails and hides only the Back text while preserving the arrow and explicit navigation;
- Header, app shell and content are constrained to `width/max-width: 100%` with horizontal overflow suppressed;
- Bottom Tab Bar is full-width, edge-attached, outside the vertical scroll region and safe-area aware;
- Bottom Tab Bar contains exactly five equal-width cells: `Обзор / Каналы / Failover / Трафик / Диагн.`;
- each Bottom Tab Bar item has at least a 44 px touch target; preferred button height is 56 px;
- active tab uses accent icon/text plus a light accent surface inside the common bar;
- no floating outer side/bottom gap exists around the Tab Bar;
- at 430 px and 390 px each tab label stays inside its equal track; truncation may only occur as ellipsis inside the cell, never by horizontal page overflow;
- final content can scroll completely above the Tab Bar;
- iOS bottom safe area is added below Tab Bar content rather than overlapping it.

## 2. Loading / bootstrap gate

- shell Header and Bottom Tab Bar remain present during loading;
- panel never remains indefinitely on a blank `Загрузка Keenetic…` state;
- registration bootstrap fallback is used when the live bootstrap WebSocket is delayed;
- bootstrap WebSocket has a finite UI timeout;
- fallback excludes host and integration unique-id;
- later successful bootstrap refresh replaces fallback data;
- no fake healthy values are created from missing telemetry.

## 3. Overview — Ethernet active, LTE standby

Expected:

- Hero answers Internet state and factual active WAN first;
- compact network topology remains visible;
- `Провод | LTE` remains contextual inspection and never performs router control;
- factual active route remains visually distinguishable from the inspected channel;
- LTE reserve state remains visible;
- missing/unknown values remain `Неизвестно` / `Нет данных`, never fabricated zero.

## 4. Failover — Ethernet -> LTE -> Ethernet

Expected:

- Ethernet failure changes active WAN to LTE only from factual router state;
- LTE becomes active;
- last switch timestamp, direction, factual reason, switches today and LTE time today update;
- recovery returns active WAN to Ethernet and LTE to reserve-ready;
- router/telemetry loss alone never proves Ethernet failure;
- direct HA Recorder history remains disabled in the current stabilization line and cannot block the app shell.

## 5. WAN/LTE screen

- selector remains `Провод | LTE`;
- only one detailed transport is visible at a time;
- Ethernet and LTE raw metrics remain available;
- contextual selector does not alter Header Back semantics;
- long press on factual entity-backed values opens native Home Assistant more-info.

## 6. Traffic stabilization mode

For UI v0.4.4:

- `24 ч / 7 дн / 30 дн` controls remain absent;
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

- Home Assistant `module_url` points to one self-contained `keenetic-panel-bundle.js?v=0.4.4`;
- registered component is `keenetic-hero-app-panel-v044`;
- production frontend contains no runtime import/export/dynamic-import dependency on previous UI versions;
- historical modules participate only at build time;
- panel CSS is embedded in the production bundle;
- `python scripts/build_frontend_bundle.py --check` passes;
- `node --check` passes for the generated bundle;
- cold-cache local load works;
- cold-cache Home Assistant Cloud / Nabu Casa load works;
- first open after full Home Assistant restart works;
- repeated open/close works;
- no `Unable to load custom panel`;
- no `Configuration error`.

## Release gate

UI v0.4.4 / b018 is accepted only after the Header/Tab Bar geometry, 430/390 px viewport fit, bootstrap, Overview, WAN/LTE, Traffic stabilization and cold-load gates pass on the real iPhone Pro Max / KN-2311 environment.
