const express = require("express");
const router = express.Router();

const {
  DriverLogin,
  DriverRegister,
  GetDriverProfile,
  GetAllBooking,
  UpdateDriverProfile,
  CompletedRides,
} = require("../controllers/Driver_controller");

const upload = require("../middleware/multer");
const Drivermiddleware = require("../middleware/driver_middleware");

const {
  driverRegisterValidation,
  loginValidation,
} = require("../middleware/validate_middleware");

router.post("/login", loginValidation, DriverLogin);
router.post(
  "/register",
  upload.single("profilePhoto"),
  driverRegisterValidation,
  DriverRegister
);

router.get("/driverprofile", Drivermiddleware, GetDriverProfile);

router.put(
  "/updateprofile",
  upload.single("profilePhoto"),
  Drivermiddleware,
  UpdateDriverProfile
);

router.get("/getallbookings", Drivermiddleware, GetAllBooking);
router.get("/getcompletedrides", Drivermiddleware, CompletedRides);

module.exports = router;
