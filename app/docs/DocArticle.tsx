"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Notice } from "@/components/ui";

export default function DocArticle({
  html,
  showNotice,
  prev,
  next,
}: {
  html: string;
  showNotice?: boolean;
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  useEffect(() => {
    // Copy buttons on code blocks.
    const handler = async (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("[data-copy]");
      if (!btn) return;
      const pre = btn.parentElement?.querySelector("pre code");
      const text = pre?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 1500);
      } catch {
        btn.textContent = "Failed";
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <article>
      {showNotice && (
        <div className="mb-5">
          <Notice tone="warn">
            <strong>Concept stage, simulation only.</strong> No contracts are deployed, equal
            valuation and selling are open design questions, burns do not guarantee price
            appreciation, and a shared pool does not automatically give equal valuations.
          </Notice>
        </div>
      )}
      <div className="doc-body" dangerouslySetInnerHTML={{ __html: html }} />
      <nav className="mt-10 flex items-center justify-between gap-3 border-t pt-6" style={{ borderColor: "var(--line)" }} aria-label="Page navigation">
        <div>
          {prev && (
            <Link href={prev.href} className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>
              ← {prev.label}
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link href={next.href} className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>
              {next.label} →
            </Link>
          )}
        </div>
      </nav>
      <style jsx global>{`
        .doc-body {
          color: var(--text-2);
          font-size: 15px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }
        .doc-body h1 {
          color: var(--text);
          font-family: var(--font-space-grotesk), Inter, sans-serif;
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin: 0 0 16px;
        }
        .doc-body h2 {
          color: var(--text);
          font-family: var(--font-space-grotesk), Inter, sans-serif;
          font-size: 21px;
          font-weight: 650;
          margin: 32px 0 10px;
          scroll-margin-top: 140px;
        }
        .doc-body h3 {
          color: var(--text);
          font-size: 17px;
          font-weight: 650;
          margin: 24px 0 8px;
          scroll-margin-top: 140px;
        }
        .doc-body p { margin: 0 0 14px; }
        .doc-body ul, .doc-body ol { margin: 0 0 14px; padding-left: 22px; }
        .doc-body li { margin-bottom: 6px; }
        .doc-body li::marker { color: var(--text-3); }
        .doc-body a { color: var(--text); text-decoration: underline; text-underline-offset: 3px; }
        .doc-body strong { color: var(--text); }
        .doc-body code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.86em;
          background: var(--surface-2);
          border: 1px solid var(--line);
          border-radius: 5px;
          padding: 1px 5px;
          color: var(--text);
        }
        .doc-body .codeblock { position: relative; margin: 0 0 16px; }
        .doc-body .codeblock pre {
          background: var(--bg-2);
          border: 1px solid var(--line-2);
          border-radius: 8px;
          padding: 14px;
          overflow-x: auto;
          margin: 0;
        }
        .doc-body .codeblock pre code { background: none; border: 0; padding: 0; }
        .doc-body .copybtn {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid var(--line-2);
          background: var(--surface);
          color: var(--text-2);
          border-radius: 6px;
          padding: 4px 10px;
          cursor: pointer;
        }
        .doc-body .tablewrap { overflow-x: auto; margin: 0 0 16px; border: 1px solid var(--line); border-radius: 8px; }
        .doc-body table { width: 100%; border-collapse: collapse; font-size: 13.5px; font-variant-numeric: tabular-nums; }
        .doc-body th { text-align: left; font-weight: 600; color: var(--text-3); font-size: 12px; padding: 10px 12px; border-bottom: 1px solid var(--line); white-space: nowrap; }
        .doc-body td { padding: 10px 12px; border-bottom: 1px solid var(--line); vertical-align: top; }
        .doc-body tr:last-child td { border-bottom: 0; }
        .doc-body h1 { scroll-margin-top: 140px; }
      `}</style>
    </article>
  );
}
