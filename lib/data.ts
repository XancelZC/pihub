import fs from "node:fs";
import path from "node:path";
import type { DataFile, Plugin } from "./types";

const dataPath = path.join(process.cwd(), "data", "plugins.json");
const zhPath = path.join(process.cwd(), "data", "zh-overrides.json");

let cachedData: DataFile | undefined;
let cachedZh: Record<string, string> | undefined;

export function getData(): DataFile {
  if (cachedData) return cachedData;
  const raw = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw) as DataFile;
  // overlay Chinese descriptions
  try {
    const zh = cachedZh ?? JSON.parse(fs.readFileSync(zhPath, "utf-8"));
    cachedZh = zh;
    for (const p of data.plugins) {
      const t = zh[p.id];
      if (t) p.description = t;
    }
  } catch {
    /* zh overlay optional */
  }
  cachedData = data;
  return data;
}

export function getPluginById(id: string): Plugin | undefined {
  return getData().plugins.find((p) => p.id === id);
}

export function getFeaturedPlugins(limit = 6): Plugin[] {
  const data = getData();
  return [...data.plugins]
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(0, limit);
}

export function getRecentPlugins(limit = 6): Plugin[] {
  const data = getData();
  return [...data.plugins]
    .filter((p) => p.updatedAt)
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, limit);
}
