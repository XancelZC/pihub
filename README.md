# PiHub

Pi 插件集市 —— 收集整理 pi coding agent 的扩展、技能、主题与提示词。

## 功能

- 从 npm registry 与 GitHub 自动抓取 pi 插件（脚本 + GitHub Actions 每日更新）
- 分类浏览：子代理、记忆、MCP、网络、UI、代码、安全、计划等
- 搜索 / 类型过滤 / 排序
- 插件详情页：描述、star、关键词、一键复制安装命令
- 安装指南页

## 技术栈

- Next.js 16（静态导出，`output: "export"`）
- Tailwind CSS 3
- 数据在 `data/plugins.json`，由 `scripts/fetch-data.mjs` 生成

## 本地开发

```bash
npm install
npm run fetch:data   # 抓取最新插件数据
npm run dev          # http://localhost:3000
```

## 构建 / 部署

```bash
npm run build        # 输出到 out/
```

Vercel 部署：导入仓库即可（静态导出自动生效）。数据更新由 GitHub Actions 每日自动提交。

## 目录结构

```
app/          页面（首页 / 详情页 / 安装指南）
components/   卡片、筛选器、复制按钮等
lib/          类型、数据读取、格式化
data/         生成的插件数据
scripts/      数据抓取脚本
```

## 安全声明

第三方 pi 插件拥有完整系统权限，本站仅收录索引，不担保插件安全性，安装前请自行审查源码。
