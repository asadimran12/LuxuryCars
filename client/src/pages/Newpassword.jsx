import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Newpassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/resetpassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword: password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "⚠️ Failed to update password");
        return;
      }

      setSuccess("✅ Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Password update failed:", error);
      setError("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          {/* Confirm Password */}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
          >
            Update Password
          </button>
        </form>

        {/* Show error & success messages */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}
      </div>
    </div>
  );
};

export default Newpassword;
