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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Slidebar />

      {/* Main Content */}
      <main className="flex-1 ml-16 md:ml-52 p-8 transition-all duration-300">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">
              Welcome,{showroomownerName}{" "}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your dashboard from the options on the left.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
          >
            Logout
          </button>
        </div>

        {/* Placeholder or main dashboard content */}
        <div className="text-gray-700 text-lg">
          You are now logged into the showroom panel.
        </div>
      </main>
    </div>
  );
};

export default Admin;
