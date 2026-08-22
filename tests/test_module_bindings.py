from __future__ import annotations

import ast
import builtins
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / "custom_components" / "keenetic_hero_4g"


class ModuleBindingTests(unittest.TestCase):
    """Catch undefined names used while module-level classes are created."""

    def test_class_base_names_are_bound(self) -> None:
        builtin_names = set(dir(builtins))
        for path in PACKAGE.glob("*.py"):
            tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
            bound: set[str] = set(builtin_names)

            for node in tree.body:
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                    bound.add(node.name)
                elif isinstance(node, ast.Import):
                    for alias in node.names:
                        bound.add(alias.asname or alias.name.split(".", 1)[0])
                elif isinstance(node, ast.ImportFrom):
                    for alias in node.names:
                        if alias.name != "*":
                            bound.add(alias.asname or alias.name)
                elif isinstance(node, (ast.Assign, ast.AnnAssign)):
                    targets = node.targets if isinstance(node, ast.Assign) else [node.target]
                    for target in targets:
                        if isinstance(target, ast.Name):
                            bound.add(target.id)

            for node in tree.body:
                if not isinstance(node, ast.ClassDef):
                    continue
                for base in node.bases:
                    root = base
                    while isinstance(root, (ast.Attribute, ast.Subscript)):
                        root = root.value
                    if isinstance(root, ast.Name):
                        self.assertIn(
                            root.id,
                            bound,
                            f"{path.name}: class {node.name} uses unbound base {root.id}",
                        )


if __name__ == "__main__":
    unittest.main()
