import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Hash, Layers, Sparkles, Waypoints } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { getInsightBySlug } from "@/lib/insight";

const easeOutCubic = [0.22, 0.61, 0.36, 1] as const;

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const contentVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutCubic },
  },
};

const timelineSteps = [
  {
    title: "观察",
    description: "记录触发认知变化的事实、现场与背景。",
  },
  {
    title: "结论",
    description: "提炼核心判断，明确你相信它成立的原因。",
  },
  {
    title: "影响范围",
    description: "把变化映射到站点结构、主题或架构调整。",
  },
  {
    title: "行动",
    description: "拆解为下一步可执行的页面或系统动作。",
  },
];

export default function InsightPost() {
  const { slug } = useParams();
  const post = slug ? getInsightBySlug(slug) : undefined;

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Badge variant="secondary">未找到</Badge>
        <h1 className="mt-4 font-display text-3xl">顿悟不存在</h1>
        <p className="mt-2 text-muted-foreground">
          可能还在准备中，或尚未发布。
        </p>
        <Link
          to="/insights"
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary"
        >
          <ArrowLeft className="size-4" />
          返回顿悟列表
        </Link>
      </section>
    );
  }

  return (
    <article className="insight-shell mx-auto max-w-6xl px-6 py-12">
      <motion.div
        className="insight-hero insight-hero--compact"
        variants={heroVariants}
        initial="hidden"
        animate="show"
      >
        <div className="insight-hero__grid bg-grid" />
        <div className="insight-hero__glow" />
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          返回顿悟列表
        </Link>

        <Badge variant="secondary">顿悟</Badge>
        <h1 className="font-display text-3xl md:text-4xl">{post.meta.title}</h1>
        {post.meta.summary ? (
          <p className="text-muted-foreground">{post.meta.summary}</p>
        ) : null}
        <div className="insight-hero__meta">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-3.5" />
              {post.meta.updated || post.meta.created || "未设置"}
            </span>
            {post.meta.categories.map((item) => (
              <span key={`cat-${post.meta.slug}-${item}`} className="insight-meta">
                <Layers className="size-3" />
                {item}
              </span>
            ))}
            {post.meta.tags.map((item) => (
              <span key={`tag-${post.meta.slug}-${item}`} className="insight-meta">
                <Hash className="size-3" />
                {item}
              </span>
            ))}
            {(post.meta.impact ?? []).map((item) => (
              <span key={`impact-${post.meta.slug}-${item}`} className="insight-meta">
                <Sparkles className="size-3" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mt-8">
        <Card className="insight-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Waypoints className="size-4 text-primary" />
              进化路径
            </div>
            <CardTitle className="text-base">顿悟落地步骤</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {timelineSteps.map((step, index) => (
              <div key={step.title} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 rounded-full">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index !== timelineSteps.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <motion.div
        className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]"
        variants={contentVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-soft"
          variants={panelVariants}
        >
          <MarkdownRenderer content={post.content} />
        </motion.div>
        <aside className="space-y-4">
          <motion.div variants={panelVariants}>
            <Card className="insight-card">
              <CardHeader>
                <CardTitle className="text-base">进化影响范围</CardTitle>
                <p className="text-xs text-muted-foreground">
                  这些标签指向本次顿悟会影响站点的哪些部分。
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 text-xs">
                {(post.meta.impact ?? []).length > 0 ? (
                  (post.meta.impact ?? []).map((item) => (
                    <Badge
                      key={`impact-panel-${post.meta.slug}-${item}`}
                      variant="outline"
                      className="insight-chip insight-chip--impact"
                    >
                      <Sparkles className="size-3" />
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    暂未标注影响范围。
                  </span>
                )}
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={panelVariants}>
            <Card className="insight-card">
              <CardHeader>
                <CardTitle className="text-base">行动提示</CardTitle>
                <p className="text-xs text-muted-foreground">
                  将这条顿悟落实为页面、主题或架构的下一步动作。
                </p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                先明确优先级，再确定对首页、导航或视觉系统的具体改动。
              </CardContent>
            </Card>
          </motion.div>
        </aside>
      </motion.div>
    </article>
  );
}
