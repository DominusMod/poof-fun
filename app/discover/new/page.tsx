import { NARRATIVES } from "@/lib/mock";
import { NarrativeCards, NarrativeTable } from "@/components/NarrativeList";
import { PrevNext } from "@/components/ui";

export default function NewPage() {
  const items = [...NARRATIVES].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">New</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          The freshest narratives, newest first.
        </p>
      </div>
      <NarrativeTable items={items} />
      <NarrativeCards items={items} />
      <PrevNext prev={{ href: "/discover/rising", label: "Rising" }} next={{ href: "/discover/top", label: "Top" }} />
    </div>
  );
}
