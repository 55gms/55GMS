# @55gms/ads-edge

Express-compatible router for the 55GMS game server. It serves ads from a cached manifest, counts viewable impressions and clicks in memory, and reports hourly aggregates to the ad server. No dependencies beyond Node built-ins (Node 20+).

```js
import { createAdsRouter } from '@55gms/ads-edge';

const ads = createAdsRouter({
  adServerUrl: process.env.ADS_SERVER_URL,
  apiKey: process.env.ADS_API_KEY,
  spoolDir: process.env.ADS_SPOOL_DIR,
});
app.use('/_ads', ads);
```

## Routes

| Route | Purpose |
|---|---|
| `GET /serve?sizes=728x90,468x60` | One ad for the request's `Host`, or 204 |
| `GET /serve?slots=728x90,468x60;300x250` | Several slots in one call: `{ ads: [ad or null, ...] }`. Used by `ads.js`. On a host listed under the Google provider the reply is `{ ads: [null, ...], google: { client, slot } }` and `ads.js` renders an AdSense unit in each slot |
| `GET /site` | `{ google: true or false }`: whether Google fills the banner slots on the request's `Host`. For page scripts that must keep other ad code off those sites |
| `POST /i` | Body `{ serveId }` or `{ serveIds: [...] }`. Counts once per serve, within 10 minutes |
| `GET /c/:serveId` | Counts the click once and redirects to the campaign's click URL |
| `GET /m/:file` | An uploaded creative image named by the current manifest, cached from the ad server. Ads point here instead of at the ad server |

## Options

| Option | Default | Notes |
|---|---|---|
| `adServerUrl`, `apiKey` | required | Ad server origin and a key from Settings → API keys |
| `secret` | `ADS_EDGE_SECRET` | Signs serve IDs. Must be the same on every instance. A random per-process secret is used if unset |
| `spoolDir` | none | Durable buffer. Without it, a crash loses unsent counts |
| `flushIntervalMs` | 1 hour | At one hour or more, flushes align to the top of the hour plus `flushJitterMs` |
| `flushJitterMs` | 5 minutes | Random delay so instances do not report at once |
| `manifestRefreshMs` | 1 minute | |
| `spoolIntervalMs` | 1 minute | How often counters are written to disk |
| `spoolWarnBytes` | 50 MB | Logs a warning when the spool is larger |
| `instanceId` | stored in the spool | Stable ID used to split budgets between instances |
| `mountPath` | `/_ads` | Used to build click URLs |
| `trustForwardedHost` | `false` | Read `X-Forwarded-Host` instead of `Host` |
| `cacheMedia` | `true` | Serve uploaded creative images from this origin at `/m/<file>`, fetched once from the ad server and kept in memory. `false` sends browsers to the ad server's `/media` URL |
| `maxDomains` | `5000` | Distinct hosts served per batch. Ads serve on any well-formed hostname that is not switched off on the ad server; this bounds made-up `Host` values |
| `rateLimit` | `{ serve: 240, impression: 240, click: 60, windowMs: 60000 }` | Per IP |
| `handleSignals` | `true` | Flush on `SIGTERM`/`SIGINT`. Exits the process only if the host has no handler of its own |
| `logger` | JSON to stdout | `{ info, warn, error }` |

## Methods

- `ads.getStats()` returns counters, manifest version, pending batches, and spool size.
- `ads.flush()` seals the current counters into a batch and sends everything pending.
- `ads.close()` writes the spool, attempts a final flush, and stops timers.
- `ads.ready` resolves after the first manifest attempt.

## Behaviour during an outage

If the ad server is unreachable the edge keeps serving from the last good manifest until schedules or local budgets say stop; with no manifest at all it returns 204. Batches that cannot be sent stay in the spool and are resent oldest first with exponential backoff. A batch the ad server rejects as invalid is moved to `spool/rejected/` and logged, so it never blocks later batches and is never deleted silently.

Run `node edge/example/server.js` from the repository root for a small test site.
