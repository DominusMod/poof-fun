---
title: Introduction
group: Getting started
---

# Introduction

poof.fun is a launchpad concept for **multi-token memecoin narratives** on Solana. Instead of launching a single token, a creator launches a **narrative**: one story told through three independent meme tokens — called A, B, and C — that trade in their own pools but are bought together.

## The core idea

A trader picks **one** token. The purchase is **split across all three** pools. The trader receives only the token they selected; the other two legs go to **protocol inventory**. Every buy therefore lifts the whole narrative, not just the token in fashion that day.

Each token carries its own **fee identity**:

- **Token A — holder rewards.** A share of every buy flows to the people holding A.
- **Token B — creator rewards.** A share of every buy flows to the narrative's creator.
- **Token C — buyback and burn.** A share of every buy is used to buy back and burn C.

Different fee destinations, one coordinated market. That is the whole pitch.

## Worked example

The canonical example used across these docs is **THE ANIMAL REVOLUTION**, with:

- **DOGREV** — holder rewards
- **WOLFREV** — creator rewards
- **BEARREV** — buyback and burn

A trader buys **$900** and selects DOGREV. After the 0.25% protocol fee ($2.25), the remaining $897.75 is split into **$300 per token leg** (minus a 1% per-leg fee into each token's fee bucket). The trader receives only DOGREV; the WOLFREV and BEARREV bought by their purchase land in protocol inventory.

## Concept stage, simulation only

poof.fun is at **concept stage**. No contracts are deployed, no real funds move through this website, and several mechanisms — equal valuation, coordinated selling — are **open design questions**, not settled engineering. This site is a UI and simulation: the market math lives in `lib/engine.ts` as pure functions so it can be replaced by real contracts later.

Nothing here is financial advice. Burns do not guarantee price appreciation, and a shared pool does not automatically give equal valuations.
