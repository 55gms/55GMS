# Rewarded website links

The unlisted `/links` page reveals one random unused website URL for each verified rewarded-video grant. It is not added to any navigation menu. Revealed URLs are held only in page memory; reload and back/forward restoration start a new visit. Open or copy a link to keep it.

## Server setup

Set `LINKS_URLS` in the server environment to a JSON array of your real alternative domains, for example:

```dotenv
LINKS_URLS=["https://your-alternate-domain.example/","https://another-domain.example/"]
```

Replace these examples with working domains for this website. No domains are seeded by this feature. URLs must use HTTPS without embedded credentials. Equivalent URL duplicates are removed. At most 500 entries are supported. Restart the app after updating the pool. This configuration never ships inside static assets.

The existing `ADS_SERVER_URL` and `ADS_API_KEY` must be configured, with video ads enabled on the ad service and available inventory. Use the existing ad-server Premium policy (including eligible rewarded skips). No database migration or new secret is needed. The app fails closed when the pool, SDK, ad service or signed reward is unavailable.

The pinned 55GMS Ads v1.3.1 video SDK uses `/api/_ads`. The page requests `gameId: links`, `rewardId: site-link`. `POST /api/links/reveal` passes the signed grant ID and signature to `/api/v1/rewards/redeem` on the configured ad server with the existing backend bearer key. Only successful, matching, one-use redemption reveals a destination. Provider completions without a verifiable grant do not unlock links.

The browser sends only the IDs already revealed in the current visit, which the server excludes before randomly selecting a remaining URL. Reload starts over; this is not an account entitlement or a mechanism for preventing visitors from sharing an earned URL. A reward consumed upstream cannot be recovered if the response is lost before reaching the page.

## Validation

```sh
node --test tests/links.test.mjs
CHROMIUM_PATH=/usr/bin/chromium node --test tests/links-browser.mjs
```

The browser tests simulate ad outcomes and server redemption, so they generate no ad impressions. Live video playback still needs a configured ad service, inventory and a manual production smoke check. Tests cover verified reveal, no repeats, exhaustion, cancellation, no fill, missing proof, SDK/API errors, responsive layout and reload.
