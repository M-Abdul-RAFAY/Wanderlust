const Listing = require("../model/listing");
const Review = require("../model/review");

module.exports.createPost = async (req, res) => {
  const listingData = await Listing.findById(req.params.id);
  const reviewData = await Review(req.body.review);
  reviewData.author = req.user._id;
  await listingData.review.push(reviewData);
  await listingData.save();
  await reviewData.save();
  req.flash("success", "Review have been posted");
  res.redirect(`/listing/${listingData._id}`);
};

module.exports.destroyPost = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: { review: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review have been deleted");
  res.status(200).redirect(`/listing/${id}`);
};
