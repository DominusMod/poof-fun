---
title: Fees and revenue model
group: Mechanism
---

# Fees and revenue model

Every coordinated buy pays two fees. Both are fixed in the simulation and would be fixed in the protocol.

## The two fees

| Fee | Rate | Taken from | Goes to |
|---|---|---|---|
| Protocol fee | 0.25% | Whole buy, off the top | Protocol (treasury / operations) |
| Leg fee | 1% per leg | Each allocation leg | That token's fee bucket |

On the canonical **$900 buy** with default allocation:

- Protocol fee: **$2.25**
- Split total: **$897.75** → ~$300 per leg
- Leg fees: **$3.00 × 3 = $9.00** into the three buckets
- Into pools: **$297.00 × 3 = $891.00**

Total take-home by the mechanism: $11.25 on $900, or **1.25%**.

## Where the money goes

- The **protocol fee** funds the protocol itself: development, security audits, and operations. It is the only revenue the protocol takes.
- **Leg fees** are not protocol revenue — they are user money routed by rule: to holders (claimable), to the creator (accrued), or to buybacks (burned).

## What is deliberately absent

- No launch fee in the simulation.
- No trading fee on sells.
- No fee on claiming holder rewards.
- No token for the protocol itself — poof.fun takes a cut of flow, not a position in narratives.

Fee parameters are the most likely thing to change before any mainnet version, and any change would need to be weighed against the open questions in [Risks and security](/docs/risks-and-security).
