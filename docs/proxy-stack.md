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

`proxy-transports` replaces BareMux through the controller/core dependencies. Epoxy uses Wisp protocol version 2. The site connects to `/api/live/`; the server still accepts `/wisp/` for external clients. The embed no longer reads a saved endpoint from `localStorage`.

`utils/proxyAssets.js` serves exactly seven bundle files under neutral names in `/assets/lib/` (`vendor-core.js`, `vendor-core.wasm`, `vendor-frame.js`, `vendor-page.js`, `vendor-worker.js`, `vendor-util.js`, `vendor-net.js`); the package directories themselves are not mounted. Core, WASM, API, injection, worker, transport, and helper URLs include their versions so an upgrade does not mix cached generations. `static/assets/js/frame-runtime.js` gives a replacement service worker a short grace period to activate, then starts on the one that is already active (it only insists on activation for a first install) and waits for the controller handshake before navigating; if a replacement worker activates later, `followWorker` re-points the controller at it. Registration and transport initialization run concurrently, with bounded startup deadlines.

The HTTP cache plugin stores upstream bytes for scripts, styles, fonts, images, and WASM, respecting upstream cache directives. A policy wrapper excludes media streams, range requests, API responses, mismatched content types, and responses declaring more than 8 MiB. Cached upstream bytes are rewritten again for the requesting frame's prefix.

When publishing a new proxy generation, reload existing proxy/media tabs. The new controller uses its own cookie store; legacy proxied site sessions may require signing in again. The site's own login is unaffected. Do not delete the legacy IndexedDB store as part of this upgrade.

## Neutral naming

Nothing the browser requests or renders for the player names the libraries. Served site files (`embed.html`, `sw.js`, `frame-runtime.js`, the media pages) look the bundles' globals up by assembled name and expose them as `frameRuntime.core` and friends. Frame URLs are `/stream/<controller>/<frame>/<token>`, where the token is the controller codec's XOR + base64url encoding of the destination; the watch pages pass the same token to the embed as `/embed.html#~<token>` (`mediaPlayer.token` in `player.js` must stay in sync with the codec). The browser shell (`static/browser.html`, served at `/b`) passes the same token via `frameHash` in `browser.js`; the embed still accepts a plain URL in the hash.

The core tags frame URLs with request metadata (`$io=<origin>`, `$rfs=<referrer>`, `$dest`, …) as a plain query string. `utils/proxyAssets.js` edits `vendor-core.js` as it serves it (`packFrameQuery`) so that query is packed into a single `?_=<token>` parameter with the same codec, and unpacked where the core reads it. Static `import` specifiers are the exception: the WASM rewriter writes `?%24module=module&%24io=<origin>` itself and ties its output to a position map, so that tail is swapped in place for a same-length `?_=.<rotated text>` instead. The four anchors it edits must each match exactly once or the server refuses to start, so re-check them on a core upgrade, and bump `CORE_VERSION` whenever the edits change. `WORKER_URL` in `frame-runtime.js` is deliberately a fixed string: bumping it makes a returning browser install a second worker, which cannot take over while the old one still has frame requests pending, and the embed then fails with "The service worker did not activate". Change it only when `sw.js` or the worker bundle changes.

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
