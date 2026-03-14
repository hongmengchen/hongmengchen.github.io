import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const focusTags = ["内容工程", "开源协作", "AI 辅助"];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />

        <section className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-between gap-10 px-6 py-12 sm:py-16">
          <header className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                HONGMENG CHEN
              </p>
              <p className="text-sm font-medium">秩序创造自由</p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <a
                href="https://github.com/hongmengchen/hongmengchen.github.io"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </Button>
          </header>

          <div className="space-y-6">
            <Badge variant="secondary">首页</Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                秩序是创造自由的前提
              </h1>
              <p className="text-base text-muted-foreground md:text-lg">
                我希望用工程化的方法组织内容与协作，让创造成为可持续的长期资产。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {focusTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card size="sm" className="bg-card/80">
              <CardHeader>
                <CardTitle>信条</CardTitle>
                <CardDescription>秩序创造自由。</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                用结构化与节奏，让每一次输出都可复用。
              </CardContent>
            </Card>
            <Card size="sm" className="bg-card/80">
              <CardHeader>
                <CardTitle>目标</CardTitle>
                <CardDescription>工程化驱动协作与创造。</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                建立可持续的内容系统，沉淀长期价值。
              </CardContent>
            </Card>
          </div>

          <footer className="text-xs text-muted-foreground">
            简约、清晰、长期主义。
          </footer>
        </section>
      </div>
    </main>
  );
}
