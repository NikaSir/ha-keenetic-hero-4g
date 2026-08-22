# Migration from manual files to HACS

This project uses the GitHub repository as the source of truth and HACS as the normal installation/update path.

## Preconditions

- The build to be installed has passed live validation on the target Keenetic Hero 4G+ (KN-2311).
- The accepted build has been merged to `main`.
- Repository checks, Hassfest, and HACS validation are green.
- The existing Home Assistant Config Entry must be preserved; do not delete the integration from **Settings -> Devices & services** just to change the file delivery method.

## One-time migration

1. Make a normal Home Assistant backup before changing custom-component files.
2. In HACS, open **Custom repositories**.
3. Add `https://github.com/NikaSir/ha-keenetic-hero-4g` with category **Integration**.
4. Open **Keenetic Hero 4G+** in HACS and install the version from the canonical repository branch/release.
5. If HACS refuses to install because `/config/custom_components/keenetic_hero_4g/` already exists from the manual test installation, remove only that directory and immediately install the repository copy through HACS before restarting Home Assistant.
6. Restart Home Assistant.
7. Verify that the existing Keenetic Hero 4G+ Config Entry loads without re-entering credentials.
8. Verify a representative telemetry set: firmware, CPU/RAM, Ethernet/LTE connectivity and IPv4, LTE operator/band/cell data, and current accepted WAN diagnostics.

## Important migration rules

- Do not remove and recreate the Home Assistant Config Entry unless a future release explicitly requires it.
- Do not create replacement entity IDs with `_2`, `_old`, or similar suffixes as the final migration state.
- HACS manages the files under `/config/custom_components/keenetic_hero_4g/`; after migration, manual ZIP replacement is reserved for controlled branch testing or recovery only.
- `main` is the stable installation source. Feature branches are never the normal household installation source.
- A standby WAN interface being down must not be interpreted as total Internet failure while another WAN is active.

## Normal update flow after migration

1. Development happens in a feature branch and pull request.
2. Live validation is completed on the target router when required.
3. CI/Hassfest/HACS validation must pass.
4. The accepted change is merged to `main` and version/changelog metadata are updated.
5. HACS reports the repository update and performs the file upgrade.
6. Home Assistant is restarted only when the integration update requires it.

Manual copying of the component directory is no longer the routine update method after this migration.
