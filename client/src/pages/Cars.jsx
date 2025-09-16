import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../components/Context/Authcontent";

const Car = () => {
  const { token } = useAuth();
  const [cars, setCars] = useState([]);
  const [showrooms, setShowrooms] = useState({}); // ✅ store multiple showrooms
  const [specificShowroom, setSpecificShowroom] = useState(null);

  // ✅ Fetch all cars
  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/car/");
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // ✅ Fetch showroom by ID (only if not already fetched)
  const fetchShowroom = async (id) => {
    if (showrooms[id]) return; // avoid duplicate fetch

    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/getshowroom/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      setShowrooms((prev) => ({
        ...prev,
        [id]: data.specificshowroom,
      }));
    } catch (error) {
      console.error("Error fetching showroom:", error);
    }
  };

  // ✅ Load cars on mount
  useEffect(() => {
    fetchCars();
  }, []);

  // ✅ Once cars are fetched, get showrooms
  useEffect(() => {
    cars.forEach((car) => {
      if (car.listedBy) fetchShowroom(car.listedBy);
    });
  }, [cars]);

  return (
    <div className="py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        All Cars
      </h1>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Image */}
            <div className="bg-gray-100 flex justify-center items-center h-48">
              <img
                src={`http://localhost:3000${car.image}`}
                alt={car.model}
                className="h-full object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <h2 className="text-2xl font-semibold text-blue-900">
                {car.name}
              </h2>

              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Brand:</strong> {car.brand}</p>
                <p><strong>Model:</strong> {car.model}</p>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Fuel Type:</strong> {car.fuelType}</p>
                <p>
                  <strong>Price Per Day:</strong>{" "}
                  <span className="font-semibold text-green-700">
                    Rs.{car.pricePerDay}
                  </span>
                </p>
                <p>
                  <strong>Availability:</strong>{" "}
                  <span
                    className={
                      car.availability
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {car.availability ? "Available" : "Not Available"}
                  </span>
                </p>
                <p>
                  <strong>Listed By:</strong>{" "}
                  <span
                    onClick={() =>
                      setSpecificShowroom(showrooms[car.listedBy] || null)
                    }
                    className="cursor-pointer text-yellow-700 font-medium hover:underline"
                  >
                    {showrooms[car.listedBy]?.showroomName || "Loading..."}
                  </span>
                </p>
              </div>

              {/* Button */}
              <NavLink
                to={`/home/carsdetails/${car._id}`}
                className="block bg-yellow-800 hover:bg-yellow-900 text-white w-full py-2 rounded-lg text-sm font-semibold text-center transition-colors"
              >
                View Details
              </NavLink>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Showroom Popup */}
      {specificShowroom && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
            {/* Close button */}
            <button
              onClick={() => setSpecificShowroom(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-4 text-center">
              <img
                src={`http://localhost:3000${specificShowroom.showroompic}`}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 shadow-md"
              />
              <h2 className="text-2xl font-bold text-gray-800">
                {specificShowroom.showroomName}
              </h2>

              <p><span className="font-semibold">Owner:</span> {specificShowroom.ownerName}</p>
              <p><span className="font-semibold">Email:</span> {specificShowroom.email}</p>
              <p><span className="font-semibold">Established:</span> {specificShowroom.establishedYear}</p>
              <p><span className="font-semibold">Address:</span> {specificShowroom.location}</p>
              <p><span className="font-semibold">Rating:</span> {specificShowroom.rating} ⭐</p>
              <p><span className="font-semibold">Description:</span> {specificShowroom.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Car;
