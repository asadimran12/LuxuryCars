const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const carShowroomOwnerSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true },
    password: { type: String, required: true },
    showroomName: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    establishedYear: { type: Number },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    description: { type: String },
    showroompic: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

carShowroomOwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

carShowroomOwnerSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = mongoose.model("Showroomowner", carShowroomOwnerSchema);
