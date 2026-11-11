import Link from "next/link";
import { fmtPct, fmtUsd } from "@/lib/engine";
import { narrativeStartCap, type Narrative } from "@/lib/mock";

function TokenCount({ n }: { n: Narrative }) {
  const count = n.tokens.length;
  return (
    <span
      className="tnum inline-flex min-w-8 items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-bold"
      style={{ borderColor: "var(--line-2)", color: "var(--text)" }}
      title={`${count} ${count === 1 ? "token" : "tokens"} launched in this narrative`}
    >
      {count}
    </span>
  );
}

/** Desktop table (hidden on small screens). */
export function NarrativeTable({ items }: { items: Narrative[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border md:block" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
      <table className="data w-full border-collapse text-[13.5px]">
        <thead>
          <tr style={{ color: "var(--text)" }}>
            <th className="px-3 py-2.5 text-left text-sm font-bold">Narrative</th>
            <th className="px-3 py-2.5 text-left text-sm font-bold">Tokens</th>
            <th className="px-3 py-2.5 text-right text-sm font-bold">Holders</th>
            <th className="px-3 py-2.5 text-right text-sm font-bold">Market cap</th>
            <th className="px-3 py-2.5 text-right text-sm font-bold">24h vol</th>
            <th className="px-3 py-2.5 text-right text-sm font-bold">24h</th>
          </tr>
        </thead>
        <tbody>
          {items.map((n) => (
            <tr key={n.slug} className="border-t" style={{ borderColor: "var(--line)" }}>
              <td className="px-3 py-3">
                <Link href={`/narrative/${n.slug}`} className="font-semibold hover:underline" style={{ color: "var(--text)" }}>
                  {n.name}
                </Link>
                <div className="text-xs" style={{ color: "var(--text-3)" }}>
                  {n.tokens.map((t) => t.ticker).join(" · ")}
                </div>
              </td>
              <td className="px-3 py-3">
                <TokenCount n={n} />
              </td>
              <td className="tnum px-3 py-3 text-right">{n.holders.toLocaleString("en-US")}</td>
              <td className="tnum px-3 py-3 text-right">{fmtUsd(narrativeStartCap(n))}</td>
              <td className="tnum px-3 py-3 text-right">{fmtUsd(n.volume24h)}</td>
              <td
                className="tnum px-3 py-3 text-right font-semibold"
                style={{ color: n.change24h >= 0 ? "var(--up)" : "var(--down)" }}
              >
                {fmtPct(n.change24h)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Stacked cards for phones. */
export function NarrativeCards({ items }: { items: Narrative[] }) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {items.map((n) => (
        <Link
          key={n.slug}
          href={`/narrative/${n.slug}`}
          className="rounded-lg border p-4"
          style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-[15px] font-semibold">{n.name}</span>
            <span
              className="tnum text-sm font-semibold"
              style={{ color: n.change24h >= 0 ? "var(--up)" : "var(--down)" }}
            >
              {fmtPct(n.change24h)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: "var(--text-3)" }}>
            <TokenCount n={n} />
            <span>{n.tokens.map((t) => t.ticker).join(" · ")}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[13px]">
            <span style={{ color: "var(--text-3)" }}>
              Holders <span className="tnum font-semibold" style={{ color: "var(--text)" }}>{n.holders.toLocaleString("en-US")}</span>
            </span>
            <span style={{ color: "var(--text-3)" }}>
              MCap <span className="tnum font-semibold" style={{ color: "var(--text)" }}>{fmtUsd(narrativeStartCap(n))}</span>
            </span>
            <span style={{ color: "var(--text-3)" }}>
              Vol <span className="tnum font-semibold" style={{ color: "var(--text)" }}>{fmtUsd(n.volume24h)}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
