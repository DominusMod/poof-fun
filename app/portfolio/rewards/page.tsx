"use client";

import { useState } from "react";
import { fmtUsd } from "@/lib/engine";
import { MOCK_REWARDS } from "@/lib/mock";
import { Card, CardHead, Chip, GhostButton, PrevNext, PrimaryButton } from "@/components/ui";

const KIND_LABEL = {
  holder: "Holder rewards",
  creator: "Creator rewards",
  buyback: "Buyback & burn",
} as const;

export default function RewardsPage() {
  const [claimed, setClaimed] = useState<Set<string>>(
    () => new Set(MOCK_REWARDS.filter((r) => r.claimed).map((r) => r.id)),
  );

  const claimable = MOCK_REWARDS.filter((r) => r.kind === "holder" && !claimed.has(r.id));
  const claimableTotal = claimable.reduce((s, r) => s + r.amountUsd, 0);

  function claimAll() {
    setClaimed((prev) => new Set([...prev, ...claimable.map((r) => r.id)]));
  }

  const creatorRows = MOCK_REWARDS.filter((r) => r.kind === "creator");
  const buybackRows = MOCK_REWARDS.filter((r) => r.kind === "buyback");

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Rewards</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          Claim holder rewards, see creator rewards, and track buyback &amp; burn history.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHead
            title="Holder rewards"
            aside={
              claimableTotal > 0 ? (
                <PrimaryButton onClick={claimAll}>Claim {fmtUsd(claimableTotal)}</PrimaryButton>
              ) : (
                <Chip>Nothing to claim</Chip>
              )
            }
          />
          <div className="flex flex-col">
            {MOCK_REWARDS.filter((r) => r.kind === "holder").map((r) => {
              const isClaimed = claimed.has(r.id);
              return (
                <div key={r.id} className="flex items-center gap-3 border-t px-4 py-3 first:border-t-0 sm:px-5" style={{ borderColor: "var(--line)" }}>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {r.ticker} <span style={{ color: "var(--text-3)" }}>· {r.narrativeName}</span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-3)" }}>{r.detail}</div>
                  </div>
                  <span className="tnum text-sm font-bold">{fmtUsd(r.amountUsd)}</span>
                  {isClaimed ? (
                    <Chip>Claimed</Chip>
                  ) : (
                    <GhostButton
                      onClick={() => setClaimed((prev) => new Set([...prev, r.id]))}
                    >
                      Claim
                    </GhostButton>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHead title="Creator rewards" aside={<Chip>{KIND_LABEL.creator}</Chip>} />
          <div className="flex flex-col">
            {creatorRows.map((r) => (
              <div key={r.id} className="flex items-center gap-3 border-t px-4 py-3 first:border-t-0 sm:px-5" style={{ borderColor: "var(--line)" }}>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">
                    {r.ticker} <span style={{ color: "var(--text-3)" }}>· {r.narrativeName}</span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-3)" }}>{r.detail}</div>
                </div>
                <span className="tnum text-sm font-bold">{fmtUsd(r.amountUsd)}</span>
                <Chip>Accrued</Chip>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Buyback & burn history" aside={<Chip>{KIND_LABEL.buyback}</Chip>} />
          <div className="flex flex-col">
            {buybackRows.map((r) => (
              <div key={r.id} className="flex items-center gap-3 border-t px-4 py-3 first:border-t-0 sm:px-5" style={{ borderColor: "var(--line)" }}>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">
                    {r.ticker} <span style={{ color: "var(--text-3)" }}>· {r.narrativeName}</span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-3)" }}>{r.detail}</div>
                </div>
                <span className="tnum text-sm font-bold">{fmtUsd(r.amountUsd)}</span>
                <Chip>Burned</Chip>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <PrevNext prev={{ href: "/portfolio/holdings", label: "Holdings" }} next={{ href: "/docs", label: "Docs" }} />
    </div>
  );
}
