import React from "react";

const Drivernewride = () => {
  const [currentLocation, setCurrentLocation] = React.useState("");

  const handlelocation = () => {
    console.log(currentLocation);
  };

  return (
    <>
      <div className=" flex justify-center min-h-screen bg-gray-100">
        <div className="mt-15 ">
          <input
            className="border border-gray-300 p-2 rounded w-64"
            type="text"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            placeholder="Enter your Current Location City"
          />
          <button
            onClick={handlelocation}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default Drivernewride;
