---
title: What is poof.fun
group: Getting started
---

# What is poof.fun

poof.fun is a launchpad where **one narrative launches three independent meme tokens** — A, B, and C — with coordinated buying.

## The moving parts

- **Narrative.** The unit of launch. A name, a description, and three tokens. Narratives are listed under Discover, tradeable on a narrative page, and tracked in Portfolio.
- **Tokens A, B, C.** Independent tokens with their own pools, prices, and market caps. Each owns one identity colour across the site: **orange for A, blue for B, green for C**.
- **Coordinated buying.** A trader picks one token. The purchase is split across all three pools by the narrative's allocation (default 33.33 / 33.33 / 33.34). The trader receives only the selected token; the other two legs go to protocol inventory.
- **Fee identities.** Each token routes its 1% per-leg fee to its own destination: holder rewards, creator rewards, or buyback and burn.
- **Protocol inventory.** The non-selected legs of every buy. Inventory is what makes coordinated selling possible — and it is also the mechanism's biggest open question (see [Open questions](/docs/open-questions)).

## What poof.fun is not

- **Not a DEX.** Each token trades in a standard constant-product pool. poof.fun adds the coordinated buy/sell routing on top.
- **Not audited, not deployed.** Concept stage. The engine on this site is a TypeScript simulation (`lib/engine.ts`), not a program.
- **Not a promise of equal prices.** A shared pool does not automatically give equal valuations — see [Equal valuation](/docs/equal-valuation) for an honest treatment.

## Where to go next

- Traders: start with [How a buy works](/docs/how-a-buy-works).
- Creators: start with [Creator launch guide](/docs/creator-launch-guide).
- Skeptics (welcome): start with [Risks and security](/docs/risks-and-security).
