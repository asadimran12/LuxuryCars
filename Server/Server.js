const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http"); // required for socket.io
const { Server } = require("socket.io");
require("dotenv").config();

const router = require("./routers/auth_router");
const carrouter = require("./routers/car_router");
const uploadroutes = require("./routers/upload_multer");
const profile = require("./routers/user_router");
const querry = require("./routers/querry_router");
const driver = require("./routers/driver_router");
const Message = require("./model/message_model");
const messageRouter = require("./routers/message_router");
const upload = require("./middleware/multer");
const showroom = require("./routers/showrrom_router");
const reviewsrouter = require("./routers/review_router");

const app = express();
const server = http.createServer(app); // create HTTP server

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

// DB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", router);
app.use("/api/car", carrouter);
app.use("/api", uploadroutes);
app.use("/api/user", profile);
app.use("/api/user/querry", querry);
app.use("/api/driver", driver);
app.use("/api/messages", messageRouter);
app.use("/api/showroom", showroom);
app.use("/api/reviews", reviewsrouter);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = `http://localhost:3000/uploads/${req.file.filename}`;

  res.status(200).json({ message: "File uploaded successfully", filePath });
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("joinroom", (userId) => {
    socket.join(userId);
    console.log(`✅ User ${socket.id} joined room: ${userId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, text, file } = data;

      if (!senderId || !receiverId) {
        console.error("❌ senderId or receiverId missing in data");
        return;
      }

      const newMessage = new Message({
        senderId: {
          id: senderId.id || senderId,
          type: senderId.type || "user",
        },
        receiverId: {
          id: receiverId.id || receiverId,
          type: receiverId.type || "user",
        },
        text,
        file,
      });

      const savedMessage = await newMessage.save(); // ✅ add await

      // send message back to all clients in the room
      io.to(receiverId.id).emit("receiveMessage", savedMessage);
      socket.emit("receiveMessage", savedMessage); // send back to sender also
    } catch (error) {
      console.error("❌ Error saving message:", error.message);
    }
  });
});

// Start Server
server.listen(3000, () => {
  console.log(`🚀 Server is running at http://localhost:3000`);
});
