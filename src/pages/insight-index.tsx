import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Hash, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  AnimatedWordRenderer,
  WordCloud,
  type Word,
} from "@isoterik/react-word-cloud";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllInsights } from "@/lib/insight";

const insights = getAllInsights();

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const easeOutCubic = [0.22, 0.61, 0.36, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutCubic },
  },
};

const cloudFont = "Space Grotesk, Geist Variable, sans-serif";
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function InsightIndex() {
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null);
  const [cloudSize, setCloudSize] = useState({ width: 420, height: 176 });

  const { impacts, words, maxValue } = useMemo(() => {
    const counts = new Map<string, number>();
    insights.forEach((insight) => {
      (insight.meta.impact ?? []).forEach((impact) => {
        counts.set(impact, (counts.get(impact) ?? 0) + 1);
      });
    });

    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    return {
      impacts: sorted,
      words: sorted.map(([text, value]) => ({ text, value })) as Word[],
      maxValue: sorted.reduce((acc, [, value]) => Math.max(acc, value), 1),
    };
  }, []);

  const filteredInsights = useMemo(() => {
    if (!selectedImpact) return insights;
    return insights.filter((insight) =>
      (insight.meta.impact ?? []).includes(selectedImpact),
    );
  }, [selectedImpact]);

  useEffect(() => {
    const updateCloudSize = () => {
      if (typeof window === "undefined") return;
      const maxWidth = 440;
      const nextWidth = clamp(window.innerWidth - 140, 260, maxWidth);
      setCloudSize({
        width: nextWidth,
        height: Math.round(nextWidth * 0.42),
      });
    };

    updateCloudSize();
    window.addEventListener("resize", updateCloudSize);
    return () => window.removeEventListener("resize", updateCloudSize);
  }, []);

  return (
    <section className="insight-shell mx-auto max-w-6xl px-6 py-12">
      <motion.div
        className="insight-hero"
        variants={heroVariants}
        initial="hidden"
        animate="show"
      >
        <div className="insight-hero__grid bg-grid" />
        <div className="insight-hero__glow" />
        <Badge variant="secondary">顿悟</Badge>
        <h1 className="font-display text-3xl md:text-4xl">
          让认知驱动站点的进化
        </h1>
        <p className="text-muted-foreground">
          这里记录灵感、顿悟与规划，并明确它们如何影响布局、主题与架构。
        </p>
        <div className="insight-hero__meta">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Evolution Signals
            </p>
            <p className="text-lg font-semibold text-foreground">
              累计 {insights.length} 条
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            以“观察 — 结论 — 影响范围”作为标准结构，
            为站点更新提供依据与轨迹。
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="insight-card">
          <CardHeader>
            <CardTitle className="text-base">影响标签云</CardTitle>
            <p className="text-xs text-muted-foreground">
              点击标签直接筛选顿悟列表。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {words.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                暂无 impact 标签可视化。
              </div>
            ) : (
              <div className="flex w-full justify-center">
                <WordCloud
                  words={words}
                  width={cloudSize.width}
                  height={cloudSize.height}
                  enableTooltip
                  font={cloudFont}
                  fontSize={(word) => 12 + (word.value / maxValue) * 18}
                  padding={2}
                  spiral="rectangular"
                  rotate={(_word, index) => (index % 7 === 0 ? -12 : 0)}
                  fill={(word) =>
                    selectedImpact === word.text
                      ? "var(--primary)"
                      : "var(--foreground)"
                  }
                  fontWeight={(word) =>
                    selectedImpact === word.text ? 700 : 500
                  }
                  onWordClick={(word) => {
                    setSelectedImpact(word.text);
                  }}
                  renderWord={(data, ref) => (
                    <AnimatedWordRenderer
                      ref={ref}
                      data={data}
                      animationDelay={(_word, index) => index * 18}
                      textStyle={{
                        cursor: "pointer",
                      }}
                    />
                  )}
                />
              </div>
            )}
            {selectedImpact ? (
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="secondary">当前过滤</Badge>
                <Badge variant="outline" className="insight-chip">
                  {selectedImpact}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedImpact(null)}
                >
                  清除
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="insight-card">
          <CardHeader>
            <CardTitle className="text-base">影响范围筛选</CardTitle>
            <p className="text-xs text-muted-foreground">
              选择一个 impact 查看相关顿悟。
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={!selectedImpact ? "secondary" : "outline"}
                onClick={() => setSelectedImpact(null)}
              >
                全部
              </Button>
              {impacts.map(([impact, count]) => (
                <Button
                  key={impact}
                  size="sm"
                  variant={selectedImpact === impact ? "secondary" : "outline"}
                  onClick={() => setSelectedImpact(impact)}
                >
                  {impact}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {count}
                  </span>
                </Button>
              ))}
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">
              当前显示 {filteredInsights.length} 条顿悟。
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredInsights.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border/60 bg-card/70 p-8 text-sm text-muted-foreground">
          暂无匹配的顿悟，试试清除过滤。
        </div>
      ) : (
        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-2"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {filteredInsights.map((insight) => (
            <motion.div key={insight.meta.slug} variants={itemVariants}>
              <Card className="insight-card">
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span>
                      {insight.meta.updated || insight.meta.created || "未设置"}
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    <Link
                      className="group inline-flex items-center gap-2 hover:text-primary"
                      to={`/insights/${insight.meta.slug}`}
                    >
                      {insight.meta.title}
                      <ArrowUpRight className="size-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </CardTitle>
                  {insight.meta.summary ? (
                    <p className="text-sm text-muted-foreground">
                      {insight.meta.summary}
                    </p>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 text-xs">
                  {insight.meta.categories.map((item) => (
                    <Badge
                      key={`cat-${insight.meta.slug}-${item}`}
                      variant="outline"
                      className="insight-chip"
                    >
                      <Layers className="size-3" />
                      {item}
                    </Badge>
                  ))}
                  {insight.meta.tags.map((item) => (
                    <Badge
                      key={`tag-${insight.meta.slug}-${item}`}
                      variant="secondary"
                      className="insight-chip"
                    >
                      <Hash className="size-3" />
                      {item}
                    </Badge>
                  ))}
                  {(insight.meta.impact ?? []).map((item) => (
                    <Badge
                      key={`impact-${insight.meta.slug}-${item}`}
                      variant="outline"
                      className="insight-chip insight-chip--impact"
                    >
                      <Sparkles className="size-3" />
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}