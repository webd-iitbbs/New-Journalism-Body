import React from "react";

import { useAuth } from "../store/context/LoginContext";

import Mainpage from "../components/mainpage";
import Articles from "../components/Articles";
import Announcement from "../components/announcement";
// import Footer from "../components/Footer";

function Homepage() {
  return (
    <>
      <Announcement/>
      <Mainpage />
      <Articles />
      {/* <Footer/> */}
    </>
  );
}

export default Homepage;
