import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { notify } from "../../store/utils/helperFunctions";
import { API } from "../../store/utils/API";
import { useAuth } from "../../store/context/LoginContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import GoogleLoginPage from "./GoogleLogin";

const Login = () => {
  const authCtx = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const [path, setPath] = useState(location.pathname);
  console.log(location.pathname);

  useEffect(() => {
    if (path !== location.pathname) {
      setTimeout(() => {
        navigate(path);
      }, 200);
    }
  }, [path]);

  useEffect(() => {
    console.log(location.pathname);
    console.log(location.pathname);
  }, [location.pathname]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      notify("Please fill all the fields");
      return;
    }

    try {
      // Call the login API
      const response = await API.post("/api/v1/auth/login", {
        email,
        password,
      });
      console.log(response.data);
      notify("Login successful");

      authCtx.setIsLoggedIn(true);
      authCtx.setName(response.data?.data?.user?.name);
      authCtx.setEmail(email);
      authCtx.setUserId(response.data?.data?.user?._id);
      authCtx.setAccessToken(response.data?.AccessToken);
      authCtx.setRefreshToken(response.data?.RefreshToken);
      navigate("/");
    } catch (error) {
      console.error("Error logging in", error);
      notify("Error logging in");
      if (error?.response?.data?.message) {
        notify(error.response.data.message);
      }
    }
  };

  const changePath = (path) => {
    setPath(path);
  };

  return (
    <div
      className=" py-6 flex flex-col justify-center align-center sm:py-6"
      style={{ minHeight: "90dvh" }}
    >
      <div className="relative py-3 sm:max-w-xl mx-auto">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div> */}
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform sm:skew-y-0 sm:rounded-3xl"
            initial={{ rotate: 0 }}
            animate={{ rotate: -6, transition: { duration: 0.2 } }}
            exit={{ rotate: 0, transition: { duration: 0.2 } }}
          ></motion.div>
        </AnimatePresence>

        <div className="relative px-4 py-6 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Login</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative mb-2 border-b-2">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer placeholder-transparent h-10 w-full border-none outline-none text-gray-900 focus:ring-0"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative border-b-2 mb-2">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer placeholder-transparent h-10 w-full  border-none  outline-none text-gray-900 focus:ring-0"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <button
                    className="bg-cyan-500 text-white rounded-md px-2 py-1"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-4">
            <GoogleLoginPage />
          </div>

          <div className="mt-6">
            <button
              className=" hover:underline"
              onClick={() => changePath("/signup")}
            >
              Don't have an account ? Signup
            </button>
          </div>
          <div className="mt-3 text-right">
            <button
              className=" hover:underline"
              onClick={() => changePath("/forgot-password")}
              // to="/forgot-password"
            >
              Forgot Password ?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
