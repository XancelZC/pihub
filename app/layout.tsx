import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "PiHub · Pi 插件集市",
  description: "收集与整理 pi coding agent 的扩展、技能、主题与提示词，各取所需",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans text-ink antialiased">
        <header className="sticky top-0 z-10 border-b border-line bg-canvas/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-ink">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-sm font-serif text-white">
                π
              </span>
              <span>
                PiHub<span className="ml-1 text-xs font-normal text-inkMute">插件集市</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm text-inkSoft">
              <Link href="/" className="rounded-lg px-3 py-1.5 hover:bg-surface hover:text-accent">
                首页
              </Link>
              <Link href="/explore" className="rounded-lg px-3 py-1.5 hover:bg-surface hover:text-accent">
                插件库
              </Link>
              <Link
                href="/setup"
                className="rounded-lg px-3 py-1.5 font-medium text-accent hover:bg-surface"
              >
                <Icon name="Wand" className="mr-1 inline h-3.5 w-3.5" />
                新手向导
              </Link>
              <Link href="/how-to-install" className="rounded-lg px-3 py-1.5 hover:bg-surface hover:text-accent">
                安装指南
              </Link>
              <a
                href="https://github.com/XancelZC/pihub"
                target="_blank"
                rel="noreferrer"
                className="ml-2 rounded-lg bg-ink px-3 py-1.5 text-white hover:bg-inkSoft"
              >
                <Icon name="Github" className="mr-1.5 inline h-4 w-4" /> GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-line py-8 text-center text-sm text-inkMute">
          <p>
            PiHub — 非官方社区项目，与 pi coding agent 无关。数据来自 pi.dev / npm / GitHub，每日自动更新。
          </p>
          <p className="mt-1">
            新手？先去
            <Link href="/setup" className="mx-1 text-accent hover:underline">
              配置向导
            </Link>
            选几个趁手的插件吧
          </p>
        </footer>
      </body>
    </html>
  );
}
