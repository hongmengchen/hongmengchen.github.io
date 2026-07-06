import { useEffect } from "react";
import { LayoutGrid, Github, ArrowUpRight } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSiteConfig } from "@/lib/insight";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "首页", to: "/" },
  { label: "游戏", to: "/game" },
  { label: "贪吃蛇", to: "/game/snake" },
  { label: "顿悟", to: "/insights" },
  { label: "博客", to: "/blog" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative text-sm font-medium transition-colors duration-200",
    isActive
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );

const navPillClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-200",
    isActive
      ? "border-primary/40 bg-primary/10 text-primary"
      : "border-transparent bg-muted/60 text-muted-foreground hover:text-foreground",
  );

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function ActiveIndicator() {
  return (
    <motion.span
      layoutId="nav-active"
      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function SiteLayout() {
  const location = useLocation();
  const siteConfig = getSiteConfig();
  const eyebrow = siteConfig.hero?.eyebrow ?? "HONGMENG CHEN";
  const title = siteConfig.hero?.title ?? "秩序创造自由";
  const navBadges = siteConfig.badges?.nav ?? ["长期主义", "内容工程"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <NavLink to="/" className="group flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
              <LayoutGrid className="size-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                {eyebrow}
              </span>
              <span className="block text-sm font-semibold">{title}</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={navLinkClass}
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && <ActiveIndicator />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {navBadges.map((badge, index) => (
              <Badge
                key={`${badge}-${index}`}
                variant={index === 0 ? "secondary" : "outline"}
                className={
                  index === 0 ? "hidden sm:inline-flex" : "hidden md:inline-flex"
                }
              >
                {badge}
              </Badge>
            ))}
            <Button size="sm" variant="outline" asChild>
              <a
                href="https://github.com/hongmengchen/hongmengchen.github.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                <Github className="size-3.5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-6 pb-3 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={`mobile-${item.to}`}
              to={item.to}
              end={item.to === "/"}
              className={navPillClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Separator className="mx-auto max-w-6xl" />

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col gap-3">
          <p className="leading-relaxed">以工程化思维沉淀内容、工具与协作，让创作成为长期资产。</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>© 2026 Hongmeng Chen</span>
            <span className="flex items-center gap-1">
              使用{" "}
              <a href="https://vite.dev" target="_blank" rel="noreferrer" className="underline underline-offset-2 decoration-border hover:decoration-foreground transition-all">
                Vite
              </a>
              +
              <a href="https://react.dev" target="_blank" rel="noreferrer" className="underline underline-offset-2 decoration-border hover:decoration-foreground transition-all">
                React
              </a>
              +
              <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="underline underline-offset-2 decoration-border hover:decoration-foreground transition-all">
                Tailwind
              </a>
              构建
            </span>
            <a
              href="https://github.com/hongmengchen/hongmengchen.github.io"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-2 decoration-border hover:decoration-foreground transition-all"
            >
              源码 <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
