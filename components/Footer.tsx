import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--line)" }}>
      <div className="wrap py-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-display brand-glow">poof.fun</span>
          <nav className="ml-auto flex flex-wrap gap-4 text-[13px]" aria-label="Footer">
            <Link href="/discover/trending" style={{ color: "var(--text-2)" }}>Explore</Link>
            <Link href="/launch/create" style={{ color: "var(--text-2)" }}>Launch</Link>
            <Link href="/portfolio/holdings" style={{ color: "var(--text-2)" }}>Portfolio</Link>
            <Link href="/docs" style={{ color: "var(--text-2)" }}>Docs</Link>
          </nav>
        </div>
        <p className="mx-auto mt-3 max-w-3xl text-center text-[13px] font-bold leading-relaxed" style={{ color: "var(--text-3)" }}>
          poof.fun does not guarantee gains, trading memecoins is highly volatile can loose it&apos;s total
          value. Trade with causions
        </p>
      </div>
    </footer>
  );
}
