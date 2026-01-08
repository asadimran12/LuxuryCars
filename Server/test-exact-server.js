// Exact copy of Server.js route registration
require("dotenv").config();
const express = require("express");
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
const upload = require("./middleware/multer");

const app = express();

console.log("Testing exact Server.js configuration...\n");

// Routes - EXACT same order as Server.js
console.log("1. Mounting /api/auth...");
app.use("/api/auth", authRouter);
console.log("✅\n");

console.log("2. Mounting /api/car...");
app.use("/api/car", carRouter);
console.log("✅\n");

console.log("3. Mounting /api (uploadRoutes)...");
app.use("/api", uploadRoutes);
console.log("✅\n");

console.log("4. Mounting /api/user...");
app.use("/api/user", profileRouter);
console.log("✅\n");

console.log("5. Mounting /api/user/querry...");
app.use("/api/user/querry", queryRouter);
console.log("✅\n");

console.log("6. Mounting /api/driver...");
app.use("/api/driver", driverRouter);
console.log("✅\n");

console.log("7. Mounting /api/messages...");
app.use("/api/messages", messageRouter);
console.log("✅\n");

console.log("8. Mounting /api/showroom...");
app.use("/api/showroom", showroomRouter);
console.log("✅\n");

console.log("9. Mounting /api/reviews...");
app.use("/api/reviews", reviewsRouter);
console.log("✅\n");

console.log("10. Adding root route...");
app.get("/", (req, res) => res.send("Server is running!"));
console.log("✅\n");

console.log("11. Adding /api/upload POST route...");
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({message: "No file uploaded" });
  res.status(200).json({ message: "File uploaded successfully", url: req.file.path });
});
console.log("✅\n");

console.log("ALL ROUTES ADDED SUCCESSFULLY!");
