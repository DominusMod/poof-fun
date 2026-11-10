"use client";

import { useMemo, useState } from "react";
import {
  createState,
  executeBuy,
  fmtPct,
  fmtPrice,
  fmtTokens,
  fmtUsd,
  marketCap,
  marketCapGap,
  type TokenIndex,
} from "@/lib/engine";
import { Card, CardHead, Chip, Field, GhostButton, inputStyle, Notice, PrimaryButton } from "@/components/ui";

const COLORS = ["var(--tok-a)", "var(--tok-b)", "var(--tok-c)"] as const;

const DEMO_DEFS = [
  { name: "Dog Revolution", ticker: "DOGREV", feeDestination: "holder" as const, startMarketCap: 120_000 },
  { name: "Wolf Revolution", ticker: "WOLFREV", feeDestination: "creator" as const, startMarketCap: 96_000 },
  { name: "Bear Revolution", ticker: "BEARREV", feeDestination: "buyback" as const, startMarketCap: 84_000 },
];

interface Check {
  label: string;
  pass: boolean | null;
  detail: string;
}

export default function EngineDemo() {
  const [selected, setSelected] = useState<TokenIndex>(0);
  const [amount, setAmount] = useState("900");
  const [ran, setRan] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const result = useMemo(() => {
    const n = parseFloat(amount);
    if (!isFinite(n) || n <= 0) return null;
    const before = createState(DEMO_DEFS);
    try {
      const { state: after, preview } = executeBuy(before, selected, n);
      return { before, after, preview };
    } catch {
      return null;
    }
  }, [amount, selected]);

  const checks: Check[] = useMemo(() => {
    if (!result || !ran) {
      return [
        { label: "1 · The trader selects a token", pass: null, detail: "Run the demonstration to verify." },
        { label: "2 · The purchase is split across all three", pass: null, detail: "Run the demonstration to verify." },
        { label: "3 · Only the selected token is delivered", pass: null, detail: "Run the demonstration to verify." },
        { label: "4 · The other allocations land in protocol inventory", pass: null, detail: "Run the demonstration to verify." },
        { label: "5 · Prices stay inside the allowed gap", pass: null, detail: "Run the demonstration to verify." },
      ];
    }
    const { before, after, preview } = result;
    const n = parseFloat(amount);
    const expectedSplit = n - preview.protocolFee;
    const splitSum = preview.legs.reduce((s, l) => s + l.inAfterFees + l.legFee, 0);
    const gapAfter = marketCapGap(after);

    const selectedTicker = after.tokens[selected].ticker;
    return [
      {
        label: "1 · The trader selects a token",
        pass: preview.legs.filter((l) => !l.toInventory).length === 1 && !preview.legs[selected].toInventory,
        detail: `Selected ${selectedTicker}: only leg ${selected + 1} is marked for the trader.`,
      },
      {
        label: "2 · The purchase is split across all three",
        pass: Math.abs(splitSum - expectedSplit) < 1e-6 && preview.legs.every((l) => l.inAfterFees > 0),
        detail: `${fmtUsd(splitSum)} across 3 legs (from ${fmtUsd(n)} minus ${fmtUsd(preview.protocolFee)} protocol fee).`,
      },
      {
        label: "3 · Only the selected token is delivered",
        pass: preview.traderReceives > 0 && preview.traderReceives === preview.legs[selected].tokensOut,
        detail: `Trader receives ${fmtTokens(preview.traderReceives)} ${selectedTicker} — nothing else.`,
      },
      {
        label: "4 · The other allocations land in protocol inventory",
        pass: ([0, 1, 2] as TokenIndex[])
          .filter((i) => i !== selected)
          .every((i) => Math.abs(after.tokens[i].inventory - preview.legs[i].tokensOut) < 1e-9),
        detail: ([0, 1, 2] as TokenIndex[])
          .filter((i) => i !== selected)
          .map((i) => `+${fmtTokens(after.tokens[i].inventory - before.tokens[i].inventory)} ${after.tokens[i].ticker}`)
          .join(", "),
      },
      {
        label: "5 · Prices stay inside the allowed gap",
        pass: !gapAfter.breached,
        detail: gapAfter.breached
          ? `Gap ${fmtPct(gapAfter.gap)} exceeds the 5% band — warning shown, as designed.`
          : `Gap ${fmtPct(gapAfter.gap)} is inside the 5% band (low ${fmtUsd(gapAfter.min)} / high ${fmtUsd(gapAfter.max)}).`,
      },
    ];
  }, [result, ran, selected, amount]);

  function run() {
    if (!result) return;
    setRan(true);
    const { after, preview } = result;
    setLog((prev) => [
      ...prev,
      `$${amount} → ${after.tokens[selected].ticker}: got ${fmtTokens(preview.traderReceives)} @ avg ${fmtPrice(preview.avgFillPrice)} (impact ${fmtPct(preview.priceImpact)})`,
    ]);
  }

  function reset() {
    setRan(false);
    setLog([]);
  }

  return (
    <Card>
      <CardHead
        title="Live engine demo — THE ANIMAL REVOLUTION"
        aside={<Chip>lib/engine.ts</Chip>}
      />
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <Notice tone="warn">
          <strong>Concept stage, simulation only.</strong> The figures below are local TypeScript
          math, not chain state. No contracts are deployed and no real funds move.
        </Notice>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DEMO_DEFS.map((d, i) => (
            <button
              key={d.ticker}
              onClick={() => { setSelected(i as TokenIndex); setRan(false); }}
              aria-pressed={selected === i}
              className="rounded-md border p-3 text-left"
              style={
                selected === i
                  ? { borderColor: COLORS[i], background: "var(--bg-2)" }
                  : { borderColor: "var(--line-2)", background: "transparent" }
              }
            >
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} aria-hidden />
                {d.ticker}
              </div>
              <div className="mt-0.5 text-xs" style={{ color: "var(--text-3)" }}>{d.name}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <Field label="Buy amount (USD)">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setRan(false); }}
              className="tnum w-full rounded-md border px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
          </Field>
          <div className="flex gap-2">
            <PrimaryButton onClick={run} disabled={!result}>Run $900 proof</PrimaryButton>
            <GhostButton onClick={reset}>Reset</GhostButton>
          </div>
        </div>

        {result && ran && (
          <div className="overflow-x-auto rounded-md border" style={{ borderColor: "var(--line-2)" }}>
            <table className="data w-full border-collapse text-[13px]">
              <thead>
                <tr style={{ color: "var(--text-3)" }}>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Leg</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Into pool</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Tokens out</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Destination</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Mkt cap after</th>
                </tr>
              </thead>
              <tbody>
                {result.preview.legs.map((leg, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--line)" }}>
                    <td className="px-3 py-2 font-semibold">
                      <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: COLORS[i] }} aria-hidden />
                      {result.after.tokens[i].ticker}
                    </td>
                    <td className="tnum px-3 py-2 text-right">{fmtUsd(leg.inAfterFees)}</td>
                    <td className="tnum px-3 py-2 text-right">{fmtTokens(leg.tokensOut)}</td>
                    <td className="px-3 py-2">{leg.toInventory ? "Protocol inventory" : "Trader"}</td>
                    <td className="tnum px-3 py-2 text-right">{fmtUsd(marketCap(result.after.tokens[i]))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ol className="flex flex-col gap-2">
          {checks.map((c) => (
            <li
              key={c.label}
              className="flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-[13px]"
              style={{ borderColor: "var(--line-2)" }}
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: c.pass === null ? "var(--surface-2)" : c.pass ? "var(--up)" : "var(--down)",
                  color: c.pass === null ? "var(--text-3)" : "var(--bg)",
                }}
              >
                {c.pass === null ? "·" : c.pass ? "✓" : "!"}
              </span>
              <div>
                <div className="font-semibold" style={{ color: "var(--text)" }}>{c.label}</div>
                <div style={{ color: "var(--text-2)" }}>{c.detail}</div>
              </div>
            </li>
          ))}
        </ol>

        {log.length > 0 && (
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
              Run history
            </div>
            <ul className="tnum flex flex-col gap-1 text-[13px]" style={{ color: "var(--text-2)" }}>
              {log.map((l, i) => (
                <li key={i}>· {l}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
