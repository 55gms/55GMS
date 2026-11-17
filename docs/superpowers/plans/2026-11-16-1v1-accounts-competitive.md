# 1v1.lol on 55GMS Accounts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A signed-in 55GMS player gets everything a logged-in 1v1.lol player gets (competitive with server-decided results, rating, leaderboards, progress, cosmetics, coins bought through Stripe, the battle pass with Premium as its premium track), with 55GMS as the game's backend.

**Architecture:** The 1v1.lol page (`static/misc/nowgg/index.html`) replaces the game's Firebase login with a 55GMS one and sends every call meant for the game's dead Cloud Functions backend to a new `/api/1v1/*` router in 55GMS, which keeps all account data in Postgres. The multiplayer server (`../multiplayer`, a separate repo) learns who each player is from a game-scoped token, matches ranked players by rating, watches each match's relayed events to decide the result itself, and posts results to 55GMS over a loopback-only endpoint. Coins are Stripe one-off payments through the existing billing code; ad rewards are 55GMS Ads grants redeemed server-side.

**Tech Stack:** Node.js ES modules, Express 4, Sequelize/Postgres (55GMS); plain Node + `ws` Photon server (multiplayer); Stripe; Playwright-driven `tools/capture.mjs` for recording game traffic.

**Spec:** `docs/superpowers/specs/2026-11-16-1v1-accounts-competitive-design.md`

## Global Constraints

- **No automated tests.** The owner's global instructions forbid writing or running tests unless asked; this overrides the TDD steps of the plan template. Each task is verified by the commands in its verify step (syntax checks, `curl`, `psql`, capture runs, screenshots), never by a test suite.
- Commit as you go, with semantic messages (`feat:`, `fix:`, `docs:`, `chore:`), each ending with the line `Claude-Session: https://claude.ai/code/session_01KSe7HdMCLmY1pyT8NCTyey`. Work on branch `feat/1v1-accounts` in both repos (55GMS: branch from the current `fix/1v1-multiplayer`; multiplayer: from `main`).
- Game files in `55gms/assets` (`../assets/misc/nowgg/`) are never edited. All client hooks live in `static/misc/nowgg/index.html`.
- The game page is never rebuilt by `npm run build`; any `/assets/*` reference it gains carries its own `?v=`.
- Nothing the browser sends may set rating, wins, XP, stats, coins, owned items or battle pass progress. The game's own `rating/updateMMR` and `player/updateProgressAndStats` calls answer success and change nothing.
- Prices and item lists are read from the server's config (Task 3), never from the request.
- Every coin change is one row in `onev1_coin_ledger` with a unique `source`; a repeated source is a no-op.
- Guests (no 55GMS account) keep playing casual exactly as today.
- In-game name of a signed-in player is their 55GMS handle; `player/nickname` changes nothing for them.
- Coin packs and prices, copied from `coins_data`: `lol.1v1.coins.pack.1` 100 coins $0.99, `.2` 420 $3.99, `.3` 770 $6.99, `.4` 1150 $9.99, `.5` 2400 $19.99, `.6` 6500 $49.99.
- Battle pass: `win_xp` 50, `lose_xp` 25, `tier_up_price` 100 coins, one season (`current_season` 1, no rollover); premium track = `users.premium` at claim time; `battlePass/buyPremium` sends the player to `/premium`.
- Refund or dispute of a coin pack debits its coins even below zero; a negative balance blocks spending.
- A refund or dispute is recognised from the payment intent's coin metadata, not from an earlier ledger credit, so it debits even if it arrives first; one on a charge without that metadata is logged and acknowledged (200), never retried forever.
- 2v2: a result counts when at least one stream from each team agrees and no two streams contradict; a leaver takes the loss alone.
- Ranked anti-abuse: the same two accounts earn rating from each other at most 3 times per rolling 24 h (multipliers 1, 0.5, 0.25, then 0); at most 20 rated matches per account per rolling hour.
- A mode whose result the referee cannot read gives no XP, stats, rating or battle pass progress, and a competitive mode in that state is removed from `competitive_modes`. If ranked `1v1_Competitive` cannot be read, **stop and report to the owner** (Task 2 gate).

## Review Focus

