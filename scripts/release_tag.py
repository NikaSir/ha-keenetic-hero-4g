from __future__ import annotations


def release_tag() -> str:
    """Reject obsolete tag publication under NikaS UI Standard v1.7."""
    raise RuntimeError(
        "Automatic release tags are disabled; publish through a reviewed branch and pull request."
    )


if __name__ == "__main__":
    raise SystemExit(
        "Automatic release tags are disabled; publish through a reviewed branch and pull request."
    )
