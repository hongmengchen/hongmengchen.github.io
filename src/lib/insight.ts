import { parse as parseYaml } from "yaml";

export type SiteHero = {
  eyebrow?: string;
  tagline?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  description?: string;
};

export type SiteStatements = {
  credo?: {
    title?: string;
    tagline?: string;
    body?: string;
  };
  goal?: {
    title?: string;
    tagline?: string;
    body?: string;
  };
};

export type SiteBadges = {
  nav?: string[];
};

export type SiteTheme = {
  primary?: string;
  ring?: string;
  hero_glow_1?: string;
  hero_glow_2?: string;
  hero_base?: string;
};

export type SiteConfig = {
  hero?: SiteHero;
  focusTags?: string[];
  badges?: SiteBadges;
  statements?: SiteStatements;
  theme?: SiteTheme;
};

export type InsightMeta = {
  title: string;
  slug: string;
  summary?: string;
  created?: string;
  updated?: string;
  categories: string[];
  tags: string[];
  impact?: string[];
  site?: SiteConfig;
  draft?: boolean;
};

export type InsightPost = {
  meta: InsightMeta;
  content: string;
  sourcePath: string;
};

const rawEntries = import.meta.glob<string>("../../insight/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const defaultSiteConfig: SiteConfig = {
  hero: {
    eyebrow: "HONGMENG CHEN",
    tagline: "内容与协作的长期实践",
    title: "秩序创造自由",
    highlight: "自由",
    subtitle: "开源创造未来",
    description: "前者是我对社会的认知，后者是我对未来的畅想。",
  },
  focusTags: ["内容工程", "开源协作", "长期主义"],
  badges: {
    nav: ["长期主义", "内容工程"],
  },
  statements: {
    credo: {
      title: "信条",
      tagline: "秩序创造自由。",
      body: "用结构化与节奏，降低混乱成本，释放创造力。",
    },
    goal: {
      title: "目标",
      tagline: "开源创造未来。",
      body: "以开放协作沉淀方法与工具，形成长期资产。",
    },
  },
  theme: {
    primary: "oklch(0.56 0.16 197)",
    ring: "oklch(0.66 0.14 197)",
    hero_glow_1: "rgba(14, 116, 144, 0.16)",
    hero_glow_2: "rgba(59, 130, 246, 0.12)",
    hero_base: "rgba(255, 255, 255, 0.98)",
  },
};

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

const toRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

const toString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const normalizeHero = (value: unknown): SiteHero | undefined => {
  const record = toRecord(value);
  if (!record) return undefined;
  return {
    eyebrow: toString(record.eyebrow),
    tagline: toString(record.tagline),
    title: toString(record.title),
    highlight: toString(record.highlight),
    subtitle: toString(record.subtitle),
    description: toString(record.description),
  };
};

const normalizeStatements = (value: unknown): SiteStatements | undefined => {
  const record = toRecord(value);
  if (!record) return undefined;

  const normalizeBlock = (block: unknown) => {
    const data = toRecord(block);
    if (!data) return undefined;
    return {
      title: toString(data.title),
      tagline: toString(data.tagline),
      body: toString(data.body),
    };
  };

  return {
    credo: normalizeBlock(record.credo),
    goal: normalizeBlock(record.goal),
  };
};

const normalizeBadges = (value: unknown): SiteBadges | undefined => {
  const record = toRecord(value);
  if (!record) return undefined;
  return {
    nav: toArray(record.nav),
  };
};

const normalizeTheme = (value: unknown): SiteTheme | undefined => {
  const record = toRecord(value);
  if (!record) return undefined;
  return {
    primary: toString(record.primary),
    ring: toString(record.ring),
    hero_glow_1: toString(record.hero_glow_1),
    hero_glow_2: toString(record.hero_glow_2),
    hero_base: toString(record.hero_base),
  };
};

const normalizeSiteConfig = (value: unknown): SiteConfig | undefined => {
  const record = toRecord(value);
  if (!record) return undefined;

  return {
    hero: normalizeHero(record.hero),
    focusTags: toArray(record.focus_tags ?? record.focusTags),
    badges: normalizeBadges(record.badges),
    statements: normalizeStatements(record.statements),
    theme: normalizeTheme(record.theme),
  };
};

const extractSlug = (path: string, frontMatterSlug?: unknown) => {
  if (typeof frontMatterSlug === "string" && frontMatterSlug.trim()) {
    return frontMatterSlug.trim();
  }
  const normalized = path.replace(/\\/g, "/");
  const withoutRoot = normalized.replace(/^\/?insight\//, "");
  const withoutExt = withoutRoot.replace(/\.md$/i, "");
  return withoutExt.replace(/\//g, "-");
};

const parseFrontMatter = (raw: string) => {
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+/);
  if (!match) {
    return { data: {}, content: raw };
  }
  const data = (parseYaml(match[1]) || {}) as Record<string, unknown>;
  const content = raw.slice(match[0].length);
  return { data, content };
};

const parseInsight = (path: string, raw: string): InsightPost => {
  const { data, content } = parseFrontMatter(raw);
  const meta: InsightMeta = {
    title: typeof data.title === "string" ? data.title : "未命名洞察",
    slug: extractSlug(path, data.slug),
    summary: typeof data.summary === "string" ? data.summary : undefined,
    created: typeof data.created === "string" ? data.created : undefined,
    updated: typeof data.updated === "string" ? data.updated : undefined,
    categories: toArray(data.categories),
    tags: toArray(data.tags),
    impact: toArray(data.impact),
    site: normalizeSiteConfig(data.site),
    draft: typeof data.draft === "boolean" ? data.draft : undefined,
  };

  return {
    meta,
    content,
    sourcePath: path,
  };
};

const allInsights = Object.entries(rawEntries).map(([path, raw]) =>
  parseInsight(path, raw),
);

const getSortTimestamp = (post: InsightPost) => {
  const date = post.meta.updated || post.meta.created || "1970-01-01";
  return Date.parse(date) || 0;
};

export const getAllInsights = (): InsightPost[] =>
  allInsights
    .filter((post) => !post.meta.draft)
    .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

export const getInsightBySlug = (slug: string): InsightPost | undefined =>
  allInsights.find((post) => post.meta.slug === slug && !post.meta.draft);

export const getSiteConfig = (): SiteConfig => {
  const insightWithSite = getAllInsights().find((post) => post.meta.site);
  if (!insightWithSite?.meta.site) {
    return defaultSiteConfig;
  }

  return {
    hero: insightWithSite.meta.site.hero ?? defaultSiteConfig.hero,
    focusTags: insightWithSite.meta.site.focusTags ?? defaultSiteConfig.focusTags,
    badges: insightWithSite.meta.site.badges ?? defaultSiteConfig.badges,
    statements:
      insightWithSite.meta.site.statements ?? defaultSiteConfig.statements,
    theme: insightWithSite.meta.site.theme ?? defaultSiteConfig.theme,
  };
};

export const applySiteTheme = (site: SiteConfig) => {
  if (typeof document === "undefined") return;
  if (!site.theme) return;

  const root = document.documentElement;
  const themeMap: Record<string, string | undefined> = {
    "--primary": site.theme.primary,
    "--ring": site.theme.ring,
    "--hero-glow-1": site.theme.hero_glow_1,
    "--hero-glow-2": site.theme.hero_glow_2,
    "--hero-base": site.theme.hero_base,
  };

  Object.entries(themeMap).forEach(([variable, value]) => {
    if (value) {
      root.style.setProperty(variable, value);
    }
  });
};
