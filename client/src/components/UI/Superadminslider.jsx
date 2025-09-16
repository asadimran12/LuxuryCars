import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaIdCard,
  FaUserCog,
  FaUserShield,
} from "react-icons/fa";

const Superadminslider = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Users", path: "/superadmin/users", icon: <FaUsers /> },
    { name: "Showrooms", path: "/superadmin/showrooms", icon: <FaBuilding /> },
    { name: "Drivers", path: "/superadmin/drivers", icon: <FaIdCard /> },
    { name: "Profile", path: "/superadmin/profile", icon: <FaUserCog /> },
  ];

  const handleSuperAdmin = () => {
    navigate("/superadmin");
  };

  return (
    <aside className="w-64 bg-yellow-700 text-white h-screen fixed top-0 left-0 p-4 shadow-lg">
      {/* Super Admin Label */}
      <div
        className="flex items-center justify-center mb-6 cursor-pointer"
        onClick={handleSuperAdmin}
      >
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaUserShield className="text-2xl" />
          Super Admin
        </h2>
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
                  : "hover:bg-yellow-600 text-white"
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

export default Superadminslider;
