# Changelog

## v1.00_b002 — 2026-08-21

- Added factual active WAN detection from Keenetic route/interface state.
- Supports VPN-default-route installations by identifying the public /32 transport route carried by `GigabitEthernet1` or `UsbLte0`; no Lovelace traffic inference is used.
- Added read-only `tools ping` execution through RCI Parse commands.
- Added Ethernet and LTE average ping sensors.
- Added Ethernet and LTE packet-loss sensors.
- Added persistent last WAN switch timestamp.
- Added conservative last-switch reason states: Ethernet link down, Ethernet restored, or route changed when the root cause cannot be proven.
- Added WAN switch count for the current day.
- Added cumulative LTE active time for the current day.
- Diagnostic ICMP runs on a slower 60-second cadence and cannot make the base telemetry coordinator unavailable.
- Added English custom-integration translations and state translations for WAN/failover enum sensors.
- Integration remains read-only; VPN/WAN/LTE control is still out of scope.
- Live failover validation confirmed Ethernet -> LTE -> Ethernet tracking, switch count, switch timestamp, `ethernet_link_down`, and `ethernet_restored` reasons on the target KN-2311.
- Hardened diagnostic ping collection after live validation: first diagnostics run immediately, explicitly down interfaces are skipped, probe count is three, partial ICMP reply times are retained, and packet loss is only derived from factual ping output.
- Corrected Parse transport for KN-2311: submit `{"parse":"..."}` to `POST /rci/`, then poll the same `/rci/` resource while `continued` is true. This replaces the invalid `/rci/parse` continuation path that returned `no input [http/rci ...]`.
- Completed Russian labels for Ethernet/LTE ping, packet loss and LTE EARFCN.

## v1.00_b001 — 2026-08-21

- Added first installable Home Assistant custom integration under `custom_components/keenetic_hero_4g`.
- Added Config Flow and local Keenetic `x-ndw2-interactive` challenge-response authentication.
- Added RCI polling coordinator.
- Added system CPU/RAM/firmware telemetry.
- Added Ethernet WAN IPv4, link speed, uptime and connectivity entities.
- Added LTE operator/network/band/carrier/cell/modem/SIM telemetry from factual RCI fields.
- Added Russian UI translation.
- Added HACS metadata.
- Added project icon using a router + radio-link visual.
- Kept the integration read-only; failover accounting and active probing are deferred to `b002`.
- Live-tested Config Flow and RCI polling on Home Assistant 2026.8.2 with Keenetic Hero 4G+ KN-2311.
- Corrected LTE modem model selection to prefer the factual Quectel product/ATI model over Keenetic's numeric modem type code.
- Refined Ethernet/LTE connectivity entity names for cleaner Home Assistant UI state rendering.
