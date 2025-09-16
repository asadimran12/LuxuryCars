const { validationResult } = require("express-validator");
const Showroomowner = require("../model/Showroomowner_model");
const Booking = require("../model/booking_model");
const User_model = require("../model/auth_model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    ownerName,
    password,
    showroomName,
    location,
    contactNumber,
    email,
    establishedYear,
    description,
  } = req.body;

  const showroompic = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const existingOwner = await Showroomowner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Showroom owner already exists" });
    }

    const newOwner = new Showroomowner({
      ownerName,
      password,
      showroomName,
      location,
      contactNumber,
      email,
      establishedYear,
      description,
      showroompic,
    });
    await newOwner.save();

    res.status(201).json({ message: "Showroom owner registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingOwner = await Showroomowner.findOne({ email });
    if (!existingOwner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, existingOwner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = existingOwner.generateToken();

    res.status(200).json({
      message: "Login successful",
      owner: existingOwner.ownerName,
      showroom: existingOwner.showroomName,
      token,
      role: "showroomowner",
      _id: existingOwner._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Getprofile = async (req, res) => {
  try {
    const owner = await Showroomowner.findById(req.showroom.id).select(
      "-password"
    ); // exclude password
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  Register,
  Login,
  Getprofile,
};
