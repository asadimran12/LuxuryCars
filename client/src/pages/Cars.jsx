import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Car = () => {
  const [cars, setCars] = useState([]);

  const fetchcar = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/car/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchcar();
  }, []);

  return (
    <div className="py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10">All Cars</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 flex flex-col space-y-3"
          >
            <img
              src={`http://localhost:3000${car.image}`}
              alt={car.model}
              className="w-full h-40 object-contain rounded-lg bg-gray-100"
            />

            <h2 className="text-xl font-semibold text-blue-900">{car.name}</h2>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Brand:</strong> {car.brand}
              </p>
              <p>
                <strong>Model:</strong> {car.model}
              </p>
              <p>
                <strong>Year:</strong> {car.year}
              </p>
              <p>
                <strong>Fuel Type:</strong> {car.fuelType}
              </p>
              <p>
                <strong>Price Per Day:</strong> ${car.pricePerDay}
              </p>
              <p>
                <strong>Availability:</strong>{" "}
                <span
                  className={
                    car.availability ? "text-green-600" : "text-red-600"
                  }
                >
                  {car.availability ? "Available" : "Not Available"}
                </span>
              </p>
            </div>
            <NavLink
              to={`/home/carsdetails/${car._id}`}
              className="bg-blue-800 text-white w-full py-1 rounded-lg text-sm font-semibold text-center"
            >
              Details
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Car;
