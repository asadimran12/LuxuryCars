import React from "react";
import Slidebar from "../components/UI/Slidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context/Authcontent";

const Admin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Clears auth context
    navigate("/login");
  };

  const showroomownerName =
    localStorage.getItem("showroomownerName") || "Admin";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-auto">
        <Slidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-16 lg:ml-52 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        {/* Header Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
              Welcome, {showroomownerName}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your dashboard from the options on the left.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
          >
            Logout
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="text-gray-700 text-base sm:text-lg">
          You are now logged into the showroom panel.
        </div>
      </main>
    </div>
  );
};

export default Admin;
