// Test file to identify which router is causing the path-to-regexp error
require("dotenv").config();
const express = require("express");
const app = express();

console.log("Testing routers one by one...\n");

try {
  console.log("1. Testing auth_router...");
  const authRouter = require("./routers/auth_router");
  app.use("/api/auth", authRouter);
  console.log("✅ auth_router loaded successfully\n");
} catch (err) {
  console.log("❌ auth_router FAILED:", err.message, "\n");
}

try {
  console.log("2. Testing car_router...");
  const carRouter = require("./routers/car_router");
  app.use("/api/car", carRouter);
  console.log("✅ car_router loaded successfully\n");
} catch (err) {
  console.log("❌ car_router FAILED:", err.message, "\n");
}

try {
  console.log("3. Testing upload_multer...");
  const uploadRoutes = require("./routers/upload_multer");
  app.use("/api", uploadRoutes);
  console.log("✅ upload_multer loaded successfully\n");
} catch (err) {
  console.log("❌ upload_multer FAILED:", err.message, "\n");
}

try {
  console.log("4. Testing user_router...");
  const profileRouter = require("./routers/user_router");
  app.use("/api/user", profileRouter);
  console.log("✅ user_router loaded successfully\n");
} catch (err) {
  console.log("❌ user_router FAILED:", err.message, "\n");
}

try {
  console.log("5. Testing querry_router...");
  const queryRouter = require("./routers/querry_router");
  app.use("/api/user/querry", queryRouter);
  console.log("✅ querry_router loaded successfully\n");
} catch (err) {
  console.log("❌ querry_router FAILED:", err.message, "\n");
}

try {
  console.log("6. Testing driver_router...");
  const driverRouter = require("./routers/driver_router");
  app.use("/api/driver", driverRouter);
  console.log("✅ driver_router loaded successfully\n");
} catch (err) {
  console.log("❌ driver_router FAILED:", err.message, "\n");
}

try {
  console.log("7. Testing message_router...");
  const messageRouter = require("./routers/message_router");
  app.use("/api/messages", messageRouter);
  console.log("✅ message_router loaded successfully\n");
} catch (err) {
  console.log("❌ message_router FAILED:", err.message, "\n");
}

try {
  console.log("8. Testing showroom_router...");
  const showroomRouter = require("./routers/showroom_router");
  app.use("/api/showroom", showroomRouter);
  console.log("✅ showroom_router loaded successfully\n");
} catch (err) {
  console.log("❌ showroom_router FAILED:", err.message, "\n");
}

try {
  console.log("9. Testing review_router...");
  const reviewsRouter = require("./routers/review_router");
  app.use("/api/reviews", reviewsRouter);
  console.log("✅ review_router loaded successfully\n");
} catch (err) {
  console.log("❌ review_router FAILED:", err.message, "\n");
}

console.log("All routers tested!");
