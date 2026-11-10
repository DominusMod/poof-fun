"use client";

import { useMemo, useState } from "react";
import {
  executeBuy,
  executeCoordinatedSell,
  executeIndependentSell,
  fmtPct,
  fmtPrice,
  fmtTokens,
  fmtUsd,
  marketCapGap,
  previewBuy,
  type BuyPreview,
  type EngineState,
  type TokenIndex,
} from "@/lib/engine";
import { FEE_DESTINATION_LABEL } from "@/lib/mock";
import { Card, CardHead, Chip, Field, GhostButton, inputStyle, Notice, PrimaryButton, Stat } from "@/components/ui";

const COLORS = ["var(--tok-a)", "var(--tok-b)", "var(--tok-c)"] as const;

export default function TradePanel({
  initial,
  feeLabels,
}: {
  initial: EngineState;
  feeLabels: [string, string, string];
}) {
  const [state, setState] = useState<EngineState>(initial);
  const [selected, setSelected] = useState<TokenIndex>(0);
  const [amount, setAmount] = useState("900");
  const [lastBuy, setLastBuy] = useState<BuyPreview | null>(null);
  const [sellMode, setSellMode] = useState<"independent" | "coordinated">("independent");
  const [sellAmount, setSellAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const amountNum = parseFloat(amount);
  const preview: BuyPreview | null = useMemo(() => {
    if (!isFinite(amountNum) || amountNum <= 0) return null;
    try {
      return previewBuy(state, selected, amountNum);
    } catch {
      return null;
    }
  }, [state, selected, amountNum]);

  const gap = marketCapGap(state);

  function doBuy() {
    setError(null);
    setMessage(null);
    if (!isFinite(amountNum) || amountNum <= 0) {
      setError("Enter a buy amount above zero.");
      return;
    }
    try {
      const { state: next, preview: p } = executeBuy(state, selected, amountNum);
      setState(next);
      setLastBuy(p);
      setMessage(
        `Bought ${fmtTokens(p.traderReceives)} ${next.tokens[selected].ticker} for ${fmtUsd(amountNum)}.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Buy failed.");
    }
  }

  function doSell() {
    setError(null);
    setMessage(null);
    const n = parseFloat(sellAmount);
    if (!isFinite(n) || n <= 0) {
      setError("Enter a sell amount above zero.");
      return;
    }
    try {
      if (sellMode === "independent") {
        const { state: next, result } = executeIndependentSell(state, selected, n);
        setState(next);
        setLastBuy(null);
        setMessage(
          `Sold ${fmtTokens(n)} ${next.tokens[selected].ticker} for ${fmtUsd(result.usdOut)} (independent — other pools untouched).`,
        );
      } else {
        const { state: next, usdOut } = executeCoordinatedSell(state, selected, n);
        setState(next);
        setLastBuy(null);
        setMessage(
          `Sold ${fmtTokens(n)} ${next.tokens[selected].ticker} for ${fmtUsd(usdOut)} (coordinated — protocol sold matching inventory from the other two pools).`,
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sell failed.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* three tokens side by side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {state.tokens.map((t, i) => (
          <Card key={t.ticker}>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: COLORS[i] }} aria-hidden />
                <span className="font-display text-base font-semibold">{t.ticker}</span>
                <span className="ml-auto">
                  <Chip color={COLORS[i]}>{FEE_DESTINATION_LABEL[t.feeDestination]}</Chip>
                </span>
              </div>
              <div className="mt-1 text-[13px]" style={{ color: "var(--text-2)" }}>{t.name}</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat label="Price" value={fmtPrice(t.reserveQuote / t.reserveBase)} />
                <Stat
                  label="Market cap"
                  value={fmtUsd((t.reserveQuote / t.reserveBase) * 1_000_000_000)}
                />
                <Stat label="Fee bucket" value={fmtUsd(t.feeBucket)} sub={feeLabels[i]} />
                <Stat label="Protocol inventory" value={fmtTokens(t.inventory)} sub={t.ticker} />
              </div>
              <button
                onClick={() => { setSelected(i as TokenIndex); setLastBuy(null); }}
                aria-pressed={selected === i}
                className="mt-4 h-10 w-full rounded-md border text-sm font-semibold"
                style={
                  selected === i
                    ? { borderColor: COLORS[i], background: "var(--surface-2)", color: "var(--text)" }
                    : { borderColor: "var(--line-2)", background: "transparent", color: "var(--text-2)" }
                }
              >
                {selected === i ? `Selected — you receive ${t.ticker}` : `Select ${t.ticker}`}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {gap.breached && (
        <Notice tone="warn">
          <strong>Market cap gap warning.</strong> The spread between the highest and lowest market
          cap is <span className="tnum font-semibold">{fmtPct(gap.gap)}</span> (allowed band:{" "}
          <span className="tnum">5%</span>). Caps: low {fmtUsd(gap.min)} / high {fmtUsd(gap.max)}.
        </Notice>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* buy */}
        <Card>
          <CardHead title="Buy" aside={<Chip>Coordinated — split across all three</Chip>} />
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <Field label={`Amount (USD) — buying ${state.tokens[selected].ticker}`}>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="tnum w-full rounded-md border px-3 py-2.5 text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div className="mt-2 flex gap-1.5">
                {[100, 300, 900].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(String(p))}
                    className="rounded border px-2.5 py-1 text-xs font-semibold"
                    style={{ borderColor: "var(--line-2)", color: "var(--text-2)" }}
                  >
                    ${p}
                  </button>
                ))}
              </div>
            </Field>

            {preview ? (
              <div className="rounded-md border p-3.5 text-[13px]" style={{ borderColor: "var(--line-2)" }}>
                <div className="mb-2 font-semibold">Before you sign</div>
                <dl className="flex flex-col gap-1.5" style={{ color: "var(--text-2)" }}>
                  <div className="flex justify-between gap-2">
                    <dt>You pay</dt>
                    <dd className="tnum font-semibold" style={{ color: "var(--text)" }}>{fmtUsd(amountNum)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Protocol fee (0.25%)</dt>
                    <dd className="tnum">{fmtUsd(preview.protocolFee)}</dd>
                  </div>
                  {preview.legs.map((leg, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <dt>
                        <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: COLORS[i] }} aria-hidden />
                        → {state.tokens[i].ticker} pool{leg.toInventory ? " (inventory)" : " (you)"}
                      </dt>
                      <dd className="tnum">
                        {fmtUsd(leg.inAfterFees)} → {fmtTokens(leg.tokensOut)}
                      </dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-2 border-t pt-1.5" style={{ borderColor: "var(--line)" }}>
                    <dt>You receive</dt>
                    <dd className="tnum font-semibold" style={{ color: COLORS[selected] }}>
                      {fmtTokens(preview.traderReceives)} {state.tokens[selected].ticker}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Avg fill price</dt>
                    <dd className="tnum">{fmtPrice(preview.avgFillPrice)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Price impact ({state.tokens[selected].ticker})</dt>
                    <dd className="tnum" style={{ color: preview.priceImpact > 0.05 ? "var(--down)" : "var(--text)" }}>
                      {fmtPct(preview.priceImpact)}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                Enter an amount to see the split preview.
              </p>
            )}

            <PrimaryButton onClick={doBuy} disabled={!preview}>
              Buy {state.tokens[selected].ticker}
            </PrimaryButton>
          </div>
        </Card>

        {/* sell */}
        <Card>
          <CardHead title="Sell" />
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex gap-1 rounded-lg border p-1" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }} role="tablist" aria-label="Sell mode">
              {(
                [
                  { key: "independent", label: "Independent" },
                  { key: "coordinated", label: "Coordinated" },
                ] as const
              ).map((m) => (
                <button
                  key={m.key}
                  role="tab"
                  aria-selected={sellMode === m.key}
                  onClick={() => setSellMode(m.key)}
                  className="flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-semibold"
                  style={
                    sellMode === m.key
                      ? { color: "var(--text)", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line-2)" }
                      : { color: "var(--text-2)" }
                  }
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
              {sellMode === "independent"
                ? `Sell ${state.tokens[selected].ticker} from its own pool only. The other two pools do not move.`
                : `Sell ${state.tokens[selected].ticker} and the protocol sells the same dollar value of the other two tokens from inventory, so all three pools move together.`}
            </p>
            <Field label={`Amount (${state.tokens[selected].ticker} tokens)`}>
              <input
                type="number"
                min="0"
                step="any"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="e.g. 100000"
                className="tnum w-full rounded-md border px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            </Field>
            <GhostButton onClick={doSell}>Sell {state.tokens[selected].ticker}</GhostButton>
            {lastBuy && (
              <p className="text-xs" style={{ color: "var(--text-3)" }}>
                Last buy: received {fmtTokens(lastBuy.traderReceives)} {state.tokens[selected].ticker} at avg {fmtPrice(lastBuy.avgFillPrice)}.
              </p>
            )}
          </div>
        </Card>
      </div>

      {message && <Notice>{message}</Notice>}
      {error && <Notice tone="warn">{error}</Notice>}
    </div>
  );
}
