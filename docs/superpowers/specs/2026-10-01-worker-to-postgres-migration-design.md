# Move accounts and saves from the Cloudflare Worker into Postgres

Date: 2026-10-01

## Goal

Stop depending on the Worker at `db.55gms.com` (D1 for users, KV for saves).
User accounts and cloud saves live in the same Postgres database the chat
system already uses. After cutover the Worker receives no traffic and can be
deleted.

Success means:

- All 37,349 existing users can log in with their current password.
- Every uuid is unchanged, so existing chats, friends and blocks still resolve.
- Every KV save is readable through `/api/readSave`.
- The browser sees the same responses as today from every `/api/*` route.

## Out of scope

- Real sessions (JWT). Saves stay protected only by knowing a uuid, as today.
  This is a known weakness and a separate project.
- Password change, account deletion, or any new account feature.
- `/api/users/upgrade`. Nothing in this repo calls it; premium is set by hand
  in SQL after the migration.

## Current state

The Worker is called only from this server, in seven places:

| Worker endpoint                       | Caller                                   |
| ------------------------------------- | ---------------------------------------- |
| `POST /api/signup`                    | `routes/auth.js` `/signUp`               |
| `POST /api/login`                     | `routes/auth.js` `/login`                |
| `POST /api/users/premium`             | `routes/users.js` `/checkPremium`        |
| `POST /api/users/uploadSave`          | `routes/users.js` `/uploadSave`          |
| `POST /api/users/readSave`            | `routes/users.js` `/readSave`            |
| `GET /api/user/:uuid`                 | `utils/userCache.js` `getUserByUuid`     |
| `GET /api/user/by-username/:username` | `utils/userCache.js` `getUserByUsername` |

Worker data:

- D1 table `users(uuid, username, password, premium)`. `password` is the
  lowercase hex SHA-256 of the plaintext, unsalted.
- KV: key is the uuid, value is `JSON.stringify(saveData)`. Values can be up
  to 25 MB. The Worker never checks that the uuid belongs to a user.

## Data model

Two Sequelize models in `models/`, registered in `models/index.js` so
`node setup-db.js` creates them.

`User` → table `users`

| Column      | Type        | Notes                             |
| ----------- | ----------- | --------------------------------- |
| `uuid`      | UUID        | primary key, same value as in D1  |
| `username`  | VARCHAR(16) | unique, case-sensitive (as in D1) |
| `password`  | VARCHAR(60) | bcrypt hash, see below            |
| `premium`   | BOOLEAN     | default false                     |
| `createdAt` | timestamp   | import time for migrated rows     |
| `updatedAt` | timestamp   |                                   |

If the D1 export contains usernames longer than 16 characters, the column is
widened to fit the longest one; the 16-character limit stays a signup rule.

`UserSave` → table `user_saves`

| Column      | Type      | Notes                                   |
| ----------- | --------- | --------------------------------------- |
| `uuid`      | TEXT      | primary key; no foreign key to `users`  |
| `saveData`  | TEXT      | the JSON string exactly as stored in KV |
| `updatedAt` | timestamp |                                         |

No foreign key, because the Worker accepts saves for any uuid and those rows
must import. `saveData` is TEXT rather than JSONB so a 25 MB save is stored
and returned without being parsed by Postgres.

`premium` changes from D1's `0`/`1` to `true`/`false` in responses. Nothing
under `static/` (outside the embedded games) reads `premium`, so this is safe.

## Passwords

Stored value: `bcrypt(sha256hex(password))`, cost 10, using `bcryptjs`.

- Import wraps each existing SHA-256 hex string with bcrypt. No user resets a
  password and no unsalted hash is stored in Postgres.
- Signup and login compute the SHA-256 hex first, then bcrypt hash or compare.
  There is one scheme and no per-row flag.
- The SHA-256 hex is 64 bytes, under bcrypt's 72-byte input limit.

Wrapping 37,349 hashes with `bcryptjs` takes roughly an hour. That happens in
the rehearsal run, not during the freeze (see Cutover).

## Code changes

New `services/users.js` — the only module that touches the two models:

| Function                              | Returns                                                |
| ------------------------------------- | ------------------------------------------------------ |
| `createUser({ username, password })`  | `{ uuid, username, premium }`                          |
| `verifyLogin({ username, password })` | `{ uuid, username, premium, success: true }` or `null` |
| `getUserByUuid(uuid)`                 | `{ uuid, username, premium }` or `null`                |
| `getUserByUsername(username)`         | `{ uuid, username, premium }` or `null`                |
| `isPremium(uuid)`                     | `{ premium }` or `null`                                |
| `writeSave(uuid, saveData)`           | `{ success: true, uuid }`                              |
| `readSave(uuid)`                      | the stored JSON string or `null`                       |

New `utils/passwordHash.js` — `hashPassword(plain)`,
`verifyPassword(plain, stored)`, `wrapLegacyHash(sha256hex)`.

`routes/auth.js`, `routes/users.js`, `utils/userCache.js` call the service in
place of axios. Their HTTP behaviour does not change:

| Route           | Success                                    | Failure (unchanged from today)                                      |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| `/signUp`       | 200 `{ uuid, username, premium }`          | 400 validation; 500 generic error for a taken or over-long username |
| `/login`        | 200 `{ uuid, username, premium, success }` | 500 `{ error: "Invalid Email or password" }`                        |
| `/checkPremium` | 200 `{ premium }`                          | 500 when the user does not exist                                    |
| `/uploadSave`   | 200 `{ success: true, uuid }`              | 400 missing data; 500 on error                                      |
| `/readSave`     | 200 the save JSON                          | 500 when no save exists                                             |

