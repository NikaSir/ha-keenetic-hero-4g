# Handoff to ha-contract-generated-ui

The specialized Keenetic panel owns detailed router UX. The central Infrastructure UI should keep only a compact status/deep-link after the native panel is accepted.

## Stable panel API

- owner: `ha-keenetic-hero-4g`
- panel id: `keenetic`
- route: `/dashboard-keenetic`
- preferred view: `overview`
- icon: `mdi:router-network`
- machine-readable contract: `custom_components/keenetic_hero_4g/panel_contract.json`

The route is considered a stable cross-integration API after panel acceptance.

## Compact central summary

Required semantic roles:

- `internet_connectivity` -> Интернет: Доступен / недоступен / нет данных;
- `active_wan` -> Ethernet / LTE / unknown;
- `lte_connected` -> reserve ready / active / down / unknown;
- `wan_switches_today` -> count;
- `Подробнее` -> `/dashboard-keenetic`.

Conceptual presentation:

```text
Keenetic Hero 4G+
Интернет     Доступен
WAN          Ethernet
LTE          Резерв готов
Переключений сегодня 0
[ Подробнее ]
```

If telemetry trust is not sufficient, the compact card must prefer `Нет данных` / `Состояние неизвестно` over a guessed healthy/down state.

## Content that should leave the central Infrastructure detail page

After native-panel acceptance, do not maintain duplicate central UI blocks for:

- detailed Ethernet metrics;
- detailed LTE radio metrics;
- ping/loss diagnostics;
- traffic history;
- failover details/history;
- modem/cell/band/EARFCN diagnostics;
- router CPU/RAM/firmware details.

Those belong to `/dashboard-keenetic`.

## Migration rule

Do not remove the current `/dashboard-infrastructure/network-keenetic` detail page until the native panel has passed the A-F live acceptance scenarios and the stable deep-link is confirmed on iPhone. The removal/reduction is a separate generated-UI change; it is not performed by the router integration itself.
