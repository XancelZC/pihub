import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPluginById, getData } from "@/lib/data";
import { getCategoryName, getCategoryIcon } from "@/lib/types";
import CopyBlock from "@/components/CopyBlock";
import Icon from "@/components/Icon";
import Readme from "@/components/Readme";
import BackButton from "@/components/BackButton";
import { formatCount, typeColor, typeLabel, pluginSlug, pluginFromSlug } from "@/lib/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const plugin = getPluginById(pluginFromSlug(slug));
  if (!plugin) return { title: "未找到 · PiHub" };
  return { title: `${plugin.name} · PiHub`, description: plugin.description };
}

export function generateStaticParams() {
  return getData().plugins.map((p) => ({ slug: pluginSlug(p.id) }));
}

export default async function PluginPage({ params }: Props) {
  const { slug } = await params;
  const plugin = getPluginById(pluginFromSlug(slug));
  if (!plugin) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <BackButton />

      <div className="mt-6 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink">{plugin.name}</h1>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${typeColor(plugin.type)}`}>
                {typeLabel(plugin.type)}
              </span>
            </div>
            <p className="mt-1 text-sm text-inkMute">
              {plugin.author ? `by ${plugin.author}` : "作者未知"}
              {plugin.updatedAt ? ` · 更新于 ${plugin.updatedAt}` : ""}
            </p>
          </div>
          <div className="flex gap-4 text-center">
            {plugin.downloads !== undefined && plugin.downloads > 0 && (
              <div>
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-accent"><Icon name="Download" className="h-5 w-5" /> {formatCount(plugin.downloads)}</div>
                <div className="text-xs text-inkMute">月下载</div>
              </div>
            )}
            {plugin.stars !== undefined && plugin.stars > 0 && (
              <div>
                <div className="flex items-center justify-center gap-1 text-xl font-bold text-sunkissed"><Icon name="Star" className="h-5 w-5" /> {formatCount(plugin.stars)}</div>
                <div className="text-xs text-inkMute">GitHub Stars</div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-base leading-relaxed text-ink">
          {plugin.description || "暂无描述"}
        </p>

        {(plugin.version || plugin.license || plugin.downloads) && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {plugin.version && (
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-xs text-inkMute">版本</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-ink">v{plugin.version}</p>
              </div>
            )}
            {plugin.license && (
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-xs text-inkMute">License</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-ink">{plugin.license}</p>
              </div>
            )}
            {plugin.downloads !== undefined && plugin.downloads > 0 && (
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-xs text-inkMute">月下载</p>
                <p className="mt-0.5 text-sm font-semibold text-ink">{formatCount(plugin.downloads)}</p>
              </div>
            )}
            {plugin.updatedAt && (
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-xs text-inkMute">更新</p>
                <p className="mt-0.5 text-sm font-semibold text-ink">{plugin.updatedAt}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {plugin.categories.map((c) => (
            <span
              key={c}
              className="rounded-md bg-canvas px-2 py-1 text-xs text-inkSoft ring-1 ring-slate-200"
            >
              <Icon name={getCategoryIcon(c)} className="mr-1 inline h-3 w-3" /> {getCategoryName(c)}
            </span>
          ))}
          {(plugin.keywords || []).slice(0, 8).map((k) => (
            <span key={k} className="rounded-md bg-accentSoft px-2 py-1 text-xs text-accent">
              #{k}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-accentLine bg-accentSoft/50 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon name="Wrench" className="h-4 w-4 text-accent" /> 安装到你的 pi
          </h2>
          <div className="mt-3 space-y-2 text-sm text-inkSoft">
            <p><span className="mr-2 font-bold text-accent">1</span>打开 pi 终端（在你想用这个插件的项目目录里）</p>
            <p><span className="mr-2 font-bold text-accent">2</span>粘贴执行下面命令，回车即可</p>
            <p><span className="mr-2 font-bold text-accent">3</span>重启 pi 或输入 <code className="rounded bg-canvas px-1">/reload</code> 生效</p>
          </div>
          <div className="mt-3">
            <CopyBlock text={plugin.installCommand} />
          </div>
          <p className="mt-2 text-xs text-inkMute">
            想在当前项目内使用？命令后加 <code className="rounded bg-canvas px-1">-l</code>（<code className="rounded bg-canvas px-1">pi install -l {plugin.installCommand.replace("pi install ", "")}</code>），只对该项目生效。
          </p>
        </div>

        {plugin.readme && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-inkSoft">README</h2>
            <div className="mt-2 max-h-96 overflow-auto rounded-2xl border border-line bg-canvas p-5 text-sm leading-relaxed text-inkSoft">
              <Readme content={plugin.readme} />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {plugin.repository && (
            <a
              href={plugin.repository}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-term px-4 py-2 text-sm font-medium text-white transition hover:bg-inkSoft"
            >
              <Icon name="Folder" className="h-4 w-4" /> 查看源码
            </a>
          )}
          {plugin.sourceKind === "npm" && (
            <a
              href={`https://www.npmjs.com/package/${plugin.name}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-sm text-inkSoft transition hover:border-line"
            >
              <Icon name="Boxes" className="h-4 w-4" /> npm 页面
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <Icon name="AlertTriangle" className="mr-1.5 inline h-4 w-4" /> 第三方插件拥有完整系统权限，安装前请自行审查源码。本站仅做收录，不对插件安全性负责。
      </div>
    </div>
  );
}

