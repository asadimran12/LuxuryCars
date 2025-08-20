import React, { useEffect, useState } from "react";
import Slidebar from "../components/UI/Slidebar";
import { useAuth } from "../components/Context/Authcontent";
import { useNavigate } from "react-router-dom";
import AdminReplyingMessage from "./AdminReplyingMessage";

const Adminqueries = () => {
  const { token, logout } = useAuth();
  const [queries, setQueries] = useState([]);
  const [selectedquerryId, setSelectedquerryId] = useState("");
  const navigate = useNavigate();

  const fetchQueries = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/querry/admin/get",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setQueries(data || []);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchQueries();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Slidebar />

      {/* Main Content */}
      <div className="flex-1 ml-16 md:ml-52 transition-all duration-300 p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-yelow-50 to-yellow-100">
            <div>
              <h2 className="text-3xl font-bold text-yellow-900">
                ❓ User Queries
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View and respond to inquiries submitted by users.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
            >
              Logout
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-yelow-50 to-yellow-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {queries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-8 text-gray-500 italic"
                    >
                      No queries found 🙁
                    </td>
                  </tr>
                ) : (
                  queries.map((query) => (
                    <tr
                      key={query._id}
                      className="hover:bg-yellow-50 transition duration-200"
                    >
                      <td className="px-6 py-4 border-b text-gray-700 font-medium">
                        {query.name}
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600">
                        {query.email}
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600">
                        {query.message}
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600">
                        <div className="flex gap-5">
                          <button
                            onClick={() => setSelectedquerryId(query._id)}
                            className="bg-yellow-600 text-white px-4 py-1.5 rounded-md hover:bg-yellow-700 transition text-sm"
                          >
                            Reply
                          </button>
                          <button className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 transition text-sm">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedquerryId &&
        (() => {
          const selectedQuery = queries.find((q) => q._id === selectedquerryId);
          return (
            <AdminReplyingMessage
              id={selectedQuery._id}
              name={selectedQuery.name}
              subject={selectedQuery.subject}
              email={selectedQuery.email}
              onClose={() => setSelectedquerryId(null)}
            />
          );
        })()}
    </div>
  );
};

export default Adminqueries;
