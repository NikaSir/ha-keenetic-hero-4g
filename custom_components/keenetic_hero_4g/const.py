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
