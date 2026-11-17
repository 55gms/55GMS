# 1v1.lol on 55GMS accounts: competitive, progress, coins and battle pass

## Intent

1v1.lol (`static/misc/nowgg/`) now plays against our own multiplayer server
(`55gms/multiplayer`, `docs/multiplayer.md`), but only as a guest. Everything a
signed-in player gets on the real game sits behind "Login with Google", which
goes to Firebase and the game's own backend
(`https://us-central1-justbuild-cdb86.cloudfunctions.net/`), neither of which
works for us. The owner wants a 55GMS account to stand in for that login, so a
55GMS player gets **everything** a logged-in 1v1.lol player gets, competitive
first among them, with 55GMS as the backend.

It ships as one release, not in pieces.

## What the logged-in game uses

Found in this build's strings (1v1.LOL 3.800, Unity 2019.4, IL2CPP). The game
calls `firebaseLogin()` (`js/login.js` in the assets repo), gets
`{ token, displayName }`, then calls the backend with that token. Paths under
the backend base:

| Area        | Calls                                                                                                                                                                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account     | `player`, `player/login`, `player/nickname`, `userSettings`, `userSettings/group`, `userSettings/single`, `userSettings/time` (already answered by the multiplayer server)                                                                                                                |
| Competitive | `rating`, `rating/updateMMR`, `leaderboards`, `leaderboards/info`                                                                                                                                                                                                                         |
| Progress    | `player/updateProgressAndStats`                                                                                                                                                                                                                                                           |
| Cosmetics   | `player/skins`, `player/skins/weapon`, `player/skins/character`, `player/skins/weapon/equip`, `player/skins/character/equip`, `player/skins/character/equip/list`, `player/skins/character/pack`, `player/emotes`, `player/emotes/character/update`, `player/rv`, `player/rvSkinLastTime` |
| Battle pass | `battlePass`, `battlePass/claimReward`, `battlePass/earnRewards`, `battlePass/buyPremium`, `battlePass/buyTierUp`, `player/boostBattlePassRewards`                                                                                                                                        |
| Shop        | `product`, `product/validateReceipt`, `product/validateMultipleReceipts`, `product/xsollaToken`, `product/checkTransaction`, `product/coinPurchase`, `product/rvCoinPurchase`                                                                                                             |
| Other       | `analytics` (can be accepted and dropped)                                                                                                                                                                                                                                                 |

The request and reply shapes are not known: the original servers cannot be
asked. They have to be read from the game's code (IL2CPP: the wasm plus
`global-metadata.dat` inside the `.data` bundle; Il2CppDumper or similar gives
the request/response classes and their JSON field names) and confirmed in the
running game. The shop items, coin packs, battle pass tiers and mode lists are
already in the page's remote-config defaults (`setDefaultValues` in
`js/firebase-config.js`, turned into `SettingsV6` by the inline script in
`static/misc/nowgg/index.html`).

## Goals

1. **Sign in with 55GMS.** The game treats a signed-in 55GMS player as logged
   in, automatically on load. The in-game name is the 55GMS handle.
2. **Guests are sent to sign in.** A guest who presses the login button, or
   anything that needs an account (competitive, shop, battle pass, locker
   purchases), is sent to 55GMS login/signup and comes back to 1v1.lol signed
   in.
3. **Competitive that the server decides.** Ranked modes
   (`competitive_modes`: `1v1_Competitive`, `Teams_2v2_Competitive`) are for
   signed-in players only. The multiplayer server decides who won each match;
   ratings, the leaderboard and rating-based matchmaking follow from that.
   It must be hard to cheat.
4. **Progress.** XP, level and stats (wins, kills and whatever else the game
   tracks) are kept per account and come from the same server-verified match
   results, not from what the browser reports.
5. **Cosmetics.** Owned and equipped character skins, weapon skins and emotes
   per account; ad-unlocked (`rv`) skins work as the game expects.
6. **Coins for real money.** The game's coin packs are sold through the
   existing 55GMS Stripe integration as one-off payments at the game's prices
   (`coins_data`: 100 for $0.99 … 6500 for $49.99). Coins arrive when payment
   clears. Coins buy skins and battle pass tier-ups, as in the game.
7. **Battle pass premium is 55GMS Premium.** Anyone premium on 55GMS
   (`users.premium`: Stripe subscription or admin grant) has the premium track.
   Losing Premium locks it again; rewards already claimed are kept. The free
   track is for every signed-in player.
8. Guests keep playing casual exactly as they do now.

## Non-goals

- Google or Facebook login, and the real 1v1.lol accounts or their progress.
- Friends, parties and Photon Chat (still unsupported).
- Server-side simulation of the gameplay itself.
- Mobile apps, App Store / Google Play receipts.

