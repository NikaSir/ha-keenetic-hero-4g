# Home Assistant NikaS frontend release policy

Status: **mandatory project rule** for integration-owned specialized panels.

## Production artifact

A specialized panel must be shipped as one autonomous JavaScript production bundle.

The file registered by Home Assistant as `module_url` must contain everything required to register and run the panel. Previous frontend versions must not be runtime dependencies of the current production artifact.

Allowed production shape:

```text
Home Assistant
    -> integration-panel.bundle.js
    -> <integration-panel>
```

Forbidden production shape:

```text
panel-vN.js
    -> import panel-vN-1.js
    -> import panel-vN-2.js
    -> ...
```

Version history belongs in Git history/tags/releases or development source modules, not in the browser runtime dependency graph.

## Source vs production

Development frontend may remain modular. Before release, those sources must be converted into one deterministic production artifact. The current Keenetic implementation uses:

```text
source entry: custom_components/keenetic_hero_4g/frontend/keenetic-app-v029.js
builder:      scripts/build_frontend_bundle.py
production:   custom_components/keenetic_hero_4g/frontend/keenetic-panel.bundle.js
```

The production bundle includes panel CSS and therefore does not require a second integration-owned stylesheet request.

## Registration

Preferred registration:

```text
/keenetic_hero_4g_static/keenetic-panel.bundle.js?v=<UI_VERSION>
```

One registered panel module is one primary frontend load point.

## Cache and cold-start requirements

Correctness must not depend on previous panel files being present in browser/iOS cache.

Mandatory release validation includes:

1. local-network load;
2. Home Assistant Cloud / Nabu Casa load;
3. cold client/cache load;
4. load after full Home Assistant restart;
5. repeated panel opens;
6. navigation from parent panel;
7. explicit Back navigation;
8. no `Unable to load custom panel`;
9. no `Configuration error`;
10. no runtime import of previous UI versions.

Frontend packaging changes require a new UI version, changelog entry, CI validation and live release testing.
