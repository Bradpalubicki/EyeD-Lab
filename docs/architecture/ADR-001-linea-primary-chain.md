# ADR-001: Linea as Primary Blockchain

## Status
Accepted

## Context
EyeD needs an EVM-compatible L2 blockchain for:
- Soulbound identity tokens (ERC-5192)
- Access control smart contracts
- Immutable audit trail via events
- Account abstraction (ERC-4337) for gasless UX

The original PROJECT_PLAN.md selected Base (Coinbase). After further evaluation, we changed to Linea.

## Decision
**Linea** is the primary chain for all EyeD smart contracts.

### Rationale
- **Consensys backing** — Consensys (MetaMask, Infura) has deep institutional relationships and recent SWIFT partnership, critical for healthcare/government credibility
- **Lowest gas fees** — Among the cheapest L2s, essential for per-scan micro-transactions and audit log events
- **Full EVM compatibility** — All Solidity tooling, OpenZeppelin libraries, Hardhat/Foundry work out of the box
- **zkEVM technology** — Zero-knowledge rollup provides stronger security guarantees than optimistic rollups
- **Account abstraction support** — Native support for gasless patient transactions
- **Growing ecosystem** — Active developer community and grant programs

### Secondary Chain
Polygon PoS remains the secondary chain for regions where Polygon has stronger government relationships (India, Southeast Asia). Multi-chain deployment in Phase 4+.

## Consequences
- All contract deployment scripts target Linea Sepolia (testnet) and Linea mainnet
- RPC configuration uses Linea endpoints (Infura/Alchemy)
- Block explorer verification on Lineascan
- Contract addresses will be Linea-specific
