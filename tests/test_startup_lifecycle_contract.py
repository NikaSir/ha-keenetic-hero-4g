from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INIT = ROOT / "custom_components" / "keenetic_hero_4g" / "__init__.py"


class StartupLifecycleContractTests(unittest.TestCase):
    """Keep panel existence independent of physical router availability."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.source = INIT.read_text(encoding="utf-8")

    def test_first_refresh_helper_is_not_used(self) -> None:
        self.assertNotIn("async_config_entry_first_refresh", self.source)

    def test_panel_is_registered_before_initial_rci_refresh(self) -> None:
        runtime = self.source.index("entry.runtime_data = coordinator")
        panel = self.source.index("await async_register_native_panel(hass, entry)")
        refresh = self.source.index("await coordinator.async_refresh()")
        platforms = self.source.index(
            "await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)"
        )
        self.assertLess(runtime, panel)
        self.assertLess(panel, refresh)
        self.assertLess(refresh, platforms)

    def test_pre_refresh_state_is_fail_closed(self) -> None:
        panel = self.source.index("await async_register_native_panel(hass, entry)")
        empty_data = self.source.index("coordinator.data = {}")
        failed_state = self.source.index("coordinator.last_update_success = False")
        self.assertLess(empty_data, panel)
        self.assertLess(failed_state, panel)


if __name__ == "__main__":
    unittest.main()
