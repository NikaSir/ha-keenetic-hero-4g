# Keenetic Hero 4G+ native panel

Panel metadata version: **1.0.5**
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

The current panel follows **NikaS Specialized Panel UI Standard v1.9** and the mandatory navigation/return contract from the canonical `ha-contract-generated-ui` repository.

The shell and first work view are mounted once. Other views are created on first visit and retained in a stable DOM cache. Home Assistant state cycles are coalesced through `requestAnimationFrame` and patch only changed text, classes and attributes. Header, Bottom Tab Bar, zoom viewport and visited tab containers keep their identity; tab selection uses `hidden` and `inert` without a blank frame.

This panel explicitly includes the optional two-level connection indicator. Its channel line uses the factual labels `Локально / Облако / Резерв / Нет связи / Нет данных`; freshness uses `Данные актуальны / Данные устарели / Нет данных`. A failed current local poll immediately reports `Нет связи` and makes retained values stale. The stable surface is tinted by the primary state and uses 16 px / 700 plus 13 px / 600 typography.

On phones the integration owns a height-locked three-row application shell in the Home Assistant panel's normal layout flow. Only `#work-viewport-v080` scrolls or scales; the outer Home Assistant page, Header and Bottom Tab Bar do not participate in content movement. The runtime must not escape the HA panel container with a fixed-position host. Meaningful panel text uses a semantic hierarchy within 12–25 px rather than flattening labels and values to one size.

The production shell is mounted directly and does not inherit any earlier scroll/zoom shell. At 100% its surface remains in normal document flow, so the browser owns vertical scrolling. A transform surface and custom one-finger pan exist only after scale moves away from 100% and above 100% respectively. Cable, LTE and LAN status plaques are positioned around the router and sized for the mandatory 12 px minimum text.

### Header

- permanent `mdi:menu` Home Assistant menu on the left; it dispatches `hass-toggle-menu`;
- title `Keenetic Hero 4G+` geometrically centered against the viewport;
- no decorative router/brand icon beside the title;
- the complete central title surface is a button that returns to the source NikaS panel;
- first line `Keenetic Hero 4G+`, second line `UI v1.0.5`;
- one global Refresh action on the right;
- the source route is restricted to `Дом сейчас`, `Действия` or `Инфраструктура`; the left Header slot remains the native HA menu.

### Bottom navigation

The bottom Tab Bar is a dedicated app-shell row outside the vertical scroll region and is the only primary section switcher:

1. `Обзор`
2. `Каналы`
3. `Failover`
4. `Трафик`
5. `Диагн.`

It is full-width, edge-attached, non-floating and respects iOS safe area. `Система` remains a secondary drill-down from Diagnostics.

## Overview hierarchy

`Header -> network topology/status -> reserve readiness -> active-channel metrics -> compact reserve channel -> Bottom Tab Bar`

The compact Internet / Active WAN / Ethernet / LTE composition is always preserved. The phone hero contains only the network state, the two-line connection indicator and the Cable/LTE/LAN status plaques. Active metrics never overlap the artwork.

### Overview channel composition

- connector lines are not drawn;
- an active or healthy channel plaque uses a light green fill;
- a connected ready reserve uses a light blue fill;
- a confirmed unavailable channel uses a light orange fill;
- unknown or missing channel data uses a neutral grey fill;
- red is reserved for the overall critical loss of Internet or router telemetry;
- `Резерв готов` is a separate light-blue compact surface below the photo; its confirmed unavailable state is light orange;
- one active-channel card contains Ping, loss, telemetry age, Link/signal, RX, TX, WAN IP and uptime;
- factual entity-backed metrics retain native Home Assistant more-info on hold;
- the reserve channel is one compact row without a repeated readiness badge;
- if Active WAN is unknown, no channel is silently invented as active.

## WAN / LTE

The detailed channel screen also uses a contextual `Провод | LTE` selector and shows only one transport detail at a time. This is internal screen context, not primary app navigation.

## Failover

Shows last switch, direction, factual reason, switches today and LTE time today. Recorder history may provide factual Active-WAN transitions. Historical causes are not reconstructed if the integration did not store them.

## Traffic

Shows current/daily/monthly counters. Recorder history and its period selector remain temporarily disabled in the current stabilization line.

## Diagnostics

Technical source view for RCI/SNMP/template/utility-meter/external-probe provenance, state age, unknown/unavailable states and telemetry trust.

## Reliability semantics

`unknown` / `unavailable` is never treated as healthy. Missing ping/loss is never rendered as zero. Loss of communication with Keenetic is not proof of Ethernet WAN failure. Failover reasons are not guessed from indirect symptoms.

## More-info and safety

Long press on factual entity-backed metrics opens native Home Assistant more-info. Header, contextual selectors and Bottom Tab Bar never execute device actions. The browser panel performs no direct RCI/SNMP writes, shell/curl calls or challenge-response authentication.

## Central UI contract

The generated Infrastructure UI should eventually keep only a compact summary (Internet, Active WAN, LTE reserve, switches today) and deep-link to `/dashboard-keenetic`; detailed WAN/LTE/radio/failover/traffic content belongs to this integration-owned panel.
