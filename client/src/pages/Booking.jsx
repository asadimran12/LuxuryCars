import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  User,
  Mail,
  Car,
  DollarSign,
  Tag,
  CheckCircle,
} from "lucide-react";

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

      setSuccessMessage("🎉 Booking confirmed successfully!");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log("Booking error:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100">
      {/* Booking Card */}
      <div className="relative bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
        Secure Your Ride
        </h2>

        {/* ✅ Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center justify-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow">
            <CheckCircle className="text-green-500" />
            <span className="font-semibold text-sm md:text-base">{successMessage}</span>
          </div>
        )}

        {/* Car & User Details Section */}
        <div className="mb-8 space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Car Details</h3>
            {bookingDetail && (
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <Car className="text-yellow-500 w-5 h-5" />
                  <p className="font-medium">
                    <span className="text-gray-900 font-semibold">Car:</span> {bookingDetail.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="text-yellow-500 w-5 h-5" />
                  <p className="font-medium">
                    <span className="text-gray-900 font-semibold">Price/Day:</span>
                    <span className="text-yellow-600 font-bold ml-1">${bookingDetail.pricePerDay}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Details</h3>
            {user && (
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <User className="text-yellow-500 w-5 h-5" />
                  <p className="font-medium">
                    <span className="text-gray-900 font-semibold">User:</span> {user.username}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-yellow-500 w-5 h-5" />
                  <p className="font-medium">
                    <span className="text-gray-900 font-semibold">Email:</span> {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 flex items-center">
              <Calendar className="mr-2 text-rose-500" /> Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={dates.startDate ? dates.startDate.slice(0, 10) : ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700 flex items-center">
              <Calendar className="mr-2 text-rose-500" /> End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={dates.endDate ? dates.endDate.slice(0, 10) : ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
              required
            />
          </div>
        </div>

        {/* Total Price Section */}
        <div className="mb-8 text-center bg-indigo-50 p-6 rounded-2xl shadow-inner border border-indigo-200">
          <label className="block mb-2 font-bold text-gray-700 text-lg flex justify-center items-center">
            <DollarSign className="mr-2 text-yellow-600" /> Total Price
          </label>
          <p className="font-extrabold text-5xl text-yellow-700">
            {price !== null ? `Rs.${price}` : "—"}
          </p>
        </div>

        {/* Confirm Button */}
        <button
          className="cursor-pointer  w-full bg-yellow-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-yellow-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleBooking}
          disabled={!dates.startDate || !dates.endDate || !price || !!successMessage}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Booking;