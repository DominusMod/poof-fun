export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Docs</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          How poof.fun works, how to use it, and where the design stands.
        </p>
      </div>
      {children}
    </div>
  );
}
