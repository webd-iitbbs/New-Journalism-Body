import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
const AboutUs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === "/about") {
      navigate("/", { replace: true });
      setTimeout(() => {
        scrollToElementById("aboutus");
      }, 100);
    }
  }, []);

  const scrollToElementById = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return <div>Loading...</div>;
};

export default AboutUs;
