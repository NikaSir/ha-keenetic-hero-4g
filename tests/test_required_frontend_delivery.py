"""Require deterministic frontend delivery through the unfiltered CI gate."""

from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = Path("custom_components/keenetic_hero_4g/frontend")
CHECK = "python scripts/build_frontend_bundle.py --check"
STANDARD = "python scripts/check_nikas_ui_standard.py"


class RequiredFrontendDeliveryTests(unittest.TestCase):
    def required_command(self):
        source = (ROOT / ".github/workflows/repository-checks.yml").read_text()
        job = re.search(r"^  validate:\n(.*?)(?=^  [\w-]+:|\Z)", source, re.M | re.S)
        self.assertIsNotNone(job)
        self.assertRegex(job.group(1), r"(?m)^        run: " + re.escape(CHECK) + "$",
                         "Required validate must reject stale production bundles")
        return [sys.executable, "scripts/build_frontend_bundle.py", "--check"]

    def test_required_workflow_checks_delivery_without_filters_or_bypass(self):
        self.required_command()
        source = (ROOT / ".github/workflows/repository-checks.yml").read_text()
        self.assertNotRegex(source, r"(?m)^\s+(?:paths|paths-ignore|if|continue-on-error):")
        self.assertRegex(source, r"(?m)^        run: " + re.escape(STANDARD) + "$")
        extra = (ROOT / ".github/workflows/frontend-bundle.yml").read_text()
        self.assertIn(CHECK, extra)
        self.assertIn(STANDARD, extra)

    def test_current_production_bundle_passes(self):
        result = subprocess.run(self.required_command(), cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_stale_missing_and_non_autonomous_delivery_fail(self):
        command = self.required_command()
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "scripts").mkdir()
            shutil.copy2(ROOT / "scripts/build_frontend_bundle.py", root / "scripts")
            frontend = root / FRONTEND
            frontend.mkdir(parents=True)
            for path in (ROOT / FRONTEND).iterdir():
                if path.suffix in (".js", ".css"):
                    shutil.copy2(path, frontend / path.name)
            bundle = frontend / "keenetic-panel-bundle.js"
            original = bundle.read_text()
            for payload in (original + "\n// stale bundle\n", None):
                with self.subTest(bundle="missing" if payload is None else "stale"):
                    if payload is None:
                        bundle.unlink()
                    else:
                        bundle.write_text(payload)
                    result = subprocess.run(command, cwd=root, capture_output=True, text=True)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn("missing or stale", result.stderr)
            bundle.write_text(original)
            source = frontend / "keenetic-app-v100.js"
            source.write_text(source.read_text() + "\nexport const accidentalModule = true;\n")
            result = subprocess.run(command, cwd=root, capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Runtime module statement remains", result.stderr)


if __name__ == "__main__":
    unittest.main()
