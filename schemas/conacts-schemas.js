const Joi = require("joi");
const mongoose = require("mongoose");

const postSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
  ownerId: Joi.string(),
});

module.exports = postSchema;
