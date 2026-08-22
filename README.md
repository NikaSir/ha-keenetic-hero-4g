# Keenetic Hero 4G+ for Home Assistant

![Keenetic Hero 4G+ integration icon](docs/icon.svg)

Custom Home Assistant integration for **Keenetic Hero 4G+ (KN-2311)**. The integration uses the router's local RCI interface with verified `x-ndw2-interactive` challenge-response authentication and remains **read-only** in the current release line.

## Status

- `v1.00_b001` — accepted first RCI telemetry build.
- `v1.00_b002` — current validation build for WAN diagnostics and failover accounting.
- native panel `v0.1.0` — separate draft validation line in `feature/native-panel-v1`.

`b002` has already passed live Ethernet -> LTE -> Ethernet failover testing on the target KN-2311. The remaining b002 acceptance item is live validation of the direct RCI Ethernet/LTE ping and packet-loss probes.

Existing SNMP/template entities may remain installed during comparison testing. Temporary `_2` or `_old` entity IDs are not part of the integration's final entity model.

## Native Network Control Center panel

The integration owns a specialized mobile-first Keenetic panel. Its stable Home Assistant route is:

`/dashboard-keenetic`

The panel is designed first for iPhone Pro Max portrait and is intended to replace the old central sensor-list detail page as the primary Keenetic operating view inside Home Assistant.

Views:

- **Overview** — Internet, active WAN, Ethernet, LTE reserve, telemetry trust and the last failover;
- **WAN / LTE** — detailed channel and LTE radio diagnostics;
- **Traffic** — current counters and Recorder statistics when available;
- **Failover** — last switch, factual direction/reason and recorded Active-WAN transitions;
- **System** — router/modem technical state;
- **Diagnostics** — source provenance, data age, raw unknown/unavailable states and technical values.

The panel is registered by the integration itself and ships its frontend assets inside `custom_components/keenetic_hero_4g`. It never performs browser-side RCI/SNMP access or router writes. Long press on factual metrics opens native Home Assistant more-info.

Reliability rule: `unknown` / `unavailable` is not normal. Router telemetry failure is not interpreted as proof that Ethernet WAN is down, and missing ping/loss is never converted to `0 ms` / `0%`.

See [`docs/PANEL.md`](docs/PANEL.md), [`docs/PANEL_TESTS.md`](docs/PANEL_TESTS.md), and [`docs/PANEL_NAVIGATION_CONTRACT.yaml`](docs/PANEL_NAVIGATION_CONTRACT.yaml).

## Current telemetry

System:
- CPU load;
- RAM usage;
- firmware version.

Ethernet WAN (`GigabitEthernet1`):
- connection state;
- WAN IPv4;
- physical link speed;
- interface uptime;
- ping and packet loss (`b002`).

LTE (`UsbLte0`):
- connection state and WAN IPv4;
- operator and network type;
- primary band and carrier aggregation summary;
- channel bandwidth;
- eNB / sector / physical Cell ID / EARFCN when returned by the router;
- LTE modem temperature;
- modem model / firmware;
- SIM state;
- interface uptime;
- ping and packet loss (`b002`).

WAN/failover (`b002`):
- factual active WAN derived from Keenetic route/interface state;
- VPN-aware transport detection when the default route is carried by OpenVPN;
- last WAN switch time;
- conservative switch reason;
- switch count for the current day;
- cumulative LTE active time for the current day.

The integration intentionally does not manufacture values when a field is absent or ambiguous. A standby interface being down does not imply total Internet failure when another WAN is operating.

## WAN diagnostics

Diagnostic ICMP is run by the router itself through the command-specific RCI background resource `/rci/tools/ping`, not from the Home Assistant host. Ethernet and LTE probes are bound to their respective source interfaces and are collected by polling the same RCI resource while Keenetic reports `continued: true`.

The diagnostic cadence is intentionally slower than normal telemetry polling, and a diagnostic failure cannot make the normal router telemetry coordinator unavailable.

## Installation and updates

**HACS from this GitHub repository is the normal installation and update method.** Manual ZIP copying is reserved for controlled feature-branch testing or recovery.

### HACS custom repository

1. In HACS, open **Custom repositories**.
2. Add `https://github.com/NikaSir/ha-keenetic-hero-4g` with category **Integration**.
3. Install **Keenetic Hero 4G+**.
4. Restart Home Assistant.
5. Go to **Settings -> Devices & services -> Add integration -> Keenetic Hero 4G+** for a first-time configuration only.
6. Enter the local router address, username and password.

Default router address used during development: `192.168.0.1`.

For an existing manual installation, keep the Home Assistant Config Entry and migrate only the component files to HACS. See [`docs/HACS_MIGRATION.md`](docs/HACS_MIGRATION.md) for the one-time transition procedure.

For branch validation before a release, replace only `/config/custom_components/keenetic_hero_4g/` with the same directory from the test branch and restart Home Assistant. The existing Config Entry and credentials do not need to be recreated.

## Repository release model

- `main` is the stable household installation source.
- Development is performed in feature branches and pull requests.
- Repository checks, Hassfest, HACS validation, changelog/version checks, and required live tests are release gates.
- The native panel is accepted through its own draft PR before it is allowed into an integration release.
- After HACS migration, accepted updates are delivered from the repository; routine manual folder replacement stops.

See [`docs/RELEASES.md`](docs/RELEASES.md) for the release policy.

## Security

- Credentials are entered through Home Assistant Config Flow and are never committed to the repository.
- Router cookies, SNMP communities, IMEI/IMSI/ICCID and other private identifiers must not be committed.
- Home Assistant diagnostics redact credentials and sensitive cellular identifiers.
- Diagnostic ping is read-only from the Home Assistant integration's point of view and does not modify router configuration.
- VPN/WAN/LTE control commands are not implemented in the current release line.

## Control research

VPN status/control, forced WAN switching, LTE reconnect and Internet-interface restart remain a separate research track. They will not be mixed into the read-only telemetry path until each command has been verified to be supported and safe on the target KeeneticOS build.
