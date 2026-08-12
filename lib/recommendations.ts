import fs from "node:fs";
import path from "node:path";

export interface RecItem {
  id: string;
  why: string;
}

export interface RecCategory {
  id: string;
  name: string;
  icon: string;
  desc: string;
  items: RecItem[];
}

export interface Recommendations {
  categories: RecCategory[];
}

const recPath = path.join(process.cwd(), "data", "recommendations.json");

let cached: Recommendations | undefined;

export function getRecommendations(): Recommendations {
  if (cached) return cached;
  const raw = fs.readFileSync(recPath, "utf-8");
  cached = JSON.parse(raw) as Recommendations;
  return cached;
}
