import { ArrowUpRight, Flag, Rocket, Target, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const caseStudies = [
  {
    title: "开源知识库重构",
    description: "将零散文档拆解为模块化知识库，建立长期复用机制。",
    status: "进行中",
    tags: ["Open Source", "Docs", "Workflow"],
    outcomes: [
      "检索效率提升约 3 倍",
      "文档复用率显著提升",
      "贡献流程标准化",
    ],
  },
  {
    title: "内容产品化迭代",
    description: "把内容结构与视觉系统统一，形成可持续的发布节奏。",
    status: "阶段完成",
    tags: ["Design", "Content Ops"],
    outcomes: [
      "建立内容模板库",
      "发布周期缩短 40%",
      "阅读完成率提升",
    ],
  },
  {
    title: "AI 质检流程",
    description: "引入 AI 参与校验与摘要，降低人工成本。",
    status: "实验中",
    tags: ["AI", "Quality"],
    outcomes: [
      "初稿审核时间减半",
      "保持语气与结构一致",
      "提高协作反馈质量",
    ],
  },
  {
    title: "协作式工具栈",
    description: "统一工具链与协作模板，让多人协作变得可控。",
    status: "长期维护",
    tags: ["Tooling", "Collaboration"],
    outcomes: [
      "协作成本明显降低",
      "任务透明度提升",
      "新成员上手更快",
    ],
  },
];

const impactHighlights = [
  {
    title: "价值导向",
    description: "所有案例都围绕核心价值主张展开，而不是功能堆叠。",
    icon: Target,
  },
  {
    title: "节奏控制",
    description: "以可持续的节奏迭代，不追求一次性完美。",
    icon: Timer,
  },
  {
    title: "结果可见",
    description: "通过指标与故事同步呈现成果，保持透明度。",
    icon: Flag,
  },
];

export default function Cases() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <Badge variant="secondary">案例与实践</Badge>
          <h1 className="font-display text-3xl md:text-4xl">
            把实践过程变成可复用的资产
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            这里记录真实实践与复盘结果。每一个案例都包含问题、方案、执行与结果，确保可复用与可验证。
          </p>
        </div>
        <Button variant="outline">
          申请协作
          <ArrowUpRight className="ml-2 size-4" />
        </Button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {caseStudies.map((study) => (
          <Card key={study.title} className="bg-card/80">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg">{study.title}</CardTitle>
                <Badge variant="outline">{study.status}</Badge>
              </div>
              <CardDescription>{study.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {study.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {impactHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="size-4 text-primary" />
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="mt-12 bg-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Rocket className="size-4 text-primary" />
            下一步计划
          </CardTitle>
          <CardDescription>
            继续沉淀方法论与工具，让案例成为可持续升级的产品。
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          欢迎与我一起共创案例库，通过公开协作不断优化实践路径。
        </CardContent>
      </Card>
    </section>
  );
}
