'use client';

import { useTheme } from './ThemeProvider';

/**
 * Compact Light / Dark / System cycle button for the header.
 * Icon reflects the *resolved* theme; label names the preference.
 */
export default function ThemeToggle() {
  const { preference, resolved, cycle } = useTheme();
  const label =
    preference === 'system' ? `System (${resolved === 'smoke' ? 'dark' : 'light'})` : preference === 'smoke' ? 'Dark' : 'Light';

  return (
    <button
      type="button"
      onClick={cycle}
      title={`Theme: ${label} — click to change`}
      aria-label={`Theme: ${label}. Activate to change theme.`}
      className="grid h-10 w-10 place-items-center rounded-md border"
      style={{ borderColor: 'var(--line-2)', background: 'var(--surface)', color: 'var(--text)' }}
    >
      <span aria-hidden className="text-base leading-none">
        {resolved === 'smoke' ? '◑' : '◐'}
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
