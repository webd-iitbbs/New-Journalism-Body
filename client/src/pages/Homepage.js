import React from "react";
import { useAuth } from "../store/context/LoginContext";
const Homepage = () => {
  const authCtx = useAuth();
  console.log(authCtx);
  return <div className="w-full">Homepage</div>;
};

export default Homepage;
