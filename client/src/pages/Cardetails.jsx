import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAuth } from "../components/Context/Authcontent";
import { Car, Calendar, Fuel, Users, DollarSign, CheckCircle, XCircle } from "lucide-react";

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
    <div
      className="min-h-screen py-12 px-6 flex justify-center items-start"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1600')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative max-w-5xl w-full bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-white/30">
        {/* Car Image */}
        <img
       src={`http://localhost:3000${carData.image}`}
          alt={carData.name}
          className="w-full h-80 object-cover rounded-2xl mb-8 shadow-xl transform hover:scale-[1.02] transition"
        />

        {/* Car Name */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {carData.name}
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {carData.description}
        </p>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Features</h2>
          <div className="flex flex-wrap gap-3">
            {carData.features?.map((feature, idx) => (
              <span
                key={idx}
                className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition-transform"
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
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
          >
            🚗 Book Now
          </NavLink>
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl shadow-inner hover:shadow-md transition">
    <div className="p-2 bg-white rounded-lg shadow">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Cardetails;
