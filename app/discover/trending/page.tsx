"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { NARRATIVES } from "@/lib/mock";
import { NarrativeCards, NarrativeTable } from "@/components/NarrativeList";
import { PrevNext } from "@/components/ui";

const FILTERS = [
  { key: "24h", label: "Last 24 hours" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
] as const;

export default function TrendingPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("24h");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);

  // Mock: the "last 24 hours" window is the live dataset; wider windows are
  // simulated by including narratives created outside the last day.
  const items = useMemo(() => {
    if (now === null) return [...NARRATIVES].sort((a, b) => b.change24h - a.change24h);
    const windowMs = filter === "24h" ? 24 * 3600 * 1000 : filter === "7d" ? 7 * 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000;
    return [...NARRATIVES]
      .filter((n) => now - new Date(n.createdAt).getTime() <= windowMs)
      .sort((a, b) => b.change24h - a.change24h);
  }, [filter]);

  const featured = items[0];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Trending</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
            Narrative that gain attention - each one launches multiples memes
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border p-1" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }} role="tablist" aria-label="Time filter">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-semibold"
              style={
                filter === f.key
                  ? { color: "var(--text)", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line-2)" }
                  : { color: "var(--text-2)" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {featured && (
        <Link
          href={`/narrative/${featured.slug}`}
          className="mb-6 block rounded-lg border p-5 sm:p-6"
          style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
            FEATURED
          </div>
          <div className="font-display mt-1 text-xl font-bold sm:text-2xl">{featured.name}</div>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--text-2)" }}>
            {featured.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featured.tokens.map((t) => (
              <span
                key={t.ticker}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
                style={{ borderColor: "var(--line-2)", color: "var(--text-2)" }}
              >
                {t.ticker}
              </span>
            ))}
          </div>
        </Link>
      )}

      {items.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          No narratives in this window yet.
        </p>
      ) : (
        <>
          <NarrativeTable items={items} />
          <NarrativeCards items={items} />
        </>
      )}

      <PrevNext next={{ href: "/discover/new", label: "New" }} />
    </div>
  );
}
