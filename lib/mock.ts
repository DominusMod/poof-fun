import { createState, type EngineState, type FeeDestination } from "./engine";

export interface NarrativeTokenDef {
  name: string;
  ticker: string;
  feeDestination: FeeDestination;
  startMarketCap: number;
}

export interface Narrative {
  slug: string;
  name: string;
  description: string;
  createdAt: string; // ISO date
  volume24h: number;
  change24h: number; // fraction, e.g. 0.12 = +12%
  holders: number; // simulated holder count
  tokens: NarrativeTokenDef[];
  allocation: [number, number, number];
}

export const FEE_DESTINATION_LABEL: Record<FeeDestination, string> = {
  holder: "Holder rewards",
  creator: "Creator rewards",
  buyback: "Buyback & burn",
};

export const TOKEN_COLORS = ["var(--tok-a)", "var(--tok-b)", "var(--tok-c)"] as const;
export const TOKEN_COLOR_HEX = ["#f5820b", "#4f8ff7", "#3fce6f"] as const;

export const NARRATIVES: Narrative[] = [
  {
    slug: "nvidia-ceo-cheating",
    name: "NVIDIA CEO CHEATING",
    description:
      "A viral rumor-mill storyline. Three tokens track the same gossip cycle — every buy feeds all three pools.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    volume24h: 214_500,
    holders: 21_340,
    change24h: 0.312,
    allocation: [33.33, 33.33, 33.34],
    tokens: [
      { name: "Pussycoin", ticker: "PUSSYCOIN", feeDestination: "holder", startMarketCap: 140_000 },
      { name: "Jensen Huang", ticker: "JENSENHUANG", feeDestination: "creator", startMarketCap: 112_000 },
      { name: "Cheating", ticker: "CHEATING", feeDestination: "buyback", startMarketCap: 98_000 },
    ],
  },
  {
    slug: "elon-musk-favorite-meme",
    name: "ELON MUSK FAVORITE MEME",
    description:
      "One viral reply, three tokens. The timeline's favorite joke moves as a single pack — pick your fighter.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    volume24h: 168_900,
    holders: 15_720,
    change24h: 0.187,
    allocation: [33.33, 33.33, 33.34],
    tokens: [
      { name: "Be Like Jose", ticker: "BELIKEJOSE", feeDestination: "holder", startMarketCap: 110_000 },
      { name: "Elonjose", ticker: "ELONJOSE", feeDestination: "creator", startMarketCap: 88_000 },
      { name: "Jose", ticker: "JOSE", feeDestination: "buyback", startMarketCap: 76_000 },
    ],
  },
];

/** Total market cap of a narrative at its starting prices. */
export function narrativeStartCap(n: Narrative): number {
  return n.tokens.reduce((s, t) => s + t.startMarketCap, 0);
}

export function getNarrative(slug: string): Narrative | undefined {
  return NARRATIVES.find((n) => n.slug === slug);
}

/** Fresh engine state for a narrative (used by the narrative page + engine demo). */
export function engineFor(n: Narrative): EngineState {
  return createState(n.tokens, n.allocation);
}

/* ---------- portfolio (mock holdings) ---------- */

export interface Holding {
  narrativeSlug: string;
  narrativeName: string;
  ticker: string;
  tokenIndex: 0 | 1 | 2;
  balance: number;
  avgCostUsd: number;
}

export interface RewardEvent {
  id: string;
  narrativeSlug: string;
  narrativeName: string;
  kind: "holder" | "creator" | "buyback";
  ticker: string;
  amountUsd: number;
  detail: string;
  at: string;
  claimed: boolean;
}

export const MOCK_HOLDINGS: Holding[] = [
  { narrativeSlug: "nvidia-ceo-cheating", narrativeName: "NVIDIA CEO CHEATING", ticker: "PUSSYCOIN", tokenIndex: 0, balance: 1_240_500, avgCostUsd: 312.4 },
  { narrativeSlug: "nvidia-ceo-cheating", narrativeName: "NVIDIA CEO CHEATING", ticker: "JENSENHUANG", tokenIndex: 1, balance: 388_200, avgCostUsd: 98.1 },
  { narrativeSlug: "elon-musk-favorite-meme", narrativeName: "ELON MUSK FAVORITE MEME", ticker: "BELIKEJOSE", tokenIndex: 0, balance: 512_000, avgCostUsd: 74.6 },
  { narrativeSlug: "elon-musk-favorite-meme", narrativeName: "ELON MUSK FAVORITE MEME", ticker: "JOSE", tokenIndex: 2, balance: 905_750, avgCostUsd: 61.2 },
];

export const MOCK_REWARDS: RewardEvent[] = [
  { id: "r1", narrativeSlug: "nvidia-ceo-cheating", narrativeName: "NVIDIA CEO CHEATING", kind: "holder", ticker: "PUSSYCOIN", amountUsd: 18.42, detail: "1% leg fees from 24 coordinated buys", at: new Date(Date.now() - 1000 * 60 * 42).toISOString(), claimed: false },
  { id: "r2", narrativeSlug: "elon-musk-favorite-meme", narrativeName: "ELON MUSK FAVORITE MEME", kind: "holder", ticker: "BELIKEJOSE", amountUsd: 6.08, detail: "1% leg fees from 11 coordinated buys", at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), claimed: false },
  { id: "r3", narrativeSlug: "nvidia-ceo-cheating", narrativeName: "NVIDIA CEO CHEATING", kind: "creator", ticker: "JENSENHUANG", amountUsd: 44.9, detail: "Creator share accrued to 0x7f…3aQ2", at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(), claimed: true },
  { id: "r4", narrativeSlug: "nvidia-ceo-cheating", narrativeName: "NVIDIA CEO CHEATING", kind: "buyback", ticker: "CHEATING", amountUsd: 31.75, detail: "12,400 CHEATING bought back and burned", at: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(), claimed: true },
  { id: "r5", narrativeSlug: "elon-musk-favorite-meme", narrativeName: "ELON MUSK FAVORITE MEME", kind: "buyback", ticker: "JOSE", amountUsd: 9.2, detail: "28,900 JOSE bought back and burned", at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), claimed: true },
];
