import React, { useState, useEffect } from "react";
import { API } from "../../store/utils/API";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../store/context/LoginContext";
import { notify } from "../../store/utils/helperFunctions";
import { useNavigate } from "react-router-dom";

const GoogleLoginPage = () => {
  const authCtx = useAuth();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);

  const responseMessage = (response) => {
    console.log(response);
    setResponse(response);
  };

  useEffect(() => {
    if (response) {
      const authenticate = async () => {
        try {
          const resp = await API.post("/api/v1/auth/google-login-signup", {
            token: response.credential,
          });
          console.log(resp.data.user);
          notify("Login successful");
          authCtx.setIsLoggedIn(true);
          authCtx.setName(resp.data.user.name);
          authCtx.setEmail(resp.data.user.email);
          authCtx.setUserId(resp.data.user._id);
          authCtx.setImageUrl(resp.data.user.imageUrl);
          navigate("/");
        } catch (error) {
          console.error("Error authenticating user", error);
          notify("Error authenticating user");
          if (error?.response?.data?.message) {
            notify(error.response.data.message);
          }
        }
      };
      authenticate();
    }
  }, [response, authCtx, navigate]);

  const errorMessage = (error) => {
    console.log(error);
    notify("Error logging in");
  };
  return (
    <div>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
};

export default GoogleLoginPage;
