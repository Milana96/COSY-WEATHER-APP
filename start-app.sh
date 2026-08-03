#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

if ! docker ps >/dev/null 2>&1; then
  echo "Docker is not available. Please install Docker and try again." >&2
  exit 1
fi

if ! docker ps --filter "name=^/cosy-mongo$" --format '{{.Names}}' | grep -q '^cosy-mongo$'; then
  docker run -d --name cosy-mongo -p 27017:27017 mongo:7.0.14 >/dev/null
else
  docker start cosy-mongo >/dev/null
fi

cd "$ROOT_DIR"
if [ ! -d node_modules ]; then
  npm install
fi

if [ ! -d backend/node_modules ]; then
  (cd backend && npm install)
fi

(cd backend && npm start) &
BACKEND_PID=$!

sleep 3

npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!

cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  docker rm -f cosy-mongo >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

wait "$BACKEND_PID" "$FRONTEND_PID"
