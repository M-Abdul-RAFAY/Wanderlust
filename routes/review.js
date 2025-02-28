const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controller/review.js");
const {
  isLogin,
  validatorForReview,
  isUserForReviews,
} = require("../middleware.js");

router.post(
  "/",
  validatorForReview,
  isLogin,
  wrapAsync(reviewController.createPost)
);

router.delete(
  "/:reviewId",
  isLogin,
  isUserForReviews,
  wrapAsync(reviewController.destroyPost)
);

module.exports = router;
