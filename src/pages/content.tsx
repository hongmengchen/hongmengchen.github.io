import {
  ArrowUpRight,
  BookOpen,
  FileText,
  PenLine,
  Sparkles,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const contentTracks = [
  {
    value: "method",
    label: "方法论",
    description: "聚焦价值主张、受众与可复用框架。",
    items: [
      {
        title: "问题定义模板",
        description: "把用户痛点与解决方案清晰映射，避免内容跑题。",
        tags: ["Problem", "Scope"],
      },
      {
        title: "价值叙事脚本",
        description: "用结构化叙事让内容像产品发布一样清晰。",
        tags: ["Narrative", "Story"],
      },
      {
        title: "复盘与迭代",
        description: "沉淀可复用的结论，让输出持续升级。",
        tags: ["Review", "Iteration"],
      },
    ],
  },
  {
    value: "writing",
    label: "写作",
    description: "从灵感记录到结构化交付的流水线。",
    items: [
      {
        title: "模块化写作卡片",
        description: "拆分观点、方法、清单，保持复用能力。",
        tags: ["Modules", "Templates"],
      },
      {
        title: "排版与语气",
        description: "统一视觉与语气，让阅读体验更顺畅。",
        tags: ["Typography", "Tone"],
      },
      {
        title: "发布节奏",
        description: "以节奏驱动质量，避免临时爆发式输出。",
        tags: ["Cadence", "Quality"],
      },
    ],
  },
  {
    value: "tools",
    label: "工具",
    description: "让工具链服务内容，而不是制造复杂度。",
    items: [
      {
        title: "自动化检查清单",
        description: "用脚本检查标题、标签与结构一致性。",
        tags: ["Automation", "QA"],
      },
      {
        title: "组件与模板库",
        description: "将页面拆成可复用组件，快速搭建新内容。",
        tags: ["UI", "Reuse"],
      },
      {
        title: "协作工单",
        description: "让贡献流程标准化，降低协作成本。",
        tags: ["Collaboration", "Flow"],
      },
    ],
  },
  {
    value: "ai",
    label: "AI 协作",
    description: "让 AI 成为增强器而非替代者。",
    items: [
      {
        title: "内容整理助手",
        description: "快速归档与摘要，保持素材有序。",
        tags: ["Summarize", "Archive"],
      },
      {
        title: "质量与一致性校验",
        description: "用 AI 检查结构、语气与引用。",
        tags: ["Consistency", "Review"],
      },
      {
        title: "交付节奏助手",
        description: "预测工作量，规划输出节奏。",
        tags: ["Planning", "Productivity"],
      },
    ],
  },
];

const contentGuides = [
  {
    title: "内容结构",
    description: "问题-方案-证据-行动的叙事闭环。",
  },
  {
    title: "文档规范",
    description: "统一标题、标签与模块命名方式。",
  },
  {
    title: "发布节奏",
    description: "短周期迭代，避免一次性完美主义。",
  },
];

export default function Content() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Badge variant="secondary">内容体系</Badge>
          <h1 className="font-display text-3xl md:text-4xl">
            从主题到资产的内容流水线
          </h1>
          <p className="text-muted-foreground">
            将内容视作可迭代的产品：每一次输出都可以被复用、被协作、被持续优化。
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>
              查看写作规范
              <ArrowUpRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline">规划内容主题</Button>
          </div>
        </div>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-primary" />
              内容工程清单
            </CardTitle>
            <CardDescription>让内容既好看又能复用。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {contentGuides.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/80 px-3 py-2"
              >
                <span className="mt-1 size-1.5 rounded-full bg-primary" />
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="method" className="mt-10">
        <TabsList variant="line" className="w-full justify-start">
          {contentTracks.map((track) => (
            <TabsTrigger key={track.value} value={track.value}>
              {track.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {contentTracks.map((track) => (
          <TabsContent key={track.value} value={track.value} className="mt-6">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="size-4 text-primary" />
              {track.description}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {track.items.map((item) => (
                <Card key={item.title} className="bg-card/80">
                  <CardHeader>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4 text-primary" />
              主题库
            </CardTitle>
            <CardDescription>沉淀长期关注的核心问题域。</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PenLine className="size-4 text-primary" />
              写作模板
            </CardTitle>
            <CardDescription>统一结构与语气，减少重复劳动。</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-primary" />
              发布日历
            </CardTitle>
            <CardDescription>以节奏驱动持续输出与优化。</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}
