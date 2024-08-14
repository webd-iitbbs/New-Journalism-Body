import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../store/context/LoginContext";
const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const authCtx = useAuth();

  const routes = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About Us" },
    { path: "/articles", name: "Articles" },
    { path: "/opinions", name: "Opinions" },
    !authCtx.isLoggedIn ? { path: "/login", name: "Log In" } : null,
  ].filter(Boolean);
  return (
    <nav
      className="sticky top-0 z-50 bg-[#f9f4ed] p-4 border-b-2 border-[#d8d6d2]"
      style={{ fontFamily: "HelveticaNeue, Arial, sans-serif" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black text-3xl font-semibold">
          <Link to="/">ORACLE</Link>
        </div>
        <ul className="flex space-x-4 relative items-center text-lg">
          <li key="admin">
            <AdminRoutes />
          </li>
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

const AdminRoutes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authCtx = useAuth();
  const routes = [
    { name: "All Articles", path: "/admin/articles" },
    { name: "Add Article", path: "/admin/add-article" },
    { name: "Add Admin", path: "/admin/add-admin" },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  if (!authCtx.isAdmin) {
    return null; // Return null if the user is not an admin
  }

  return (
    <div className="relative">
      <button
        id="dropdownNavbarLink"
        onClick={handleToggle}
        className="flex items-center justify-between text-black font-medium  relative"
      >
        Admin
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id="dropdownNavbar"
        className={`absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-400"
          aria-labelledby="dropdownNavbarLink"
        >
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setIsOpen(false)} // Close dropdown on link click
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