1. **Signed out mid-session** (logged out on another tab, session expired): the game must fall back to guest without errors, and `/api/1v1/*` must answer 401 so the page can send the player to sign in; never act on a stale token. Covered in Task 10 and Task 11 verify.
2. **Same Stripe event delivered twice, or out of order** (refund before the completed checkout reaches us): coins credited once; the late refund still debits. Covered in Task 8 verify.
3. **Player disconnects or the tab closes mid-ranked-match:** leaver loses, the other wins, the result is posted once even if both peers drop together. Covered in Task 13 verify.
4. **Multiplayer server can't reach 55GMS** (55GMS restarting during a rolling deploy): results queue and retry; nothing is lost or double-applied (idempotent `match_id`). Covered in Task 13 verify.
5. **Two tabs of the same account** buy or claim at the same time: balance never goes below zero from spending, a reward is never claimed twice. Covered in Task 5 verify.

---

## File Structure

55GMS:

| File                                                                                                        | Responsibility                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/1v1-backend.md` (new)                                                                                 | Reference: every backend call's request and reply shapes, login flow, shop flow, rv flow (Task 1), plus how the backend works (Task 15) |
| `scripts/add-1v1.js` (new)                                                                                  | Migration for the `onev1_*` tables; also called from `setup-db.js`                                                                      |
| `models/OneV1Profile.js`, `OneV1Item.js`, `OneV1BattlePass.js`, `OneV1CoinLedger.js`, `OneV1Match.js` (new) | Sequelize models; exported from `models/index.js`                                                                                       |
| `utils/1v1-config.json` (new)                                                                               | The game config the server and page share: `SettingsV6` and `BattlePass`                                                                |
| `services/onev1Config.js` (new)                                                                             | Loads the config; price, item and tier lookups                                                                                          |
| `services/onev1.js` (new)                                                                                   | Profile, cosmetics, spending, battle pass, leaderboards, match results                                                                  |
| `services/onev1Coins.js` (new)                                                                              | Coin ledger, Stripe coin checkout, refunds and disputes, ad-grant redemption                                                            |
| `routes/onev1.js` (new)                                                                                     | `/api/1v1/*`: token, config, the game's backend paths, internal endpoints                                                               |
| `utils/features.js`, `index.js`                                                                             | `features.onev1` switch and mounting                                                                                                    |
| `services/billing.js`, `scripts/setup-stripe.js`                                                            | Payment-mode webhook events routed to `onev1Coins`; coin prices created                                                                 |
| `static/assets/js/auth.js`, `static/login.html`, `static/signup.html`, `static/choose-handle.html`          | `?next=` return after sign-in                                                                                                           |
| `static/misc/nowgg/index.html`                                                                              | Login shim, backend rewrite, token on the Photon URL, config from the server, ad grant capture                                          |
| `setup-db.js`, `EXAMPLE.env`, `CLAUDE.md`, `docs/multiplayer.md`                                            | Wiring and docs                                                                                                                         |

multiplayer:

| File                             | Responsibility                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `docs/1v1-match-events.md` (new) | Reference: which relayed events show kills, rounds and match end, per mode (Task 2)        |
| `games/1v1/accounts.js` (new)    | Verifies game tokens with 55GMS, caches the result; posts match results with a retry queue |
| `games/1v1/nameserver.js`        | `authenticate` uses `accounts.js`                                                          |
| `games/1v1/master.js`            | Ranked modes: accounts only, rating-range matching                                         |
| `games/1v1/referee.js` (new)     | Per-room match state from relayed events; decides and reports the result                   |
| `games/1v1/game.js`              | Feeds `RaiseEvent`, joins and leaves to the referee                                        |
| `README.md`, `deploy/` unit env  | Docs and the two new env vars                                                              |

---

### Task 1: Reverse-engineer the game's backend calls

**Files:**

- Create: `docs/1v1-backend.md` (55GMS)

**Interfaces:**

- Produces: the reference every later 55GMS task reads. For each path in the spec's call table it must give: HTTP method, how the token is sent (header name and format), request body fields with types, the reply JSON the game parses (field names, types, which are required), and what the game does on an error status. Also these flows, step by step: (a) how the game decides it is logged in on load (what it reads: `kLCGoogleLoginSessionExists`, `firebase.auth().currentUser`, the result of `firebaseLogin`, `player/login`); (b) what it sends to Photon that identifies the logged-in player (auth values, custom properties); (c) the WebGL shop purchase flow from pressing a coin pack (what `product/xsollaToken` returns and how the game opens it, what it polls); (d) the rewarded-ad flow for `player/rv` and `product/rvCoinPurchase` (which JS function the game calls to show the ad, through `js/IronSourceRV.js` and the 55GMS Ads compat stand-in, and what it sends afterwards); (e) which calls the competitive button and the shop make a guest do, so the page knows when to send them to sign in.

- [ ] **Step 1: Dump the IL2CPP metadata.** Extract `global-metadata.dat` from the concatenated, gunzipped `Build/webgl - rc.data.unityweb.part{1..4}` (UnityWebData container) and run Il2CppDumper (or Cpp2IL) with the gunzipped `webgl - rc.wasm.code.unityweb`. Work in the session scratchpad; nothing from it is committed. Expected: `dump.cs` with the backend request/response classes (search for the path strings and `Newtonsoft`/`JsonProperty` field names).
- [ ] **Step 2: Fill in the shapes from the dump**, then confirm each at runtime: serve the page locally (`STATIC_ROOT=static node .` plus the multiplayer server, as in `docs/multiplayer.md`), add a temporary local-only interceptor in the page that logs every request to the backend base and answers from a scratch JSON file, and walk the menu, locker, shop, battle pass, leaderboard and competitive screens with `../multiplayer/tools/capture.mjs` and screenshots. Iterate on the replies until each screen renders without errors. The interceptor is not committed.
- [ ] **Step 3: Write `docs/1v1-backend.md`** with everything listed under Produces, including the working sample reply for each call.
- [ ] **Step 4: Commit** `docs: 1v1.lol backend calls and flows`.

### Task 2: Record what a match looks like on the wire (gate)

**Files:**

- Create: `docs/1v1-match-events.md` (multiplayer)

**Interfaces:**

- Consumes: Task 1's login flow (to put two local pages in logged-in state for competitive modes, using the scratch interceptor).
- Produces: for each mode in `competitive_modes` and `casual_modes` (spec config): the event codes / PUN RPC ids and payload fields that show a kill (killer, victim), a round end and the match end with its winner, and how a leave shows; whether each player's stream carries them; and a final table `mode | readable | how the winner is decided`.

- [ ] **Step 1: Capture two-player matches** per mode with `tools/capture.mjs --pages 2 --mp ws://localhost:8093/api/mp --hex` and `MP_DEBUG=1`, playing to a finish (scripted clicks and keys; a long `--secs`). Also capture one match where a player closes the tab (`--close-at`).
- [ ] **Step 2: Decode the RPC table.** PUN sends RPCs as event 200 with a method name or a shortcut index into the RPC list; map the indices to names from Task 1's `dump.cs` (PhotonServerSettings RpcList) and find the kill / death / round / match-end RPCs and their arguments.
- [ ] **Step 3: Write `docs/1v1-match-events.md`.**
- [ ] **Step 4: Gate.** If `1v1_Competitive` has no readable winner, stop the plan here and report to the owner with the evidence. Otherwise commit `docs: what 1v1.lol matches send`.

### Task 3: Tables, models, shared config and the feature switch

**Files:**

- Create: `scripts/add-1v1.js`, the five models, `utils/1v1-config.json`, `services/onev1Config.js`
- Modify: `models/index.js`, `setup-db.js`, `utils/features.js`, `EXAMPLE.env`

**Interfaces:**

- Produces:
  - Tables (all `uuid VARCHAR(255) REFERENCES users(uuid) ON DELETE CASCADE` where present):
    - `onev1_profiles(uuid PK, xp INT DEFAULT 0, level INT DEFAULT 1, stats JSONB DEFAULT '{}', ratings JSONB DEFAULT '{}' /* mode -> {rating, games} */, equipped JSONB DEFAULT '{}', settings JSONB DEFAULT '{}', rv JSONB DEFAULT '{}', created_at, updated_at)`
    - `onev1_items(uuid, item_id VARCHAR(128), source VARCHAR(32), acquired_at, PK(uuid, item_id))`
    - `onev1_battle_pass(uuid, season INT, xp INT DEFAULT 0, claimed_free JSONB DEFAULT '[]', claimed_premium JSONB DEFAULT '[]', PK(uuid, season))`
    - `onev1_coin_ledger(id BIGSERIAL PK, uuid, delta INT NOT NULL, reason VARCHAR(32) NOT NULL, source VARCHAR(255) UNIQUE NOT NULL, created_at)`; index on `uuid`
    - `onev1_matches(match_id VARCHAR(64) PK, mode VARCHAR(64), rated BOOLEAN, players JSONB /* [{uuid, team, outcome, kills, deaths}] */, rating_changes JSONB, created_at)`; index on `created_at`
  - `features.onev1 = features.accounts && features.database && ACCOUNT_BACKEND === "postgres" && ADMIN_TOKEN_SECRET && MP_SHARED_SECRET` (new env var, a long random string shared with the multiplayer server; add to `EXAMPLE.env` with a comment).
  - `utils/1v1-config.json`: `{ "SettingsV6": {...}, "BattlePass": {...} }`, the objects from `setDefaultValues` in `../assets/misc/nowgg/js/firebase-config.js`, with `emotes_data`, `bp_boost_data`, `rv_settings`, `main_menu_settings` added as the page does today, and any fields Task 1 found the game needs.
  - `services/onev1Config.js`: `gameConfig()` → the parsed JSON; `skinPrice(itemId) -> {currency, amount} | null`; `coinPack(productId) -> {amount, priceCents} | null`; `battlePassTiers() -> [{xp, free_rewards, premium_rewards}]`; `competitiveModes() -> string[]` (minus modes Task 2 marked unreadable); `SEASON = 1`.

- [ ] **Step 1:** Write `scripts/add-1v1.js` in the style of `scripts/add-billing.js` (`CREATE TABLE IF NOT EXISTS`, safe to re-run), call the same statements from `setup-db.js`, add the models and exports.
- [ ] **Step 2:** Add `features.onev1`, the config JSON and `services/onev1Config.js`.
- [ ] **Step 3: Verify:** `node scripts/add-1v1.js` twice against the local database prints ok both times; `psql -c '\d onev1_coin_ledger'` shows the unique index on `source`; `node --check` on every new file.
- [ ] **Step 4: Commit** `feat: tables and config for the 1v1.lol backend`.

### Task 4: The `/api/1v1` router: token, config, auth and internal endpoints

**Files:**

- Create: `routes/onev1.js`
- Modify: `index.js` (mount under `features.onev1`; add `/api/1v1` to the 503 `featureOff` paths when off)

**Interfaces:**

- Consumes: `createScopedToken`, `verifyScopedToken`, `readSession` (`utils/sessionToken.js`).
- Produces:
  - `POST /api/1v1/token` (session required) → `{ token, handle, uuid }`; `token = createScopedToken(uuid, "1v1", 12 * 3600e3)`. 401 when signed out; 409 `{ error: "handle_pending" }` when the account must choose a handle.
  - `GET /api/1v1/config` → `gameConfig()` with `competitive_modes` from `competitiveModes()`; public, `Cache-Control: public, max-age=300`.
  - Game backend paths are mounted at `/api/1v1/fn/<path>` (the page rewrites `https://us-central1-justbuild-cdb86.cloudfunctions.net/<path>` to it). Middleware `requireGameToken` reads the token where Task 1 says the game sends it, sets `req.uuid`, and answers 401 otherwise. Each path is filled in by Tasks 5–8; until then, and for `analytics`, they answer the empty success shape from `docs/1v1-backend.md`. `userSettings/time` is answered here too (same reply the multiplayer server gives today).
  - Internal: `router.use("/1v1/internal", requireInternal)`: allowed only when `req.socket.remoteAddress` is loopback **and** header `x-mp-secret` equals `MP_SHARED_SECRET` (constant-time compare). `POST /api/1v1/internal/verify {token}` → `{ uuid, handle, ratings }` or 404. `POST /api/1v1/internal/match` is Task 7's.
  - Rate limits: `express-rate-limit` (already a dependency; check `package.json`) at 120 req/min per uuid on `/1v1/fn`.

