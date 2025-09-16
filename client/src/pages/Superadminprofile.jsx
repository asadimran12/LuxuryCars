import React, { useEffect, useState } from "react";
import Superadminslider from "../components/UI/Superadminslider";
import { useAuth } from "../components/Context/Authcontent";

const Superadminprofile = () => {
  const {  token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
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
        setProfile(data.admin); 
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, [token]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Superadminslider />

      {/* Profile Section */}
      <div className="flex-1 ml-64 p-6">

        {/* Profile Card */}
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <img
              src={`http://localhost:3000${profile.avatar}`} // ✅ Adjust base URL if needed
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 shadow-md"
            />
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <p className="text-gray-500">{profile.role.toUpperCase()}</p>
          </div>

          <div className="mt-6 space-y-3">
            <p>
              <span className="font-semibold"> Email:</span> {profile.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {profile.phone}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {profile.address}
            </p>
            <p>
              <span className="font-semibold"> Date of Birth:</span>{" "}
              {new Date(profile.dob).toLocaleDateString()}
            </p>
          </div>

          {/* Logout Button */}
          <div className="mt-6 text-center">
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Superadminprofile;
