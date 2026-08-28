from __future__ import annotations


def release_tag() -> str:
    """Reject obsolete tag publication under the current NikaS UI standard."""
    raise RuntimeError(
        "Automatic release tags are disabled; publish through a reviewed branch and pull request."
    )


if __name__ == "__main__":
    raise SystemExit(
        "Automatic release tags are disabled; publish through a reviewed branch and pull request."
    )
