# Update and publication policy

## Source of truth

- `main` is the canonical stable source branch and the normal HACS installation source.
- Development happens in feature branches and pull requests.
- GitHub Releases and automatic release tags are not used.
- Every accepted build remains traceable to its reviewed commit and merged pull request.
- Generated assets must come from committed source, never from an uncommitted local working tree.

## Distribution model

- Home Assistant installations use HACS with `https://github.com/NikaSir/ha-keenetic-hero-4g` as a custom **Integration** repository.
- HACS owns the installed files under `/config/custom_components/keenetic_hero_4g/` after the one-time migration.
- Manual ZIP/folder replacement is reserved for controlled feature-branch validation or recovery, not routine household updates.
- The existing Home Assistant Config Entry is preserved during migration between manual and HACS file delivery.
- Temporary short-SHA branches, Git tags and GitHub Releases are not update channels.

## Version lineage

Existing project version history is preserved. Repository bootstrap is not a reason to reset or renumber the integration.

The Home Assistant manifest keeps the semantic project build, for example `1.0.0-b038`. The panel keeps its own UI version, for example `0.7.5`. These versions support diagnostics, compatibility and cache invalidation; neither requires a Git tag or GitHub Release.

## Publication gate

Before an accepted update is merged into `main`:

1. Repository checks are green.
2. Hassfest validation is green.
3. HACS validation is green.
4. Functional tests for the affected behavior are complete on the target KN-2311 when hardware validation is required.
5. `CHANGELOG.md`, integration version and panel version are synchronized where applicable.
6. No router credentials, SNMP communities, cookies, tokens, private identifiers or private diagnostics are tracked.
7. `main` contains only the reviewed and accepted implementation.

## Update flow

1. Develop and review in a feature branch and draft pull request.
2. Run CI and required live validation.
3. Merge the accepted pull request to `main`.
4. Refresh the custom repository in HACS, install the available update and restart Home Assistant when requested.
5. Keep manual installation only as a recovery or feature-branch test path.

See `docs/HACS_MIGRATION.md` for the one-time transition from the manually copied component directory.
