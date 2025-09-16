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

const Superadmingetshowrooms = () => {
  const { token } = useAuth();
  const [showrooms, setShowrooms] = useState([]);
  const [viewAllShowrooms, setViewAllShowrooms] = useState(false);
  const [viewdetails, setviewdetails] = useState(null);

  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/admin/showrooms",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Showrooms:", data);
        setShowrooms(data.showrooms); // assume it's array
      } catch (error) {
        console.log(error);
      }
    };

    fetchShowrooms();
  }, [token]);

  // Group showrooms by location
  const showroomLocation = showrooms.reduce((acc, showroom) => {
    const loc = showroom.location || "Unknown";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ["Registered Showrooms"],
    datasets: [
      {
        label: "Total Showrooms",
        data: [showrooms.length],
        backgroundColor: "rgba(202, 138, 4, 0.6)",
        borderColor: "rgba(202, 138, 4, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartLocationData = {
    labels: Object.keys(showroomLocation),
    datasets: [
      {
        label: "Showrooms by Location",
        data: Object.values(showroomLocation),
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
        text: "Superadmin Dashboard - Registered Showrooms",
      },
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Superadminslider />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6">Showrooms Overview</h1>

        {!viewAllShowrooms ? (
          <div className="bg-white p-6 rounded-xl shadow-md">
            {showrooms.length > 0 ? (
              <div
                className="flex gap-6"
                style={{ width: "100%", height: "300px" }}
              >
                <div className="flex-1">
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="flex-1">
                  <Bar data={chartLocationData} options={chartOptions} />
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No Showrooms registered yet.</p>
            )}
            <button
              onClick={() => setViewAllShowrooms(true)}
              className="bg-yellow-600 mt-3 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              View all Showrooms
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Back button */}
            <button
              onClick={() => setViewAllShowrooms(false)}
              className="mb-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              ← Back to Charts
            </button>

            <h2 className="text-xl font-bold mb-4">All Registered Showrooms</h2>

            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-yellow-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Showroom Name</th>
                  <th className="px-4 py-2 text-left">Owner</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {showrooms.map((showroom, index) => (
                  <tr
                    key={index}
                    onClick={() => setviewdetails(showroom)}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-2">{showroom.showroomName}</td>
                    <td className="px-4 py-2">{showroom.ownerName}</td>
                    <td className="px-4 py-2">{showroom.location || "N/A"}</td>
                    <td className="px-4 py-2">
                      {showroom.contactNumber || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewdetails && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-fit p-3 max-h-fit overflow-y-auto rounded-xl shadow-lg p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setviewdetails(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-4">
              <img
                src={`http://localhost:3000${viewdetails.showroompic}`}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 shadow-md"
              />
              <h2 className="text-2xl font-bold">{viewdetails.showroomName}</h2>

              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Owner Name:</span>{" "}
                {viewdetails.ownerName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {viewdetails.email}
              </p>

              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Established Year:
                </span>{" "}
                {viewdetails.establishedYear}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Address:</span>{" "}
                {viewdetails.location}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Rating:</span>{" "}
                {viewdetails.rating} ⭐
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Description:
                </span>{" "}
                {viewdetails.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Superadmingetshowrooms;
