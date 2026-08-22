# Home Assistant NikaS specialized panel UI standard

Status: **mandatory**  
Primary target: **iPhone Pro Max · portrait · one-hand operation**

## Application shell

Every integration-owned specialized panel is treated as a mobile application inside Home Assistant rather than as an ordinary Lovelace dashboard.

The shell has three layers:

1. compact top Header;
2. specialized scrollable content;
3. fixed full-width bottom Tab Bar.

## Header

Canonical structure:

`← Назад · Panel title · Refresh / ⋮`

Rules:

- Back is always on the left;
- Back uses explicit Home Assistant navigation to the declared `parent_path` / `parent_route`;
- browser history is not an application-navigation contract;
- title is compact and is not repeated as another large heading immediately below;
- only truly global panel actions are allowed on the right;
- Back/action touch targets are at least approximately 44 × 44 pt;
- hold and double-tap on Header controls must not trigger device actions.

Canonical parent routes:

- HO-SC-8W irrigation → `/dashboard-actions`;
- S8 OMNI → `/dashboard-actions`;
- Keenetic Hero 4G+ → `/dashboard-infrastructure/overview`;
- Stark SolarPower UPS → `/dashboard-infrastructure/overview`.

## Primary navigation

Primary sections use the bottom Tab Bar only. Top tab rows such as `Overview | Diagnostics | History` are not used as the primary navigation pattern.

The Tab Bar:

- is fixed at the bottom of the viewport;
- occupies the full useful mobile width;
- is edge-attached, not a floating pill/card over content;
- remains available during vertical scrolling;
- handles the iOS bottom safe area;
- has consistent height and geometry across specialized panels;
- does not cover the final content because the page reserves bottom clearance;
- uses icon + short label;
- keeps touch targets suitable for one-hand operation;
- highlights the active destination inside the shared bar.

Prefer 3–5 primary sections. Additional functions become Service/Diagnostics/drill-down screens rather than shrinking the Tab Bar.

Recommended primary destinations:

- HO-SC-8W: Overview · Zones · Programs · Diagnostics;
- S8 OMNI: Overview · Cleaning · Station · Service · Diagnostics;
- Stark SolarPower: Overview · Diagnostics · History;
- Keenetic Hero 4G+: Overview · WAN/LTE · Failover · Traffic · Diagnostics.

## Navigation semantics

- Header Back exits the specialized application to its central parent panel.
- Bottom Tab Bar switches screens inside the current specialized application.
- Internal section changes never redefine the meaning of Back.

## Reliability and safety

Navigation changes must not weaken integration safety contracts. In particular:

- no raw Tuya DP controls;
- no direct RCI/SNMP writes;
- no API bypasses;
- no unverified commands;
- no fabricated entities/actions;
- `unknown` / `unavailable` is never normal/healthy by default;
- Header/Tab Bar never perform entity-specific device actions.

For factual Home Assistant entities, long press continues to open native Home Assistant `more-info`. Navigation controls do not participate in this behavior.

## Acceptance

A specialized panel conforms only when:

- a clear Back control and compact Header are always present at the top;
- primary sections are in a fixed, full-width, edge-attached bottom Tab Bar;
- the Tab Bar does not float over content and does not disappear during scrolling;
- safe-area and final-content clearance are correct on iPhone Pro Max portrait.
