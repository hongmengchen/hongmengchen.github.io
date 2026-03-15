import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Hash, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog";

const posts = getAllPosts();

export default function BlogIndex() {
  const { totalPosts, totalCategories, totalTags } = useMemo(() => {
    const categories = new Set<string>();
    const tags = new Set<string>();

    posts.forEach((post) => {
      post.meta.categories.forEach((item) => categories.add(item));
      post.meta.tags.forEach((item) => tags.add(item));
    });

    return {
      totalPosts: posts.length,
      totalCategories: categories.size,
      totalTags: tags.size,
    };
  }, []);

  return (
    <section className="insight-shell mx-auto max-w-6xl px-6 py-12">
      <div className="insight-hero">
        <div className="insight-hero__grid bg-grid" />
        <div className="insight-hero__glow" />
        <Badge variant="secondary">博客</Badge>
        <h1 className="font-display text-3xl md:text-4xl">
          技术与思考的持续输出
        </h1>
        <p className="text-muted-foreground">
          从方法到落地，持续沉淀可复用的知识资产。
        </p>
        <div className="insight-hero__meta">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Knowledge Output
            </p>
            <p className="text-lg font-semibold text-foreground">
              累计 {totalPosts} 篇
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            {totalCategories} 个分类 · {totalTags} 个标签，持续打磨可复用的解决方案。
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.meta.slug} className="insight-card">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                <span>
                  {post.meta.updated || post.meta.created || "未设置"}
                </span>
              </div>
              <CardTitle className="text-xl">
                <Link
                  className="group inline-flex items-center gap-2 hover:text-primary"
                  to={`/blog/${post.meta.slug}`}
                >
                  {post.meta.title}
                  <ArrowUpRight className="size-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </CardTitle>
              {post.meta.summary ? (
                <p className="text-sm text-muted-foreground">
                  {post.meta.summary}
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-xs">
              {post.meta.categories.map((item) => (
                <Badge
                  key={`cat-${post.meta.slug}-${item}`}
                  variant="outline"
                  className="insight-chip"
                >
                  <Layers className="size-3" />
                  {item}
                </Badge>
              ))}
              {post.meta.tags.map((item) => (
                <Badge
                  key={`tag-${post.meta.slug}-${item}`}
                  variant="secondary"
                  className="insight-chip"
                >
                  <Hash className="size-3" />
                  {item}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}