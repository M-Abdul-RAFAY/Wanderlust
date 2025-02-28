const Joi = require("joi");

const joiListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(100).required(),
    location: Joi.string().min(3).max(30).required(),
    image: Joi.object({
      url: Joi.string().uri().required(),
    }).optional(),
    country: Joi.string().min(3).max(30).required(),
    price: Joi.number().min(10).max(19999999999990).required(),
  }).required(),
});
const joiReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    comment: Joi.string().min(2).max(200).required(),
  }).required(),
});

module.exports = { joiListingSchema, joiReviewSchema };
