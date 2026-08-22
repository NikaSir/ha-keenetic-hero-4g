# Traffic period refresh fix — panel v0.2.6

Observed on iPhone Pro Max in panel v0.2.5: period changes worked when opening a wider range for the first time, but returning from `30 дн` to already-viewed `7 дн` / `24 ч` reused the old lifetime cache.

v0.2.6 behavior:

- every press of `24 ч`, `7 дн` or `30 дн` requests fresh Recorder statistics for that exact range;
- cached data remains only as render storage and never suppresses a later user refresh;
- request generations prevent an older in-flight response from changing loading/error state for a newer selected period;
- acceptance must be tested in both directions: `24h -> 7d -> 30d` and `30d -> 7d -> 24h`.
