const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  Getprofile
} = require("../controllers/showroomowner_controller");
const upload = require("../middleware/multer");
const showroomAuth = require("../middleware/Showroomowner_midlleware");

router.post("/register", upload.single("showroompic"), Register);
router.post("/login", Login);
router.get("/profile", showroomAuth, Getprofile);

module.exports = router;
