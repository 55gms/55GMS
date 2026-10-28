# Rewarded website links

Add an unlisted `/links` page on `feat/rewarded-links`, separate from the previous UI branch. The user chose a backend-provided pool, one random unused link per rewarded video, and no persistence after reload. Do not add inbound navigation links.

Use the pinned existing 55GMS video SDK directly on this page and its existing `/api/_ads` edge. Require a genuine grant and redeem it server-to-server at `/api/v1/rewards/redeem` before revealing a URL. Only grants for game `links`, reward `site-link` are accepted. Do not rely on a client completion flag. Keep URLs in `LINKS_URLS`, a JSON array of HTTPS destinations, outside static assets. No database or new credentials are needed.

The browser holds revealed IDs/URLs only in memory. Each reveal filters those IDs from the backend pool and randomly selects one remaining destination. Reload starts over. Empty/exhausted pools, cancelled/unavailable ads, missing grants, SDK failures and backend failures need explicit messages; none unlock a URL. Preserve existing premium policy from the ad server. Match site theme tokens and mobile layouts. No game files downloaded.

Approach: reuse the existing video SDK and verified grant redemption rather than build another video player or expose an ad-gated static URL list. Configuration via environment is the implementation choice; an admin editor is outside this request.
