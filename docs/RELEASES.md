# Release policy

## Source of truth

- `main` is the canonical source branch; HACS delivery uses the selected published release.
- Development happens in feature branches and pull requests.
- Every accepted build is traceable to a reviewed branch, pull request and commit.
- Release artifacts must be produced from committed source, never from an uncommitted local working tree.

## Distribution model

- Home Assistant installations use HACS with `https://github.com/NikaSir/ha-keenetic-hero-4g` as a custom **Integration** repository.
- HACS owns the installed files under `/config/custom_components/keenetic_hero_4g/` after the one-time migration.
- Manual ZIP/folder replacement is reserved for controlled feature-branch validation or recovery, not routine household updates.
- The existing Home Assistant Config Entry is preserved during migration between manual and HACS file delivery.
- Temporary short-SHA branches are not a release mechanism. Approved candidates use GitHub prereleases and matching immutable tags.

## Version lineage

Existing project version history must be preserved during GitHub migration. Repository bootstrap is not a reason to reset or renumber the integration.

The Home Assistant manifest uses a semantic version representation of the project build. Example:

- project/changelog build: `v1.00_b008`;
- manifest version: `1.0.0-b008`;
- traceable source: reviewed PR and its immutable merge commit.

## Release gate

Before an accepted build is merged/published for normal HACS installation:

1. Repository checks are green.
2. Hassfest validation is green.
3. HACS validation is green.
4. Functional tests for the affected integration behavior are complete on the target KN-2311 when hardware validation is required.
5. `CHANGELOG.md` and manifest version are updated consistently.
6. No router credentials, SNMP communities, cookies, tokens, private identifiers, or private diagnostics are present in tracked files or release artifacts.
7. `main` contains only the reviewed and accepted implementation.

GitHub beta releases are approved. Automatic release tagging remains disabled; publication is explicit after checks pass. The committed integration/UI version identifies the build; the pull request and merge commit provide traceability.

## Update flow

1. Develop and review in a feature branch/PR.
2. Run CI plus required live validation.
3. Merge the accepted build to `main`.
4. Publish the approved candidate as a GitHub prerelease and select it in HACS for device verification; stable publication follows acceptance.
5. Keep manual installation instructions only as a recovery/test path.

See `docs/HACS_MIGRATION.md` for the one-time transition from the current manually copied component directory.

## Verified beta delivery snapshot — 2026-09-14

- Published GitHub prerelease: [`1.0.0-b067`](https://github.com/NikaSir/ha-keenetic-hero-4g/releases/tag/1.0.0-b067).
- Source commit: `5058a8e2c233109aca06117f14b0af5e50c0b5ea`.
- The tag matches the integration manifest version.
- HACS and Hassfest checks on this exact commit completed successfully.
- Delivery uses the standard GitHub source archive. `hacs.json` does not require a separately uploaded ZIP asset.
- **Target Home Assistant installation and device acceptance remain unverified.** A published beta and green CI are not evidence of a successful installed update.

## Beta acceptance in Home Assistant

1. Open this custom Integration repository in HACS and enable beta/prerelease versions in its version selection.
2. Confirm the selected version is `1.0.0-b067`, install it, and restart Home Assistant as required.
3. Confirm the loaded integration version and panel UI version against the selected release; reopen the panel from a cold client/cache.
4. Verify the fixed header and bottom menu, device selectors, black Refresh button and completion feedback, scrolling, pinch zoom and reset. Verify telemetry updates without a full panel redraw.
5. Record the installed version, Home Assistant/HACS versions, device/client, checks performed and any errors. Do not mark acceptance complete without this evidence.
6. Publish stable only after user acceptance and version-consistent checks. Preserve existing published beta/stable tags and releases; use a new reviewed version for corrections.

This repository-specific beta policy reflects the approved publication decision and takes precedence over older blanket no-Releases wording in shared documentation. Shared pinned standards are not modified here.
