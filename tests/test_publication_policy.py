from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PublicationPolicyTests(unittest.TestCase):
    def test_release_automation_is_absent(self) -> None:
        self.assertFalse((ROOT / ".github" / "workflows" / "release-tag.yml").exists())
        self.assertFalse((ROOT / "scripts" / "release_tag.py").exists())

    def test_workflows_cannot_publish_tags_or_github_releases(self) -> None:
        workflows = "\n".join(
            path.read_text(encoding="utf-8")
            for path in sorted((ROOT / ".github" / "workflows").glob("*.yml"))
        )
        for forbidden in ("git push origin \"refs/tags/", "gh release", "softprops/action-gh-release"):
            self.assertNotIn(forbidden, workflows)

    def test_documented_flow_is_commit_and_pr_based(self) -> None:
        policy = (ROOT / "docs" / "RELEASES.md").read_text(encoding="utf-8")
        self.assertIn("GitHub Releases and automatic release tags are not used", policy)
        self.assertIn("feature branches and pull requests", policy)
        self.assertIn("`main`", policy)


if __name__ == "__main__":
    unittest.main()
