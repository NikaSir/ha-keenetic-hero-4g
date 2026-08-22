# Native panel entity-role contract

The native panel addresses **semantic roles**, not hard-coded UI rows. Integration-owned entities are resolved through the `keenetic_hero_4g` config entry and stable unique-id suffixes; this remains valid if a user changes an `entity_id` in Home Assistant.

During the NikaS migration, existing factual Home Assistant entities may fill a role until the same metric is owned by `ha-keenetic-hero-4g`. RCI entities always take precedence.

## Integration-owned roles in b002

| Role | Source | Semantics |
| --- | --- | --- |
| `active_wan` | RCI | Physical transport currently carrying WAN: Ethernet / LTE / unknown |
| `ethernet_connected` | RCI | Factual Ethernet WAN interface connectivity |
| `lte_connected` | RCI | Factual LTE interface connectivity |
| `ethernet_ping` | RCI diagnostic | Average factual router-originated Ethernet probe latency; unknown if probe is not trustworthy |
| `ethernet_packet_loss` | RCI diagnostic | Packet loss only from Keenetic final ping statistics |
| `lte_ping` | RCI diagnostic | Average factual router-originated LTE probe latency |
| `lte_packet_loss` | RCI diagnostic | Packet loss only from Keenetic final ping statistics |
| `last_wan_switch` | integration state | Timestamp of last detected physical WAN transition |
| `last_wan_switch_reason` | integration state | Conservative factual reason; unknown/route-changed when root cause is not proven |
| `wan_switches_today` | integration state | Physical WAN transitions counted for current local day |
| `lte_time_today` | integration state | Accumulated time with LTE as active WAN for current day |
| `ethernet_wan_ipv4` | RCI | Ethernet WAN IPv4 when provided by Keenetic |
| `ethernet_link_speed` | RCI | Physical Ethernet link speed |
| `ethernet_interface_uptime` | RCI | Ethernet interface uptime |
| `lte_wan_ipv4` | RCI | LTE WAN IPv4 when provided by Keenetic |
| `lte_interface_uptime` | RCI | LTE interface uptime |
| `lte_operator` | RCI | Mobile network operator when factual |
| `lte_network_type` | RCI | Mobile network type (for example 4G/4G+) |
| `lte_primary_band` | RCI | Primary LTE band |
| `lte_carriers` | RCI | Active LTE carrier aggregation summary when returned |
| `lte_bandwidth` | RCI | LTE channel bandwidth |
| `lte_enb_id` | RCI | LTE eNB identifier when returned |
| `lte_sector_id` | RCI | LTE sector identifier when returned |
| `lte_phy_cell_id` | RCI | LTE physical Cell ID when returned |
| `lte_earfcn` | RCI | LTE EARFCN when returned |
| `lte_modem_temperature` | RCI | **LTE modem** temperature, not router board temperature |
| `lte_modem_model` | RCI | Factual modem product/model |
| `lte_modem_firmware` | RCI | LTE modem firmware |
| `lte_sim_state` | RCI | SIM state |
| `cpu_load` | RCI | Router CPU load |
| `memory_usage` | RCI | Router memory usage |
| `firmware_version` | RCI | KeeneticOS / firmware version |

## Transitional factual roles already present in Home Assistant NikaS

These are not manufactured by the panel. They are optional compatibility inputs and disappear from the panel data path as equivalent integration-owned roles are added.

| Role | Current candidate | Source class |
| --- | --- | --- |
| `internet_connectivity` | `binary_sensor.1_1_1_1` | external probe |
| `router_connectivity` | `binary_sensor.keenetic_hero_4g_kn_2311_connectivity` | NDMS2 Router |
| `router_uptime` | `sensor.keenetic_hero_4g_uptime` | SNMP |
| `active_wan` | `sensor.keenetic_active_internet` | template fallback only |
| `active_rx_mbps` | `sensor.keenetic_active_rx_mbps` | template |
| `active_tx_mbps` | `sensor.keenetic_active_tx_mbps` | template |
| `ethernet_connected` | `sensor.keenetic_ethernet_status` | SNMP fallback only |
| `ethernet_rx_mbps` | `sensor.keenetic_ethernet_rx_mbps` | template |
| `ethernet_tx_mbps` | `sensor.keenetic_ethernet_tx_mbps` | template |
| `ethernet_rx_total` | `sensor.keenetic_ethernet_rx_total` | SNMP |
| `ethernet_tx_total` | `sensor.keenetic_ethernet_tx_total` | SNMP |
| `ethernet_rx_total_gib` | `sensor.keenetic_ethernet_rx_total_gib` | template |
| `ethernet_tx_total_gib` | `sensor.keenetic_ethernet_tx_total_gib` | template |
| `ethernet_total_daily` | `sensor.keenetic_ethernet_total_daily` | utility meter |
| `ethernet_total_monthly` | `sensor.keenetic_ethernet_total_monthly` | utility meter |
| `lte_connected` | `sensor.keenetic_lte_status` | SNMP fallback only |
| `lte_rx_mbps` | `sensor.keenetic_lte_rx_mbps` | template |
| `lte_tx_mbps` | `sensor.keenetic_lte_tx_mbps` | template |
| `lte_rx_total` | `sensor.keenetic_lte_rx_total` | SNMP |
| `lte_tx_total` | `sensor.keenetic_lte_tx_total` | SNMP |
| `lte_rx_total_gb` | `sensor.keenetic_lte_rx_total_gb` | template |
| `lte_tx_total_gb` | `sensor.keenetic_lte_tx_total_gb` | template |
| `lte_total_daily` | `sensor.keenetic_lte_total_daily` | utility meter |
| `lte_total_monthly` | `sensor.keenetic_lte_total_monthly` | utility meter |
| `lte_rssi` | `sensor.keenetic_lte_rssi` | SNMP |
| `lte_rsrp` | `sensor.keenetic_lte_rsrp` | SNMP |
| `lte_rsrq` | `sensor.keenetic_lte_rsrq` | SNMP |
| `lte_sinr` | `sensor.keenetic_lte_sinr` | SNMP |

## Precedence and trust rules

1. Integration-owned RCI entity for the semantic role.
2. Known factual transitional Home Assistant entity.
3. No value.

There is no fallback from missing data to `0`, `off`, `down`, or another apparently normal/abnormal value.

The independent Internet probe and router telemetry intentionally remain separate facts. A failed router telemetry update does not prove that Internet is down, and an Internet probe failure does not by itself prove that a specific WAN interface is down.
