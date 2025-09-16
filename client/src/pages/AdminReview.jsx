import React, { useEffect, useState } from "react";
import Slidebar from "../components/UI/Slidebar";
import { useAuth } from "../components/Context/Authcontent";
import { useNavigate } from "react-router-dom";

const AdminReview = () => {
  const { token, logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch Reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/reviews/getallreviews",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Slidebar />

      {/* Main Content */}
      <div className="flex-1 ml-16 md:ml-52 transition-all duration-300 p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-yellow-50 to-yellow-100">
            <div>
              <h2 className="text-3xl font-bold text-yellow-800">
                ⭐ Review Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View, manage, and inspect all customer reviews.
              </p>
            </div>
            {success && <p className="text-green-600 mb-4">{success}</p>}

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
            >
              Logout
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Reviewer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
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
                      <td className="px-6 py-4 border-b text-gray-700">
                        {review.reviewerid.username || "Unknown"}
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600">
                        {review.reviewcar.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600">
                        {review.rating} ⭐
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600">
                        {review.review}
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600">
                        <button className="bg-yellow-600 text-white px-4 py-1.5 rounded-md hover:bg-yellow-700 transition text-sm">
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
