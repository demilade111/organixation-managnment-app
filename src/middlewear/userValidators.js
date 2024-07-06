const { check } = require("express-validator");

const getUserValidation = [
  check("id").isUUID().withMessage("Valid user ID is required"),
];

module.exports = {
  getUserValidation,
};
