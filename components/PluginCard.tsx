import Link from "next/link";
import type { Plugin } from "@/lib/types";
import { getCategoryName, getCategoryIcon } from "@/lib/types";
import Icon from "./Icon";
import { formatCount, typeColor, typeLabel, typeBadges, pluginSlug } from "@/lib/format";

export default function PluginCard({ plugin }: { plugin: Plugin }) {
  const href = `/p/${pluginSlug(plugin.id)}`;
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accentLine hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink group-hover:text-accent">
            {plugin.name}
          </h3>
          {plugin.author && (
            <p className="mt-0.5 text-xs text-inkMute">by {plugin.author}</p>
          )}
        </div>
        {plugin.downloads ? (
          <span className="shrink-0 rounded-full bg-accentSoft px-2 py-0.5 text-xs font-medium text-accent">
            <Icon name="Download" className="mr-1 inline h-3 w-3" /> {formatCount(plugin.downloads)}/月
          </span>
        ) : plugin.stars ? (
          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-sunkissed">
            <Icon name="Star" className="mr-1 inline h-3 w-3" /> {formatCount(plugin.stars)}
          </span>
        ) : null}
        {plugin.downloads && plugin.stars ? null : null}
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-inkSoft">
        {plugin.description || "暂无描述"}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {typeBadges(plugin).map((t) => (
          <span
            key={t}
            className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ${typeColor(t)}`}
          >
            {typeLabel(t)}
          </span>
        ))}
        {plugin.categories.slice(0, 2).map((c) => (
          <span
            key={c}
            className="rounded-md bg-canvas px-1.5 py-0.5 text-[11px] text-inkSoft ring-1 ring-slate-200"
          >
            <Icon name={getCategoryIcon(c)} className="mr-1 inline h-3 w-3" /> {getCategoryName(c)}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-canvas px-3 py-2 font-mono text-[11px] text-inkSoft ring-1 ring-slate-100 group-hover:text-accent">
        {plugin.installCommand}
      </div>
    </Link>
  );
}
