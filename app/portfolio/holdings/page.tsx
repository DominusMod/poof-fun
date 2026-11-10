"use client";

import Link from "next/link";
import { fmtPrice, fmtTokens, fmtUsd } from "@/lib/engine";
import { engineFor, getNarrative, MOCK_HOLDINGS } from "@/lib/mock";
import { Card, CardHead, EmptyState, PrevNext, PrimaryButton } from "@/components/ui";

const COLORS = ["var(--tok-a)", "var(--tok-b)", "var(--tok-c)"] as const;

export default function HoldingsPage() {
  // Mock valuation: current engine price per narrative/token.
  const rows = MOCK_HOLDINGS.map((h) => {
    const n = getNarrative(h.narrativeSlug);
    const engine = n ? engineFor(n) : null;
    const t = engine?.tokens[h.tokenIndex];
    const price = t ? t.reserveQuote / t.reserveBase : 0;
    const value = price * h.balance;
    const cost = h.avgCostUsd * h.balance;
    return { ...h, price, value, pnl: value - cost };
  });
  const total = rows.reduce((s, r) => s + r.value, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Holdings</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          Tokens you picked up through coordinated buys. Mock balances, live engine prices.
        </p>
      </div>

      <Card>
        <CardHead
          title="Portfolio"
          aside={<span className="tnum text-sm font-bold">{fmtUsd(total)}</span>}
        />
        {/* desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="data w-full border-collapse text-[13.5px]">
            <thead>
              <tr style={{ color: "var(--text-3)" }}>
                <th className="px-4 py-2.5 text-left text-xs font-semibold">Token</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold">Narrative</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold">Balance</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold">Price</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold">Value</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold">P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "var(--line)" }}>
                  <td className="px-4 py-3 font-semibold">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[r.tokenIndex] }} aria-hidden />
                    {r.ticker}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-2)" }}>{r.narrativeName}</td>
                  <td className="tnum px-4 py-3 text-right">{fmtTokens(r.balance)}</td>
                  <td className="tnum px-4 py-3 text-right">{fmtPrice(r.price)}</td>
                  <td className="tnum px-4 py-3 text-right">{fmtUsd(r.value)}</td>
                  <td className="tnum px-4 py-3 text-right font-semibold" style={{ color: r.pnl >= 0 ? "var(--up)" : "var(--down)" }}>
                    {r.pnl >= 0 ? "+" : "−"}{fmtUsd(Math.abs(r.pnl))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* phone cards */}
        <div className="flex flex-col gap-3 p-4 md:hidden">
          {rows.map((r, i) => (
            <div key={i} className="rounded-md border p-3.5" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[r.tokenIndex] }} aria-hidden />
                <span className="font-semibold">{r.ticker}</span>
                <span className="tnum ml-auto font-semibold">{fmtUsd(r.value)}</span>
              </div>
              <div className="mt-1 text-xs" style={{ color: "var(--text-3)" }}>{r.narrativeName}</div>
              <div className="tnum mt-2 flex justify-between text-[13px]" style={{ color: "var(--text-2)" }}>
                <span>{fmtTokens(r.balance)} @ {fmtPrice(r.price)}</span>
                <span className="font-semibold" style={{ color: r.pnl >= 0 ? "var(--up)" : "var(--down)" }}>
                  {r.pnl >= 0 ? "+" : "−"}{fmtUsd(Math.abs(r.pnl))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {rows.length === 0 && (
        <Card>
          <EmptyState
            title="No holdings yet"
            body="Buy a token on any narrative page and it will show up here."
            action={
              <Link href="/discover/rising">
                <PrimaryButton>Discover narratives</PrimaryButton>
              </Link>
            }
          />
        </Card>
      )}

      <PrevNext next={{ href: "/portfolio/rewards", label: "Rewards" }} />
    </div>
  );
}
