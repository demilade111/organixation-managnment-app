const Joi = require('joi');

const getUserSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'any.required': 'User ID is required',
    'string.empty': 'User ID cannot be empty',
    'string.guid': 'User ID must be a valid UUID'
  })
});

module.exports = {
  getUserSchema
};
