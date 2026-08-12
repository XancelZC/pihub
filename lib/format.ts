import type { Plugin } from "@/lib/types";

export function formatCount(n?: number): string {
  if (!n) return "";
  if (n < 1000) return String(n);
  if (n < 1000000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1000000).toFixed(1)}M`;
}

export function typeLabel(type: string): string {
  const map: Record<string, string> = {
    extension: "扩展",
    skill: "技能",
    theme: "主题",
    prompt: "提示词",
    config: "配置",
    unknown: "未知",
  };
  return map[type] ?? type;
}

/** A plugin may be e.g. "extension skill" — badge shows all its types. */
export function typeBadges(plugin: Plugin): string[] {
  const raw: string[] = plugin.types && plugin.types.length ? plugin.types : [plugin.type];
  return [...new Set(raw)].filter(Boolean);
}

export function typeColor(type: string): string {
  const map: Record<string, string> = {
    extension: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    skill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    theme: "bg-pink-50 text-pink-700 ring-pink-200",
    prompt: "bg-amber-50 text-amber-700 ring-amber-200",
    config: "bg-slate-100 text-slate-600 ring-slate-200",
    unknown: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return map[type] ?? map.unknown;
}

export function installDisplay(plugin: Plugin): string {
  return plugin.installCommand;
}

/**
 * Slug encoding for plugin detail routes.
 * Plugin ids contain "/" and "@" (e.g. github:owner/repo) which cannot be a
 * single URL segment, so we encode with base64url (only A-Za-z0-9_-).
 * Works in both Node (build) and browser (client links).
 */
export function pluginSlug(id: string): string {
  return btoa(unescape(encodeURIComponent(id)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function pluginFromSlug(slug: string): string {
  const b64 = slug.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return decodeURIComponent(escape(atob(padded)));
}
