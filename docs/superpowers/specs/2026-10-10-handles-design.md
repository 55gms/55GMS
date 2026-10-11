# Handles: lowercase `@handle` usernames and the migration to them

Date: 2026-10-10

## Goal

Replace free-form usernames with handles, shown everywhere as `@handle`.

- A handle is 3 to 16 characters: `a-z`, `0-9` and `-`. It starts and ends
  with a letter or number and never has two dashes in a row. Regex:
  `^[a-z0-9]+(-[a-z0-9]+)*$`, plus the length check.
- Handles are not case sensitive: `@Jiayang` and `@jiayang` are the same
  handle. They are stored lowercase.
- The `@` is display only. It is never stored, and every input accepts the
  handle with or without it.
- Chat finds people by handle (start a chat, add a friend, add a group member).

Success means:

- Every account in production has a valid, unique handle.
- Nobody is locked out: every existing account can still sign in with the
  username it has always typed, and also with its handle.
- No new account can be created with anything but a valid handle.
- Accounts that could not keep their name are made to choose a handle before
  they can use chat.

## Decisions already made

| Question                             | Decision                                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| Who keeps a contested handle         | The oldest account                                                                        |
| Old usernames at login               | Keep working ("legacy" login)                                                             |
| Accounts that lose their name        | Forced "choose your handle" screen                                                        |
| Inactive accounts                    | Delete the ones that own nothing, and only where their handle is contested                |
| Later clean-up of abandoned accounts | Deferred, contested handles only; this spec only records the data it will need            |
| Length                               | Stays 3 to 16 (assumed; "24" was read as the alphabet, not a length. Change here if not.) |

## Production today (read-only counts, 2026-10-10)

37,737 accounts.

| Group                                                   | Accounts |
| ------------------------------------------------------- | -------- |
| Already a valid handle                                  | 17,354   |
| Valid once lowercased                                   | 13,434   |
| Need characters removed (spaces, `_ .`, `@`, non-ASCII) | 6,724    |
| Fewer than 3 characters once cleaned ("unusable")       | 225      |
| Contested handles (cleaned name shared by 2+ accounts)  | 1,860    |
| Accounts on contested handles                           | 4,264    |

"Cleaned" means: lowercase, remove everything that is not `a-z 0-9 -`,
collapse runs of dashes to one, and drop dashes from both ends.

Two facts shape the design:

