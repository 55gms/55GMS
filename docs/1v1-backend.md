# 1v1.lol backend

1v1.lol (build 3.800, `static/misc/nowgg/`) keeps a signed-in player's data on
its own backend, Firebase Cloud Functions at
`https://us-central1-justbuild-cdb86.cloudfunctions.net/`, which no longer
works for us. 55GMS answers those calls instead. This page records what the
game sends and what it accepts, worked out from its IL2CPP metadata
(`ApiUrls`, `FirebaseManager`, `ServerUser` and the string literals) and by
running it against a stub that logged every request.

## On 55GMS

A 55GMS account stands in for the game's Google login. Everything below is on
when `utils/features.js` turns `onev1` on: the Postgres account backend,
`ADMIN_TOKEN_SECRET` and `MP_SHARED_SECRET` (the same value as the
multiplayer server's). Coin sales also need billing (`docs/billing.md`).

- **The page** (`static/misc/nowgg/index.html`, never rebuilt) fetches a game
  token from `POST /api/1v1/token` for the signed-in account. Its stand-ins
  for `firebaseLogin`, `retrieveIdToken`, `getCurrentUserDisplayName` and
  `firebaseLogout` hand the game that token and the handle; a signed-out
  player who presses Login goes to `/login?next=<the page>` and comes back
  signed in. Calls to the game's backend go to `/api/1v1/fn/<path>`, the
  remote config comes from `GET /api/1v1/config`, Photon connections carry
  the token as `?gms=`, Xsolla's payment widget is replaced by a panel that
  opens Stripe Checkout, and LOL Pass premium offers 55GMS Premium.
- **The routes** are `routes/onev1.js`. Game calls are authorized by the
  game token in `auth-token` (a scoped token, 12 hours) and the 55GMS
  session it was made for (cookie or `X-GMS-Session`, which the page adds),
  so signing out of the site signs the game out; the page also drops the
  token when another tab signs out. `/api/1v1/internal/*`
  answers only the multiplayer server: loopback, no `X-Forwarded-For`, and
  `X-MP-Secret`.
- **The data** (`services/onev1Schema.js`, added by `node scripts/add-1v1.js`)
  is one profile per account (XP, stats, ratings, equipped skin), owned items,
  battle pass progress, a coin ledger and decided matches. Coins are the sum
  of the ledger; every change has a unique `source`, so nothing counts twice.
- **Nothing the game reports changes a number.** Rating, wins, kills, XP and
  battle pass XP come only from results the multiplayer server decides
  (`/api/1v1/internal/match`, `services/onev1.js` `applyMatch`): Elo with
  K 32 from 0 (the game shows it as the competitive rank, so it starts empty), a team's rating the mean of its members, rated matches
  between the same two accounts worth 1, ½, ¼ and then nothing within 24
  hours, at most 20 rated matches an hour, 50 XP for a win and 25 otherwise
  (none for leaving). `rating/updateMMR` and `player/updateProgressAndStats`
  answer `{}` and do nothing.
- **Spending** happens on the server at its own prices
  (`services/onev1Config.js`, from `utils/1v1-config.json`), under the
  account's row lock.
- **Coins for money** (`services/onev1Coins.js`): `product/xsollaToken`
  makes a Stripe Checkout session (one-off payment, priced from the coin
  pack) and returns its URL as the token; the page's panel opens it in a new
  tab and polls `/api/1v1/fn/coins/status`, which credits a paid session if
  the webhook has not yet. Refunds take back their share of the coins and
  disputes all of them, even below zero; a negative balance cannot spend.
- **LOL Pass**: season 1, 22 tiers 250 XP apart, a free reward (masks) and
  a premium one (shop skins, coin packs) on each. Premium is
  `users.premium` at claim time. The config's `end_date` is always a year
  ahead: the game shows the pass only while it is in the future. The game
  claims every reward listed as earned and not claimed by itself.
- **Rewarded ads** are counted only with a 55GMS Ads grant the server redeems
  (`/api/v1/rewards/redeem` on `ADS_SERVER_URL`, game id `nowgg`). This
  build's screens never start one.

## Calling convention

- Every call goes to `<base><path>`; the page rewrites the base to
  `/api/1v1/fn/`.
- The player's token is in the request header `auth-token` (the `token` that
  `firebaseLogin` handed the game). `analytics` is sent without it.
