import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <Icon name="Compass" className="mx-auto h-14 w-14 text-inkMute" />
      <h1 className="mt-4 text-xl font-bold">404 · 页面不存在</h1>
      <p className="mt-2 text-sm text-inkSoft">这个插件可能还没收录，或者地址有误。</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white">
        返回首页
      </Link>
    </div>
  );
}
