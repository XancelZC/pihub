"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Plugin } from "@/lib/types";
import type { RecCategory } from "@/lib/recommendations";
import { pluginSlug } from "@/lib/format";
import { getCategoryName, getCategoryIcon } from "@/lib/types";
import Icon from "./Icon";
import CopyBlock from "./CopyBlock";

export default function RecommendWizard({
  categories,
  plugins,
}: {
  categories: RecCategory[];
  plugins: Plugin[];
}) {
  const byId = useMemo(() => {
    const m = new Map<string, Plugin>();
    for (const p of plugins) m.set(p.id, p);
    return m;
  }, [plugins]);

  // selected: categoryId -> Set<pluginId>
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleItem = (catId: string, itemId: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(prev[catId] || []);
      if (set.has(itemId)) set.delete(itemId);
      else set.add(itemId);
      next[catId] = set;
      return next;
    });
  };

  const toggleCategory = (catId: string, itemIds: string[]) => {
    setSelected((prev) => {
      const next = { ...prev };
      const cur = new Set(prev[catId] || []);
      const allSelected = itemIds.every((i) => cur.has(i));
      const set = allSelected ? new Set<string>() : new Set(itemIds);
      next[catId] = set;
      return next;
    });
  };

  const allSelected = useMemo(() => {
    const s = new Set<string>();
    for (const set of Object.values(selected)) for (const i of set) s.add(i);
    return s;
  }, [selected]);

  const totalCount = allSelected.size;

  const selectAll = () => {
    const next: Record<string, Set<string>> = {};
    for (const c of categories) next[c.id] = new Set(c.items.map((i) => i.id));
    setSelected(next);
  };
  const clearAll = () => setSelected({});

  const commands = useMemo(
    () =>
      [...allSelected].map((id) => {
        const p = byId.get(id);
        return p ? p.installCommand : `pi install npm:${id}`;
      }),
    [allSelected, byId],
  );

  return (
    <div className="space-y-10">
      {/* steps hint */}
      <div className="flex flex-wrap gap-2 text-xs text-inkSoft">
        <span className="rounded-full bg-accentSoft px-3 py-1 text-accent">① 按需勾选</span>
        <span className="rounded-full bg-accentSoft px-3 py-1 text-accent">② 预览清单</span>
        <span className="rounded-full bg-accentSoft px-3 py-1 text-accent">③ 一键复制安装</span>
      </div>

      {/* categories */}
      {categories.map((cat) => {
        const ids = cat.items.map((i) => i.id);
        const sel = selected[cat.id] || new Set();
        const allOn = ids.length > 0 && ids.every((i) => sel.has(i));
        const someOn = !allOn && ids.some((i) => sel.has(i));
        return (
          <section key={cat.id} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accentSoft text-accent">
                <Icon name={cat.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-ink">{cat.name}</h2>
                <p className="text-xs text-inkMute">{cat.desc}</p>
              </div>
              <button
                onClick={() => toggleCategory(cat.id, ids)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  allOn
                    ? "bg-success text-white"
                    : someOn
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-canvas text-inkSoft hover:bg-line"
                }`}
              >
                {allOn ? "已全选 ✓" : someOn ? "部分选中" : "全选"}
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {cat.items.map((item) => {
                const p = byId.get(item.id);
                const on = sel.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(cat.id, item.id)}
                    className={`group flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      on
                        ? "border-success bg-emerald-50/60"
                        : "border-line bg-surface hover:border-accentLine"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs ${
                        on
                          ? "border-emerald-500 bg-success text-white"
                          : "border-line bg-surface text-transparent"
                      }`}
                    >
                      <Icon name="Check" className="h-3 w-3" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-mono text-sm font-semibold text-ink">
                          {p?.name ?? item.id}
                        </span>
                        {p?.downloads ? (
                          <span className="shrink-0 text-xs text-inkMute">
                            <Icon name="Download" className="mr-0.5 inline h-3 w-3" />
                            {p.downloads > 1000 ? `${Math.round(p.downloads / 1000)}k` : p.downloads}/月
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-inkSoft">{item.why}</span>
                      {p && (
                        <span className="mt-1 block text-[11px] text-inkMute">
                          {p.description}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* result panel */}
      <section className="sticky bottom-4 max-h-[70vh] overflow-hidden rounded-2xl border border-accentLine bg-surface/95 p-5 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Boxes" className="h-4 w-4 text-accent" />
            <span>
              已选 <span className="font-bold text-accent">{totalCount}</span> 个插件
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="rounded-lg px-3 py-1.5 text-xs text-inkSoft ring-1 ring-slate-200 hover:bg-canvas"
            >
              清空
            </button>
            <button
              onClick={selectAll}
              className="rounded-lg px-3 py-1.5 text-xs text-accent ring-1 ring-accentLine hover:bg-accentSoft"
            >
              全选
            </button>
          </div>
        </div>

        {totalCount > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-inkSoft">安装清单（共 {commands.length} 条）</p>
            <div className="max-h-28 overflow-auto rounded-xl bg-term p-3">
              <code className="block select-all whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-termAccent">
                {commands.join("\n")}
              </code>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(commands.join("\n"));
                  } catch {}
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-white transition hover:bg-success"
              >
                <Icon name="Copy" className="h-3.5 w-3.5" /> 一键复制
              </button>
              <p className="text-xs text-inkMute">粘贴到 pi 终端逐行执行</p>
            </div>
          </div>
        )}

        {totalCount === 0 && (
          <p className="mt-3 text-xs text-inkMute">
            还没选？从上方勾选你需要的分类，或点击「全选」体验完整配置。
          </p>
        )}
      </section>

      {/* selected list preview - collapsible, max-height scroll */}
      {totalCount > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <button
            onClick={() => setExpanded(expanded === "list" ? null : "list")}
            className="flex w-full items-center justify-between"
          >
            <h3 className="text-sm font-semibold text-ink">已选插件详情（{totalCount}）</h3>
            <span className="flex items-center gap-1 text-xs text-inkMute">
              {expanded === "list" ? "收起" : "展开"}
              <Icon name={expanded === "list" ? "ChevronUp" : "ChevronDown"} className="h-3.5 w-3.5" />
            </span>
          </button>
          {expanded === "list" && (
            <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-auto">
              {[...allSelected].map((id) => {
                const p = byId.get(id);
                return (
                  <Link
                    key={id}
                    href={`/p/${pluginSlug(id)}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1 text-xs text-inkSoft transition hover:bg-accentSoft hover:text-accent"
                  >
                    {p?.name ?? id}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
