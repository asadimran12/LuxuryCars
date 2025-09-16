import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaDollarSign,
  FaCar,
  FaStar,
  FaUserCog,
  FaCalendarAlt,
} from "react-icons/fa";

const Slidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Cars", path: "/admin/cars", icon: <FaCar /> },
    { name: "Bookings", path: "/admin/bookings", icon: <FaCalendarAlt /> },
    { name: "Payments", path: "/admin/payments", icon: <FaDollarSign /> },
    { name: "Reviews", path: "/admin/reviews", icon: <FaStar /> },
    { name: "Profile", path: "/admin/profile", icon: <FaUserCog /> },
  ];

  const handleadmin = () => {
    navigate("/admin");
  };

  return (
    <aside className="w-64 bg-yellow-600 text-white h-screen fixed top-0 left-0 p-4 shadow-lg">
      {/* Admin Label / Icon */}
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
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-white text-yellow-700 font-semibold"
                  : "hover:bg-yellow-500 text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Slidebar;