- **No signup dates exist.** `createdAt` on pre-cutover accounts is the import
  time, and the Worker never stored one. The only record of signup order is
  the row order of `migration-data/users.sql` (the Worker's insertion order),
  which exists only on the maintainer's Mac. It must not be deleted before
  this migration has run.
- **No last-login data exists.** "Inactive" therefore cannot mean "not seen
  for N days" yet. It means "owns nothing" (below).

## Definitions

**Signup rank.** Position of the account's UUID in `users.sql`. Accounts not in
that file (created after the cutover) rank after all of those, ordered by
`createdAt`, then UUID.

**Empty account.** All of: not premium; created before the cutover
(`2026-10-02T12:23Z`); no row in `user_saves`; no row in `chat_members`; no
message sent; no row in `friends` in either direction. 11,300 accounts today.

**Contested handle.** A cleaned name of 3+ characters shared by two or more
accounts.

## Data model

Changes to `users` (model `models/User.js`):

| Column            | Type                    | Meaning                                                                      |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------- |
| `username`        | unchanged, still unique | Now holds the handle. Keeps its name so API responses do not change shape.   |
| `legacy_username` | string, nullable        | The username before the migration, exactly as stored. Null for new accounts. |
| `handle_pending`  | boolean, default false  | True until the account has chosen a handle on the forced screen.             |
| `last_seen_at`    | timestamp, nullable     | Last signed-in activity, for the later clean-up.                             |

After the migration, a CHECK constraint (the handle regex and
`length(username) between 3 and 16`) is
added so the database refuses anything else. The existing unique index on
`username` is then enough for case-insensitive uniqueness.

Every account always has a valid handle, including pending ones (they hold a
generated placeholder). Nothing downstream has to handle a missing handle.

The three columns are added by `setup-db.js` as nullable/defaulted columns, so
the code running before the deploy is unaffected by them.

## The handle rule: `utils/handle.js`

One module, used by every server entry point:

- `normalizeHandle(input)`: trim, drop one leading `@`, lowercase.
- `isValidHandle(handle)`: tests the regex.
- `cleanToHandle(name)`: the "cleaned" transform above, used by the migration
  and to pre-fill suggestions.

`static/assets/js/auth.js` and the new chooser page carry the same regex for
instant feedback; the server remains the authority.

## Behaviour

### Signup

`POST /api/signUp` normalizes the submitted name and rejects it unless it is a
valid handle ("Handles use only letters, numbers and dashes, 3 to 16 characters").
A taken handle returns a specific "That handle is taken" error instead of the
current generic 500. The form shows a fixed `@` in front of the field.

### Login

The request field stays `username`. The server builds up to three candidates:

1. the account whose `legacy_username` equals the input exactly as typed;
2. the account whose `username` equals the normalized input;
3. the account whose `username` equals the input exactly (only matters before
   the migration has run, so the same code works on both sides of it).

The password is checked against each distinct candidate in that order and the
first match signs in. The password decides which account is meant.

This is what lets people on a contested handle keep signing in. Example:
`King` signed up first and holds `@king`; `king` signed up later and holds the
placeholder `@king2`.

| Who     | Types             | Candidates tried                              | Result                  |
| ------- | ----------------- | --------------------------------------------- | ----------------------- |
| Later   | `king`            | legacy `king` (theirs)                        | In, sent to the chooser |
| Earlier | `King`            | legacy `King` (theirs)                        | In                      |
| Earlier | `king` or `@king` | legacy `king` (fails), handle `king` (theirs) | In                      |
| Later   | `king2`           | handle `king2` (theirs)                       | In                      |

Typing an old name in a different case than it was registered with fails for
a contested account, exactly as it does today. If two contested accounts share
a password, the exact legacy match wins, which is also today's behaviour.

The response gains `handlePending`. If the handle returned differs from what
was typed by more than case or `@`, the client shows a one-time notice: "You
are now @coolguy. You can sign in with either name."

### Forced "choose your handle" screen

New page `static/handle.html` (route `/handle`, added to `ACCOUNT_PAGES` in
`utils/features.js`).

- Shown after login when `handlePending` is true.
- Also reached by people who are already signed in (sessions last 30 days):
  `chat.html` and `account.html` call a new `GET /api/me` on load and redirect
  to `/handle` when pending. `GET /api/me` returns
  `{ uuid, username, premium, handlePending }` and also refreshes the stale
  `username` in `localStorage`.
- The field is pre-filled with the account's placeholder. The user can keep it
  or type another; availability is checked on submit.
- `POST /api/handle` `{ handle }` (session required): validates, sets
  `username`, clears `handle_pending`, invalidates the user cache entry.
- Only pending accounts can use it. Changing a handle freely is out of scope.

Server-side enforcement, so the screen cannot be skipped: for a pending
account, the chat write endpoints in `routes/messaging.js` (send message,
create chat, friend request and the other username-taking routes) and the
`send_message` socket event return `handle_required`. Games, saves and premium
are not gated.

### Info page and handle lookup

New page `static/handles.html` (route `/handles`, added to `ACCOUNT_PAGES`),
linked from the bottom of the login page ("Usernames are now handles. What
changed?") and from the signup page.

It explains, in plain words: what a handle is and the allowed characters;
that the old username and password still sign you in; that some accounts were
given a cleaned-up handle and some must choose one; and the deadline below.

It also has a lookup: type an old username, get the handle it has now.

- `POST /api/handle-lookup` `{ username }`, no sign-in needed.
- Match order: exact `legacy_username`; otherwise, if exactly one account
  matches ignoring case, that one.
- Responses: the handle ("`Cool_Guy` is now `@coolguy`"); or "this account
  still has to choose a handle: sign in with the old username to pick one"
  for a pending account (its placeholder is not shown as if it were final);
  or "more than one account used that name: sign in with your old username
  and password to see yours"; or "no account with that name" (which is also
  what a deleted account gets, with a pointer to sign up again).
- It reveals nothing that chat does not already show (both names are public),
  but it is rate limited per IP so it cannot be used to dump the user list.
  The project has no rate limiter yet; this adds `express-rate-limit` and
  applies it to this route only.

### Deadline notices

The launch date is stored in one place (`HANDLE_MIGRATION_DEADLINE`, set on
the day) and the notices show the actual date, not a rolling "30 days".

- Login page: a banner above the form, "Usernames are now handles. Sign in
  before <date> to choose yours", linking to `/handles`.
- Choose-a-handle screen: "Choose your handle before <date>".
- The one-time notice for automatically converted accounts links to
  `/handles` too.
- The banners disappear after the deadline.

At the deadline, placeholders are locked in. An account that has not chosen
by then keeps the placeholder it was given (`king2`, `user1234567`) as its
handle: the choose-a-handle screen stops appearing and the chat gate lifts.
Nothing is deleted. This needs no job: `handlePending` is reported as
`handle_pending` and "now is before the deadline". The stored flag is left
as it is, so the deferred clean-up can still tell who never chose.

The choose-a-handle screen says so: "Choose your handle before <date>, or you
keep `@king2`."

### Chat

- `getUserByUsername` in `routes/messaging.js` normalizes its input, so
  `@Jiayang`, `Jiayang` and `jiayang` all find the same account.
- `static/assets/js/chat.js` and `chat.html` show `@handle` wherever a
  username is shown today, and the inputs say "handle".
- The `send_message` socket event stops trusting `senderUsername` from the
  client and resolves it from the socket's user UUID.
- Old messages: only 1,637 of 56,298 store a `senderUsername`. The migration
  sets those to null on non-system messages, so all history resolves the
  current handle by UUID, which the read path already does.
- System messages that contain a name in their text ("X has left this group")
  are left as they are.

Handle changes reach other pm2 workers when their user-cache entry expires
(the cache already has a TTL); a handle can lag by that long in other people's
chat lists. Accepted.

### Admin

`routes/admin.js` keeps its exact match on `jiayang`. The migration asserts
that account `fe928c1a…` holds `jiayang` afterwards and aborts otherwise. The
second account that cleans to the same name (`Jiayang`, `e0aa7d6f…`, premium)
ranks later and becomes pending.

### Last seen

Any request that carries a valid session updates `last_seen_at`, at most once
per hour per account. Logging in is not enough on its own because a session
lasts 30 days.

### Worker backend

Production runs on Postgres. For forks still on the Worker backend, the signup
rule applies (it lives in the route), `handlePending` is always false, and the
chooser endpoints return 503. No Worker changes.

## Migration: `scripts/migrate-handles.js`

Dry run by default; `--apply` to write. Takes the signup-order file as an
argument. Everything below happens in one transaction.

1. **Rank** every account (see Definitions).
2. **Delete** empty accounts that sit on a contested handle: 1,324 today.
   Never the admin account. Their `user_status` rows go with them; by
   definition they have no other rows. Empty accounts whose handle nobody else
   wants are kept.
3. **Record** `legacy_username = username` on every remaining account.
4. **Assign**, per cleaned name, in rank order:
   - the first account gets the cleaned name, `handle_pending = false`;
   - every later account gets a placeholder (the cleaned name plus the lowest
     free number, e.g. `king2`, shortened to fit 16) and `handle_pending = true`;
   - unusable names get `user` plus seven digits and `handle_pending = true`;
   - names containing any non-ASCII character (225 today, e.g. Chinese) never
     win a handle automatically, because what is left after cleaning is a
     fragment the owner did not choose. They are always `handle_pending`,
     with the cleaned remainder as the placeholder if it is 3+ characters
     and free, otherwise `user` plus seven digits.
     Placeholders are allocated after all winners, so they never take a handle
     someone legitimately holds.
5. **Clear** `senderUsername` on non-system messages.
6. **Assert**: every `username` matches the regex, all are unique, the admin
   account holds `jiayang`, and the account count equals before minus deleted.
7. **Report**: a CSV of every account touched (UUID, old name, new handle,
   action: lowercased / cleaned / pending / deleted) and the totals.

After the transaction commits, the script adds the CHECK constraint.

Expected result with today's data: 1,324 deleted; 159 contested handles freed
entirely, 679 settled with one remaining claimant, 1,022 still contested,
leaving about 1,239 accounts pending on those plus 225 with unusable names.

### What goes to the server

The script needs only the UUID order, not the Worker export. A local step
writes `signup-order.txt` (UUIDs only, no password hashes) from `users.sql`;
that file is copied with `scp` and its checksum compared on both ends.

### Run order on the day

1. `node setup-db.js` on the server adds the three columns. The running code
   ignores them.
2. Set `ACCOUNT_WRITES_FROZEN=true` and reload (blocks signups and save
   uploads for the duration; this switch already exists).
3. Push the code; the normal Actions deploy ships it. Login keeps working on
   unmigrated data because of candidate 3.
4. `pg_dump` the database on the server.
5. Dry run; read the report.
6. `--apply`, with explicit go-ahead, since step 2 of the migration deletes
   accounts.
7. Spot checks: sign in with an old mixed-case name, with a handle, and as a
   pending account; open chat.
8. Unfreeze and reload.

Handle login works from step 6 onward. There is no waiting period.

Rollback: before step 6, redeploy the previous commit. After step 6, restore
the dump (accounts are frozen, so nothing is lost) and redeploy the previous
commit.

### Rehearsal

The whole run order is rehearsed first against a local database restored from
a production dump, and the dry-run report reviewed, before anything touches
production.

## Files touched

| File                                                                                                             | Change                                                                           |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `utils/handle.js` (new)                                                                                          | The rule                                                                         |
| `models/User.js`, `setup-db.js`                                                                                  | Three columns                                                                    |
| `services/postgresAccounts.js`, `services/accounts.js`, `services/workerAccounts.js`                             | Handle rule at signup, three-candidate login, `setHandle`, `touchLastSeen`       |
| `routes/auth.js`                                                                                                 | Signup validation and errors, `handlePending`, `GET /api/me`, `POST /api/handle` |
| `routes/messaging.js`, `index.js`                                                                                | Normalized lookups, pending gate, server-side sender name, last-seen             |
| `utils/features.js`                                                                                              | `/handle` page                                                                   |
| `static/handles.html` (new), `package.json`                                                                      | Info page, lookup, deadline banner; `express-rate-limit`                         |
| `static/handle.html` (new), `static/signup.html`, `static/login.html`, `static/account.html`, `static/chat.html` | `@` branding, chooser, pending redirect                                          |
| `static/assets/js/auth.js`, `static/assets/js/chat.js`                                                           | Validation, notice, `@handle` display                                            |
| `scripts/migrate-handles.js` (new)                                                                               | The migration                                                                    |
| `CLAUDE.md`, `docs/`                                                                                             | Document handles and the legacy column                                           |

## Out of scope

- Changing a handle after it has been chosen.
- The later clean-up of abandoned accounts. Planned shape: some months after
  launch, delete accounts that are still `handle_pending` and have a null
  `last_seen_at`. Those are by construction accounts that lost a contested
  handle or had an unusable name and never came back. It gets its own
  decision and its own backup.
- Display names separate from handles.
- Deleting the Worker, `workerAccounts.js` and `migration-data/` (the existing
  post-cutover clean-up; it now waits for this migration).
- Automated tests, unless asked for.

## Open point

The `Jiayang` account (`e0aa7d6f…`, created 2026-10-07, premium) should be
confirmed as the maintainer's own before launch. It has no admin access.
