import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import MapComponent from "../components/MapComponent";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Driverbookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/driver/getallbookings",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setBookings(data.bookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle status update
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/driver/updatebooking/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      const updated = await response.json();

      // Update state locally
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: updated.status } : b))
      );
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading bookings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Driver Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-5 rounded-2xl shadow-md border bg-white hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">
                  Passenger: {booking.passengerName}
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    booking.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "ongoing"
                      ? "bg-blue-100 text-blue-700"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                📍 Pickup:{" "}
                <span className="font-medium">{booking.pickupLocation}</span>
              </p>
              <p className="text-sm text-gray-600">
                🎯 Dropoff:{" "}
                <span className="font-medium">{booking.dropoffLocation}</span>
              </p>
              <p className="text-sm text-gray-600">
                📞 Phone: {booking.passengerPhone}
              </p>
              {/* Show Map */}
              <div className="mt-4">
                <MapComponent
                  pickupCoords={booking.pickupCoords} // e.g. [31.582045, 74.329376]
                  dropoffCoords={booking.dropoffCoords} // e.g. [31.5204, 74.3587]
                />
              </div>

              <div className="flex justify-between mt-4 text-sm font-medium">
                <p>🚗 Distance: {booking.distance} KM</p>
                <p>⏱ Duration: {booking.duration} hours</p>
                <p>💰 Fare: Rs {booking.fare}</p>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Booking Date: {new Date(booking.bookingDate).toLocaleString()}
              </p>

              {/* Approve & Cancel buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateBookingStatus(booking._id, "ongoing")}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  disabled={booking.status !== "pending"}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateBookingStatus(booking._id, "cancelled")}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  disabled={booking.status !== "pending"}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (booking?.bookedby) {
                      navigate(`/home/chat/${booking.bookedby}`, {});
                      console.log("Navigating to chat with:", booking.bookedby);
                    } else {
                      console.log("User not loaded yet");
                    }
                  }}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition duration-200 font-medium"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Driverbookings;
