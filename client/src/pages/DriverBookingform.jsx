import React, { useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/apiConfig";

// Booking Form Component
const BookingForm = ({ driver, onClose, onConfirm }) => {
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [fare, setFare] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  const handleSubmit = () => {
    if (
      !passengerName ||
      !passengerPhone ||
      !pickupLocation ||
      !dropoffLocation ||
      !distance ||
      !duration ||
      !fare
    ) {
      alert("⚠ Please fill all fields!");
      return;
    }

    onConfirm({
      passengerName,
      passengerPhone,
      pickupLocation,
      dropoffLocation,
      distance,
      duration,
      fare,
      bookingDate: bookingDate || new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 shadow-lg w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Book {driver.fullName}</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Passenger Name"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Passenger Phone"
            value={passengerPhone}
            onChange={(e) => setPassengerPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Pickup Location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Dropoff Location"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Distance (e.g. 12 km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Duration (e.g. 25 mins)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Fare (Rs)"
            value={fare}
            onChange={(e) => setFare(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="datetime-local"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page
const BookDriver = () => {
  const { token } = useAuth();
  const [location, setLocation] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driverprofile, setdriverprofile] = useState({});
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(null);
  const navigate = useNavigate();

  // Fetch driver profile
  const handleprofile = async (id) => {
    try {
      setSelectedDriver(id);
      const response = await fetch(
        `${API_URL}/api/auth/driverprofile/${id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setdriverprofile(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Search drivers by location
  const handleLocation = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/driverlocation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentlocation: location }),
        }
      );

      const data = await response.json();
      setDrivers(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Book driver
  const handleBooking = async (driverId, bookingData) => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/driverbook/${driverId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Booking failed!");
        return;
      }
      alert("✅ Booking created successfully!");
      console.log("Booking response:", data);
    } catch (error) {
      console.error("Error booking driver:", error);
      alert("Something went wrong while booking.");
    }
  };

  return (
    <div className="flex justify-center text-center">
      <div className="p-4 max-w-4xl w-full">
        <h2 className="text-xl font-bold mb-3">Book a Driver</h2>

        {/* Search Input */}
        <div className="flex gap-2 justify-center">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location City Name"
            className="border px-3 py-2 rounded w-80"
          />
          <button
            onClick={handleLocation}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {/* Drivers List */}
        <div className="mt-4">
          {drivers.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4">
              {drivers.map((driver) => (
                <li
                  key={driver._id}
                  className="flex items-center gap-4 border p-3 rounded-2xl w-full shadow-md"
                >
                  <img
                    src={`${API_URL}${driver?.profilePhoto}`}
                    alt={driver.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{driver.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {driver.currentlocation}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={
                          driver.availabilityStatus === "online"
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {driver.availabilityStatus}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Rating: {driver.rating} ⭐
                    </p>
                    <p className="text-sm text-gray-500">
                      Trips: {driver.totalTrips}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBookingForm(driver)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold"
                    >
                      Book
                    </button>
                    <button
                      onClick={() => handleprofile(driver._id)}
                      className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition duration-200 font-medium"
                    >
                      View Profile
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No drivers found</p>
          )}
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm
            driver={showBookingForm}
            onClose={() => setShowBookingForm(null)}
            onConfirm={(data) => handleBooking(showBookingForm._id, data)}
          />
        )}
      </div>
    </div>
  );
};

export default BookDriver;
