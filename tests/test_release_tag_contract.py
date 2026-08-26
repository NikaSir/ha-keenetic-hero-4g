from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github" / "workflows" / "release-tag.yml"
SCRIPT = ROOT / "scripts" / "release_tag.py"


class ReleasePublicationPolicyTests(unittest.TestCase):
    def test_tag_workflow_is_inert_and_read_only(self) -> None:
        workflow = WORKFLOW.read_text(encoding="utf-8")
        self.assertNotIn("git tag", workflow)
        self.assertNotIn("git push", workflow)
        self.assertNotIn("contents: write", workflow)
        self.assertIn("contents: read", workflow)

    def test_legacy_helper_rejects_tag_creation(self) -> None:
        source = SCRIPT.read_text(encoding="utf-8")
        self.assertIn("Automatic release tags are disabled", source)
        self.assertNotIn("v{version}", source)


if __name__ == "__main__":
    unittest.main()
