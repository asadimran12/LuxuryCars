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
} = require("../controllers/auth-controller");
const upload = require("../middleware/multer");
const adminmiddleware = require("../middleware/admin_middleware");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/validate_middleware");

router.post("/login", loginValidation, Login);
router.post("/register", upload.single("avatar"), registerValidation, Register);
router.get("/users", adminmiddleware, Admingetallusers);
router.get("/users/:id", adminmiddleware, Getspecificuser);
router.delete("/users/:id", adminmiddleware, Deletespecificuser);

router.put("/resetpassword", ResetPassword);
router.post("/sendOTP", SendOTP);
router.post("/verifyotp", VerifyOTP);

module.exports = router;
