import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";

const Profile = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data.user);
        setFormData(data.user);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Build FormData for file + text fields
  const handleUpdate = async () => {
    try {
      const form = new FormData();
      for (let key in formData) {
        form.append(key, formData[key]);
      }

      const response = await fetch(
        "http://localhost:3000/api/user/profile/update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          body: form,
        }
      );

      const updatedData = await response.json();
      setUser(updatedData.user);
      setFormData(updatedData.user);
      setEditMode(false);
      setPreview(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-3xl border border-gray-200">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-36 h-36 rounded-full object-cover border-4 border-yellow-500 shadow-md"
          />
        ) : user?.avatar ? (
          <img
            src={`http://localhost:3000${user?.avatar}`}
            alt="User Avatar"
            className="w-36 h-36 rounded-full object-cover border-4 border-yellow-500 shadow-md"
          />
        ) : (
          <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-500">
            {user?.username?.[0] || "U"}
          </div>
        )}
        <h2 className="text-3xl font-bold text-gray-800">
          {user?.username || "User Name"}
        </h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>

      {/* Profile Info */}
      <div className="mt-8 px-6">
        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="username"
              type="text"
              value={formData.username || ""}
              onChange={handleChange}
              placeholder="Name"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              name="phone"
              type="text"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Phone"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              name="dob"
              type="date"
              value={formData.dob?.slice(0, 10) || ""}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              name="address"
              type="text"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none md:col-span-2"
            />
            <input
              name="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData({ ...formData, avatar: file });
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none md:col-span-2"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Name:</strong> {user?.username}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {user?.phone?.toString().padStart(11, "0")}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(user?.dob).toLocaleDateString("en-GB")}
            </p>
            <p className="md:col-span-2">
              <strong>Address:</strong> {user?.address}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          {editMode ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setPreview(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
