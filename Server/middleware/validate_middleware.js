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

const loginValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
};
