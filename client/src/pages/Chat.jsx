import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/Authcontent";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

// ✅ Connect to backend Socket.IO
const socket = io("http://localhost:3000", {
  withCredentials: true,
});

const Chat = ({ driverId, userId, partner, status, onBack }) => {
  const { token, role, userId: currentUserId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      let senderId, receiverId;

      if (role === "user") {
        senderId = currentUserId;
        receiverId = driverId;
      } else if (role === "driver") {
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

        const endpoint =
          role === "driver"
            ? `http://localhost:3000/api/messages/driver/${senderId}/${receiverId}`
            : `http://localhost:3000/api/messages/${senderId}/${receiverId}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

    socket.on("typing", ({ senderId }) => {
      if (senderId !== currentUserId) setTyping(true);
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId !== currentUserId) setTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [token, role, driverId, userId, currentUserId]);

  // ✅ Handle typing events
  let typingTimeout;
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    const senderId = currentUserId;
    const receiverId = role === "user" ? driverId : userId;

    socket.emit("typing", { senderId, receiverId });

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { senderId, receiverId });
    }, 1000);
  };

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

  const handleFileInputClick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("File upload failed");
      const data = await response.json();
      const filePath = data.path;

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
        text: "",
        file: filePath,
      };
      socket.emit("sendMessage", messageData);
    } catch (err) {
      console.error("File upload error:", err);
    }
  };

  const renderMessageContent = (message) => {
    if (message.file) {
      const fileUrl = `http://localhost:3000${message.file}`;
      const extension = message.file.split(".").pop().toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
        return (
          <img
            src={fileUrl}
            alt="chat-file"
            className="max-w-[200px] rounded-lg"
          />
        );
      }

      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-600 hover:underline"
        >
          📎 <span>Download File</span>
        </a>
      );
    }

    return <p>{message.text}</p>;
  };

  const toggleMenu = (messageId) => {
    setMenuOpen((prev) => (prev === messageId ? null : messageId));
  };

  const handleDelete = async (messageId) => {
    try {
      const endpoint =
        role === "driver"
          ? `http://localhost:3000/api/messages/driver/${messageId}`
          : `http://localhost:3000/api/messages/${messageId}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("❌ Error deleting message:", error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-yellow-600 text-white p-4 shadow-md flex items-center space-x-4">
        {/* ✅ Back Arrow (only on mobile) */}
        <button
          onClick={onBack}
          className="md:hidden mr-2 text-white hover:text-gray-200"
        >
          ←
        </button>

        <img
          src={partner?.image || "/default-avatar.png"}
          alt={partner?.fullName || "Unknown"}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{partner?.fullName}</h2>
          {typing ? (
            <span className="text-sm text-green-200">typing...</span>
          ) : (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full w-fit ${
                status === "online"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {status}
            </span>
          )}
        </div>
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
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow relative ${
                    message.senderId?.id === currentUserId
                      ? "bg-yellow-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {renderMessageContent(message)}

                  {message.senderId?.id === currentUserId && (
                    <div className="absolute top-1 right-1">
                      <button
                        onClick={() => toggleMenu(message._id)}
                        className="text-white/80 hover:text-white text-xs"
                      >
                        ⋮
                      </button>
                      {menuOpen === message._id && (
                        <div className="absolute right-0 mt-1 w-24 bg-white text-gray-800 rounded-md shadow-lg z-50">
                          <button
                            onClick={() => handleDelete(message._id)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          : !loading && <p className="text-gray-500">No messages found.</p>}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex items-center space-x-2">
        <div className="flex-1 flex items-center space-x-2 relative">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-16 right-2 z-50">
              <EmojiPicker
                onEmojiClick={(emojiObject) => {
                  setNewMessage((prev) => prev + emojiObject.emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}

          {/* File Upload */}
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileInputClick}
            />
            +
          </label>
        </div>

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
