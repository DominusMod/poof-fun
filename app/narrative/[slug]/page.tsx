import DraftResolver from "./DraftResolver";

export default async function NarrativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DraftResolver slug={slug} />;
}

export function generateStaticParams() {
  return [
    { slug: "animal-revolution" },
    { slug: "neon-district" },
    { slug: "deep-harvest" },
    { slug: "orbital-dock" },
    { slug: "paper-empire" },
  ];
}
