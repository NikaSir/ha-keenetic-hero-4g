# Keenetic Hero 4G+ native panel

Panel metadata version: **0.8.0**
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

The current panel follows **NikaS Specialized Panel UI Standard v1.6** from the canonical `ha-contract-generated-ui` repository.

The shell and first work view are mounted once. Other views are created on first visit and retained in a stable DOM cache. Home Assistant state cycles are coalesced through `requestAnimationFrame` and patch only changed text, classes and attributes. Header, Bottom Tab Bar, zoom viewport and visited tab containers keep their identity; tab selection uses `hidden` and `inert` without a blank frame.

This panel explicitly includes the optional two-level connection indicator. Its channel line uses the factual labels `Локально / Облако / Резерв / Нет связи / Нет данных`; freshness uses `Данные актуальны / Данные устарели / Нет данных`. A failed current poll immediately makes retained values stale without relabelling a known local/cloud path as a transport outage. The stable surface is tinted by the primary state and uses 16 px / 700 plus 13 px / 600 typography.

On phones the integration owns a height-locked three-row application shell in the Home Assistant panel's normal layout flow. Only `#work-viewport-v080` scrolls or scales; the outer Home Assistant page, Header and Bottom Tab Bar do not participate in content movement. The runtime must not escape the HA panel container with a fixed-position host. Meaningful panel text uses a semantic hierarchy within 12–25 px rather than flattening labels and values to one size.

The production shell is mounted directly and does not inherit any earlier scroll/zoom shell. At 100% its surface remains in normal document flow, so the browser owns vertical scrolling. A transform surface and custom one-finger pan exist only after scale moves away from 100% and above 100% respectively. Cable and LAN topology cards are positioned above the router path and sized for the mandatory 12 px minimum text.

### Header

- permanent `mdi:menu` Home Assistant menu on the left; it dispatches `hass-toggle-menu`;
- title `Keenetic Hero 4G+` geometrically centered against the viewport;
- no decorative router/brand icon beside the title;
- compact semantic subtitle `Network Control Center` with no build number;
- one global Refresh action on the right;
- any parent-section transition belongs inside the work area, never in the permanent left Header slot.

### Bottom navigation

The bottom Tab Bar is a dedicated app-shell row outside the vertical scroll region and is the only primary section switcher:

1. `Обзор`
2. `Каналы`
3. `Failover`
4. `Трафик`
5. `Диагн.`

It is full-width, edge-attached, non-floating and respects iOS safe area. `Система` remains a secondary drill-down from Diagnostics.

## Overview hierarchy

`Header -> network topology/status -> Провод | LTE contextual selector -> selected channel detail -> recent failover -> Bottom Tab Bar`

The compact Internet / Active WAN / Ethernet / LTE topology is always preserved. Ethernet and LTE are channels of one router, not peer physical devices, so the contextual selector is **not** a Device Selector.

### Overview channel selection

- `Провод | LTE` appears directly below the topology;
- default selection follows factual `active_wan`;
- only the selected channel detail is rendered below the selector;
- factual active-route indication remains independent from diagnostic selection;
- inspecting the inactive channel never changes router state;
- if Active WAN is unknown, no channel is silently invented as the default.

## WAN / LTE

The detailed channel screen also uses a contextual `Провод | LTE` selector and shows only one transport detail at a time. This is internal screen context, not primary app navigation.

## Failover

Shows last switch, direction, factual reason, switches today and LTE time today. Recorder history may provide factual Active-WAN transitions. Historical causes are not reconstructed if the integration did not store them.

## Traffic

Shows current/daily/monthly counters and Recorder RX/TX rate history for `24 ч`, `7 дн` and `30 дн`.

Starting with panel 0.2.6, **every period-button selection performs a fresh Recorder request for that range**. A previously viewed period may remain cached for rendering, but the cache cannot suppress a later refresh. Request generations ensure that a late response from an older period does not overwrite the current loading/error state. This makes period switching symmetric in both directions (`24h -> 7d -> 30d` and `30d -> 7d -> 24h`).

## Diagnostics

Technical source view for RCI/SNMP/template/utility-meter/external-probe provenance, state age, unknown/unavailable states and telemetry trust.

## Reliability semantics

`unknown` / `unavailable` is never treated as healthy. Missing ping/loss is never rendered as zero. Loss of communication with Keenetic is not proof of Ethernet WAN failure. Failover reasons are not guessed from indirect symptoms.

## More-info and safety

Long press on factual entity-backed metrics opens native Home Assistant more-info. Header, contextual selectors and Bottom Tab Bar never execute device actions. The browser panel performs no direct RCI/SNMP writes, shell/curl calls or challenge-response authentication.

## Central UI contract

The generated Infrastructure UI should eventually keep only a compact summary (Internet, Active WAN, LTE reserve, switches today) and deep-link to `/dashboard-keenetic`; detailed WAN/LTE/radio/failover/traffic content belongs to this integration-owned panel.
