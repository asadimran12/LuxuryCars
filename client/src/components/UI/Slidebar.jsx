import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaCar,
  FaStar,
  FaUserCog,
  FaCalendarAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Slidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Cars", path: "/admin/cars", icon: <FaCar /> },
    { name: "Bookings", path: "/admin/bookings", icon: <FaCalendarAlt /> },
    { name: "Payments", path: "/admin/payments", icon: <FaDollarSign /> },
    { name: "Reviews", path: "/admin/reviews", icon: <FaStar /> },
    { name: "Profile", path: "/admin/profile", icon: <FaUserCog /> },
  ];

  const handleadmin = () => {
    navigate("/admin");
    setIsOpen(false); // close on mobile after navigating
  };

  return (
    <>
      {/* Hamburger button (mobile only) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-yellow-600 text-2xl bg-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-yellow-600 text-white p-4 shadow-lg transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block`}
      >
        {/* Close button (mobile only) */}
        <button
          className="absolute top-4 right-4 text-white text-xl md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>

        {/* Admin Label */}
        <div
          className="flex items-center justify-center mb-6 cursor-pointer"
          onClick={handleadmin}
        >
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)} // close sidebar after navigation (mobile)
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-white text-yellow-700 font-semibold"
                    : "hover:bg-yellow-500 text-white"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm md:text-base">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Slidebar;