## Anti-goals (a failure even if it works)

- A player can give themselves rating, wins, XP, coins or skins by editing
  requests or the page.
- Coins credited twice for one payment, or a purchase that charges without
  crediting.
- Guest play gets worse or breaks.
- Game files in `55gms/assets` are edited for this; all hooks stay in the
  55GMS page (`static/misc/nowgg/index.html`) and on our servers, as the
  existing Photon and clock hooks do.

## Decided

Decided by the owner:

- Every logged-in feature, shipped together.
- Login prompt → 55GMS signup/login → straight back to 1v1.lol, signed in.
- Coins bought with real money through the existing Stripe integration.
- Battle pass premium comes with 55GMS Premium.
- The server decides match results; cheating must be hard.

My calls, accepted by the owner when played back:

- The in-game name is the 55GMS handle; signed-in players cannot rename in
  the game (`player/nickname` refuses or is a no-op). Guests keep the
  `Guest####` names.
- 55GMS login/signup gain a "return to" parameter. It accepts only a path on
  the same site (starts with a single `/`), so it cannot become an open
  redirect. Today `auth.js` always sends people to `/profile` or
  `/choose-handle`; a pending-handle account picks its handle first and then
  returns.
- A refund or chargeback on a coin pack takes those coins back, even if that
  leaves the balance below zero (which then blocks spending until topped up).
- The game's own `rating/updateMMR` and `player/updateProgressAndStats`
  reports are not trusted. They are accepted (so the game does not error) but
  the stored numbers come only from server-decided results.
- `battlePass/buyPremium` does not take coins; it sends the player to
  `/premium`.
- All account data (rating, stats, coins, skins, battle pass) lives in the
  55GMS Postgres database, next to accounts and billing. The multiplayer
  server does not keep its own copy.

Decided by the owner after the builder check:

- **Ad rewards are verified by 55GMS Ads.** The 55GMS Ads server can confirm
  that a given account finished a given rewarded ad. Ad-unlocked skins and
  ad coins (`player/rv`, `product/rvCoinPurchase`) are granted only on that
  confirmation, never on the browser's word. How the confirmation is asked
  for or delivered (gms-ads, mounted by `utils/ads.js`) is for the builder to
  work out with that repo.
- **Modes whose result can't be read ship without XP or rating.** The release
  doesn't wait for every mode. A mode whose winner the server can't tell is
  playable, but gives no XP, stats, rating or battle pass progress. A
  competitive mode in that state is left out of `competitive_modes` until it
  can be read. If even ranked 1v1 can't be read, stop and bring it back to
  the owner, as above.

My calls, settled after the builder check (the owner can still overturn them):

- **2v2 results:** a result counts when at least one stream from each team
  agrees on it. If any two streams contradict each other, it counts for
  nobody. A teammate who disconnects takes the loss alone; the one who stayed
  is rated on how the match ends.
- **Battle pass seasons:** one static pass (season 1 from the config), with no
  rollover. Tables carry a season id so seasons can be added later.
- **Premium track:** checked when a reward is claimed. Tiers reached while
  Premium can't be claimed after Premium lapses; that matches "losing Premium
  locks it again".
- **Guest progress:** whatever the game keeps locally for a guest (PlayerPrefs)
  does not carry over on first sign-in, because it can't be trusted.
- **Same network:** many players share one school IP, so sharing an IP does
  not block rating. Win-trading is limited instead by pair repetition: the
  same two accounts earn rating from each other only a few times a day, with
  diminishing amounts.

## How it fits together (my calls; the builder may refine)

**The game's backend lives in 55GMS.** The page already rewrites the
`cloudfunctions.net` clock call; it rewrites every call under that base to a
55GMS API (for example `/api/1v1/<path>`), same origin, so the session
header/cookie works as it does for the rest of the site. These routes go in a
new route file and service (named like the others in the Backend layout
table), loaded only when the Postgres account backend is on, through
`utils/features.js` like chat and saves. Coin purchase needs billing on as
well; without it the shop's buy actions report unavailable and the rest works.

**Login.** The page replaces `firebaseLogin`, `retrieveIdToken`,
`getCurrentUserDisplayName` and `firebaseLogout` (defined by `js/login.js`,
loaded from the assets repo) after that script loads. Signed in, they answer
with a token and the handle. Signed out, they send the player to
`/login?next=/misc/nowgg/` (or the signup page; the login page links to it)
instead of a Google popup. The token is not the 55GMS session itself but a
short-lived, game-scoped signed token minted by 55GMS (for example
`POST /api/1v1/token`), so the multiplayer server can check who a player is
without holding session secrets. The multiplayer server's `Authenticate`
(currently: accept anything, `games/1v1/nameserver.js`) accepts that token
when given and ties the Photon user id to the 55GMS account; guests stay as
they are. How the game passes its token to Photon (auth values, a custom
property, or the `name` query the page already adds) is for the builder to
find; the page can add it to the websocket URL as it does `name`.

