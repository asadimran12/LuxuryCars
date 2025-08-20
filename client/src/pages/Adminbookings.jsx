import React, { useEffect, useState } from "react";
import Slidebar from "../components/UI/Slidebar";
import { useAuth } from "../components/Context/Authcontent";
import Adminbookingdetails from "./Adminbookingdetails";
import { useNavigate } from "react-router-dom";

const Adminbookings = () => {
  const { token, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const navigate = useNavigate();

  const fetchbookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/car/carbookings",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const bookingdata = await response.json();

      const enrichedbookings = await Promise.all(
        bookingdata.map(async (booking) => {
          try {
            const response = await fetch(
              `http://localhost:3000/api/car/${booking.car}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const carData = await response.json();
            return {
              ...booking,
              carName: carData?.name || "Unknown Car",
            };
          } catch (err) {
            console.error("Error fetching car data:", err);
            return {
              ...booking,
              carName: "Error fetching car",
            };
          }
        })
      );

      setBookings(enrichedbookings);
    } catch (error) {
      console.log("Error fetching bookings:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchbookings();
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
                📅 Car Booking Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View and manage all car bookings made by users.
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
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-yellow-800 uppercase border-b">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500 italic"
                    >
                      No bookings found 🚗
                    </td>
                  </tr>
                ) : (
                  bookings.map((car) => (
                    <tr
                      key={car._id}
                      className="hover:bg-yellow-50 transition duration-200"
                    >
                      <td className="px-6 py-4 border-b text-gray-700 font-medium">
                        {car.carName}
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600">
                        Rs. {car.totalPrice}
                      </td>
                      <td className="px-6 py-4 border-b text-gray-600 capitalize">
                        {car.status}
                      </td>
                      <td className="px-6 py-4 border-b">
                        <button
                          onClick={() => setSelectedBookingId(car._id)}
                          className="bg-yellow-600 text-white px-4 py-1.5 rounded-md hover:bg-yellow-700 transition duration-150 text-sm"
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
      </div>

      {/* Details Popup */}
      {selectedBookingId && (
        <Adminbookingdetails
          id={selectedBookingId}
          onClose={() => setSelectedBookingId(null)}
        />
      )}
    </div>
  );
};

export default Adminbookings;
