# Keenetic Hero 4G+ for Home Assistant

Custom Home Assistant integration project for **Keenetic Hero 4G+ (KN-2311)** telemetry and failover visibility.

## Status

Repository bootstrap and migration planning are in progress. Existing verified Home Assistant telemetry and direct router-access research will be migrated deliberately; placeholder code is not considered a release.

## Scope

The integration is intended to expose router/system state, Ethernet and LTE WAN telemetry, failover events, channel health, traffic, signal metrics, and diagnostics using verified router interfaces such as RCI and/or SNMP where appropriate.

## Repository policy

- Default branch: `main`.
- Router credentials, cookies, SNMP communities, tokens, cellular/private identifiers, and private network secrets must never be committed.
- Unavailable data must not be represented as a normal/healthy state.
- Shared contribution/security defaults are inherited from `NikaSir/.github` unless overridden here.

## Target layout

```text
custom_components/keenetic_hero_4g/
docs/
.github/workflows/
hacs.json
```
