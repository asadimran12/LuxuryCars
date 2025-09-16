const express = require("express");
const router = express.Router();
const Review = require("../model/review_model");
const showroomauth = require("../middleware/Showroomowner_midlleware");
const driverauth = require("../middleware/driver_middleware");
const userauth = require("../middleware/auth_middleware");
const {
  addReviewToCar,
  addReviewToDriver,
  showroomgetallreviews,
  showroomgetspecificreview,
  drivergetallreviews,
  drivergetspecificreviews,
} = require("../controllers/reviews_controller");

router.post("/addreviewtocar/:id", userauth, addReviewToCar);
router.post("/addreviewtodriver/:id", userauth, addReviewToDriver);
router.get("/getallreviews", showroomauth, showroomgetallreviews);
router.get("/getspecificreviews/:id", showroomauth, showroomgetspecificreview);

router.get("/drivergetallreviews", driverauth, drivergetallreviews);
router.get("/getreviewsbydriver/:id", driverauth, drivergetspecificreviews);

module.exports = router;
