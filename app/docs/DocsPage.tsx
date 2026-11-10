import { notFound } from "next/navigation";
import { getDoc, listDocs } from "@/lib/docs";
import DocsShell from "./DocsShell";
import DocArticle from "./DocArticle";
import EngineDemo from "./EngineDemo";

export default function DocsPage({ slug }: { slug: string }) {
  const docs = listDocs();
  const doc = getDoc(slug);
  if (!doc) notFound();

  const idx = docs.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? docs[idx - 1] : undefined;
  const next = idx < docs.length - 1 ? docs[idx + 1] : undefined;
  const hrefOf = (s: string) => (s === "introduction" ? "/docs" : `/docs/${s}`);

  return (
    <DocsShell
      docs={docs}
      activeSlug={slug}
      toc={doc.headings.map((h) => ({ id: h.id, text: h.text }))}
    >
      <DocArticle
        html={doc.html}
        showNotice={slug === "introduction" || slug === "engine-demo"}
        prev={prev ? { href: hrefOf(prev.slug), label: prev.title } : undefined}
        next={next ? { href: hrefOf(next.slug), label: next.title } : undefined}
      />
      {doc.demo && (
        <div className="mt-8">
          <EngineDemo />
        </div>
      )}
    </DocsShell>
  );
}
