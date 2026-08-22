# Frontend bundle acceptance — Keenetic panel v0.2.9

The production frontend release is accepted only when all of the following pass.

## Static / CI gates

- Home Assistant `module_url` points to `keenetic-panel.bundle.js?v=0.2.9`.
- `keenetic-panel.bundle.js` exists and is generated from the declared source entry.
- generated bundle contains no runtime relative JavaScript `import` statements;
- generated bundle contains no runtime reference to `keenetic-panel.css`;
- production bundle contains the CSS required by the panel;
- `python scripts/build_frontend_bundle.py --check` passes;
- JavaScript syntax validation passes for the generated bundle;
- Hassfest and HACS validation pass.

## Cold-load / runtime gates

1. clear/empty frontend cache and open `/dashboard-keenetic` locally;
2. open through Home Assistant Cloud / Nabu Casa with a cold client;
3. full Home Assistant restart, then first panel open;
4. close and reopen the panel several times;
5. open from `/dashboard-infrastructure/overview` deep-link;
6. explicit `← Назад` returns to `/dashboard-infrastructure/overview`;
7. no `Unable to load custom panel`;
8. no `Configuration error`;
9. no blank/infinite bootstrap screen;
10. existing Overview/WAN-LTE/Failover/Traffic/Diagnostics behavior is unchanged.

## Network expectation

Loading the current specialized-panel frontend must not require sequential HTTP loading of previous Keenetic UI JavaScript versions. The integration-owned production load point is the single bundle registered in `module_url`.
