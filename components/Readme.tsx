import { useMemo } from "react";

/**
 * Renders README plain-text into simple HTML with basic structure:
 * - "#/##/###" headings
 * - ``` code blocks
 * - `inline code`
 * - "- " list items
 * - [text](url) links (rendered as text + url)
 * - blank-line separated paragraphs
 */
export default function Readme({ content }: { content: string }) {
  const html = useMemo(() => renderReadme(content), [content]);
  return (
    <div
      className="readme prose-sm max-w-none text-ink"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  // [text](url) -> text (url)
  let out = s.replace(/\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (_m, t, u) => {
    return `<a class="text-accent underline" href="${esc(u)}" target="_blank" rel="noreferrer">${esc(t)}</a>`;
  });
  out = out.replace(/`([^`]+)`/g, (_m, c) => `<code class="rounded bg-canvas px-1 py-0.5 font-mono text-[0.85em]">${esc(c)}</code>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

function renderReadme(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let i = 0;
  let inCode = false;
  let codeBuf: string[] = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (!inCode) {
        flushList();
        inCode = true;
        codeBuf = [];
      } else {
        out.push(`<pre class="overflow-x-auto rounded-lg bg-term p-3 font-mono text-xs text-emerald-200">${esc(codeBuf.join("\n"))}</pre>`);
        inCode = false;
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }

    // heading
    const h = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushList();
      const level = h[1].length;
      const size = level === 1 ? "text-lg font-bold" : level === 2 ? "text-base font-semibold" : "text-sm font-semibold";
      out.push(`<h${Math.min(level + 1, 4)} class="mt-4 mb-1 ${size} text-ink">${inline(h[2])}</h${Math.min(level + 1, 4)}>`);
      i++;
      continue;
    }

    // list item
    const li = trimmed.match(/^[-*•]\s+(.*)$/);
    if (li) {
      if (!inList) {
        out.push("<ul class=\"my-2 list-disc space-y-1 pl-5\">");
        inList = true;
      }
      out.push(`<li>${inline(li[1])}</li>`);
      i++;
      continue;
    }

    // ordered list
    const oli = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (oli) {
      if (!inList) {
        out.push("<ol class=\"my-2 list-decimal space-y-1 pl-5\">");
        inList = true;
      }
      out.push(`<li>${inline(oli[1])}</li>`);
      i++;
      continue;
    }

    // blank line
    if (!trimmed) {
      flushList();
      i++;
      continue;
    }

    flushList();
    out.push(`<p class="my-2">${inline(trimmed)}</p>`);
    i++;
  }
  flushList();
  if (inCode) {
    out.push(`<pre class="overflow-x-auto rounded-lg bg-term p-3 font-mono text-xs text-emerald-200">${esc(codeBuf.join("\n"))}</pre>`);
  }
  return out.join("\n");
}
