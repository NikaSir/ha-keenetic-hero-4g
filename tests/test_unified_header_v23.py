from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SHELL = (ROOT / "custom_components/keenetic_hero_4g/frontend/nikas-specialized-shell.js").read_text(encoding="utf-8")


def test_refresh_action_is_black_at_rest():
    assert ".nikas-shell__side-action--right{justify-self:end;color:var(--primary-text-color,#17191c)}" in SHELL
