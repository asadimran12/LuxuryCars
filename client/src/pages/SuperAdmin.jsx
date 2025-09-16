import React from "react";
import Superadminslider from "../components/UI/Superadminslider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Context/Authcontent";
import { useEffect } from "react";
import { useState } from "react";

const SuperAdmin = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [profile, setprofile] = useState({});

  useEffect(() => {
    const fetchprofile = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/admin/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setprofile(data.admin);
      } catch (error) {
        console.log(error);
      }
    };

    fetchprofile();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
      <div className="flex">
        <Superadminslider />
        <div className="flex-1 ml-40 min-h-screen bg-gray-50">
          {/* Main Content */}
          <main className=" md:ml-22 p-8 transition-all duration-300">
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-yellow-800">
                  Welcome,{profile.username}{" "}
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
              You are now logged into the Admin panel.
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SuperAdmin;
