#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/.runlogs"

for name in frontend backend worker; do
  pid_file="$LOG_DIR/${name}.pid"
  if [[ -f "$pid_file" ]]; then
    pid="$(cat "$pid_file")"
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "Stopping $name (PID $pid)"
      kill "$pid" || true
    fi
    rm -f "$pid_file"
  fi
done

echo "Stopped known local services."
