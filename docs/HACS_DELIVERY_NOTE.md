# HACS delivery note

The household installation uses HACS from this repository. Release builds must be published from an immutable version reference that HACS can download directly; short commit SHAs must not be treated as branch names.

If HACS attempts a URL of the form `/archive/refs/heads/<short-sha>.zip`, the update is not considered delivered successfully even if `main` contains the code.
