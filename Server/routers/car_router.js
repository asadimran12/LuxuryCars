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
const adminmiddleware = require("../middleware/admin_middleware");
const authenticate = require("../middleware/auth_middleware");
const upload=require("../middleware/multer")

// router.post("/add", adminmiddleware, addCar);
router.get("/searchcar", searchCar);
router.post("/booking/:id", authenticate, bookingCar);
router.post("/addcar", adminmiddleware,upload.single("image"), Addnewcar);
router.delete("/Deletecar/:id", adminmiddleware, DeleteCar);
router.get("/carbookings", adminmiddleware, Getallbookings);
router.get("/carbookings/:id", adminmiddleware, GetSpecificbooking);
router.put("/carbookings/:id", adminmiddleware, ApprovedBooking);
router.delete("/carbookings/:id", adminmiddleware, DeleteBooking);
router.get("/", getAllCars);
router.get("/:id", getCarById);
// router.put("/:id", adminmiddleware, updateCar);
// router.delete("/:id", adminmiddleware, deleteCar);

module.exports = router;
