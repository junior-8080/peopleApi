const Joi = require("joi");

module.exports = {
  personSchema: Joi.object({
    name: Joi.string().min(3).max(100),
    email: Joi.string().email().required(),
    phonenumber: Joi.array().required(),
    gender: Joi.string().allow("F", "M", "female", "male"),
    title: Joi.string().allow("miss", "mrs", "dr", "mr"),
    occupation: Joi.string().allow(null).optional(),
    country: Joi.string().allow(null).optional(),
    city: Joi.string().allow(null).optional(),
  }),
};
