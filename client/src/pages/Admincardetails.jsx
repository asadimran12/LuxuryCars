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
      console.log(data)
      setCar(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  useEffect(() => {
    if (id) fetchCarDetails();
  }, [id]);

  if (!car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h1 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Car Details
        </h1>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Name:</strong> {car.name}
          </p>
          <p>
            <strong>Brand:</strong> {car.brand}
          </p>
          <p>
            <strong>Price Per Day:</strong> Rs. {car.pricePerDay}
          </p>
          <p>
            <strong>Availability:</strong>{" "}
            {car.availability ? "Available" : "Booked"}
          </p>
          <p>
            <strong>Description:</strong> {car.description}
          </p>
           <p>
            <strong>Features:</strong> {car.features}
          </p>
          {car.image && (
            <div className="mt-2">
              <strong>Image:</strong>
              <img
                src={`http://localhost:3000${car.image}`}
                alt={car.name}
                className="w-full rounded-md mt-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCarDetails;
