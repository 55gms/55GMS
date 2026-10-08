#!/usr/bin/env bash
# The only command the GitHub Actions deploy key may run (forced command in
# /root/.ssh/authorized_keys). Installed by hand at /root/deploy/entry.sh;
# copy it there again when this file changes. See docs/deploy.md.
set -euo pipefail

APP_DIR="${APP_DIR:-/root/55gms}"
STATE_DIR="${STATE_DIR:-/root/deploy}"
LOG="$STATE_DIR/releases.log"

# Node and pm2 come from nvm on the server; a forced command may start
# without the interactive shell's PATH.
if ! command -v node >/dev/null && [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
fi

die() {
  echo "deploy: $*" >&2
  exit 1
}

read -r action sha _ <<<"${SSH_ORIGINAL_COMMAND:-status}"

case "$action" in
  status)
    echo "current: $(git -C "$APP_DIR" rev-parse HEAD)"
    echo "recent deploys:"
    tail -n 5 "$LOG" 2>/dev/null || true
    exit 0
    ;;
  deploy)
    [[ "${sha:-}" =~ ^[0-9a-f]{40}$ ]] || die "expected: deploy <40-character sha>"
    ;;
  rollback)
    # Second most recent distinct sha that deployed successfully.
    sha="$(tac "$LOG" 2>/dev/null | awk '!seen[$2]++ {print $2}' | sed -n 2p)"
    [[ -n "$sha" ]] || die "no earlier deploy recorded in $LOG"
    ;;
  *)
    die "unknown request: $action"
    ;;
esac

mkdir -p "$STATE_DIR"
exec 9>"$STATE_DIR/lock"
flock -w 600 9 || die "another deploy has held the lock for 10 minutes"

git -C "$APP_DIR" fetch --quiet origin main
git -C "$APP_DIR" merge-base --is-ancestor "$sha" origin/main ||
  die "$sha is not on origin/main"

# Run the deploy script that belongs to the target commit, from a copy, so
# the checkout cannot rewrite it mid-run. Commits older than the pipeline
# fall back to the installed copy.
script="$(mktemp)"
trap 'rm -f "$script"' EXIT
if ! git -C "$APP_DIR" show "$sha:deploy/deploy.sh" >"$script" 2>/dev/null; then
  cp "$STATE_DIR/deploy.sh" "$script" || die "no deploy.sh for $sha"
fi

echo "deploy: $action $sha"
APP_DIR="$APP_DIR" STATE_DIR="$STATE_DIR" bash "$script" "$sha" 2>&1 |
  tee -a "$STATE_DIR/deploy.log"
exit "${PIPESTATUS[0]}"
