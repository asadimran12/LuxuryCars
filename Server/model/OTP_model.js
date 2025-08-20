const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
  isUsed: { type: Boolean, default: false }
});

module.exports = mongoose.model("OTP", otpSchema);
