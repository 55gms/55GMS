# Proxy stack

The browser shell and movie/TV players share `static/embed.html`. Each embed owns a Scramjet controller and an Epoxy transport. The service worker (`/sw.js`, registered with scope `/stream/`) routes each controller's frame prefix back to that controller over RPC; site pages are outside its scope and use the browser's normal fetch path.

The worker is deliberately not registered at `/`. Browsers that used an earlier stack still have that stack's worker there (or at the previous `/~/sj/` scope), and a replacement in the same scope cannot activate until the old worker has no requests in flight, which made startup time out on returning machines. `frame-runtime.js` unregisters those old registrations in the background without waiting on them. Because embed pages are not clients of the scoped worker, `static/sw.js` sends the controller restart notice to uncontrolled windows itself.

The compatible package versions are pinned in `package.json` and `package-lock.json`:

| Package                                | Version          |
| -------------------------------------- | ---------------- |
| `@mercuryworkshop/scramjet`            | `2.0.67-alpha.2` |
| `@mercuryworkshop/scramjet-controller` | `0.0.14`         |
| `@mercuryworkshop/scramjet-utils`      | `0.0.3`          |
| `@mercuryworkshop/epoxy-transport`     | `3.0.1`          |
| `@mercuryworkshop/wisp-js`             | `0.5.0`          |

Production's Wisp server is not in this table: it is epoxy-server, built from the commit pinned in `deploy/setup-epoxy.sh` (see [Wisp server](#wisp-server)).

`proxy-transports` replaces BareMux through the controller/core dependencies. Epoxy uses Wisp protocol version 2. The site connects to `/api/live/`; the server still accepts `/wisp/` for external clients. The embed no longer reads a saved endpoint from `localStorage`.

## Wisp server

Epoxy runs TLS inside the browser, so the Wisp server only relays encrypted TCP bytes between the visitor's websocket and the destination. Two servers can do that:

