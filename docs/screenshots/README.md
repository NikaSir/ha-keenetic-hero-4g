# Native panel screenshots

Live screenshots are a release gate for the specialized Keenetic panel.

Target capture environment:

- Home Assistant iOS application;
- iPhone Pro Max class viewport, portrait;
- real KN-2311 telemetry;
- panel route `/dashboard-keenetic`;
- no browser/design mock may replace the live acceptance evidence.

Required captures before the panel PR is marked ready:

1. `iphone-pro-max-overview-ethernet.png` — normal operation, Ethernet active and LTE reserve ready.
2. `iphone-pro-max-overview-lte-failover.png` — Ethernet failed, LTE active, last switch visible.
3. `iphone-pro-max-wan-lte.png` — detailed Ethernet/LTE diagnostics and radio values.
4. `iphone-pro-max-telemetry-untrusted.png` — router/RCI telemetry unavailable or stale, demonstrating that Ethernet is not falsely reported down.
5. `iphone-pro-max-ping-unknown.png` — ping/loss unavailable, demonstrating `Нет данных`/`Неизвестно` instead of zero.

Optional desktop/iPad captures may be added after the mobile acceptance screenshots.
