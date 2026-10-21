#!/usr/bin/env bash
# Builds and installs epoxy-server, the Rust Wisp server, on the production
# server, and starts it as the epoxy-server systemd service. Run by hand as
# root from the app directory:
#
#   bash deploy/setup-epoxy.sh
#
# Running it again rebuilds EPOXY_COMMIT and restarts the service, which
# drops open proxy connections. It does not touch Caddy or .env; the steps
# that switch traffic over are in docs/proxy-stack.md.
set -euo pipefail

EPOXY_REPO="https://github.com/MercuryWorkshop/epoxy-tls.git"
# The server from the same epoxy-tls release (2.1.19) as the client inside
# @mercuryworkshop/epoxy-transport. Change the two together.
EPOXY_COMMIT="0c11678d72a636c3a4bc723db87e03e7b888eaf9"
SRC_DIR="${SRC_DIR:-/root/epoxy-tls}"
BIN="/usr/local/bin/epoxy-server"
CONFIG="/etc/epoxy-server/config.toml"
UNIT="/etc/systemd/system/epoxy-server.service"
# Must match the bind address in deploy/epoxy-server.toml.
PORT=8091

cd "$(dirname "$0")/.."
log() { echo "[setup-epoxy] $*"; }

if ! command -v cc >/dev/null || ! command -v git >/dev/null; then
  log "installing a C toolchain and git"
  apt-get update -qq
  apt-get install -y -qq build-essential pkg-config git
fi

if ! command -v cargo >/dev/null && [[ ! -x "$HOME/.cargo/bin/cargo" ]]; then
  log "installing rustup"
  # The toolchain itself comes from rust-toolchain.toml in epoxy-tls.
  curl -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal --default-toolchain none
fi
export PATH="$HOME/.cargo/bin:$PATH"

if [[ ! -d "$SRC_DIR/.git" ]]; then
  git clone --quiet "$EPOXY_REPO" "$SRC_DIR"
fi
git -C "$SRC_DIR" fetch --quiet origin
git -C "$SRC_DIR" checkout --quiet --detach "$EPOXY_COMMIT"

log "building epoxy-server at $EPOXY_COMMIT (several minutes the first time)"
(cd "$SRC_DIR" && RUSTFLAGS="-C target-cpu=native" cargo build --release -p epoxy-server)

if ss -ltnH "sport = :$PORT" | grep -q . && ! systemctl is-active --quiet epoxy-server; then
  log "port $PORT is taken by something else:"
  ss -ltnp "sport = :$PORT"
  exit 1
fi

install -m 755 "$SRC_DIR/target/release/epoxy-server" "$BIN"
install -D -m 644 deploy/epoxy-server.toml "$CONFIG"
install -m 644 deploy/epoxy-server.service "$UNIT"
systemctl daemon-reload
systemctl enable --quiet epoxy-server
systemctl restart epoxy-server

# The check uses wisp-js from node_modules; node comes from nvm.
if ! command -v node >/dev/null && [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
fi
for _ in $(seq 1 10); do
  curl -fs -o /dev/null "http://127.0.0.1:$PORT/" && break
  sleep 1
done
node scripts/wisp-check.js "ws://127.0.0.1:$PORT/api/live/"
log "epoxy-server $("$BIN" --version | head -n 1) is running on 127.0.0.1:$PORT"
