---
title: "How a buy works"
group: Using poof.fun
---

# How a buy works

Every poof.fun buy follows the same five steps, whether it is $10 or $900. The [engine demo](/docs/engine-demo) runs them live.

## The five steps

1. **The trader selects a token** — say DOGREV in THE ANIMAL REVOLUTION — and enters a USD amount.
2. **The protocol fee is taken.** 0.25% comes off the top. On a $900 buy, that is $2.25, leaving $897.75.
3. **The remainder is split** across all three pools by the narrative's allocation. With the default 33.33 / 33.33 / 33.34 split, each leg is about $300.
4. **Each leg pays a 1% fee** into its own token's fee bucket ($3 per leg on $300), and the rest swaps into that token's pool.
5. **Only the selected token is delivered.** The trader receives DOGREV. The WOLFREV and BEARREV bought by their purchase go to protocol inventory.

## Worked example: $900 into DOGREV

| Step | DOGREV (you) | WOLFREV (inventory) | BEARREV (inventory) |
|---|---|---|---|
| Gross leg | $300.00 | $300.00 | $300.00 |
| Leg fee (1%) | $3.00 → holder bucket | $3.00 → creator bucket | $3.00 → buyback bucket |
| Into pool | $297.00 | $297.00 | $297.00 |
| Tokens out | ~2.47M DOGREV | ~3.09M WOLFREV | ~3.53M BEARREV |

(Token amounts depend on pool state at trade time — these are illustrative starting-pool figures.)

## Before you sign

The narrative page shows a **preview** before every buy: the split across all three pools, what you receive, the average fill price, the fees, and the price impact on your selected token. Read it. Price impact on a coordinated buy is real — your full amount still moves your token's pool.

## What the trader does not get

The trader does **not** receive the other two tokens. There is no airdrop, no claim, no wrapped IOU. Those legs belong to protocol inventory from the moment the trade executes.
