import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import Slidebar from "../components/UI/Slidebar";

const AdminProfile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // ✅ Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/showroom/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      setProfile(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // ✅ Update Profile
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/showroomowner/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        setProfile(data.owner);
        setEditMode(false);
      } else {
        alert(data.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="flex">
      <Slidebar />
      <div className="flex-1 flex justify-center items-start p-8 bg-gray-100 min-h-screen">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:3000${profile.showroompic}`}
              alt="Profile"
              className="w-28 h-28 rounded-full shadow-md object-cover border-4 border-yellow-400"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {profile.ownerName}
            </h2>
            <p className="text-gray-500">{profile.email}</p>
          </div>

          {/* Profile Info */}
          {!editMode ? (
            <div className="mt-6 space-y-4 text-gray-700">
              <div>
                <span className="font-semibold">Showroom:</span>{" "}
                {profile.showroomName}
              </div>
              <div>
                <span className="font-semibold">Contact:</span>{" "}
                {profile.contactNumber || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Location:</span>{" "}
                {profile.location || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Established:</span>{" "}
                {profile.establishedYear || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Description:</span>{" "}
                {profile.description || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Rating:</span>{" "}
                {profile.rating || 0} ⭐
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-4">
                {profile.socialLinks?.facebook && (
                  <a
                    href={profile.socialLinks.facebook}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                )}
                {profile.socialLinks?.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    className="text-pink-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                )}
                {profile.socialLinks?.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          ) : (
            // Editable Form
            <div className="mt-6 space-y-4">
              {/* Owner Name */}
              <input
                type="text"
                value={formData.ownerName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value })
                }
                placeholder="Owner Name"
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="text"
                value={formData.showroomName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, showroomName: e.target.value })
                }
                placeholder="Showroom Name"
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="text"
                value={formData.contactNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                placeholder="Contact Number"
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Location"
                className="w-full border rounded-md px-3 py-2"
              />

              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="number"
                value={formData.establishedYear || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    establishedYear: e.target.value,
                  })
                }
                placeholder="Established Year"
                className="w-full border rounded-md px-3 py-2"
              />

              {/* Social Links */}
              {["facebook", "instagram", "twitter"].map((platform) => (
                <input
                  key={platform}
                  type="text"
                  value={formData.socialLinks?.[platform] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        [platform]: e.target.value,
                      },
                    })
                  }
                  placeholder={`${platform} link`}
                  className="w-full border rounded-md px-3 py-2"
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
