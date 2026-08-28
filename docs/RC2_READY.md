# Keenetic panel v0.2.1 RC2 candidate

> Historical record only. Current Header, navigation, shell and publication requirements are defined by `NIKAS_SPECIALIZED_PANEL_UI_STANDARD.md` v1.9 and `NIKAS_PANEL_NAVIGATION_CONTRACT.md`; the explicit Back control below is retired.

This candidate supersedes panel v0.2.0 RC1 for UI acceptance.

Reason: NikaS specialized-panel app-shell standard v1.1 requires the primary bottom Tab Bar to be full-width and edge-attached on iPhone. Floating/pill navigation with side or bottom gaps is not accepted.

Candidate requirements:

- explicit Back to `/dashboard-infrastructure/overview`;
- compact header with global Refresh;
- fixed full-width edge-attached bottom Tab Bar;
- five primary destinations: Overview / WAN-LTE / Failover / Traffic / Diagnostics;
- iOS safe-area handling and bottom content clearance;
- unknown/unavailable reliability semantics unchanged;
- read-only router API contract unchanged.

CI gate before RC2 branch: Repository checks, Hassfest and HACS validation all pass on the candidate code line.
