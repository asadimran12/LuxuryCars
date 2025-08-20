const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Car name is required"],
  },
  brand: {
    type: String,
    required: [true, "Car brand is required"],
  },
  model: {
    type: String,
    required: [true, "Car model is required"],
  },
  year: {
    type: Number,
    required: [true, "Manufacturing year is required"],
  },
  fuelType: {
    type: String,
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    required: true,
  },
  seats: {
    type: Number,
    default: 4,
  },
  pricePerDay: {
    type: Number,
    required: [true, "Price per day is required"],
  },
  availability: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  features: {
    type: [String], 
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Car", carSchema);
