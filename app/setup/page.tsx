import type { Metadata } from "next";
import { getRecommendations } from "@/lib/recommendations";
import { getData } from "@/lib/data";
import RecommendWizard from "@/components/RecommendWizard";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "新手配置向导 · PiHub",
  description: "不知道装什么？按需求勾选，一键生成安装清单，快速获得好用的 pi 体验",
};

export default function SetupPage() {
  const recs = getRecommendations();
  const data = getData();
  const byName = new Map(data.plugins.map((p) => [p.name, p]));
  // 只传推荐清单涉及的插件，避免全量数据 SSR 内联
  const recIds = new Set<string>();
  for (const c of recs.categories) for (const it of c.items) recIds.add(it.id);
  const plugins = data.plugins.filter((p) => recIds.has(p.name));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white">
            <Icon name="Wand" className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">新手配置向导</h1>
            <p className="text-sm text-inkSoft">不知道装什么？按你的需求勾选，一键生成安装清单</p>
          </div>
        </div>
      </div>

      <RecommendWizard categories={recs.categories} plugins={plugins} />
    </div>
  );
}
