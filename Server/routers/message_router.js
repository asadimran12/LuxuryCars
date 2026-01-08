const express = require("express");
const {
  getMessages,
  GetChat,
  deleteMessage,
} = require("../controllers/message_controller");

const auth_middleware = require("../middleware/auth_middleware");
const driver_middleware = require("../middleware/driver_middleware");

const router = express.Router();

// Static routes first
router.get("/chat/user", auth_middleware, GetChat);
router.get("/chat/driver", driver_middleware, GetChat);

// Routes with static prefix before dynamic params
router.get("/driver/:senderId/:receiverId", driver_middleware, getMessages);
router.delete("/driver/:messageId", driver_middleware, deleteMessage);

// Dynamic parameter routes last (catch-all)
router.get("/:senderId/:receiverId", auth_middleware, getMessages);
router.delete("/:messageId", auth_middleware, deleteMessage);

module.exports = router;
