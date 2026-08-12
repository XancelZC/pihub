import type { Metadata } from "next";
import { getData } from "@/lib/data";
import PluginExplorer from "@/components/PluginExplorer";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "插件库 · PiHub",
  description: "浏览全部 pi 插件，支持搜索、分类、类型筛选与排序",
};

export default function ExplorePage() {
  const data = getData();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accentSoft text-accent">
          <Icon name="Search" className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-ink">插件库</h1>
          <p className="text-sm text-inkSoft">{data.count} 个插件，按需求自由筛选</p>
        </div>
      </div>
      <PluginExplorer />
    </div>
  );
}
