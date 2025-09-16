const Message = require("../model/message_model");

// 📩 Get all messages between two specific users
const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "SenderId and ReceiverId required" });
    }

    const messages = await Message.find({ 
      $or: [
        { "senderId.id": senderId, "receiverId.id": receiverId },
        { "senderId.id": receiverId, "receiverId.id": senderId },
      ],
    }).sort({ createdAt: 1 }); // oldest → newest

    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const GetChat = async (req, res) => {
  try {
    let userId, role;

    if (req.user) {
      userId = req.user.id;
      role = "user";
    } else if (req.driver) {
      userId = req.driver.id;
      role = "driver";
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const messages = await Message.find({
      $or: [{ "senderId.id": userId }, { "receiverId.id": userId }],
    }).sort({ createdAt: -1 });

    const partnersMap = {};

    messages.forEach((msg) => {
      const otherPerson =
        msg.senderId.id.toString() === userId.toString()
          ? msg.receiverId
          : msg.senderId;

      const isDriverTalkingToUser =
        role === "driver" && otherPerson.type === "User";
      const isUserTalkingToDriver =
        role === "user" && otherPerson.type === "Driver";

      if (isDriverTalkingToUser || isUserTalkingToDriver) {
        if (!partnersMap[otherPerson.id]) {
          partnersMap[otherPerson.id] = {
            partner: otherPerson,
            lastMessage: msg,
          };
        }
      }
    });
 res.json(Object.values(partnersMap));
  } catch (error) {
    console.error("❌ Error fetching chats:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    if (!messageId) {
      return res.status(400).json({ message: "MessageId required" });
    }
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    await Message.findByIdAndDelete(messageId);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting message:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMessages, GetChat, deleteMessage };
