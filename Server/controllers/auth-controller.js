const { validationResult } = require("express-validator");
const User = require("../model/auth_model");
const OTP_model = require("../model/OTP_model");
const Driver = require("../model/Driver_model");
const Driverbook_model = require("../model/Driver_booking_model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const Login = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { email, password } = req.body;
    const existuser = await User.findOne({ email }).select("+password");

    if (!existuser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existuser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = existuser.generatetoken();

    res.status(200).json({
      message: "Login successful",
      user: {
        username: existuser.username,
        email: existuser.email,
        role: existuser.role,
        id: existuser._id,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const Register = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { username, email, password, phone, dob, address } = req.body;

    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    // ✅ Create new user
    const newUser = new User({
      username,
      email,
      password,
      phone,
      dob,
      address,
      avatar,
    });

    await newUser.save();
    const token = newUser.generatetoken(); // make sure this function exists in your model

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send Welcome Email
    await transporter.sendMail({
      from: `"Luxury Cars" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: " Welcome to Luxury Cars!",
      html: `
        <div style="font-family:Arial, sans-serif; padding:20px; background:#f8f9fa;">
          <h2 style="color:#333;">Welcome ${username}!</h2>
          <p>
            Thank you for joining <b>Luxury Cars</b>.  
            We’re excited to provide you with the <b>best luxury cars</b> and premium service.
          </p>
          <p>
            Explore our collection and enjoy your journey in style ✨
          </p>
         
          <hr/>
          <p style="font-size:12px; color:#666;">
            © ${new Date().getFullYear()} Luxury Cars. All Rights Reserved.
          </p>
        </div>
      `,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        dob: newUser.dob,
        address: newUser.address,
        avatar: newUser.avatar,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const Admingetallusers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users) {
      return res.status(401).json({ message: "Users not found" });
    }

    const userrole = users.filter((user) => user.role === "user");

    return res.status(201).json({ userrole });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const Getspecificuser = async (req, res) => {
  try {
    const finduser = await User.findById(req.params.id);
    if (!finduser) {
      return res.status(401).json({ message: "Users not found" });
    }
    return res.status(201).json({ finduser });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const Deletespecificuser = async (req, res) => {
  try {
    const finduser = await User.findByIdAndDelete(req.params.id);

    if (!finduser) {
      return res.status(201).json("User not Deleted ");
    }

    return res.status(201).json("User Deleted Succesfully");
  } catch (error) {
    return res.status(500).json({ error });
  }
};

/* ======================
   PASSWORD RESET FLOW
====================== */

// 1️⃣ Send OTP
const SendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!(await User.findOne({ email }))) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP_model.create({
      email,
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins expiry
      isUsed: false,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"LuxuryCars" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otpCode}`,
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Verify OTP
const VerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP_model.findOne({ code: otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP_model.deleteOne({ code: otp });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.updateOne({ email }, { isVerified: true });

    await OTP_model.deleteOne({ code: otp });

    return res.status(200).json({
      message: "OTP verified successfully",
      email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const Bookdriver = async (req, res) => {
  try {
    const driver = req.params.id;

    const {
      passengerName,
      passengerPhone,
      pickupLocation,
      dropoffLocation,
      distance,
      duration,
      fare,
      bookingDate,
    } = req.body;

    if (
      !passengerName ||
      !passengerPhone ||
      !pickupLocation ||
      !dropoffLocation ||
      !distance ||
      !duration ||
      !fare
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Optional: check for duplicate booking
    const existingBooking = await Driverbook_model.findOne({
      passengerPhone,
      pickupLocation,
      dropoffLocation,
      bookingDate,
    });

    if (existingBooking) {
      return res
        .status(409)
        .json({ message: "You already have a booking at this time." });
    }

    // Create new booking with default status and paymentStatus
    const newBooking = new Driverbook_model({
      driver,
      passengerName,
      passengerPhone,
      pickupLocation,
      dropoffLocation,
      distance,
      duration,
      fare,
      status: "pending", // default
      paymentStatus: "pending", // default
      bookingDate: bookingDate || Date.now(),
    });

    await newBooking.save();

    return res
      .status(201)
      .json({ message: "Booking created successfully", newBooking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const GetSpecificlocationdriver = async (req, res) => {
  try {
    const { currentlocation } = req.body;

    console.log(currentlocation);

    if (!currentlocation || currentlocation.trim() === "") {
      return res.status(400).json({ message: "Location is required" });
    }
    // Find drivers online in that location
    const drivers = await Driver.find({
      currentlocation,
      availabilityStatus: "online",
    });

    if (drivers.length === 0) {
      return res
        .status(404)
        .json({ message: "No driver is present at this location" });
    }

    return res.status(200).json(drivers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const GetSpecificDriver = async (req, res) => {
  try {
    const driverid = req.params.id;

    const existdriver = await Driver.findById(driverid).select("-password");

    if (!existdriver) {
      return res.status(404).json({ message: "No driver found" });
    }

    // 👇 wrap the response
    return res.status(200).json({ driver: existdriver });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
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
};
