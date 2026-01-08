// Test loading routers incrementally to find the conflict
require("dotenv").config();
const express = require("express");
const app = express();

console.log("Loading routers incrementally to find conflicts...\n");

const authRouter = require("./routers/auth_router");
app.use("/api/auth", authRouter);
console.log("✅ 1. auth_router loaded\n");

const carRouter = require("./routers/car_router");
app.use("/api/car", carRouter);
console.log("✅ 2. car_router loaded\n");

const uploadRoutes = require("./routers/upload_multer");
app.use("/api", uploadRoutes);
console.log("✅ 3. upload_multer loaded\n");

const profileRouter = require("./routers/user_router");
app.use("/api/user", profileRouter);
console.log("✅ 4. user_router loaded\n");

const queryRouter = require("./routers/querry_router");
app.use("/api/user/querry", queryRouter);
console.log("✅ 5. querry_router loaded\n");

const driverRouter = require("./routers/driver_router");
app.use("/api/driver", driverRouter);
console.log("✅ 6. driver_router loaded\n");

const messageRouter = require("./routers/message_router");
app.use("/api/messages", messageRouter);
console.log("✅ 7. message_router loaded\n");

const showroomRouter = require("./routers/showroom_router");
app.use("/api/showroom", showroomRouter);
console.log("✅ 8. showroom_router loaded\n");

const reviewsRouter = require("./routers/review_router");
app.use("/api/reviews", reviewsRouter);
console.log("✅ 9. review_router loaded\n");

console.log("ALL ROUTERS LOADED SUCCESSFULLY!");
console.log("This means the issue might be in Server.js initialization or environment-specific.");
