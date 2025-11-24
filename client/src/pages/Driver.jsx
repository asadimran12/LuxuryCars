import React, { useState, useEffect } from "react";
import { MapPin, Clock, Route } from "lucide-react";
import { useAuth } from "../components/Context/Authcontent";
import { useNavigate } from "react-router-dom";

const Driver = () => {
  const today = new Date();
  const dateString = today.toDateString();

  const [status, setStatus] = useState("offline");
  const [driver, setDriver] = useState({});
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchcompletedrides = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/driver/getcompletedrides",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch completed rides");
        const data = await response.json();
        setRides(data.rides);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchcompletedrides();
  }, []);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/driver/driverprofile",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setDriver(data.driver);
        setStatus(data.driver.availabilityStatus || "offline");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching driver profile:", error);
        setLoading(false);
      }
    };
    fetchDriver();
  }, []);

  const handleonline = async () => {
    const newStatus = status === "online" ? "offline" : "online";

    const formData = new FormData();
    formData.append("availabilityStatus", newStatus);
    formData.append(
      newStatus === "online" ? "onlineAt" : "offlineAt",
      new Date().toISOString()
    );

    try {
      const response = await fetch(
        "http://localhost:3000/api/driver/updateprofile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Availability updated:", data);
        setStatus(newStatus);
        alert(`Driver is now ${newStatus}`);
      } else {
        alert(`❌ Failed to update availability`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setLoading(false);
    }
  };

  const formatOnlineTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <div className="p-5 text-center">Loading driver...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="px-4 sm:px-6 lg:px-20 mt-5 mb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-5 bg-white rounded-2xl shadow gap-4">
        <div>
          <h3 className="font-bold text-xl sm:text-2xl">
            Welcome Back, {driver.fullName} 🚗
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            {dateString} — Stay Safe & Drive Smart
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate("/driver/newride")}
            className="flex-1 sm:flex-none px-5 py-2 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            New Rides
          </button>
          <button
            onClick={handleonline}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-2xl text-white transition ${
              status === "online"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {status === "online" ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow text-center">
          <p className="text-gray-500">Earnings</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            Rs. 8,400
          </p>
          <p className="text-sm text-gray-400">After fee</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow text-center">
          <p className="text-gray-500">Online Time</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">
            {formatOnlineTime(driver.totalOnlineTime)}
          </p>
          <p className="text-sm text-gray-400">Today</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow text-center">
          <p className="text-gray-500">Ratings</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-500">
            {driver.rating}
          </p>
          <p className="text-sm text-gray-400">Average</p>
        </div>
      </div>

      {/* Recent Trips */}
      <div>
        <h3 className="font-semibold text-lg sm:text-xl mb-4">📍 Recent Trips</h3>
        <div className="space-y-4">
          {rides.length === 0 ? (
            <p className="text-gray-500">No completed rides yet.</p>
          ) : (
            rides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white p-5 rounded-2xl shadow flex flex-col sm:flex-row justify-between gap-3 hover:shadow-md transition"
              >
                {/* Left Side */}
                <div>
                  <p className="font-bold text-base sm:text-lg">
                    {ride.passengerName}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(ride.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} className="text-green-500" />
                    {ride.pickupLocation}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} className="text-red-500" />
                    {ride.dropoffLocation}
                  </p>
                </div>

                {/* Right Side */}
                <div className="text-left sm:text-right">
                  <p className="flex items-center gap-1 sm:justify-end text-gray-600 text-sm">
                    <Route size={14} /> {ride.distance}
                  </p>
                  <p className="flex items-center gap-1 sm:justify-end text-gray-600 text-sm">
                    <Clock size={14} /> {ride.duration}
                  </p>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    Rs. {ride.fare?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-bold text-lg sm:text-xl mb-3">💡 Tips to Earn More</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base">
          <li>Go online during peak hours (7–9 AM, 5–8 PM) to get more rides.</li>
          <li>Stay near busy areas like airports, bus stands, and malls.</li>
          <li>Keep your car clean & comfortable for better ratings and tips.</li>
          <li>Accept consecutive rides to maximize hourly earnings.</li>
          <li>Save fuel by avoiding unnecessary waiting & detours.</li>
          <li>Be polite & professional – good service brings repeat riders.</li>
        </ul>
      </div>
    </div>
  );
};

export default Driver;
