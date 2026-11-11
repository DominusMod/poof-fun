'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DocMeta } from '@/lib/docs';
import { MENU_SECTIONS, docsMenuSection, type MenuSection } from './nav';

function MenuPanel({
  sections,
  isActive,
  onSelect,
}: {
  sections: MenuSection[];
  isActive: (href: string) => boolean;
  onSelect: () => void;
}) {
  return (
    <div role="menu" aria-label="Site menu" className="menu-panel">
      {sections.map((s) => (
        <div key={s.title} className="menu-section">
          <div className="menu-section-title">{s.title}</div>
          <ul>
            {s.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  role="menuitem"
                  onClick={onSelect}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={isActive(l.href) ? 'menu-link menu-link-active' : 'menu-link'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Site menu: dropdown panel on desktop, slide-in drawer on mobile.
 * Closes on outside click, Escape, or link selection. Traps focus
 * while open and locks body scroll for the mobile drawer.
 */
export default function MenuButton({ docs }: { docs: DocMeta[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const navigated = useRef(false);

  const sections = [...MENU_SECTIONS, docsMenuSection(docs)];

  const close = useCallback(() => setOpen(false), []);
  const selectAndClose = useCallback(() => {
    navigated.current = true;
    setOpen(false);
  }, []);

  const isActive = useCallback(
    (href: string) =>
      href === '/docs' ? pathname === '/docs' : pathname === href || pathname.startsWith(href + '/'),
    [pathname]
  );

  // Visible focusable elements inside the open menu (the hidden
  // breakpoint variant reports no boxes, so it is skipped).
  const visibleFocusables = useCallback(() => {
    const root = rootRef.current;
    if (!root) return [] as HTMLElement[];
    return Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter(
      (el) => el.getClientRects().length > 0
    );
  }, []);

  // Close on Escape; trap Tab focus inside the visible panel.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        navigated.current = false;
        close();
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = visibleFocusables();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, close, visibleFocusables]);

  // Close on outside click (desktop dropdown; the mobile drawer has its own scrim).
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (rootRef.current?.contains(e.target as Node)) return;
      navigated.current = false;
      close();
    }
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, close]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia('(min-width: 768px)').matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus into the panel on open; return it to the button on close,
  // unless the user picked a link (the page is navigating away).
  useEffect(() => {
    if (open && !wasOpen.current) {
      visibleFocusables()[0]?.focus();
    } else if (!open && wasOpen.current && !navigated.current) {
      buttonRef.current?.focus();
    }
    navigated.current = false;
    wasOpen.current = open;
  }, [open, visibleFocusables]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          navigated.current = false;
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="grid h-10 w-10 place-items-center rounded-md border"
        style={{ borderColor: 'var(--line-2)', background: 'var(--surface)', color: 'var(--text)' }}
      >
        <span aria-hidden className="text-lg leading-none">
          {open ? '✕' : '☰'}
        </span>
      </button>

      {/* Mobile: slide-in drawer + scrim. */}
      {open && (
        <div className="menu-drawer-root md:hidden">
          <div className="menu-scrim" onClick={close} aria-hidden="true" />
          <div className="menu-drawer" style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}>
            <div className="menu-drawer-head" style={{ borderColor: 'var(--line)' }}>
              <span className="font-display text-lg font-bold">Menu</span>
              <button
                type="button"
                onClick={() => {
                  navigated.current = false;
                  close();
                }}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-md border"
                style={{ borderColor: 'var(--line-2)', color: 'var(--text)' }}
              >
                <span aria-hidden className="text-lg leading-none">
                  ✕
                </span>
              </button>
            </div>
            <div className="menu-drawer-body">
              <MenuPanel sections={sections} isActive={isActive} onSelect={selectAndClose} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop: dropdown panel anchored to the header. */}
      {open && (
        <div className="menu-dropdown-wrap hidden md:block">
          <div
            className="menu-dropdown"
            style={{ background: 'var(--surface)', borderColor: 'var(--line-2)' }}
          >
            <MenuPanel sections={sections} isActive={isActive} onSelect={selectAndClose} />
          </div>
        </div>
      )}

      <style jsx>{`
        .menu-section {
          padding: 0.35rem 0;
        }
        .menu-section + .menu-section {
          border-top: 1px solid var(--line);
          margin-top: 0.35rem;
          padding-top: 0.7rem;
        }
        .menu-section-title {
          padding: 0 0.75rem;
          margin-bottom: 0.15rem;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-3);
        }
        .menu-link {
          display: block;
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          color: var(--text-2);
          text-decoration: none;
          max-width: 16rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .menu-link:hover {
          background: var(--surface-2);
          color: var(--text);
        }
        .menu-link-active {
          color: var(--text);
          font-weight: 600;
        }
        .menu-dropdown-wrap {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 50;
        }
        .menu-dropdown {
          border: 1px solid;
          border-radius: 10px;
          padding: 0.6rem;
          min-width: 15rem;
          max-height: min(70vh, 560px);
          overflow-y: auto;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
        }
        .menu-drawer-root {
          position: fixed;
          inset: 0;
          z-index: 60;
        }
        .menu-scrim {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
        }
        .menu-drawer {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(86vw, 340px);
          border-left: 1px solid;
          display: flex;
          flex-direction: column;
        }
        .menu-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid;
        }
        .menu-drawer-body {
          overflow-y: auto;
          padding: 0.75rem 1rem 1.25rem;
        }
        .menu-drawer-body :global(.menu-link) {
          max-width: none;
          white-space: normal;
        }
      `}</style>
    </div>
  );
}
