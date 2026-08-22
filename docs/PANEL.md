# Keenetic Hero 4G+ native panel

Panel version: **0.2.5**  
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

Panel 0.2.5 follows **Home Assistant NikaS Integration Dashboard UI Standard v1.2**.

### Header

The header is application navigation, not device control:

- left: `mdi:arrow-left` + `Назад` when space permits;
- center: `Keenetic Hero 4G+`, geometrically centered against the viewport;
- no decorative router/brand icon beside the title;
- secondary text: compact UI/version identity;
- right: one global `Обновить` action;
- Back touch target is at least 44 × 44 CSS px;
- hold/double tap on the header has no router action.

Back uses an explicit application route and never browser-history semantics:

`/dashboard-infrastructure/overview`

### Bottom navigation

The bottom Tab Bar is a dedicated app-shell row outside the vertical scroll region and is the only primary section switcher. It spans the useful mobile width, is attached to the bottom edge, respects the iOS bottom safe area and contains at most five destinations:

1. `Обзор`
2. `WAN/LTE`
3. `Failover`
4. `Трафик`
5. `Диагн.`

`Система` remains a secondary drill-down from Diagnostics. Primary top tabs are not used.

## Architecture

The panel is a Home Assistant custom panel shipped inside the integration. It is registered by the config entry and served from integration-owned static files. It uses Home Assistant's authenticated WebSocket API and state model; it does not make direct browser requests to Keenetic.

The panel does **not** implement router writes. It does not call RCI from Lovelace/JavaScript, reproduce challenge-response authentication in the browser, execute shell/curl or perform SNMP writes.

### Navigation contract

`/dashboard-keenetic` is a stable cross-integration deep link. `ha-contract-generated-ui` should keep only the compact Keenetic summary and navigate to this route for details.

### Frontend cache contract

Panel release candidates use a versioned module URL and versioned custom-element name. This prevents Home Assistant iOS/WebView from silently retaining an older registered panel component after an integration update.

## Views

### Overview

Overview keeps the functional network topology permanently visible:

`Internet -> active WAN -> Ethernet / LTE -> Keenetic`

Immediately below that topology is a contextual selector:

`Провод | LTE`

Ethernet and LTE are channels of one router, **not peer physical devices**, so this is not a Device Selector from the NikaS multi-device model.

Behavior:

- on initial Overview load, the selected channel follows factual `active_wan`;
- if Ethernet is active, Ethernet detail is selected by default;
- if LTE is active, LTE detail is selected by default;
- only the selected channel's detailed card is shown below the selector;
- the user may inspect the inactive channel without changing the router state;
- factual active-route indication remains independent from the user's diagnostic selection;
- if Active WAN is unknown, the panel does not invent a default selection;
- no selector action can switch physical WAN.

Recent failover remains visible after the selected channel detail.

### WAN / LTE

Detailed channel diagnostics use a contextual two-segment selector:

`Провод | LTE`

Only one transport detail is shown at a time, reducing scroll depth. The selector does not change the meaning of Back or the bottom Tab Bar.

- `Провод`: Ethernet status, address/link/uptime, ping/loss, rates and accumulated traffic.
- `LTE`: connection status, operator/network, signal, ping/loss, traffic, band/carrier/cell/EARFCN and modem/SIM data when factual entities exist.

### Failover

Shows the last recorded switch, direction, factual reason, switches today and LTE time today. Recorder history may list factual Active-WAN transitions. Historical causes are not reconstructed when they were not stored.

### Traffic

Current daily/monthly/total counters plus Recorder charts for 24 hours, 7 days and 30 days when statistic-capable entities are available. Charts stay off Overview.

### Diagnostics

Technical source view. It exposes mapped RCI/SNMP/template/utility-meter/external-probe sources, raw WAN/LTE values, state age, unknown/unavailable states and telemetry trust.

### System — secondary drill-down

Model, firmware, hostname, CPU/RAM, uptime information and LTE modem status/temperature. It is not a primary bottom-navigation destination.

## Entity role resolution

Integration-owned `keenetic_hero_4g` entities are resolved by config-entry ownership plus their stable unique-id suffix, so user-renamed `entity_id` values remain supported.

During migration, known factual legacy entities already present in Home Assistant NikaS may fill roles that the RCI integration does not yet expose. Integration-owned RCI entities always take precedence. The source is shown in Diagnostics.

No missing role is filled with a fabricated value.

## Reliability semantics

`unknown` / `unavailable` is never treated as healthy.

The UI distinguishes factual WAN down, WAN state unknown, failed RCI update, stale telemetry, unavailable mapped entity and independent Internet-probe failure.

If router telemetry is not trustworthy, WAN states remain unknown. Loss of communication with Keenetic is not proof that Ethernet WAN failed.

Ping/loss unknown is displayed as `Нет данных` or `Неизвестно`, never as a synthetic `0 ms` / `0%`.

## LTE quality label

The human-readable LTE quality label is a panel heuristic based on available RSRP/RSRQ/SINR. Raw values remain visible and missing inputs are never replaced with zeroes.

## Mobile layout

Control viewport: **430 × 932 CSS px**, representative of iPhone Pro Max portrait.

- no horizontal scrolling;
- primary Internet/WAN state immediately below the unified header;
- network topology stays above the channel selector;
- full-width edge-attached bottom Tab Bar with large targets;
- Tab Bar lives outside the scroll region and never covers the final content row;
- iOS safe-area insets are handled by the panel;
- desktop/iPad may widen cards without changing information hierarchy.

## More-info

Long press on a factual entity metric opens Home Assistant native `more-info`. Header, contextual channel selectors and bottom navigation never trigger entity-specific or router actions.

## Central UI contract

The generated Infrastructure UI should eventually reduce its Keenetic content to a compact summary:

- Internet: Online / unavailable / unknown;
- Active WAN: Ethernet / LTE / unknown;
- LTE: reserve ready / active / down / unknown;
- switches today;
- `Подробнее` -> `/dashboard-keenetic`.

Detailed WAN/LTE/radio/failover content belongs to this integration-owned panel and should not be duplicated long-term.
