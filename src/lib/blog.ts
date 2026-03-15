import matter from "gray-matter";

export type BlogMeta = {
  title: string;
  slug: string;
  summary?: string;
  created?: string;
  updated?: string;
  categories: string[];
  tags: string[];
  draft?: boolean;
};

export type BlogPost = {
  meta: BlogMeta;
  content: string;
  sourcePath: string;
};

const rawEntries = import.meta.glob<string>("/blog/**/*.md", {
  as: "raw",
  eager: true,
});

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const extractSlug = (path: string, frontMatterSlug?: unknown) => {
  if (typeof frontMatterSlug === "string" && frontMatterSlug.trim()) {
    return frontMatterSlug.trim();
  }
  const normalized = path.replace(/\\/g, "/");
  const withoutRoot = normalized.replace(/^\/?blog\//, "");
  const withoutExt = withoutRoot.replace(/\.md$/i, "");
  return withoutExt.replace(/\//g, "-");
};

const parsePost = (path: string, raw: string): BlogPost => {
  const { data, content } = matter(raw);
  const meta: BlogMeta = {
    title: typeof data.title === "string" ? data.title : "未命名文档",
    slug: extractSlug(path, data.slug),
    summary: typeof data.summary === "string" ? data.summary : undefined,
    created: typeof data.created === "string" ? data.created : undefined,
    updated: typeof data.updated === "string" ? data.updated : undefined,
    categories: toArray(data.categories),
    tags: toArray(data.tags),
    draft: typeof data.draft === "boolean" ? data.draft : undefined,
  };

  return {
    meta,
    content,
    sourcePath: path,
  };
};

const allPosts = Object.entries(rawEntries).map(([path, raw]) =>
  parsePost(path, raw),
);

const getSortTimestamp = (post: BlogPost) => {
  const date = post.meta.updated || post.meta.created || "1970-01-01";
  return Date.parse(date) || 0;
};

export const getAllPosts = (): BlogPost[] =>
  allPosts
    .filter((post) => !post.meta.draft)
    .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  allPosts.find((post) => post.meta.slug === slug && !post.meta.draft);
