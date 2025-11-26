require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Routers
const authRouter = require("./routers/auth_router");
const carRouter = require("./routers/car_router");
const uploadRoutes = require("./routers/upload_multer");
const profileRouter = require("./routers/user_router");
const queryRouter = require("./routers/querry_router");
const driverRouter = require("./routers/driver_router");
const messageRouter = require("./routers/message_router");
const showroomRouter = require("./routers/showroom_router");
const reviewsRouter = require("./routers/review_router");
const Message = require("./model/message_model");
const upload = require("./middleware/multer");

const app = express();
const server = http.createServer(app);

// Allow frontend origin from env or default to '*'
const frontendURL = process.env.FRONTEND_URL || "*";
app.use(cors({
  origin: frontendURL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle preflight requests globally
app.options("*", cors());

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin: frontendURL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/car", carRouter);
app.use("/api", uploadRoutes);
app.use("/api/user", profileRouter);
app.use("/api/user/querry", queryRouter);
app.use("/api/driver", driverRouter);
app.use("/api/messages", messageRouter);
app.use("/api/showroom", showroomRouter);
app.use("/api/reviews", reviewsRouter);

app.get("/", (req, res) => res.send("Server is running!"));

// File upload
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(200).json({ message: "File uploaded successfully", url: req.file.path });
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("joinroom", (userId) => {
    socket.join(userId);
    console.log(`✅ User ${socket.id} joined room: ${userId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, text, file } = data;
      if (!senderId || !receiverId) return;

      const newMessage = new Message({
        senderId: { id: senderId.id || senderId, type: senderId.type || "user" },
        receiverId: { id: receiverId.id || receiverId, type: receiverId.type || "user" },
        text,
        file,
      });

      const savedMessage = await newMessage.save();
      io.to(receiverId.id).emit("receiveMessage", savedMessage);
      socket.emit("receiveMessage", savedMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
  });

  socket.on("sendLocation", (data) => {
    io.emit("receiveLocation", data);
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
