import type { Metadata } from "next";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "安装指南 · PiHub" };

const steps = [
  {
    title: "找到想要的插件",
    desc: "在本站浏览或搜索，插件详情页会显示对应的安装命令。",
  },
  {
    title: "在 pi 中安装",
    desc: "npm 包用 pi install npm:包名，GitHub 仓库用 pi install git:用户名/仓库名。",
    code: "pi install npm:pi-web-access",
  },
  {
    title: "安装到当前项目（可选）",
    desc: "加 -l 参数会把插件装到当前项目的 .pi/ 目录，只对该项目生效。",
    code: "pi install -l npm:pi-subagents",
  },
  {
    title: "管理插件",
    desc: "查看已装列表、更新、卸载或禁用单个资源。",
    code: "pi list\npi update --all\npi remove npm:xxx\npi config",
  },
  {
    title: "验证是否生效",
    desc: "重启 pi 或在会话中输入 /reload。启动时头部会显示加载的扩展与技能列表。",
  },
];

export default function InstallGuidePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">安装指南</h1>
      <p className="mt-2 text-sm text-inkSoft">
        pi 的扩展体系：Extensions（代码）、Skills（技能包）、Prompts（提示词模板）、Themes（主题），
        统称 pi packages，通过 <code className="rounded bg-canvas px-1">pi install</code> 统一安装。
      </p>

      <ol className="mt-8 space-y-6">
        {steps.map((s, i) => (
          <li key={i} className="relative rounded-2xl border border-line bg-surface p-5 pl-14">
            <span className="absolute left-5 top-5 grid h-7 w-7 place-items-center rounded-full bg-accent text-sm font-bold text-white">
              {i + 1}
            </span>
            <h2 className="font-semibold text-ink">{s.title}</h2>
            <p className="mt-1 text-sm text-inkSoft">{s.desc}</p>
            {s.code && (
              <pre className="mt-3 overflow-x-auto rounded-xl bg-term px-4 py-3 font-mono text-xs text-termAccent">
                {s.code}
              </pre>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <Icon name="AlertTriangle" className="mr-1.5 inline h-4 w-4" /> 安全提示：第三方 pi 扩展是任意代码，技能也能指导模型执行任意命令。安装来路不明的包前，请先阅读其源码。
      </div>
    </div>
  );
}
