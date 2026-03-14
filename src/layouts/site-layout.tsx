import { LayoutGrid } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "首页", to: "/" },
  { label: "内容", to: "/content" },
  { label: "案例", to: "/cases" },
  { label: "资源", to: "/resources" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-sm font-medium transition-colors",
    isActive
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );

const navPillClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
    isActive
      ? "border-primary/40 bg-primary/10 text-primary"
      : "border-transparent bg-muted/60 text-muted-foreground hover:text-foreground",
  );

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LayoutGrid className="size-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                HONGMENG CHEN
              </span>
              <span className="block text-sm font-semibold">秩序创造自由</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              长期主义
            </Badge>
            <Badge variant="outline" className="hidden md:inline-flex">
              内容工程
            </Badge>
            <Button size="sm" variant="outline" asChild>
              <a
                href="https://github.com/hongmengchen/hongmengchen.github.io"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
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
        <Outlet />
      </main>

      <Separator className="mx-auto max-w-6xl" />

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col gap-3">
          <p>以工程化思维沉淀内容、工具与协作，让创作成为长期资产。</p>
          <div className="flex flex-wrap gap-4">
            <span>© 2026 Hongmeng Chen</span>
            <span>Vite + React + Tailwind + shadcn/ui</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
