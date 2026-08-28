#!/usr/bin/env python3
"""Fail CI when a repository drifts from the mandatory NikaS UI contract."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / ".nikas-ui-standard.json"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def read_relative(path: str) -> str:
    target = ROOT / path
    require(target.is_file(), f"missing required file: {path}")
    return target.read_text(encoding="utf-8")


def main() -> None:
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    require(config.get("version") == "1.8", "NikaS UI standard version must be 1.8")

    standard_path = config.get("standard_path", "docs/NIKAS_SPECIALIZED_PANEL_UI_STANDARD.md")
    standard = read_relative(standard_path)
    digest = hashlib.sha256(standard.encode("utf-8")).hexdigest()
    require(digest == config.get("standard_sha256"), "local NikaS UI standard is not the canonical v1.8 copy")
    navigation_contract = read_relative(config["navigation_contract_path"])
    navigation_digest = hashlib.sha256(navigation_contract.encode("utf-8")).hexdigest()
    require(
        navigation_digest == config.get("navigation_contract_sha256"),
        "local NikaS navigation contract is not the canonical copy",
    )
    for clause in (
        "Center title plaque — return to the source NikaS base panel",
        'sessionStorage["nikas.specialized.source_route.v1"]',
        "return_to",
        "history.pushState()",
        "history.back()",
        "Capture precedence is:",
        "exact form `UI vX.Y.Z`",
        "focus state and pressed response",
        "same click/keyboard handler",
        "Ambient shell synchronization",
    ):
        require(clause in standard, f"canonical Header-return clause missing: {clause}")
    for clause in (
        "/dashboard-house-v11/home",
        "/dashboard-actions/home",
        "/dashboard-infrastructure/overview",
        "/starline",
        "nikas.specialized.source_route_at.v1",
        "same click/keyboard handler",
        "A missing, orphaned or mismatched public route is a blocking defect.",
    ):
        require(clause in navigation_contract, f"canonical navigation clause missing: {clause}")

    role = config.get("role")
    require(role in {"base", "specialized", "readiness"}, f"unsupported NikaS UI role: {role}")
    runtime_files = config.get("runtime_files", [])
    require(isinstance(runtime_files, list), "runtime_files must be a list")
    require(len(runtime_files) == len(set(runtime_files)), "runtime_files must not contain duplicates")
    sources = "\n".join(read_relative(path) for path in runtime_files)

    production_entrypoint = config.get("production_entrypoint")
    if production_entrypoint:
        require(
            production_entrypoint in runtime_files,
            "production_entrypoint must be one of the checked runtime_files",
        )

    current_runtime_path = config.get("current_runtime_path")
    current_runtime = read_relative(current_runtime_path) if current_runtime_path else ""
    header_return_runtime_path = config.get("header_return_runtime_path", current_runtime_path)
    header_return_runtime = (
        read_relative(header_return_runtime_path) if header_return_runtime_path else current_runtime
    )

    if role == "readiness":
        require(not runtime_files, "readiness-only repository must not claim a panel runtime")
        compliance = read_relative(config["compliance_path"])
        require("GAP" in compliance, "readiness-only repository must record the absent runtime as GAP")
        return

    require(runtime_files, f"{role} repository must declare checked runtime_files")

    for token in (
        "nikas.specialized.source_route.v1",
        "nikas.specialized.source_route_at.v1",
        "/dashboard-house-v11/home",
        "/dashboard-actions/home",
        "/dashboard-infrastructure/overview",
    ):
        require(token in sources, f"runtime route contract missing token: {token}")
    require('"/dashboard-house"' not in sources, "legacy /dashboard-house route is forbidden in runtime")
    require("'/dashboard-house'" not in sources, "legacy /dashboard-house route is forbidden in runtime")
    require("/dashboard-starline" not in sources, "invalid /dashboard-starline route is forbidden in runtime")

    if role == "base":
        require("sessionStorage" in sources, "base shell must persist the source-route hand-off")
        markers = config.get("source_handoff", {})
        require(isinstance(markers, dict) and markers, "base shell must declare source_handoff markers")
        for name in (
            "storage_write_marker",
            "route_normalizer_marker",
            "specialized_route_marker",
            "capture_marker",
            "navigation_marker",
            "delegation_marker",
        ):
            marker = markers.get(name)
            require(isinstance(marker, str) and marker, f"source_handoff.{name} must be configured")
            require(marker in sources, f"base source-route hand-off marker missing: {marker}")
        require(
            "rememberSpecializedSourceRoute(window.location.pathname);" not in sources,
            "ambient shell synchronization must not refresh the source hand-off",
        )
        delegated_files = config.get("delegated_navigation_files", [])
        require(delegated_files, "base shell must list every delegated navigation source")
        delegation_marker = markers["delegation_marker"]
        for path in delegated_files:
            require(
                delegation_marker in read_relative(path),
                f"base outbound navigation does not delegate to click-time hand-off: {path}",
            )
        for token in (
            "/dashboard-zont",
            "/starline",
            "/dashboard-s8-omni",
            "/dashboard-irrigation",
            "/dashboard-ups",
            "/dashboard-keenetic",
            "/dashboard-lider",
        ):
            require(token in sources, f"canonical specialized-panel route missing from base registry: {token}")
        return

    for token in (
        "return_to",
        "from",
        "history.pushState",
        "location-changed",
        "UI v",
        "sessionStorage",
        "removeItem(",
        "window.location.origin",
        "url.origin",
        "url.pathname",
        "document.referrer",
        "parent_route",
    ):
        require(token in sources, f"specialized Header-return runtime missing token: {token}")
    require("history.back(" not in sources, "history.back() is forbidden by the NikaS routing contract")
    require("<button" in sources or 'createElement("button")' in sources, "center title must be a semantic button")

    markers = config.get("header_return", {})
    require(isinstance(markers, dict) and markers, "specialized panel must declare header_return markers")
    for name in (
        "button_marker",
        "version_marker",
        "focus_marker",
        "pressed_marker",
        "explicit_precedence_marker",
        "capture_once_marker",
    ):
        marker = markers.get(name)
        require(isinstance(marker, str) and marker, f"header_return.{name} must be configured")
        require(marker in sources, f"specialized Header-return marker missing: {marker}")

    version_marker = markers["version_marker"]
    require("UI v" in version_marker, "header_return.version_marker must identify the exact UI version line")
    require("·" not in version_marker, "header_return.version_marker must be version-only")

    for marker in config.get("forbidden_runtime_markers", []):
        require(marker not in sources, f"forbidden specialized-panel runtime marker present: {marker}")

    if header_return_runtime:
        for token in (
            'for (const key of ["return_to", "from"])',
            "consumeSourceRouteV085()",
            "savedReturnRouteV085()",
            "sessionStorage.removeItem(SOURCE_ROUTE_KEY_V085)",
            "localStorage.setItem(RETURN_ROUTE_KEY_V085, route)",
            "/dashboard-house-v11/home",
            "/dashboard-actions/home",
            "/dashboard-infrastructure/overview",
        ):
            require(
                token in header_return_runtime,
                f"current Header-return implementation missing token: {token}",
            )
        require(
            'params.get("source")' not in header_return_runtime,
            "non-canonical source query fallback is forbidden",
        )
        require(
            "window.history.state" not in header_return_runtime,
            "non-canonical history-state fallback is forbidden",
        )

    integration = ROOT / "custom_components" / "keenetic_hero_4g"
    panel_contract = json.loads((integration / "panel_contract.json").read_text(encoding="utf-8"))
    panel_manifest = json.loads((integration / "panel_manifest.json").read_text(encoding="utf-8"))
    ui_version = config.get("ui_version")
    web_component = config.get("web_component")
    require(panel_contract["panel"]["version"] == ui_version, "panel contract UI version drift")
    require(panel_manifest["panel_version"] == ui_version, "panel manifest UI version drift")
    require(panel_contract["frontend_delivery"]["web_component"] == web_component, "panel contract component drift")
    require(panel_manifest["web_component"] == web_component, "panel manifest component drift")
    require(panel_contract["app_shell"]["version"] == config["version"], "panel contract standard drift")
    require(panel_manifest["zoom_policy"]["standard"] == config["version"], "panel manifest standard drift")
    require(panel_contract["app_shell"]["canonical_sha256"] == config["standard_sha256"], "panel contract standard hash drift")
    require(
        panel_contract["app_shell"]["navigation_contract_sha256"] == config["navigation_contract_sha256"],
        "panel contract navigation hash drift",
    )

if __name__ == "__main__":
    main()
