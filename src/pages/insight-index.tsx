import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Hash, Layers, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllInsights } from "@/lib/insight";

const insights = getAllInsights();

export default function InsightIndex() {
  return (
    <section className="insight-shell mx-auto max-w-6xl px-6 py-12">
      <div className="insight-hero">
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
      </div>

      {insights.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border/60 bg-card/70 p-8 text-sm text-muted-foreground">
          暂无顿悟，先写下一条会改变你站点形态的认知。
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {insights.map((insight) => (
            <Card key={insight.meta.slug} className="insight-card">
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
          ))}
        </div>
      )}
    </section>
  );
}
