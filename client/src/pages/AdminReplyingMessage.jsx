import React, { useState } from "react";
import { useAuth } from "../components/Context/Authcontent";

const AdminReplyingMessage = ({ id, onClose, name,subject, email }) => {
  const { token } = useAuth();
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (reply.trim() === "") return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/querry/admin/reply/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ✅ Fix
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            to: email,
            subject:`Re: ${subject || "Your Inquiry"}`, 
            message: reply,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to send reply:", errorData);
        return;
      }

      console.log("Reply sent successfully");
      setReply(""); 
      onClose(); 
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Reply to {name || "User"}
        </h2>

        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply..."
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          rows="4"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReplyingMessage;
