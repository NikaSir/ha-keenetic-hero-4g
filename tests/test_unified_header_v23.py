from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SHELL = (ROOT / "custom_components/keenetic_hero_4g/frontend/nikas-specialized-shell.js").read_text(encoding="utf-8")


def test_refresh_action_is_black_at_rest():
    assert ".nikas-shell__side-action--right{justify-self:end;color:var(--primary-text-color,#17191c)}" in SHELL

HERO_SOURCE = (ROOT / "custom_components/keenetic_hero_4g/frontend/keenetic-app-v100.js").read_text(encoding="utf-8")
BUNDLE = (ROOT / "custom_components/keenetic_hero_4g/frontend/keenetic-panel-bundle.js").read_text(encoding="utf-8")


def test_hero_accent_uses_canonical_density():
    canonical = ".k100-hero-accent{position:absolute;right:-70px;top:-92px;width:205px;height:205px;border:0;border-radius:50%;background:color-mix(in srgb,var(--primary-color,#03a9d9) 12%,var(--card-background-color,#fff))"
    for artifact in (HERO_SOURCE, BUNDLE):
        assert canonical in artifact
        assert "background:rgba(3,169,217,0.07)" not in artifact

