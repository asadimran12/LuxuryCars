import React, { useState, useEffect } from "react";

const DriverProfile = () => {
  const [driver, setDriver] = useState({});
  const [loading, setLoading] = useState(true);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGFiMDAzNWMxZmRjZDJlNDE5YTAwZGQiLCJlbWFpbCI6IjIyMDIxNTE5LTE0NkB1b2cuZWR1LnBrIiwicm9sZSI6ImRyaXZlciIsImlhdCI6MTc1NjEwMTE4OCwiZXhwIjoxNzU2MTg3NTg4fQ.O5-UUjVJKQUpbACViIFJA5C63hTItWooJzRzaIQMLWs";

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/driver/driverprofile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setDriver(data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching driver profile:", error);
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex items-center gap-4">
        <img
          src={`http://localhost:3000${driver?.profilePhoto}`}
          alt={driver.fullName}
          className="w-24 h-24 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold">{driver.fullName}</h2>
          <p className="text-gray-600">{driver.email}</p>
          <p className="text-gray-600">{driver.phone}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p>
          <strong>License:</strong> {driver.licenseNumber}
        </p>
        <p>
          <strong>National ID:</strong> {driver.nationalID}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {new Date(driver.dateOfBirth).toDateString()}
        </p>
        <p>
          <strong>Address:</strong> {driver.address}
        </p>
        <p>
          <strong>Availability:</strong> {driver.availabilityStatus}
        </p>
        <p>
          <strong>Background Check:</strong> {driver.backgroundCheckStatus}
        </p>
        <p>
          <strong>Rating:</strong> ⭐ {driver.rating}
        </p>
        <p>
          <strong>Total Trips:</strong> {driver.totalTrips}
        </p>
      </div>
    </div>
  );
};

export default DriverProfile;
