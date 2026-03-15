import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@/pages/home";
import SiteLayout from "@/layouts/site-layout";

const Content = lazy(() => import("@/pages/content"));
const Cases = lazy(() => import("@/pages/cases"));
const Resources = lazy(() => import("@/pages/resources"));
const BlogIndex = lazy(() => import("@/pages/blog-index"));
const BlogPost = lazy(() => import("@/pages/blog-post"));

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
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
      element: <SiteLayout />,
      children: [
        { path: "/content", element: withSuspense(<Content />) },
        { path: "/cases", element: withSuspense(<Cases />) },
        { path: "/resources", element: withSuspense(<Resources />) },
        { path: "/blog", element: withSuspense(<BlogIndex />) },
        { path: "/blog/:slug", element: withSuspense(<BlogPost />) },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
