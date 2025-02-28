const Listing = require("./model/listing");
const ExpressError = require("./utils/ExpressError.js");
const { joiListingSchema, joiReviewSchema } = require("./joi.js");
const Review = require("./model/review");

module.exports.isLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.url = req.originalUrl;
    req.flash("error", "First you need to login");
    return res.redirect("/user/login");
  }
  next();
};

module.exports.saveUrl = (req, res, next) => {
  if (req.session.url) {
    res.locals.url = req.session.url;
  }
  next();
};

module.exports.isUser = async (req, res, next) => {
  const { id } = req.params;
  const result = await Listing.findById(id);
  if (!result.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not authorize");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.isUserForReviews = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const result = await Review.findById(reviewId);
  const adminId = "674b07cf6b11346cbe5cb527";
  if (
    !(
      result.author._id.equals(res.locals.currentUser._id) ||
      res.locals.currentUser._id.equals(adminId)
    )
  ) {
    req.flash("error", "You are not authorized");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.validate = (req, res, next) => {
  const { error } = joiListingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(500, error.details[0].message);
  } else {
    next();
  }
};

module.exports.validatorForReview = (req, res, next) => {
  const { error } = joiReviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(500, error.details[0].message);
  } else {
    next();
  }
};
