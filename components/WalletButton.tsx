"use client";

import { useState } from "react";

/**
 * Display-only wallet button (devnet mode). No real connection is made:
 * clicking toggles a simulated devnet address so the UI can be exercised
 * without funds or a real wallet.
 */
export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);

  if (address) {
    return (
      <div className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-semibold">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "var(--up)" }}
          aria-hidden
        />
        <span className="tnum" title={address}>
          {address.slice(0, 4)}…{address.slice(-4)}
        </span>
        <span
          className="rounded border px-1.5 py-0.5 text-[11px] font-semibold"
          style={{ borderColor: "var(--line-2)", color: "var(--text-3)" }}
        >
          devnet
        </span>
        <button
          onClick={() => setAddress(null)}
          className="text-[11px] font-medium underline-offset-2 hover:underline"
          style={{ color: "var(--text-3)" }}
        >
          Disconnect
        </button>
        <style jsx>{`
          div {
            border-color: var(--line-2);
            background: var(--surface);
            color: var(--text);
          }
        `}</style>
      </div>
    );
  }

  return (
    <button
      onClick={() => setAddress("7fKq9mZ3aQ2xRtYvBn8Lp4WsDcE6FgHj1")}
      className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-semibold"
      style={{ borderColor: "var(--line-2)", background: "var(--surface)", color: "var(--text)" }}
    >
      Connect wallet
      <span
        className="ml-2 rounded border px-1.5 py-0.5 text-[11px] font-semibold"
        style={{ borderColor: "var(--line-2)", color: "var(--text-3)" }}
      >
        devnet
      </span>
    </button>
  );
}
