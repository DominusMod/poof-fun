import type { ReactNode } from "react";
import Link from "next/link";

/** Flat 1px card, small radius, no gradients or glows. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-lg border ${className}`}
      style={{ borderColor: "var(--line)", background: "var(--surface)" }}
    >
      {children}
    </section>
  );
}

export function CardHead({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div
      className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5"
      style={{ borderColor: "var(--line)" }}
    >
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {aside}
    </div>
  );
}

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex h-6 items-center whitespace-nowrap rounded-full border px-2.5 text-xs font-semibold"
      style={{
        borderColor: "var(--line-2)",
        background: "var(--surface-2)",
        color: color ?? "var(--text-2)",
      }}
    >
      {children}
    </span>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn"; children: ReactNode }) {
  return (
    <div
      className="flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] leading-relaxed"
      style={{
        borderColor: tone === "warn" ? "var(--warn)" : "var(--line-2)",
        background: "var(--surface-2)",
        color: "var(--text-2)",
      }}
      role="note"
    >
      <span aria-hidden>{tone === "warn" ? "⚠" : "ⓘ"}</span>
      <div>{children}</div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center rounded-md border px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        borderColor: "var(--text)",
        background: "var(--text)",
        color: "var(--bg)",
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center rounded-md border px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
      style={{ borderColor: "var(--line-2)", background: "var(--surface)", color: "var(--text)" }}
    >
      {children}
    </button>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold" style={{ color: "var(--text-2)" }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs" style={{ color: "var(--text-3)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export const inputStyle: React.CSSProperties = {
  borderColor: "var(--line-2)",
  background: "var(--bg-2)",
  color: "var(--text)",
};

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
        {label}
      </div>
      <div className="tnum truncate text-[15px] font-semibold" style={{ color: "var(--text)" }}>
        {value}
      </div>
      {sub && <div className="text-xs" style={{ color: "var(--text-3)" }}>{sub}</div>}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="px-4 py-10 text-center sm:px-6">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm" style={{ color: "var(--text-2)" }}>
        {body}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PrevNext({ prev, next }: { prev?: { href: string; label: string }; next?: { href: string; label: string } }) {
  return (
    <nav className="mt-10 flex items-center justify-between gap-3 border-t pt-6" style={{ borderColor: "var(--line)" }} aria-label="Page navigation">
      <div>
        {prev && (
          <Link href={prev.href} className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>
            ← {prev.label}
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link href={next.href} className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>
            {next.label} →
          </Link>
        )}
      </div>
    </nav>
  );
}
