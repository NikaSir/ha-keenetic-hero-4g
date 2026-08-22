# Keenetic Hero 4G+ native panel

Panel version: **0.1.0**  
Owner: **ha-keenetic-hero-4g**  
Stable route: **`/dashboard-keenetic`**

## Purpose

The integration owns a dedicated mobile-first Network Control Center for the Keenetic Hero 4G+ (KN-2311). The panel is designed for the Home Assistant iOS application and a Pro Max portrait viewport first; tablet/desktop layouts are secondary adaptations.

The first screen must answer, without opening the Keenetic web UI:

1. Is Internet access available?
2. Which transport is active: Ethernet or LTE?
3. Is the primary Ethernet WAN healthy?
4. Is LTE ready/healthy as the reserve transport?
5. Was there a recent failover, and what factual reason is known?
6. Is the displayed router telemetry trustworthy and fresh?

## Architecture

The panel is a Home Assistant custom panel shipped inside the integration. It is registered by the config entry and served from integration-owned static files. It uses Home Assistant's authenticated WebSocket API and state model; it does not make direct browser requests to Keenetic.

The panel does **not** implement router writes. It does not call RCI from Lovelace/JavaScript, does not reproduce challenge-response authentication in the browser, does not execute shell/curl, and does not perform SNMP writes.

### Navigation contract

`/dashboard-keenetic` is a stable cross-integration deep link. `ha-contract-generated-ui` should keep only the compact Keenetic summary and navigate to this route for details.

The runtime bootstrap also exports:

- panel owner;
- panel version;
- preferred view;
- entity-role mapping;
- factual source type for every mapped role;
- coordinator health and scan interval.

The machine-readable contract is stored in `custom_components/keenetic_hero_4g/panel_contract.json`.

## Views

### Overview

Operational status only: Internet, active WAN, primary Ethernet, reserve LTE, current RX/TX, channel ping/loss, LTE radio quality, last failover, switch count today, and LTE usage time today.

The compact topology is functional. It changes state according to factual active-WAN and channel states; it is not a decorative network diagram.

### WAN / LTE

Detailed channel diagnostics. Ethernet includes status, address/link/uptime, ping/loss, current rates and accumulated traffic. LTE includes status, operator/network, signal, ping/loss, traffic, band/carrier/cell/EARFCN and modem/SIM data when factual entities exist.

### Traffic

Current daily/monthly/total counters plus Recorder long-term statistic charts for 24 hours, 7 days and 30 days when statistic-capable counters are available. Charts are intentionally kept off Overview.

### Failover

Shows the last recorded switch, direction, factual reason, switches today and LTE time today. When Home Assistant Recorder history for the factual active-WAN entity is available, transport transitions are listed. Historical causes are **not reconstructed** when they were not stored.

### System

Secondary device information: model, firmware, hostname, CPU/RAM, available uptime information and LTE modem status/temperature. LTE modem temperature is explicitly labelled as modem temperature; it is not presented as router board temperature.

### Diagnostics

Technical source view. It exposes mapped RCI/SNMP/template/utility-meter/external-probe sources, raw WAN/LTE values, state age, unknown/unavailable states and telemetry trust. This is the screen for separating a WAN failure from a router/telemetry failure.

## Entity role resolution

Integration-owned `keenetic_hero_4g` entities are resolved by config-entry ownership plus their stable unique-id suffix. This means a user may rename `entity_id` without breaking the panel.

During migration, known factual legacy entities already present in Home Assistant NikaS may fill roles that the RCI integration does not yet expose. Integration-owned RCI entities always take precedence. The source is shown in Diagnostics so the transition is visible rather than hidden.

Current transitional source classes:

- `rci` — entities owned by this integration;
- `snmp` — existing read-only Keenetic SNMP telemetry;
- `template` — existing derived rates/active-channel entities;
- `utility_meter` — existing traffic period counters;
- `ndms2` — existing router connectivity entity;
- `external_probe` — the independent Internet probe.

No missing role is filled with a fabricated value.

## Reliability semantics

`unknown` / `unavailable` is never treated as healthy.

The UI distinguishes:

- Ethernet/LTE factually down;
- Ethernet/LTE state unknown;
- current Keenetic RCI update failed;
- router telemetry stale;
- a mapped entity unavailable;
- Internet probe down while router telemetry remains available.

If router telemetry is not trustworthy, WAN channel cards say **"Состояние неизвестно"**. Loss of communication with Keenetic is not used as proof that Ethernet WAN failed.

Ping/loss unknown is displayed as **"Нет данных"** or **"Неизвестно"**, never `0 ms` / `0%`.

## LTE quality label

The human-readable LTE quality label is a **panel heuristic**, not a router-provided alarm state. It combines the available RSRP/RSRQ/SINR values into a simple operational label while preserving all raw values immediately below it. Missing radio inputs reduce confidence; they are not replaced with zeroes.

Thresholds used by panel 0.1.0 are documented in the JavaScript source and can be revised independently of router facts.

## Mobile layout

Control viewport: **430 × 932 CSS px**, representative of a Pro Max portrait layout.

- no horizontal scrolling;
- touch targets >= 44 px where practical;
- primary Internet/WAN state at the top;
- bottom navigation for Overview, WAN/LTE, Traffic, Failover and Diagnostics;
- System is reachable from Diagnostics and remains secondary;
- safe-area insets are handled by the panel (`handle_safe_area=True` plus CSS `env(safe-area-inset-*)`);
- desktop/iPad switch to wider two-column layouts without changing information hierarchy.

## More-info

A long press (550 ms) on a factual entity metric opens Home Assistant native `more-info`. Keyboard Enter/Space provides the same action. History and attributes stay in the standard Home Assistant experience.

## Central UI contract

The generated Infrastructure UI should eventually reduce its Keenetic content to a compact summary equivalent to:

- Internet: Online / unavailable / unknown;
- Active WAN: Ethernet / LTE / unknown;
- LTE: reserve ready / active / down / unknown;
- switches today;
- `Подробнее` -> `/dashboard-keenetic`.

Detailed WAN/LTE/radio/failover content belongs to this integration-owned panel and should not be duplicated long-term.
