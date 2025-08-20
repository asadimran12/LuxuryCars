import React, { useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { useNavigate } from "react-router-dom";
import Slidebar from "../components/UI/Slidebar";

const Adminaddnewcar = ({ onClose }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    fuelType: "Petrol",
    seats: 4,
    pricePerDay: "",
    availability: true,
    image: "",
    description: "",
    features: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("model", formData.model);
      data.append("year", formData.year);
      data.append("fuelType", formData.fuelType);
      data.append("seats", formData.seats);
      data.append("pricePerDay", formData.pricePerDay);
      data.append("availability", formData.availability);
      data.append("description", formData.description);
      data.append(
        "features",
        JSON.stringify(formData.features.split(",").map((f) => f.trim()))
      );
      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch("http://localhost:3000/api/car/addcar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to add car");
      }

      setSuccess("Car added successfully 🚗");
      setFormData({
        name: "",
        brand: "",
        model: "",
        year: "",
        fuelType: "",
        seats: "",
        pricePerDay: "",
        availability: true,
        image: "",
        description: "",
        features: "",
      });

      setTimeout(() => {
        onClose?.();
        navigate("/admin/cars");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Slidebar />
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-800 mb-6">Add New Car</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Car Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="number"
            name="pricePerDay"
            placeholder="Price per Day (Rs.)"
            value={formData.pricePerDay}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />

          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
          <input
            type="number"
            name="seats"
            placeholder="Seats"
            value={formData.seats}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2"
          />

          <input
            type="file"
            name="image"
            placeholder="Image Filename (e.g. car.jpg)"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            className="col-span-2 border border-gray-300 rounded-md px-4 py-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="col-span-2 border border-gray-300 rounded-md px-4 py-2"
          />

          <input
            type="text"
            name="features"
            placeholder="Features (comma separated)"
            value={formData.features}
            onChange={handleChange}
            className="col-span-2 border border-gray-300 rounded-md px-4 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-800 hover:bg-yellow-900 text-white px-4 py-2 rounded-md font-semibold shadow"
          >
            {loading ? "Adding..." : "Add Car"}
          </button>
        </form>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Adminaddnewcar;
