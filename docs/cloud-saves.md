# Per-game cloud saves

Every game has its own cloud save. Syncing one game never reads, writes or
replaces another game's save, and a game missing from a device never deletes
its cloud save. The older full-browser backup (`user_saves`) is kept,
read-only, beside the new saves.

## Pieces

| Path                              | What it does                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `static/assets/js/save-agent.js`  | First script in every game document. Records which storage the game uses. Sends nothing.      |
| `static/assets/js/cloud-saves.js` | The sync engine (`window.GMSSaves`): extract, restore, launch gate, uploads, queue, socket.   |
| `static/assets/json/saves.json`   | The registry: every game's stable id, name, sync support, known keys and progress adapter.    |
| `utils/saveRegistry.js`           | Reads the registry; the game id rule; which localStorage keys are the site's, never a game's. |
| `utils/saveProgress.js`           | Progress adapters and the comparison rule.                                                    |
| `services/gameSaves.js`           | Storage, conflict resolution, history, legacy import, retention sweep.                        |
| `services/saveBlobs.js`           | gzip in Postgres, or a BunnyCDN storage zone for large saves.                                 |
| `routes/saves.js`                 | `/api/saves*`, all behind the session cookie.                                                 |
| `scripts/build-save-registry.js`  | Regenerates `saves.json`. Hand-checked adapters live in its `CURATED` table.                  |
| `scripts/add-save-agent.js`       | Puts the agent in game documents and gates play-page frames. Idempotent.                      |
| `scripts/add-game-saves.js`       | Creates `game_saves` and `game_save_versions`.                                                |
| `scripts/migrate-legacy-saves.js` | Splits legacy backups into per-game saves for games with known keys. Dry run by default.      |

The feature is on when accounts use Postgres (`ACCOUNT_BACKEND=postgres`), the
database is up and `ADMIN_TOKEN_SECRET` is set (`features.saves` in
`utils/features.js`). Otherwise `/api/saves*` answers 503 and the profile page
shows the old full-browser Upload/Restore card.

## Game ids

All games run on this site's origin (`/misc/<folder>/index.html` inside
`/misc/play/*.html`), so they share one localStorage and one set of IndexedDB
databases. A game's id comes from its document's path: the folder under
`/misc/`, nested folders joined with `-`, and for shared players the `swf`,
`game` or `rom` query parameter (`/misc/flash/index.html?swf=duck-life.swf` is
`flash-duck-life`). Folder names never change when a game is renamed or its
cover moves. `gameIdFromLocation()` exists in `utils/saveRegistry.js`,
`save-agent.js` and `cloud-saves.js`, and the three must match. A document
framed by another game document takes its parent's id.

## Which storage belongs to a game

`save-agent.js` patches `Storage.prototype` and `IDBObjectStore.prototype` in
the game's window, before any game code runs, and records:

- a localStorage key the game writes, or reads while it has a value: owned
- a key it reads while empty: wanted (only used to look in a legacy backup)
- keys written as `localStorage.key = value`, found by comparing storage every
  minute and on hide, minus keys the `storage` event says another document
  changed
- IndexedDB records the game puts or adds. Engines that keep every game in one
  database claim the game's folder: Unity `/idbfs/<hash>/…`, Godot
  `/userfs/godot/app_userdata/<project>/…`; other file paths claim their
  folder, other keys themselves. Databases or stores named like a cache are
  ignored. A record over 4 MB (`RECORD_MAX_BYTES` in `cloud-saves.js`) is
  content the game downloaded, such as Mad Skills Motocross 2's 22 MB level
  archive: it stays out of the save, a restore leaves it in place, and where it
  is missing the game downloads it again.

