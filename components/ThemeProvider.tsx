'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type ThemePreference = 'system' | 'smoke' | 'paper';
export type ResolvedTheme = 'smoke' | 'paper';

const STORAGE_KEY = 'poof-theme';

function resolvePreference(p: ThemePreference): ResolvedTheme {
  if (p !== 'system') return p;
  if (typeof window === 'undefined') return 'smoke';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'paper' : 'smoke';
}

function applyTheme(t: ResolvedTheme) {
  document.documentElement.setAttribute('data-theme', t);
}

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (p: ThemePreference) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolved: 'smoke',
  setPreference: () => {},
  cycle: () => {},
});

const ORDER: ThemePreference[] = ['system', 'smoke', 'paper'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [resolved, setResolved] = useState<ResolvedTheme>('smoke');

  // Sync with the pre-paint inline script on mount, then subscribe to OS changes.
  useEffect(() => {
    let initial: ThemePreference = 'system';
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'smoke' || stored === 'paper' || stored === 'system') initial = stored;
    } catch {
      /* storage unavailable — fall through to system */
    }
    setPreferenceState(initial);
    setResolved(resolvePreference(initial));

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      // Re-read in case another tab changed the preference.
      let current: ThemePreference = initial;
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === 'smoke' || stored === 'paper' || stored === 'system') current = stored;
      } catch {
        /* ignore */
      }
      setPreferenceState(current);
      setResolved(resolvePreference(current));
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, p);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    setPreferenceState(p);
    const r = resolvePreference(p);
    setResolved(r);
    applyTheme(r);
  }, []);

  const cycle = useCallback(() => {
    setPreferenceState((prev) => {
      const next = ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length];
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      const r = resolvePreference(next);
      setResolved(r);
      applyTheme(r);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
