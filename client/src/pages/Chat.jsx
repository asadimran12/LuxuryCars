import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { io } from "socket.io-client";

// ✅ Connect to backend Socket.IO
const socket = io("http://localhost:3000", {
  withCredentials: true,
});

const Chat = ({ driverId, userId }) => {
  const { token, role, userId: currentUserId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      let senderId, receiverId;

      if (role === "user") {
        senderId = currentUserId;
        receiverId = driverId;
      } else {
        senderId = currentUserId;
        receiverId = userId;
      }

      if (!senderId || !receiverId) {
        setError("Invalid chat participants");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/messages/${senderId}/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const roomId =
      role === "user"
        ? `${currentUserId}-${driverId}`
        : `${currentUserId}-${userId}`;
    socket.emit("joinroom", roomId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [token, role, driverId, userId, currentUserId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    let senderId = {
      id: currentUserId,
      type: role === "user" ? "user" : "Driver",
    };

    let receiverId = {
      id: role === "user" ? driverId : userId,
      type: role === "user" ? "Driver" : "user",
    };

    const messageData = {
      senderId,
      receiverId,
      text: newMessage,
    };

    socket.emit("sendMessage", messageData);

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-yellow-600 text-white p-4 shadow-md">
        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <p className="text-gray-500">Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {messages.length > 0
          ? messages.map((message) => (
              <div
                key={message._id || Math.random()} 
                className={`flex ${
                  message.senderId?.id === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow ${
                    message.senderId?.id === currentUserId
                      ? "bg-yellow-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))
          : !loading && <p className="text-gray-500">No messages found.</p>}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={handleSend}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
