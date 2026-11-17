# 1v1.lol backend

1v1.lol (build 3.800, `static/misc/nowgg/`) keeps a signed-in player's data on
its own backend, Firebase Cloud Functions at
`https://us-central1-justbuild-cdb86.cloudfunctions.net/`, which no longer
works for us. 55GMS answers those calls instead. This page records what the
game sends and what it accepts, worked out from its IL2CPP metadata
(`ApiUrls`, `FirebaseManager`, `ServerUser` and the string literals) and by
running it against a stub that logged every request.

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
  "Elo": 1000,
  "DuosRating": 1000,
  "Rating": 1000,
  "BoxRating": 1000,
  "CustomRating": 1000,
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

| Call                                                                                                                                                 | Request                                                                                                | Reply that works                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `GET player/login`                                                                                                                                   | `?nickname=`                                                                                           | the reply above                                                         |
| `POST userSettings/group`                                                                                                                            | `settings=<json object of string values>`                                                              | `{}`                                                                    |
| `POST player/rvSkinLastTime`                                                                                                                         | none                                                                                                   | a JSON date string, `"2020-01-01T00:00:00Z"`                            |
| `POST product/coinPurchase` (buy a shop skin)                                                                                                        | `id=<skin id>&cost=<price>`                                                                            | `{}`: the game shows "Purchase success" and takes the coins off locally |
| `POST product/rvCoinPurchase` (mystery skin)                                                                                                         | `id=<one of rv_skins, picked by the game>`; costs `rv_settings.PriceLC`                                | `{}`                                                                    |
| `POST player/skins/character/equip/list`                                                                                                             | `skinId=<id>`                                                                                          | `{}`                                                                    |
| `GET product/xsollaToken` (coin pack)                                                                                                                | `?userName&itemId=lol.1v1.coins.pack.N&amount=<coins>&isSandbox=False&transactionId=<16 random chars>` | `{"token": "<t>"}`, then the shop flow below                            |
| `POST battlePass/claimReward`                                                                                                                        | `rewardId=<item id>&seasonId=1`                                                                        | `{}`                                                                    |
| `POST battlePass/buyTierUp`                                                                                                                          | `battlePassId=default`                                                                                 | `{}`                                                                    |
| `POST battlePass/buyPremium`                                                                                                                         | not seen: the game checks coins against `premium_price` itself first                                   |                                                                         |
| `POST rating/updateMMR`                                                                                                                              | `strongerPlayer`, `weakerPlayer` (the game's own rating maths)                                         | ignored                                                                 |
| `POST player/updateProgressAndStats`                                                                                                                 | `gameMode`, `killsCount`, `deathsCount`, `isVictory`, `isCompetitive`, `rankType`                      | ignored                                                                 |
| `POST player/boostBattlePassRewards`                                                                                                                 | `isVictory`, `battlePassId`                                                                            | ignored                                                                 |
| `POST player/nickname`                                                                                                                               | the new name                                                                                           | ignored: the name is the 55GMS handle                                   |
| `POST analytics`                                                                                                                                     | `events=<json>`, no token                                                                              | `{}`                                                                    |
| `leaderboards`, `leaderboards/info`, `player/rv`, `player/emotes*`, `player/skins*`, `battlePass/earnRewards`, `userSettings`, `userSettings/single` | not reached from any screen of this build                                                              |                                                                         |

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
