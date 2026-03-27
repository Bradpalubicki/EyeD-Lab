#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== EyeD Smoke Test ==="
echo ""

echo "1/5  Installing dependencies..."
pnpm install --frozen-lockfile
echo "     Done."
echo ""

echo "2/5  Linting..."
pnpm lint
echo "     Done."
echo ""

echo "3/5  Type-checking..."
pnpm typecheck
echo "     Done."
echo ""

echo "4/5  Building..."
pnpm build
echo "     Done."
echo ""

echo "5/5  Testing..."
pnpm test
echo "     Done."
echo ""

echo "=== All checks passed ==="
