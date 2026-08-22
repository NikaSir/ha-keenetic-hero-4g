# LTE signal quality presentation

The panel keeps all factual LTE radio values visible and adds one human-readable summary. The summary is **UI interpretation only**; it is not an alarm/state reported by Keenetic.

Panel version `0.1.0` scores each available metric independently:

| Metric | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- |
| RSRP | >= -90 dBm | >= -100 dBm | >= -110 dBm | >= -120 dBm | < -120 dBm |
| RSRQ | >= -10 dB | >= -15 dB | >= -20 dB | < -20 dB | — |
| SINR | >= 20 dB | >= 13 dB | >= 5 dB | >= 0 dB | < 0 dB |

Only metrics that are actually available participate in the average. Missing/unknown/unavailable metrics are never substituted with zero.

Average score -> label:

- >= 3.5: `Отличный`;
- >= 2.5: `Хороший`;
- >= 1.5: `Удовлетворительный`;
- below 1.5: `Слабый`;
- no factual RSRP/RSRQ/SINR values: `Неизвестно`.

RSSI is displayed as a raw supporting value but is intentionally not included in this composite score because RSRP/RSRQ/SINR are more useful for LTE radio quality assessment.

This label must never be used to infer total Internet availability or Ethernet health. It only summarizes the available LTE radio measurements for the operator-facing UI.
