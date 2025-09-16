import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react"; // chat icon
import { useAuth } from "../Context/Authcontent";

const DriverHeader = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout(); // clear token + role
    navigate("/login"); // redirect to login page
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo / Title */}
        <h1
          onClick={() => navigate("/driver")}
          className="text-xl font-bold cursor-pointer hover:text-yellow-400 transition"
        >
          Driver Panel
        </h1>

        {/* Navigation */}
        <nav className="flex space-x-6 items-center">
          <button
            onClick={() => navigate("/driver")}
            className="hover:text-yellow-400 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/driver/boking")}
            className="hover:text-yellow-400 transition"
          >
            Bookings
          </button>
          <button
            onClick={() => navigate("/driver/profile")}
            className="hover:text-yellow-400 transition"
          >
            Profile
          </button>

          {/* Chat button with icon */}
          <button
            onClick={() => navigate("/driver/Allchats")}
            className="flex items-center space-x-2 hover:text-yellow-400 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
          </button>

          {/* Logout button */}
          {token && (
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default DriverHeader;
