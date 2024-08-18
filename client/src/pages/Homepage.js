import React from "react";

import { useAuth } from "../store/context/LoginContext";
import Articles from "../components/Articles";

const Homepage = () => {
  const authCtx = useAuth();
  console.log(authCtx);
  return (
    <div className="w-full">
      Homepage
      <Articles />
    </div>
  );
};

export default Homepage;