- [ ] **Step 1:** Write the router and mount it.
- [ ] **Step 2: Verify:** signed-in `curl -X POST -H "X-GMS-Session: …" localhost:8080/api/1v1/token` returns a token; signed out → 401; `curl localhost:8080/api/1v1/config | jq '.SettingsV6 | fromjson? // . | keys'` lists the sections; `/internal/verify` from loopback with the secret returns the account, without the secret → 403.
- [ ] **Step 3: Commit** `feat: /api/1v1 router with game tokens and internal endpoints`.

### Task 5: Account, settings and cosmetics calls

**Files:**

- Create: `services/onev1.js`
- Modify: `routes/onev1.js`

**Interfaces:**

- Consumes: Task 3 models and config; Task 1 shapes.
- Produces (`services/onev1.js`): `getOrCreateProfile(uuid) -> profile`; `loginReply(uuid) -> object` (the `player/login` / `player` reply: handle as nickname, level, xp, stats, ratings, owned items, equipped, coin balance, premium flag); `equip(uuid, kind, itemId)` (rejects items not owned); `updateEmotes(uuid, payload)`; `saveSettings(uuid, scope, payload)` (`userSettings/group|single`, stored in `settings`, max 16 KB); `coinBalance(uuid) -> int` (sum of ledger); `buySkin(uuid, itemId) -> {ok, balance}` (price from `skinPrice`, currency `LC` only; in one transaction: `SELECT … FOR UPDATE` on the profile row, check balance ≥ price and not owned, insert ledger row `source = "skin:<uuid>:<itemId>"`, insert item).
- Routes: `player/login`, `player`, `player/nickname` (no-op success), `player/skins*`, `player/skins/*/equip*`, `player/skins/character/pack`, `player/emotes*`, `userSettings*`, `product/coinPurchase` (spend coins on a skin), `rating/updateMMR` and `player/updateProgressAndStats` (success, no change), `product/validateReceipt*` (refuse: no app stores).

