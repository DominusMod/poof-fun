import { listDocs } from "@/lib/docs";
import DocsPage from "../DocsPage";

export function generateStaticParams() {
  return listDocs()
    .filter((d) => d.slug !== "introduction")
    .map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { getDoc } = await import("@/lib/docs");
  const doc = getDoc(slug);
  return { title: doc ? `${doc.title} — poof.fun Docs` : "Docs — poof.fun" };
}

export default async function DocSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DocsPage slug={slug} />;
}
