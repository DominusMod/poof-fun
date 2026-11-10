---
title: Roadmap
group: Project
---

# Roadmap

poof.fun is at concept stage. The path from here to mainnet runs through four phases — and this website is phase one.

## Phase 1 — Research and proof of concept (now)

- This site: UI, simulation, and docs.
- The engine as pure functions (`lib/engine.ts`) with the five proofs demonstrated live.
- Open questions written down honestly instead of hand-waved.

## Phase 2 — Core protocol

- Solana program implementing coordinated buys: split routing, per-leg fees, inventory accounting.
- Independent and coordinated sells with inventory-capped matching legs.
- Fee buckets: claimable holder rewards, creator accrual, programmatic buyback-and-burn.
- Devnet deployment with the wallet adapter in this UI pointed at real (valueless) transactions.

## Phase 3 — Economic features

- Market-cap gap mechanism: decide, from the open questions, whether arbitrage incentives, dynamic allocation, or inventory rebalancing (or a combination) keeps the band — and implement it.
- Allocation strategies beyond fixed splits (e.g. momentum-weighted, creator-configured curves).
- Analytics: per-narrative flow dashboards, inventory health, burn verification.

## Phase 4 — Security and mainnet

- Independent audits of the program, with findings published.
- Bug bounty and guarded launch limits.
- Mainnet deployment with capped narrative creation, then progressive decentralisation of fee parameters.

No dates are committed. Phases advance when the open questions behind them are answered, not before.
