import React from "react";

import { useAuth } from "../store/context/LoginContext";

import Mainpage from "../components/mainpage";
import Articles from "../components/Articles";
// import Footer from "../components/Footer";

function Homepage() {
  return (
    <>
      <Mainpage />
      <Articles />
      {/* <Footer/> */}
    </>
  );
}

export default Homepage;
