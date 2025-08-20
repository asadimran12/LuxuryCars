import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../components/Context/Authcontent";

const Contact = () => {
  const { token } = useAuth();
  const [user, setUser] = useState({
    username: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data?.user) {
          setUser((prev) => ({
            ...prev,
            username: data.user.username || "",
            email: data.user.email || "",
          }));
        }
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/user/querry/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to send message:", errorData);
        return;
      }

      alert("Message sent successfully ✅");
      setUser({ username: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
        <p className="text-gray-600 mt-2">We’re here to help. Let’s talk!</p>
      </div>

      {/* Contact Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-blue-700 text-xl" />
            <p className="text-gray-700">+92 342 1852394</p>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-blue-700 text-xl" />
            <p className="text-gray-700">iasad4855@gmail.com</p>
          </div>
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-blue-700 text-xl" />
            <p className="text-gray-700">Near Pilot School, Phalia, Pakistan</p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 p-6 rounded-lg shadow"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="username"
              placeholder="Your Name"
              value={user.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={user.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              placeholder="XYZ"
              value={user.subject}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              rows="4"
              name="message"
              placeholder="Write your message here..."
              value={user.message}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