- `Content-Type: application/x-www-form-urlencoded`. JSON values travel
  URL-encoded inside a field (`settings=<json>`, `events=<json>`). GETs carry
  their parameters in the query string.
- A 2xx answer is parsed as JSON by Newtonsoft, which matches property names
  case-insensitively; the game's own names are PascalCase. An error is any
  non-2xx with `{"error": "<message>"}`; the game logs the message and carries
  on.

## Signing in

1. On load the game calls `firebaseLogin("anonymous", ok, err)` (in
   `js/login.js`), which answers `{token: "", displayName: "guest"}`. That is
   guest play.
2. The main menu's "Login with Google" button calls
   `firebaseLogin("google", ok, err)`, then `retrieveIdToken`. A guest who
   presses a competitive mode sees "Login to play" and nothing is called: the
   game blocks it itself, so the menu button is the way in.
3. With a token, the game calls `GET player/login?nickname=<displayName>` and
   builds the logged-in menu from the reply (below). It then sends
   `POST userSettings/group settings=<json>` and
   `POST player/rvSkinLastTime`.
4. The profile screen has a Logout button (`firebaseLogout`).

The game sends nothing to Photon that identifies a signed-in player: name
server `Authenticate` carries only the region, version and app id. The page
adds the 55GMS game token to the Photon websocket URL itself.

## `player/login` reply

```json
{
  "ID": "<uuid>",
  "Nickname": "<handle>",
  "HardCurrency": 777,
  "SoftCurrency": 0,
  "XP": 3456,
  "Elo": 0,
  "DuosRating": 0,
  "Rating": 0,
  "BoxRating": 0,
  "CustomRating": 0,
  "Deviation": 350,
  "Volatility": 0.06,
  "Stats": {
    "TotalKills": 42,
    "TotalDeaths": 7,
    "Victories": { "1v1": 5, "BattleRoyale": 0 },
    "Defeats": { "1v1": 2, "BattleRoyale": 0 },
    "TotalGamesPlayed": 9,
    "ConsecutiveWins": 3
  },
  "Premium": { "AdsDisabled": false, "LTV": 0 },
  "Skins": {
    "CharacterSkins": ["lol.1v1.playerskins.pack.23"],
    "EquippedCharacterSkins": ["lol.1v1.playerskins.pack.23"],
    "WeaponSkins": [],
    "EquippedWeaponSkins": []
  },
  "BattlePass": {
    "Seasons": {
      "1": {
        "XP": 120,
        "IsPremium": false,
        "ClaimedRewards": [],
        "EarnedRewards": ["lol.1v1.playerskins.pack.tier.RV0"]
      }
    }
  },
  "RVData": {
    "Watched": 0,
    "CurrentSkin": "",
    "LastRvSkinDateTime": "2020-01-01T00:00:00Z"
  }
}
```

- `HardCurrency` is the coin balance shown in the menu and shop.
- `XP` drives the level shown (3456 XP is level 7, 36/1800).
- The mode picker shows `Elo` on 1v1 Comp and `DuosRating` on 2v2 Comp.
- The profile screen shows `Victories["1v1"]`, its share of
  `Victories + Defeats`, `Victories["BattleRoyale"]`, `TotalKills`, kills per
  death, and `ID`.
- `Skins.CharacterSkins` lists owned item ids; the locker shows them.
- `BattlePass.Seasons` is keyed by the season number (a non-number key breaks
  the whole login). An id in `EarnedRewards` and not in `ClaimedRewards` shows
  a Claim button.
- **`Settings` must be left out** unless it holds every key the game looks up:
  `"Settings": {}` throws `KeyNotFoundException` after login.

## Calls

