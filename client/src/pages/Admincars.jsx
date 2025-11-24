import React, { useEffect, useState } from "react";
import Slidebar from "../components/UI/Slidebar";
import { useAuth } from "../components/Context/Authcontent";
import AdminCarDetails from "./Admincardetails";
import { useNavigate } from "react-router-dom";

const Admincars = () => {
  const { token, logout } = useAuth();
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/car", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCars(data || []);
    } catch (error) {
      console.log("Error fetching cars:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handledelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/car/Deletecar/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete car");

      setSuccess("Car deleted successfully ✅");
      fetchCars();
    } catch (error) {
      console.log("Error deleting car:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Slidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-yellow-50 to-yellow-100 gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-800">
                🚗 Car Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                View, manage, and inspect all registered cars.
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <p className="text-green-600 text-sm sm:text-base">{success}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => navigate("/admin/addcars")}
                className="bg-yellow-800 hover:bg-yellow-900 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
              >
                Add New Car
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Model
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Year
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Price/Day
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-bold text-yellow-800 uppercase border-b">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-gray-500 italic"
                    >
                      No cars found 🚘
                    </td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr
                      key={car._id}
                      className="hover:bg-yellow-50 transition duration-200"
                    >
                      <td className="px-4 sm:px-6 py-4 border-b text-gray-700">
                        {car.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 border-b text-gray-600">
                        {car.model}
                      </td>
                      <td className="px-4 sm:px-6 py-4 border-b text-gray-600">
                        {car.year}
                      </td>
                      <td className="px-4 sm:px-6 py-4 border-b text-gray-600">
                        Rs.{car.pricePerDay}
                      </td>
                      <td className="px-4 sm:px-6 py-4 border-b">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => setSelectedCarId(car._id)}
                            className="bg-yellow-600 text-white px-3 sm:px-4 py-1.5 rounded-md hover:bg-yellow-700 transition text-sm"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() => handledelete(car._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 rounded-md text-sm font-semibold shadow"
                          >
                            Delete
                          </button>
                        </div>
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
      {selectedCarId && (
        <AdminCarDetails
          id={selectedCarId}
          onClose={() => setSelectedCarId(null)}
        />
      )}
    </div>
  );
};

export default Admincars;
