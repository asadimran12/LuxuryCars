import React from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  User,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

const Mobiledrivernavbar = () => {
  const links = [
    {
      path: "/driver",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: "/driver/boking",
      label: "Bookings",
      icon: <CalendarCheck className="w-5 h-5" />,
    },
    {
      path: "/driver/profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      path: "/driver/Allchats",
      label: "Chat",
      icon: <MessageCircle className="w-5 h-5" />,
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

export default Mobiledrivernavbar;
