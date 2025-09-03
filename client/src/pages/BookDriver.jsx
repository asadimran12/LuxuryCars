import React, { useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookDriver = () => {
  const { token } = useAuth();
  const [location, setLocation] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driverprofile, setdriverprofile] = useState({});
  const [selectedDriver, setSelectedDriver] = useState(null);
  const navigate = useNavigate();

  const handleprofile = async (id) => {
    try {
      setSelectedDriver(id);
      const response = await fetch(
        `http://localhost:3000/api/auth/driverprofile/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.log("Error fetching profile");
      }
      const data = await response.json();
      setdriverprofile(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLocation = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/driverlocation`,
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
                    src={`http://localhost:3000${driver?.profilePhoto}`}
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
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold">
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

        {/* Driver Profile Modal */}
        {selectedDriver && (
          <div
            className="fixed inset-0 bg-white/40 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setSelectedDriver(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 shadow-lg w-[400px] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedDriver(null)}
              >
                ✕
              </button>

              {/* Driver Profile */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`http://localhost:3000${driverprofile?.profilePhoto}`}
                  alt="Driver"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {driverprofile.fullName}
                  </h2>
                  <p
                    className={`text-sm ${
                      driverprofile.availabilityStatus === "online"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {driverprofile.availabilityStatus}
                  </p>
                </div>
              </div>

              {/* Driver Details */}
              <div className="space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Email:</strong> {driverprofile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {driverprofile.phone}
                </p>
                <p>
                  <strong>License No:</strong> {driverprofile.licenseNumber}
                </p>
                <p>
                  <strong>National ID:</strong> {driverprofile.nationalID}
                </p>
                <p>
                  <strong>DOB:</strong>{" "}
                  {new Date(driverprofile.dateOfBirth).toLocaleDateString()}
                </p>
                <p>
                  <strong>Address:</strong> {driverprofile.address}
                </p>
                <p>
                  <strong>Current Location:</strong>{" "}
                  {driverprofile.currentlocation}
                </p>
                <p>
                  <strong>Background Check:</strong>{" "}
                  {driverprofile.backgroundCheckStatus}
                </p>
                <p>
                  <strong>Verified:</strong>{" "}
                  {driverprofile.isVerified ? "Yes ✅" : "No ❌"}
                </p>
                <p>
                  <strong>Rating:</strong> {driverprofile.rating} ⭐
                </p>
                <p>
                  <strong>Total Trips:</strong> {driverprofile.totalTrips}
                </p>
              </div>

              {/* Book Button */}
              <div className="flex gap-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200 font-semibold">
                  Book
                </button>
                <button
                  onClick={() => {
                    if (driverprofile?._id) {
                      console.log("Driver ID:", driverprofile._id);
                      // Example: navigate to chat page with driverId
                      navigate(`/home/chat/${driverprofile._id}`, {
                        state: { driverId: driverprofile._id },
                      });
                    } else {
                      console.log("Driver not loaded yet");
                    }
                  }}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition duration-200 font-medium"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDriver;
