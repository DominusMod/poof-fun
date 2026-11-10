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
    slug: "animal-revolution",
    name: "The Animal Revolution",
    description:
      "Three apex predators, one shared hunt. Every buy feeds all three pools — pick your fighter.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    volume24h: 184_203,
    change24h: 0.184,
    allocation: [33.33, 33.33, 33.34],
    tokens: [
      { name: "Dog Revolution", ticker: "DOGREV", feeDestination: "holder", startMarketCap: 120_000 },
      { name: "Wolf Revolution", ticker: "WOLFREV", feeDestination: "creator", startMarketCap: 96_000 },
      { name: "Bear Revolution", ticker: "BEARREV", feeDestination: "buyback", startMarketCap: 84_000 },
    ],
  },
  {
    slug: "neon-district",
    name: "Neon District",
    description: "A synthwave city that never sleeps. Three districts, one power grid.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    volume24h: 92_410,
    change24h: 0.092,
    allocation: [40, 35, 25],
    tokens: [
      { name: "Neon Arcade", ticker: "ARCADE", feeDestination: "holder", startMarketCap: 64_000 },
      { name: "Chrome Diner", ticker: "DINER", feeDestination: "creator", startMarketCap: 58_000 },
      { name: "Laser Rain", ticker: "RAIN", feeDestination: "buyback", startMarketCap: 51_000 },
    ],
  },
  {
    slug: "deep-harvest",
    name: "Deep Harvest",
    description: "Autumn yields on-chain. Farm, mill, and market move as one.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    volume24h: 61_870,
    change24h: -0.041,
    allocation: [33.33, 33.33, 33.34],
    tokens: [
      { name: "Amber Field", ticker: "AMBER", feeDestination: "holder", startMarketCap: 45_000 },
      { name: "Iron Mill", ticker: "MILL", feeDestination: "creator", startMarketCap: 44_100 },
      { name: "Harvest Moon", ticker: "MOON", feeDestination: "buyback", startMarketCap: 39_500 },
    ],
  },
  {
    slug: "orbital-dock",
    name: "Orbital Dock",
    description: "Three shipyards above the Kármán line, refuelling each other's tanks.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    volume24h: 44_120,
    change24h: 0.227,
    allocation: [50, 30, 20],
    tokens: [
      { name: "Dock Alpha", ticker: "DOCKA", feeDestination: "holder", startMarketCap: 38_000 },
      { name: "Dock Beta", ticker: "DOCKB", feeDestination: "creator", startMarketCap: 33_000 },
      { name: "Dock Gamma", ticker: "DOCKC", feeDestination: "buyback", startMarketCap: 29_000 },
    ],
  },
  {
    slug: "paper-empire",
    name: "Paper Empire",
    description: "Origami finance. Fold carefully — every crease compounds.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    volume24h: 28_300,
    change24h: 0.061,
    allocation: [33.33, 33.33, 33.34],
    tokens: [
      { name: "Crane Note", ticker: "CRANE", feeDestination: "holder", startMarketCap: 27_000 },
      { name: "Frog Fold", ticker: "FROG", feeDestination: "creator", startMarketCap: 24_000 },
      { name: "Box Vault", ticker: "BOXV", feeDestination: "buyback", startMarketCap: 22_500 },
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
  { narrativeSlug: "animal-revolution", narrativeName: "The Animal Revolution", ticker: "DOGREV", tokenIndex: 0, balance: 1_240_500, avgCostUsd: 312.4 },
  { narrativeSlug: "animal-revolution", narrativeName: "The Animal Revolution", ticker: "WOLFREV", tokenIndex: 1, balance: 388_200, avgCostUsd: 98.1 },
  { narrativeSlug: "neon-district", narrativeName: "Neon District", ticker: "ARCADE", tokenIndex: 0, balance: 512_000, avgCostUsd: 74.6 },
  { narrativeSlug: "deep-harvest", narrativeName: "Deep Harvest", ticker: "MOON", tokenIndex: 2, balance: 905_750, avgCostUsd: 61.2 },
];

export const MOCK_REWARDS: RewardEvent[] = [
  { id: "r1", narrativeSlug: "animal-revolution", narrativeName: "The Animal Revolution", kind: "holder", ticker: "DOGREV", amountUsd: 18.42, detail: "1% leg fees from 24 coordinated buys", at: new Date(Date.now() - 1000 * 60 * 42).toISOString(), claimed: false },
  { id: "r2", narrativeSlug: "neon-district", narrativeName: "Neon District", kind: "holder", ticker: "ARCADE", amountUsd: 6.08, detail: "1% leg fees from 11 coordinated buys", at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), claimed: false },
  { id: "r3", narrativeSlug: "animal-revolution", narrativeName: "The Animal Revolution", kind: "creator", ticker: "WOLFREV", amountUsd: 44.9, detail: "Creator share accrued to 0x7f…3aQ2", at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(), claimed: true },
  { id: "r4", narrativeSlug: "animal-revolution", narrativeName: "The Animal Revolution", kind: "buyback", ticker: "BEARREV", amountUsd: 31.75, detail: "12,400 BEARREV bought back and burned", at: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(), claimed: true },
  { id: "r5", narrativeSlug: "deep-harvest", narrativeName: "Deep Harvest", kind: "buyback", ticker: "MOON", amountUsd: 9.2, detail: "28,900 MOON bought back and burned", at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), claimed: true },
];
