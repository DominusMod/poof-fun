import DraftResolver from "./DraftResolver";

export default async function NarrativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DraftResolver slug={slug} />;
}

export function generateStaticParams() {
  return [
    { slug: "nvidia-ceo-cheating" },
    { slug: "elon-musk-favorite-meme" },
  ];
}
