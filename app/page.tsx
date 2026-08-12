import type { Metadata } from "next";
import { getData, getFeaturedPlugins, getRecentPlugins } from "@/lib/data";
import { CATEGORIES } from "@/lib/types";
import PluginCard from "@/components/PluginCard";
import CategoryCard from "@/components/CategoryCard";
import Icon from "@/components/Icon";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PiHub · Pi 插件集市",
  description: "收集与整理 pi coding agent 的扩展、技能、主题与提示词",
};

export default function HomePage() {
  const data = getData();
  const featured = getFeaturedPlugins(6);
  const recent = getRecentPlugins(6);

  return (
    <div className="space-y-16">
      {/* ============ HERO: 新用户第一步 ============ */}
      <section className="relative overflow-hidden rounded-xl2 border border-line bg-surface px-6 py-12 sm:px-12">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 inline-block rounded-full border border-accentLine bg-accentSoft px-3 py-1 text-xs font-medium text-accent">
            {data.count} 个插件 · 每日更新
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-ink">
            为你的 pi 找到趁手的扩展
          </h1>
          <p className="mt-4 text-base leading-relaxed text-inkSoft">
            扩展 · 技能 · 主题 · 提示词，一站式收录 pi coding agent 生态。
            先选需求，再搜插件，一键复制安装。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/setup"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-accentDeep"
            >
              <Icon name="Wand" className="mr-1.5 inline h-4 w-4" /> 新手配置向导
            </Link>
            <a
              href="#explore"
              className="rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              直接浏览插件 <Icon name="ArrowRight" className="ml-1 inline h-4 w-4" />
            </a>
            <Link
              href="/how-to-install"
              className="rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              安装指南
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: "Wand", t: "选需求", d: "向导按场景勾选，帮你搭配好插件" },
              { icon: "Search", t: "找插件", d: "搜索 / 分类 / 类型筛选，找到合适的" },
              { icon: "Copy", t: "一键装", d: "复制安装命令，粘贴到 pi 即装即用" },
            ].map((s) => (
              <div key={s.t} className="rounded-xl border border-line bg-canvas/60 p-3">
                <Icon name={s.icon} className="h-4 w-4 text-accent" />
                <p className="mt-1.5 text-sm font-semibold text-ink">{s.t}</p>
                <p className="text-xs text-inkMute">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
        {/* 装饰：右上角柔和色块（低饱和，去 AI 味） */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accentSoft blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-[#f3e2d8] blur-3xl" />
      </section>

      {/* ============ 分类 ============ */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <Icon name="Grid" className="h-5 w-5 text-accent" /> 按分类探索
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const count = data.plugins.filter((p) => p.categories.includes(c.id)).length;
            return (
              <CategoryCard
                key={c.id}
                categoryId={c.id}
                icon={c.icon}
                name={c.name}
                blurb={c.blurb}
                count={count}
              />
            );
          })}
        </div>
      </section>

      {/* ============ 高 Star 推荐 ============ */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <Icon name="Sparkles" className="h-5 w-5 text-sunkissed" /> 高 Star 推荐
          </h2>
          <Link href="/explore" className="text-sm text-accent hover:underline">
            查看全部 <Icon name="ArrowRight" className="ml-1 inline h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PluginCard key={p.id} plugin={p} />
          ))}
        </div>
      </section>

      {/* ============ 最近发布 ============ */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <Icon name="Clock" className="h-5 w-5 text-terracotta" /> 最近发布
          </h2>
          <Link href="/explore?sort=recent" className="text-sm text-accent hover:underline">
            查看全部 <Icon name="ArrowRight" className="ml-1 inline h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((p) => (
            <PluginCard key={p.id} plugin={p} />
          ))}
        </div>
      </section>

      {/* ============ 全部插件（浏览入口） ============ */}
      <section className="rounded-xl2 border border-line bg-surface p-6 text-center">
        <h2 className="text-lg font-bold text-ink">想自己搜？</h2>
        <p className="mt-1 text-sm text-inkSoft">
          2500+ 插件，按分类、类型、关键词、排序自由筛选
        </p>
        <Link
          href="/explore"
          className="mt-4 inline-block rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-accentDeep"
        >
          进入插件库 <Icon name="ArrowRight" className="ml-1 inline h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
