# Client-asset build, phases 3 to 5 (context for later specs)

Date: 2026-10-08

This is a planning note, not an approved spec. Phases 1 and 2 are specified in
`2026-10-08-deploy-and-build-design.md`. Each phase below becomes its own
brainstorm → spec → plan when its turn comes. Captured now so the context
transfers cleanly.

All three phases extend the same build (`scripts/build.js`, stages under
`scripts/build/`, per-build secrets in `manifest.json`, read live by the
server). They rotate or hide the proxy surface, which carries far more risk
than phases 1-2, so they ship one at a time with their own verification.

## The do-not-touch list (applies to every phase)

These are live runtime contracts, not fingerprints. The build must never
rename, re-encode or rotate them:

- `/api/*` route paths and the JSON request/response field names the routers
  read.
- Socket.IO event names (`authenticate`, `join_chat`, `send_message`,
  `user_status_change`, …) and room-name prefixes (`user_`, `chat_`).
- The `/stream/` service-worker scope, the `/api/live/` and `/wisp/`
  endpoints, and the `#~<token>` embed-hash sentinel.
- Account/save contracts: the Postgres schema and the `bcrypt(sha256hex)`
  password scheme (the Worker API is gone as of 2026-10-02), and the session
  cookie format.
- Anything under `static/misc/` and the Unity loader / `.unityweb` files.
- Form `name` attributes on login/signup/account that post to real handlers.

## Phase 3 — Randomize the vendor bundle names

Today `utils/proxyAssets.js` maps seven fixed neutral URLs
(`/assets/lib/vendor-core.js`, `-frame`, `-page`, `-worker`, `-util`, `-net`,
`-core.wasm`). Phase 3 generates fresh random names per build, writes the
mapping into `manifest.json`, has `mountProxyAssets` read the manifest instead
of the hardcoded table, and rewrites the references.

References to rewrite (found 2026-10-08): `static/embed.html` (4 tags),
`static/sw.js:1` (`importScripts`), `static/assets/js/frame-runtime.js`
(`CORE_VERSION`/`CONTROLLER_VERSION` template paths at lines 360-362, and
`maskedfiles: ["vendor-page.js", …]` at 368). `tests/proxy-runtime.test.js`
asserts `/assets/lib/vendor-worker.js?v=0.0.14` and would need the manifest
too. Keep the `?v=<pinned version>` so cached generations do not mix.

Note: `frame-runtime.js` is excluded from JS obfuscation in phase 2, so phase
3 is the first stage to edit it — add a count guard.

## Phase 4 — Rename CSS selectors

Collect every class and id across `assets/css/`, the page shells and
`assets/js/`, assign random replacements, rewrite all three consistently.

Keep-list (do not rename): anything the proxy runtime or SDKs look up by name;
any id/name/class a client script hands to the server or Socket.IO; the form
field names already on the server keep-list. Selectors used only for styling
and local DOM lookups are safe.

Risk: the 196 game pages under `static/misc/` load site CSS (`style.css`,
`nav.css`, `game-loader.css`, `loader-ui.css`, `games.css`, `gameframe.css`,
`unity-cdn-loader.css`) but are themselves never rewritten. Any selector those
pages reference by literal string in their own markup must be on the
keep-list, or renaming it in the shared CSS breaks the game chrome. This needs
a scan of `static/misc/**` for class/id usage of shared stylesheets before the
rename map is built.

## Phase 5 — De-brand the proxy bundles and re-key the frame token

The riskiest phase. Two parts.

**De-brand the bundle bodies.** `proxy-stack.md` records the current limit:
the bundles still contain their own names. Counts as of 2026-10-08 (brand
identifiers, from the installed bundles): `vendor-core.js` ~73,
`vendor-frame.js` ~41, `vendor-util.js` ~29, `vendor-page.js` ~11, two each in
`-worker.js` and `-core.wasm`, zero in `-net.js`. Rename `$scramjet$*` protocol
keys (`$scramjet$messagetype`, `$scramjet$origin`, `$scramjet$data`, …),
`SCRAMJETCLIENT*`, `ScramjetController`/`__scramjet_controller*`,
`scramjetConfig`, the IndexedDB name and startup log strings — consistently
across every bundle **and** `sw.js` so the RPC still matches. Minify, but do
**not** run RC4/control-flow obfuscation over the 221 KB core (runs on every
proxied request) — too slow. The 1.7 MB `-net.js` has no brand strings; leave
it alone. The `.wasm` has two brand hits inside a bundled string table
(`endjsmap…scramjet`); decide per-phase whether patching the wasm is worth it.

**Pick one fixed neutral IndexedDB name**, chosen once and reused every build.
A per-build database name logs every proxy user out of their proxied sessions
on every deploy.

**Re-key the frame-token codec — only when chosen, not every build.** The
token is XOR + base64url of the destination. Four places must agree
(`proxy-stack.md`): the controller core, `static/sw.js`, `mediaPlayer.token`
in the media player, and `frameHash` in `static/assets/js/browser.js`
(`browser.js:391`, XOR `37 + (i % 7)` today). A mismatch silently breaks media
and the in-site browser. Rotating per build also invalidates every open proxy
tab and changes `sw.js`, forcing a service-worker update for all users — so
this is a manual, opt-in rotation, gated behind a build flag, not automatic.

**Verification (the spec's explicit request).** Run `tests/media-player.test.js`,
`tests/proxy-runtime.test.js` and `test/proxy-integrity.test.js` against the
built `dist/.../static` so the re-key and de-brand are proven end to end, plus
`node --check` on the transformed `sw.js` and `frame-runtime.js`. Count guards
on every bundle rewrite catch upstream drift when the pinned proxy versions
(`scramjet 2.0.67-alpha.2`, `scramjet-controller 0.0.14`, `epoxy-transport
3.0.1`, `wisp-js 0.5.0`) are next bumped.
