import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Hash, Layers } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { getPostBySlug } from "@/lib/blog";

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

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
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          返回博客列表
        </Link>

        <Badge variant="secondary">博客</Badge>
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
          </div>
        </div>
      </motion.div>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card/80 p-8 shadow-soft">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}