const { body } = require("express-validator");

const registerValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("phone").isMobilePhone().withMessage("Valid phone number is required"),
  body("dob")
  .notEmpty()
  .withMessage("Date of birth is required")
  .custom((value) => {
    const date = new Date(value);
    if (isNaN(date)) throw new Error("Invalid date format");
    return true;
  }),

];


const driverRegisterValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full Name is required")
    .isLength({ min: 3 })
    .withMessage("Full Name must be at least 3 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),

  body("licenseNumber")
    .notEmpty()
    .withMessage("License Number is required"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of Birth is required")
    .isDate()
    .withMessage("Date of Birth must be a valid date"),

  body("nationalID")
    .notEmpty()
    .withMessage("National ID is required")
    .isLength({ min: 13, max: 13 })
    .withMessage("National ID must be 13 digits"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
];


const loginValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
  driverRegisterValidation
};
