/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // pi.dev 风格色板（柔和、低饱和、接近纸质感）
        canvas: "#f4f2ef", // 页面背景（warm-white）
        surface: "#ffffff", // 卡片
        ink: "#1c1917", // 主文字（warm-black）
        inkSoft: "#57534e", // 次要文字（warm-40）
        inkMute: "#8b847d", // 弱化文字（warm-30）
        line: "#e7e2dc", // 边框（暖灰）
        accent: "#4b607c", // 主色 thread-blue（pi.dev 标志色）
        accentDeep: "#3a4a63",
        accentSoft: "#e8edf2", // 主色浅底
        accentLine: "#c9d4e0",
        terracotta: "#b86b52", // 强调暖色
        sage: "#a3a473",
        sunkissed: "#e1b06e",
        success: "#5db87a",
        warning: "#e8993a",
        error: "#e8704f",
        // 终端深色（配合 mono 字体展示命令）
        term: "#161d27",
        termLine: "#2a3441",
        termText: "#e8e6e3",
        termAccent: "#9cc3e0",
      },
      fontFamily: {
        sans: ['"Inter"', '"PingFang SC"', '"Microsoft YaHei"', "system-ui", "sans-serif"],
        serif: ['"Plantin MT Pro"', "Georgia", "serif"],
        mono: ['"Commit Mono"', '"SFMono-Regular"', "ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,25,23,0.04), 0 1px 3px rgba(28,25,23,0.06)",
        lift: "0 4px 12px rgba(28,25,23,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
