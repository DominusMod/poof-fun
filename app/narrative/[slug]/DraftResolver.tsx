"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { draftToNarrative, getLaunch } from "@/lib/launches";
import { engineFor, FEE_DESTINATION_LABEL, getNarrative, narrativeStartCap, type Narrative } from "@/lib/mock";
import { fmtUsd } from "@/lib/engine";
import TradePanel from "./TradePanel";
import { Card, EmptyState, Notice, PrimaryButton } from "@/components/ui";

export default function DraftResolver({ slug }: { slug: string }) {
  const [narrative, setNarrative] = useState<Narrative | null | undefined>(undefined);

  useEffect(() => {
    const fromMock = getNarrative(slug);
    if (fromMock) {
      setNarrative(fromMock);
      return;
    }
    const draft = getLaunch(slug);
    setNarrative(draft ? draftToNarrative(draft) : null);
  }, [slug]);

  if (narrative === undefined) {
    return (
      <Card>
        <div className="p-5 text-sm" style={{ color: "var(--text-2)" }}>Loading narrative…</div>
      </Card>
    );
  }

  if (narrative === null) {
    return (
      <Card>
        <EmptyState
          title="Narrative not found"
          body="This narrative does not exist in the mock dataset or in your local drafts."
          action={
            <Link href="/discover/rising">
              <PrimaryButton>Back to Discover</PrimaryButton>
            </Link>
          }
        />
      </Card>
    );
  }

  const initial = engineFor(narrative);

  return (
    <div>
      <Link href="/discover/rising" className="text-sm font-semibold" style={{ color: "var(--text-3)" }}>
        ← Discover
      </Link>
      <div className="mb-6 mt-2">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{narrative.name}</h1>
        <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--text-2)" }}>
          {narrative.description}
        </p>
        <div className="tnum mt-2 text-[13px]" style={{ color: "var(--text-3)" }}>
          Combined starting cap {fmtUsd(narrativeStartCap(narrative))} · 24h vol {fmtUsd(narrative.volume24h)}
        </div>
      </div>

      <Notice>
        Simulation only — trades update local pool math in your browser. No contracts are deployed
        and no real funds move.
      </Notice>

      <div className="mt-5">
        <TradePanel
          key={narrative.slug}
          initial={initial}
          feeLabels={[
            FEE_DESTINATION_LABEL[narrative.tokens[0].feeDestination],
            FEE_DESTINATION_LABEL[narrative.tokens[1].feeDestination],
            FEE_DESTINATION_LABEL[narrative.tokens[2].feeDestination],
          ]}
        />
      </div>
    </div>
  );
}
