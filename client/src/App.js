import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";

import Homepage from "./pages/Homepage";
import Articlepage from "./pages/Articlepage";
import AllArticlepage from "./pages/AllArticlepage";
import ErrorPage from "./pages/ErrorPage";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import GoogleLoginPage from "./pages/Auth/GoogleLogin";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import AddAdmin from "./pages/Admin/AddAdmin";
import AddArticle from "./pages/Admin/AddArticle";
import EditArticle from "./pages/Admin/EditArticle";
import AllArticleAdminpage from "./pages/Admin/AllArticles";
import AdminArticlepage from "./pages/Admin/AdminArticlepage";

import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllRoutes = () => {
  const location = useLocation();
  const admin = true;
  return (
    <Routes location={location} key={location.key}>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/google-login" element={<GoogleLoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/articles" element={<AllArticlepage />} />
      <Route path="/article/:slug" element={<Articlepage />} />

      {admin && (
        <>
          <Route path="/admin/add-article" element={<AddArticle />} />
          <Route path="/admin/edit-article/:slugid" element={<EditArticle />} />
          <Route path="/admin/add-admin" element={<AddAdmin />} />
          <Route path="/admin/articles" element={<AllArticleAdminpage />} />
          <Route path="/admin/article/:slug" element={<AdminArticlepage />} />
        </>
      )}

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <div className="bg-[#f9f4ed min-h-full">
      <HashRouter>
        <AnimatePresence>
          <Navbar />
          <AllRoutes />
          <ToastContainer draggable />
          <ReactQueryDevtools initialIsOpen={false} />
        </AnimatePresence>
      </HashRouter>
    </div>
  );
}