- [ ] **Step 1:** Implement the service and routes.
- [ ] **Step 2: Verify** with `curl` and a token from Task 4: a new account logs in with 0 coins and default skins; buying with 0 coins fails; insert a `+1000` ledger row by hand, buy `lol.1v1.playerskins.pack.1` → balance 900 and owned; buying it again fails; two concurrent buys of different 900-coin skins with 1000 coins → exactly one succeeds (Review Focus 5); equipping an unowned skin fails.
- [ ] **Step 3: Commit** `feat: 1v1.lol accounts, settings and cosmetics on 55GMS`.

### Task 6: Battle pass and leaderboards

**Files:**

- Modify: `services/onev1.js`, `routes/onev1.js`

**Interfaces:**

- Produces: `battlePassState(uuid) -> {season, xp, tier, claimedFree, claimedPremium, premium}`; `claimReward(uuid, tier, track)`: in one transaction, lock the row, require tier reached, not claimed, and for `track === "premium"` `users.premium` true now; grant items with `source "bp"` or coins via ledger `source "bp:<uuid>:<season>:<track>:<tier>"`; `buyTierUp(uuid)` spends `tier_up_price` via ledger `source "tierup:<uuid>:<season>:<n>"` where `n` is the tier being bought; `addBattlePassXp(uuid, xp, transaction)` (used by Task 7); `leaderboard(mode, limit = 100) -> [{handle, rating, games}]` ordered by rating, only accounts with ≥ 5 rated games in that mode, and `leaderboardInfo(uuid, mode) -> {rank, rating}`.
- Routes: `battlePass`, `battlePass/claimReward`, `battlePass/earnRewards` (same as claim per Task 1's shape), `battlePass/buyTierUp`, `battlePass/buyPremium` (reply in the game's error/redirect shape and the page opens `/premium`; see Task 10), `player/boostBattlePassRewards` (the `bp_boost_data` behaviour per Task 1, server-decided), `leaderboards`, `leaderboards/info`, `rating`.

