import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";

const Adminbookingdetails = ({ id, onClose }) => {
  const { token } = useAuth();
  const [booking, setBooking] = useState(null);
  const [car, setCar] = useState(null);
  const [user, setUser] = useState(null);

  const fetchBooking = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/car/carbookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const bookingResponse = await res.json();
      const bookingData = bookingResponse.booking || bookingResponse;
      setBooking(bookingData);

      const [carRes, userRes] = await Promise.all([
        fetch(`http://localhost:3000/api/car/${bookingData.car}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:3000/api/auth/users/${bookingData.user}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const carData = await carRes.json();
      const userData = await userRes.json();

      setCar(carData);
      setUser(userData.finduser);
    } catch (err) {
      console.error("Error fetching booking details:", err);
    }
  };

  const handleupdate = async () => {
    try {
      const bookingresponce = await fetch(
        `http://localhost:3000/api/car/carbookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "approved" }), 
        }
      );

      if (!bookingresponce.ok) {
        throw new Error("Failed to update booking");
      }

      const data = await bookingresponce.json();
      setBooking(data);
      onClose();
    } catch (error) {
      console.error("❌ Update booking error:", error);
    }
  };

  const handledelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/car/carbookings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to delete booking");
      }

      onClose();
      fetchBooking();
    } catch (error) {
      console.error("Error deleting booking:", error.message);
    }
  };

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  if (!booking || !car || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h1 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Booking Details
        </h1>

        {/* Booking Details */}
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Car Name:</strong> {car.name}
          </p>
          <p>
            <strong>Car Brand:</strong> {car.brand}
          </p>
          <p>
            <strong>Booked By:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Total Price:</strong> Rs. {booking.totalPrice}
          </p>
          <p>
            <strong>Status:</strong> {booking.status}
          </p>
          <p>
            <strong>Booking Date:</strong>{" "}
            {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleupdate}
            className="bg-blue-500 p-2 rounded-2xl px-3 text-white mt-3 "
          >
            Approved
          </button>
          <button
            onClick={handledelete}
            className="bg-red-500 p-2 rounded-2xl px-3 text-white mt-3"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Adminbookingdetails;
