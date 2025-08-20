import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/Context/Authcontent";

const useQuery = () => new URLSearchParams(useLocation().search);

const Searchingcar = () => {
  const query = useQuery();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [carName, setCarName] = useState(query.get("searchcar") || "");
  const [price, setPrice] = useState(query.get("price") || "");
  const [results, setResults] = useState([]);

  const fetchCars = async () => {
    if (carName && price) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/car/searchcar?searchcar=${carName}&price=${price}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setResults(data.cars || []);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [carName, price]);

  const handleSearch = () => {
    navigate(`?searchcar=${encodeURIComponent(carName)}&price=${encodeURIComponent(price)}`);
  };

  return (
    <section className="bg-gray-100 py-6 px-4 h-fit">
      <div className="bg-white rounded-xl p-6 max-w-5xl mx-auto shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Find Your Dream Car
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Search luxury cars at your desired price.
        </p>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <input
            type="text"
            placeholder="Car Name"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
          />
          <input
            type="text"
            placeholder="Price/Day"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all"
          >
             Search
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {results.map((car) => (
              <Link to={`/home/carsdetails/${car._id}`} key={car._id}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                  <h3 className="text-base font-semibold text-gray-800">{car.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Price: <span className="font-medium">${car.pricePerDay}</span> / day
                  </p>
                  <p className="text-blue-500 text-xs mt-1 hover:underline">
                    View Details →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4 text-sm">
           No cars found. Try another name or price.
          </p>
        )}
      </div>
    </section>
  );
};

export default Searchingcar;
