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

// ✅ Allow multiple frontend origins
const allowedOrigins = [
  "https://luxury-cars-murex.vercel.app",  // Vercel deployment
  "http://localhost:5173",                  // Local Vite dev server
  "http://localhost:3000",                  // Alternative local port
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("*", cors());

// ✅ Socket.IO with same allowed origins
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

// DB Connection with production-ready settings
mongoose.connect(process.env.MONGO, {
  serverSelectionTimeoutMS: 30000,  // Increase to 30 seconds
  socketTimeoutMS: 45000,            // Socket timeout
  family: 4,                         // Use IPv4, skip trying IPv6
  maxPoolSize: 10,                   // Connection pool size
  minPoolSize: 2,                    // Minimum connections
  retryWrites: true,                 // Retry write operations
})
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);  // Exit if can't connect to prevent buffering timeouts
  });

// MongoDB connection event handlers for debugging
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Mongoose disconnected from MongoDB');
});

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
