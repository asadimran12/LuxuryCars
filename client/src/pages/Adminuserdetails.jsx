import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { FaTimes } from "react-icons/fa";

const AdminUserDetails = ({ id, onClose }) => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/auth/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUser(data.finduser);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  if (!user) return null;

  const handledelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        console.log("User deleted");
        onClose();
      } else {
        console.log("User not deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative border border-gray-200 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          👤 User Details
        </h2>

        {/* User Info */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Username:</span>
            <span>{user.username}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Phone:</span>
            <span>{user.phone}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">DOB:</span>
            <span>{new Date(user.dob).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Delete Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handledelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-sm transition duration-200"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
