import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import Superadminslider from "../components/UI/Superadminslider";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Superadmingetdrivers = () => {
  const { token } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [viewalldrivers, setviewalldrivers] = useState(false);
  const [viewdetails, setviewdetails] = useState(null); // ✅ store selected driver

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/admin/drivers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Drivers:", data);
        setDrivers(data.drivers); // assume it's array
      } catch (error) {
        console.log(error);
      }
    };

    fetchDrivers();
  }, [token]);

  // Group drivers by location
  const driverregisterdlocation = drivers.reduce((acc, driver) => {
    const loc = driver.address || "Unknown";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ["Registered Drivers"],
    datasets: [
      {
        label: "Total Drivers",
        data: [drivers.length],
        backgroundColor: "rgba(202, 138, 4, 0.6)",
        borderColor: "rgba(202, 138, 4, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartlocationdata = {
    labels: Object.keys(driverregisterdlocation),
    datasets: [
      {
        label: "Drivers by Location",
        data: Object.values(driverregisterdlocation),
        backgroundColor: "rgba(202, 138, 4, 0.6)",
        borderColor: "rgba(202, 138, 4, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Superadmin Dashboard - Registered Drivers",
      },
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Superadminslider />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6">Drivers Overview</h1>

        {!viewalldrivers ? (
          <div className="bg-white p-6 rounded-xl shadow-md">
            {drivers.length > 0 ? (
              <div
                className="flex gap-6"
                style={{ width: "100%", height: "300px" }}
              >
                <div className="flex-1">
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="flex-1">
                  <Bar data={chartlocationdata} options={chartOptions} />
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No drivers registered yet.</p>
            )}
            <button
              onClick={() => setviewalldrivers(true)}
              className="bg-yellow-600 mt-3 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              View all drivers
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Back button */}
            <button
              onClick={() => setviewalldrivers(false)}
              className="mb-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              ← Back to Charts
            </button>

            <h2 className="text-xl font-bold mb-4">All Registered Drivers</h2>

            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-yellow-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => (
                  <tr
                    key={index}
                    onClick={() => setviewdetails(driver)} // ✅ open details
                    className="cursor-pointer border-b hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-2">{driver.fullName}</td>
                    <td className="px-4 py-2">{driver.email}</td>
                    <td className="px-4 py-2">{driver.address || "N/A"}</td>
                    <td className="px-4 py-2">{driver.phone || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Driver Details Modal */}
      {viewdetails && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-fit max-h-fit overflow-y-auto rounded-xl shadow-lg p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setviewdetails(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={`http://localhost:3000${viewdetails.profilePhoto}`}
                  alt="Driver Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 shadow-md"
                />
                <h2 className="text-2xl font-bold">{viewdetails.fullName}</h2>
                <p className="text-gray-600">{viewdetails.email}</p>
                <p className="text-gray-600">{viewdetails.phone}</p>
              </div>

              <div className="mt-6 space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {viewdetails.address || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Date of Birth:</span>{" "}
                  {viewdetails.dateOfBirth
                    ? new Date(viewdetails.dateOfBirth).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Current Location:</span>{" "}
                  {viewdetails.currentlocation || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">License Number:</span>{" "}
                  {viewdetails.licenseNumber}
                </p>
                <p>
                  <span className="font-semibold">National ID:</span>{" "}
                  {viewdetails.nationalID}
                </p>
                <p>
                  <span className="font-semibold">Background Check:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      viewdetails.backgroundCheckStatus === "pending"
                        ? "bg-yellow-500"
                        : viewdetails.backgroundCheckStatus === "approved"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {viewdetails.backgroundCheckStatus}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Availability:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      viewdetails.availabilityStatus === "online"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {viewdetails.availabilityStatus}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Total Trips:</span>{" "}
                  {viewdetails.totalTrips}
                </p>
                <p>
                  <span className="font-semibold">Total Online Time:</span>{" "}
                  {viewdetails.totalOnlineTime} sec
                </p>

                {/* Rating with stars */}
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Rating:</span>{" "}
                  {viewdetails.rating} ⭐
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Superadmingetdrivers;
