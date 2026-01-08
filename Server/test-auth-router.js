// Minimal test to find the problematic route in auth_router
const express = require("express");
const router = express.Router();

// Import dependencies
const upload = require("./middleware/multer");
const adminmiddleware = require("./middleware/admin_middleware");
const authmiddleware = require("./middleware/auth_middleware");
const showroomauth = require("./middleware/Showroomowner_midlleware");
const driverauthmiddleware = require("./middleware/driver_middleware");

// Import controllers
const {
  Login,
  Register,
  Admingetallusers,
  Getspecificuser,
  Deletespecificuser,
  SendOTP,
  VerifyOTP,
  ResetPassword,
  Bookdriver,
  GetSpecificlocationdriver,
  GetSpecificDriver,
  GetallDrivers,
  Getallshowrooms,
  GetSpecificShowroom,
  GetAdminprofile,
  GetAllbookings,
  UserdeleteSpecificbooking,
} = require("./controllers/auth-controller");

const {
  registerValidation,
  loginValidation,
} = require("./middleware/validate_middleware");

console.log("Testing auth_router routes one by one...\n");

try {
  console.log("Route 1: /login");
  router.post("/login", loginValidation, Login);
  console.log("✅ /login OK\n");
} catch (err) {
  console.log("❌ /login FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 2: /register");
  router.post("/register", upload.single("avatar"), registerValidation, Register);
  console.log("✅ /register OK\n");
} catch (err) {
  console.log("❌ /register FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 3: /getshowroom/:id");
  router.get("/getshowroom/:id", authmiddleware, GetSpecificShowroom);
  console.log("✅ /getshowroom/:id OK\n");
} catch (err) {
  console.log("❌ /getshowroom/:id FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 4: /users/:id");
  router.get("/users/:id", showroomauth, Getspecificuser);
  console.log("✅ /users/:id OK\n");
} catch (err) {
  console.log("❌ /users/:id FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 5: /driver/users/:id");
  router.get("/driver/users/:id", driverauthmiddleware, Getspecificuser);
  console.log("✅ /driver/users/:id OK\n");
} catch (err) {
  console.log("❌ /driver/users/:id FAILED:", err.message, "\n");
  process.exit(1);
}

// Now test mounting it to see if the conflict happens
const app = express();
try {
  console.log("Mounting router to /api/auth...");
  app.use("/api/auth", router);
  console.log("✅ Router mounted successfully!\n");
} catch (err) {
  console.log("❌ Router mount FAILED:", err.message, "\n");
  process.exit(1);
}

console.log("All tests passed! The error must be in routes after line 37.");
