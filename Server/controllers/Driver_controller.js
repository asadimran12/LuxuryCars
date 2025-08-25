const { validationResult } = require("express-validator");
const Driver = require("../model/Driver_model");
const Driverbooking = require("../model/Driver_booking_model");
const OTP_model = require("../model/OTP_model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const DriverLogin = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  try {
    const { email, password } = req.body;
    const existuser = await Driver.findOne({ email }).select("+password");

    if (!existuser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existuser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = existuser.generateToken();

    res.status(200).json({
      message: "Login successful",
      user: {
        fullname: existuser.fullName,
        email: existuser.email,
        role: existuser.role,
      },
      token,
    });
  } catch (error) {}
};

const DriverRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      fullName,
      email,
      password,
      phone,
      licenseNumber,
      dateOfBirth,
      nationalID,
      address,
    } = req.body;

    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ Check if user already exists
    const existUser = await Driver.findOne({ email });
    if (existUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    const newDriver = new Driver({
      fullName,
      email,
      password,
      phone,
      licenseNumber,
      dateOfBirth,
      address,
      nationalID,
      profilePhoto,
    });

    await newDriver.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newDriver._id,
        fullName: newDriver.fullName,
        email: newDriver.email,
        role: newDriver.role,
        createdAt: newDriver.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Getallbooking = async (req, res) => {
  try {
    const getbookings = await Driverbooking.find();
    if (!getbookings) {
      return res.status(409).json({ message: "Bookings not found" });
    }

    res.status(201).json({
      getbookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateDriverprofile = async (req, res) => {
  try {
    const driverId = req.user.id;

    const {
      fullName,
      email,
      phone,
      licenseNumber,
      nationalID,
      dateOfBirth,
      address,
      availabilityStatus,
    } = req.body;

    // Build update object dynamically
    const updateFields = {
      ...(fullName && { fullName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(licenseNumber && { licenseNumber }),
      ...(nationalID && { nationalID }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(address && { address }),
      ...(availabilityStatus && { availabilityStatus }),
    };

    // ✅ handle avatar if file uploaded
    if (req.file) {
      updateFields.profilePhoto = `/uploads/${req.file.filename}`;
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      { $set: updateFields },
      { new: true } // return updated doc
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({
      message: "Driver profile updated successfully",
      driver: updatedDriver,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  DriverLogin,
  DriverRegister,
  Getallbooking,
  UpdateDriverprofile,
};
