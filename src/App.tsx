import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SiteLayout from "@/layouts/site-layout";
import BlogIndex from "@/pages/blog-index";
import BlogPost from "@/pages/blog-post";
import Cases from "@/pages/cases";
import Content from "@/pages/content";
import Home from "@/pages/home";
import Resources from "@/pages/resources";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
      element: <SiteLayout />,
      children: [
        { path: "/content", element: <Content /> },
        { path: "/cases", element: <Cases /> },
        { path: "/resources", element: <Resources /> },
        { path: "/blog", element: <BlogIndex /> },
        { path: "/blog/:slug", element: <BlogPost /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
