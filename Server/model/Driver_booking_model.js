const mongoose = require("mongoose");

const driverBookingSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },
    passengerPhone: {
      type: String,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropoffLocation: {
      type: String,
      required: true,
    },
    distance: {
      type: String, // e.g., "10 km"
      required: true,
    },
    duration: {
      type: String, // e.g., "25 min"
      required: true,
    },
    fare: {
      type: Number, // e.g., 500
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DriverBooking", driverBookingSchema);
