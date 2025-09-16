const express = require("express");
const {
  getMessages,
  GetChat,
  deleteMessage,
} = require("../controllers/message_controller");

const auth_middleware = require("../middleware/auth_middleware");
const driver_middleware = require("../middleware/driver_middleware");

const router = express.Router();

router.get("/chat/user", auth_middleware, GetChat);

router.get("/chat/driver", driver_middleware, GetChat);

router.get("/:senderId/:receiverId", auth_middleware, getMessages);
router.get("/driver/:senderId/:receiverId", driver_middleware, getMessages);

router.delete("/:messageId", auth_middleware, deleteMessage);
router.delete("/driver/:messageId", driver_middleware, deleteMessage);

module.exports = router;