Records go to the IndexedDB database `gms-cloud-saves` (stores `claims`,
`dirty`, `state`, `meta`), shared by the agent and the engine. A localStorage
key two games both use goes in neither save, unless the registry's `keys`
gives it to one of them. Site keys (`uuid`, `username`, `premium`, settings,
`55gms*`, `gms-*`, the proxy's `host@key` storage) are never recorded, and the
server refuses a save holding one. The session itself is an HttpOnly cookie
and never in storage.

A save is `{ v: 1, ls?: { key: value }, idb?: [ { name, version, stores } ] }`,
with IndexedDB values tagged where JSON has no type (`Date`, typed arrays,
`Blob`, `Map`…). It is serialized with sorted keys, so the same data always
has the same SHA-256; the server checks the hash.

Restoring writes each database in one transaction after checking it can do so
without changing the database's version under the game, then the localStorage
keys, and puts back what was there if anything fails. The game's keys the save
lacks are removed, so the game starts on exactly the save.

## Conflicts: higher progress wins

Every save has a revision. A device sends the revision its copy is based on,
and the server settles it under the save's row lock (`SELECT … FOR UPDATE`):

1. Same hash as the cloud: nothing changes.
2. Based on the current revision: accepted (fast-forward). The replaced save
   goes to history.
3. Based on a revision before a restore (`restore_barrier`): the restore
   stands; the upload goes to history.
4. Otherwise it is a conflict. If the game has a progress adapter and both
   saves can be read, the save further into the game wins. Otherwise, or on
   equal progress, the one changed last wins (the device's own time of its last
   change, never later than the server's clock). A copy whose last change the
   device never saw (written before the agent existed) is sent as the oldest
   possible time, so it cannot beat a real cloud save on recency. On an exact
   tie the larger hash wins, so every server decides the same way.

The losing save is always kept in `game_save_versions`, and the device is told
which save won; when the cloud's won, the response carries it so the device can
put it in place in the same round trip. Repeating or delaying an upload cannot
replace newer progress: its hash is either current already, or it goes through
the same comparison and loses.

Adapters return metrics that only grow, read from the save, never estimated. A
save the adapter cannot read has no progress. `lexicographic` compares the
first metric that differs (a later run beats an earlier one); `dominance` wins
only when at least as far on every metric and further on one, so two diverging
branches fall back to the latest save.

| Game                 | Read from                                                           | Order         |
| -------------------- | ------------------------------------------------------------------- | ------------- |
| Cookie Clicker       | `CookieClickerGame`: ascensions, cookies baked over all ascensions  | dominance     |
| Universal Paperclips | `saveGame`, `savePrestige`: finished games, stage (1–3), clips made | lexicographic |

A game built for 55GMS can use the SDK in the game window: `gmsSaves.save(data,
{ progress: { level: 12 } })` and `gmsSaves.load()`. Its data goes under
`native-save/<gameId>`; give its registry entry `progress: { adapter:
"native", metrics: ["level"], order: "lexicographic" }` in `CURATED` to compare
by it.

## When syncing happens

- **Site pages** (`script.js`): a signed-in premium browser syncs what is
  waiting in its queue, in the background after load.
- **Launch** (`GMSSaves.launch` on play pages): the frame's address is in
  `data-src`. For premium, the engine compares this browser's copy with the
  cloud's before setting `src`: uploads a changed copy (and takes the cloud's
  if it wins), or puts in a newer cloud save. It waits at most 5 s, 12 s once a
  download has begun, and starts the game with the local save if the cloud
  cannot be reached. A save being written in when time runs out is finished
  first. Free accounts start at once.
- **While playing**: each change the agent sees marks the game dirty in
  IndexedDB (so it survives a closed tab) and, for premium, schedules an upload
  20 s after the last change (at most 60 s after the first). A check every 60 s
  catches games whose saving cannot be seen; it uploads only when the hash
  changed. Uploads above 16 KB are gzipped.
- **Hidden, closed, or switching games**: an upload is attempted at once, with
  `keepalive` when small enough. The dirty mark is already stored, so the next
  page syncs it if this one does not finish.
- **Offline**: the game keeps its local save. Failed uploads stay queued and
  retry with exponential backoff (5 s doubling to 10 min) and when the browser
  comes back online. A queue entry is cleared only after the server's answer.
- **Tabs**: `navigator.locks` keeps one sync per game at a time across tabs, and
  a running game holds `gms-game:<id>` so nothing restores into it.
- **Other devices**: after an accepted upload the server emits `save_updated`
  (game, revision, hash; never the save) to `saves_<uuid>`. Sockets join with a
  10-minute token from `/api/saves-socket-token`. A device running that game
  marks it "Newer in the cloud" and takes it on the next launch; otherwise a
  game it has a copy of is refreshed in the background.
- **Running game vs. newer cloud save**: the running game is never written to.
  If its upload loses, uploads for it stop until the next launch, which settles
  it again.

## Free and Premium

|                                                                 | Free                 | Premium                |
| --------------------------------------------------------------- | -------------------- | ---------------------- |
| Per-game saves, Sync now, Restore                               | yes                  | yes                    |
| Conflict protection                                             | on every sync        | on every sync          |
| Restore before launch, background sync, device notices, retries | no                   | yes                    |
| History                                                         | 5 versions, 14 days  | 30 versions, 90 days   |
| Storage                                                         | 50 MB, 8 MB per save | 250 MB, 16 MB per save |
| Uploads                                                         | 150 per 10 min       | 900 per 10 min         |

The server enforces these: an upload with `mode: "auto"` from a free account is
refused (403 `premium_required`), and limits come from `users.premium`. When
premium ends, background sync stops and history is trimmed to the free limits
by the next sweep (every 6 hours). Current saves are never deleted by any
limit.

## API

All routes need the session cookie; the account is the session's, never a
uuid from the request.

| Route                                 | Does                                                              |
| ------------------------------------- | ----------------------------------------------------------------- |
| `GET /api/saves`                      | Manifest: each game's revision, hash, size, progress; limits      |
| `GET /api/saves/:game[?meta=1]`       | One save, or only its metadata                                    |
| `POST /api/saves/:game`               | Upload `{ baseRevision, hash, data, modifiedAt, deviceId, mode }` |
| `GET /api/saves/:game/history`        | Kept versions                                                     |
| `POST /api/saves/:game/restore`       | Make a version current `{ versionId }`                            |
| `POST /api/saves/:game/backup`        | Keep a copy in history only (before a Restore)                    |
| `POST /api/saves/:game/import-legacy` | First save from the legacy backup `{ keys }`                      |
| `POST /api/saves-socket-token`        | Token for `saves_subscribe`                                       |

## Legacy backups

- `user_saves` is never written while per-game saves are on: `/api/uploadSave`
  answers 410, and login no longer uploads the whole of localStorage.
  `/api/readSave` and `/api/saveStatus` now need the session where one is
  configured.
- `scripts/migrate-legacy-saves.js --apply` creates a per-game save from each
  backup for games with registry `keys`, only where the account has none.
- On a device, a game with no cloud save asks the server to import it from the
  legacy backup with the keys the device has seen the game use
  (`import-legacy`), once per new set of keys.
- Imported saves carry the oldest possible time, so a device's own newer copy
  wins against them, and the device's copy is offered to the server before any
  restore overwrites it.
- Rollback: `scripts/migrate-legacy-saves.js --rollback` removes imported saves
  no device has changed since. Reverting the deploy brings back the old flow;
  the new tables can then be dropped.

## Deploying

1. `node scripts/add-game-saves.js` on the production database (safe to re-run,
   and while the old build is live).
2. Deploy. Needs `ACCOUNT_BACKEND=postgres` and `ADMIN_TOKEN_SECRET`, which
   production already has. Optional: `BUNNY_SAVES_ZONE`, `BUNNY_SAVES_KEY`
   (and `BUNNY_SAVES_HOST` for a regional endpoint) to send saves over
   `SAVE_INLINE_MAX_BYTES` (512 KB gzipped) to a private storage zone.
3. `node scripts/migrate-legacy-saves.js` to see the counts, then `--apply`.

After adding a game: `node scripts/build-save-registry.js` and
`node scripts/add-save-agent.js`, then commit both outputs. Game pages are
never rebuilt, so `save-agent.js?v=` and `cloud-saves.js?v=` in them, and the
`?v=` in `script.js` and `save-agent.js` that load `cloud-saves.js`, must be
bumped when those files change.

## Limits and known gaps

- Most games sync by observation: a game's storage is known once it has run
  with the agent on that device, or once a cloud save of it has been restored
  there. Data from before the agent ran is found when the game reads or
  rewrites it.
- Only two games compare by progress; the rest keep the latest save, with the
  loser in history. Adding an adapter means reading the game's save format.
- IndexedDB records in auto-increment stores without explicit keys are not
  attributed, and storage a game keeps in cookies, the Cache API or OPFS is not
  synced.
- Games framed from another site (`shellshock`, `smashkarts`, `stumbleguys`,
  `yohoho`) and proxied or external catalogue entries are local-only: their
  storage is on another origin.
- A game opened by its own address (not through a play page) still uploads,
  but cannot restore before it starts.
- Rate limits and the socket token are per pm2 worker or signed with
  `ADMIN_TOKEN_SECRET`, like the rest of the site.
