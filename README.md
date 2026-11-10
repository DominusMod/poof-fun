# poof.fun — one narrative, three tokens

poof.fun is a Solana multi-token memecoin launchpad concept. One narrative launches three
independent meme tokens (A, B, C) with coordinated buying: a trader picks one token, the
purchase is split across all three, the trader receives only the selected token, and the other
two go to protocol inventory. Each token has its own fee destination (holder rewards, creator
rewards, or buyback and burn).

**Concept stage, simulation only.** No contracts are deployed and no real funds move through
this interface. Equal valuation and coordinated selling are open design questions.

## Run it

```bash
npm install
npm run dev -- --port 3000 --hostname 0.0.0.0
```

Then open the forwarded port 3000. Requires Node 20+.

## Structure

- `app/` — Next.js routes: Discover, Launch, narrative pages, Portfolio, Docs
- `components/` — shared header, footer, wallet button, UI primitives
- `lib/engine.ts` — all market math as pure functions (replaceable by real contracts later)
- `lib/mock.ts` — mock narratives, holdings, rewards
- `content/docs/` — docs pages as markdown, rendered by the shared docs layout
