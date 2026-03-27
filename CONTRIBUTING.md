# Contributing to EyeD

## Setup

```bash
# Clone and install
git clone <repo-url> && cd EyeD
pnpm install

# Verify everything works
bash scripts/smoke-test.sh
```

**Requirements:** Node >= 20, pnpm 9.x

## Development Workflow

```bash
pnpm dev          # Start all services in watch mode
pnpm test         # Run all tests (Vitest workspace)
pnpm test:watch   # Watch mode
pnpm test:coverage # With V8 coverage reports
pnpm lint         # ESLint across all packages
pnpm typecheck    # TypeScript checking
pnpm build        # Full production build
```

## Project Structure

```
apps/
  mobile/              # React Native (Expo) app
  provider-portal/     # Next.js provider dashboard
packages/
  contracts/           # Solidity smart contracts (Hardhat)
  crypto/              # AES-256-GCM encryption, key management
  eslint-config/       # Shared ESLint config
  fhir/                # FHIR resource helpers & validation
  nfc/                 # NFC profile encoding/decoding
  sdk/                 # Client SDK
  tsconfig/            # Shared TypeScript configs
  zk-circuits/         # Zero-knowledge circuits (Phase 3)
services/
  api-gateway/         # Fastify API gateway
  decryption-gateway/  # Cloudflare Worker for decryption
  fhir-service/        # FHIR data service
  notification-service/ # Push/email notifications
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/). Commitlint enforces this via a Git hook.

```
feat: add biometric enrollment flow
fix: correct NFC checksum calculation
refactor: simplify key derivation
docs: update API gateway README
test: add edge cases for FHIR validation
chore: bump vitest to v3.2
```

**Scope** is optional: `feat(crypto): add AES key rotation`

## Branch Strategy

- `main` — production-ready code
- `develop` — integration branch
- `feat/*`, `fix/*`, `refactor/*` — work branches off `develop`

## Adding Tests

Tests live alongside source code in `src/__tests__/`. Vitest runs natively on TypeScript — no build step needed.

```bash
# Run tests for a specific package
pnpm --filter @eyed/crypto test

# Run with coverage
pnpm test:coverage
```

## Pre-commit Hooks

- **Pre-commit:** ESLint + Prettier on staged files
- **Commit-msg:** Commitlint validates the commit message format
