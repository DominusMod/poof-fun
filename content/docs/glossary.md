---
title: Glossary
group: Project
---

# Glossary

The terms poof.fun uses, in one place.

- **Narrative.** The unit of launch: one story told through three tokens. Listed under Discover, traded on a narrative page.
- **Token A / B / C.** The three tokens of a narrative. By convention A is orange (holder rewards), B is blue (creator rewards), C is green (buyback and burn) — but any token can carry any fee destination.
- **Coordinated buy.** A purchase split across all three pools in fixed allocation, delivering only the selected token to the trader.
- **Allocation.** The three percentages governing the split. Must total 100. Default: 33.33 / 33.33 / 33.34.
- **Protocol fee.** 0.25% taken off the top of every buy. Protocol revenue.
- **Leg fee.** 1% taken from each allocation leg into that token's fee bucket.
- **Fee bucket.** The per-token accumulator of leg fees, routed to holder rewards, creator rewards, or buybacks depending on the token's fee identity.
- **Fee identity.** A token's fee destination: holder rewards, creator rewards, or buyback and burn.
- **Protocol inventory.** The non-selected legs of every buy, held by the protocol. Funds coordinated selling.
- **Independent sell.** Selling one token out of its own pool only.
- **Coordinated sell.** Selling one token while the protocol sells matching dollar value of the other two from inventory.
- **Market-cap gap.** The spread between the highest and lowest token market cap in a narrative, as a fraction of the highest. The UI warns past the 5% band.
- **Constant-product pool.** The `x · y = k` market maker each token trades in, quoted against USD in this simulation.
- **Engine.** `lib/engine.ts`: the pure-function market math powering the simulation, written to be replaceable by real contracts.
