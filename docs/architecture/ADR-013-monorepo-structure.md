# ADR-013: Monorepo Structure

## Status
Accepted

## Context
EyeD consists of multiple applications (mobile, provider portal), shared packages (crypto, FHIR, NFC, SDK), backend services (API gateway, decryption gateway, FHIR service, notifications), and smart contracts. These components share types, utilities, and configuration.

## Decision
Use a **pnpm workspace monorepo** with **Turborepo** for build orchestration.

### Structure
```
eyed/
├── apps/           — User-facing applications
│   ├── mobile/     — React Native / Expo
│   └── provider-portal/ — Next.js 15
├── packages/       — Shared libraries
│   ├── contracts/  — Solidity smart contracts
│   ├── sdk/        — Contract interaction SDK
│   ├── fhir/       — FHIR R4 types + validation
│   ├── crypto/     — AES-256-GCM encryption utilities
│   ├── nfc/        — NFC data encoding/decoding
│   ├── zk-circuits/ — Circom ZK circuits
│   ├── tsconfig/   — Shared TypeScript configuration
│   └── eslint-config/ — Shared ESLint configuration
├── services/       — Backend microservices
│   ├── api-gateway/         — Fastify API server
│   ├── decryption-gateway/  — Cloudflare Worker
│   ├── fhir-service/        — FHIR translation
│   └── notification-service/ — Push/SMS/email
├── infrastructure/ — IaC and deployment
│   ├── terraform/
│   └── docker/
└── docs/          — Architecture decisions and guides
```

### Tooling
- **pnpm** — Fast, disk-efficient package manager with workspace support
- **Turborepo** — Build orchestration with caching, dependency-aware task execution
- **Shared tsconfig** — Consistent TypeScript configuration via `@eyed/tsconfig`
- **Shared ESLint** — Consistent linting via `@eyed/eslint-config`

## Rationale
- Single source of truth for shared types and utilities
- Atomic changes across packages and apps
- Turborepo caching speeds up CI/CD
- Simpler dependency management than multi-repo
- pnpm workspace protocol (`workspace:*`) ensures local packages are always used

## Consequences
- All developers work in one repository
- CI runs all affected tests on every PR
- Package versioning is internal only (all packages are `private: true`)
- Turborepo handles build ordering based on `dependsOn` configuration
