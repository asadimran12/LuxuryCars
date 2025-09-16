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

const Superadmingetusers = () => {
  const { token } = useAuth();
  const [Users, setUsers] = useState([]);
  const [viewallusers, setviewallusers] = useState(false);
  const [viewdetails, setviewdetails] = useState(null); // ✅ store selected user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data.userrole);
        setUsers(data.userrole); // assume it's array
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [token]);

  // Group users by location
  const userregisterdlocation = Users.reduce((acc, user) => {
    const loc = user.address || "Unknown";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ["Registered Users"],
    datasets: [
      {
        label: "Total Users",
        data: [Users.length],
        backgroundColor: "rgba(202, 138, 4, 0.6)",
        borderColor: "rgba(202, 138, 4, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartlocationdata = {
    labels: Object.keys(userregisterdlocation),
    datasets: [
      {
        label: "Users by Location",
        data: Object.values(userregisterdlocation),
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
        text: "Superadmin Dashboard - Registered Users",
      },
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Superadminslider />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6">Users Overview</h1>

        {/* Show Charts OR Users Table */}
        {!viewallusers ? (
          <div className="bg-white p-6 rounded-xl shadow-md">
            {Users.length > 0 ? (
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
              <p className="text-gray-600">No Users registered yet.</p>
            )}
            <button
              onClick={() => setviewallusers(true)}
              className="bg-yellow-600 mt-3 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              View all Users
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Back button */}
            <button
              onClick={() => setviewallusers(false)}
              className="mb-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              ← Back to Charts
            </button>

            <h2 className="text-xl font-bold mb-4">All Registered Users</h2>

            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-yellow-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {Users.map((user, index) => (
                  <tr
                    key={index}
                    onClick={() => setviewdetails(user)} // ✅ store user
                    className="cursor-pointer border-b hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.address || "N/A"}</td>
                    <td className="px-4 py-2">{user.role || "User"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
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
                src={`http://localhost:3000${viewdetails.avatar}`}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 shadow-md"
              />
              <h2 className="text-2xl font-bold">{viewdetails.username}</h2>

              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {viewdetails.email}
              </p>

              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Phone:</span>{" "}
                {viewdetails.phone || "N/A"}
              </p>

              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Address:</span>{" "}
                {viewdetails.address || "N/A"}
              </p>

              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Date of Birth:
                </span>{" "}
                {viewdetails.dob
                  ? new Date(viewdetails.dob).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Superadmingetusers;
