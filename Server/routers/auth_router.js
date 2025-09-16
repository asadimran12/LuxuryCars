const express = require("express");
const router = express.Router();
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
} = require("../controllers/auth-controller");
const upload = require("../middleware/multer");
const adminmiddleware = require("../middleware/admin_middleware");
const authmiddleware = require("../middleware/auth_middleware");
const showroomauth = require("../middleware/Showroomowner_midlleware");
const driverauthmiddleware = require("../middleware/driver_middleware");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/validate_middleware");

router.post("/login", loginValidation, Login);
router.post("/register", upload.single("avatar"), registerValidation, Register);
router.get("/getshowroom/:id",authmiddleware,GetSpecificShowroom)
router.get("/users/:id", showroomauth, Getspecificuser);
router.get("/driver/users/:id", driverauthmiddleware, Getspecificuser);
router.delete("/users/:id", adminmiddleware, Deletespecificuser);
router.post("/driverbook/:id", authmiddleware, Bookdriver);
router.post("/driverlocation", authmiddleware, GetSpecificlocationdriver);
router.get("/driverprofile/:id", authmiddleware, GetSpecificDriver);

//superadmin get drivers
router.get("/admin/drivers", adminmiddleware, GetallDrivers);
router.get("/admin/driverprofile/:id", adminmiddleware, GetSpecificDriver);

//superadmingetusers
router.get("/users", adminmiddleware, Admingetallusers);
router.get("/admin/users/:id", adminmiddleware, Getspecificuser);

//superadmingetshowrroms
router.get("/admin/showrooms", adminmiddleware, Getallshowrooms);
router.get("/admin/showrooms/:id", adminmiddleware, GetSpecificShowroom);

router.get("/admin/profile", adminmiddleware, GetAdminprofile);

router.put("/resetpassword", ResetPassword);
router.post("/sendOTP", SendOTP);
router.post("/verifyotp", VerifyOTP);

module.exports = router;
