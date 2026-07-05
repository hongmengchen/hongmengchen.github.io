import { Suspense, lazy, useEffect, useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@/pages/home";
import SiteLayout from "@/layouts/site-layout";
import { applySiteTheme, getSiteConfig } from "@/lib/insight";

const Game2048 = lazy(() => import("@/pages/game-2048"));
const BlogIndex = lazy(() => import("@/pages/blog-index"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const InsightIndex = lazy(() => import("@/pages/insight-index"));
const InsightPost = lazy(() => import("@/pages/insight-post"));

const withSuspense = (node: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-muted-foreground">
        内容加载中...
      </div>
    }
  >
    {node}
  </Suspense>
);

function App() {
  const siteConfig = useMemo(() => getSiteConfig(), []);

  useEffect(() => {
    applySiteTheme(siteConfig);
  }, [siteConfig]);

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
      element: <SiteLayout />,
      children: [
        { path: "/game", element: withSuspense(<Game2048 />) },
        { path: "/insights", element: withSuspense(<InsightIndex />) },
        { path: "/insights/:slug", element: withSuspense(<InsightPost />) },
        { path: "/blog", element: withSuspense(<BlogIndex />) },
        { path: "/blog/:slug", element: withSuspense(<BlogPost />) },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