| Call                                                                                                                                                 | Request                                                                                                | Reply that works                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `GET player/login`                                                                                                                                   | `?nickname=`                                                                                           | the reply above                                                                 |
| `POST userSettings/group`                                                                                                                            | `settings=<json object of string values>`                                                              | `{}`                                                                            |
| `POST player/rvSkinLastTime`                                                                                                                         | none                                                                                                   | a JSON date string, `"2020-01-01T00:00:00Z"`                                    |
| `POST product/coinPurchase` (buy a shop skin)                                                                                                        | `id=<skin id>&cost=<price>`                                                                            | `{}`: the game shows "Purchase success" and takes the coins off locally         |
| `POST product/rvCoinPurchase` (mystery skin)                                                                                                         | `id=<one of rv_skins, picked by the game>`; costs `rv_settings.PriceLC`                                | `{}`                                                                            |
| `POST player/skins/character/equip/list`                                                                                                             | `skinId=<id>`                                                                                          | `{}`                                                                            |
| `GET product/xsollaToken` (coin pack)                                                                                                                | `?userName&itemId=lol.1v1.coins.pack.N&amount=<coins>&isSandbox=False&transactionId=<16 random chars>` | `{"token": "<t>"}`, then the shop flow below                                    |
| `POST battlePass/claimReward`                                                                                                                        | `rewardId=<item id>&seasonId=1`                                                                        | `{}`                                                                            |
| `POST battlePass/buyTierUp`                                                                                                                          | `battlePassId=default`                                                                                 | `{}`                                                                            |
| `POST battlePass/buyPremium`                                                                                                                         | the game checks coins against `premium_price` (0) itself, then asks when "Activate" is pressed         | `{}` for a 55GMS Premium account; 402 otherwise, and the page offers `/premium` |
| `POST rating/updateMMR`                                                                                                                              | `strongerPlayer`, `weakerPlayer` (the game's own rating maths)                                         | ignored                                                                         |
| `POST player/updateProgressAndStats`                                                                                                                 | `gameMode`, `killsCount`, `deathsCount`, `isVictory`, `isCompetitive`, `rankType`                      | ignored                                                                         |
| `POST player/boostBattlePassRewards`                                                                                                                 | `isVictory`, `battlePassId`                                                                            | ignored                                                                         |
| `POST player/nickname`                                                                                                                               | the new name                                                                                           | ignored: the name is the 55GMS handle                                           |
| `POST analytics`                                                                                                                                     | `events=<json>`, no token                                                                              | `{}`                                                                            |
| `leaderboards`, `leaderboards/info`, `player/rv`, `player/emotes*`, `player/skins*`, `battlePass/earnRewards`, `userSettings`, `userSettings/single` | not reached from any screen of this build                                                              |                                                                                 |

## Coin packs (the web shop)

After `product/xsollaToken` the game runs `_Purchase(token, isSandbox)` from
its framework JS. That loads `https://cdn.xsolla.net/embed/paystation/1.2.3/widget.min.js`,
then calls:

```js
XPayStationWidget.init({ access_token: token, sandbox });
XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS_DONE, …);     // → WebPurchaseComplete "true"
XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS_TROUBLED, …); // → "false"
XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, …);           // → "false"
XPayStationWidget.open();
```

The handlers call `unityInstance.SendMessage("MainMenuManagers", "WebPurchaseComplete", "true"|"false")`.
The page stands in its own `XPayStationWidget`, so the token it gets is ours.

## Rewarded ads

The game expects `window.InitRV(userId)` and `window.showRV()`
(`js/IronSourceRV.js`) and answers to
`SendMessage("MainMenuManagers", "RvReady")` and
`SendMessage("MainMenuManagers", "RvWatchComplete", "true"|"false")`. No
screen of this build called them, and the page's 55GMS Ads SDK tag has an
empty `data-compat`, so rewarded ads have never run here.

## Battle pass

The LOL Pass button, the season popup and the pass screen appear only when the
`BattlePass` remote config has an `end_date` in the future. The pass screen
shows each tier's free and premium rewards from `tiers`, the progress within
the current tier, "Activate" (premium, priced `premium_price`, advertised as
"30 tiers") and a tier-up button priced `tier_up_price`.
