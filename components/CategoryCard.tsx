"use client";

/**
 * Category cards on the homepage. Clicking scrolls to the explorer and
 * activates the matching category chip. Communicates via a tiny custom event
 * that PluginExplorer listens for.
 */
import Icon from "./Icon";

export default function CategoryCard({
  categoryId,
  icon,
  name,
  blurb,
  count,
}: {
  categoryId: string;
  icon: string;
  name: string;
  blurb: string;
  count: number;
}) {
  return (
    <button
      onClick={() => {
        document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
        window.dispatchEvent(
          new CustomEvent("pihub:select-category", { detail: categoryId }),
        );
      }}
      className="group rounded-2xl border border-line bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:border-accentLine hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accentSoft text-accent">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <span className="text-xs font-semibold text-accent">{count}</span>
      </div>
      <p className="mt-3 font-semibold text-ink">{name}</p>
      <p className="mt-1 line-clamp-2 text-xs text-inkMute">{blurb}</p>
    </button>
  );
}
