import fs from "fs";
import path from "path";

export interface DocMeta {
  slug: string;
  title: string;
  group: string;
  demo?: boolean;
}

export interface DocPage extends DocMeta {
  headings: { id: string; text: string; level: number }[];
  html: string;
}

export const DOC_GROUPS = ["Getting started", "Using poof.fun", "Mechanism", "Project"] as const;

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Minimal inline markdown: links, bold, code, tables handled at block level. */
function inline(md: string): string {
  let out = escapeHtml(md);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

function renderMarkdown(src: string): { html: string; headings: DocPage["headings"] } {
  const lines = src.split("\n");
  const headings: DocPage["headings"] = [];
  let html = "";
  let i = 0;
  let inCode = false;
  let codeLang = "";
  let codeBuf: string[] = [];
  let paraBuf: string[] = [];

  function flushPara() {
    if (paraBuf.length === 0) return;
    html += `<p>${inline(paraBuf.join(" "))}</p>\n`;
    paraBuf = [];
  }

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (!inCode) {
        flushPara();
        inCode = true;
        codeLang = line.slice(3).trim();
        codeBuf = [];
      } else {
        inCode = false;
        const code = escapeHtml(codeBuf.join("\n"));
        html += `<div class="codeblock"><button class="copybtn" data-copy aria-label="Copy code">Copy</button><pre><code class="language-${escapeHtml(codeLang)}">${code}</code></pre></div>\n`;
        codeBuf = [];
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushPara();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text.replace(/[*`[\]()]/g, ""));
      if (level >= 2) headings.push({ id, text: text.replace(/[*`]/g, ""), level });
      html += `<h${level} id="${id}">${inline(text)}</h${level}>\n`;
      i++;
      continue;
    }
    // table
    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\|[\s:\-|]+\|$/.test(lines[i + 1].trim())) {
      flushPara();
      const headerCells = line.trim().slice(1, -1).split("|").map((c) => c.trim());
      html += `<div class="tablewrap"><table><thead><tr>${headerCells.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>`;
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().slice(1, -1).split("|").map((c) => c.trim());
        html += `<tr>${cells.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`;
        i++;
      }
      html += `</tbody></table></div>\n`;
      continue;
    }
    if (/^\s*-\s+/.test(line)) {
      flushPara();
      html += "<ul>\n";
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        const item = lines[i].replace(/^\s*-\s+/, "");
        // continuation lines (indented, non-bullet) belong to this item
        let j = i + 1;
        let extra: string[] = [];
        while (j < lines.length && /^( {2,}|\t)/.test(lines[j]) && !/^\s*-\s+/.test(lines[j]) && lines[j].trim() !== "") {
          extra.push(lines[j].trim());
          j++;
        }
        html += `<li>${inline(([item, ...extra].join(" ")))}</li>\n`;
        i = j;
      }
      html += "</ul>\n";
      continue;
    }
    if (/^\d+\.\s+/.test(line.trim())) {
      flushPara();
      html += "<ol>\n";
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const item = lines[i].trim().replace(/^\d+\.\s+/, "");
        html += `<li>${inline(item)}</li>\n`;
        i++;
      }
      html += "</ol>\n";
      continue;
    }
    if (line.trim() === "") {
      flushPara();
      i++;
      continue;
    }
    paraBuf.push(line.trim());
    i++;
  }
  flushPara();
  return { html, headings };
}

function parseFrontmatter(raw: string): { meta: Omit<DocMeta, "slug">; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: { title: "Untitled", group: "Project" }, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
  }
  return {
    meta: {
      title: meta.title ?? "Untitled",
      group: meta.group ?? "Project",
      demo: meta.demo === "true",
    },
    body: m[2],
  };
}

export function listDocs(): DocMeta[] {
  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
  const docs = files.map((f) => {
    const raw = fs.readFileSync(path.join(DOCS_DIR, f), "utf8");
    const { meta } = parseFrontmatter(raw);
    return { slug: f.replace(/\.md$/, ""), ...meta };
  });
  const order = (slug: string) => {
    const idx = DOC_ORDER.indexOf(slug);
    return idx === -1 ? 999 : idx;
  };
  return docs.sort((a, b) => order(a.slug) - order(b.slug));
}

/** Canonical sidebar order. */
const DOC_ORDER = [
  "introduction",
  "problem-single-token",
  "what-is-poof-fun",
  "how-a-buy-works",
  "creator-launch-guide",
  "trader-guide",
  "selling",
  "three-fee-identities",
  "shared-liquidity",
  "equal-valuation",
  "fees-and-revenue",
  "engine-demo",
  "roadmap",
  "open-questions",
  "risks-and-security",
  "faq",
  "glossary",
];

export function getDoc(slug: string): DocPage | undefined {
  const full = path.join(DOCS_DIR, `${slug}.md`);
  if (!fs.existsSync(full)) return undefined;
  const raw = fs.readFileSync(full, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const { html, headings } = renderMarkdown(body);
  return { slug, ...meta, html, headings };
}
