const { body } = require("express-validator");

const signinValidator = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password must supply a valid password"),
  body("phone")
    .matches(/^\+20\d{10}$/)
    .withMessage("Phone number must be in the format +201234567890"),
];

module.exports = {
  signinValidator,
};
