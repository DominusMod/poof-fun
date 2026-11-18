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
<div className="flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold">
<span
className="inline-block h-2 w-2 shrink-0 rounded-full"
style={{ background: "var(--up)" }}
aria-hidden
/>
<span className="tnum" title={address}>
{address.slice(0, 4)}…{address.slice(-4)}
</span>
<span
className="hidden rounded-full border px-1.5 py-0.5 text-[11px] font-semibold sm:inline"
style={{ borderColor: "var(--line-2)", color: "var(--text-3)" }}
>
devnet
</span>
<button
onClick={() => setAddress(null)}
className="shrink-0 text-[11px] font-medium underline-offset-2 hover:underline"
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
className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full border px-3 text-[13px] font-semibold sm:px-4 sm:text-sm"
style={{ borderColor: "var(--line-2)", background: "var(--surface)", color: "var(--text)" }}
>
Connect wallet
<span
className="ml-2 hidden rounded-full border px-1.5 py-0.5 text-[11px] font-semibold sm:inline"
style={{ borderColor: "var(--line-2)", color: "var(--text-3)" }}
>
devnet
</span>
</button>
);
}
