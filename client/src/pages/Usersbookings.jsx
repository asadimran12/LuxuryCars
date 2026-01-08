import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { API_URL } from "../utils/apiConfig";

const Usersbookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Fetch all user bookings + profile
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const [response, profileres] = await Promise.all([
          fetch(`${API_URL}/api/auth/usergetallbookings`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/user/profile`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [bookingsData, userData] = await Promise.all([
          response.json(),
          profileres.json(),
        ]);

        console.log("Bookings:", bookingsData.bookings, "User:", userData.user);

        setBookings(bookingsData.bookings || []); // ✅ only array
        setUser(userData.user || null); // ✅ only user object
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // ✅ Delete booking
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      const response = await fetch(
        `${API_URL}/api/auth/userdelbooking/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        alert("Booking deleted successfully!");
      } else {
        alert(data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading bookings...</p>;
  }

  return (
    <div className="p-4 sm:p-6">
      {user && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-yellow-600">
            {user.username} Bookings
          </h2>
          <div className="mb-6 text-center">
            <p className="text-lg font-medium">👤 {user.email}</p>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 sm:p-5 border rounded-xl shadow-md sm:shadow-lg bg-white hover:shadow-xl transition duration-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
                  🚖 {booking.pickupLocation} ➝ {booking.dropoffLocation}
                </h3>
                <p className="text-sm sm:text-base">
                  <strong>Passenger:</strong> {booking.passengerName} (
                  {booking.passengerPhone})
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Distance:</strong> {booking.distance} km |{" "}
                  <strong>Duration:</strong> {booking.duration} Hours
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Fare:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    Rs. {booking.fare}
                  </span>
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-xs sm:text-sm ${booking.status === "pending"
                        ? "bg-yellow-500"
                        : booking.status === "completed"
                          ? "bg-green-600"
                          : booking.status === "cancelled"
                            ? "bg-red-600"
                            : "bg-blue-600"
                      }`}
                  >
                    {booking.status}
                  </span>
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Payment:</strong> {booking.paymentStatus}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Driver:</strong> {booking.driver?.fullName} (
                  {booking.driver?.email})
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Date:</strong>{" "}
                  {new Date(booking.bookingDate).toLocaleString()}
                </p>
              </div>

              {/* ✅ Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Usersbookings;