**The game must know it is logged in on load.** The game remembers a session
(`kLCGoogleLoginSessionExists` in PlayerPrefs) and checks
`firebase.auth().currentUser`; whatever it checks has to say "signed in" when
55GMS is signed in and "signed out" otherwise, including after the player logs
out of 55GMS.

**Competitive results.** Every competitive match already runs on the
multiplayer server's game server, which relays all events. It reads the
match's PUN events (kills, deaths, round and match end, who left) and decides
the result:

- both players' streams must agree on the outcome; a match where they
  disagree, or that cannot be read, counts for nobody;
- leaving or disconnecting before the end is a loss for the leaver;
- a ranked room is only made of signed-in accounts; a guest cannot join one;
- the master pairs players by rating within a widening range (the game's
  `modes_info.*.OverridenRangeIncreaseFactor` hints at how it expected this);
- the same two accounts earn rating from each other only a few times a day,
  with diminishing amounts (stops win-trading against your own alt without
  punishing shared school networks);
- a cap on rated matches per account per hour.

The multiplayer server sends each decided result to 55GMS over a loopback-only
endpoint with a shared secret (it runs on the same box), and 55GMS applies the
rating change (Elo or Glicko; builder's choice), XP, stats and battle pass XP
(`win_xp` 50 / `lose_xp` 25 from the battle pass config) in one transaction,
idempotent on a match id. The event codes and RPC layout for kills and match
end are not known yet and have to be recorded from real matches with
`tools/capture.mjs` in the multiplayer repo. **If the game turns out not to
send enough to tell who won, stop and bring it back to the owner** rather than
falling back to trusting the client.

Casual matches by signed-in players also give XP and stats, decided the same
way.

**Coins and Stripe.** Coin packs are Stripe prices created by
`scripts/setup-stripe.js` (one-off, `mode: "payment"`). The game's web shop
path (`product/xsollaToken`, then `product/checkTransaction`) is the likely
hook: answer it by creating a Stripe Checkout session and opening it, then
report the transaction once the webhook has credited it. The existing webhook
(`services/billing.js` `handleWebhook`) gains the payment events:
`checkout.session.completed` credits, `charge.refunded` and disputes debit.
Every coin change goes through one ledger table keyed by its source (Stripe
id, skin purchase, tier-up), so retries cannot double-count, and the balance
is derived from or checked against it. Spending (skins, tier-ups) is done by
the server, which checks price and balance from the config it holds, never the
price the client sends.

**Battle pass.** Progress and claimed rewards per account per season. The
premium track checks `users.premium` at claim time. Tiers come from the
`BattlePass` config the page already supplies.

**Leaderboards.** Built from the stored ratings; the in-game leaderboard reads
them through `leaderboards`. Showing them on the 55GMS site is not asked for.

**Data.** New tables in the 55GMS database, created by a `scripts/add-…js`
migration (safe to re-run) like the other features, and listed in
`setup-db.js`. Shape is the builder's call; it needs at least per-account game
profile (rating per competitive mode, XP, level, stats, equipped items, rv
timers, settings), owned items, battle pass progress, the coin ledger, and a
match results log.

## Left to the builder

- The exact request and reply shapes of every call, from the game code.
- How each `product/*` call maps onto Stripe Checkout in the game's web flow.
- The rating formula and its parameters; matchmaking range and timing.
- Table layout, route and file names, the token format and lifetime.
- Rate limits on the new routes (the site already uses rate limiting).
- Docs: update `docs/multiplayer.md`, both READMEs, `CLAUDE.md`'s tables and
  commands, and a `docs/` page for the 1v1 backend like `docs/billing.md`.

## Separate follow-ups (after this ships)

- The main menu's top-left online indicator shows only a green dot; it should
  read like "Europe: 2 online". Likely the lobby/app stats the game asks the
  master for (`GetLobbyStats`, `AppStats` event).
- The game throws a `NullReferenceException` right after authenticating on the
  master, and Bugsnag (`notify.bugsnag.com`, `sessions.bugsnag.com`) posts
  reports in a loop, which ad blockers turn into console spam. Fix the error
  and stop the Bugsnag calls from the page.
- The main menu's name box shows "Click to change name" instead of the name
  sent to the server.
