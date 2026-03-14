// 文件不需要显式导入 React（使用新的 JSX 运行时）
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">鸿蒙</h1>

        <p className="text-2xl md:text-3xl font-semibold">秩序创造自由，开源创造未来</p>

        <p className="text-muted-foreground max-w-2xl mx-auto">
          欢迎来到我的个人网站。这里记录我对技术、开源与协作的理解。
          我相信通过有序的工程实践与开放的分享文化，我们可以创造更 多的自由与机会。
        </p>

        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/hongmengchen/hongmengchen.github.io"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline">查看仓库</Button>
          </a>
          <a href="#about">
            <Button variant="ghost">了解更多</Button>
          </a>
        </div>

        <footer id="about" className="mt-8 text-sm text-muted-foreground">
          <p>
            这是一个基于 Vite + React + TypeScript 的静态站点示例，主题与样式 使用 Tailwind 与
            shadcn 组件。
          </p>
        </footer>
      </section>
    </main>
  );
}
