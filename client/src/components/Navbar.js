import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../store/context/LoginContext";
import { VscListSelection } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import { notify } from "../store/utils/helperFunctions";
import logo from './../assets/logo.png'
const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false); // State for hamburger menu
  const authCtx = useAuth();
  console.log(authCtx);
  const routes = [
    { path: "/", name: "Home", title: "Home" },
    { path: "/about", name: "About Us" },
    { path: "/articles", name: "Articles" },
    { path: "/opinions", name: "Opinions" },
    !authCtx.isLoggedIn
      ? { path: "/login", name: "Log In", title: "LogIn to full access" }
      : null,
  ].filter(Boolean);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [active, location.pathname]);

  return (
    <nav
      className="sticky top-0 z-50 bg-[#f9f4ed] p-4 border-b-2 border-[#d8d6d2]"
      style={{ fontFamily: "HelveticaNeue, Arial, sans-serif" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-black text-3xl font-semibold flex flex-row">
          <li className="flex title-font font-medium items-center md:justify-start justify-center text-white mr-1 sm:mr-3">
            <img
              src={logo}
              alt="Oracle Logo"
              className="w-16 h-16 rounded-full"
            />
            {/* <span className="ml-3 text-3xl">Oracle</span> */}
          </li>
          <Link to="/" className="pt-3">ORACLE</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 relative items-center text-lg">
          <ul className="flex space-x-4">
            <li key="admin">
              <AdminRoutes />
            </li>
            {routes.map((path) => (
              <motion.li
                key={path.path}
                className="relative"
                title={path.title}
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              >
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
              </motion.li>
            ))}
            <li key="profile">
              <Profiles />
            </li>
          </ul>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden flex items-center justify-center text-black"
          onClick={handleToggle}
        >
          {!isOpen ? (
            <RxHamburgerMenu size={24} />
          ) : (
            <VscListSelection size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className={`${isOpen ? "block" : "hidden"
          } md:hidden absolute top-16 left-0 w-full bg-[#f9f4ed] border-t-2 border-[#d8d6d2] shadow-lg`}
      >
        <ul className="py-4 text-center text-lg">
          <li
            key="admin"
            className="block px-4 py-2 text-black font-medium text-center flex justify-center"
          >
            <AdminRoutes />
          </li>
          {routes.map((path) => (
            <li key={path.path} className="py-2">
              <Link
                to={path.path}
                className={`block px-4 py-2 text-black font-medium`}
                onClick={() => {
                  setActive(path.path);
                  setIsOpen(false); // Close menu on link click
                }}
              >
                {path.name}
              </Link>
            </li>
          ))}

          <li className="block px-4 py-2 text-black font-medium text-center flex justify-center">
            <Profiles />
          </li>
        </ul>
      </motion.div>
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
        className="flex items-center justify-between text-black font-medium relative"
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

      <motion.div
        id="dropdownNavbar"
        className={`absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ${isOpen ? "block" : "hidden"
          }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="dropdownNavbarLink"
        >
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsOpen(false)} // Close dropdown on link click
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

const Profiles = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authCtx = useAuth();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  if (!authCtx.isLoggedIn) {
    return null;
  }
  const logouthandler = () => {
    setIsOpen(false);
    authCtx.clearAuth();
    notify("Logging Out Successful.", "light");
  };

  return (
    <div className="relative">
      <button
        id="dropdownNavbarLink"
        title={authCtx.name + " \n" + authCtx.email}
        onClick={handleToggle}
        className="flex items-center justify-between text-black font-medium relative"
      >
        <img
          src={
            authCtx?.imageUrl ||
            "https://img.freepik.com/vector-premium/icono-perfil-avatar_188544-4755.jpg?w=360"
          }
          alt="profile"
          width={25}
          height={25}
          className="rounded-2xl"
        />
      </button>

      <motion.div
        id="dropdownNavbar"
        className={`absolute right-[-10px] z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ${isOpen ? "block" : "hidden"
          }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="dropdownNavbarLink"
        >
          {/* <li key={route.path}>
            <Link
              to={route.path}
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)} // Close dropdown on link click
            >
              {route.name}
            </Link>
          </li> */}

          <li
            key={"logout"}
            onClick={() => logouthandler()}
            className="cursor-pointer"
          >
            <p className="block px-4 py-2 hover:bg-gray-100">Logout</p>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Navbar;
