import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";

import SiteLayout from "@/layouts/site-layout";
import Cases from "@/pages/cases";
import Content from "@/pages/content";
import Home from "@/pages/home";
import Resources from "@/pages/resources";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="content" element={<Content />} />
          <Route path="cases" element={<Cases />} />
          <Route path="resources" element={<Resources />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
