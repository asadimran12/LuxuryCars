const express = require("express");
const router = express.Router();
const {
  getAllCars,
  getCarById,
  searchCar,
  bookingCar,
  Getallbookings,
  GetSpecificbooking,
  ApprovedBooking,
  DeleteBooking,
  Addnewcar,
  DeleteCar
} = require("../controllers/car_controller");
const showroomAuth = require("../middleware/Showroomowner_midlleware");
const authenticate = require("../middleware/auth_middleware");
const upload=require("../middleware/multer")

// router.post("/add", adminmiddleware, addCar);
router.get("/searchcar", searchCar);
router.post("/booking/:id", authenticate, bookingCar);
router.post("/addcar", showroomAuth, upload.single("image"), Addnewcar);
router.delete("/Deletecar/:id", showroomAuth, DeleteCar);
router.get("/carbookings", showroomAuth, Getallbookings);
router.get("/carbookings/:id", showroomAuth, GetSpecificbooking);
router.put("/carbookings/:id", showroomAuth, ApprovedBooking);
router.delete("/carbookings/:id", showroomAuth, DeleteBooking);
router.get("/", getAllCars);
router.get("/:id", getCarById);
// router.put("/:id", showroomAuth, updateCar);
// router.delete("/:id", showroomAuth, deleteCar);

module.exports = router;
