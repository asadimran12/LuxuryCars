import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, User, Mail, Car, DollarSign, Tag, CheckCircle } from "lucide-react";

const Booking = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [bookingDetail, setBookingDetail] = useState(null);
  const [user, setUser] = useState(null);
  const [price, setPrice] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/car/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setBookingDetail(data);
      } catch (error) {
        console.log("Car fetch error:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.log("User fetch error:", error);
      }
    };

    fetchCarDetails();
    fetchUser();
  }, [id, token]);

  useEffect(() => {
    if (dates.startDate && dates.endDate && bookingDetail?.pricePerDay) {
      const start = new Date(dates.startDate);
      const end = new Date(dates.endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const total = diffDays > 0 ? diffDays * bookingDetail.pricePerDay : 0;
      setPrice(total);
    } else {
      setPrice(null);
    }
  }, [dates.startDate, dates.endDate, bookingDetail]);

  const handleChange = (e) => {
    setDates((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBooking = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/car/booking/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dates),
        }
      );

      const data = await response.json();
      setBookingDetail(data);

      // ✅ Show success message instead of immediate navigation
      setSuccessMessage("🎉 Booking confirmed successfully!");

      // ✅ Navigate after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log("Booking error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center p-6 relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Booking Card */}
      <div className="relative bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
          🚗 Booking Details
        </h2>

        {/* ✅ Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center justify-center gap-3 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl shadow">
            <CheckCircle className="text-green-600" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {bookingDetail && (
          <div className="mb-6 space-y-3 text-gray-800">
            <div className="flex items-center gap-3">
              <Car className="text-indigo-600" />
              <p>
                <strong>Car:</strong> {bookingDetail.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="text-green-600" />
              <p>
                <strong>Price/Day:</strong>{" "}
                <span className="text-green-600 font-semibold">
                  ${bookingDetail.pricePerDay}
                </span>
              </p>
            </div>
          </div>
        )}

        {user && (
          <div className="mb-6 space-y-3 text-gray-800">
            <div className="flex items-center gap-3">
              <User className="text-blue-600" />
              <p>
                <strong>User:</strong> {user.username}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-red-600" />
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center">
              <Calendar className="mr-2 text-purple-600" /> Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={dates.startDate ? dates.startDate.slice(0, 10) : ""}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700 flex items-center">
              <Calendar className="mr-2 text-purple-600" /> End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={dates.endDate ? dates.endDate.slice(0, 10) : ""}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
              required
            />
          </div>
        </div>

        {/* Total Price */}
        <div className="mb-8 text-center bg-gray-100 p-6 rounded-2xl shadow-inner border border-gray-200">
          <label className="block mb-2 font-semibold text-gray-700 text-lg flex justify-center items-center">
            <DollarSign className="mr-2 text-green-600" /> Total Price
          </label>
          <p className="font-extrabold text-4xl text-green-600">
            {price !== null ? `$${price}` : "—"}
          </p>
        </div>

        {/* Confirm Button */}
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          onClick={handleBooking}
          disabled={!!successMessage}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Booking;
