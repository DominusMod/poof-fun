"use client";

import type { Narrative } from "./mock";

/**
 * Local drafts created via Launch → Create narrative, persisted to
 * localStorage. Mock only — nothing is deployed on-chain.
 */

const KEY = "poof-fun-launches-v1";

export interface LaunchDraft {
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  allocation: [number, number, number];
  tokens: Narrative["tokens"];
}

export function slugify(name: string): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "narrative";
  return `${base}-${Date.now().toString(36)}`;
}

export function loadLaunches(): LaunchDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addLaunch(draft: Omit<LaunchDraft, "slug" | "createdAt">): string {
  const full: LaunchDraft = {
    ...draft,
    slug: slugify(draft.name),
    createdAt: new Date().toISOString(),
  };
  const prev = loadLaunches();
  window.localStorage.setItem(KEY, JSON.stringify([full, ...prev]));
  return full.slug;
}

export function getLaunch(slug: string): LaunchDraft | undefined {
  return loadLaunches().find((l) => l.slug === slug);
}

export function draftToNarrative(d: LaunchDraft): Narrative {
  return {
    slug: d.slug,
    name: d.name,
    description: d.description,
    createdAt: d.createdAt,
    volume24h: 0,
    change24h: 0,
    tokens: d.tokens,
    allocation: d.allocation,
  };
}
