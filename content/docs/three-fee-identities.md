---
title: "Three fee identities: holder rewards, creator rewards, buyback and burn"
group: Mechanism
---

# Three fee identities: holder rewards, creator rewards, buyback and burn

Each token in a narrative owns one fee destination. The 1% fee on every buy leg flows into that token's bucket — never across tokens.

## Holder rewards (Token A · orange)

The fee bucket of the holder-rewards token accumulates from every coordinated buy, regardless of which token the trader selected. Holders of token A can claim a share of the bucket under **Portfolio → Rewards**.

The design intent: the token with the most natural holder base gets a standing reason to hold through attention cycles, because every buy anywhere in the narrative pays it.

## Creator rewards (Token B · blue)

The creator-rewards token streams its bucket to the narrative's creator address. This replaces the single-token launchpad pattern where the creator takes a cut of everything and holders get nothing: here the creator's stream is **one of three**, visible alongside the other two, and it only grows when the whole narrative trades.

## Buyback and burn (Token C · green)

The burn token's bucket is used to buy back token C and burn it — reducing supply, not distributing cash. Buyback-and-burn history is shown under **Portfolio → Rewards** for transparency: amounts, token counts, timestamps.

An honest caveat, stated plainly: **burns do not guarantee price appreciation.** Burning reduces supply against the pool's quote reserves, but price is set by trading, and steady sell pressure can overwhelm any burn schedule. Treat the burn as supply hygiene, not a price promise.

## Why three instead of one

Splitting the fee stream three ways ends the zero-sum fight over a single fee switch. Each constituency — holders, creator, and the supply itself — has its own legible bucket, funded by every trade in the narrative.
