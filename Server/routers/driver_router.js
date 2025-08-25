const express = require("express");
const router = express.Router();

const {
  DriverLogin,
  DriverRegister,
  Getallbooking,
  UpdateDriverprofile
} = require("../controllers/Driver_controller");

const upload = require("../middleware/multer");
const adminmiddleware = require("../middleware/admin_middleware");
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

router.get("/driverprofile", Drivermiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/updateprofile", upload.single("profilePhoto"),Drivermiddleware,UpdateDriverprofile);

router.get("/getallbookings", Drivermiddleware, Getallbooking);

module.exports = router;
