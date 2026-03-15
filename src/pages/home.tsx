import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const focusTags = ["内容工程", "开源协作", "长期主义"];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />

        <section className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-between gap-10 px-6 py-16 sm:py-20">
          <header className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                HONGMENG CHEN
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                内容与协作的长期实践
              </p>
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
            <div className="h-px w-12 bg-primary/60" />
            <div className="space-y-3">
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                秩序创造<span className="text-primary">自由</span>
              </h1>
              <p className="font-display text-2xl font-semibold tracking-tight text-foreground/80 md:text-3xl">
                开源创造未来
              </p>
              <p className="text-base text-muted-foreground md:text-lg">
                前者是我对社会的认知，后者是我对未来的畅想。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {focusTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/blog">阅读技术博客</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/content">查看内容体系</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card size="sm" className="bg-card/70 shadow-soft">
              <CardHeader>
                <CardTitle>信条</CardTitle>
                <CardDescription>秩序创造自由。</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                用结构化与节奏，降低混乱成本，释放创造力。
              </CardContent>
            </Card>
            <Card size="sm" className="bg-card/70 shadow-soft">
              <CardHeader>
                <CardTitle>目标</CardTitle>
                <CardDescription>开源创造未来。</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                以开放协作沉淀方法与工具，形成长期资产。
              </CardContent>
            </Card>
          </div>

          <footer className="border-t border-border/60 pt-4 text-xs text-muted-foreground">
            简约、清晰、长期主义。
          </footer>
        </section>
      </div>
    </main>
  );
}
