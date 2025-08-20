import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  // 🔄 Resend OTP
  const handleOTP = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("✅ OTP resent to your email.");
      } else {
        setError(data.error || "❌ Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
      setError("⚠️ Something went wrong. Try again later.");
    }
  };

  // ✅ Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "❌ Invalid OTP");
        return;
      }

      // ✅ success
      setSuccess("✅ OTP verified successfully!");

      setTimeout(() => {
        navigate("/newpassword");
      }, 2000);
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
          >
            Verify OTP
          </button>
        </form>

        {/* Show messages */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}

        <p className="text-center text-gray-600 mt-4 text-sm">
          Didn’t get the OTP?{" "}
          <button
            onClick={handleOTP}
            className="text-yellow-500 hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
