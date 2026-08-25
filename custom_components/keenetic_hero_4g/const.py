from __future__ import annotations

from datetime import timedelta

DOMAIN = "keenetic_hero_4g"
PLATFORMS = ["sensor", "binary_sensor"]

DEFAULT_HOST = "192.168.0.1"
DEFAULT_PORT = 80
DEFAULT_SCAN_INTERVAL = 30
DEFAULT_TIMEOUT = 10

ETHERNET_INTERFACE = "GigabitEthernet1"
LTE_INTERFACE = "UsbLte0"

PING_HOST = "1.1.1.1"
DIAGNOSTIC_INTERVAL = timedelta(seconds=60)

CONF_SCAN_INTERVAL = "scan_interval"
UPDATE_INTERVAL = timedelta(seconds=DEFAULT_SCAN_INTERVAL)

# Integration-owned panel contract. The URL path is a stable API consumed by
# ha-contract-generated-ui and must not change without an explicit migration.
PANEL_URL_PATH = "dashboard-keenetic"
PANEL_TITLE = "Keenetic"
PANEL_ICON = "mdi:router-network"
PANEL_OWNER = "ha-keenetic-hero-4g"
PANEL_PARENT_ROUTE = "/dashboard-infrastructure/overview"
PANEL_PREFERRED_VIEW = "overview"
PANEL_VERSION = "0.6.7"
