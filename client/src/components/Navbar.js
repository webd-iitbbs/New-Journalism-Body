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
    <nav className="sticky top-0 z-50 bg-[#f9f4ed] p-4 border-b-2 border-[#d8d6d2]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black text-2xl font-bold">
          <Link to="/">MySite</Link>
        </div>
        <ul className="flex space-x-4 relative">
          <li>
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
  const routes = [
    { name: "All Articles", path: "/admin/articles" },
    { name: "Add Article", path: "/admin/add-article" },
    { name: "Add Admin", path: "/admin/add-admin" },
  ];
  return (
    <div>
      <button
        id="dropdownNavbarLink"
        data-dropdown-toggle="dropdownNavbar"
        className="flex items-center justify-between text-black font-medium pb-1 relative"
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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id="dropdownNavbar"
        className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-400"
          aria-labelledby="dropdownLargeButton"
        >
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
