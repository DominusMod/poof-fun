"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { assertAllocation, type FeeDestination } from "@/lib/engine";
import { addLaunch } from "@/lib/launches";
import { FEE_DESTINATION_LABEL } from "@/lib/mock";
import { Card, CardHead, Field, inputStyle, Notice, PrimaryButton } from "@/components/ui";

const FEE_OPTIONS: FeeDestination[] = ["holder", "creator", "buyback"];
const TOKEN_LETTERS = ["A", "B", "C"] as const;

interface TokenDraft {
  name: string;
  ticker: string;
  fee: FeeDestination;
  startCap: string;
  alloc: string;
}

const blankToken = (i: number): TokenDraft => ({
  name: "",
  ticker: "",
  fee: (["holder", "creator", "buyback"] as FeeDestination[])[i],
  startCap: "20000",
  alloc: i === 2 ? "33.34" : "33.33",
});

export default function CreatePage() {
  const router = useRouter();
  const [narrativeName, setNarrativeName] = useState("");
  const [narrativeDesc, setNarrativeDesc] = useState("");
  const [tokens, setTokens] = useState<TokenDraft[]>([blankToken(0), blankToken(1), blankToken(2)]);
  const [error, setError] = useState<string | null>(null);

  const allocTotal = useMemo(
    () => tokens.reduce((s, t) => s + (parseFloat(t.alloc) || 0), 0),
    [tokens],
  );
  const allocValid = Math.abs(allocTotal - 100) < 1e-9;

  function setToken(i: number, patch: Partial<TokenDraft>) {
    setTokens((prev) => prev.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!narrativeName.trim()) return setError("Give your narrative a name.");
    for (let i = 0; i < 3; i++) {
      if (!tokens[i].name.trim()) return setError(`Token ${TOKEN_LETTERS[i]} needs a name.`);
      if (!tokens[i].ticker.trim()) return setError(`Token ${TOKEN_LETTERS[i]} needs a ticker.`);
      const cap = parseFloat(tokens[i].startCap);
      if (!isFinite(cap) || cap <= 0) return setError(`Token ${TOKEN_LETTERS[i]} needs a starting market cap above zero.`);
    }
    const alloc = tokens.map((t) => parseFloat(t.alloc) || 0) as [number, number, number];
    try {
      assertAllocation(alloc);
    } catch {
      return setError(`Buy allocation must total 100 percent — currently ${allocTotal.toFixed(2)}%.`);
    }
    const slug = addLaunch({
      name: narrativeName.trim(),
      description: narrativeDesc.trim() || "A brand-new poof.fun narrative.",
      allocation: alloc,
      tokens: tokens.map((t) => ({
        name: t.name.trim(),
        ticker: t.ticker.trim().toUpperCase(),
        feeDestination: t.fee,
        startMarketCap: parseFloat(t.startCap),
      })),
    });
    router.push(`/narrative/${slug}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Create narrative</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          One narrative, three tokens. Every buy is split across all three pools.
        </p>
      </div>

      <Notice>
        Simulation only — launching here creates a local draft. No contracts are deployed and no
        real tokens are minted.
      </Notice>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <Card>
          <CardHead title="Narrative" />
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            <Field label="Name">
              <input
                className="w-full rounded-md border px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
                placeholder="e.g. NVIDIA CEO CHEATING"
                value={narrativeName}
                onChange={(e) => setNarrativeName(e.target.value)}
              />
            </Field>
            <Field label="Description">
              <textarea
                className="w-full rounded-md border px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
                rows={3}
                placeholder="What ties these three tokens together?"
                value={narrativeDesc}
                onChange={(e) => setNarrativeDesc(e.target.value)}
              />
            </Field>
          </div>
        </Card>

        {tokens.map((t, i) => (
          <Card key={i}>
            <CardHead
              title={`Token ${TOKEN_LETTERS[i]}`}
              aside={
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ background: ["var(--tok-a)", "var(--tok-b)", "var(--tok-c)"][i] }}
                  aria-hidden
                />
              }
            />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <Field label="Name">
                <input
                  className="w-full rounded-md border px-3 py-2.5 text-sm outline-none"
                  style={inputStyle}
                  placeholder={["Pussycoin", "Jensen Huang", "Cheating"][i]}
                  value={t.name}
                  onChange={(e) => setToken(i, { name: e.target.value })}
                />
              </Field>
              <Field label="Ticker">
                <input
                  className="w-full rounded-md border px-3 py-2.5 text-sm uppercase outline-none"
                  style={inputStyle}
                  placeholder={["PUSSYCOIN", "JENSENHUANG", "CHEATING"][i]}
                  value={t.ticker}
                  onChange={(e) => setToken(i, { ticker: e.target.value })}
                />
              </Field>
              <Field label="Fee destination">
                <select
                  className="w-full rounded-md border px-3 py-2.5 text-sm outline-none"
                  style={inputStyle}
                  value={t.fee}
                  onChange={(e) => setToken(i, { fee: e.target.value as FeeDestination })}
                >
                  {FEE_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {FEE_DESTINATION_LABEL[f]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Starting market cap (USD)">
                <input
                  type="number"
                  min="1"
                  step="any"
                  className="tnum w-full rounded-md border px-3 py-2.5 text-sm outline-none"
                  style={inputStyle}
                  value={t.startCap}
                  onChange={(e) => setToken(i, { startCap: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label={`Buy allocation (%) — must total 100 across all three`}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    className="tnum w-full rounded-md border px-3 py-2.5 text-sm outline-none"
                    style={inputStyle}
                    value={t.alloc}
                    onChange={(e) => setToken(i, { alloc: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          </Card>
        ))}

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2 p-4 sm:px-5">
            <span className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>
              Total allocation
            </span>
            <span
              className="tnum text-sm font-bold"
              style={{ color: allocValid ? "var(--up)" : "var(--down)" }}
            >
              {allocTotal.toFixed(2)}% {allocValid ? "✓" : "— must total 100%"}
            </span>
          </div>
        </Card>

        {error && (
          <Notice tone="warn">
            {error}
          </Notice>
        )}

        <div>
          <PrimaryButton type="submit">Launch narrative (simulated)</PrimaryButton>
        </div>
      </form>
    </div>
  );
}
