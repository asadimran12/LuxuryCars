// Test remaining auth_router routes
const express = require("express");
const router = express.Router();

// Import dependencies
const upload = require("./middleware/multer");
const adminmiddleware = require("./middleware/admin_middleware");
const authmiddleware = require("./middleware/auth_middleware");
const showroomauth = require("./middleware/Showroomowner_midlleware");
const driverauthmiddleware = require("./middleware/driver_middleware");

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

console.log("Testing remaining auth_router routes...\n");

// Add first 5 routes that work
router.post("/login", loginValidation, Login);
router.post("/register", upload.single("avatar"), registerValidation, Register);
router.get("/getshowroom/:id", authmiddleware, GetSpecificShowroom);
router.get("/users/:id", showroomauth, Getspecificuser);
router.get("/driver/users/:id", driverauthmiddleware, Getspecificuser);

// Now test remaining routes
try {
  console.log("Route 6: DELETE /users/:id");
  router.delete("/users/:id", adminmiddleware, Deletespecificuser);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 7: POST /driverbook/:id");
  router.post("/driverbook/:id", authmiddleware, Bookdriver);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 8: POST /driverlocation");
  router.post("/driverlocation", authmiddleware, GetSpecificlocationdriver);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 9: GET /driverprofile/:id");
  router.get("/driverprofile/:id", authmiddleware, GetSpecificDriver);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 10: GET /usergetallbookings");
  router.get("/usergetallbookings", authmiddleware, GetAllbookings);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 11: DELETE /userdelbooking/:id");
  router.delete("/userdelbooking/:id", authmiddleware, UserdeleteSpecificbooking);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 12: GET /admin/drivers");
  router.get("/admin/drivers", adminmiddleware, GetallDrivers);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 13: GET /admin/driverprofile/:id");
  router.get("/admin/driverprofile/:id", adminmiddleware, GetSpecificDriver);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 14: GET /users");
  router.get("/users", adminmiddleware, Admingetallusers);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 15: GET /admin/users/:id");
  router.get("/admin/users/:id", adminmiddleware, Getspecificuser);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 16: GET /admin/showrooms");
  router.get("/admin/showrooms", adminmiddleware, Getallshowrooms);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 17: GET /admin/showrooms/:id");
  router.get("/admin/showrooms/:id", adminmiddleware, GetSpecificShowroom);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 18: GET /admin/profile");
  router.get("/admin/profile", adminmiddleware, GetAdminprofile);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 19: PUT /resetpassword");
  router.put("/resetpassword", ResetPassword);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 20: POST /sendOTP");
  router.post("/sendOTP", SendOTP);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

try {
  console.log("Route 21: POST /verifyotp");
  router.post("/verifyotp", VerifyOTP);
  console.log("✅ OK\n");
} catch (err) {
  console.log("❌ FAILED:", err.message, "\n");
  process.exit(1);
}

// Now mount it
const app = express();
try {
  console.log("Mounting router to /api/auth...");
  app.use("/api/auth", router);
  console.log("✅ Router mounted successfully!\n");
  console.log("ALL ROUTES PASSED! The error must be in a different router or in how routers are loaded.");
} catch (err) {
  console.log("❌ Router mount FAILED:", err.message, "\n");
  process.exit(1);
}
