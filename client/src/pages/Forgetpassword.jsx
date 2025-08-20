import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgetPassword = async () => {
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
        setMessage("✅ Reset link sent to your email.");
        localStorage.setItem("resetEmail", email);
        setTimeout(() => {
          navigate("/verifyotp");
        }, 3000);
      } else {
        setMessage(data.error || "❌ Failed to send reset link.");
      }
    } catch (error) {
      console.log(error);
      setMessage("⚠️ Something went wrong. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Forget Password
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your registered email address, and we&apos;ll send you a reset
          link.
        </p>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-left text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <button
          onClick={handleForgetPassword}
          className="w-full bg-[#F1BC00] hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Forgetpassword;