`/readSave` sends the stored string directly with
`Content-Type: application/json` and does not parse it.

One deliberate behaviour change: `/signUp` ignores `premium` in the request
body. Today any client can sign up as premium by sending `premium: true`.

`UserCache` keeps its Redis and in-memory layers. Its constructor takes the
user service in place of the HTTP client, so `test/user-cache.test.js` is
updated to inject a stub service.

`hCaptcha` verification in `/signUp` is untouched.

## Freeze flag

`ACCOUNT_WRITES_FROZEN=true` makes `/signUp` and `/uploadSave` return
`503 { error: "Accounts are being migrated. Try again in a few minutes." }`.
Login, save reads and chat keep working. The flag is used once, at cutover,
and removed afterwards.

## Export

Run on a developer machine, not on the server. Output goes to
`migration-data/`, which is added to `.gitignore` because it holds password
hashes and user saves. The directory is deleted after the migration.

1. Users: `npx wrangler d1 export <database> --remote --output migration-data/users.sql`.
2. Saves: `scripts/export-worker-kv.js`, using the Cloudflare REST API with an
   API token that has KV read access (`CF_API_TOKEN`, `CF_ACCOUNT_ID`,
   `CF_KV_NAMESPACE_ID`):
   - lists every key, 1,000 per page;
   - fetches values 100 at a time through the bulk-get endpoint, falling back
     to one request per key for any value the bulk call does not return;
   - stays under the API limit of 1,200 requests per 5 minutes;
   - writes one line per save to `migration-data/saves.ndjson`
     (`{ "uuid": ..., "saveData": "<raw string>" }`);
   - is resumable: keys already in the file are skipped on a re-run.

   With bulk-get, 37k saves is a few hundred requests. If every value needed
   its own request it would take about 2.6 hours, which the resume support
   covers.

## Import

`scripts/import-worker-data.js`, run against `POSTGRES_URL`:

1. Parses the `INSERT` rows from `users.sql`.
2. Checks for duplicate usernames and duplicate uuids. If any exist it prints
   them and exits before writing anything.
3. Users: inserts rows whose uuid is not yet in Postgres, wrapping the
   password. For a uuid that already exists it updates `username` and
   `premium` only. The Worker has no password-change endpoint, so an existing
   row's password never needs re-wrapping; that is what makes a second run
   take seconds.
4. Saves: upserts every line of `saves.ndjson` by uuid.
5. Prints a report: users in export / inserted / updated, saves in export /
   upserted, saves whose uuid matches no user (imported anyway), rows skipped
   with the reason.

## Cutover

1. Ship models, service, password helper, both scripts and the freeze flag.
   Routes still call the Worker. Run `node setup-db.js`.
2. Rehearsal, no freeze: export, import, read the report. This does the slow
   bcrypt work and shows how long the KV export takes.
3. Spot-check: for a handful of real accounts, compare `/api/user/:uuid` from
   the Worker with the Postgres row, and compare one save byte for byte.
4. Off-peak: set `ACCOUNT_WRITES_FROZEN=true`.
5. Export and import again. Only users created since the rehearsal need
   hashing. Saves are re-fetched in full, because KV does not record when a
   value changed.
6. Check the report: user count equals the D1 row count, save count equals
   the KV key count.
7. Deploy the commit that switches the routes and `UserCache` to the service.
8. Unset the freeze flag. Log in with a real account and load its save.
9. After two weeks with no problems: delete the Worker, D1 database and KV
   namespace, remove `workerAUTH` from the environment and from `EXAMPLE.env`,
   `CLAUDE.md`, `AGENTS.md` and `CHAT_SETUP.md`, and delete `migration-data/`.

Rollback before step 9: revert the route-switch commit. Accounts and saves
created after step 8 exist only in Postgres and would be lost to users until
the switch is redone, so rollback is for a serious fault only.

## Testing

Native Node test runner, in `test/`, no browser.

- `passwordHash`: a known SHA-256 hex wrapped with `wrapLegacyHash` verifies
  against the original plaintext; a wrong password fails; `hashPassword`
  output verifies.
- `services/users.js` with stubbed models: each function's return shape,
  `null` on a missing user, signup never sets premium, duplicate username
  rejects.
- Import transform: parsing D1 `INSERT` lines (quotes, `0`/`1` premium),
  duplicate detection, existing-uuid rows keep their password.
- Routes with a stubbed service: the status codes and bodies in the table
  above, and 503 from `/signUp` and `/uploadSave` when frozen.
- `test/user-cache.test.js` updated for the injected service.

## Risks

- **Login cost.** `bcryptjs` runs on the main thread, about 80 ms per login,
  on the same event loop as chat and the proxy. Login volume is low; if it
  becomes a problem the native `bcrypt` package is a drop-in replacement.
- **Database size.** Saves can be 25 MB each. The rehearsal report includes
  the total size of `saves.ndjson` so disk needs are known before cutover.
- **Username collisions.** D1's schema has not been inspected. If `username`
  was not unique there, the import stops at step 2 and the duplicates are
  resolved by hand before continuing.
