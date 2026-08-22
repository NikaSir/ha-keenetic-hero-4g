# Keenetic Hero 4G+ native panel

Panel version: **0.2.0**  
Owner: **ha-keenetic-hero-4g**  
Stable route: **`/dashboard-keenetic`**  
Parent route: **`/dashboard-infrastructure/overview`**

## Purpose

The integration owns a dedicated mobile-first Network Control Center for the Keenetic Hero 4G+ (KN-2311). The primary target is the Home Assistant iOS application on an iPhone Pro Max in portrait orientation; tablet and desktop are secondary adaptations.

The first screen must answer, without opening Keenetic Web UI:

1. Is Internet access available?
2. Which transport is active: Ethernet or LTE?
3. Is the primary Ethernet WAN healthy?
4. Is LTE ready/healthy as reserve transport?
5. Was there a recent failover, and what factual reason is known?
6. Is the displayed router telemetry trustworthy and fresh?

## Home Assistant NikaS app shell

Panel 0.2.0 adopts the common specialized-panel navigation standard used across Home Assistant NikaS.

### Header

The header is application navigation, not device control:

- left: `mdi:arrow-left` + `Назад` when space permits;
- center: `Keenetic Hero 4G+`;
- secondary text: compact UI/version identity;
- right: one global `Обновить` action;
- Back touch target is at least 44 × 44 CSS px;
- hold/double tap on the header has no router action.

Back uses an explicit application route and never browser-history semantics:

`/dashboard-infrastructure/overview`

This remains deterministic when the panel is opened from Infrastructure, sidebar, a notification, or a deep link.

### Bottom navigation

The fixed bottom navigation is the only primary section switcher. It respects the iOS bottom safe area and contains at most five destinations:

1. `Обзор`
2. `WAN/LTE`
3. `Failover`
4. `Трафик`
5. `Диагн.`

`Система` is deliberately secondary and remains reachable from Diagnostics as a drill-down screen. Primary top tabs are not used.

The shell rule is therefore:

`Header = leave the Keenetic application`  
`Bottom navigation = move inside the Keenetic application`

## Architecture

The panel is a Home Assistant custom panel shipped inside the integration. It is registered by the config entry and served from integration-owned static files. It uses Home Assistant's authenticated WebSocket API and state model; it does not make direct browser requests to Keenetic.

The panel does **not** implement router writes. It does not call RCI from Lovelace/JavaScript, does not reproduce challenge-response authentication in the browser, does not execute shell/curl, and does not perform SNMP writes.

### Navigation contract

`/dashboard-keenetic` is a stable cross-integration deep link. `ha-contract-generated-ui` should keep only the compact Keenetic summary and navigate to this route for details.

The runtime bootstrap exports panel owner, panel version, parent route, preferred view, entity-role mapping, factual source type, coordinator health and scan interval. The machine-readable contract is stored in `custom_components/keenetic_hero_4g/panel_contract.json`.

## Views

### Overview

Operational status only: Internet, active WAN, primary Ethernet, reserve LTE, current RX/TX, channel ping/loss, LTE radio quality, last failover, switch count today and LTE usage time today. The compact topology is functional and changes according to factual state.

### WAN / LTE

Detailed channel diagnostics. Ethernet includes status, address/link/uptime, ping/loss, current rates and accumulated traffic. LTE includes status, operator/network, signal, ping/loss, traffic, band/carrier/cell/EARFCN and modem/SIM data when factual entities exist.

### Failover

Shows the last recorded switch, direction, factual reason, switches today and LTE time today. When Home Assistant Recorder history for factual Active WAN exists, transport transitions are listed. Historical causes are **not reconstructed** when they were not stored.

### Traffic

Current daily/monthly/total counters plus Recorder charts for 24 hours, 7 days and 30 days when statistic-capable entities are available. Charts stay off Overview.

### Diagnostics

Technical source view. It exposes mapped RCI/SNMP/template/utility-meter/external-probe sources, raw WAN/LTE values, state age, unknown/unavailable states and telemetry trust. This is the main technical screen for separating a WAN failure from a router/telemetry failure.

### System — secondary drill-down

Model, firmware, hostname, CPU/RAM, uptime information and LTE modem status/temperature. It is not a primary bottom-navigation destination because connectivity is the operational priority.

## Entity role resolution

Integration-owned `keenetic_hero_4g` entities are resolved by config-entry ownership plus their stable unique-id suffix, so user-renamed `entity_id` values remain supported.

During migration, known factual legacy entities already present in Home Assistant NikaS may fill roles that the RCI integration does not yet expose. Integration-owned RCI entities always take precedence. The source is shown in Diagnostics.

Current transitional source classes:

- `rci` — entities owned by this integration;
- `snmp` — existing read-only Keenetic SNMP telemetry;
- `template` — existing derived rates/active-channel entities;
- `utility_meter` — existing traffic period counters;
- `ndms2` — existing router connectivity entity;
- `external_probe` — independent Internet probe.

No missing role is filled with a fabricated value.

## Reliability semantics

`unknown` / `unavailable` is never treated as healthy.

The UI distinguishes factual WAN down, WAN state unknown, failed RCI update, stale telemetry, an unavailable mapped entity and independent Internet-probe failure.

If router telemetry is not trustworthy, WAN cards say **`Состояние неизвестно`**. Loss of communication with Keenetic is not used as proof that Ethernet WAN failed.

Ping/loss unknown is displayed as **`Нет данных`** or **`Неизвестно`**, never `0 ms` / `0%`.

## LTE quality label

The human-readable LTE quality label is a **panel heuristic**, not a router-provided alarm state. It combines available RSRP/RSRQ/SINR into a simple operational label while preserving raw values. Missing radio inputs are not replaced with zeroes.

## Mobile layout

Control viewport: **430 × 932 CSS px**, representative of iPhone Pro Max portrait.

- no horizontal scrolling;
- primary Internet/WAN state immediately below the unified header;
- no second row of primary navigation above the content;
- fixed bottom navigation with large targets;
- bottom content padding prevents overlap with navigation;
- safe-area insets are handled by the panel (`handle_safe_area=True` plus CSS `env(safe-area-inset-*)`);
- desktop/iPad may widen cards without changing information hierarchy.

## More-info

Long press on a factual entity metric opens Home Assistant native `more-info`. Header and bottom-navigation elements are navigation only and never trigger entity-specific or router actions.

## Central UI contract

The generated Infrastructure UI should eventually reduce its Keenetic content to a compact summary:

- Internet: Online / unavailable / unknown;
- Active WAN: Ethernet / LTE / unknown;
- LTE: reserve ready / active / down / unknown;
- switches today;
- `Подробнее` -> `/dashboard-keenetic`.

Detailed WAN/LTE/radio/failover content belongs to this integration-owned panel and should not be duplicated long-term.
