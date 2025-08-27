import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    address: "",
    role: "user",
  });

  const [avatarFile, setAvatarFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setAvatarFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }
      if (avatarFile) {
        dataToSend.append("avatar", avatarFile);
      }

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: dataToSend,
      });

      if (!response.ok) {
        const err = await response.json();
        console.log("Invalid Input", err);
        return;
      }

      const data = await response.json();
      console.log(data);
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen m-10 border rounded-2xl">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 rounded-2xl bg-gradient-to-br from-[#D08700] via-yellow-600 to-[#D08700] items-center justify-center text-white p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
          <p className="text-lg">Create an account to get started</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 rounded-2xl flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { label: "Username", name: "username", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "Phone", name: "phone", type: "tel" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Address", name: "address", type: "text" },
            ].map(({ label, name, type }) => (
              <input
                key={name}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                className="w-full border-b-2 border-gray-300 focus:border-[#D08700] outline-none py-2"
                required
              />
            ))}

            {/* Avatar Upload */}
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-[#D08700] outline-none py-2"
            />

            {/* Gradient Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D08700] via-yellow-600 to-[#D08700] text-white font-semibold hover:opacity-90 transition"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#D08700] font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