- **Built in** (the default): `index.js` routes websocket upgrades on `/api/live/` and `/wisp/` to `wisp-js`'s server, in every worker. This is what runs in Codespaces, locally, and on forks (`render.yaml`, `vercel.json`); nothing has to be set up.
- **epoxy-server** (production): the Rust server from [epoxy-tls](https://github.com/MercuryWorkshop/epoxy-tls), built from the commit in `deploy/setup-epoxy.sh` (the release whose client `epoxy-transport` bundles), runs as the `epoxy-server` systemd service on `127.0.0.1:8091`, and Caddy sends the two paths to it. The Node app runs with `WISP_SERVER=external`: it never loads `wisp-js`, and closes any Wisp upgrade that still reaches it. Proxy traffic then no longer shares the workers' event loops with chat and the API, and costs far less CPU and memory per connection.

`deploy/epoxy-server.toml` is its config. It blocks what `wisp-js` blocks by default: loopback, private, link-local and other non-public addresses, checked after DNS resolution. epoxy-server's own defaults allow all of them, so never drop those lines. The MOTD extension is off because it names the server and its version. A deploy that changes the config installs it at `/etc/epoxy-server/config.toml` and restarts the service; the deploy health check also expects epoxy-server to answer once its unit exists.

`node scripts/wisp-check.js <ws-url>` checks either server the way the proxy uses it: the handshake, a stream to a public site, and that `127.0.0.1`, `localhost`, `10.0.0.1` and `169.254.169.254` are closed as blocked. With no argument it checks the built-in server on `ws://127.0.0.1:8080/api/live/`.

### Switching production over

1. Push the code. With `WISP_SERVER` unset nothing changes yet.
2. On the server, as root, in `/root/55gms`: `bash deploy/setup-epoxy.sh`. It installs a C toolchain and rustup if missing, builds epoxy-server (the toolchain is the nightly that epoxy-tls pins), installs the binary, config and unit, starts the service and runs `wisp-check.js` against it.
3. In the Caddyfile's catch-all site block, send the Wisp paths to it ahead of the app, then `systemctl reload caddy`:

   ```
   @wisp path /api/live/* /wisp/*
   handle @wisp {
       reverse_proxy 127.0.0.1:8091
   }
   handle {
       reverse_proxy localhost:8080
   }
   ```

   The existing `reverse_proxy localhost:8080` moves inside the second `handle`. Open proxy tabs keep their connection to Node until they close; new ones go to epoxy-server. Check from outside with `node scripts/wisp-check.js wss://55gms.com/api/live/`.

4. Add `WISP_SERVER=external` to `/root/55gms/.env` and `pm2 reload ecosystem.config.cjs --update-env`. The startup log says `Wisp: external`.

To go back, undo it in reverse order: remove `WISP_SERVER` from `.env` and reload pm2 first, then put the plain `reverse_proxy localhost:8080` back in place of the two `handle` blocks and reload Caddy. In either direction, the server Caddy is about to send connections to must already be serving Wisp. `bash deploy/setup-epoxy.sh` again rebuilds and restarts epoxy-server, for example after changing `EPOXY_COMMIT` together with an `epoxy-transport` upgrade.

The Scramjet bundles (core, WASM, controller API, injection, worker and helpers) load from jsDelivr, not this server. They come from the renamed build in [TongSherbet/storage](https://github.com/TongSherbet/storage/tree/main/sj) (`jet.*`, globals `$jet`, `$jetController`, `$jetUtils`), the same versions as the table above. `scripts/build-proxy-cdn.js` downloads them from a pinned commit, patches them (below) and writes them under neutral names; they are committed to `lib/` in [55gms/assets](https://github.com/55gms/assets) and loaded from `https://cdn.jsdelivr.net/gh/55gms/assets@<commit>/lib/`:

| File               | Source          |
| ------------------ | --------------- |
| `vendor-core.js`   | `jet.core.js`   |
| `vendor-core.wasm` | `jet.wasm`      |
| `vendor-frame.js`  | `jet.api.js`    |
| `vendor-page.js`   | `jet.inject.js` |
| `vendor-worker.js` | `jet.sw.js`     |
| `vendor-util.js`   | `jet.utils.js`  |

The URL is pinned to a commit, so a cached page never mixes generations. The base appears in `static/embed.html`, `static/sw.js` (`importScripts`), `static/assets/js/frame-runtime.js` (`CDN_BASE`) and `scripts/smoke.mjs`. To change the bundles: run `node scripts/build-proxy-cdn.js <out-dir>`, commit the output to `lib/` in 55gms/assets, replace the commit in those four files, and bump `WORKER_URL` in `frame-runtime.js` because `sw.js` changes. Only the Epoxy transport is still served from `node_modules`, by `utils/proxyAssets.js` at `/assets/lib/vendor-net.js`.

`static/assets/js/frame-runtime.js` gives a replacement service worker a short grace period to activate, then starts on the one that is already active (it only insists on activation for a first install) and waits for the controller handshake before navigating; if a replacement worker activates later, `followWorker` re-points the controller at it. Registration and transport initialization run concurrently, with bounded startup deadlines.

The HTTP cache plugin stores upstream bytes for scripts, styles, fonts, images, and WASM, respecting upstream cache directives. A policy wrapper excludes media streams, range requests, API responses, mismatched content types, and responses declaring more than 8 MiB. Cached upstream bytes are rewritten again for the requesting frame's prefix.

When publishing a new proxy generation, reload existing proxy/media tabs. The new controller uses its own cookie store; legacy proxied site sessions may require signing in again. The site's own login is unaffected. Do not delete the legacy IndexedDB store as part of this upgrade.

## Neutral naming

Nothing the browser requests or renders for the player names the libraries. Served site files (`embed.html`, `sw.js`, `frame-runtime.js`, the media pages) look the bundles' globals up by assembled name and expose them as `frameRuntime.core` and friends. Frame URLs are `/stream/<controller>/<frame>/<token>`, where the token is the controller codec's XOR + base64url encoding of the destination; the watch pages pass the same token to the embed as `/embed.html#~<token>` (`mediaPlayer.token` in `player.js` must stay in sync with the codec). The browser shell (`static/browser.html`, served at `/b`) passes the same token via `frameHash` in `browser.js`; the embed still accepts a plain URL in the hash.

The core tags frame URLs with request metadata (`$io=<origin>`, `$rfs=<referrer>`, `$dest`, …) as a plain query string. `scripts/build-proxy-cdn.js` edits `vendor-core.js` so that query is packed into a single `?_=<token>` parameter with the same codec, and unpacked where the core reads it. Static `import` specifiers are the exception: the WASM rewriter writes `?%24module=module&%24io=<origin>` itself and ties its output to a position map, so that tail is swapped in place for a same-length `?_=.<rotated text>` instead. The anchors it edits must each match exactly once or the build fails, so re-check them when the source changes.

The renamed core defines its realm helper as `$jet$setrealmfn`, but the rebuilt WASM still emits calls to `$scramjet$setrealmfn`, which would throw in any page whose code it rewrites that way. The build gives both the same 20-character name, `$jet$setrealmfn_____`, swapping the WASM bytes in place so its string data keeps its length. It also swaps the one other `scramjet` string in the WASM, an error message.

`WORKER_URL` in `frame-runtime.js` is deliberately a fixed string: bumping it makes a returning browser install a second worker, which cannot take over while the old one still has frame requests pending, and the embed then fails with "The service worker did not activate". Change it only when `sw.js` or the worker bundle changes.

Limits: the bundle bodies still contain their own names.

Run the targeted checks without a browser:

```sh
node --test tests/media-player.test.js tests/proxy-runtime.test.js test/proxy-integrity.test.js
node --check index.js
node --check static/sw.js
node --check static/assets/js/frame-runtime.js
```

The tests exercise real installed bundles, HTTP asset routes, cache behavior, worker upgrade/failure paths, and the browser-shell/media navigation bridge. They do not prove third-party movie or TV playback.

Upstream references: [Scramjet demo initialization](https://github.com/MercuryWorkshop/scramjet/blob/main/packages/demo/src/index.tsx), [controller worker](https://github.com/MercuryWorkshop/scramjet/blob/main/packages/demo/public/sw.js), [BareMux replacement](https://github.com/MercuryWorkshop/bare-mux).
