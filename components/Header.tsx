'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import WalletButton from './WalletButton';
import ThemeToggle from './ThemeToggle';

/** X (Twitter) profile — update the handle here if it changes. */
const X_URL = 'https://x.com/poofdotfun';

function XIcon({ className = '' }: { className?: string }) {
return (
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
</svg>
);
}

/**
 * Floating capsule navigation.
 * Desktop (md+): logo left, X / Docs / Explore / Launch centered, wallet right.
 * Mobile: logo left; X, wallet and hamburger right; Docs / Explore / Launch
 * live inside the hamburger dropdown.
 */
export default function Header() {
const pathname = usePathname();
const [menuOpen, setMenuOpen] = useState(false);
const menuRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);

const exploreActive =
pathname === '/' || pathname.startsWith('/discover') || pathname.startsWith('/narrative');
const launchActive = pathname.startsWith('/launch');
const docsActive = pathname === '/docs' || pathname.startsWith('/docs/');

// Close on Escape (returning focus to the button) or outside tap/click.
useEffect(() => {
if (!menuOpen) return;
function onKey(e: KeyboardEvent) {
if (e.key === 'Escape') {
setMenuOpen(false);
buttonRef.current?.focus();
}
}
function onPointer(e: PointerEvent) {
if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
setMenuOpen(false);
}
}
document.addEventListener('keydown', onKey);
document.addEventListener('pointerdown', onPointer);
return () => {
document.removeEventListener('keydown', onKey);
document.removeEventListener('pointerdown', onPointer);
};
}, [menuOpen]);

const linkStyle = (active: boolean) =>
active
? {
color: 'var(--text)',
background: 'var(--surface-2)',
boxShadow: 'inset 0 0 0 1px var(--line-2)',
}
: { color: 'var(--text-2)' };

const dropLinks = [
{ href: '/docs', label: 'Docs', active: docsActive },
{ href: '/discover/trending', label: 'Explore', active: exploreActive },
{ href: '/launch/create', label: 'Launch', active: launchActive },
];

return (
<header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
<div className="relative mx-auto w-full" style={{ maxWidth: 'var(--page)' }}>
<div
className="flex h-14 items-center gap-2 rounded-[20px] border px-3 sm:px-4 md:h-16"
style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
>
{/* Left: logo */}
<Link href="/" className="font-display brand-glow shrink-0" aria-label="poof.fun home">
poof.fun
</Link>

{/* Middle: desktop links */}
<nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Primary">
<a
href={X_URL}
target="_blank"
rel="noreferrer"
aria-label="poof.fun on X"
className="grid h-9 w-9 place-items-center rounded-full"
style={{ color: 'var(--text-2)' }}
>
<XIcon className="h-4 w-4" />
</a>
<Link
href="/docs"
aria-current={docsActive ? 'page' : undefined}
className="rounded-full px-4 py-2 text-sm font-medium"
style={linkStyle(docsActive)}
>
Docs
</Link>
<Link
href="/discover/trending"
aria-current={exploreActive ? 'page' : undefined}
className="rounded-full px-4 py-2 text-sm font-medium"
style={linkStyle(exploreActive)}
>
Explore
</Link>
<Link
href="/launch/create"
aria-current={launchActive ? 'page' : undefined}
className="rounded-full px-4 py-2 text-sm font-medium"
style={linkStyle(launchActive)}
>
Launch
</Link>
</nav>

{/* Right: wallet always; X + hamburger on mobile only */}
<div className="ml-auto flex shrink-0 items-center gap-2">
<a
href={X_URL}
target="_blank"
rel="noreferrer"
aria-label="poof.fun on X"
className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border md:hidden"
style={{ borderColor: 'var(--line-2)', color: 'var(--text)' }}
>
<XIcon className="h-4 w-4" />
</a>
<ThemeToggle />
<WalletButton />
<button
ref={buttonRef}
type="button"
onClick={() => setMenuOpen((v) => !v)}
aria-expanded={menuOpen}
aria-label={menuOpen ? 'Close menu' : 'Open menu'}
className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border md:hidden"
style={{ borderColor: 'var(--line-2)', color: 'var(--text)' }}
>
<span aria-hidden="true" className="text-lg leading-none">
{menuOpen ? '✕' : '☰'}
</span>
</button>
</div>
</div>

{/* Mobile dropdown: Docs / Explore / Launch */}
<div ref={menuRef}>
<div
className={`absolute inset-x-0 top-full z-50 mt-2 origin-top rounded-[20px] border p-2 transition-all duration-200 md:hidden ${
menuOpen ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
}`}
style={{ background: 'var(--surface)', borderColor: 'var(--line-2)' }}
>
{dropLinks.map((l) => (
<Link
key={l.href}
href={l.href}
aria-current={l.active ? 'page' : undefined}
onClick={() => setMenuOpen(false)}
tabIndex={menuOpen ? 0 : -1}
className="block rounded-2xl px-4 py-2.5 text-sm font-medium"
style={
l.active
? {
color: 'var(--text)',
background: 'var(--surface-2)',
boxShadow: 'inset 0 0 0 1px var(--line-2)',
}
: { color: 'var(--text-2)' }
}
>
{l.label}
</Link>
))}
</div>
</div>
</div>
</header>
);
}
