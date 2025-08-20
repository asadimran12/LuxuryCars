import React, { useEffect, useState } from "react";
import Slidebar from "../components/UI/Slidebar";
import { useAuth } from "../components/Context/Authcontent";
import AdminUserDetails from "./Adminuserdetails";
import { useNavigate } from "react-router-dom";

const Adminusers = () => {
  const { token, logout } = useAuth();
  const [usersdetails, setusersdetails] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const fetchusers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setusersdetails(data.userrole || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchusers();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Slidebar />

      {/* Main Content */}
      <main className="flex-1 ml-16 md:ml-52 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-yelow-50 to-yellow-100">
            <div>
              <h2 className="text-3xl font-bold text-yellow-800">👥 User Management</h2>
              <p className="text-sm text-gray-600 mt-1">View, manage and inspect registered users.</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
            >
              Logout
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-yelow-50 to-yellow-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersdetails.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500 italic">
                      No users found 🕵️‍♂️
                    </td>
                  </tr>
                ) : (
                  usersdetails.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50 transition duration-200">
                      <td className="px-6 py-4 border-b text-gray-700 font-medium">{user.username}</td>
                      <td className="px-6 py-4 border-b text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 border-b">
                        <button
                          onClick={() => setSelectedUserId(user._id)}
                            className="bg-yellow-600 text-white px-4 py-1.5 rounded-md hover:bg-yellow-700 transition text-sm"
                       
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {selectedUserId && (
        <AdminUserDetails
          id={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default Adminusers;
