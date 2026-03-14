import { Download, FolderOpen, Layers, Link2, Wrench } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const resourceKits = [
  {
    title: "写作与内容模板",
    description: "适用于技术写作、复盘、案例整理。",
    icon: Layers,
    items: ["问题定义模版", "案例复盘模板", "发布检查清单"],
  },
  {
    title: "协作流程工具",
    description: "让协作有节奏、可追踪。",
    icon: Wrench,
    items: ["协作任务看板", "贡献指南模板", "反馈收集表"],
  },
  {
    title: "资源索引",
    description: "精选工具与参考资料，保持更新。",
    icon: Link2,
    items: ["设计参考", "技术博客", "开源项目"],
  },
];

const resourceFaq = [
  {
    value: "access",
    title: "如何获取模板与素材？",
    content: "目前资源以公开共享为主，后续会在仓库中持续完善下载入口。",
  },
  {
    value: "update",
    title: "资源更新频率？",
    content: "以季度为节奏进行更新，并同步在项目日志中说明变化。",
  },
  {
    value: "contribute",
    title: "可以协作共建资源库吗？",
    content: "欢迎通过 GitHub 提交建议或 PR，一起完善资源库。",
  },
];

export default function Resources() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <Badge variant="secondary">资源中心</Badge>
          <h1 className="font-display text-3xl md:text-4xl">
            把工具与模板沉淀为可复用资产
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            这里汇总常用模板、协作流程与参考资源，让知识、工具与流程可以被快速复用。
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 size-4" />
          获取资源包
        </Button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {resourceKits.map((kit) => {
          const Icon = kit.icon;
          return (
            <Card key={kit.title} className="bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="size-4 text-primary" />
                  {kit.title}
                </CardTitle>
                <CardDescription>{kit.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {kit.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-12 bg-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderOpen className="size-4 text-primary" />
            资源结构建议
          </CardTitle>
          <CardDescription>
            统一命名、结构和权限策略，保持资源可维护性。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>01. 按主题分层：策略、工具、案例、模板。</p>
          <p>02. 每份资源附带用途说明与版本记录。</p>
          <p>03. 为协作提供入口，保证持续更新。</p>
        </CardContent>
      </Card>

      <div className="mt-10">
        <Badge variant="secondary">资源答疑</Badge>
        <Accordion type="single" collapsible className="mt-4">
          {resourceFaq.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
