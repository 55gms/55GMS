# Proxy stack

The browser shell and movie/TV players share `static/embed.html`. Each embed owns a Scramjet controller and an Epoxy transport. The service worker (`/sw.js`, registered with scope `/~/sj/`) routes each controller's frame prefix back to that controller over RPC; site pages are outside its scope and use the browser's normal fetch path.

The worker is deliberately not registered at `/`. Browsers that used an earlier stack still have that stack's worker there, and a replacement in the same scope cannot activate until the old worker has no requests in flight, which made startup time out on returning machines. `proxy-runtime.js` unregisters any root-scope registration in the background without waiting on it. Because embed pages are not clients of the scoped worker, `static/sw.js` sends the controller restart notice to uncontrolled windows itself.

The compatible package versions are pinned in `package.json` and `package-lock.json`:

| Package                                | Version          |
| -------------------------------------- | ---------------- |
| `@mercuryworkshop/scramjet`            | `2.0.67-alpha.2` |
| `@mercuryworkshop/scramjet-controller` | `0.0.14`         |
| `@mercuryworkshop/scramjet-utils`      | `0.0.3`          |
| `@mercuryworkshop/epoxy-transport`     | `3.0.1`          |
| `@mercuryworkshop/wisp-js`             | `0.5.0`          |

`proxy-transports` replaces BareMux through the controller/core dependencies. Epoxy uses Wisp protocol version 2 at the existing `/wisp/` endpoint. Saved Wisp endpoint settings still apply.

`utils/proxyAssets.js` serves the package distributions under `/scram`, `/controller`, `/scramjet-utils`, and `/epoxy`. Core, WASM, API, injection, worker, transport, and helper URLs include their versions so an upgrade does not mix cached generations. `static/assets/js/proxy-runtime.js` waits for the new service worker to activate and for the controller handshake before navigating. Registration and transport initialization run concurrently, with bounded startup deadlines.

The HTTP cache plugin stores upstream bytes for scripts, styles, fonts, images, and WASM, respecting upstream cache directives. A policy wrapper excludes media streams, range requests, API responses, mismatched content types, and responses declaring more than 8 MiB. Cached upstream bytes are rewritten again for the requesting frame's prefix.

When publishing a new proxy generation, reload existing proxy/media tabs. The new controller uses its own cookie store; legacy proxied site sessions may require signing in again. The site's own login is unaffected. Do not delete the legacy IndexedDB store as part of this upgrade.

Run the targeted checks without a browser:

```sh
node --test tests/media-player.test.js tests/proxy-runtime.test.js
node --check index.js
node --check static/sw.js
node --check static/assets/js/proxy-runtime.js
```

The tests exercise real installed bundles, HTTP asset routes, cache behavior, worker upgrade/failure paths, and the browser-shell/media navigation bridge. They do not prove third-party movie or TV playback.

Upstream references: [Scramjet demo initialization](https://github.com/MercuryWorkshop/scramjet/blob/main/packages/demo/src/index.tsx), [controller worker](https://github.com/MercuryWorkshop/scramjet/blob/main/packages/demo/public/sw.js), [BareMux replacement](https://github.com/MercuryWorkshop/bare-mux).
