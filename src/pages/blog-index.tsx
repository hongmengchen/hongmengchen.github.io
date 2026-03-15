import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Hash, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog";

const posts = getAllPosts();

export default function BlogIndex() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="space-y-4">
        <Badge variant="secondary">博客</Badge>
        <h1 className="font-display text-3xl md:text-4xl">
          技术与思考的持续输出
        </h1>
        <p className="text-muted-foreground">
          从方法到落地，持续沉淀可复用的知识资产。
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.meta.slug} className="bg-card/80">
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
                  className="inline-flex items-center gap-1"
                >
                  <Layers className="size-3" />
                  {item}
                </Badge>
              ))}
              {post.meta.tags.map((item) => (
                <Badge
                  key={`tag-${post.meta.slug}-${item}`}
                  variant="secondary"
                  className="inline-flex items-center gap-1"
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
