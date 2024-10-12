import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
const AboutUs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    navigate("/", { replace: true });
    setTimeout(() => {
      scrollToElementById("aboutus");
    }, 10);
  }, []);

  const scrollToElementById = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return <div></div>;
};

export default AboutUs;
