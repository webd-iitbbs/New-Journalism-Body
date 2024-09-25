import React from "react";

import { useAuth } from "../store/context/LoginContext";
import Mainpage from "../components/mainpage";
import Articles from "../components/Articles";
function Homepage() {
  return (
    <>
      <Mainpage />
      <Articles />
    </>
  );
}

export default Homepage;
