import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const routes = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About Us" },
    { path: "/articles", name: "Articles" },
    { path: "/opinions", name: "Opinions" },
    { path: "/login", name: "Log In" },
  ];
  return (
    <nav className="bg-[#f9f4ed] p-4 border-b-2 border-[#d8d6d2]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black text-2xl font-bold">
          <Link to="/">MySite</Link>
        </div>
        <ul className="flex space-x-4 relative">
          {routes.map((path) => (
            <li key={path.path} className="relative">
              <Link
                to={path.path}
                className={`text-black font-medium pb-1 relative`}
                onClick={() => setActive(path.path)}
              >
                {path.name}
              </Link>
              {active === path.path && (
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
