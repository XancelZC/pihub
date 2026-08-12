"use client";

import { useEffect, useMemo, useState } from "react";
import type { Plugin } from "@/lib/types";
import { CATEGORIES, getCategoryName, getCategoryIcon } from "@/lib/types";
import PluginCard from "./PluginCard";
import Icon from "./Icon";

const TYPE_OPTIONS = ["all", "extension", "skill", "theme", "prompt"];

interface LitePlugin {
  id: string;
  name: string;
  desc: string;
  dl: number;
  st: number;
  type: string;
  types: string[];
  cats: string[];
  up: string;
  auth: string;
}

function readParams(): { q: string; type: string; cat: string; sort: string } {
  if (typeof window === "undefined") return { q: "", type: "all", cat: "all", sort: "downloads" };
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "",
    type: p.get("type") ?? "all",
    cat: p.get("cat") ?? "all",
    sort: p.get("sort") ?? "downloads",
  };
}

export default function PluginExplorer() {
  const init = readParams();
  const [query, setQuery] = useState(init.q);
  const [type, setType] = useState(init.type);
  const [cat, setCat] = useState(init.cat);
  const [sort, setSort] = useState(init.sort);
  const [plugins, setPlugins] = useState<LitePlugin[] | null>(null);

  // 客户端异步加载精简数据（不进 SSR，首屏 HTML 大幅缩小）
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/plugins.lite.json", { cache: "no-store" });
        const j = (await res.json()) as LitePlugin[];
        setPlugins(j);
      } catch {
        setPlugins([]);
      }
    };
    void load();
  }, []);

  // Sync URL so browser back/forward preserves filter state
  useEffect(() => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (type !== "all") p.set("type", type);
    if (cat !== "all") p.set("cat", cat);
    if (sort !== "downloads") p.set("sort", sort);
    const qs = p.toString();
    window.history.replaceState({}, "", qs ? `/explore/?${qs}` : "/explore/");
  }, [query, type, cat, sort]);

  // Listen for category selection from homepage category cards
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) setCat(id);
    };
    window.addEventListener("pihub:select-category", handler);
    return () => window.removeEventListener("pihub:select-category", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!plugins) return null;
    return plugins
      .filter((p) => {
        if (cat !== "all" && !p.cats.includes(cat)) return false;
        if (type !== "all" && !p.types.includes(type)) return false;
        if (query) {
          const q = query.toLowerCase();
          const hay = `${p.name} ${p.desc} ${p.auth}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "downloads") return b.dl - a.dl;
        if (sort === "stars") return b.st - a.st;
        if (sort === "recent") return (b.up || "").localeCompare(a.up || "");
        if (sort === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [plugins, query, type, cat, sort]);

  // Lite → 完整 Plugin 供卡片渲染（仅渲染可见项）
  const visiblePlugins: Plugin[] = useMemo(() => {
    if (!filtered) return [];
    return filtered.slice(0, 60).map((l) => ({
      id: l.id,
      name: l.name,
      description: l.desc,
      type: l.type,
      types: l.types,
      source: l.id,
      sourceKind: "npm",
      installCommand: `pi install npm:${l.id}`,
      categories: l.cats,
      author: l.auth || undefined,
      downloads: l.dl || undefined,
      stars: l.st || undefined,
      updatedAt: l.up || undefined,
      verified: true,
    }));
  }, [filtered]);

  return (
    <div>
      {/* controls */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Icon
            name="Search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkMute"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索插件名称、描述、作者…"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-accentLine focus:ring-2 focus:ring-accentSoft"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Chip active={type === "all"} onClick={() => setType("all")}>
              <Icon name="Boxes" className="mr-1 inline h-3.5 w-3.5" /> 全部类型
            </Chip>
            {TYPE_OPTIONS.slice(1).map((t) => (
              <Chip key={t} active={type === t} onClick={() => setType(t)}>
                {typeLabelOf(t)}
              </Chip>
            ))}
          </div>
          <div className="ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-inkSoft outline-none focus:border-accentLine"
            >
              <option value="downloads">按下载量</option>
              <option value="stars">按 Star</option>
              <option value="recent">按更新时间</option>
              <option value="name">按名称</option>
            </select>
          </div>
        </div>
      </div>

      {/* category chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>
          <Icon name="Boxes" className="mr-1 inline h-3.5 w-3.5" /> 全部
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            <Icon name={getCategoryIcon(c.id)} className="mr-1 inline h-3.5 w-3.5" /> {c.name}
          </Chip>
        ))}
      </div>

      {plugins === null ? (
        <div className="py-16 text-center text-inkMute">加载中…</div>
      ) : filtered === null ? null : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line py-16 text-center text-inkMute">
          没有匹配的插件，换个关键词试试
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-inkSoft">
            找到 <span className="font-semibold text-ink">{filtered.length}</span> 个插件
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePlugins.map((p) => (
              <PluginCard key={p.id} plugin={p} />
            ))}
          </div>
          {filtered.length > visiblePlugins.length && (
            <div className="mt-8 rounded-xl border border-line bg-canvas py-8 text-center text-sm text-inkMute">
              已显示前 {visiblePlugins.length} 个，共 {filtered.length} 个匹配。
              用更精确的关键词或分类缩小范围，即可查看更多。
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? "bg-accent text-white shadow-card"
          : "bg-surface text-inkSoft ring-1 ring-line hover:bg-canvas"
      }`}
    >
      {children}
    </button>
  );
}

function typeLabelOf(t: string): string {
  const map: Record<string, string> = {
    extension: "扩展",
    skill: "技能",
    theme: "主题",
    prompt: "提示词",
  };
  return map[t] ?? t;
}
