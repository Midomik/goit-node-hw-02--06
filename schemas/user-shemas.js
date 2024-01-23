const Joi = require("joi");

const userPostSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = userPostSchema;
