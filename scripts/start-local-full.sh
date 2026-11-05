#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/.runlogs"
mkdir -p "$LOG_DIR"

# Frontend
echo "[1/5] Starting frontend on :5173"
(
  cd "$ROOT_DIR/frontend"
  export NVM_DIR="$HOME/.nvm"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    . "$NVM_DIR/nvm.sh"
  fi
  npm run dev -- --host 0.0.0.0 --port 5173
) >"$LOG_DIR/frontend.log" 2>&1 &
echo "$!" >"$LOG_DIR/frontend.pid"

# Worker
echo "[2/5] Starting worker on :8090"
(
  cd "$ROOT_DIR/worker"
  if [[ -d ".venv" ]]; then
    source .venv/bin/activate
  fi
  uvicorn app:app --host 0.0.0.0 --port 8090
) >"$LOG_DIR/worker.log" 2>&1 &
echo "$!" >"$LOG_DIR/worker.pid"

# Backend
echo "[3/5] Starting backend (mongo mode) on :8080"
(
  cd "$ROOT_DIR/backend"
  source "$HOME/.sdkman/bin/sdkman-init.sh"
  sdk use java 21.0.8-tem >/dev/null
  JOB_STORE_MODE=mongo mvn spring-boot:run
) >"$LOG_DIR/backend.log" 2>&1 &
echo "$!" >"$LOG_DIR/backend.pid"

# Optional services hint
echo "[4/5] Note"
echo "This mode expects MongoDB and Redis to be available."

echo "[5/5] Done"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8080"
echo "Worker:   http://localhost:8090"
echo "Logs:     $LOG_DIR"
echo "Stop all: scripts/stop-local.sh"
