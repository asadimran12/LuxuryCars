import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { useAuth } from "../components/Context/Authcontent";

const AllChats = () => {
  const { token, role } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [status, setStatus] = useState(null);

  // ✅ Fetch chat partners
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const endpoint =
          role === "driver"
            ? "http://localhost:3000/api/messages/chat/driver"
            : "http://localhost:3000/api/messages/chat/user";

        const res = await fetch(endpoint, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const detailedChats = await Promise.all(
          data.map(async (chat) => {
            const partnerId = chat.partner.id;
            const partnerType = chat.partner.type;

            // Decide endpoint based on type
            const detailsEndpoint =
              partnerType === "Driver"
                ? `http://localhost:3000/api/auth/driverprofile/${partnerId}`
                : `http://localhost:3000/api/auth/driver/users/${partnerId}`;

            const detailsRes = await fetch(detailsEndpoint, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const details = await detailsRes.json();
            if (partnerType === "Driver")
              setStatus(details.driver.availabilityStatus || null);
            else if (partnerType === "User")
              setStatus(details.finduser.availabilityStatus || null);

            return {
              ...chat,
              partner: {
                ...chat.partner,
                fullName:
                  partnerType === "Driver"
                    ? details?.driver?.fullName || "Unknown"
                    : details?.finduser?.username || "Unknown",
                image: `http://localhost:3000${
                  partnerType === "Driver"
                    ? details?.driver?.profilePhoto || "/default-avatar.png"
                    : details?.finduser?.avatar || "/default-avatar.png"
                }`,
              },
            };
          })
        );
        setChats(detailedChats);
      } catch (error) {
        console.log("❌ Error fetching chats:", error);
      }
    };

    if (role && token) fetchChats();
  }, [role, token]);

  return (
    <div style={{ display: "flex", height: "100vh", border: "1px solid #ddd" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3
          style={{ padding: "15px", margin: 0, borderBottom: "1px solid #ccc" }}
        >
          Chats
        </h3>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.partner.id}
              onClick={() => setSelectedChat(chat.partner)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                backgroundColor:
                  selectedChat?.id === chat.partner.id
                    ? "#e6f0ff"
                    : "transparent",
              }}
            >
              {/* Partner image */}
              <img
                src={chat.partner.image}
                alt="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>
                  {chat.partner.fullName}
                </div>
                <div style={{ fontSize: "13px", color: "#666" }}>
                  {chat.lastMessage?.text?.slice(0, 25) || "No messages yet..."}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ padding: "15px" }}>No chats found</p>
        )}
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1 }}>
        {selectedChat ? (
          <Chat
            partner={selectedChat}
            status={status}
            driverId={selectedChat.type === "Driver" ? selectedChat.id : null}
            userId={selectedChat.type === "User" ? selectedChat.id : null}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontSize: "18px",
              color: "#666",
            }}
          >
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default AllChats;
