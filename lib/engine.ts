/**
 * poof.fun market math — pure functions only, no chain calls.
 *
 * Each token in a narrative holds a constant-product pool against a USD
 * quote asset (x * y = k). A buy takes a protocol fee, splits the remainder
 * across all three pools by allocation, takes a per-leg fee into that
 * token's fee bucket, and swaps each leg into its pool. The trader receives
 * only the selected token; the other two legs land in protocol inventory.
 *
 * This module is UI + simulation only. It is written so the pure math can
 * later be replaced by real on-chain contracts without changing call sites.
 */

/** 1e9 base supply per token, matching a standard 9-decimal mint. */
export const TOKEN_SUPPLY = 1_000_000_000;

/** Protocol fee taken off the top of every buy (0.25%). */
export const PROTOCOL_FEE_BPS = 25;

/** Per-leg fee routed to that token's fee bucket (1%). */
export const LEG_FEE_BPS = 100;

/** Allowed market-cap gap before the UI warns (see marketCapGap). */
export const GAP_BAND = 0.05; // 5%

export type FeeDestination = "holder" | "creator" | "buyback";

export type TokenIndex = 0 | 1 | 2;

export interface EngineToken {
  name: string;
  ticker: string;
  feeDestination: FeeDestination;
  /** Quote-side reserve (USD). Derived from starting market cap. */
  reserveQuote: number;
  /** Base-side reserve (tokens). Starts at TOKEN_SUPPLY. */
  reserveBase: number;
  /** Running fee bucket balance in USD quote terms. */
  feeBucket: number;
  /** Tokens bought by the protocol on coordinated legs. */
  inventory: number;
}

export interface EngineState {
  tokens: [EngineToken, EngineToken, EngineToken];
  /** Allocation percentages, must total 100. Default [33.33, 33.33, 33.34]. */
  allocation: [number, number, number];
  /** Cumulative protocol fees collected (USD). */
  protocolFees: number;
}

export interface BuyLeg {
  token: TokenIndex;
  /** USD entering the pool after fees. */
  inAfterFees: number;
  /** USD taken as this leg's fee. */
  legFee: number;
  /** Tokens minted out of the pool. */
  tokensOut: number;
  /** New price after the swap. */
  newPrice: number;
  /** True when this leg goes to protocol inventory, not the trader. */
  toInventory: boolean;
}

export interface BuyPreview {
  protocolFee: number;
  splitTotal: number;
  legs: [BuyLeg, BuyLeg, BuyLeg];
  /** Tokens the trader receives (selected leg only). */
  traderReceives: number;
  /** Weighted average fill price for the trader's tokens. */
  avgFillPrice: number;
  /** Price impact on the selected token, as a fraction (0.01 = 1%). */
  priceImpact: number;
}

function priceOf(t: EngineToken): number {
  if (t.reserveBase <= 0) return 0;
  return t.reserveQuote / t.reserveBase;
}

/** Current market cap = price × full supply (reserves are the float). */
export function marketCap(t: EngineToken): number {
  return priceOf(t) * TOKEN_SUPPLY;
}

/** Build a fresh engine state from starting market caps. */
export function createState(
  defs: { name: string; ticker: string; feeDestination: FeeDestination; startMarketCap: number }[],
  allocation: [number, number, number] = [33.33, 33.33, 33.34],
): EngineState {
  if (defs.length !== 3) throw new Error("A narrative needs exactly three tokens.");
  assertAllocation(allocation);
  return {
    tokens: defs.map((d) => {
      const price = d.startMarketCap / TOKEN_SUPPLY;
      return {
        name: d.name,
        ticker: d.ticker,
        feeDestination: d.feeDestination,
        reserveQuote: price * TOKEN_SUPPLY,
        reserveBase: TOKEN_SUPPLY,
        feeBucket: 0,
        inventory: 0,
      };
    }) as [EngineToken, EngineToken, EngineToken],
    allocation,
    protocolFees: 0,
  };
}

export function assertAllocation(allocation: [number, number, number]): void {
  const total = allocation[0] + allocation[1] + allocation[2];
  if (Math.abs(total - 100) > 1e-9) {
    throw new Error(`Buy allocation must total 100 percent, got ${total}.`);
  }
  for (const a of allocation) {
    if (a < 0 || a > 100) throw new Error(`Allocation leg out of range: ${a}.`);
  }
}