- [ ] **Step 1:** Implement.
- [ ] **Step 2: Verify:** with XP set by hand, claim free tier 0 → item owned; claim again → refused; premium claim with `users.premium=false` → refused, set true → granted; tier-up with 99 coins → refused; leaderboard returns handles in rating order.
- [ ] **Step 3: Commit** `feat: 1v1.lol battle pass and leaderboards`.

### Task 7: Applying match results

**Files:**

- Modify: `services/onev1.js`, `routes/onev1.js`

**Interfaces:**

- Consumes: `addBattlePassXp`.
- Produces: `POST /api/1v1/internal/match` with body `{ matchId: string, mode: string, rated: boolean, teams: [[uuid,...],[uuid,...]], winner: 0 | 1 | null, players: [{uuid, kills, deaths, left: boolean}] }` → `{ applied: boolean, ratingChanges: {uuid: delta} }`. `applyMatch(body)`:
  - idempotent: insert into `onev1_matches` first; on conflict return `{applied: false}`;
  - guests are absent from `players`/`teams` (the referee leaves them out); a match with no accounts is ignored;
  - XP: winner team `win_xp` 50, others `lose_xp` 25, added to profile `xp` (level from the game's XP curve per Task 1) and battle pass XP; stats: wins, losses, kills, deaths, matches per mode;
  - rating (only when `rated` and `winner !== null`): Elo, start 1000, K = 32, team rating = mean; per account the delta is multiplied by the pair factor (for 1v1: number of rated matches between the same two accounts in the last 24 h, counted from `onev1_matches.players`, 0→1, 1→0.5, 2→0.25, ≥3→0; for 2v2 the lowest factor over cross-team pairs), and is 0 once the account has 20 rated matches in the last hour; floor at 0.
  - all in one transaction.

- [ ] **Step 1:** Implement.
- [ ] **Step 2: Verify** with `curl` from loopback: the same `matchId` twice → second `applied:false` and no double XP; four consecutive rated matches between the same two accounts give deltas 16, 8, 4, 0 (from equal ratings); `winner:null` changes no rating but adds XP.
- [ ] **Step 3: Commit** `feat: apply server-decided 1v1.lol match results`.

### Task 8: Coins through Stripe, and ad rewards

**Files:**

- Create: `services/onev1Coins.js`
- Modify: `services/billing.js` (`handleWebhook`), `scripts/setup-stripe.js`, `routes/onev1.js`, `docs/billing.md`

**Interfaces:**

- Produces:
  - `scripts/setup-stripe.js`: a second product with metadata `{ app: "55gms-1v1-coins" }` and six one-time prices, lookup keys `onev1_coins_1` … `onev1_coins_6`, amounts from Global Constraints; adds `charge.refunded`, `charge.dispute.created` to `WEBHOOK_EVENTS`.
  - `createCoinCheckout(uuid, productId, origin) -> url`: `mode: "payment"`, the existing Stripe customer for the account if any, `client_reference_id: uuid`, `metadata: {app: "55gms-1v1-coins", uuid, productId, coins}` on both the session and `payment_intent_data`, success/cancel URLs back to the play page the purchase started from (passed by the page, checked with the same rule as `safeNext`).
  - `handleCoinEvent(event) -> boolean` (true when it was a coin event), called by `handleWebhook` before its subscription logic: `checkout.session.completed` with that metadata and `payment_status === "paid"` → ledger `+coins`, `source "stripe:<payment_intent>"`; `charge.refunded` on a coin payment → ledger `-round(coins * amount_refunded / amount)` minus what earlier refunds of that charge already took, `source "refund:<charge>:<amount_refunded>"`; `charge.dispute.created` → `-coins`, `source "dispute:<dispute>"`. The payment intent's metadata identifies coin payments.
  - The shop route(s) from Task 1's flow (`product/xsollaToken`, `product/checkTransaction`, `product`) create the checkout and report a transaction done once its ledger row exists. Without `features.billing` they answer the game's "store unavailable" shape.
  - Ad rewards: `redeemAdGrant(uuid, {grantId, signature}) -> {ok, rewardId}` → `POST ${ADS_SERVER_URL}/rewards/redeem` with `Authorization: Bearer ${ADS_API_KEY}` (confirm the exact path in `../gms-ads/server/routes/video.js` and its mount point), body `{grantId, signature}`; require `redeemed: true` and `gameId` equal to the 1v1 game id the play page uses (`data-gms-game`). `player/rv`, `player/rvSkinLastTime` and `product/rvCoinPurchase` require a redeemed grant (passed by the page, Task 10) and apply the game's `rv_settings` / `RvAdsNeededToUnlock` (4) rules server-side; coins from ads go through the ledger with `source "adgrant:<grantId>"`.

- [ ] **Step 1:** Implement; run `node scripts/setup-stripe.js` against the test key.
- [ ] **Step 2: Verify** with the Stripe CLI (`stripe listen --forward-to localhost:8080/api/stripe/webhook`, `stripe trigger` or a real test-mode checkout): one paid checkout → +coins once; `stripe events resend` of the same event → no change (Review Focus 2); full refund → coins removed, balance may go negative and `buySkin` then fails; a refund for an unknown charge is acknowledged with 200. A made-up grant → refused; a real grant from a test rewarded ad → accepted once, the second redeem refused.
- [ ] **Step 3: Commit** `feat: 1v1.lol coins on Stripe and verified ad rewards`.

### Task 9: Return to the game after signing in

**Files:**

- Modify: `static/assets/js/auth.js`, `static/login.html`, `static/signup.html`, `static/choose-handle.html` (and its script)

**Interfaces:**

- Produces: `safeNext(value) -> string | null` in `auth.js`: accepts only a string starting with exactly one `/` (not `//`, not `/\`), no scheme, at most 512 chars; otherwise null. After login/signup: `handlePending` → `/choose-handle?next=<next>`, else `next || "/profile"`. Choose-handle forwards to `next` when done. Login and signup link to each other keeping `next`.

- [ ] **Step 1:** Implement.
- [ ] **Step 2: Verify** in the browser: `/login?next=/misc/play/?title=1v1.lol%26link=nowgg` (the play page the game opens in) → after login lands back on it; `next=//evil.com`, `next=https://evil.com`, `next=/\evil.com` → `/profile`; signup with `next` → back to the game.
- [ ] **Step 3: Commit** `feat: return to the page you came from after signing in`.

### Task 10: The game page

**Files:**

- Modify: `static/misc/nowgg/index.html`

**Interfaces:**

- Consumes: Task 4 endpoints, Task 1 flows, Task 8 grant shape.
- Produces, in the page's inline scripts:
  - Token: on load, `POST /api/1v1/token` with the `gms-session` header (as other pages do); keep `{token, handle}` in memory. On 401, the player is a guest.
  - Backend rewrite: every XHR/fetch to `https://us-central1-justbuild-cdb86.cloudfunctions.net/<path>` goes to `/api/1v1/fn/<path>` with the token attached the way Task 1 says the game sends it; a 401 from there clears the token and shows guest state.
  - Login shim, installed after `js/login.js` loads: `firebaseLogin(provider, ok, err)` → token present: `ok({token, displayName: handle})`; absent: navigate the top window to `/login?next=<the current play page URL path+query>`. `retrieveIdToken`, `getCurrentUserDisplayName`, `firebaseLogout` (→ guest state; does not sign out of 55GMS) and whatever `firebase.auth().currentUser` check Task 1 found, answer from the token.
  - Guests who reach a sign-in-only call (Task 1 (e)) are sent to sign in the same way.
  - Photon: add `gms=<token>` next to the existing `name` param on every rewritten Photon URL; `name` = handle when signed in.
  - Config: `conf` comes from `GET /api/1v1/config` (fallback: today's local defaults), so `competitive_modes` follows the server.
  - Ads: listen for 55GMS Ads `rewardGranted` and pass the grant `{id, signature}` with the next `rv` call, per Task 1 (d).
  - `battlePass/buyPremium` reply → open `/premium` in the top window.

- [ ] **Step 1:** Implement.
- [ ] **Step 2: Verify** with a local signed-in browser: the menu shows the handle and no Google button state; locker, shop, battle pass and leaderboard screens load from `/api/1v1/fn/*` (network tab); signed out, pressing Login or a competitive mode goes to `/login?next=/misc/play/…` and comes back signed in; logging out of 55GMS in another tab and reloading the game → guest (Review Focus 1).
- [ ] **Step 3: Commit** `feat: 1v1.lol signs in with 55GMS accounts`.

### Task 11: Multiplayer server knows who is playing

Repo: `../multiplayer`.

**Files:**

- Create: `games/1v1/accounts.js`
- Modify: `games/1v1/nameserver.js`, `deploy/` systemd unit (env), `README.md`

**Interfaces:**

- Produces (`accounts.js`): env `GMS_INTERNAL_URL` (default `http://127.0.0.1:8080`), `MP_SHARED_SECRET`. `verifyToken(token) -> Promise<{uuid, handle, ratings} | null>` (POST `/api/1v1/internal/verify`, 2 s timeout, cache 5 min by token, null on any failure); `postMatch(result)` with an in-memory retry queue (backoff 1 s → 60 s, max 500 entries; a 2xx or `applied:false` both remove the entry); `queueSize()` reported in the existing `stats` log line.
- `authenticate` becomes async for a `gms` query param: on a verified token, `peer.state.account = {uuid, handle, ratings}`, `userId = "gms:" + uuid`, `name = handle`; otherwise unchanged guest behaviour. Responses wait for verification; ops arriving meanwhile are queued per peer.

- [ ] **Step 1:** Implement.
- [ ] **Step 2: Verify:** `MP_DEBUG=1`, a signed-in page shows `userId gms:<uuid>` and the handle as Photon nickname in the log; a forged `gms` param → guest; 55GMS stopped → guest, no crash; signed out mid-session and reconnect → guest (Review Focus 1).
- [ ] **Step 3: Commit** `feat: 1v1.lol players sign in with 55GMS tokens`.

### Task 12: Ranked matchmaking

Repo: `../multiplayer`.

**Files:**

- Modify: `games/1v1/master.js`, `games/1v1/rooms.js`

**Interfaces:**

- Consumes: `peer.state.account`; competitive mode names from `docs/1v1-match-events.md` / the config.
- Produces: `JoinRandomGame` / `CreateGame` for a competitive mode (`C0` in the competitive list) by a guest → the error code the game shows as "login required" (from Task 1; else `Err.OperationNotAllowedInCurrentState`). Rooms record `room.ranked = true` and each member's rating for that mode. A ranked search only matches rooms whose creator's rating is within `200 + 50 × seconds waited` (cap 1000); the game's `OverridenRangeIncreaseFactor` is not used. The same account may not be in two ranked rooms.

- [ ] **Step 1:** Implement.
- [ ] **Step 2: Verify** with two signed-in capture pages and hand-set ratings 1000 and 1900: they don't match at first and do after ~14 s; a guest pressing competitive is refused.
- [ ] **Step 3: Commit** `feat: ranked 1v1.lol matchmaking by rating, accounts only`.

### Task 13: The referee

Repo: `../multiplayer`.

**Files:**

- Create: `games/1v1/referee.js`
- Modify: `games/1v1/game.js`

**Interfaces:**

- Consumes: `docs/1v1-match-events.md`; `postMatch`.
- Produces: `referee.onJoin(room, actor)`, `referee.onEvent(room, actor, code, data)` (called for every `RaiseEvent` before relay, never altering it), `referee.onLeave(room, actor)`. Per room and per sending actor it records what that actor's stream claims (kills with killer/victim, round results, match end and winner). It decides when a match end is seen or a player leaves early:
  - 1v1: both streams' match-end winner agree → that winner; one stream silent because its player left → the leaver loses; contradiction → `winner: null`.
  - 2v2: at least one stream per team agrees and none contradict → winner; a leaver gets the loss alone (their team-mate is reported with the match outcome of the remaining play, or `null` if it never ends), per Global Constraints.
  - Unreadable modes (per the doc) → `rated: false`, no XP (nothing posted).
  - Kills/deaths per player = the victims' own streams' death events where available.
  - `matchId = <room name>:<room created ms>`; `rated` = `room.ranked`; only accounts are listed; posted once per room.

- [ ] **Step 1:** Implement.
- [ ] **Step 2: Verify** end to end with two signed-in capture pages per readable mode: a finished match posts once and 55GMS shows the XP and rating change; closing one tab mid-match → the leaver loses (Review Focus 3); stopping 55GMS before the match ends, then starting it → the result arrives from the retry queue, applied once (Review Focus 4); a page modified to send a fake match-end event claiming a win → `winner: null`.
- [ ] **Step 3: Commit** `feat: decide 1v1.lol match results on the server`.

### Task 14: Docs, deploy settings and a full run

**Files:**

- Modify: 55GMS `CLAUDE.md` (Backend layout rows, Commands: `node scripts/add-1v1.js`, env), `docs/multiplayer.md`, `docs/1v1-backend.md` (add how the backend works), `docs/billing.md`; multiplayer `README.md` (drop "Google login, the shop" from unsupported; env vars), its systemd unit.

- [ ] **Step 1:** Write the docs. In each `.env`/unit note `MP_SHARED_SECRET` must match on both services, and that `scripts/add-1v1.js` and `scripts/setup-stripe.js --webhook …` must run before the deploy (the webhook needs the two new events).
- [ ] **Step 2: Verify a full run locally:** new account via the game's Login → signup → back in the game signed in → buy coins (test mode) → buy a skin → play a ranked 1v1 between two accounts to the end → rating, XP, battle pass XP and leaderboard update → claim a free tier → premium tier refused, then granted after an admin grant on `/admin`. Run `npm run build && node scripts/build/check-output.js` and Prettier on changed files.
- [ ] **Step 3: Commit** `docs: 1v1.lol accounts, competitive and coins` in each repo.
