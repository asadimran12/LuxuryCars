import React, { useState } from "react";

const Driversignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    dateOfBirth: "",
    nationalID: "",
    address: "",
    profilePhoto: null,
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData({ ...formData, profilePhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch("http://localhost:3000/api/driver/register", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      alert(result.message || "Driver registered successfully!");
    } catch (error) {
      console.log(error);
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex min-h-screen m-10 border rounded-2xl">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 rounded-2xl bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-500 items-center justify-center text-white p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome Page</h1>
          <p className="text-lg">Sign up to become a driver</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 rounded-2xl flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Driver Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />
            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />
            <input
              type="text"
              name="nationalID"
              placeholder="National ID"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />

            <input
              type="text"
              name="currentlocation"
              placeholder="Enter your Current location City Name"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-yellow-500 outline-none py-2"
              required
            />

            {/* Gradient Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 text-white font-semibold hover:opacity-90 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-600 font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Driversignup;
