const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const driverSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true },
    nationalID: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },

    profilePhoto: { type: String, default: "" },

    availabilityStatus: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },
    isVerified: { type: Boolean, default: false },
    backgroundCheckStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rating: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },

    lastLogin: { type: Date },
    role: { type: String, enum: ["driver", "admin"], default: "driver" },
  },
  { timestamps: true }
);

// ✅ Use regular function to access "this"
driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Generate JWT token
driverSchema.methods.generateToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = mongoose.model("Driver", driverSchema);
