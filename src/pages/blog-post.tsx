import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Hash, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { getPostBySlug } from "@/lib/blog";

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Badge variant="secondary">未找到</Badge>
        <h1 className="mt-4 font-display text-3xl">文章不存在</h1>
        <p className="mt-2 text-muted-foreground">
          可能还在准备中，或尚未发布。
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary"
        >
          <ArrowLeft className="size-4" />
          返回博客列表
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <div className="space-y-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          返回博客列表
        </Link>

        <Badge variant="secondary">博客</Badge>
        <h1 className="font-display text-3xl md:text-4xl">{post.meta.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Clock className="size-3.5" />
            {post.meta.updated || post.meta.created || "未设置"}
          </span>
          {post.meta.categories.map((item) => (
            <span
              key={`cat-${post.meta.slug}-${item}`}
              className="inline-flex items-center gap-1"
            >
              <Layers className="size-3" />
              {item}
            </span>
          ))}
          {post.meta.tags.map((item) => (
            <span
              key={`tag-${post.meta.slug}-${item}`}
              className="inline-flex items-center gap-1"
            >
              <Hash className="size-3" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}
