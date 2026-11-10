---
title: Open questions
group: Project
---

# Open questions

The questions poof.fun has not answered yet. Anyone building on this concept should start here.

## Equal valuation

How — if at all — should the protocol keep the three market caps near each other? Candidates: arbitrage incentives for gap-closing trades, dynamic allocation that leans against the laggard, inventory rebalancing between pools. Each has gaming vectors; none is chosen. See [Equal valuation](/docs/equal-valuation).

## Coordinated selling

The inventory constraint (`min(required, inventory)`) means coordinated sells degrade into partial sells when inventory runs dry. Should sells fail closed (revert) or open (partial)? Should inventory be borrowable, backstoppable, or simply allowed to deplete? See [Selling](/docs/selling).

## Inventory ownership and risk

Protocol inventory is a growing long position in every narrative's non-selected tokens. Who owns it economically? What happens to it if a narrative dies — is it burned, auctioned, or left stranded? An inventory of worthless tokens is harmless; an inventory of valuable ones is a honeypot with an unclear owner.

## Fee-bucket mechanics

How exactly do holder rewards accrue — per-block snapshots, balance-weighted claims, staking? How does the creator prove ownership of the creator stream? Who triggers buybacks, and how is the burn verified on-chain?

## Allocation governance

Can creators change allocation after launch? Can traders vote on it? Fixed allocations are legible but rigid; flexible ones are expressive but manipulable.

## Cross-narrative behaviour

Do narratives interact — shared protocol fees funding ecosystem rewards, leaderboard incentives, migration paths for dying narratives? Or is each narrative a sealed experiment?

These are design problems, not implementation details. The simulation deliberately implements the simplest defensible behaviour in each case and says so.
