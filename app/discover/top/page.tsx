import { narrativeStartCap, NARRATIVES } from "@/lib/mock";
import { NarrativeCards, NarrativeTable } from "@/components/NarrativeList";
import { PrevNext } from "@/components/ui";

export default function TopPage() {
  const items = [...NARRATIVES].sort((a, b) => narrativeStartCap(b) - narrativeStartCap(a));
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Top</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          The largest narratives by combined market cap.
        </p>
      </div>
      <NarrativeTable items={items} />
      <NarrativeCards items={items} />
      <PrevNext prev={{ href: "/discover/new", label: "New" }} next={{ href: "/launch/create", label: "Create narrative" }} />
    </div>
  );
}
