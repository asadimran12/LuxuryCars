import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaCarAlt, FaCogs, FaUsers, FaCalendarAlt } from "react-icons/fa";

import Searchingcar from "./Searchingcar";

const Home = () => {
  const [car, setcar] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  const fetchcar = async () => {
    try {
      const responce = await fetch("http://localhost:3000/api/car/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await responce.json();
      setcar(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 640) {
      setVisibleCount(1); // small screens
    } else if (window.innerWidth < 1024) {
      setVisibleCount(2); // medium screens
    } else {
      setVisibleCount(3); // large screens
    }
  };

  useEffect(() => {
    fetchcar();
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const brands = [
    { name: "Audi", logo: "/Audi.png" },
    { name: "Mercedez", logo: "/Mercedez.png" },
    { name: "Land Rover", logo: "/landrover.png" },
    { name: "Ferrari", logo: "/Ferari.png" },
    { name: "Tesla", logo: "/tesla.png" },
  ];

  const features = [
    {
      icon: <FaCalendarAlt className="text-blue-700 text-3xl" />,
      title: "Book with flexibility",
      description: "Easily find car and book with no change fees.",
    },
    {
      icon: <FaCogs className="text-white text-xl" />,
      blob: true,
      title: "Trusted and free",
      description: "We're completely free to use – no hidden charges or fees.",
    },
    {
      icon: <FaUsers className="text-white text-xl" />,
      blob: true,
      title: "We know travel",
      description:
        "With 10 years of experience, we're ready to help find your perfect car.",
    },
  ];

  return (
    <>
      <div>
        <div className="relative w-full h-[500px]">
          <img
            src="banner.png"
            alt="LuxuryCars Banner"
            className="w-full h-full object-cover"
          />

          {/* Overlay content */}
          <div className="absolute inset-0 flex items-start justify-end px-40 py-50 ">
            <div className="text-black space-y-4 text-left">
              <div>
                <h1 className="text-3xl font-semibold leading-tight">
                  Safe, Faster &
                </h1>
                <h1 className="text-3xl  font-semibold">Comfortable</h1>
              </div>
              <div>
                <h2 className="text-xl ">Get in touch with our</h2>
                <h2 className="text-2xl font-bold">LuxuryCars</h2>
              </div>
              <button className="bg-yellow-600 text-xl text-white p-2 rounded-2xl">
                Rent Now
              </button>
            </div>
          </div>
        </div>

        {/* second */}
        <Searchingcar />

        {/* third */}
        <div className="py-10 px-4">
          <h1 className="text-2xl font-bold text-center mb-6">
            We Have Everything You Need
          </h1>
          <div className="flex flex-wrap justify-center gap-6">
            {car.slice(0, visibleCount).map((cars, index) => (
              <div
                key={index}
                className="bg-[#f9f7fd] rounded-2xl shadow-md w-[230px] p-4 flex flex-col items-center space-y-2"
              >
                <h2 className="text-md font-semibold text-[#2c3e50] text-center">
                  {cars.name}
                </h2>

                <div className="bg-gray-100 w-full h-32 rounded-lg flex items-center justify-center">
                  <img
                    src={`http://localhost:3000${cars.image}`}
                    alt={cars.model}
                    className="h-full object-contain"
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-600 w-full mt-1">
                  <span>{cars.year}</span>
                  <span>15k</span>
                  <span>{cars.fuelType}</span>
                </div>

                <div className="text-blue-700 font-bold text-md">
                  {cars.pricePerDay}.000$
                </div>

                <NavLink
                  to={`/home/carsdetails/${cars._id}`}
                  className="bg-blue-800 text-white w-full py-1 rounded-lg text-sm font-semibold text-center"
                >
                  Details
                </NavLink>
              </div>
            ))}
          </div>
          <div className="text-center pt-6">
            <NavLink
              to={"/home/cars"}
              className="bg-yellow-600  text-white w-fit p-2 rounded-lg text-sm font-semibold"
            >
              See All Cars
            </NavLink>
          </div>
        </div>

        {/* Brands Section */}
        <div className="flex justify-center gap-4 py-10 flex-wrap">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300 transition cursor-pointer"
            >
              <img src={brand.logo} alt={brand.name} className="h-6 w-auto" />
              <span className="text-sm font-medium">{brand.name}</span>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Fell the best experience <br /> with{" "}
            <span className="font-extrabold">our luxury car</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-3">
                {feature.blob ? (
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                ) : (
                  <div>{feature.icon}</div>
                )}
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Driver Section */}
        <div className="relative mt-10">
          <img
            src="/Driving.jpg"
            alt="Driver Banner"
            className="w-full h-[300px] object-cover rounded-lg"
          />

          <div className="absolute inset-0 bg-opacity-50 rounded-lg flex flex-col justify-center items-start px-10">
            <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
              Become A Driver <br />
              <span className="text-white font-normal">
                Your Time. Your Goals. You're The Boss.
              </span>
            </h2>

            <p className="text-white mt-4 mb-2 text-sm sm:text-base">
              Subscribe And Join Us
            </p>

            <div className="flex w-full bg-white rounded-2xl max-w-md">
              <input
                type="email"
                placeholder="EMAIL"
                className="flex-grow px-4 py-2 rounded-l-md text-sm outline-none"
              />
              <button className="bg-blue-800 text-white px-6 py-2 rounded-r-md hover:bg-blue-900 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
