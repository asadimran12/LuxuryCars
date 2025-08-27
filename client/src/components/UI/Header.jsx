import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { FaUser, FaCar } from "react-icons/fa"; // 🚗 add car icon
import { useAuth } from "../Context/Authcontent";

const Header = () => {
  const { token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/", label: "Home" },
    { path: "/home/services", label: "Services" },
    { path: "/home/blogsposts", label: "Blog" },
    { path: "/home/contactus", label: "Contact Us" },
  ];

  return (
    <header className="bg-white shadow-md py-4 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-bold text-gray-800 cursor-pointer"
          onClick={() => navigate("/")}
        >
          LuxuryCars
        </h1>

        {/* Navigation Links */}
        <nav className="flex gap-6">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`relative text-gray-700 font-medium transition duration-200 hover:text-yellow-600 ${
                location.pathname === path
                  ? "after:w-full after:bg-yellow-500"
                  : "after:w-0"
              } after:absolute after:h-[2px] after:bottom-0 after:left-0 after:transition-all after:duration-300`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex gap-4 items-center">
          {/* Book a Driver */}
          <NavLink
            to="/home/drivers"
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-medium"
          >
            <FaCar size={18} />
            Book a Driver
          </NavLink>

          {/* Show "Join As Driver" only if NOT logged in */}
          {!token && (
            <NavLink
              to="/driver/signup"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
            >
              Join As Driver
            </NavLink>
          )}

          <NavLink
            to="/chat"
            className="flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition duration-200 font-medium"
          >
            <FiMessageSquare size={18} />
            Chat
          </NavLink>

          {/* Profile */}
          {token && (
            <Link to="/home/profile">
              <FaUser
                size={28}
                className="bg-yellow-600 text-white p-1 rounded-full"
              />
            </Link>
          )}

          {/* Auth */}
          {token ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition duration-200"
            >
              <FiLogOut size={20} />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 font-medium transition duration-200"
            >
              <FiLogIn size={20} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