/** Constant-product swap: quote in → base out, fee already removed. */
function swapOut(reserveQuote: number, reserveBase: number, amountIn: number): number {
  if (amountIn <= 0) return 0;
  const k = reserveQuote * reserveBase;
  const newQuote = reserveQuote + amountIn;
  return reserveBase - k / newQuote;
}

/**
 * Preview a coordinated buy WITHOUT mutating state.
 * Returns the per-leg breakdown, what the trader receives, and price impact.
 */
export function previewBuy(state: EngineState, selected: TokenIndex, amountUsd: number): BuyPreview {
  if (amountUsd <= 0) throw new Error("Buy amount must be positive.");
  const protocolFee = (amountUsd * PROTOCOL_FEE_BPS) / 10_000;
  const splitTotal = amountUsd - protocolFee;

  const legs = state.tokens.map((t, i) => {
    const legGross = (splitTotal * state.allocation[i]) / 100;
    const legFee = (legGross * LEG_FEE_BPS) / 10_000;
    const inAfterFees = legGross - legFee;
    const tokensOut = swapOut(t.reserveQuote, t.reserveBase, inAfterFees);
    const priceBefore = priceOf(t);
    const newPrice = (t.reserveQuote + inAfterFees) / (t.reserveBase - tokensOut);
    return {
      token: i as TokenIndex,
      inAfterFees,
      legFee,
      tokensOut,
      newPrice,
      toInventory: i !== selected,
      priceBefore,
    };
  });

  const selectedLeg = legs[selected];
  const traderReceives = selectedLeg.tokensOut;
  const traderUsd = (splitTotal * state.allocation[selected]) / 100;
  const avgFillPrice = traderReceives > 0 ? traderUsd / traderReceives : 0;
  const priceBefore = priceOf(state.tokens[selected]);
  const priceImpact = priceBefore > 0 ? selectedLeg.newPrice / priceBefore - 1 : 0;

  return {
    protocolFee,
    splitTotal,
    legs: legs.map(({ priceBefore: _dropped, ...l }) => l) as [BuyLeg, BuyLeg, BuyLeg],
    traderReceives,
    avgFillPrice,
    priceImpact,
  };
}

/** Execute a coordinated buy, mutating a cloned state. Returns the new state + preview. */
export function executeBuy(
  state: EngineState,
  selected: TokenIndex,
  amountUsd: number,
): { state: EngineState; preview: BuyPreview } {
  const preview = previewBuy(state, selected, amountUsd);
  const next: EngineState = {
    tokens: state.tokens.map((t) => ({ ...t })) as [EngineToken, EngineToken, EngineToken],
    allocation: [...state.allocation] as [number, number, number],
    protocolFees: state.protocolFees + preview.protocolFee,
  };
  preview.legs.forEach((leg, i) => {
    const t = next.tokens[i];
    t.reserveQuote += leg.inAfterFees;
    t.reserveBase -= leg.tokensOut;
    t.feeBucket += leg.legFee;
    if (leg.toInventory) t.inventory += leg.tokensOut;
  });
  return { state: next, preview };
}

export interface SellResult {
  /** USD returned to the seller. */
  usdOut: number;
  /** New price after the sale. */
  newPrice: number;
}

/**
 * Preview + execute an independent sell: only the selected token's pool moves.
 * `amountTokens` are sold out of the pool; quote comes back to the seller.
 */
export function executeIndependentSell(
  state: EngineState,
  selected: TokenIndex,
  amountTokens: number,
): { state: EngineState; result: SellResult } {
  if (amountTokens <= 0) throw new Error("Sell amount must be positive.");
  const t = state.tokens[selected];
  if (amountTokens >= t.reserveBase) throw new Error("Sell exceeds pool reserves.");
  const k = t.reserveQuote * t.reserveBase;
  const newBase = t.reserveBase + amountTokens;
  const newQuote = k / newBase;
  const usdOut = t.reserveQuote - newQuote;

  const next: EngineState = {
    tokens: state.tokens.map((x) => ({ ...x })) as [EngineToken, EngineToken, EngineToken],
    allocation: [...state.allocation] as [number, number, number],
    protocolFees: state.protocolFees,
  };
  next.tokens[selected].reserveQuote = newQuote;
  next.tokens[selected].reserveBase = newBase;
  return { state: next, result: { usdOut, newPrice: newQuote / newBase } };
}

