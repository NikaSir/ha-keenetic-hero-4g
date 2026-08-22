# Release policy

## Source of truth

- `main` is the canonical stable source branch and the normal HACS installation source.
- Development happens in feature branches and pull requests.
- A public release must be traceable to an immutable Git commit/tag when tagged releases are used.
- Release artifacts must be produced from committed source, never from an uncommitted local working tree.

## Distribution model

- Home Assistant installations use HACS with `https://github.com/NikaSir/ha-keenetic-hero-4g` as a custom **Integration** repository.
- HACS owns the installed files under `/config/custom_components/keenetic_hero_4g/` after the one-time migration.
- Manual ZIP/folder replacement is reserved for controlled feature-branch validation or recovery, not routine household updates.
- The existing Home Assistant Config Entry is preserved during migration between manual and HACS file delivery.

## Version lineage

Existing project version history must be preserved during GitHub migration. Repository bootstrap is not a reason to reset or renumber the integration.

The Home Assistant manifest uses a semantic version representation of the project build, for example `1.0.0-b002` for project build `v1.00_b002`.

## Release gate

Before an accepted build is merged/published for normal HACS installation:

1. Repository checks are green.
2. Hassfest validation is green.
3. HACS validation is green.
4. Functional tests for the affected integration behavior are complete on the target KN-2311 when hardware validation is required.
5. `CHANGELOG.md` and manifest version are updated consistently.
6. No router credentials, SNMP communities, cookies, tokens, private identifiers, or private diagnostics are present in tracked files or release artifacts.
7. `main` contains only the reviewed and accepted implementation.

If release tags are published, they are treated as immutable and must point to the exact reviewed commit.

## Update flow

1. Develop and review in a feature branch/PR.
2. Run CI plus required live validation.
3. Merge the accepted build to `main`.
4. HACS becomes the routine delivery/update path for Home Assistant.
5. Keep manual installation instructions only as a recovery/test path.

See `docs/HACS_MIGRATION.md` for the one-time transition from the current manually copied component directory.
