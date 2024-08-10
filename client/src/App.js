import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";

import Homepage from "./pages/Homepage";
import Articlepage from "./pages/Articlepage";
import AllArticlepage from "./pages/AllArticlepage";

import AddArticle from "./pages/Admin/AddArticle";
import { ReactQueryDevtools } from "react-query/devtools";

const AllRoutes = () => {
  const location = useLocation();
  const admin = true;
  return (
    <Routes location={location} key={location.key}>
      <Route path="/" element={<Homepage />} />
      <Route path="/articles" element={<AllArticlepage />} />
      <Route path="/article/:slug" element={<Articlepage />} />

      {admin && <Route path="/admin/add-article" element={<AddArticle />} />}
    </Routes>
  );
};

export default function App() {
  return (
    <div className="bg-[#f9f4ed">
      <HashRouter>
        <AnimatePresence>
          <Navbar />
          <AllRoutes />
          <ReactQueryDevtools initialIsOpen={false} />
        </AnimatePresence>
      </HashRouter>
    </div>
  );
}
