#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/.runlogs"
mkdir -p "$LOG_DIR"

echo "[1/4] Starting frontend dev server on :5173"
(
  cd "$ROOT_DIR/frontend"
  export NVM_DIR="$HOME/.nvm"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    . "$NVM_DIR/nvm.sh"
  fi
  npm run dev -- --host 0.0.0.0 --port 5173
) >"$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

echo "$FRONTEND_PID" >"$LOG_DIR/frontend.pid"

echo "[2/4] Starting backend (memory mode) on :8080"
(
  cd "$ROOT_DIR/backend"
  source "$HOME/.sdkman/bin/sdkman-init.sh"
  sdk use java 21.0.8-tem >/dev/null
  JOB_STORE_MODE=memory mvn spring-boot:run
) >"$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

echo "$BACKEND_PID" >"$LOG_DIR/backend.pid"

echo "[3/4] Waiting for services to boot"
sleep 2

echo "[4/4] Done"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8080"
echo "Logs:     $LOG_DIR"
echo "Stop all: scripts/stop-local.sh"
