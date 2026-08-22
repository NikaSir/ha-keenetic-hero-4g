# Release policy

## Source of truth

- `main` is the canonical stable source branch and the normal HACS installation source.
- Development happens in feature branches and pull requests.
- Every accepted build is traceable to an immutable Git tag derived from the committed Home Assistant manifest version.
- Release artifacts must be produced from committed source, never from an uncommitted local working tree.

## Distribution model

- Home Assistant installations use HACS with `https://github.com/NikaSir/ha-keenetic-hero-4g` as a custom **Integration** repository.
- HACS owns the installed files under `/config/custom_components/keenetic_hero_4g/` after the one-time migration.
- Manual ZIP/folder replacement is reserved for controlled feature-branch validation or recovery, not routine household updates.
- The existing Home Assistant Config Entry is preserved during migration between manual and HACS file delivery.
- Temporary short-SHA branches are not a release mechanism.

## Version lineage

Existing project version history must be preserved during GitHub migration. Repository bootstrap is not a reason to reset or renumber the integration.

The Home Assistant manifest uses a semantic version representation of the project build. Example:

- project/changelog build: `v1.00_b008`;
- manifest version: `1.0.0-b008`;
- immutable Git/HACS tag: `v1.0.0-b008`.

The tag is generated deterministically as `v<manifest.version>` by `scripts/release_tag.py`.

## Release gate

Before an accepted build is merged/published for normal HACS installation:

1. Repository checks are green.
2. Hassfest validation is green.
3. HACS validation is green.
4. Functional tests for the affected integration behavior are complete on the target KN-2311 when hardware validation is required.
5. `CHANGELOG.md` and manifest version are updated consistently.
6. No router credentials, SNMP communities, cookies, tokens, private identifiers, or private diagnostics are present in tracked files or release artifacts.
7. `main` contains only the reviewed and accepted implementation.

Release tags are immutable. `.github/workflows/release-tag.yml` publishes the missing tag from protected `main`. If the same tag already exists at another commit, the workflow fails instead of moving the tag.

## Update flow

1. Develop and review in a feature branch/PR.
2. Run CI plus required live validation.
3. Merge the accepted build to `main`.
4. The release-tag workflow publishes `v<manifest.version>` for that accepted main commit.
5. HACS uses the stable repository/tag lineage for routine delivery.
6. Keep manual installation instructions only as a recovery/test path.

See `docs/HACS_MIGRATION.md` for the one-time transition from the current manually copied component directory.
