import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiEdit3,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";

const MobileNavbar = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "Home", icon: <FiHome size={18} /> },
    {
      path: "/home/services",
      label: "Services",
      icon: <FiBookOpen size={18} />,
    },
    { path: "/home/blogsposts", label: "Blog", icon: <FiEdit3 size={18} /> },
    {
      path: "/home/contactus",
      label: "Contact Us",
      icon: <FiPhone size={18} />,
    },
    {
      path: "/home/UsersAllbookings",
      label: "Bookings",
      icon: <FiCalendar size={18} />, // ✅ updated
    },
  ];

  return (
    <div className=" fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md lg:hidden">
      <nav className="flex justify-around items-center bg-white shadow-lg rounded-2xl px-4 py-3 border border-gray-200">
        {links.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-2 text-gray-700 font-medium transition duration-200 hover:text-yellow-600 ${
              location.pathname === path
                ? "after:w-full after:bg-yellow-500"
                : "after:w-0"
            } after:absolute after:h-[2px] after:bottom-0 after:left-0 after:transition-all after:duration-300`}
          >
            <div className="flex flex-col justify-center items-center">
              {icon}
              {label}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavbar;
