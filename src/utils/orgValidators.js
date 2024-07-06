const Joi = require("joi");

const createOrganisationSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Organisation name is required",
    "string.empty": "Organisation name cannot be empty",
  }),
  description: Joi.string().optional().messages({
    "string.base": "Valid description is required",
  }),
});

const addUserToOrganisationSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "any.required": "User ID is required",
    "string.empty": "User ID cannot be empty",
    "string.guid": "User ID must be a valid UUID",
  }),
});

module.exports = {
  createOrganisationSchema,
  addUserToOrganisationSchema,
};
