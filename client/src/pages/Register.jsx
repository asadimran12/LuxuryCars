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

  const handleRegister = async () => {
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
      console.log(data)
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Account
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Phone", name: "phone", type: "tel" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Address", name: "address", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="col-span-2">
              <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          ))}

          <div className="col-span-2">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Picture
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-[#F1BC00] hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg transition mt-6"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#F1BC00] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
