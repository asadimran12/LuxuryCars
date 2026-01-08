import React, { useEffect, useState } from "react";
import Slidebar from "../components/UI/Slidebar";
import { useAuth } from "../components/Context/Authcontent";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/apiConfig";

const AdminReview = () => {
  const { token, logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch Reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/reviews/getallreviews`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setReviews(data || []);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-auto">
        <Slidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-16 lg:ml-52 transition-all duration-300 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-yellow-50 to-yellow-100 gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-800">
                ⭐ Review Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View, manage, and inspect all customer reviews.
              </p>
            </div>
            {success && <p className="text-green-600 mb-2">{success}</p>}

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
            >
              Logout
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Reviewer
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Car
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Rating
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Comment
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-gray-500 italic"
                    >
                      No reviews found 📝
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr
                      key={review._id}
                      className="hover:bg-yellow-50 transition duration-200"
                    >
                      <td className="px-3 sm:px-6 py-4 border-b text-gray-700">
                        {review.reviewerid.username || "Unknown"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 border-b text-gray-600">
                        {review.reviewcar.name || "N/A"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 border-b text-gray-600">
                        {review.rating} ⭐
                      </td>
                      <td className="px-3 sm:px-6 py-4 border-b text-gray-600">
                        {review.review}
                      </td>
                      <td className="px-3 sm:px-6 py-4 border-b text-gray-600">
                        <button className="w-full sm:w-auto bg-yellow-600 text-white px-3 sm:px-4 py-1.5 rounded-md hover:bg-yellow-700 transition text-sm">
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReview;
