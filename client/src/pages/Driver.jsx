import React from "react";
import { MapPin, Clock, Route } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const Driver = () => {
  const today = new Date();
  const dateString = today.toDateString();

  const [status, setStatus] = useState("offline");
  const [driver, setDriver] = useState({});
  const [loading, setLoading] = useState(true);

  // Multiple trips
  const recentTrips = [
    {
      passenger: "Ahmed Raza",
      pickup: "Lahore - Gulberg",
      dropoff: "Islamabad - F-7 Markaz",
      distance: "375 km",
      duration: "4h 50m",
      fare: 9500,
      date: "Aug 22, 2025",
    },
    {
      passenger: "Sara Ahmed",
      pickup: "Karachi - Clifton",
      dropoff: "Hyderabad City",
      distance: "160 km",
      duration: "2h 15m",
      fare: 4200,
      date: "Aug 20, 2025",
    },
    {
      passenger: "Ali Khan",
      pickup: "Multan - Cantt",
      dropoff: "Bahawalpur",
      distance: "100 km",
      duration: "1h 30m",
      fare: 2800,
      date: "Aug 18, 2025",
    },
  ];

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGFiMDAzNWMxZmRjZDJlNDE5YTAwZGQiLCJlbWFpbCI6IjIyMDIxNTE5LTE0NkB1b2cuZWR1LnBrIiwicm9sZSI6ImRyaXZlciIsImlhdCI6MTc1NjEwNjEzOCwiZXhwIjoxNzU2MTkyNTM4fQ.TxNcmSUP7ubRYI4cnewlXu_21vuWgmwGXOOS-t4HJW0";

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/driver/driverprofile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setDriver(data.user);
        setStatus(data.user.availabilityStatus || "offline");
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
    try {
      const response = await fetch(
        "http://localhost:3000/api/driver/updateprofile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Availability updated:", data);
        setStatus(newStatus);
        alert(`Driver is now ${newStatus}`);
      } else {
        alert(`❌ Failed to update availability (status: ${newStatus})`);
      }
    } catch (error) {
      console.error("Error fetching driver profile:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Loading driver...</div>;
  }

  return (
    <div className="ml-20 mr-20 mt-5 mb-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center p-5 bg-white rounded-2xl shadow">
        <div>
          <h3 className="font-bold text-2xl">
            Welcome Back, {driver.fullName} 🚗
          </h3>
          <p className="text-gray-600">
            {dateString} — Stay Safe & Drive Smart
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 transition">
            New Rides
          </button>
          <button
            onClick={handleonline}
            className={`px-5 py-2 rounded-2xl text-white transition ${
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
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow text-center">
          <p className="text-gray-500">Earnings</p>
          <p className="text-3xl font-bold text-green-600">Rs. 8,400</p>
          <p className="text-sm text-gray-400">After fee</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow text-center">
          <p className="text-gray-500">Online Time</p>
          <p className="text-3xl font-bold text-blue-600">4h 12m</p>
          <p className="text-sm text-gray-400">Today</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow text-center">
          <p className="text-gray-500">Ratings</p>
          <p className="text-3xl font-bold text-yellow-500">{driver.rating}</p>
          <p className="text-sm text-gray-400">Average</p>
        </div>
      </div>

      {/* Recent Trips */}
      <div>
        <h3 className="font-semibold text-xl mb-4">📍 Recent Trips</h3>
        <div className="space-y-4">
          {recentTrips.map((trip, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow flex justify-between items-center hover:shadow-md transition"
            >
              {/* Left Side - Passenger & Route */}
              <div>
                <p className="font-bold text-lg">{trip.passenger}</p>
                <p className="text-sm text-gray-500 mb-2">{trip.date}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} className="text-green-500" /> {trip.pickup}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} className="text-red-500" /> {trip.dropoff}
                </p>
              </div>

              {/* Right Side - Stats */}
              <div className="text-right">
                <p className="flex items-center gap-1 justify-end text-gray-600 text-sm">
                  <Route size={14} /> {trip.distance}
                </p>
                <p className="flex items-center gap-1 justify-end text-gray-600 text-sm">
                  <Clock size={14} /> {trip.duration}
                </p>
                <p className="text-lg font-bold text-green-600 mt-1">
                  Rs. {trip.fare.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-bold text-lg mb-3">💡 Tips to Earn More</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Go online during peak hours (7–9 AM, 5–8 PM) to get more rides.
          </li>
          <li>Stay near busy areas like airports, bus stands, and malls.</li>
          <li>
            Keep your car clean & comfortable for better ratings and tips.
          </li>
          <li>Accept consecutive rides to maximize hourly earnings.</li>
          <li>Save fuel by avoiding unnecessary waiting & detours.</li>
          <li>Be polite & professional – good service brings repeat riders.</li>
        </ul>
      </div>
    </div>
  );
};

export default Driver;
