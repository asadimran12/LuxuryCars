import React from "react";
import { NavLink } from "react-router-dom";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../Context/Authcontent"; 

const Header = () => {
  const { token, logout } = useAuth(); // Destructure token and logout

  return (
    <header className="bg-white shadow-md py-4 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-800">LuxuryCars</h1>

        {/* Navigation Links */}
        <nav className="flex gap-6">
          {["/", "/home/services", "/home/blogsposts", "/home/contactus"].map((path, idx) => {
            const labels = ["Home", "Services", "Blog", "Contact Us"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `relative text-gray-700 font-medium transition duration-200 hover:text-yellow-600 ${
                    isActive ? "after:w-full after:bg-yellow-500" : "after:w-0"
                  } after:absolute after:h-[2px] after:bottom-0 after:left-0 after:transition-all after:duration-300`
                }
              >
                {labels[idx]}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile & Auth */}
        <div className="flex gap-3 items-center">
          <NavLink to="/home/profile">
            <FaUser
              size={28}
              className="bg-yellow-600 text-white p-1 rounded-full"
            />
          </NavLink>

          {token ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition duration-200"
            >
              <FiLogOut size={20} />
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 font-medium transition duration-200"
            >
              <FiLogIn size={20} />
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
