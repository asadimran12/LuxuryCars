import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCar,
  FaCalendarAlt,
  FaQuestionCircle,
  FaUserShield, // Admin icon
} from "react-icons/fa";

const Slidebar = () => {
  const [isHovered, setHovered] = useState(false);
  const navigate=useNavigate();

  const menuItems = [
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Bookings", path: "/admin/bookings", icon: <FaCalendarAlt /> },
    { name: "Cars", path: "/admin/cars", icon: <FaCar /> },
    { name: "Queries", path: "/admin/queries", icon: <FaQuestionCircle /> },
  ];

  const handleadmin=()=>{
navigate("/admin")
  }

  return (
    <aside
      className={`${
        isHovered ? "w-64" : "w-16"
      } bg-yellow-600 text-white h-screen fixed top-0 left-0 p-4 transition-all duration-300 shadow-lg`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Admin Label / Icon */}
      <div className="flex items-center justify-center mb-6 cursor-pointer" onClick={handleadmin}>
        {isHovered ? (
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        ) : (
          <FaUserShield className="text-2xl" />
        )}
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
            {isHovered && <span className="text-sm">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Slidebar;
