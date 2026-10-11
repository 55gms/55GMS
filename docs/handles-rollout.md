# Handles rollout

How to take production from usernames to handles. Design:
`docs/superpowers/specs/2026-10-10-handles-design.md`.

Every step is run by a person, in order. Step 7 deletes accounts and cannot be
undone except by restoring the dump from step 5.

Do not push the handles commits to `main` before step 3: the code reads
columns that do not exist until step 1.

## Before the day

- Keep `migration-data/users.sql` on the maintainer's Mac. It is the only
  record of signup order.
- Confirm whose the second `Jiayang` account is (`e0aa7d6f…`, premium). It
  will be asked to choose a handle.
- Pick the deadline, 30 days after the day, as an ISO time.
- Rehearse: restore a production dump into a scratch database on the server,
  point `POSTGRES_URL` at it for one shell, and run steps 1, 6 and 7 there.
  Read the report.

## On the day

1. **Add the columns.** They are ignored by the code that is live.

   The script is not on the server until the code is deployed, so add the
   columns with `psql` there, using the five statements in
   `scripts/add-handle-columns.js` exactly as written.

2. **Freeze account writes.** Add `ACCOUNT_WRITES_FROZEN=true` to the
   server's `.env`, then `pm2 reload ecosystem.config.cjs --update-env` in
   `/root/55gms`. Signups and save uploads now answer "Accounts are being
   migrated".

3. **Deploy.** Push `main`; wait for the Deploy workflow to go green. Logins
   keep working on the unmigrated data. For these few minutes, adding a
   friend whose name has capitals or symbols does not work from the chat
   page, which lowercases what is typed.

4. **Send the signup order.** On the Mac:
   `node scripts/export-signup-order.js --out signup-order.txt`, then
   `scp signup-order.txt 55gms:/root/signup-order.txt`. Compare
   `shasum -a 256` on both ends. Do not use rsync.

5. **Back up.** On the server: `pg_dump` the database to a file outside
   `/root/55gms`, and check the file is not empty.

6. **Dry run.** In `/root/55gms`:
   `node scripts/migrate-handles.js --order /root/signup-order.txt --report /root/handle-migration-report.csv`.
   Read the totals and the report. Expected with the data of 2026-10-10:
   about 1,324 deleted and about 1,239 + 225 asked to choose.

7. **Apply.** The same command with `--apply`. It prints "Migrated." or
   changes nothing.

8. **Set the deadline and unfreeze.** In the server's `.env`: add
   `HANDLE_MIGRATION_DEADLINE=<ISO time>` and remove
   `ACCOUNT_WRITES_FROZEN`. Reload pm2 with `--update-env`.

9. **Check.** Sign in with an old mixed-case username; sign in with a
   handle; sign in as an account from the report marked `pending` if you
   have one; open chat; look a name up on `/handles`.

## Rollback

- Before step 7: use the Deploy workflow's `rollback` run, then unfreeze.
  The new columns can stay.
- After step 7: restore the dump from step 5 (writes were frozen, so nothing
  is lost), roll the deploy back, then unfreeze.

## Afterwards

- Delete `/root/signup-order.txt`. Keep the report somewhere private: it
  maps old usernames to handles.
- At the deadline nothing needs running: accounts that did not choose keep
  their placeholder and the notices disappear.
- The Worker clean-up that was waiting (`migration-data/`, the Worker, D1,
  KV, `services/workerAccounts.js`) can go ahead.
- Accounts that never chose and were never seen again can be found with
  `handle_pending AND last_seen_at IS NULL`. Deleting them is a separate
  decision.
