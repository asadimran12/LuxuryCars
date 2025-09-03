const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Driver = require("../model/Driver_model");
const Driverbooking = require("../model/Driver_booking_model");

// ===============================
// Driver Login
// ===============================
const DriverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existuser = await Driver.findOne({ email }).select("+password");
    if (!existuser) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const isMatch = await bcrypt.compare(password, existuser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existuser._id, role: "Driver" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token, driver: existuser });
  } catch (error) {
    console.error("Driver login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Driver Register
// ===============================
const DriverRegister = async (req, res) => {
  try {
    const { fullName, email, password, phone, licenseNumber } = req.body;
    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : null;

    const exist = await Driver.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDriver = new Driver({
      fullName,
      email,
      password: hashedPassword,
      phone,
      licenseNumber,
      profilePhoto,
    });

    await newDriver.save();
    res.status(201).json({ message: "Driver registered successfully" });
  } catch (error) {
    console.error("Driver register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Get Driver Profile
// ===============================
const GetDriverProfile = async (req, res) => {
  try {
    const driverId = req.params.id || req.user.id;
    const driver = await Driver.findById(driverId).select("-password");

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json(driver);
  } catch (error) {
    console.error("Get driver profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Get All Bookings for Driver
// ===============================
const GetAllBooking = async (req, res) => {
  try {
    const driverId = req.driver.id;
    const bookings = await Driverbooking.find({ driver: driverId });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Get all booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Update Driver Profile
// ===============================
const UpdateDriverProfile = async (req, res) => {
  try {
    const driverId = req.driver.id;
    const { availabilityStatus } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Handle availability status logic
    if (availabilityStatus === "online" && !driver.onlineAt) {
      driver.onlineAt = new Date();
      driver.availabilityStatus = "online";
    } else if (availabilityStatus === "offline" && driver.onlineAt) {
      const offlineAt = new Date();
      const duration = offlineAt - driver.onlineAt; // in ms
      driver.totalOnlineTime = (driver.totalOnlineTime || 0) + duration;
      driver.onlineAt = null;
      driver.availabilityStatus = "offline";
    }

    await driver.save();
    res
      .status(200)
      .json({ message: "Driver profile updated successfully", driver });
  } catch (error) {
    console.error("Update driver profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Get Completed Rides
// ===============================
const CompletedRides = async (req, res) => {
  try {
    const driverId = req.driver._id;
    const rides = await Driverbooking.find({
      status: "completed",
      driver: driverId,
    });

    res.status(200).json(rides);
  } catch (error) {
    console.error("Completed rides error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  DriverLogin,
  DriverRegister,
  GetDriverProfile,
  GetAllBooking,
  UpdateDriverProfile,
  CompletedRides,
};
