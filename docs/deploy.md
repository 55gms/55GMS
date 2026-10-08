# Deploying 55GMS

Production is one server (SSH host `55gms`): the app in `/root/55gms`, run by
pm2 as `55gms` (10 cluster workers, port 8080), behind Caddy.

## What happens on a push to main

The `Deploy` workflow (`.github/workflows/deploy.yml`) runs:

1. **tidy** formats changed `.js` and `.md` files with Prettier and pushes a
   commit if anything changed. A failure here does not block the deploy.
2. **check** takes the tip of `main` (games excluded), installs, syntax-checks
   the server code and deploy scripts, and runs `npm run build --if-present`.
3. **deploy** SSHes to the server and asks for that commit.

On the server, `/root/deploy/entry.sh` checks the commit is on `main`, takes a
lock, then runs that commit's `deploy/deploy.sh`, which:

- refuses to run if tracked files on the server have local changes;
- checks the commit out in place;
- runs `npm install` if `package-lock.json` changed;
- runs `npm run build --if-present`;
- reloads only if something outside `static/`, `docs/`, `scripts/`,
  `deploy/`, `.github/`, `test(s)/` and `*.md` changed, or the build output
  appeared or disappeared. Before reloading it boots the new code on port 8099
  (the preflight); if that fails, no live worker is touched;
- checks `/` and `/s` on port 8080.

If any step fails, the previous commit is put back and the workflow run goes
red. Commits that only add or change games do not reload the app, so chat and
proxy connections are not dropped.

## Rolling back

Actions tab → Deploy → Run workflow → `rollback`. This deploys the previous
successful commit. Running it twice returns to where you started.

## Looking at the server

- `/root/deploy/releases.log`: every successful deploy, newest last.
- `/root/deploy/deploy.log`: full output of every deploy.
- `/root/deploy/preflight.log`: output of the last preflight boot.
- `pm2 logs 55gms`: the app.

To run a deploy by hand on the server:

    SSH_ORIGINAL_COMMAND="deploy $(git -C /root/55gms rev-parse origin/main)" /root/deploy/entry.sh

## Adding a build step

Add a `build` script to `package.json`; CI and every deploy already run it.
If it writes `dist/current/static`, the server serves that directory instead
of `static/`: `ecosystem.config.cjs` sets `STATIC_ROOT` when the directory
exists, and `index.js` serves whatever `STATIC_ROOT` names (default
`static/`). The first deploy that produces it reloads the app; after that, a
build that swaps `dist/current` (a symlink) is live without a reload. `dist/`
is git-ignored. Without `STATIC_ROOT`, `node .` serves `static/` as before.

## Setting it up again

- `/root/deploy/entry.sh` and `/root/deploy/deploy.sh` are copies of the files
  in `deploy/`. Copy `entry.sh` again whenever `deploy/entry.sh` changes; the
  `deploy.sh` copy is only a fallback for commits older than the pipeline.
- The deploy key's line in `/root/.ssh/authorized_keys` starts with
  `command="/root/deploy/entry.sh",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding`.
- Repository secrets: `DEPLOY_SSH_KEY` (private key), `DEPLOY_HOST`,
  `DEPLOY_KNOWN_HOSTS` (output of `ssh-keyscan -t ed25519 <host>`).
- pm2 is started with `pm2 start ecosystem.config.cjs && pm2 save`.

## Custom domains

Caddy's catch-all block proxies every hostname to `localhost:8080` and issues
certificates on demand. Deploys never touch Caddy; they only need port 8080
to keep answering, which the rolling reload does.
