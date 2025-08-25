import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAuth } from "../components/Context/Authcontent";
import {
  Car,
  Calendar,
  Fuel,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Cardetails = () => {
  const [carData, setCarData] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();

  const fetchCar = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/car/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCarData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCar();
  }, [token]);

  if (!carData) {
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Loading car details...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex justify-center">
      <div className="max-w-4xl w-full bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
        {/* Car Image */}
        <div className="mb-6">
          <img
            src={`http://localhost:3000${carData.image}`}
            alt={carData.name}
            className="w-full h-56 object-cover rounded-xl shadow-sm"
          />
        </div>

        {/* Car Name & Description */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {carData.name}
        </h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {carData.description}
        </p>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Info icon={<Car className="text-indigo-600" />} label="Brand" value={carData.brand} />
          <Info icon={<Car className="text-indigo-600" />} label="Model" value={carData.model} />
          <Info icon={<Calendar className="text-purple-600" />} label="Year" value={carData.year} />
          <Info icon={<Fuel className="text-green-600" />} label="Fuel Type" value={carData.fuelType} />
          <Info icon={<Users className="text-orange-600" />} label="Seats" value={carData.seats} />
          <Info
            icon={<DollarSign className="text-green-600" />}
            label="Price/Day"
            value={`Rs. ${carData.pricePerDay}`}
          />
          <Info
            icon={
              carData.availability ? (
                <CheckCircle className="text-green-600" />
              ) : (
                <XCircle className="text-red-600" />
              )
            }
            label="Availability"
            value={
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  carData.availability
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {carData.availability ? "Available" : "Booked"}
              </span>
            }
          />
        </div>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Features</h2>
          <div className="flex flex-wrap gap-2">
            {carData.features?.map((feature, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg shadow-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Book Now Button */}
        <div className="text-center">
          <NavLink
            to={`/home/booking/${carData._id}`}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-6 py-2 rounded-full shadow-sm transition-all"
          >
            🚗 Book Now
          </NavLink>
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow transition text-sm">
    <div className="p-1.5 bg-white rounded-md shadow-sm">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default Cardetails;
