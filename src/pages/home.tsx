import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSiteConfig } from "@/lib/insight";

const defaultTitle = "秩序创造自由";
const defaultHighlight = "自由";

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.08 * i, ease: "easeOut" },
  }),
};

const stagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardHover: Variants = {
  rest: { y: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" },
  hover: { y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", transition: { duration: 0.25, ease: "easeOut" } },
};

export default function Home() {
  const siteConfig = getSiteConfig();
  const hero = siteConfig.hero ?? {};
  const focusTags = siteConfig.focusTags ?? ["内容工程", "开源协作", "长期主义"];
  const statements = siteConfig.statements ?? {};

  const heroTitle = hero.title ?? defaultTitle;
  const heroHighlight = hero.highlight ?? defaultHighlight;
  const titleSegments = heroHighlight && heroTitle.includes(heroHighlight)
    ? heroTitle.split(heroHighlight)
    : null;

  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />

        <motion.section
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-between gap-10 px-6 py-16 sm:py-20"
        >
          <motion.header
            variants={fadeUp}
            custom={0}
            className="flex items-center justify-between text-sm"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                {hero.eyebrow ?? "HONGMENG CHEN"}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {hero.tagline ?? "内容与协作的长期实践"}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="sm" variant="outline" asChild>
                <a
                  href="https://github.com/hongmengchen/hongmengchen.github.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </Button>
            </motion.div>
          </motion.header>

          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Badge variant="secondary">首页</Badge>
              <div className="h-px w-12 bg-primary/60" />
            </motion.div>

            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
              >
                {titleSegments ? (
                  <>
                    {titleSegments[0]}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{heroHighlight}</span>
                    {titleSegments.slice(1).join(heroHighlight)}
                  </>
                ) : (
                  heroTitle
                )}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-display text-2xl font-semibold tracking-tight text-foreground/80 md:text-3xl"
              >
                {hero.subtitle ?? "开源创造未来"}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-base text-muted-foreground md:text-lg"
              >
                {hero.description ?? "前者是我对社会的认知，后者是我对未来的畅想。"}
              </motion.p>
            </div>

            <motion.div
              variants={fadeUp}
              custom={2}
              className="flex flex-wrap gap-2"
            >
              {focusTags.map((tag, i) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                >
                  <Badge variant="outline" className="transition-all duration-200">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-3"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild>
                  <Link to="/insights">阅读顿悟系统</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" asChild>
                  <Link to="/blog">阅读技术博客</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="secondary" asChild>
                  <Link to="/game">🎮 玩游戏</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="grid gap-4 md:grid-cols-2"
          >
            {[
              {
                key: "credo",
                title: statements.credo?.title ?? "信条",
                tagline: statements.credo?.tagline ?? "秩序创造自由。",
                body: statements.credo?.body ?? "用结构化与节奏，降低混乱成本，释放创造力。",
              },
              {
                key: "goal",
                title: statements.goal?.title ?? "目标",
                tagline: statements.goal?.tagline ?? "开源创造未来。",
                body: statements.goal?.body ?? "以开放协作沉淀方法与工具，形成长期资产。",
              },
            ].map((item) => (
              <motion.div
                key={item.key}
                initial="rest"
                whileHover="hover"
                variants={cardHover}
              >
                <Card size="sm" className="bg-card/70 shadow-soft transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {item.body}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Games section */}
          <motion.div variants={fadeUp} custom={5}>
            <Card size="sm" className="bg-card/70 shadow-soft transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-5 text-primary" />
                  <CardTitle>小游戏</CardTitle>
                </div>
                <CardDescription>闲暇时刻，放松一下</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    variants={cardHover}
                  >
                    <Link
                      to="/game"
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/60"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                        2K
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-medium">秩序合成</div>
                        <div className="text-xs text-muted-foreground">
                          合并数字，创造秩序。移动端适配，触屏可玩。
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    variants={cardHover}
                  >
                    <Link
                      to="/game/snake"
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/60"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-lg font-bold text-emerald-500">
                        🐍
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-medium">贪吃蛇</div>
                        <div className="text-xs text-muted-foreground">
                          经典贪吃蛇，滑动操作。吃食物，变长，别撞墙。
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="border-t border-border/60 pt-4 text-xs text-muted-foreground"
          >
            简约、清晰、长期主义。
          </motion.footer>
        </motion.section>
      </div>
    </main>
  );
}
