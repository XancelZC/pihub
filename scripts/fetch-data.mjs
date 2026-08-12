/**
 * Fetch pi plugins from npm registry + GitHub and write data/plugins.json.
 * Runs locally or in GitHub Actions on a schedule.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "plugins.json");

const NPM_SEARCH_URL = (q, size = 60) =>
  `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(q)}&size=${size}`;

const slept = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "pihub-fetcher/0.1" } });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{2E80}-\u{2FFF}]+/gu;

function cleanDesc(d) {
  return (d || "")
    .replace(EMOJI_RE, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

/** Heuristic: does this package look like a real pi extension? */
function looksLikePiPackage(p) {
  const kw = (p.keywords || []).join(" ");
  const name = p.name.toLowerCase();
  const desc = (p.description || "").toLowerCase();
  const score =
    (kw.includes("pi-package") ? 3 : 0) +
    (kw.includes("pi-extension") || kw.includes("pi-coding-agent") ? 2 : 0) +
    (name.startsWith("pi-") || name.includes("/pi-") ? 1 : 0) +
    (desc.includes("pi coding agent") || desc.includes("pi extension") ? 2 : 0) +
    (desc.includes("pi ") || desc.includes(" pi") ? 1 : 0);
  return score >= 4;
}

function categorize(name, desc, kw) {
  const s = `${name} ${desc} ${kw}`.toLowerCase();
  const cats = [];
  if (/(subagent|multi.?agent|delegat|agentic|plan.*mode|orchestrat)/.test(s)) cats.push("subagents");
  if (/(memor|context|session|compact|search)/.test(s)) cats.push("memory");
  if (/(mcp|model context protocol)/.test(s)) cats.push("mcp");
  if (/(web|search|fetch|scrap|url|browser|rss)/.test(s)) cats.push("web");
  if (/(footer|status|theme|ui|render|tui|powerline)/.test(s)) cats.push("ui");
  if (/(lsp|lint|format|type.?check|review|language server)/.test(s)) cats.push("code");
  if (/(permission|sandbox|secur|secret|guard|protect)/.test(s)) cats.push("security");
  if (/(plan|todo|task|goal|workflow|spec)/.test(s)) cats.push("plan");
  if (/(shell|terminal|bash|background|process)/.test(s)) cats.push("terminal");
  if (/(voice|speech|dictat|stt)/.test(s)) cats.push("voice");
  return [...new Set(cats)];
}

function typeOf(name, kw) {
  const s = `${name} ${kw}`.toLowerCase();
  if (s.includes("theme")) return "theme";
  if (s.includes("prompt")) return "prompt";
  if (s.includes("config") || s.includes("setup")) return "config";
  if (s.includes("skill")) return "skill";
  return "extension";
}

function installCommandFor(pkg) {
  const repo = pkg.links?.repository || "";
  const clean = repo.replace(/^git\+/, "").replace(/\.git$/, "");
  if (/github\.com/.test(clean)) {
    const m = clean.match(/github\.com[/:]([\w.-]+\/[\w.-]+)/);
    if (m) return `pi install git:${m[1]}`;
  }
  return `pi install npm:${pkg.name}`;
}

async function main() {
  const seen = new Map(); // name -> plugin
  const queries = [
    "keywords:pi-package",
    "keywords:pi-extension",
    "pi coding agent extension",
  ];

  for (const q of queries) {
    try {
      const data = await fetchJson(NPM_SEARCH_URL(q, 100));
      for (const o of data.objects || []) {
        const p = o.package;
        if (!looksLikePiPackage(p)) continue;
        const id = p.name;
        if (seen.has(id)) continue;
        const categories = categorize(p.name, p.description || "", (p.keywords || []).join(" "));
        seen.set(id, {
          id,
          name: p.name,
          description: cleanDesc(p.description),
          type: typeOf(p.name, (p.keywords || []).join(" ")),
          source: p.name,
          sourceKind: "npm",
          installCommand: installCommandFor(p),
          categories: categories.length ? categories : ["other"],
          author: p.publisher?.username || p.author?.name,
          homepage: p.links?.homepage,
          repository: (p.links?.repository || "").replace(/^git\+/, ""),
          updatedAt: (p.date || "").slice(0, 10),
          keywords: p.keywords || [],
          downloads: p.downloads?.monthly,
          verified: true,
        });
      }
      console.log(`[npm] ${q}: ${data.objects?.length ?? 0} fetched, total unique ${seen.size}`);
    } catch (e) {
      console.warn(`[npm] query failed: ${q}: ${e.message}`);
    }
    await slept(300);
  }

  // GitHub: enrich with stars + find repos not on npm
  try {
    const gh = await fetchJson(
      `https://api.github.com/search/repositories?q=pi-coding-agent+extension&sort=stars&per_page=30`,
    );
    for (const r of gh.items || []) {
      const existing = [...seen.values()].find(
        (pl) => pl.repository && pl.repository.includes(r.full_name),
      );
      if (existing) {
        existing.stars = r.stargazers_count;
        existing.updatedAt = (r.updated_at || "").slice(0, 10);
        continue;
      }
      const id = `github:${r.full_name}`;
      seen.set(id, {
        id,
        name: r.full_name,
        description: cleanDesc(r.description),
        type: "extension",
        source: r.full_name,
        sourceKind: "github",
        installCommand: `pi install git:${r.full_name}`,
        categories: categorize(r.full_name, r.description || "", (r.topics || []).join(" ")).length
          ? categorize(r.full_name, r.description || "", (r.topics || []).join(" "))
          : ["other"],
        author: r.owner?.login,
        homepage: r.homepage || r.html_url,
        repository: r.html_url,
        stars: r.stargazers_count,
        updatedAt: (r.updated_at || "").slice(0, 10),
        keywords: r.topics || [],
        verified: true,
      });
    }
    console.log(`[github] enriched, total ${seen.size}`);
  } catch (e) {
    console.warn(`[github] failed: ${e.message}`);
  }

  // Sort: stars desc (undefined = 0), then name
  const plugins = [...seen.values()].sort(
    (a, b) => (b.stars || 0) - (a.stars || 0) || a.name.localeCompare(b.name),
  );

  const dataFile = {
    generatedAt: new Date().toISOString(),
    count: plugins.length,
    plugins,
  };

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(dataFile, null, 2));
  console.log(`\nWrote ${plugins.length} plugins → data/plugins.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
