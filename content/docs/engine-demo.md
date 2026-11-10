---
title: Engine demo
group: Project
demo: true
---

# Engine demo

This page runs the live simulation from `lib/engine.ts` — the same pure functions the narrative pages use. It proves five claims about a coordinated buy, step by step.

**Concept stage, simulation only.** Nothing here touches a chain, moves real funds, or deploys a contract. The numbers below are local math in your browser.

## The five proofs

Run the $900 demonstration (or enter your own amount and pick any token) and check each claim against the output:

1. **The trader selects a token.** Only the selected token's leg is marked "you" — the other two are marked "inventory".
2. **The purchase is split across all three.** The split total (amount minus the 0.25% protocol fee) is divided by the allocation, and each leg swaps into its own pool.
3. **Only the selected token is delivered.** The "you receive" line shows a single token and amount.
4. **The other allocations are accounted for in protocol inventory.** Each non-selected leg's token inventory increases by exactly the tokens bought.
5. **Prices stay inside the allowed gap.** The market-cap gap readout shows the spread between the highest and lowest cap against the 5% band — and warns if it breaches.
