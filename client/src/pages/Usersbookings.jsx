import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { API_URL } from "../utils/apiConfig";

const Usersbookings = () => {
  const { token } = useAuth();
  const [carBookings, setCarBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Fetch user bookings, car bookings, and profile
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

        console.log("User Bookings:", bookingsData.bookings);
        console.log("Car Bookings:", bookingsData.carbookings);

        setUserBookings(bookingsData.bookings || []);
        setCarBookings(bookingsData.carbookings || []);
        setUser(userData.user || null);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // ✅ Delete booking (works for user bookings)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`${API_URL}/api/auth/userdelbooking/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUserBookings((prev) => prev.filter((b) => b._id !== id));
        alert("Booking deleted successfully!");
      } else {
        alert(data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading bookings...</p>;
  }

  return (
    <div className="p-4 sm:p-6">
      {/* ✅ User Info */}
      {user && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-yellow-600">
            {user.username} Bookings
          </h2>
          <p className="text-lg font-medium">👤 {user.username}</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
      )}

      {/* ✅ User Bookings Section */}
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Driver Bookings</h3>
      {userBookings.length === 0 ? (
        <p className="text-gray-500 mb-6">No driver bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userBookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 sm:p-5 border rounded-xl shadow-md bg-white hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
                  🚖 {booking.pickupLocation} ➝ {booking.dropoffLocation}
                </h4>
                <p className="text-sm sm:text-base">
                  <strong>Passenger:</strong> {booking.passengerName} ({booking.passengerPhone})
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Distance:</strong> {booking.distance} km | <strong>Duration:</strong> {booking.duration} Hours
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Fare:</strong> <span className="text-green-600 font-semibold">Rs. {booking.fare}</span>
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
              </div>
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

      {/* ✅ Car Bookings Section */}
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Car Bookings</h3>
      {carBookings.length === 0 ? (
        <p className="text-gray-500">No car bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carBookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 sm:p-5 border rounded-xl shadow-md bg-white hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
                  🚗 {booking.car.name} ({booking.car.brand} - {booking.car.model})
                </h4>
                <p className="text-sm sm:text-base">
                  <strong>Year:</strong> {booking.car.year}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-xs sm:text-sm ${booking.status === "Pending"
                        ? "bg-yellow-500"
                        : booking.status === "Completed"
                          ? "bg-green-600"
                          : booking.status === "Cancelled"
                            ? "bg-red-600"
                            : "bg-blue-600"
                      }`}
                  >
                    {booking.status}
                  </span>
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Total Price:</strong> Rs. {booking.totalPrice}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Booking Dates:</strong>{" "}
                  {new Date(booking.startDate).toLocaleDateString()} ➝ {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Usersbookings;
