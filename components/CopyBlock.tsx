"use client";

import { useState } from "react";
import Icon from "./Icon";

export default function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-term px-4 py-3">
      <div className="min-w-0 flex-1">
        <code className="block select-all whitespace-pre-wrap break-all font-mono text-sm leading-relaxed text-termAccent">
          {text}
        </code>
        {text.includes("\n") && (
          <p className="mt-1 text-[11px] text-inkMute">{text.split("\n").length} 行命令，复制后粘贴到 pi 终端执行</p>
        )}
      </div>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard?.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* ignore */
          }
        }}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-white transition hover:bg-success"
      >
        {copied ? <Icon name="Check" className="h-3.5 w-3.5" /> : <Icon name="Copy" className="h-3.5 w-3.5" />}
        {copied ? "已复制" : "复制命令"}
      </button>
    </div>
  );
}
