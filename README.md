# Keenetic Hero 4G+ for Home Assistant

![Keenetic Hero 4G+ integration icon](docs/icon.svg)

Custom Home Assistant integration for **Keenetic Hero 4G+ (KN-2311)**. The integration uses the router's local RCI interface with the verified `x-ndw2-interactive` challenge-response authentication and is **read-only** in the initial release line.

## Status

`v1.00_b001` — first RCI telemetry build for controlled testing.

Existing SNMP/template entities should remain installed during comparison testing. Do not keep temporary `_2` or `_old` entity IDs as the final migration result.

## Current telemetry

System:
- CPU load;
- RAM usage;
- firmware version.

Ethernet WAN (`GigabitEthernet1`):
- connection state;
- WAN IPv4;
- physical link speed;
- interface uptime.

LTE (`UsbLte0`):
- connection state and WAN IPv4;
- operator and network type;
- primary band and carrier aggregation summary;
- channel bandwidth;
- eNB / sector / physical Cell ID / EARFCN when returned by the router;
- LTE modem temperature;
- modem model / firmware;
- SIM state;
- interface uptime.

The integration intentionally does not manufacture values when a field is absent.

## Installation

### HACS custom repository

1. Add this repository to HACS as an **Integration** custom repository.
2. Install **Keenetic Hero 4G+**.
3. Restart Home Assistant.
4. Go to **Settings → Devices & services → Add integration → Keenetic Hero 4G+**.
5. Enter the local router address, username and password.

Default router address used during development: `192.168.0.1`.

## Security

- Credentials are entered through Home Assistant Config Flow and are never committed to the repository.
- Router cookies, SNMP communities, IMEI/IMSI/ICCID and other private identifiers must not be committed.
- No control commands are implemented in `b001`.

## Planned `b002`

After `b001` has been compared against the existing working telemetry:
- Ethernet ping and packet loss;
- LTE ping and packet loss;
- real WAN/failover state;
- last WAN switch time;
- switch count for the current day;
- LTE active time for the current day;
- switch reason only if the router exposes a stable factual source.

VPN/WAN/LTE control remains a separate research track and will not be mixed into read-only telemetry until verified safe.
