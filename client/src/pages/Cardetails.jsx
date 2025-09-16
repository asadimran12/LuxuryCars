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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-500">
        <p className="text-center animate-pulse">
          Loading car details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center">
      <div className="max-w-5xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
          {/* Car Image */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <img
              src={`http://localhost:3000${carData.image}`}
              alt={carData.name}
              className="w-full h-auto object-cover rounded-xl shadow-lg border border-gray-200"
            />
          </div>
          
          {/* Car Details */}
          <div className="flex-1 w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              {carData.name}
            </h1>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              {carData.description}
            </p>

            {/* Grid Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {carData.features?.map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded-full shadow-inner"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Book Now Button */}
            <div className="text-center md:text-left">
              <NavLink
                to={`/home/booking/${carData._id}`}
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-base px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                Book Now
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm transform hover:scale-105">
    <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
    <div className="flex flex-col">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 mt-0.5">{value}</p>
    </div>
  </div>
);

export default Cardetails;