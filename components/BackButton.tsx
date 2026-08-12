"use client";

import Icon from "./Icon";

/** 返回上一页；无历史记录时退回首页 */
export default function BackButton() {
  return (
    <button
      onClick={() => {
        if (window.history.length > 1) window.history.back();
        else window.location.href = "/";
      }}
      className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
    >
      <Icon name="ArrowLeft" className="h-4 w-4" /> 返回上一页
    </button>
  );
}
