'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletButton from './WalletButton';
import ThemeToggle from './ThemeToggle';
import MenuButton from './MenuButton';
import type { DocMeta } from '@/lib/docs';

/**
 * Top header: wordmark, Explore, Launch, theme toggle,
 * wallet button, menu icon. Everything else lives in the menu.
 */
export default function Header({ docs }: { docs: DocMeta[] }) {
  const pathname = usePathname();
  const exploreActive =
    pathname === '/' || pathname.startsWith('/discover') || pathname.startsWith('/narrative');
  const launchActive = pathname.startsWith('/launch');

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}
    >
      <div className="wrap">
        <div className="flex h-14 items-center gap-2 md:h-16 md:gap-3">
          <Link
            href="/"
            className="font-display brand-glow"
            aria-label="poof.fun home"
          >
            poof.fun
          </Link>

          {/* Desktop primary shortcuts */}
          <nav className="ml-1 hidden items-center gap-1 md:flex" aria-label="Primary">
            <Link
              href="/discover/trending"
              aria-current={exploreActive ? 'page' : undefined}
              className="rounded-md px-3 py-2 text-sm font-medium"
              style={
                exploreActive
                  ? {
                      color: 'var(--text)',
                      background: 'var(--surface-2)',
                      boxShadow: 'inset 0 0 0 1px var(--line-2)',
                    }
                  : { color: 'var(--text-2)' }
              }
            >
              Explore
            </Link>
            <Link
              href="/launch/create"
              aria-current={launchActive ? 'page' : undefined}
              className="rounded-md px-3 py-2 text-sm font-medium"
              style={
                launchActive
                  ? {
                      color: 'var(--text)',
                      background: 'var(--surface-2)',
                      boxShadow: 'inset 0 0 0 1px var(--line-2)',
                    }
                  : { color: 'var(--text-2)' }
              }
            >
              Launch
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <WalletButton />
            <MenuButton docs={docs} />
          </div>
        </div>

        {/* Mobile primary shortcuts — second row so nothing crowds out. */}
        <nav className="flex items-center gap-2 pb-3 md:hidden" aria-label="Primary">
          <Link
            href="/discover/trending"
            aria-current={exploreActive ? 'page' : undefined}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-md border text-sm font-semibold"
            style={
              exploreActive
                ? {
                    borderColor: 'var(--text)',
                    background: 'var(--text)',
                    color: 'var(--bg)',
                  }
                : {
                    borderColor: 'var(--line-2)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }
            }
          >
            Explore
          </Link>
          <Link
            href="/launch/create"
            aria-current={launchActive ? 'page' : undefined}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-md border text-sm font-semibold"
            style={
              launchActive && !exploreActive
                ? {
                    borderColor: 'var(--text)',
                    background: 'var(--text)',
                    color: 'var(--bg)',
                  }
                : {
                    borderColor: 'var(--line-2)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }
            }
          >
            Launch
          </Link>
        </nav>
      </div>
    </header>
  );
}
