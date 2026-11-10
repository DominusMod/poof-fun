"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import WalletButton from "./WalletButton";

interface SubItem {
  href: string;
  label: string;
}

interface NavItem {
  label: string;
  href: string;
  match: string;
  sub: SubItem[];
}

const NAV: NavItem[] = [
  {
    label: "Discover",
    href: "/discover/rising",
    match: "/discover",
    sub: [
      { href: "/discover/rising", label: "Rising" },
      { href: "/discover/new", label: "New" },
      { href: "/discover/top", label: "Top" },
    ],
  },
  {
    label: "Launch",
    href: "/launch/create",
    match: "/launch",
    sub: [
      { href: "/launch/create", label: "Create narrative" },
      { href: "/launch/mine", label: "My launches" },
    ],
  },
  {
    label: "Portfolio",
    href: "/portfolio/holdings",
    match: "/portfolio",
    sub: [
      { href: "/portfolio/holdings", label: "Holdings" },
      { href: "/portfolio/rewards", label: "Rewards" },
    ],
  },
  { label: "Docs", href: "/docs", match: "/docs", sub: [] },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = NAV.find((n) => pathname === n.match || pathname.startsWith(n.match + "/") || pathname.startsWith(n.match + "?"));

  return (
    <header className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--line)", background: "var(--bg)" }}>
      <div className="wrap">
        <div className="flex h-16 items-center gap-4">
          <button
            className="grid h-10 w-10 place-items-center rounded-md border md:hidden"
            style={{ borderColor: "var(--line-2)" }}
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="text-lg leading-none">≡</span>
          </button>
          <Link href="/discover/rising" className="font-display text-xl font-bold tracking-tight">
            poof.fun
          </Link>
          <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((n) => {
              const isActive = active?.label === n.label;
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  aria-current={isActive ? "page" : undefined}
                  className="rounded-md px-3 py-2 text-sm font-medium"
                  style={
                    isActive
                      ? { color: "var(--text)", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line-2)" }
                      : { color: "var(--text-2)" }
                  }
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/launch/create"
              className="hidden h-10 items-center rounded-md border px-4 text-sm font-semibold sm:inline-flex"
              style={{ borderColor: "var(--line-2)", background: "var(--surface-2)", color: "var(--text)" }}
            >
              Launch
            </Link>
            <WalletButton />
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="border-t md:hidden" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }} aria-label="Mobile">
          <div className="wrap py-2">
            {NAV.map((n) => (
              <div key={n.label} className="py-1">
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {n.label}
                </Link>
                {n.sub.length > 0 && (
                  <div className="ml-3 flex flex-col">
                    {n.sub.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-1.5 text-sm"
                        style={{ color: pathname === s.href ? "var(--text)" : "var(--text-2)" }}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}

      {/* sub-menu bar */}
      {active && active.sub.length > 0 && (
        <div className="border-t" style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}>
          <div className="wrap flex items-center gap-1 overflow-x-auto py-1.5" role="tablist" aria-label={`${active.label} sections`}>
            {active.sub.map((s) => {
              const selected = pathname === s.href;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  role="tab"
                  aria-selected={selected}
                  className="whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-semibold"
                  style={
                    selected
                      ? { color: "var(--text)", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--line-2)" }
                      : { color: "var(--text-2)" }
                  }
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
