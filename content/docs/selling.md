---
title: "Selling: independent and coordinated"
group: Using poof.fun
---

# Selling: independent and coordinated

poof.fun offers two ways to sell. They move different amounts of the market, and the difference matters.

## Independent selling

An independent sell swaps your tokens out of **that token's pool only**. The other two pools do not move. This is the default mental model from single-token trading: your exit affects your token and nothing else.

Use it when you have a view on one token specifically, or when you want the smallest possible market footprint.

## Coordinated selling

A coordinated sell does two things at once:

1. Sells your tokens of the selected token out of its pool, and
2. has the protocol sell the **same dollar value** of the other two tokens from **inventory**.

All three pools move together, mirroring the coordinated buy in reverse.

## The inventory constraint

Coordinated selling can only sell what inventory holds. If the protocol's inventory of a token is smaller than the matching leg requires, that leg sells what it can and stops. In the engine, the coordinated leg is capped at `min(required, inventory)` — inventory never goes negative, and the shortfall simply means the pools move less together than intended.

This is one of the reasons coordinated selling is an **open design question**: inventory accumulates only from the non-selected legs of buys, so a narrative with lopsided buying can run dry on one side. See [Open questions](/docs/open-questions).

## Which should you use?

- **Independent:** you believe one token is overvalued relative to its siblings, or you want out quietly.
- **Coordinated:** you believe the whole narrative is overvalued, or you want your exit to keep the three tokens aligned.

The narrative page lets you switch modes before every sell. Both are simulated locally — nothing here touches a real pool.
