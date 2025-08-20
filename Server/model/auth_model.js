const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userschema = new Mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    unique: true,
  },
  phone: {
    type: Number,
    unique: true,
  },
  dob: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  avatar: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userschema.methods.generatetoken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

module.exports = Mongoose.model("User", userschema);
