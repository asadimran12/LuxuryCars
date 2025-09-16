import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";

const AdminCarDetails = ({ id, onClose }) => {
  const { token } = useAuth();
  const [car, setCar] = useState(null);

  const fetchCarDetails = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/car/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCar(data);
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  useEffect(() => {
    if (id) fetchCarDetails();
  }, [id]);

  if (!car) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden  animate-fadeIn">
      

        {/* Car Image */}
        {car.image && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={`http://localhost:3000${car.image}`}
              alt={car.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            {car.name}
          </h1>
          <p className="text-center text-gray-500 mb-4">{car.brand}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="bg-gray-50 p-3 rounded-md shadow-sm">
              <strong>Price/Day:</strong>
              <p className="text-green-600 font-semibold">
                Rs. {car.pricePerDay}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md shadow-sm">
              <strong>Availability:</strong>
              <p
                className={`font-semibold ${
                  car.availability ? "text-green-600" : "text-red-600"
                }`}
              >
                {car.availability ? "Available" : "Booked"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md shadow-sm col-span-2">
              <strong>Description:</strong>
              <p>{car.description || "No description provided."}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md shadow-sm col-span-2">
              <strong>Features:</strong>
              <p>{car.features || "No features listed."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCarDetails;
