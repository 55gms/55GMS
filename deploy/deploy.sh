#!/usr/bin/env bash
# Deploys one commit of 55GMS in place. Run by deploy/entry.sh, never by hand
# from the working tree (the checkout would rewrite the running script).
#
# errexit is not relied on: bash ignores it inside functions called from an
# `if`, so every step that can fail ends in `|| return 1`.
set -uo pipefail

sha="${1:?usage: deploy.sh <sha>}"
APP_DIR="${APP_DIR:-/root/55gms}"
STATE_DIR="${STATE_DIR:-/root/deploy}"
LIVE_PORT="${LIVE_PORT:-8080}"
PREFLIGHT_PORT="${PREFLIGHT_PORT:-8099}"
PM2_RELOAD="${PM2_RELOAD:-pm2 reload ecosystem.config.cjs --update-env}"
# Must match BUILT_STATIC in ecosystem.config.cjs.
BUILT_STATIC="dist/current/static"

cd "$APP_DIR" || exit 1
reloaded=0

log() { echo "[$(date -u +%FT%TZ)] $*"; }

# What ecosystem.config.cjs will hand the workers as STATIC_ROOT.
static_root() {
  if [[ -e "$BUILT_STATIC" ]]; then echo "$BUILT_STATIC"; else echo static; fi
}

# A reload drops chat and proxy websockets, so skip it when only files the
# server reads from disk per request (or never loads) changed.
needs_reload() {
  git diff --name-only "$1" "$2" |
    grep -qvE '^(static/|docs/|scripts/|deploy/|\.github/|tests?/)|\.md$'
}

install_and_build() {
  if ! git diff --quiet "$1" "$2" -- package-lock.json; then
    log "package-lock.json changed, installing"
    # In place, not `npm ci`: wiping node_modules would 404 the proxy
    # bundles that are served from it while the install runs.
    npm install --no-audit --no-fund || return 1
    # Never leave npm's rewrites behind; the next deploy refuses a dirty tree.
    git checkout --quiet -- package.json package-lock.json
  fi
  npm run --silent build --if-present || return 1
}

# Boots the new code on a spare port before any live worker is replaced.
preflight() {
  local pid ok=1
  STATIC_ROOT="$(static_root)" PORT="$PREFLIGHT_PORT" node index.js \
    >"$STATE_DIR/preflight.log" 2>&1 &
  pid=$!
  for _ in $(seq 1 20); do
    if curl -fsS -o /dev/null "http://127.0.0.1:$PREFLIGHT_PORT/"; then
      ok=0
      break
    fi
    kill -0 "$pid" 2>/dev/null || break
    sleep 1
  done
  kill "$pid" 2>/dev/null
  wait "$pid" 2>/dev/null
  if [[ "$ok" != 0 ]]; then
    log "preflight boot failed:"
    tail -n 20 "$STATE_DIR/preflight.log"
    return 1
  fi
}

health() {
  for _ in $(seq 1 30); do
    if curl -fsS -o /dev/null "http://127.0.0.1:$LIVE_PORT/" &&
      curl -fsS -o /dev/null "http://127.0.0.1:$LIVE_PORT/s"; then
      return 0
    fi
    sleep 1
  done
  log "health check failed on port $LIVE_PORT"
  return 1
}

# apply <from> <to> <preflight: yes|no>
apply() {
  local root_before
  root_before="$(static_root)"
  install_and_build "$1" "$2" || return 1
  # The first build to produce dist/ (or a build step being removed) changes
  # what the workers serve, which only a reload picks up.
  if needs_reload "$1" "$2" || [[ "$(static_root)" != "$root_before" ]]; then
    if [[ "$3" == yes ]]; then
      preflight || return 1
    fi
    log "reloading"
    reloaded=1
    $PM2_RELOAD || return 1
  else
    log "no server changes, not reloading"
  fi
  health || return 1
}

if [[ -n "$(git status --porcelain -uno)" ]]; then
  log "tracked files have local changes; refusing to deploy"
  git status --short -uno
  exit 1
fi

previous="$(git rev-parse HEAD)"

if [[ "$previous" == "$sha" ]]; then
  log "$sha is already checked out; rebuilding"
  npm run --silent build --if-present && health || exit 1
  echo "$(date -u +%FT%TZ) $sha" >>"$STATE_DIR/releases.log"
  exit 0
fi

log "deploying $previous -> $sha"
git checkout --quiet --detach "$sha" || exit 1

if apply "$previous" "$sha" yes; then
  echo "$(date -u +%FT%TZ) $sha" >>"$STATE_DIR/releases.log"
  log "deployed $sha"
  exit 0
fi

log "deploy failed; restoring $previous"
git checkout --quiet --detach "$previous" || {
  log "RESTORE FAILED: could not check out $previous"
  exit 1
}
install_and_build "$sha" "$previous" || log "RESTORE: install or build failed"
if [[ "$reloaded" == 1 ]]; then
  $PM2_RELOAD || log "RESTORE: reload failed"
fi
if health; then
  log "restored $previous"
else
  log "RESTORE FAILED: site is unhealthy on $previous"
fi
exit 1
