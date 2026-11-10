---
title: Shared liquidity
group: Mechanism
---

# Shared liquidity

"Shared liquidity" in poof.fun means something specific — and something it does **not** mean.

## What it means

Every buy is split across all three pools in one transaction. Liquidity therefore arrives **together**: no token's pool can be starved of buy flow while its siblings absorb everything, because a single purchase feeds all three. In that sense the narrative's liquidity is shared — it is allocated by rule, not by the trader's whim.

Protocol inventory is the other half of the sharing. The non-selected legs of every buy accumulate as inventory, which is what funds coordinated selling. Buying together builds the stock that lets the narrative later sell together.

## What it does not mean

The pools are **not merged**. Each token keeps its own constant-product pool, its own price, and its own market cap. There is no shared curve, no joint reserve, and no automatic rebalancing between pools.

That distinction matters because it is the source of the gap problem: three separate pools receiving proportionally-equal flows will still drift apart under lopsided selection pressure (everyone picking DOGREV moves DOGREV's price more than the equal-sized legs move the others — same dollars, different pool states).

## The honest summary

- Shared **flow**: yes — every buy feeds all three pools by rule.
- Shared **pool**: no — prices remain independent per token.
- Shared **valuation**: not automatically — see [Equal valuation](/docs/equal-valuation).
