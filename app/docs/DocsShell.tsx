"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { DocMeta } from "@/lib/docs";

export interface TocHeading {
  id: string;
  text: string;
}

export default function DocsShell({
  docs,
  activeSlug,
  toc,
  children,
}: {
  docs: DocMeta[];
  activeSlug: string;
  toc: TocHeading[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const out: { name: string; items: DocMeta[] }[] = [];
    for (const d of docs) {
      let g = out.find((x) => x.name === d.group);
      if (!g) {
        g = { name: d.group, items: [] };
        out.push(g);
      }
      g.items.push(d);
    }
    return out;
  }, [docs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((d) => d.title.toLowerCase().includes(q) || d.slug.includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  function go(slug: string) {
    setMenuOpen(false);
    router.push(slug === "introduction" ? "/docs" : `/docs/${slug}`);
  }

  const sidebar = (
    <div className="flex flex-col gap-5">
      <div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter docs…"
          aria-label="Filter docs pages"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--line-2)", background: "var(--bg-2)", color: "var(--text)" }}
        />
      </div>
      {filtered.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-3)" }}>No pages match “{query}”.</p>
      )}
      {filtered.map((g) => (
        <div key={g.name}>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
            {g.name}
          </div>
          <ul className="flex flex-col">
            {g.items.map((d) => {
              const active = d.slug === activeSlug;
              return (
                <li key={d.slug}>
                  <button
                    onClick={() => go(d.slug)}
                    aria-current={active ? "page" : undefined}
                    className="block w-full rounded-md px-2.5 py-1.5 text-left text-sm"
                    style={
                      active
                        ? { color: "var(--text)", background: "var(--surface-2)", fontWeight: 600, boxShadow: "inset 0 0 0 1px var(--line-2)" }
                        : { color: "var(--text-2)" }
                    }
                  >
                    {d.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* phone menu button */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-semibold"
          style={{ borderColor: "var(--line-2)", background: "var(--surface)", color: "var(--text)" }}
        >
          {menuOpen ? "Close contents" : "Contents"}
        </button>
        {menuOpen && (
          <div
            className="mt-2 rounded-lg border p-4"
            style={{ borderColor: "var(--line)", background: "var(--surface)" }}
          >
            {sidebar}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <aside className="hidden lg:block" aria-label="Docs navigation">
          <div className="sticky top-32">{sidebar}</div>
        </aside>
        <div className="min-w-0">{children}</div>
        <div className="hidden xl:block">
          {toc.length > 0 && (
            <nav className="sticky top-32" aria-label="On this page">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
                On this page
              </div>
              <ul className="flex flex-col gap-1 border-l pl-3" style={{ borderColor: "var(--line-2)" }}>
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-[13px] hover:underline" style={{ color: "var(--text-2)" }}>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
