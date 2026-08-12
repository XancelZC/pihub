export interface Plugin {
  id: string;
  name: string;
  /** Short one-liner, ideally ≤ 100 chars */
  description: string;
  /** extension | skill | theme | prompt | config | unknown */
  type: string;
  /** Where it lives: npm package name or github full name */
  source: string;
  sourceKind: "npm" | "github";
  /** install command users copy: pi install npm:xxx / pi install git:github.com/... */
  installCommand: string;
  categories: string[];
  /** author display name */
  author?: string;
  homepage?: string;
  repository?: string;
  /** GitHub stars (npm search returns search score, not stars — enriched when possible) */
  stars?: number;
  /** last publish / update date YYYY-MM-DD */
  updatedAt?: string;
  /** keywords from registry / github topics */
  keywords?: string[];
  /** npm weekly downloads */
  downloads?: number;
  /** primary type + any secondary types (extension skill, extension theme, …) */
  types?: string[];
  /** latest version */
  version?: string;
  /** license */
  license?: string;
  /** rendered README text (capped) */
  readme?: string;
  /** verified metadata (has real repo, not just keyword noise) */
  verified: boolean;
}

export type Category = {
  id: string;
  name: string;
  /** lucide-react icon name (PascalCase) for this category */
  icon: string;
  blurb: string;
};

export const CATEGORY_ICONS: Record<string, string> = {
  subagents: "Network",
  memory: "Brain",
  mcp: "Plug",
  web: "Globe",
  ui: "Palette",
  code: "Puzzle",
  security: "Shield",
  plan: "ClipboardList",
  terminal: "Terminal",
  voice: "Mic",
  other: "Package",
};

export function getCategoryIcon(id: string): string {
  return CATEGORY_ICONS[id] ?? "Package";
}

export interface DataFile {
  generatedAt: string;
  count: number;
  categories: Category[];
  plugins: Plugin[];
}

export function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}


export const CATEGORIES: Category[] = [
  { id: "subagents", name: "子代理 / 多代理", icon: "Network", blurb: "让 pi 同时跑多个角色、并行处理" },
  { id: "memory", name: "记忆 / 会话", icon: "Brain", blurb: "跨会话记忆、上下文压缩、会话搜索" },
  { id: "mcp", name: "MCP 集成", icon: "Plug", blurb: "接入 MCP 服务器与外部工具" },
  { id: "web", name: "网络 / 搜索", icon: "Globe", blurb: "网页搜索、内容抓取、链接阅读" },
  { id: "ui", name: "界面 / 主题", icon: "Palette", blurb: "状态栏、主题、渲染增强" },
  { id: "code", name: "代码 / LSP", icon: "Puzzle", blurb: "LSP、lint、格式化、代码反馈" },
  { id: "security", name: "安全 / 权限", icon: "Shield", blurb: "权限控制、沙箱、密钥保护" },
  { id: "plan", name: "计划 / 流程", icon: "ClipboardList", blurb: "计划模式、任务编排、工作流" },
  { id: "terminal", name: "终端 / Shell", icon: "Terminal", blurb: "交互式 shell、后台任务" },
  { id: "voice", name: "语音 / 输入", icon: "Mic", blurb: "语音输入、听写" },
  { id: "other", name: "其他", icon: "Package", blurb: "未能归类的插件" },
];
