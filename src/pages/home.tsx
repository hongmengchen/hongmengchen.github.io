import {
  ArrowUpRight,
  Blocks,
  Brain,
  CheckCircle2,
  GitBranch,
  LayoutGrid,
  PenLine,
  Rocket,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const overviewItems = [
  {
    title: "结构化模块",
    value: "持续搭建",
    description: "拆解为可复用单元",
  },
  {
    title: "工程化模板",
    value: "迭代中",
    description: "方法论与脚手架",
  },
  {
    title: "开源协作",
    value: "长期主义",
    description: "贡献即作品",
  },
  {
    title: "AI 赋能",
    value: "可控可解释",
    description: "人类掌舵，AI 增强",
  },
];

const featureList = [
  {
    title: "内容工程化",
    description: "把想法变成体系化模块，保证持续输出与复用能力。",
    icon: PenLine,
    label: "Content Ops",
  },
  {
    title: "协作即产品",
    description: "以开源协作方式沉淀资产，把过程变成可见成果。",
    icon: GitBranch,
    label: "Open Source",
  },
  {
    title: "AI 助手",
    description: "让 AI 参与整理、归档与检查，释放更多创造时间。",
    icon: Brain,
    label: "AI Assist",
  },
  {
    title: "系统化交付",
    description: "用工程视角管理知识、工具与流程，形成稳定产出。",
    icon: Workflow,
    label: "System",
  },
];

const principles = [
  {
    title: "以价值叙事组织内容",
    description: "先讲清楚问题与收益，再给出方案与证据。",
    icon: Target,
  },
  {
    title: "可复用的设计与组件",
    description: "统一视觉、组件与语气，让内容像产品一样一致。",
    icon: Blocks,
  },
  {
    title: "从灵感到交付的流水线",
    description: "把灵感落地为流程，沉淀为工具，再公开为协作。",
    icon: Sparkles,
  },
];

const workflowSteps = [
  {
    title: "问题定义",
    description: "把目标人群和场景说清楚，界定核心价值。",
  },
  {
    title: "知识建模",
    description: "建立主题、模块、案例之间的连接关系。",
  },
  {
    title: "工程化执行",
    description: "用模板和清单保障质量、节奏与可维护性。",
  },
  {
    title: "开源协作",
    description: "公开过程与工具，吸引共创与反馈循环。",
  },
];

const stackTags = [
  "Vite",
  "React",
  "TypeScript",
  "Tailwind",
  "shadcn/ui",
  "GitHub Pages",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 bg-grid opacity-60" />

        <header className="relative mx-auto max-w-6xl px-6 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                <LayoutGrid className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground">
                  HONGMENG CHEN
                </p>
                <p className="text-lg font-semibold">秩序创造自由</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">个人主页</Badge>
              <Badge variant="soft">内容工程</Badge>
              <Badge variant="soft">开源协作</Badge>
            </div>
          </div>
        </header>

        <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-12 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Sparkles className="size-4 text-primary" />
                  以工程化思维管理内容与协作
                </p>
                <h1 className="font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
                  用体系化工程释放
                  <span className="text-gradient">创造力</span>
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                  这里记录我对技术、开源与协作的实践方法。通过结构化内容、稳定流程和
                  AI 辅助，让个人与团队的创作更可持续、更具复用价值。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#features">
                    浏览特性
                    <ArrowUpRight className="ml-1 size-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://github.com/hongmengchen/hongmengchen.github.io"
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看仓库
                  </a>
                </Button>
              </div>

              <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                {[
                  "工程化方法论 + 内容策略",
                  "长期主义的开源协作实践",
                  "可复用组件与模板系统",
                  "AI 驱动的质量与节奏控制",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2 backdrop-blur"
                  >
                    <CheckCircle2 className="size-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel shadow-soft backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Rocket className="size-4 text-primary" />
                    系统概览
                  </CardTitle>
                  <CardDescription>
                    以产品叙事呈现技术路径，保持长期迭代能力。
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {overviewItems.map((item) => (
                    <div key={item.title} className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {item.title}
                      </p>
                      <p className="text-base font-semibold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card/70 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-base">近期关注</CardTitle>
                  <CardDescription>
                    内容、流程与开源协作三条线并行推进。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "工程化写作规范与模板库",
                    "个人知识体系的结构化设计",
                    "AI 辅助校验与质量控制",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 rounded-lg bg-background/70 px-3 py-2 text-sm"
                    >
                      <span className="mt-1 size-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="secondary">Homepage Features</Badge>
            <h2 className="font-display text-3xl md:text-4xl">
              让特性成为第一眼的记忆点
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              借鉴优秀技术团队的叙事方式：先讲价值，再呈现方法与证据。
              每个模块都是可复用的产品化能力，而不只是一次性页面。
            </p>
          </div>
          <Button variant="ghost" asChild>
            <a href="#workflow" className="flex items-center gap-2">
              查看路线
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featureList.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group bg-card/80 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="soft">{feature.label}</Badge>
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      <section id="system" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Badge variant="secondary">Design System</Badge>
            <h2 className="font-display text-3xl md:text-4xl">
              内容、工具、协作的三段式设计
            </h2>
            <p className="text-muted-foreground">
              设计不只是视觉，而是内容结构、交付流程、协作方式的统一。
              我将首页作为核心叙事舞台，让读者迅速理解你的价值主张。
            </p>
            <div className="space-y-3">
              {principles.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3">
                    <span className="mt-1 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle>未来信息架构</CardTitle>
                <CardDescription>
                  以“问题-方案-实践-协作”的叙事线索组织内容。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "价值主张与核心特性",
                  "方法论与工具组件库",
                  "案例与实践记录",
                  "开放协作与资源下载",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/80 px-4 py-2"
                  >
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      0{index + 1}
                    </span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <a href="#about">查看项目说明</a>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>技术栈与交付</CardTitle>
                <CardDescription>
                  简洁、可维护、利于持续迭代的技术组合。
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {stackTags.map((tag) => (
                  <Badge key={tag} variant="soft">
                    {tag}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-6xl px-6 pb-20">
        <Card className="bg-primary/10">
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              从灵感到交付的清晰路径
            </CardTitle>
            <CardDescription>
              把灵感变成系统，把系统变成长期资产。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="rounded-xl bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Step {index + 1}
                </p>
                <p className="mt-2 font-semibold">{step.title}</p>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <footer id="about" className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 text-sm text-muted-foreground">
          <p>
            这是一个基于 Vite + React + TypeScript 的静态站点示例，主题与样式使用
            Tailwind 与 shadcn/ui 组件系统。
          </p>
          <p>
            如果你希望进一步扩展页面或增加更多模块，可以直接在仓库中协作共创。
          </p>
        </div>
      </footer>
    </main>
  );
}
