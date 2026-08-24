from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INIT = ROOT / "custom_components" / "keenetic_hero_4g" / "__init__.py"


def test_startup_uses_current_panel_module() -> None:
    text = INIT.read_text(encoding="utf-8")
    assert "from .panel import async_register_native_panel, async_unregister_native_panel" in text
    assert "panel_v030" not in text
