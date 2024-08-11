import React, { useState } from "react";
import { Link } from "react-router-dom";
import { notify } from "../../store/utils/helperFunctions";
import { API } from "../../store/utils/API";
import { useAuth } from "../../store/context/LoginContext";
import { useNavigate, useLocation } from "react-router-dom";

const Signup = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get("email");

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== checkPassword) {
      notify("Passwords do not match");
      return;
    }
    if (!password || !token) {
      notify("Please fill all the fields");
      return;
    }
    if (password.length < 8) {
      notify("Password should be atleast 8 characters long");
      return;
    }

    try {
      // Call the signup API
      const response = await API.patch("/api/v1/auth/reset-password", {
        email,
        token,
        password,
      });
      console.log(response.data);
      notify("Password reset successful");
      notify("Please login with your new password", { duration: 5000 });
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password", error);
      notify("Error resetting password");
      if (error?.response?.data?.message) {
        notify(error.response.data.message);
      }
    }
  };

  return (
    <div
      className=" py-6 flex flex-col justify-center align-center sm:py-6"
      style={{ minHeight: "90dvh" }}
    >
      <div className="relative py-3 sm:max-w-xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-6 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Reset Password</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative mb-2 border-b-2">
                  <input
                    autoComplete="off"
                    id="token"
                    name="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="peer placeholder-transparent h-10 w-full border-none outline-none text-gray-900 focus:ring-0"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="token"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Token
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

                <div className="relative border-b-2 mb-2">
                  <input
                    autoComplete="off"
                    id="repassword"
                    name="repassword"
                    type="password"
                    value={checkPassword}
                    onChange={(e) => setCheckPassword(e.target.value)}
                    className="peer placeholder-transparent h-10 w-full  border-none  outline-none text-gray-900 focus:ring-0"
                    placeholder="ReEnter Password"
                  />
                  <label
                    htmlFor="repassword"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    ReEnter Password
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

          <div className="mt-6">
            <Link className=" hover:underline" to="/login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
