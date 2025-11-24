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

            const detailsEndpoint =
              partnerType === "Driver"
                ? `http://localhost:3000/api/auth/driverprofile/${partnerId}`
                : `http://localhost:3000/api/auth/driver/users/${partnerId}`;

            const detailsRes = await fetch(detailsEndpoint, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const details = await detailsRes.json();

            if (partnerType === "Driver")
              setStatus(details.driver?.availabilityStatus || null);
            else if (partnerType === "User")
              setStatus(details.finduser?.availabilityStatus || null);

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
    <div className="flex h-screen border border-gray-300">
      {/* Sidebar */}
      <div
        className={`bg-gray-50 border-r border-gray-300 overflow-y-auto 
        w-full md:w-[280px] 
        ${selectedChat ? "hidden md:block" : "block"}`}
      >
        <h3 className="p-4 border-b border-gray-300 font-semibold">Chats</h3>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.partner.id}
              onClick={() => setSelectedChat(chat.partner)}
              className={`flex items-center gap-3 p-4 border-b border-gray-200 cursor-pointer 
                ${
                  selectedChat?.id === chat.partner.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
            >
              {/* Partner image */}
              <img
                src={chat.partner.image}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-bold">{chat.partner.fullName}</div>
                <div className="text-sm text-gray-500">
                  {chat.lastMessage?.text?.slice(0, 25) || "No messages yet..."}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">No chats found</p>
        )}
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 
        ${selectedChat ? "block" : "hidden md:block"}`}
      >
        {selectedChat ? (
          <Chat
            partner={selectedChat}
            status={status}
            driverId={selectedChat.type === "Driver" ? selectedChat.id : null}
            userId={selectedChat.type === "User" ? selectedChat.id : null}
            onBack={() => setSelectedChat(null)} // ✅ pass back handler
          />
        ) : (
          <div className="flex items-center justify-center h-full text-lg text-gray-500">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default AllChats;