export interface CoordinatedSellLeg {
  token: TokenIndex;
  tokensSold: number;
  usdOut: number;
  newPrice: number;
}

/**
 * Coordinated sell: the trader sells `amountTokens` of the selected token,
 * and the protocol sells the same USD value of the other two tokens from
 * inventory, so all three pools move together.
 */
export function executeCoordinatedSell(
  state: EngineState,
  selected: TokenIndex,
  amountTokens: number,
): { state: EngineState; legs: [CoordinatedSellLeg, CoordinatedSellLeg, CoordinatedSellLeg]; usdOut: number } {
  if (amountTokens <= 0) throw new Error("Sell amount must be positive.");
  const t = state.tokens[selected];
  if (amountTokens >= t.reserveBase) throw new Error("Sell exceeds pool reserves.");

  // Trader leg first, to learn the USD value.
  const k0 = t.reserveQuote * t.reserveBase;
  const newBase0 = t.reserveBase + amountTokens;
  const newQuote0 = k0 / newBase0;
  const targetUsd = t.reserveQuote - newQuote0;

  const next: EngineState = {
    tokens: state.tokens.map((x) => ({ ...x })) as [EngineToken, EngineToken, EngineToken],
    allocation: [...state.allocation] as [number, number, number],
    protocolFees: state.protocolFees,
  };

  const legs = state.tokens.map((tok, i) => {
    if (i === selected) {
      next.tokens[i].reserveQuote = newQuote0;
      next.tokens[i].reserveBase = newBase0;
      return { token: i as TokenIndex, tokensSold: amountTokens, usdOut: targetUsd, newPrice: newQuote0 / newBase0 };
    }
    // Solve tokens-in for target USD out: quoteOut = Rq - k/(Rb + dx) = target.
    const k = tok.reserveQuote * tok.reserveBase;
    const denom = tok.reserveQuote - targetUsd;
    if (denom <= 0 || targetUsd >= tok.reserveQuote) {
      return { token: i as TokenIndex, tokensSold: 0, usdOut: 0, newPrice: priceOf(tok) };
    }
    const dx = k / denom - tok.reserveBase;
    const sell = Math.min(dx, tok.inventory);
    const q = tok.reserveQuote;
    const b = tok.reserveBase;
    const out = q - (q * b) / (b + sell);
    next.tokens[i].reserveQuote = q - out;
    next.tokens[i].reserveBase = b + sell;
    next.tokens[i].inventory -= sell;
    return { token: i as TokenIndex, tokensSold: sell, usdOut: out, newPrice: (q - out) / (b + sell) };
  }) as [CoordinatedSellLeg, CoordinatedSellLeg, CoordinatedSellLeg];

  return { state: next, legs, usdOut: targetUsd };
}

export interface GapReport {
  min: number;
  max: number;
  /** (max - min) / max as a fraction. */
  gap: number;
  /** True when the gap exceeds the allowed band. */
  breached: boolean;
}

/** Gap between the highest and lowest market cap in the narrative. */
export function marketCapGap(state: EngineState, band = GAP_BAND): GapReport {
  const caps = state.tokens.map(marketCap);
  const min = Math.min(...caps);
  const max = Math.max(...caps);
  const gap = max > 0 ? (max - min) / max : 0;
  return { min, max, gap, breached: gap > band };
}

/* ---------- formatting helpers (UI) ---------- */

export function fmtUsd(n: number, digits = 2): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 10_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function fmtPct(frac: number, digits = 2): string {
  if (!isFinite(frac)) return "—";
  const sign = frac > 0 ? "+" : "";
  return `${sign}${(frac * 100).toFixed(digits)}%`;
}

export function fmtTokens(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(3)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function fmtPrice(n: number): string {
  if (!isFinite(n) || n <= 0) return "—";
  if (n < 0.0001) return `$${n.toExponential(2)}`;
  if (n < 1) return `$${n.toFixed(6)}`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}
