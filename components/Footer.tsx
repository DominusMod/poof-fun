import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--line)" }}>
      <div className="wrap py-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-display text-lg font-bold">poof.fun</span>
          <nav className="ml-auto flex flex-wrap gap-4 text-[13px]" aria-label="Footer">
            <Link href="/discover/rising" style={{ color: "var(--text-2)" }}>Discover</Link>
            <Link href="/launch/create" style={{ color: "var(--text-2)" }}>Launch</Link>
            <Link href="/portfolio/holdings" style={{ color: "var(--text-2)" }}>Portfolio</Link>
            <Link href="/docs" style={{ color: "var(--text-2)" }}>Docs</Link>
          </nav>
        </div>
        <p className="mt-3 max-w-3xl text-[13px] leading-relaxed" style={{ color: "var(--text-3)" }}>
          poof.fun is at concept stage — simulation only. No contracts are deployed, no real funds move
          through this interface. Equal valuation and coordinated selling are open design questions.
        </p>
      </div>
    </footer>
  );
}
