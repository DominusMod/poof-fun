---
title: Equal valuation
group: Mechanism
---

# Equal valuation

The most common misunderstanding about poof.fun — and the one these docs will not let stand — is that splitting buys equally keeps the three tokens equally valued. **It does not.**

## Why equal flows do not give equal prices

Each token trades in its own constant-product pool (`x · y = k`). Price is `reserveQuote / reserveBase`, and identical dollar flows move different pools by different amounts whenever the pools are in different states. A $300 leg into a small pool moves its price far more than a $300 leg into a deep one.

Worse, selection is lopsided in practice: if every trader picks DOGREV, DOGREV's pool takes the full speculative pressure while the other two legs are passive inventory buys. Equal allocation of *dollars* does not mean equal *pressure*.

## A shared pool does not automatically give equal valuations either

A tempting fix is to merge the three tokens into one joint pool or curve. That does not solve valuation — it abolishes it. A single shared reserve cannot express three independent prices, so "equal valuation" becomes true by definition and meaningless in practice. The moment the tokens are separately tradeable, their valuations can diverge.

## What poof.fun actually does

- Starts each narrative near parity (equal or near-equal starting market caps).
- Routes every buy proportionally so no pool is starved of flow.
- **Warns** when the market-cap gap passes the 5% band, instead of pretending it cannot happen.
- Treats convergence as an **open design question**: arbitrage incentives, dynamic allocation, inventory rebalancing — see [Open questions](/docs/open-questions).

Equal valuation is the goal the mechanism reaches for, not a property it guarantees.
