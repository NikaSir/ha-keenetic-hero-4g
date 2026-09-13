from __future__ import annotations

import ast
import asyncio
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PANEL_SOURCE = ROOT / "custom_components" / "keenetic_hero_4g" / "panel.py"


class _Coordinator:
    def __init__(self, events: list[str]) -> None:
        self.events = events

    async def async_request_refresh(self) -> None:
        self.events.append("refresh")


class _Connection:
    def __init__(self) -> None:
        self.result = None
        self.error = None

    def send_result(self, message_id, payload) -> None:
        self.result = (message_id, payload)

    def send_error(self, message_id, code, message) -> None:
        self.error = (message_id, code, message)


def _load_refresh_handler(events: list[str]):
    tree = ast.parse(PANEL_SOURCE.read_text(encoding="utf-8"), filename=str(PANEL_SOURCE))
    handler = next(
        (
            node
            for node in tree.body
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
            and node.name == "websocket_panel_refresh"
        ),
        None,
    )
    if handler is None:
        raise AssertionError("websocket_panel_refresh is missing")
    handler.decorator_list = []
    module = ast.Module(
        body=[
            ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0),
            handler,
        ],
        type_ignores=[],
    )
    ast.fix_missing_locations(module)

    def payload(_hass, _entry):
        events.append("payload")
        return {"telemetry": {"last_update_success": True}}

    namespace = {
        "Any": object,
        "HomeAssistant": object,
        "KeeneticCoordinator": _Coordinator,
        "_bootstrap_payload": payload,
    }
    exec(compile(module, str(PANEL_SOURCE), "exec"), namespace)
    return namespace["websocket_panel_refresh"]


class PanelManualRefreshTests(unittest.TestCase):
    def test_refresh_command_polls_router_before_returning_fresh_payload(self) -> None:
        events: list[str] = []
        handler = _load_refresh_handler(events)
        coordinator = _Coordinator(events)
        entry = type("Entry", (), {"runtime_data": coordinator})()
        entries = type(
            "Entries",
            (),
            {
                "async_get_entry": lambda _self, entry_id: entry if entry_id == "entry-1" else None,
                "async_entries": lambda _self, _domain: [entry],
            },
        )()
        hass = type("Hass", (), {"config_entries": entries})()
        connection = _Connection()

        asyncio.run(
            handler(
                hass,
                connection,
                {"id": 17, "entry_id": "entry-1"},
            )
        )

        self.assertEqual(events, ["refresh", "payload"])
        self.assertEqual(
            connection.result,
            (17, {"telemetry": {"last_update_success": True}}),
        )
        self.assertIsNone(connection.error)


if __name__ == "__main__":
    unittest.main()
