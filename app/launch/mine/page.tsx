"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { draftToNarrative, loadLaunches, type LaunchDraft } from "@/lib/launches";
import { NarrativeCards, NarrativeTable } from "@/components/NarrativeList";
import { Card, EmptyState, PrimaryButton } from "@/components/ui";

export default function MinePage() {
  const [drafts, setDrafts] = useState<LaunchDraft[] | null>(null);

  useEffect(() => {
    setDrafts(loadLaunches());
  }, []);

  const items = (drafts ?? []).map(draftToNarrative);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">My launches</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          Narratives you drafted in this browser. Stored locally — nothing is deployed.
        </p>
      </div>

      {drafts === null ? (
        <Card>
          <div className="p-5 text-sm" style={{ color: "var(--text-2)" }}>Loading…</div>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            title="No launches yet"
            body="Create your first narrative — name it, define three tokens, and set the buy allocation."
            action={
              <Link href="/launch/create">
                <PrimaryButton>Create narrative</PrimaryButton>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <NarrativeTable items={items} />
          <NarrativeCards items={items} />
        </>
      )}
    </div>
  );
}
