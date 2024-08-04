import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Homepage from "./pages/Homepage";
import Articlepage from "./pages/Articlepage";
import Navbar from "./components/Navbar";

const AllRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.key}>
      <Route path="/" element={<Homepage />} />
      <Route path="/article/:id" element={<Articlepage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AnimatePresence>
        <Navbar />
        <AllRoutes />
      </AnimatePresence>
    </HashRouter>
  );
}
