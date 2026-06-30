#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Starting Postgres and Vault..."
docker compose -f ci/docker-compose.yml up -d db

if docker ps --format '{{.Names}}' | grep -qx vault_dev; then
  echo "Reusing existing vault_dev container"
else
  docker compose -f ci/docker-compose.yml up -d vault_dev
fi

echo "Waiting for services..."
for _ in $(seq 1 30); do
  if curl -sf http://localhost:8200/v1/sys/health >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "Ensuring ddhub_test database exists..."
PGPASSWORD=ddhub psql -h localhost -U ddhub -d ddhub -tc \
  "SELECT 1 FROM pg_database WHERE datname = 'ddhub_test'" | grep -q 1 \
  || PGPASSWORD=ddhub psql -h localhost -U ddhub -d ddhub -c "CREATE DATABASE ddhub_test"

echo "Running test database migrations..."
pnpm run migrations:build
node scripts/run-test-migrations.js

echo "Enabling Vault KV engine at ddhub/ (if needed)..."
docker exec vault_dev vault secrets enable -version=1 -path=ddhub kv >/dev/null 2>&1 \
  || true

echo "E2E dependencies are ready."
